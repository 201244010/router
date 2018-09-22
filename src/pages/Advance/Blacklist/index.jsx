
import React from 'react';
import { Button, Table, Divider, Popconfirm, Modal, Checkbox } from 'antd';
import CustomIcon from '~/components/Icon';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";

const { FormItem, ErrorTip, Input: FormInput, InputGroup, Input } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: true
};

export default class Blacklist extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        editLoading: false,
        editShow: false,
        editIndex: -1,
        editName: '',
        editMac: '',
        tipName: '',
        blockLists: [{
            logo:'logo',
            note:'Hello world',
            mac:'00:11:22:DD:AA:11',
            time:"2014-12-24  23:12:00"
        }],
        onlineList: []
    };

    onChange = (val, key) => {
        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val)
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
            editIndex: -1,
            editName: '',
            editMac: ['', '', '', '', '', '']
        });
    }

    handleDelete = async (record) => {
        let response = await common.fetchWithCode(
            'DHCPS_RESERVEDIP_DELETE',
            { method: 'POST', data: { reserved_ip: [Object.assign({}, record)] } }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            const blockLists = [...this.state.blockLists];
            this.setState({ blockLists: blockLists.filter(item => item.index !== record.index) });
            return;
        }

        Modal.error({ title: '删除失败', content: message });
    }

    handleSelect = (mac) => {
        const onlineList = [...this.state.onlineList];
        this.setState({
            onlineList: onlineList.map(item => {
                if (item.address.mac === mac) {
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

        let directive = 'DHCPS_RESERVEDIP_ADD',
            reservedIp = this.state.onlineList.filter(item => item.checked).map(item => {
                return {
                    enable: true,
                    note: item.name,
                    ip: item.address.ip,
                    mac: item.address.mac.toUpperCase()
                };
            });

        let response = await common.fetchWithCode(
            directive, { method: 'POST', data: { reserved_ip: reservedIp } }
        ).catch(ex => { });

        this.setState({
            loading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            // refresh staic bind list
            this.fetchStaticInfo();

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

        let directive = 'DHCPS_RESERVEDIP_ADD';
        let reservedIp = [{
            enable: true,
            mac: this.state.editMac.join(':').toUpperCase(),
            note: this.state.editName
        }];

        let response = await common.fetchWithCode(directive, { method: 'POST', data: { reserved_ip: reservedIp } });

        this.setState({
            editLoading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.fetchStaticInfo();
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

    fetchStaticInfo = async () => {
        let response = await common.fetchWithCode('DHCPS_RESERVEDIP_LIST_GET', { method: 'POST' })
        let { errcode, data, message } = response;
        if (errcode == 0) {
            let { reserved_ip_list } = data[0].result;
            this.setState({
                blockLists: reserved_ip_list.map(item => {
                    return Object.assign({}, item);
                })
            });

            return;
        }

        Modal.error({ title: '获取静态地址列表指令异常', message });
    }

    fetchClientsInfo = async () => {
        let response = await common.fetchWithCode('CLIENT_LIST_GET', { method: 'POST' })
        let { errcode, message } = response;
        if (errcode == 0) {
            const logoMap = {
                '2.4g': 'wifi',
                '5g': 'wifi',
                'not wifi': 'logo',
                'wired': 'logo',
            };

            let { data } = response.data[0].result;

            // filter clients in dhcp static list
            let restClients = data.filter(item => {
                let mac = item.mac.toUpperCase();
                return !!!(this.state.blockLists.find(client => {
                    return (mac == client.mac.toUpperCase());
                }));
            });

            this.setState({
                onlineList: restClients.map(item => {
                    return {
                        logo: logoMap[item.wifi_mode],
                        name: item.hostname,
                        address: { ip: item.ip, mac: item.mac },
                        checked: false
                    }
                })
            });
            return;
        }

        Modal.error({ title: '获取客户端列表指令异常', message });
    }

    componentDidMount() {
        this.fetchStaticInfo();
    }

    render() {
        const { blockLists, onlineList, visible, loading,
            editLoading, editShow, editName, editMac, tipName } = this.state;

        const columns = [{
            title: '',
            dataIndex: 'logo',
            width: 80,
            render: (text, record) => (
                <CustomIcon type={record.logo} size={24} />
            )
        }, {
            title: '设备名称',
            dataIndex: 'note',
            width: 300
        }, {
            title: 'MAC地址',
            dataIndex: 'mac',
            width: 200
        }, {
            title: '拉黑时间',
            dataIndex: 'time',
            width: 210
        }, {
            title: '操作',
            width: 143,
            render: (text, record) => (
                <span>
                    <Popconfirm title="确定将此设备恢复上网？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>恢复上网</a>
                    </Popconfirm>
                </span>
            )
        }];

        const onlineCols = [{
            title: '',
            dataIndex: 'logo',
            width: 60,
            render: (text, record) => (
                <CustomIcon type={record.logo} size={24} />
            )
        }, {
            title: '设备名称',
            dataIndex: 'name',
            width: 245
        }, {
            title: 'IP/MAC地址',
            dataIndex: 'address',
            width: 210,
            render: (text, record) => (
                <span>
                    <span><label style={{ marginRight: 3 }}>IP:</label><label>{record.address.ip}</label></span><br />
                    <span><label style={{ marginRight: 3 }}>MAC:</label><label>{record.address.mac}</label></span>
                </span>
            )
        }, {
            title: '操作',
            dataIndex: 'checked',
            width: 60,
            render: (checked, record) => (
                <Checkbox checked={checked} onChange={() => this.handleSelect(record.address.mac)}></Checkbox>
            )
        }];

        return (
            <div style={{ margin: "20px 60px" }}>
                <PanelHeader title="添加黑名单设备" />
                <div style={{ margin: "20px 20px 20px 0" }}>
                    <Button onClick={this.selectAdd} style={{ marginRight: 20 }}>在线列表添加</Button>
                    <Button onClick={this.manualAdd}>手动添加</Button>
                </div>
                <Table columns={columns} dataSource={blockLists} rowKey={record => record.index}
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
                    <Table columns={onlineCols} dataSource={onlineList} rowKey={record => record.address.mac}
                        style={{ height: 360, overflowY: 'auto' }}
                        className="tab-online-list" bordered size="middle" pagination={false} locale={{ emptyText: "暂无新设备可添加~" }} />
                </Modal>
                <Modal title='添加黑名单设备'
                    cancelText="取消" okText='添加'
                    closable={false} maskClosable={false} width={360}
                    visible={editShow}
                    confirmLoading={editLoading}
                    onOk={this.onEditOk}
                    onCancel={this.onEditCancle} >
                    <label style={{ marginTop: 24 }}>备注名称</label>
                    <FormItem showErrorTip={tipName} type="small" style={{ width: 320 }}>
                        <Input type="text" value={editName} onChange={value => this.onChange(value, 'editName')} placeholder="请输入备注名称" />
                        <ErrorTip>{tipName}</ErrorTip>
                    </FormItem>
                    <label style={{ marginTop: 24 }}>MAC地址</label>
                    <FormItem style={{ width: 320 }}>
                        <InputGroup size="small" type="mac"
                            inputs={[{ value: editMac[0], maxLength: 2 }, { value: editMac[1], maxLength: 2 }, { value: editMac[2], maxLength: 2 }, { value: editMac[3], maxLength: 2 }, { value: editMac[4], maxLength: 2 }, { value: editMac[5], maxLength: 2 }]}
                            onChange={value => this.onChange(value, 'editMac')} />
                    </FormItem>
                </Modal>
            </div>
        );
    }
};







