import React from 'react';
import classnames from 'classnames';
import { Button, Divider, Popover, Modal, Table, message } from 'antd';
import Loading from '~/components/Loading';

import CustomIcon from '~/components/Icon';

import './clients.scss';

export default class ClientList extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
    }

    showMore = () => {
        this.props.stopRefresh();
        this.setState({
            visible: true
        });
    }

    handleEdit = async (record) => {
        let directive = ('normal' === record.type) ? 'QOS_AC_WHITELIST_ADD' : 'QOS_AC_WHITELIST_DELETE';

        Loading.show({ duration: 5 });
        let response = await common.fetchApi(
            { opcode: directive, data: { white_list: [{ name: record.name, mac: record.mac }] } }
        );

        let { errcode, message } = response;
        if (errcode == 0) {
            this.updateClientsInfo();
            return;
        }

        Modal.error({ title: '操作失败', content: message });
    }

    handleDelete = async (record) => {
        if (this.props.mac === record.mac) {
            message.warning('不能禁止本机上网');
            return;
        }

        Loading.show({ duration: 5 });
        let response = await common.fetchApi(
            { opcode: 'QOS_AC_BLACKLIST_ADD', data: { black_list: [{ name: record.name, mac: record.mac }] } }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.updateClientsInfo();
            return;
        }

        Modal.error({ title: '操作失败', content: message });
    }

    handleCancel = () => {
        this.props.startRefresh();
        this.setState({
            visible: false
        });
    }

    updateClientsInfo = () => {
        // 后台生效需要1秒左右，延迟2秒刷新数据，
        setTimeout(() => {
            this.props.startRefresh(true);
        }, 2000);
    }

    goWhiteList = () => {
        this.props.history.push('/advance/whitelist');
    }

    render() {
        const { visible } = this.state;
        const props = this.props;
        const clients = props.data;
        const total = clients.length;
        const placement = props.placement || 'top';
        const maxConf = {
            'sunmi': 6,
            'normal': 12,
            'whitelist': 12
        };
        const deviceTypeMap = {
            'sunmi': '商米设备',
            'normal': '普通设备',
            'whitelist': '优先设备'
        };

        const deviceType = deviceTypeMap[props.type];
        const max = parseInt(maxConf[props.type], 10);
        const current = (total < max) ? total : max;

        const listItems = clients.map((client, index) => {
            if (index < max) {
                return (
                    <li key={client.mac} className='client-item'>
                        <Popover placement={placement} trigger='click'
                            content={<Item client={client} btnL={this.handleEdit} btnR={this.handleDelete} />} >
                            <div className='icon'><CustomIcon type={client.icon} size={32} /></div>
                        </Popover>
                        <div className='under-desc'><i className={'dot ' + ('较差' == client.rssi ? 'warning' : '')}></i><p title={client.name}>{client.name}</p></div>
                    </li>
                );
            }
        });

        let onlineCols = [{
            dataIndex: 'icon',
            width: 60,
            render: (icon, record) => (
                <CustomIcon type={icon} size={42} />
            )
        }, {
            title: '设备名称',
            width: 160,
            render: (text, record) => (
                <div>
                    <div style={{
                        width: 140,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }} title={record.name}>{record.name}</div>
                    <div><label style={{ marginRight: 3 }}>在线时长:</label><label>{record.ontime}</label></div>
                </div>
            )
        }, {
            title: 'IP/MAC地址',
            width: 180,
            render: (text, record) => (
                <span>
                    <span><label style={{ marginRight: 3 }}>IP:</label><label>{record.ip}</label></span><br />
                    <span><label style={{ marginRight: 3 }}>MAC:</label><label>{record.mac}</label></span>
                </span>
            )
        }, {
            title: '所属网络',
            dataIndex: 'mode',
            width: 80
        }, {
            title: '信号强度',
            dataIndex: 'rssi',
            width: 80,
            render: (rssi, record) => (
                <div><i className={'dot ' + ('较差' == rssi ? 'warning' : '')}></i><span>{rssi}</span></div>
            )
        }, {
            title: '实时速率',
            width: 100,
            render: (text, record) => (
                <div>
                    <div><CustomIcon type="kbyte" color='#779FF8' size={12} /><span style={{ marginLeft: 5 }}>{record.tx}</span></div>
                    <div><CustomIcon type="downloadtraffic" color='#87D068' size={12} /><span style={{ marginLeft: 5 }}>{record.rx}</span></div>
                </div>
            )
        }, {
            title: '流量消耗',
            dataIndex: 'flux',
            width: 100
        }, {
            title: '操作',
            width: 160,
            render: (text, record) => {
                let type = record.type;
                return (
                    <span>
                        {'sunmi' !== type && <a onClick={() => this.handleEdit(record)} href="javascript:;" style={{ color: "#3D76F6" }}>{'whitelist' === record.type ? '解除优先' : '优先上网'}</a>}
                        {'sunmi' !== type && <Divider type="vertical" />}
                        <a onClick={() => this.handleDelete(record)} href="javascript:;" style={{ color: "#BF4C41" }}>禁止上网</a>
                    </span>
                );
            }
        }];

        return (
            <div className={classnames(['list-content', props.type + '-list'])}>
                <div className='list-header'>
                    <Divider type="vertical" className='divider' /><span>{deviceType}</span><span className='statistics'>（{total}）</span>
                    <Button className='more' onClick={this.showMore}>查看全部</Button>
                </div>
                <ul>{listItems}</ul>
                {('sunmi' === props.type && clients.length <= 0) &&
                    <div className='null-tip'>
                        <label>暂无商米设备，</label> <a onClick={() => this.props.startSunmiMesh()} href="javascript:;">一键搜寻商米设备</a>
                    </div>
                }
                {('whitelist' === props.type && clients.length <= 0) &&
                    <div className='null-tip'>
                        <label>暂无优先设备，</label><a onClick={this.goWhiteList} href="javascript:;">添加优先设备</a>
                    </div>
                }
                <Modal title={`${deviceType}（${total}台）`} closable={false} maskClosable={false}
                    width={960} style={{ position: 'relative' }}
                    visible={visible}
                    footer={[
                        <Button key='cancel' onClick={this.handleCancel}>取消</Button>
                    ]}>
                    <Button style={{
                        position: "absolute",
                        top: 10,
                        left: 160,
                        border: 0,
                        padding: 0
                    }} onClick={this.updateClientsInfo}><CustomIcon type="refresh" /></Button>
                    <Table columns={onlineCols} dataSource={clients} rowKey={record => record.mac}
                        style={{ height: 360, overflowY: 'auto' }}
                        className="tab-online-list" bordered size="middle" pagination={false} locale={{ emptyText: "暂无设备" }} />
                </Modal>
            </div>);
    }
}

class Item extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let client = this.props.client;
        let type = client.type;
        let signal = client.rssi;
        let access = client.mode;
        let time = client.ontime;
        let flux = client.flux;
        let up = client.tx;
        let down = client.rx;
        let ip = client.ip;
        let mac = client.mac;
        let info = (
            <ul>
                <li><label>信号强度：</label><span>{signal}</span></li><li><label>接入方式：</label><span>{access}</span></li>
                <li><label>接入时间：</label><span title={time}>{time}</span></li><li><label>流量消耗：</label><span>{flux}</span></li>
                <li><label>上传速度：</label><span>{up}</span></li><li><label>下载速度：</label><span>{down}</span></li>
                <li><label>IP：</label><span>{ip}</span></li><li><label>MAC：</label><span>{mac}</span></li>
            </ul>
        );

        switch (type) {
            case 'sunmi':
                return (
                    <div className='client-info'>
                        <p>{client.name}</p>
                        {info}
                        <div>
                            <Button className='single' onClick={() => this.props.btnR({ name: client.name, mac: client.mac })}>禁止上网</Button>
                        </div>
                    </div>
                );
            case 'whitelist':
                return (
                    <div className='client-info'>
                        <p>{client.name}</p>
                        {info}
                        <div>
                            <Button onClick={() => this.props.btnL({ type: client.type, name: client.name, mac: client.mac })}>解除优先</Button>
                            <Button onClick={() => this.props.btnR({ name: client.name, mac: client.mac })}>禁止上网</Button>
                        </div>
                    </div>);
            case 'normal':
            default:
                return (
                    <div className='client-info'>
                        <p>{client.name}</p>
                        {info}
                        <div>
                            <Button onClick={() => this.props.btnL({ type: client.type, name: client.name, mac: client.mac })}>优先上网</Button>
                            <Button onClick={() => this.props.btnR({ name: client.name, mac: client.mac })}>禁止上网</Button>
                        </div>
                    </div>);
        }
    }
}