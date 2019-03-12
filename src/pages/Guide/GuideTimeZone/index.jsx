import React from 'react';
import { Select, Button } from 'antd';
import {getTimezones} from '~/assets/common/timezone';

import './timezone.scss';

const MODULE = 'guidetimezone';
const Option = Select.Option;

export default class TimeZone extends React.Component {
    constructor(props) {
        super(props);
        console.log(getTimezones());
        this.children = getTimezones().map(item => {
            return <Option value={item[0]}>{item[1]}</Option>
        });
    }

    state = {
        timezone: '',
        loading: false,
    };

    onChange = value => {
        this.setState({timezone: value});
    }

    nextStep = async() => {
        let data = {
            time: {
                enable: '1',
                timezone: this.state.timezone,
            }
        };

        this.setState({loading: true});
        let response = await common.fetchApi(
            {
                opcode: 'TIME_SET',
                data: data,
            },
        );
        this.setState({loading: false});
        
        const {errcode} = response;
        if (0 === errcode) {
            const {match} = this.props;
            this.props.history.push("/guide/setwan");
        }
    }

    getTimezone = () => {
        let time = new Date();                                          //获取本机时间，计算本机时区
        let localOffset = time.getTimezoneOffset();                     //时区偏移量，单位分钟
        let hour = Math.abs(parseInt(localOffset/60)).toString();       //时区偏移量，小时的部分
        let minute = Math.abs(parseInt(localOffset%60)).toString();     //时区偏移量，分钟的部分

        let timezone = '';
        if (0 !== localOffset ) {             //构建主机时区的格式，如 'GMT-03:30'、'GMT'、'GMT+04:30'
            if (localOffset < 0) {            //偏移量小于0，则处于东时区
                if (1 === hour.length) {
                    hour = '+0' + hour;
                }

                if (2 === hour.length) {
                    hour = '+' + hour;
                }
            }

            if (localOffset > 0) {          //偏移量大于0，则处于西时区
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

        this.setState({
            timezone: timezone,
        });
    }

    componentDidMount() {
        this.getTimezone();
    }

    render() {
        const { timezone, loading } = this.state;
        console.log(this.children);
        return (
            <div className='guide-timezone'>
                <h2>{intl.get(MODULE, 0)/*_i18n:设置时区*/}</h2>
                <p className="ui-tips guide-tip">{intl.get(MODULE, 1)/*_i18n:请选择您所在的时区，时间将自动同步*/}</p>
                <div className='content'>
                    <span>{intl.get(MODULE, 2)/*_i18n:时区*/}</span>
                    <Select defaultActiveFirstOption={false} style={{width: 400, marginLeft: 12}} value={timezone} onChange={this.onChange}>
                        {this.children}
                    </Select>
                    <div>
                        <Button type='primary' className='btn' loading={loading} onClick={this.nextStep} >{intl.get(MODULE, 3)/*_i18n:设置时区*/}</Button>
                    </div>   
                </div>
            </div>
        );
    }
}