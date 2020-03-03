import React from 'react';
import { Base64 } from 'js-base64';
import { Select, message } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import { checkSameNet } from '~/assets/common/check';
import ModalLoading from '~/components/ModalLoading';
import Static from './Static';
import Dhcp from './Dhcp';
import PPPoE from './PPPoE';

import './networkTemple.scss';

const MODULE = 'network';

const Option = Select.Option;

export default class NetworkTemple extends React.Component {
    constructor(props) {
        super(props);
        this.reshStatus = true;
        this.DIAL_TYPE = {
            'dhcp': intl.get(MODULE, 16)/*_i18n:自动获取IP（DHCP）*/,
            'pppoe': intl.get(MODULE, 17)/*_i18n:宽带拨号上网（PPPoE）*/,
            'static': intl.get(MODULE, 18)/*_i18n:手动输入IP（静态IP）*/,
        };
        
        this.ERR = {
            '-1001' : intl.get(MODULE, 0)/*_i18n:参数非法*/ ,
            '-1002' : intl.get(MODULE, 1)/*_i18n:数据值不符合要求*/,
            '-1061' : intl.get(MODULE, 2)/*_i18n:WAN口IP地址与局域网IP地址冲突*/
        };
    }
    state = {
        type : 'dhcp',
        dhcp: {
            dns1: ['', '', '', ''],
            dns2: ['', '', '', ''],
            down: '1000',
            up: '1000',
            mtu: '1500', 
        },
        staticIP: {
            down:  '1000',
            up: '1000',
            gateway: ['', '', '', ''],
            mask: ['', '', '', ''],
            ipv4: ['', '', '', ''],
            dns1: ['', '', '', ''],
            dns2: ['', '', '', ''],
            mtu: '1500'
        },
        pppoe: {
            dns1: ['', '', '', ''],
            dns2: ['', '', '', ''],
            down: '1000',
            up: '1000',
            username: '',
            password: '',
            mtu: '1492',
            service: '',
        },
        info: {},
        wansLen: 0,
        pppoeLoading: false,
        dhcpLoading: false,
        staticLoading: false,
        visibile: false,
    };

    onTypeChange = value => {
        this.setState({
            type : value,
        })
    }

    onChange = (value, key, name) => {
        const {pppoe, staticIP, dhcp} = this.state;
        const field = {
            'pppoe': pppoe,
            'staticIP': staticIP,
            'dhcp': dhcp,
        }
        let substitute = field[name];
        substitute[key] = typeof value == 'object' ? [...value] : value;
        this.setState({
            [name]: substitute
        })
    }

    setWanInfo = async() => {
        // clearInterval(this.refreshWanInfo);
        const {port, wanNum} = this.props;
        const portStr = `${port}`;
        const { type, dhcp, pppoe, staticIP, wansLen } = this.state;
        const field = {
            'dhcp': {
                port: portStr,
                dial_type: type,
                dns_info: {
                    dns1: (dhcp.dns1).every(item => item === '')? '': (dhcp.dns1).join('.'),
                    dns2: (dhcp.dns2).every(item => item === '')? '': (dhcp.dns2).join('.'),
                },
                bandwidth: {
                    up: dhcp.up,
                    down: dhcp.down,
                },
                mtu: dhcp.mtu,
                loading: 'dhcpLoading',
            },
            'pppoe': {
                port: portStr,
                dial_type: type,
                user_info: {
                    username: Base64.encode(pppoe.username),
                    password: Base64.encode(pppoe.password),
                },
                dns_info: {
                    dns1: (pppoe.dns1).every(item => item === '')? '': (pppoe.dns1).join('.'),
                    dns2: (pppoe.dns2).every(item => item === '')? '': (pppoe.dns2).join('.'),
                },
                bandwidth: {
                    up: pppoe.up,
                    down: pppoe.down,
                },
                mtu: pppoe.mtu,
                service: pppoe.service,
                loading: 'pppoeLoading',
            },
            'static': {
                port: portStr,
                dial_type: type,
                info: {
                    ipv4: (staticIP.ipv4).join('.'),
                    mask: (staticIP.mask).join('.'),
                    gateway: (staticIP.gateway).join('.'),
                    dns1: (staticIP.dns1).every(item => item === '')? '': (staticIP.dns1).join('.'),
                    dns2: (staticIP.dns2).every(item => item === '')? '': (staticIP.dns2).join('.'),
                },
                bandwidth: {
                    up: staticIP.up,
                    down: staticIP.down,
                },
                mtu: staticIP.mtu,
                loading: 'staticLoading',
            }
        };
        const wanInfo = field[type];
        this.setState({
            [field[type].loading]: true,
            visibile: true,
        });

        if(type === 'static' && ((staticIP.ipv4).join('.') === (staticIP.gateway).join('.'))){
            this.setState({
                [field[type].loading]: false,
            });
            message.error(intl.get(MODULE, 37)/*_i18n:IP地址与默认网关不能相同*/);   
            return ;
        }

        if(type === 'static' && (!checkSameNet(staticIP.ipv4,staticIP.gateway,staticIP.mask))){ 
            this.setState({
                [field[type].loading]: false,
            });
            message.error(intl.get(MODULE, 34)/*_i18n:IP地址与默认网关需在同一网段*/);
            return ;
        }
        
        if(wansLen > wanNum && port !== 1) {
			const len = wansLen - wanNum;
			const ports = [];
			for(let i = 0; i < len; i++){
				ports.push(`${wansLen + 1 - i}`);
			}
            await common.fetchApi(
				{
					opcode : 'NETWORK_MULTI_WAN_RESET',
					data: { ports }
				}
			);
		}
        const response = await common.fetchApi(
            {
                opcode : 'NETWORK_MULTI_WAN_SET',
                data: {wan: wanInfo}
            }
        );
        const {errcode} = response;
        if (errcode === 0) {
            message.success(intl.get(MODULE, 15)/*_i18n:设置成功*/)
            this.getWanInfo();
        } 
        this.setState({
            [field[type].loading]: false,
            visibile: false,
        }); 
    }

    getWanInfo = async() => {
        const { port } = this.props;
        const response = await common.fetchApi(
            { opcode : 'NETWORK_MULTI_WAN_GET'}
        );
        const { data, errcode } = response;
        if(errcode === 0) {
            if(data[0].result.wans.length >= port) {
                const wanInfo = data[0].result.wans[port-1]|| {};
                const {
                    dhcp: {
                        dns_info: {
                            dns1: dhcpDns1 = '',
                            dns2: dhcpDns2 = '',
                        } = {},
                        bandwidth: {
                            down: dhcpDown = '',
                            up: dhcpUp = '',
                        } = {},
                        mtu: dhcpMtu = '', 
                    } = {},
                    static: {
                        bandwidth: {
                            down:  staticDown= '',
                            up: staticUp = '',
                        } = {},
                        info: {
                            gateway: staticGateway = '',
                            mask: staticMask = '',
                            ipv4: staticIpv4 = '',
                            dns1: staticDns1 = '',
                            dns2: staticDns2 = '',
                        } = {},
                        mtu: staticMtu = ''
                    } = {},
                    pppoe: {
                        dns_info: {
                            dns1: pppoeDns1 = '',
                            dns2: pppoeDns2 = '',
                        } = {},
                        bandwidth: {
                            down: pppoeDown = '',
                            up: pppoeUp = '',
                        } = {},
                        user_info: {
                            username: pppoeUsername = '',
                            password: pppoePassword = '',
                        } = {},
                        mtu: pppoeMtu = '',
                        service: pppoeService = '',
                    } = {}, 
                    info = {},
                    dial_type = '',
                } = wanInfo;
                this.setState({
                    dhcp: {
                        dns1: dhcpDns1 === ''? ['','','',''] : dhcpDns1.split('.'),
                        dns2: dhcpDns2 === ''? ['','','',''] : dhcpDns2.split('.'),
                        down: dhcpDown,
                        up: dhcpUp,
                        mtu: dhcpMtu, 
                    },
                    staticIP: {
                        down:  staticDown,
                        up: staticUp,
                        gateway: staticGateway === ''? ['','','',''] : staticGateway.split('.'),
                        mask: staticMask === ''? ['','','',''] : staticMask.split('.'),
                        ipv4: staticIpv4 === ''? ['','','',''] : staticIpv4.split('.'),
                        dns1: staticDns1 === ''? ['','','',''] : staticDns1.split('.'),
                        dns2: staticDns2 === ''? ['','','',''] : staticDns2.split('.'),
                        mtu: staticMtu
                    },
                    pppoe: {
                        dns1: pppoeDns1 === ''? ['','','',''] : pppoeDns1.split('.'),
                        dns2: pppoeDns2 === ''? ['','','',''] : pppoeDns2.split('.'),
                        down: pppoeDown,
                        up: pppoeUp,
                        username: Base64.decode(pppoeUsername),
                        password: Base64.decode(pppoePassword),
                        mtu: pppoeMtu,
                        service: pppoeService,
                    },
                    info: {dial_type: dial_type, ...info},
                    wansLen: data[0].result.wans.length - 1,
                });
                if(this.props.parent) {
                    this.props.parent.refreshWanNum(data[0].result.wans.length - 1);
                }

                return dial_type;
            }
            
        }
    }

    async componentDidMount(){
        const type = await this.getWanInfo() || 'dhcp';
        this.setState({
            type
        });
    }

    render(){
        const { port, refreshInfo = {} } = this.props;

        const { dhcp, staticIP, pppoe, type, pppoeLoading, dhcpLoading, staticLoading, visibile } = this.state;
        const {
            online = false,
            dial_type = '',
            ipv4 = '',
            mask = '',
            gateway = '',
            dns1 = '',
            dns2 = '',
            isp = '',
        } = refreshInfo;
        const infoList = [
            [
                {
                    label: intl.get(MODULE, 22)/*_i18n:联网状态：*/,
                    content: online ? intl.get(MODULE, 19)/*_i18n:已联网*/ : intl.get(MODULE, 20)/*_i18n:未联网*/,
                    // content: online ? `${intl.get(MODULE, 19)/*_i18n:已联网*/}（${isp}）` : intl.get(MODULE, 20)/*_i18n:未联网*/,
                },
                {
                    label: intl.get(MODULE, 23)/*_i18n:上网方式：*/,
                    content: this.DIAL_TYPE[dial_type],
                },
            ],
            [
                {
                    label: intl.get(MODULE, 24)/*_i18n:IP地址：*/,
                    content: ipv4,
                },
                {
                    label: intl.get(MODULE, 25)/*_i18n:子网掩码：*/,
                    content: mask,
                },
            ],
            [
                {
                    label: intl.get(MODULE, 26)/*_i18n:默认网关：*/,
                    content: gateway,
                },
                {
                    label: intl.get(MODULE, 49)/*_i18n:域名服务器(DNS)：*/,
                    content: [dns1, dns2].filter(val => (val != '' && val != '0.0.0.0')).join(', '),
                },
            ]
        ];
        
        console.log('infoList', dial_type, this.DIAL_TYPE,this.DIAL_TYPE[dial_type]);
        return (
            <React.Fragment>
                <section>
                    <PanelHeader title={intl.get(MODULE, 21)/*_i18n:当前上网信息*/} checkable={false} checked={true} />
                    {
                        infoList.map(item => (
                            <div className='network-info'>
                            {
                                item.map((item, index) => (
                                    <div className={index > 0?'right': ''}>
                                        <span className="ui-mute status">{item.label}</span>
                                        <span>{item.content}</span>
                                    </div>
                                ))
                            }
                            </div> 
                        ))
                    }
                </section>
                <section className="networkTemple-section">
                    <PanelHeader title={intl.get(MODULE, 27)/*_i18n:上网方式*/} checkable={false} checked={true} />
                    <div style={{ padding: 0, marginTop:28, position: 'relative' }} id={`typeArea${port}`}>
                        <label>{intl.get(MODULE, 28)/*_i18n:上网方式*/}</label>
                        <Select value={type} style={{ width: 320, marginBottom: 24}} onChange={this.onTypeChange} getPopupContainer={() => document.getElementById(`typeArea${port}`)}>
                            <Option value='pppoe'>{intl.get(MODULE, 29)/*_i18n:宽带拨号上网（PPPoE）*/}</Option>
                            <Option value='dhcp'>{intl.get(MODULE, 30)/*_i18n:自动获取IP（DHCP）*/}</Option>
                            <Option value='static'>{intl.get(MODULE, 31)/*_i18n:手动输入IP（静态IP）*/}</Option>
                        </Select>
                    </div>
                    {
                        type === 'pppoe'&&<PPPoE
                            pppoe={pppoe}
                            onChange={this.onChange}
                            setWanInfo={this.setWanInfo}
                            buttonLoading={pppoeLoading}
                        />
                    }
                    {   
                        type === 'dhcp'&&<Dhcp
                            dhcp={dhcp}
                            onChange={this.onChange}
                            setWanInfo={this.setWanInfo}
                            buttonLoading={dhcpLoading}
                        />
                    }
                    {
                        type === 'static'&&<Static
                            staticIP={staticIP}
                            onChange={this.onChange}
                            setWanInfo={this.setWanInfo}
                            buttonLoading={staticLoading}
                        />
                    }
                </section>
                <ModalLoading
                    visible={visibile}
                    tip={intl.get(MODULE, 50)/*_i18n:正在配置，请稍后...*/}
                />
            </React.Fragment>
        );
    }
};
