
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
        staticLists: [{
            index:0,
            name: 'John Brown John Brown John Brown John Brown John Brown John Brown',
            mac: '00:AA:BB:CC:DD:10',
            ip: '192.168.0.100',
            state: '0',
        }, {
            index:1,
            name: 'John Brown 1',
            mac: '00:AA:BB:CC:DD:11',
            ip: '192.168.0.101',
            state: '1',
        }, {
            index:2,
            name: 'John Brown 2',
            mac: '00:AA:BB:CC:DD:12',
            ip: '192.168.0.102',
            state: '1',
        }, {
            index: 3,
            name: 'John Brown 3',
            mac: '00:AA:BB:CC:DD:13',
            ip: '192.168.0.103',
            state: '0',
        }, {
            index: 4,
            name: 'John Brown 4',
            mac: '00:AA:BB:CC:DD:14',
            ip: '192.168.0.100',
            state: '0',
        }, {
            index: 5,
            name: 'John Brown 5',
            mac: '00:AA:BB:CC:DD:15',
            ip: '192.168.0.101',
            state: '1',
        }, {
            index: 6,
            name: 'John Brown 6',
            mac: '00:AA:BB:CC:DD:16',
            ip: '192.168.0.102',
            state: '1',
        }, {
            index: 7,
            name: 'John Brown 7',
            mac: '00:AA:BB:CC:DD:17',
            ip: '192.168.0.103',
            state: '0',
        }],
        onlineList:[{
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: {ip:'192.168.0.100', mac: "00:11:22:AA:BB:01"},
            rate: {txRate: '10Mbps', rxRate: '72Mbps'},
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:02" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:03" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:04" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:05" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:06" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:07" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:08" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:09" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:0A" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:0B" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }, {
            logo: 'logo',
            name: 'xiongming-iPhone',
            address: { ip: '192.168.0.100', mac: "00:11:22:AA:BB:0C" },
            rate: { txRate: '10Mbps', rxRate: '72Mbps' },
            flux: '1GB',
            checked: false
        }]
    };

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
        }, () => {
            console.log(this.state)
        });
    }

    handleDelete = (index) => {
        const staticLists = [...this.state.staticLists];
        this.setState({ staticLists: staticLists.filter(item => item.index !== index) });
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
            editName: record.name,
            editIp: [...ip],
            editMac: [...mac]
        });
    }

    onSelectOk = () => {
        this.setState({
            loading: true
        });

        //TODO
        setTimeout(() => {
            this.setState({
                visible: false,
                loading: false
            })
        }, 2000);
    }

    onEditOk = () => {
        this.setState({
            editLoading: true
        });

        //TODO
        setTimeout(() => {
            this.setState({
                editLoading: false,
                editShow: false
            })
        }, 2000);
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

    render() {
        const { staticLists, onlineList, visible, loading, 
            editLoading, editShow, editType, editName, editIp, editMac, tipName} = this.state;

        const columns = [{
            title: '设备名称',
            dataIndex: 'name',
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
                    <Popconfirm title="您确定要删除该设备吗？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record.index)}>
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
            title: '实时速率',
            dataIndex: 'rate',
            width: 160,
            render: (text, record) => (
                <span>
                    <span><CustomIcon type="bandwidthup" size={12} color="#749cf5" /><label style={{marginLeft:5}}>{record.rate.txRate}</label></span><br />
                    <span><CustomIcon type="bandwidthdown" size={12} color="#abde95" /><label style={{ marginLeft: 5 }}>{record.rate.rxRate}</label></span>
                </span>
            )
        }, {
            title: '流量消耗',
            dataIndex: 'flux',
            width: 160
        }, {
            title: '操作',
            dataIndex: 'checked',
            width: 94,
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
                    <CustomIcon type="refresh" />
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
                        <Input type="text" value={editName} onChange={value => this.onChange(value, 'name')} placeholder="请输入备注名称" />
                        <ErrorTip>{tipName}</ErrorTip>
                    </FormItem>
                    <label style={{ marginTop: 24 }}>IP地址</label>
                    <FormItem style={{ width: 320 }}>
                        <InputGroup size="small"
                            inputs={[{ value: editIp[0], maxLength: 3 }, { value: editIp[1], maxLength: 3 }, { value: editIp[2], maxLength: 3 }, { value: editIp[3], maxLength: 3 }]}
                            onChange={value => this.onChange(value, 'ip')} />
                    </FormItem>
                    <label style={{ marginTop: 24 }}>MAC地址</label>
                    <FormItem style={{ width: 320 }}>
                        <InputGroup size="small" type="mac"
                            inputs={[{ value: editMac[0], maxLength: 2 }, { value: editMac[1], maxLength: 2 }, { value: editMac[2], maxLength: 2 }, { value: editMac[3], maxLength: 2 }, { value: editMac[4], maxLength: 2 }, { value: editMac[5], maxLength: 2 }]}
                            onChange={value => this.onChange(value, 'mac')} />
                    </FormItem>
                </Modal>
            </div>
        );
    }
};







