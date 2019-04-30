import React from 'react';
import Button from 'h5/components/Button';
import CustomModal from 'h5/components/Modal';

import './finish.scss';

const MODULE = 'h5finish';

export default class Finish extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        devid: '',
        mac: '',
        location: '',
        visible: false,
    }

    goHome = () => {
        this.props.history.push('/home');
    };

    addMore = () => {
        this.props.history.push('/guide/addsubrouter');
    }

    getApInfo = async() => {
        let response = await common.fetchApi({opcode: 'ROUTE_GET'});
        const {errcode, data } = response;
        if (0 === errcode) {
            let devices = data[0].result.sonconnect.devices || [];
            let ap = {devid: '', mac: '', location: ''};
            devices.map(item => {
                if('1' === item.role) {
                    ap.devid = item.devid;
                    ap.mac = item.mac;
                    ap.location = item.location;
                }
            });
            
            this.setState({
                devid: ap.devid,
                mac: ap.mac,
                location: ap.location,
            });
        }
    }

    addLocation = () => {
        this.setState({
            visible: true,
        });
    }

    inputOnChange = (e) => {
        this.setState({location: e.target.value});
    }

    cancel = () => {
        this.setState({
            visible: false,
        });
    }

    sure = async() => {
        let { mac, devid, location } = this.state;
        
        if ('' === location) {
            location = devid;
        }
        let data = {sonconnect:[]};
        data.sonconnect.push({devid: devid, mac: mac, location: location});

        let response = await common.fetchApi(
            {
                opcode: 'ROUTENAME_SET',
                data: data
            }
        );

        let {errcode} = response;
        if (0 === errcode) {
            this.setState({
                visible: false,
            });
        }
    }

    componentDidMount() {
        this.getApInfo();
    }

    render() {
        const { devid, location,visible } = this.state;
        let data = { hostSsid: '', guestSsid: '', hostPassword: '', guestPassword: '', guestDisplay: 'none' };

        const params = this.props.match.params;
        if (params && params.wifi) {
            const wifi = JSON.parse(decodeURIComponent(params.wifi));

            data = {
                hostSsid: wifi.hostSsid,
                guestSsid: wifi.guestSsid,
                hostPassword: wifi.hostPassword,
                guestPassword: wifi.guestPassword,
                guestDisplay: wifi.guestDisplay,
            };
        }

        return ([
            <div className='h5finish'>
                <div className='icon-success'></div>
                <p className='finish-tip'>路由器设置成功</p>
                <div className='deviceInfo'>
                    <div className='left'>
                        <div className='deviceImg'></div>
                        <span className='title-left'>{devid}</span>
                    </div>
                    <div className='right'>
                        <span className='title-right'>备注<div className='addApLocation' onClick={this.addLocation}></div></span>    
                    </div>
                </div>
                <div>
                    <p className='wifi-title'>商户Wi-Fi</p>
                    <div className='wifi-content'>
                        <div className='wifi-ssid'>
                            <span className='wifi-left'>商户Wi-iFi名称</span>
                            <span className='wifi-right'>{data.hostSsid}</span>
                        </div>
                        <div className='wifi-pwd'>
                            <span className='wifi-left'>商户Wi-Fi密码</span>
                            <span className='wifi-right'>{data.hostPassword}</span>
                        </div>
                    </div>
                </div>
                {'block' === data.guestDisplay &&
                <div>
                    <p className='wifi-title'>客用Wi-Fi</p>
                    <div className='wifi-content'>
                        <div className='wifi-ssid'>
                            <span className='wifi-left'>客用Wi-Fi名称</span>
                            <span className='wifi-right'>{data.guestSsid}</span>
                        </div>
                        <div className='wifi-pwd'>
                            <span className='wifi-left'>客用Wi-Fi密码</span>
                            <span className='wifi-right'>{data.guestPassword}</span>
                        </div>
                    </div>
                </div>
                }
            </div>,
            <div className='foot'>
                <Button type='primary' className='goHome' onClick={this.goHome} >完成</Button>
                <Button type='primary' className='addMore' onClick={this.addMore} >添加更多路由器</Button>
            </div>,
            <CustomModal
                className='locationModal'
                visible={visible}
                footer={null}
                >
                <div className='Content'>
                    <div className='Title'>备注</div>
                    <input placeholder='请输入备注信息' className='input' onChange={this.inputOnChange} value={location} />
                </div>
                <div className='Footer'>
                    <div className='footerButton cancel' onClick={this.cancel}>取消</div>
                    <div className='footerButton sure' onClick={this.sure}>确定</div>
                </div>
            </CustomModal>
        ]);
    }
}