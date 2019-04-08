import React from 'react';
import { Select, Button } from 'antd';
import {getTimezones} from '~/assets/common/timezone';

import './timezone.scss';

const MODULE = 'guidetimezone';
const Option = Select.Option;

export default class TimeZone extends React.Component {
    constructor(props) {
        super(props);
        this.jump = false;
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
            if(this.jump) {
                this.props.history.push('/guide/setwifi');
            } else {
                this.props.history.push('/guide/setwan');
            }
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

    dialDetect = async () => {
        // this.setState({ detect: true });
        common.fetchApi(
            [
                {opcode: 'WANWIDGET_WAN_LINKSTATE_GET'}
            ],
        ).then((resp) => {
            const { errcode,data } = resp;
            if(errcode == 0){
                // this.setState({wanLinkState : data[0].result.wan_linkstate.linkstate});
                if(data[0].result.wan_linkstate.linkstate){
                    common.fetchApi(
                        [
                            {opcode: 'WANWIDGET_DIALDETECT_START'}
                        ],
                    ).then(()=>{
                        common.fetchApi(
                            [
                                {opcode: 'WANWIDGET_DIALDETECT_GET'}
                            ],
                            {},
                            {
                                loop : true,
                                interval : 2000,
                                pending : res => res.data[0].result.dialdetect.status === 'detecting',
                                stop : () => this.stop
                            }
                        ).then(async(response) => {
                            const { errcode, data } = response;
                            if(errcode == 0){
                                let { dialdetect } = data[0].result;
                                let { dial_type } = dialdetect;
                                dial_type  = dial_type === 'none' ? 'dhcp' : dial_type;
                                if ('dhcp' === dial_type) {
                                    let result = await common.fetchApi(
                                        [
                                            {
                                                opcode: 'NETWORK_WAN_IPV4_SET',
                                                data: {wan: {dial_type: "dhcp", dns_type: "auto"}}
                                            }
                                        ]
                                    );
                                    let { errcode } = result;
                                    if(errcode == 0){
                                        // 触发检测联网状态
                                        common.fetchApi(
                                            [
                                                {opcode: 'WANWIDGET_ONLINETEST_START'}
                                            ]
                                        ).then( async() =>{
                                            // 获取联网状态
                                            let connectStatus = await common.fetchApi(
                                                [
                                                    {opcode: 'WANWIDGET_ONLINETEST_GET'}
                                                ],
                                                {},
                                                {
                                                    loop : true,
                                                    interval : 3000,
                                                    stop : ()=> this.stop,
                                                    pending : resp => resp.data[0].result.onlinetest.status !== 'ok'
                                                }
                                            );
                                            let { errcode, data } = connectStatus;
                                            if(errcode == 0){
                                                let online = data[0].result.onlinetest.online;
                                                if(online){
                                                    this.jump = true;
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    });
                }
            }
        });
    }

    componentDidMount() {
        this.dialDetect();
        this.getTimezone();
    }

    render() {
        const { timezone, loading } = this.state;
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