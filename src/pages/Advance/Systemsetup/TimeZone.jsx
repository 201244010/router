import React from 'react';
import { Radio, Select, Button } from 'antd';
import {getNowTimeStr} from '../../../utils';
import timeZones from '../../../assets/common/timezone';
import './timezone.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const children = timeZones.map(item => {
    return <Option value={item[0]}>{item[1]}</Option>
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

        clearInterval(this.hostTimeCounter);
        if ('0' === e.target.value) {             //切换为手动设置时，启动定时器
            this.hostTimeCounter = setInterval(() => {
                this.setState({
                    hostTime: getNowTimeStr(),
                });
            }, 1000);
        }
    };

    dataSet = () => {
        let { timezone, enable } = this.state;
        let data = {};

        if ('1' === enable) {                               //网络自动获取
            data = {
                time: {
                    enable: enable,
                    timezone: timezone,
                }
            };
        }

        if ('0' === enable) {                                               //同步主机时间
            let time = new Date();
            let localOffset = time.getTimezoneOffset();                     //时区偏移量，单位分钟
            let hour = Math.abs(parseInt(localOffset/60)).toString();       //时区偏移量，小时的部分
            let minute = Math.abs(parseInt(localOffset%60)).toString();     //时区偏移量，分钟的部分

            if (0 !== localOffset ) {             //构建主机时区的格式，如 'GMT-03:30'、'GMT'、'GMT+04:30'
                if (localOffset > 0) {
                    if (1 === hour.length) {
                        hour = '+0' + hour;
                    }

                    if (2 === hour.length) {
                        hour = '+' + hour;
                    }
                }

                if (localOffset < 0) {
                    if (1 === hour.length) {
                        hour = '-0' + hour;
                    }

                    if (2 === hour.length) {
                        hour = '-' + hour;
                    }
                }

                if (1 === minute.length) {
                    minute = '0' + minute;
                }

                timezone = 'GMT' + hour + ':' + minute;
            } else {
                timezone = 'GMT';
            }

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
        let data = this.dataSet();

        this.setState({loading: true});
        let response = await common.fetchApi(
            {
                opcode: 'TIME_SET',
                data: data,
            },
        );
        this.setState({loading: false});

        let {errcode} = response;
        if (0 === errcode) {
            this.getTime();
        }
    };

    getTime = async() => {
        clearInterval(this.hostTimeCounter);
        clearInterval(this.addSelfTime);
        let response = await common.fetchApi({ opcode: 'TIME_GET'});
        let {errcode, data} = response;

        if (0 === errcode) {
            let { timezone, enable, time } = data[0].result.time;
            timezone = timezone || 'GMT';
            time = new Date(time);
            let systemTime = time.getTime();

            this.setState({
                enable: enable,
                timezone: timezone,
                systemTime: systemTime,
            });

            this.addSelfTime = setInterval(() => {            //定时器显示系统时间，1秒自加一次
                systemTime = systemTime + 1000;
                this.setState({
                    systemTime: systemTime,
                });
            },1000);

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
        this.getTime();
        this.systemTimeCounter = setInterval(async() => {                   //定时器5秒获取一次系统时间
            let resp = await common.fetchApi({ opcode: 'TIME_GET'});

            let {errcode, data} = resp;
            if (0 === errcode) {
                clearInterval(this.addSelfTime);
                let time = new Date(data[0].result.time.time);
                let systemTime = time.getTime();
                this.setState({
                    systemTime: systemTime,
                });

                this.addSelfTime = setInterval(() => {                      //定时器显示系统时间，1秒自加一次
                    systemTime = systemTime + 1000;
                    this.setState({
                        systemTime: systemTime,
                    });
                },1000);
            }
        }, 5000);
    }

    exchangeTime = time =>{           //显示系统时间，将时间戳转换为格式为 2019-01-17 14:24:05 的时间
        function paddingLeftZero(num) {
            return num < 10 ? `0${num}` : `${num}`;
        }

        let exchange = new Date(time);
        const year = exchange.getFullYear();
        const month = paddingLeftZero(exchange.getMonth() + 1);
        const date = paddingLeftZero(exchange.getDate());
        const hour = paddingLeftZero(exchange.getHours());
        const minute = paddingLeftZero(exchange.getMinutes());
        const second = paddingLeftZero(exchange.getSeconds());

        return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    }

    componentWillUnmount() {                    //组件卸载，清除所有定时器
        clearInterval(this.hostTimeCounter);
        clearInterval(this.systemTimeCounter);
        clearInterval(this.addSelfTime);
    }

    render() {
        let { systemTime, enable, timezone, loading, hostTime } = this.state;
        systemTime = this.exchangeTime(systemTime);

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