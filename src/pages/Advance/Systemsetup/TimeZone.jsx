import React from 'react';
import { Radio, Select, Button } from 'antd';
import moment from 'moment';
import {getTimezones} from '~/assets/common/timezone';
import './timezone.scss';
import SubLayout from '~/components/SubLayout';
const MODULE = 'timezone';

const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class TimeZone extends React.Component {
    constructor(props) {
        super(props);
        this.children = getTimezones().map(item => {
            return <Option value={item[0]}>{item[1]}</Option>
        });
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
                    hostTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                });
            }, 1000);
        } else {
            this.setState({
                hostTime: '',
            });
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
            let timezone = 'GMT' + moment().format("Z");                    //获取时区信息
            let time = moment().format("YYYY-MM-DD HH:mm:ss");              //获取本机时间

            data = {
                time: {
                    enable: enable,
                    time: time,
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

        let {errcode} = response;
        if (0 === errcode) {
            this.getTime();
        }
        this.setState({loading: false});
    };

    getTime = async() => {
        clearInterval(this.systemTimeCounter);
        clearInterval(this.hostTimeCounter);
        clearInterval(this.addSelfTime);
        let response = await common.fetchApi({ opcode: 'TIME_GET'});
        let {errcode, data} = response;

        if (0 === errcode) {
            let { timezone, enable, time } = data[0].result.time;
            timezone = timezone || 'GMT';
            time = moment(time).valueOf();

            this.setState({
                enable: enable,
                timezone: timezone,
                systemTime: time,
            });

            this.addSelfTime = setInterval(() => {            //定时器显示系统时间，1秒自加一次
                time = time + 1000;
                this.setState({
                    systemTime: time,
                });
            },1000);

            this.systemTimeCounter = setInterval(async() => {                   //定时器5秒获取一次系统时间
                let resp = await common.fetchApi({ opcode: 'TIME_GET'});

                let {errcode, data} = resp;
                if (0 === errcode) {
                    clearInterval(this.addSelfTime);

                    let time = moment(data[0].result.time.time).valueOf();
                    this.setState({
                        systemTime: time,
                    });

                    this.addSelfTime = setInterval(() => {                      //定时器显示系统时间，1秒自加一次
                        time = time + 1000;
                        this.setState({
                            systemTime: time,
                        });
                    },1000);
                }
            }, 5000);

            if ('0' === enable) {                            //获取本机时间的情况
                this.hostTimeCounter = setInterval(() => {
                    this.setState({
                        hostTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                    });
                }, 1000);
            }
        }
    };

    componentDidMount() {
        this.getTime();
    }

    componentWillUnmount() {                    //组件卸载，清除所有定时器
        clearInterval(this.hostTimeCounter);
        clearInterval(this.systemTimeCounter);
        clearInterval(this.addSelfTime);
    }

    render() {
        let { systemTime, enable, timezone, loading, hostTime } = this.state;
        systemTime = moment(systemTime).format("YYYY-MM-DD HH:mm:ss");

        return (
            <SubLayout className="settings">
            <div className="time-zone">
                <p className="current-system-time">
                    {intl.get(MODULE, 0)/*_i18n:当前系统时间：*/}<span>{systemTime}</span>
                </p>
                <div className="system-time-choose">
                    <p className="title">{intl.get(MODULE, 1)/*_i18n:系统时间获取方式*/}</p>
                    <RadioGroup onChange={this.onTypeChange} value={enable}>
                        <Radio value='1'>{intl.get(MODULE, 2)/*_i18n:通过网络获取（推荐）*/}</Radio>
                        <Radio value='0'>{intl.get(MODULE, 3)/*_i18n:获取本机时间*/}</Radio>
                    </RadioGroup>
                </div>
                {
                    '1' === enable  ?
                        <div className="item">
                            <Select defaultActiveFirstOption={false} style={{width: 460}} value={timezone} onChange={this.onChange}>
                                {this.children}
                            </Select>
                        </div> :
                        <div className="item">
                            <p className=''>{intl.get(MODULE, 4)/*_i18n:当前本机时间：*/}{hostTime}</p>
                        </div>
                }
                <div className="btn">
                    <Button type="primary" style={{width:116}} onClick={this.onSave} loading={loading}>{intl.get(MODULE, 5)/*_i18n:保存*/}</Button>
                </div>
            </div>
            </SubLayout>
        );
    }
}