
import React from 'react';
import { Button, Table, Divider, Popconfirm, Modal, Checkbox} from 'antd';
import CustomIcon from '~/components/Icon';
import Form from "~/components/Form";

const { FormItem, ErrorTip, Input: FormInput, InputGroup, Input } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: true
};

export default class StaticBind extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        editLoading: false,
        editShow: false,
        editType: 'add',         // add/edit
        editIndex: -1,
        editName: '',
        editIp: '',
        editMac: '',
        tipName: '',
        staticLists: [],
        onlineList:[]
    };

    onChange = (val, key) => {
        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val)
        });
    }

    selectAdd = () => {
        this.setState({
            visible: true
        });
    }

    manualAdd = () => {
        this.setState({
            editType: 'add',
            editShow: true,
            editLoading: false,
            editIndex: -1,
            editName: '',
            editIp: ['', '', '', ''],
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
            const staticLists = [...this.state.staticLists];
            this.setState({ staticLists: staticLists.filter(item => item.index !== record.index) });
            return;
        }

        Modal.error({ title: '删除失败', content: message });
    }

    handleSelect = (mac) => {
        const onlineList = [...this.state.onlineList];
        this.setState({ onlineList: onlineList.map(item => {
            if (item.address.mac === mac){
                item.checked = !item.checked;
            }

            return item;
        }) });
    }

    handleEdit = (record) => {
        const ip = record.ip.split('.');
        const mac = record.mac.split(':');

        this.setState({
            editType: 'edit',
            editShow: true,
            editLoading: false,
            editIndex: record.index,
            editName: record.note,
            editIp: [...ip],
            editMac: [...mac]
        });
    }

    onSelectOk = async () => {
        this.setState({
            loading: true
        });
        console.log(this.state.onlineList.filter(item => item.checked).map(item => {
            return {
                ip: item.address.ip,
                mac: item.address.mac,
                note: item.name
            }
        }))

        let directive = 'DHCPS_RESERVEDIP_ADD', 
            reservedIp = this.state.onlineList.filter(item => item.checked).map(item => {
                return {
                    ip: item.address.ip,
                    mac: item.address.mac,
                    note: item.name
                }
            });

        let response = await common.fetchWithCode(
            directive, { method: 'POST', data: { reserved_ip: reservedIp } }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            // refresh staic bind list
            this.fetchStaticInfo();

            this.setState({
                editLoading: false,
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

        let directive, reservedIp;
        switch(this.state.editType) {
            case 'add':
                directive = 'DHCPS_RESERVEDIP_ADD';
                reservedIp = [{
                    ip: this.state.editIp,
                    mac: this.state.editMac,
                    note: this.state.editName
                }];

                break;
            case 'edit':
                directive = 'DHCPS_RESERVEDIP_MODIFY';
                reservedIp = {
                    old: this.state.staticLists.find(item => item.index === this.state.editIndex),
                    new: {
                        ip: this.state.editIp,
                        mac: this.state.editMac,
                        note: this.state.editName
                    }
                };
                break;
        }

        let response = await common.fetchWithCode(directive, { method: 'POST', data: { reserved_ip: reservedIp } }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.setState({
                editLoading: false,
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
        let response = await common.fetchWithCode('DHCPS_RESERVEDIP_LIST_GET', { method: 'POST' }, { handleError: true })
        let { errcode, data, message } = response;
        if (errcode == 0) {
            let { reserved_ip_list } = data[0].result;
            this.setState({
                staticLists: reserved_ip_list.map(item => {
                    return Object.assign({ state: '1' }, item);
                })
            });
        }

        Modal.error({ title: '获取静态地址分配指令异常', message });
    }

    fetchClientsInfo = async () => {
        let response = await common.fetchWithCode('CLIENT_LIST_GET', { method: 'POST' }, { handleError: true })
        let { errcode, data, message } = response;
        if (errcode == 0) {
            const logoMap = {
                '2.4g': 'wifi',
                '5g': 'wifi',
                'not wifi': 'logo',
                'wired': 'logo',
            };

            let { data } = data[0].result;
            this.setState({
                onlineList: data.map(item => {
                    return {
                        logo: item.wifi_mode,
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
        this.fetchClientsInfo();
    }

    render() {
        const { staticLists, onlineList, visible, loading, 
            editLoading, editShow, editType, editName, editIp, editMac, tipName} = this.state;

        const columns = [{
            title: '设备名称',
            dataIndex: 'note',
            width:300
        }, {
            title: 'MAC地址',
            dataIndex: 'mac',
            width:160
        }, {
            title: 'IP地址',
            dataIndex: 'ip',
            width: 120
        }, {
            title: '状态',
            dataIndex: 'state',
            width:70,
            render: state => (
                <span>
                    {state == 0 ? (<label style={{ color: '#D33419' }}>失效</label>) : (<label>有效</label>)}
                </span>
            )
        }, {
            title: '操作',
            width:100,
            render: (text, record) => (
                <span>
                    <a onClick={() => this.handleEdit(record)} href="javascript:;" style={{ color:"#3D76F6"}}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title="您确定要删除该设备吗？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#FB8632" }}>删除</a>
                    </Popconfirm>
                </span>
            )
        }];

        const onlineCols = [{
            title: '',
            dataIndex: 'logo',
            width: 60,
            render: (text, record) => (
                <CustomIcon type={record.logo} size={24}  />
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
                    <span><label style={{marginRight: 3}}>IP:</label><label>{record.address.ip}</label></span><br />
                    <span><label style={{marginRight: 3}}>MAC:</label><label>{record.address.mac}</label></span>
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
            <div style={{margin:"20px 60px"}}>
                <div style={{margin:"20px 20px 20px 0"}}>
                    <Button onClick={this.selectAdd} style={{marginRight:20}}>在线列表添加</Button>
                    <Button onClick={this.manualAdd}>手动添加</Button>
                </div>
                <Table columns={columns} dataSource={staticLists} rowKey={record=>record.index} 
                    bordered size="middle" pagination={pagination} locale={{ emptyText: "您还未添加任何设备"}} />
                <Modal title="在线列表" cancelText="取消" okText="添加" closable={false} maskClosable={false}
                    width={960} style={{ position:'relative'}}
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
                        style={{height:360, overflowY: 'auto'}}
                        className="tab-online-list" bordered size="middle" pagination={false} locale={{ emptyText: "暂无设备在线~" }} />
                </Modal>
                <Modal title={editType === 'edit' ? '编辑静态地址' : '添加静态地址'}
                    cancelText="取消" okText={editType === 'edit' ? '保存' : '添加'}
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
                    <label style={{ marginTop: 24 }}>IP地址</label>
                    <FormItem style={{ width: 320 }}>
                        <InputGroup size="small"
                            inputs={[{ value: editIp[0], maxLength: 3 }, { value: editIp[1], maxLength: 3 }, { value: editIp[2], maxLength: 3 }, { value: editIp[3], maxLength: 3 }]}
                            onChange={value => this.onChange(value, 'editIp')} />
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







