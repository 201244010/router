
import React from 'react';
import { Button, Table, Divider, Popconfirm, Modal, Checkbox, message} from 'antd';
import CustomIcon from '~/components/Icon';
import Form from "~/components/Form";
import { checkIp, checkMac } from '~/assets/common/check';

const { FormItem, ErrorTip, Input: FormInput, InputGroup, Input } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => `已添加${total}台设备`,
};

const error = {
    '-1001': '参数错误',
    '-1050': '添加失败[IP、MAC和已有相同]',
    '-1051': '修改失败[待修改条目(IP、MAC)不存在，或修改后(IP、MAC)与其它条目相同]',
    '-1052': '删除失败[条目不存在]',
    '-1053': '保存失败[IP地址和LAN不在同一网段]',
}

export default class StaticBind extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        disabled: true,
        disAddBtn: true,
        editLoading: false,
        editShow: false,
        editType: 'add',         // add/edit
        editIndex: -1,
        editName: '',
        editIp: '',
        editMac: '',
        editNameTip: '',
        editIpTip: '',
        editMacTip: '',
        staticLists: [],
        onlineList:[]
    };

    onChange = (val, key) => {
        let valid = {
            editName: {
                func: (val) => {
                    return (val.length <= 0) ? '请输入备注名称' : '';
                },
            },
            editIp: {
                func: checkIp
            },
            editMac: {
                func: checkMac,
            }
        };

        let tip = valid[key].func(val, valid[key].args);
        if(key === 'editMac' && val.every(item => item.length !== 0)){
            tip = this.onEditMac(val) || tip;
        }
        if(key === 'editIp' && val.every(item => item.length !== 0)){
            tip = (val.join('.') === this.lanIp ? '静态IP地址与局域网IP地址冲突' : '')
        }
        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val),
            [key + 'Tip']: tip,
        }, () => {
            const keys = ['editName', 'editIp', 'editMac'];
            let disabled = keys.some(k => {
                return this.state[k + 'Tip'].length > 0 || this.state[k].length === 0 || (k !== 'editName' && this.state[k].every(item => item.length === 0))
            });
            this.setState({ disabled: disabled });
        });
    }

    selectAdd = () => {
        this.fetchBasic();
        this.setState({
            visible: true
        });
    }

    manualAdd = () => {
        this.setState({
            editType: 'add',
            editShow: true,
            editLoading: false,
            disabled: true,
            editIndex: -1,
            editName: '',
            editIp: ['', '', '', ''],
            editMac: ['', '', '', '', '', ''],
            editNameTip: '',
            editIpTip: '',
            editMacTip: '',
        });
    }

    handleDelete = async (record) => {
        let response = await common.fetchApi({
            opcode: 'DHCPS_RESERVEDIP_DELETE',
            data: { reserved_ip: [Object.assign({}, record)] }
        }, {
            loading: true
        }).catch(ex => { });

        let { errcode } = response;
        if (errcode == 0) {
            this.fetchBasic();
            return;
        }

        message.error(`${error[errcode]}` || `删除失败[${errcode}]`);
    }

    handleSelect = (mac) => {
        const onlineList = [...this.state.onlineList];
        this.setState({
            onlineList: onlineList.map(item => {
                if (item.address.mac === mac){
                    item.checked = !item.checked;
                }

                return item;
        })}, () => {
            const checked = this.state.onlineList.some(item => {
                return item.checked;
            });
            this.setState({
                disAddBtn: !checked,
            });
        });
    }

    onEditMac = (value) => {
        let staticLists = this.state.staticLists;
        return  staticLists.some(item => item.mac === value.join(':').toUpperCase()) ? '设备Mac地址已存在' : '';
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
            editMac: [...mac],
            editNameTip: '',
            editIpTip: '',
            editMacTip: '',
            disabled: false
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

        let response = await common.fetchApi({
            opcode: directive,
            data: { reserved_ip: reservedIp }
        }, {
            loading: true
        }).catch(ex => { });

        this.setState({
            loading: false
        });

        let { errcode } = response;
        if (errcode == 0) {
            // refresh staic bind list
            this.fetchBasic();

            this.setState({
                visible: false,
                editShow: false
            })
            return;
        }

        message.error( `${error[errcode]}` || `保存失败[${errcode}]`);
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
                    enable: true,
                    ip: this.state.editIp.join('.'),
                    mac: this.state.editMac.join(':').toUpperCase(),
                    note: this.state.editName
                }];

                break;
            case 'edit':
                directive = 'DHCPS_RESERVEDIP_MODIFY';
                let item = this.state.staticLists.find(item => item.index === this.state.editIndex);
                reservedIp = {
                    old: {
                        enable: item.enable,
                        ip: item.ip,
                        mac: item.mac.toUpperCase(),
                        note: item.note || 'unknown'
                    },
                    new: {
                        enable: true,
                        ip: this.state.editIp.join('.'),
                        mac: this.state.editMac.join(':').toUpperCase(),
                        note: this.state.editName
                    }
                };
                break;
        }

        let response = await common.fetchApi({
            opcode: directive,
            data: { reserved_ip: reservedIp }
        }, {
            loading: true
        }).catch(ex => { });

        this.setState({
            editLoading: false
        });

        let { errcode } = response;
        if (errcode == 0) {
            this.fetchBasic();
            this.setState({
                editShow: false
            })
            return;
        }

        message.error( `${error[errcode]}` || `保存失败[${errcode}]`);
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

    fetchBasic = async () => {
        let response = await common.fetchApi([
            { opcode: 'DHCPS_RESERVEDIP_LIST_GET' },
            { opcode: 'CLIENT_LIST_GET' },
            { opcode: 'NETWORK_LAN_IPV4_GET'}
        ]);

        let { errcode, data } = response;
        if (errcode == 0) {
            let { reserved_ip_list } = data[0].result;

            const deviceMap = {
                iphone: 'number',
                android: 'android',
                ipad: 'pad',
                pc: 'computer',
                unknown: 'unknown',
            };

            // filter clients in dhcp static list
            let restClients = data[1].result.data.filter(item => {
                let mac = item.mac.toUpperCase();
                return !!!(this.state.staticLists.find(client => {
                    return (mac == client.mac.toUpperCase());
                }));
            });
            this.lanIp = data[2].result.lan.info.ipv4;
            this.setState({
                staticLists: reserved_ip_list.map(item => {
                    return Object.assign({}, item);
                }),
                onlineList: restClients.map(item => {
                    return {
                        logo: deviceMap[item.device] || 'unknown',
                        name: item.hostname,
                        address: { ip: item.ip, mac: item.mac.toUpperCase() },
                        checked: false
                    }
                })
            });
            return;
        }

        message.error( `${error[errcode]}`|| `获取列表指令异常[${errcode}]`);
    }

    componentDidMount() {
        this.fetchBasic();
    }

    render() {
        const { staticLists, onlineList, visible, loading, 
            editLoading, editShow, editType, editName, editIp, editMac, 
            editNameTip, editIpTip, editMacTip, disAddBtn, disabled } = this.state;

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
            dataIndex: 'enable',
            width:70,
            render: enable => (
                <span>
                    {!enable ? (<label style={{ color: '#D33419' }}>失效</label>) : (<label>有效</label>)}
                </span>
            )
        }, {
            title: '操作',
            width:100,
            render: (text, record) => (
                <span>
                    <a onClick={() => this.handleEdit(record)} href="javascript:;" style={{ color:"#3D76F6"}}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title="确定删除？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#FB8632" }}>删除</a>
                    </Popconfirm>
                </span>
            )
        }];

        const onlineCols = [{
            title: '',
            dataIndex: 'logo',
            width: 60,
            className:'center',
            render: (text, record) => (
                <CustomIcon type={record.logo} size={42}  />
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
                <div style={{margin:"29px 20px 20px 0"}}>
                    <Button onClick={this.selectAdd} style={{marginRight:20}}>列表添加</Button>
                    <Button onClick={this.manualAdd}>手动添加</Button>
                </div>
                <Table columns={columns} dataSource={staticLists} rowKey={record=>record.index} 
                    bordered size="middle" pagination={pagination} locale={{ emptyText: "暂无设备"}} />
                <Modal title="在线列表" cancelText="取消" okText="添加" closable={false} maskClosable={false}
                    width={960} style={{ position:'relative'}}
                    visible={visible}
                    footer={[
                        <Button key="back" onClick={this.onSelectCancle}>取消</Button>,
                        <Button key="submit" type="primary" disabled={disAddBtn} loading={loading} onClick={this.onSelectOk}>
                            添加
                        </Button>,
                    ]} >
                    <Button size="large" style={{
                        position: "absolute",
                        top: 5,
                        left: 100,
                        border: 0,
                        padding: 0
                    }} onClick={this.fetchBasic}><CustomIcon type="refresh" /></Button>
                    <Table columns={onlineCols} dataSource={onlineList} rowKey={record => record.address.mac}
                        scroll={{ y: 336 }}
                        style={{ minHeight: 360 }}
                        bordered bordered size="middle" pagination={false} locale={{ emptyText: "暂无设备" }} />
                </Modal>
                <Modal title={editType === 'edit' ? '编辑静态地址' : '添加静态地址'}
                    cancelText="取消" okText={editType === 'edit' ? '保存' : '添加'}
                    closable={false} maskClosable={false} width={360}
                    visible={editShow}
                    confirmLoading={editLoading}
                    onOk={this.onEditOk}
                    okButtonProps={{ disabled: disabled }}
                    onCancel={this.onEditCancle} >
                    <label style={{ marginTop: 24 }}>备注名称</label>
                    <FormItem showErrorTip={editNameTip} type="small" style={{ width: 320 }}>
                        <Input type="text" value={editName} onChange={value => this.onChange(value, 'editName')} placeholder="请输入备注名称" maxLength={32} />
                        <ErrorTip>{editNameTip}</ErrorTip>
                    </FormItem>
                    <label style={{ marginTop: 24 }}>IP地址</label>
                    <FormItem showErrorTip={editIpTip} style={{ width: 320 }}>
                        <InputGroup size="small"
                            inputs={[{ value: editIp[0], maxLength: 3 }, { value: editIp[1], maxLength: 3 }, { value: editIp[2], maxLength: 3 }, { value: editIp[3], maxLength: 3 }]}
                            onChange={value => this.onChange(value, 'editIp')} />
                        <ErrorTip>{editIpTip}</ErrorTip>
                    </FormItem>
                    <label style={{ marginTop: 24 }}>MAC地址</label>
                    <FormItem showErrorTip={editMacTip} style={{ width: 320 }}>
                        <InputGroup size="small" type="mac"
                            inputs={[{ value: editMac[0], maxLength: 2 }, { value: editMac[1], maxLength: 2 }, { value: editMac[2], maxLength: 2 }, { value: editMac[3], maxLength: 2 }, { value: editMac[4], maxLength: 2 }, { value: editMac[5], maxLength: 2 }]}
                            onChange={value => this.onChange(value, 'editMac')} />
                        <ErrorTip>{editMacTip}</ErrorTip>
                    </FormItem>
                </Modal>
            </div>
        );
    }
};







