
import React from 'react';
import { Button, Icon, message } from 'antd';

import PanelHeader from '~/components/PanelHeader';
import Loading from '~/components/Loading';
import { formatTime } from '~/assets/common/utils';

import style from './status.useable.scss';

export default class Status extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        enable: true,
        visible: true,
        clients: [],
        ssid: '',
    };

    switchChange = async () => {
        let enable = !this.state.enable;

        this.setState({ enable });

        //Loading.show({ duration: 2 });
        this.weixin.enable = enable ? '1' : '0';
        let response = await common.fetchApi({
            opcode: 'AUTH_WEIXIN_CONFIG_SET',
            data: {
                weixin: this.weixin
            }
        });

        let { errcode } = response;
        if (0 == errcode) {
            message.success(`配置生效`);

            if (enable) {
                common.fetchApi({ opcode: 'AUTH_ENABLE_MSG' });
            }
        } else {
            this.setState({ enable: !enable });
            message.error(`配置失败[${errcode}]`);
        }
    }

    async fetchConf() {
        let response = await common.fetchApi([
            { opcode: 'AUTH_WEIXIN_CONFIG_GET' },
            { opcode: 'WIRELESS_GET' },
        ]);

        let { errcode, data } = response;
        if (errcode == 0) {
            const { enable } = data[0].result.weixin;
            const { ssid } = data[1].result.guest;

            this.weixin = data[0].result.weixin;
            this.setState({
                enable: ('1' == enable),
                ssid,
            });
        }
    }

    refreshClients = async () => {
        let response = await common.fetchApi([
            { opcode: 'CLIENT_LIST_GET' },
            { opcode: 'AUTH_CLIENT_LIST' },
        ]);

        let { errcode, data } = response;
        if (0 == errcode) {
            let clients = data[0].result.data;
            let authClient = data[1].result.auth.clientlist;

            this.setState({
                clients: authClient.map(item => {
                    let mac = item.mac.toUpperCase();
                    let client = clients.find(item => item.mac.toUpperCase() === mac) || {
                        ontime: 0,
                        hostname: 'unknown',
                    };

                    return {
                        index: item.index,
                        name: item.hostname || client.hostname,
                        online: client.ontime !== 0,
                        ontime: formatTime(client.ontime),
                        ip: item.ip,
                        mac: mac,
                        auth_type: item.auth_type,
                        phone: item.phone,
                        access_time: item.access_time,
                    };
                }),
            });
        }
    }

    showClients = () => {
        this.setState({
            visible: true,
        });
    }

    reSetup = () => {
        let path = this.props.match.path;
        let parent = path.substr(0, path.lastIndexOf('/'));

        this.props.history.push(`${parent}/setup`);
    }

    componentWillUnmount() {
        style.unuse();
        clearInterval(this.timer);
    }

    componentDidMount() {
        style.use();
        this.fetchConf();
        this.refreshClients();
        this.timer = setInterval(this.refreshClients, 3000);
    }

    render() {
        const { enable, clients, ssid } = this.state;

        return (
            <div className="setup-body wechat-status">
                <div className='setup-content'>
                    <PanelHeader
                        title="微信连Wi-Fi功能"
                        checkable={true}
                        checked={enable}
                        onChange={this.switchChange}
                    />
                    <p className='connect-status'>
                        当前有<span>{clients.length}</span>位用户连接Wi-Fi（
                        <a
                            onClick={this.showClients}
                            href='javascript:;'>接入设备列表</a>）
                    </p>
                    <div className='connect-guide'>
                        <p>您可以通过以下两种方式引导顾客上网</p>
                        <ul>
                            <li>
                                <div className='guide-detail'>
                                    <h4>方式一：扫描二维码连网</h4>
                                    <p>引导顾客使用微信扫描二维码即可上网</p>
                                    <h5>如何获取二维码？</h5>
                                    <ol>
                                        <li>
                                            <p className='step-tip'>1、前往微信公众号平台，进入“微信连Wi-Fi->用户连网方式->扫二维码连网->详情”下载二维码</p>
                                            <i className='qr-img'></i>
                                        </li>
                                        <li>
                                            <p className='step-tip'>2、打印二维码，贴于店内，告知顾客使用微信扫描二维码即可上网</p>
                                        </li>
                                    </ol>
                                </div>
                            </li>
                            <li>
                                <div className='guide-detail'>
                                    <h4>方式二：连接客用Wi-Fi</h4>
                                    <p>引导顾客手动连接客用Wi-Fi，待自动弹出欢迎页后，点击确认按钮即可上网</p>
                                    <div className='wifi-info'>
                                        <label>当前客用Wi-Fi名称：</label><span className='ssid'>{ssid}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <section className="save-area">
                    <Button
                        size="large"
                        onClick={this.reSetup}
                        style={{
                            background: '#F7F7F7'
                        }}
                    >重新设置</Button>
                </section>
            </div>
        );
    }
}
