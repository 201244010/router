import React from 'react';
import { Radio, Select, Button } from 'antd';
import {getNowTimeStr} from '../../../utils';
import timeZones from '../../../assets/common/timezone';
import './TimeZone.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const children = timeZones.map(item => {
    return <Option value={item[1]} key={item[1]}>{item[0]+item[1]}</Option>
});

export default class TimeZone extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        systemTime: '',
        enable: '',
        timezone: '',
        loading: false,
    };

    onChange = value => {
        this.setState({timezone: value});
    }

    onTypeChange = (e) => {
        this.setState({
            enable: e.target.value
        });

        if ('0' === e.target.value) {             //切换为手动设置时，启动定时器
            clearInterval(this.hostTimeCounter);
            this.hostTimeCounter = setInterval(() => {
                this.setState({
                    hostTime: getNowTimeStr(),
                });
            }, 1000);
        } else {
            clearInterval(this.hostTimeCounter);  //切换为网络获取时，删除定时器
        }
    };

    DataSet = () => {
        let { systemTime, timezone, enable } = this.state;
        let data = {};

        if ('1' === enable) {                               //网络自动获取
            let i = 0;                                      //while 循环获取timezone对应的值
            while(timezone !== timeZones[i][1]){
            i++;
            }
            timezone = timeZones[i][0];

            data = {
                time: {
                    enable: enable,
                    timezone: timezone,
                }
            };
        }

        if ('0' === enable){                                    //同步主机时间
            let time = new Date();
            // let localTime = time.getTime();                  //带时区偏移的时间戳，单位毫秒
            let localOffset = time.getTimezoneOffset();         //时区偏移量，单位分钟
            // let utc = localTime + localOffset*60000;         //时间戳
            timezone = 'CST' + (localOffset/60).toString();     //主机的时区

            data = {
                time: {
                    enable: enable,
                    time: getNowTimeStr(),
                    timezone: timezone,
                }
            }
        }

        return data;
    }

    onSave = async() => {
        const data = this.DataSet();

        this.setState({loading: true});
        const response = await common.fetchApi(
            {
                opcode: 'TIME_SET',
                data: data,
            },
        );
        this.setState({loading: false});

        let {errcode} = response;
        if (0 === errcode) {
            this._fetchTimeConfig();
        }
    };

    _fetchTimeConfig = async() => {
        clearInterval(this.systemTimeCounter);
        clearInterval(this.hostTimeCounter);
        const response = await common.fetchApi({ opcode: 'TIME_GET'});
        const {errcode, data} = response;

        if (0 === errcode) {
            let { timezone, enable } = data[0].result.time;

            timezone = timezone || 'CST+8';

            let i = 0;                              //通过while循环转换，获取timezone对应的值
            while(timezone !== timeZones[i][0]){
                i++;
            }
            timezone = timeZones[i][1];

            this.setState({
                enable: enable,
                timezone: timezone,
            });

            this.systemTimeCounter = setInterval(async() => {       //定时器显示系统时间
                const resp = await common.fetchApi({ opcode: 'TIME_GET'});
                const {data} = resp;
                this.setState({
                    systemTime: data[0].result.time.time,
                });
            }, 1000);

            if ('0' === enable) {                            //获取本机时间的情况
                this.hostTimeCounter = setInterval(() => {
                    this.setState({
                        hostTime: getNowTimeStr(),
                    });
                }, 1000);
            }
        }
    };

    componentDidMount() {
        this._fetchTimeConfig();
    }

    componentWillUnmount() {
        clearInterval(this.hostTimeCounter);
        clearInterval(this.systemTimeCounter);
    }

    render() {
        const { systemTime, enable, timezone, loading, hostTime } = this.state;

        return (
            <div className="time-zone">
                <p className="current-system-time">
                    当前系统时间：<span>{systemTime}</span>
                </p>
                <div className="system-time-choose">
                    <p className="title">系统时间获取方式</p>
                    <RadioGroup onChange={this.onTypeChange} value={enable}>
                        <Radio value={'1'}>通过网络获取（推荐）</Radio>
                        <Radio value={'0'}>获取本机时间</Radio>
                    </RadioGroup>
                </div>
                {
                    '1' === enable  ?
                        <div className="item">
                            <Select style={{width: 460}} value={timezone} onChange={this.onChange}>
                                {children}
                            </Select>
                        </div> :
                        <div className="item">
                            <p className=''>当前本机时间：{hostTime}</p>
                        </div>
                }
                <div className="btn">
                    <Button type="primary" style={{width:116}} onClick={this.onSave} loading={loading}>保存</Button>
                </div>
            </div>
        );
    }
}