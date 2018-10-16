import React from 'react';
import { Button, Table, Divider, Popconfirm, Modal, Checkbox } from 'antd';
import CustomIcon from '~/components/Icon';
import PanelHeader from '~/components/PanelHeader';
import { checkMac } from '~/assets/common/check';
import Form from "~/components/Form";

const { FormItem, ErrorTip, InputGroup, Input } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => `已添加${total}台设备`,
};

const iconMap = {
    iphone: 'number',
    android: 'android',
    ipad: 'pad',
    pc: 'computer',
    unknown: 'unknown',
};

export default class Bootdevice extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        disabled: true,
        editLoading: false,
        editShow: false,
        name: '',
        mac: '',
        nameTip: '请输入备注名称',
        macTip: '请输入MAC地址',
        whiteList: [/*{
            icon:'computer',
            name:'xiongmingxiongmingxiongiongiongminxiongmingxiongmingxiongiongiongmin',
            online: true,
            ontime:'3分钟',
            ip:'192.168.100.138',
            mac:'00:11:22:AA:44:88',
            network:'5G Wi-Fi',
        },{
            icon:'computer',
            name:'Hello world',
            online: false,
            ontime:'--',
            ip:'192.168.100.138',
            mac:'00:11:22:AA:44:88',
            network:'5G Wi-Fi',
        }*/],
        onlineList: []
    };

    onChange = (val, key) => {
        let tip = '';

        switch (key) {
            case 'name':
                if (val.length <= 0) {
                    tip = '请输入备注名称';
                }
                break;
            case 'mac':
                if (0 !== checkMac(val)) {
                    tip = 'MAC地址非法，请重新输入';
                }
                break;
        }

        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val),
            [key + 'Tip']: tip,
        }, () => {
            let st = this.state;
            let tip = ['nameTip', 'macTip'];
            let ok = tip.every((tip) => { return '' === st[tip] });
            this.setState({ disabled: !ok });
        });
    }

    selectAdd = () => {
        this.fetchClientsInfo();
        this.setState({
            visible: true
        });
    }

    manualAdd = () => {
        this.setState({
            editShow: true,
            editLoading: false,
            name: '',
            mac: ['', '', '', '', '', '']
        });
    }

    handleDelete = async (record) => {
        let response = await common.fetchWithCode(
            'QOS_AC_WHITELIST_DELETE',
            {
                method: 'POST', data: {
                    white_list: [{
                        index: record.index,
                        name: record.name,
                        mac: record.mac,
                    }]
                }
            }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            const whiteList = [...this.state.whiteList];
            this.setState({ whiteList: whiteList.filter(item => item.index !== record.index) });
            return;
        }

        Modal.error({ title: '删除失败', content: message });
    }

    handleSelect = (mac) => {
        const onlineList = [...this.state.onlineList];
        this.setState({
            onlineList: onlineList.map(item => {
                if (item.mac === mac) {
                    item.checked = !item.checked;
                }

                return item;
            })
        });
    }

    onSelectOk = async () => {
        this.setState({
            loading: true
        });

        let directive = 'QOS_AC_WHITELIST_ADD',
            white_list = this.state.onlineList.filter(item => item.checked).map(item => {
                return {
                    name: item.name,
                    mac: item.mac.toUpperCase()
                };
            });

        let response = await common.fetchWithCode(
            directive, { method: 'POST', data: { white_list: white_list } }
        ).catch(ex => { });

        this.setState({
            loading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            // refresh list
            this.fetchWhiteList();

            this.setState({
                visible: false,
                editShow: false
            })
            return;
        }

        Modal.error({ title: '保存失败', content: message });
    }

    onEditOk = async () => {
        this.setState({
            editLoading: true
        });

        let directive = 'QOS_AC_WHITELIST_ADD';
        let white_list = [{
            mac: this.state.mac.join(':').toUpperCase(),
            name: this.state.name
        }];

        let response = await common.fetchWithCode(directive, { method: 'POST', data: { white_list: white_list } });

        this.setState({
            editLoading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.fetchWhiteList();
            this.setState({
                editShow: false
            })
            return;
        }

        Modal.error({ title: '保存失败', content: message });
    }

    onSelectCancle = () => {
        this.setState({
            visible: false,
            loading: false
        })
    }

    onEditCancle = () => {
        this.setState({
            editLoading: false,
            editShow: false
        })
    }

    formatTime = (total) => {
        let seconds = parseInt(total, 10);
        let day = parseInt(seconds / 86400);
        let hour = parseInt((seconds % 86400) / 3600);
        let minute = parseInt((seconds % 3600) / 60);
        let second = parseInt(seconds % 60);

        let timeStr = "";
        if (day > 0) {
            timeStr += day + "天";
        }

        if (hour > 0) {
            timeStr += hour + "时";
        }

        if (minute > 0) {
            timeStr += minute + "分";
        }

        if (second >= 0) {
            timeStr += second + "秒";
        }

        return timeStr;
    }

    fetchWhiteList = () => {
        let fetchClinets = common.fetchWithCode('CLIENT_LIST_GET', { method: 'POST' });
        let fetchWhite = common.fetchWithCode('QOS_AC_WHITELIST_GET', { method: 'POST' });

        Promise.all([fetchClinets, fetchWhite]).then(results => {
            let clients, whites;
            let { errcode, data } = results[0];
            if (0 !== errcode) {
                return;
            } else {
                clients = data[0].result.data;
            }

            if (0 !== results[1].errcode) {
                return;
            } else {
                whites = results[1].data[0].result.white_list;
            }

            // merge clients && white list info
            const modeMap = {
                '2.4g': '2.4G Wi-Fi',
                '5g': '5G Wi-Fi',
                'sunmi': '商米专用Wi-Fi',
                'not wifi': '有线'
            };

            this.setState({
                whiteList: whites.map(item => {
                    let mac = item.mac.toUpperCase();
                    let client = clients.find(item => item.mac.toUpperCase() === mac) || {
                        device: 'unknown',
                        online: false,
                        ontime: 0,
                        ip: '0.0.0.0',
                    };

                    return {
                        index: item.index,
                        icon: iconMap[client.device] || 'unknown',
                        name: item.name,
                        online: (false !== client.online),  // 设备列表中的设备都是在线的
                        ontime: this.formatTime(client.ontime),
                        ip: client.ip,
                        mac: mac,
                        network: modeMap[client.wifi_mode] || '--',
                    }
                }),
            });
        }).catch((error) => {
            console.error(error);
        })
    }

    fetchClientsInfo = async () => {
        let response = await common.fetchWithCode('CLIENT_LIST_GET', { method: 'POST' })
        let { errcode, message } = response;
        if (errcode == 0) {
            let { data } = response.data[0].result;

            // filter clients in dhcp static list
            let restClients = data.filter(item => {
                let mac = item.mac.toUpperCase();
                return !!!(this.state.whiteList.find(client => {
                    return (mac == client.mac.toUpperCase());
                }));
            });

            this.setState({
                onlineList: restClients.map(item => {
                    return {
                        icon: iconMap[item.device] || 'unknown',
                        name: item.hostname,
                        mac: item.mac,
                        time: item.time,
                        checked: false
                    }
                })
            });
            return;
        }

        Modal.error({ title: '获取客户端列表指令异常', message });
    }

    componentDidMount() {
        this.fetchWhiteList();
    }

    render() {
        const { whiteList, onlineList, visible, loading,
            editLoading, editShow, name, mac, nameTip, macTip, disabled } = this.state;

        const columns = [{
            title: '',
            dataIndex: 'icon',
            width: 60,
            render: (text, record) => (
                <CustomIcon type={record.icon} size={32} />
            )
        }, {
            title: '设备名称',
            width: 300,
            render: (text, record) => (
                <div>
                    <div style={{
                        width:'280px',
                        overflow: 'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace: 'nowrap',
                    }} title={record.name}>{record.name}</div>
                    <i style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        backgroundColor: (record.online ? '#87D068' : '#ADB1B9' ),
                        marginRight: '5px',
                        borderRadius: '50%',
                    }}></i>
                    {record.online?(
                        <span><label>在线时长：</label><label>{record.ontime}</label></span>
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
                    <div><label style={{ marginRight: 3 }}>MAC:</label><label>{record.mac}</label></div>
                </span>
            )
        }, {
            title: '所属网络',
            dataIndex: 'network',
            width: 210
        }, {
            title: '操作',
            width: 143,
            render: (text, record) => (
                <span>
                    <Popconfirm title="确定解除此设备的优先上网权？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>解除优先</a>
                    </Popconfirm>
                </span>
            )
        }];

        const onlineCols = [{
            title: '',
            dataIndex: 'icon',
            width: 60,
            render: (text, record) => (
                <CustomIcon type={record.icon} size={24} />
            )
        }, {
            title: '设备名称',
            dataIndex: 'name',
            width: 245
        }, {
            title: 'MAC地址',
            dataIndex: 'mac',
            width: 210,
        }, {
            title: '操作',
            dataIndex: 'checked',
            width: 60,
            render: (checked, record) => (
                <Checkbox checked={checked} onChange={() => this.handleSelect(record.mac)}></Checkbox>
            )
        }];

        return (
            <div style={{ margin: "0 60px" }}>
                <PanelHeader title="添加优先设备" />
                <div style={{ margin: "20px 20px 20px 0" }}>
                    <Button onClick={this.selectAdd} style={{ marginRight: 20 }}>列表添加</Button>
                    <Button onClick={this.manualAdd}>手动添加</Button>
                </div>
                <Table columns={columns} dataSource={whiteList} rowKey={record => record.index}
                    bordered size="middle" pagination={pagination} locale={{ emptyText: "您还未添加任何设备" }} />
                <Modal title="在线列表" cancelText="取消" okText="添加" closable={false} maskClosable={false}
                    width={960} style={{ position: 'relative' }}
                    visible={visible}
                    confirmLoading={loading}
                    onOk={this.onSelectOk}
                    onCancel={this.onSelectCancle} >
                    <Button size="large" style={{
                        position: "absolute",
                        top: 5,
                        left: 100,
                        border: 0,
                        padding: 0
                    }} onClick={this.fetchClientsInfo}><CustomIcon type="refresh" /></Button>
                    <Table columns={onlineCols} dataSource={onlineList} rowKey={record => record.mac}
                        style={{ height: 360, overflowY: 'auto' }}
                        className="tab-online-list" bordered size="middle" pagination={false} locale={{ emptyText: "暂无新设备可添加~" }} />
                </Modal>
                <Modal title='添加优先设备'
                    cancelText="取消" okText='添加'
                    closable={false} maskClosable={false} width={360}
                    visible={editShow}
                    confirmLoading={editLoading}
                    onOk={this.onEditOk}
                    okButtonProps={{ disabled: disabled }}
                    onCancel={this.onEditCancle} >
                    <label style={{ marginTop: 24 }}>备注名称</label>
                    <FormItem showErrorTip={nameTip} type="small" style={{ width: 320 }}>
                        <Input type="text" value={name} onChange={value => this.onChange(value, 'name')} placeholder="请输入备注名称" />
                        <ErrorTip>{nameTip}</ErrorTip>
                    </FormItem>
                    <label style={{ marginTop: 24 }}>MAC地址</label>
                    <FormItem showErrorTip={macTip} style={{ width: 320 }}>
                        <InputGroup size="small" type="mac"
                            inputs={[{ value: mac[0], maxLength: 2 }, { value: mac[1], maxLength: 2 }, { value: mac[2], maxLength: 2 }, { value: mac[3], maxLength: 2 }, { value: mac[4], maxLength: 2 }, { value: mac[5], maxLength: 2 }]}
                            onChange={value => this.onChange(value, 'mac')} />
                        <ErrorTip>{macTip}</ErrorTip>
                    </FormItem>
                </Modal>
            </div>
        );
    }
};
