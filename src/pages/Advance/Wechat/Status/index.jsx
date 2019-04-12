
import React from 'react';
import { Button, Popconfirm, Modal, Table, Icon, message } from 'antd';

import PanelHeader from '~/components/PanelHeader';
import Loading from '~/components/Loading';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';
import { formatTime } from '~/assets/common/utils';
import SubLayout from '~/components/SubLayout';

import style from './status.useable.scss';

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => `已添加${total}台设备`,
};

export default class Status extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        enable: true,
        visible: false,
        refresh: false,
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
                common.fetchApi({ opcode: 'AUTH_ENABLE_MSG', data: { ssid: this.weixin.ssid }});
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

    fetchClients = async (loading) => {
        if (loading) {
            this.setState({
                refresh: true
            }, () => {
                setTimeout(() => {
                    this.setState({ refresh: false });
                }, 1000);
            });
        }

        let response = await common.fetchApi([
            { opcode: 'CLIENT_LIST_GET' },
            { opcode: 'AUTH_CLIENT_LIST' },
            { opcode: 'CLIENT_ALIAS_GET' },
        ]);

        let { errcode, data } = response;
        if (0 == errcode) {
            let clients = {}, onlineList = data[0].result.data;
            let authClient = data[1].result.auth.clientlist;
            let aliaslist = data[2].result.aliaslist;

            onlineList.forEach((client) => {
                let {mac, hostname, ontime} = client;

                mac = client.mac.toUpperCase();
                clients[mac] = {mac, hostname, ontime};
            });

            this.setState({
                clients: authClient.filter(client => {
                    client.mac = client.mac.toUpperCase();  // modify client.mac

                    return (undefined !== clients[client.mac]);
                }).map(item => {
                    let mac = item.mac;
                    const { hostname, ontime } = clients[mac];
                    let alias = aliaslist[mac] && aliaslist[mac].alias;

                    return Object.assign({
                        ontime,
                        online: true,
                        hostname: alias || hostname,
                    }, item);
                }),
            });
        }
    }

    fetchClientsOnce = () => {
        this.fetchClients(true);
    }

    refreshClients = () => {
        this.fetchClients();

        clearInterval(this.timer);
        this.timer = setInterval(this.fetchClients, 3000);
    }

    showClients = () => {
        this.setState({
            visible: true,
        });

        // stop refresh clients
        clearInterval(this.timer);
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });

        // continue refresh clients
        this.refreshClients();
    }

    handleDelete = async (record) => {
        let response = await common.fetchApi(
            {
                opcode: 'AUTH_USER_OFFLINE',
                data: {
                    auth: {
                        offline_list: [{
                            mac: record.mac,
                        }]
                    }
                }
            }, {
                loading: true
            }
        );

        let { errcode } = response;
        if (0 != errcode) {
            message.error(`操作失败[${errcode}]`);
        }

        this.fetchClients();
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
    }

    render() {
        const { enable, visible, refresh, clients, ssid } = this.state;

        const columns = [{
            title: '',
            dataIndex: 'mac',
            width: 60,
            className: 'center',
            render: (mac, record) => (
                <Logo mac={mac} size={32} />
            )
        }, {
            title: '设备名称',
            width: 320,
            render: (text, record) => (
                <div>
                    <div style={{
                        width: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'pre',
                    }} title={record.hostname}>{record.hostname}</div>
                    <i style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        backgroundColor: (record.online ? '#87D068' : '#ADB1B9'),
                        marginRight: '5px',
                        borderRadius: '50%',
                    }}></i>
                    {record.online ? (
                        <span><label>在线时长：</label><label>{formatTime(record.ontime)}</label></span>
                    ) : (
                        <span style={{ color: '#ADB1B9' }}>离线</span>
                    )}
                </div>
            )
        }, {
            title: 'IP/MAC地址',
            width: 220,
            render: (text, record) => (
                <span>
                    {record.online && <div><label style={{ marginRight: 3 }}>IP:</label><label>{record.ip}</label></div>}
                    <div><label style={{ marginRight: 3 }}>MAC:</label><label>{record.mac.toUpperCase()}</label></div>
                </span>
            )
        }, {
            title: '接入时间',
            dataIndex: 'access_time',
            width: 200,
        }, {
            title: '操作',
            width: 94,
            render: (text, record) => (
                <span>
                    <Popconfirm
                        title="确定下线？"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => this.handleDelete(record)}
                    >
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>下线</a>
                    </Popconfirm>
                </span>
            )
        }];

        return (
            <SubLayout className="settings">
            <div className="setup-body wechat-status">
                <div className='setup-content'>
                    <PanelHeader
                        title="微信连Wi-Fi"
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
                    <p className='connect-tip'>您可以通过以下两种方式引导顾客上网</p>
                    <div className='connect-guide'>
                        <ul>
                            <li>
                                <div className='guide-detail'>
                                    <h4>方式一：扫描二维码连网</h4>
                                    <p>引导顾客使用微信扫描二维码即可上网</p>
                                    <h5>如何获取二维码？</h5>
                                    <ol>
                                        <li>
                                            <p className='step-tip'>1、前往微信公众号平台，进入“微信连Wi-Fi->用户连网方式->扫二维码连网->详情”下载二维码</p>
                                            <img className='qr-img' src={require('~/assets/images/dl-qr.png')} />
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
                <Modal
                    title={`接入设备列表（${clients.length}台）`}
                    closable={false}
                    maskClosable={false}
                    centered={true}
                    width={960}
                    style={{ position: 'relative' }}
                    visible={visible}
                    footer={[
                        <Button key='cancel' onClick={this.handleCancel}>取消</Button>
                    ]}>
                    <Button style={{
                        position: "absolute",
                        top: 10,
                        left: 186,
                        border: 0,
                        padding: 0
                    }} onClick={this.fetchClientsOnce}><CustomIcon type="refresh" spin={refresh} /></Button>
                    <Table
                        columns={columns}
                        dataSource={clients}
                        bordered
                        rowKey={record => record.mac}
                        scroll={{ y: 336 }}
                        style={{ minHeight: 360 }}
                        size="middle"
                        pagination={pagination}
                        locale={{ emptyText: "暂无设备" }}
                    />
                </Modal>
                <section className="save">
                    <Button
                        size="large"
                        onClick={this.reSetup}
                        style={{
                            background: '#F7F7F7',
                            height: 42,
                            width: 150,
                        }}
                    >重新设置</Button>
                </section>
            </div>
            </SubLayout>
        );
    }
}
