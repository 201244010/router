
import React from 'react';
import { Button, Table, Divider, Popconfirm, Modal, Checkbox, message} from 'antd';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';
import Form from "~/components/Form";
import PanelHeader from '~/components/PanelHeader';
import { checkIp, checkMac, transIp } from '~/assets/common/check';

const MODULE = 'staticbind';

const { FormItem, ErrorTip, Input: FormInput, InputGroup, Input } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false
};

const error = {
    '-1001': intl.get(MODULE, 1)/*_i18n:参数错误*/,
    '-1050': intl.get(MODULE, 2)/*_i18n:添加失败[IP、MAC和已有相同]*/,
    '-1051': intl.get(MODULE, 3)/*_i18n:修改失败[待修改条目(IP、MAC)不存在，或修改后(IP、MAC)与其它条目相同]*/,
    '-1052': intl.get(MODULE, 4)/*_i18n:删除失败[条目不存在]*/,
    '-1053': intl.get(MODULE, 5)/*_i18n:保存失败[IP地址和LAN不在同一网段]*/,
}

export default class StaticBind extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        disAddBtn: true,
        editLoading: false,
        editShow: false,
        lanIp: '',
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
                    return (val.length <= 0) ? intl.get(MODULE, 6)/*_i18n:请输入备注名称*/ : '';
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

        // valid, then check MAC conflict
        if (key === 'editMac' && '' == tip) {
            const { staticLists, editIndex } = this.state;
            let conflict = staticLists.some(item => {
                return (item.mac === val.join(':').toUpperCase() && item.index !== editIndex);
            });
            tip = conflict ? intl.get(MODULE, 7)/*_i18n:MAC地址和现有条目冲突*/ : '';
        }

        // valid, then check IP conflict
        if (key === 'editIp' && '' == tip) {
            const ip = val.join('.');
            const { staticLists, editIndex } = this.state;
            let conflict = staticLists.some(item => {
                return (item.ip === ip && item.index !== editIndex);
            });

            if (conflict) {
                tip = intl.get(MODULE, 8)/*_i18n:IP地址和现有条目冲突*/;
            }
            else if (ip === this.state.lanIp) {
                tip = intl.get(MODULE, 9)/*_i18n:IP地址与局域网IP冲突*/;
            }
        }

        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val),
            [key + 'Tip']: tip,
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
            editIndex: -1,
            editName: '',
            editIp: ['', '', '', ''],
            editMac: ['', '', '', '', '', ''],
            editNameTip: false,
            editIpTip: false,
            editMacTip: false,
        });
    }

    handleDelete = async (record) => {
        let response = await common.fetchApi({
            opcode: 'DHCPS_RESERVEDIP_DELETE',
            data: { reserved_ip: [Object.assign({}, record)] }
        }, {
            loading: true
        });

        let { errcode } = response;
        if (errcode == 0) {
            this.fetchBasic();
            return;
        }

        message.error(intl.get(MODULE, 10, {error: errcode})/*_i18n:删除失败[{error}]*/);
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

    handleEdit = (record) => {
        const ip = record.ip.split('.');
        const mac = record.mac.split(':');

        this.setState({
            editType: 'edit',
            editShow: true,
            editLoading: false,
            editIndex: record.index,
            editName: record.hostname,
            editIp: [...ip],
            editMac: [...mac],
            editNameTip: '',
            editIpTip: '',
            editMacTip: '',
        });
    }

    onSelectOk = async () => {
        this.setState({
            loading: true
        });

        let directive = 'DHCPS_RESERVEDIP_ADD',
            checked = this.state.onlineList.filter(item => item.checked),
            aliaslist = checked.map(item => {
                return {
                    alias: item.name,
                    mac: item.address.mac.toUpperCase()
                };
            }),
            reservedIp = checked.map(item => {
                return {
                    enable: true,
                    note: item.name,
                    ip: item.address.ip,
                    mac: item.address.mac.toUpperCase()
                };
            });

        let response = await common.fetchApi([
            {
                opcode: directive,
                data: { reserved_ip: reservedIp }
            }, {
                opcode: 'CLIENT_ITEM_SET',
                data: { aliaslist }
            }
        ], {
            loading: true
        });

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

        message.error(intl.get(MODULE, 11, {error: errcode})/*_i18n:保存失败[{error}]*/);
    }

    onEditOk = async () => {
        const { editType, editIp, editMac, editName } = this.state;

        this.setState({
            editLoading: true
        });

        let directive, reservedIp, aliaslist;
        switch(editType) {
            case 'add':
                directive = 'DHCPS_RESERVEDIP_ADD';
                reservedIp = [{
                    enable: true,
                    ip: editIp.join('.'),
                    mac: editMac.join(':').toUpperCase(),
                    note: editName
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
                        ip: editIp.join('.'),
                        mac: editMac.join(':').toUpperCase(),
                        note: editName
                    }
                };
                break;
        }

        let response = await common.fetchApi([
            {
                opcode: directive,
                data: { reserved_ip: reservedIp }
            },
            {
                opcode: 'CLIENT_ITEM_SET',
                data: { aliaslist: [{
                    alias: editName,
                    mac: editMac.join(':').toUpperCase(),
                }] }
            },
        ], {
            loading: true
        });

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

        message.error(intl.get(MODULE, 11, {error: errcode})/*_i18n:保存失败[{error}]*/);
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

    getNetworkId = (ip, mask) => {
        let iip = transIp(ip.split('.'));
        let imask = transIp(mask.split('.'));

        return (iip &= imask);
    }

    fetchBasic = async () => {
        let response = await common.fetchApi([
            { opcode: 'DHCPS_RESERVEDIP_LIST_GET' },
            { opcode: 'CLIENT_LIST_GET' },
            { opcode: 'NETWORK_LAN_IPV4_GET'},
            { opcode: 'CLIENT_ALIAS_GET' },
        ]);

        let { errcode, data } = response;
        if (errcode == 0) {
            let { reserved_ip_list } = data[0].result;
            let alias = data[3].result.aliaslist;
            const { ipv4, mask } = data[2].result.lan.info;
            const lan = this.getNetworkId(ipv4, mask);

            // filter clients in dhcp static list
            let restClients = data[1].result.data.filter(item => {
                // 不在LAN网络，不显示
                if (this.getNetworkId(item.ip, mask) !== lan) {
                    return false;
                }

                let mac = item.mac.toUpperCase();
                return !(reserved_ip_list.find(client => {
                    return (mac == client.mac.toUpperCase());
                }));
            });

            this.setState({
                lanIp: ipv4,
                staticLists: reserved_ip_list.map(item => {
                    let mac = item.mac.toUpperCase();
                    let hostname = alias[mac] && alias[mac].alias || 'unknown';
                    return Object.assign({ hostname }, item);
                }),
                onlineList: restClients.map(item => {
                    let mac = item.mac.toUpperCase();
                    let hostname = alias[mac] && alias[mac].alias || item.model || item.hostname;
                    return {
                        name: hostname,
                        address: { ip: item.ip, mac },
                        checked: false
                    }
                })
            });
            return;
        }

        message.error(intl.get(MODULE, 13, {error: errcode})/*_i18n:未知错误[{error}]*/);
    }

    componentDidMount() {
        this.fetchBasic();
    }

    render() {
        const { staticLists, onlineList, visible, loading, 
            editLoading, editShow, editType, editName, editIp, editMac, 
            editNameTip, editIpTip, editMacTip, disAddBtn } = this.state;

        const columns = [{
            title: intl.get(MODULE, 14)/*_i18n:设备名称*/,
            dataIndex: 'hostname',
            width:260
        }, {
            title: intl.get(MODULE, 15)/*_i18n:MAC地址*/,
            dataIndex: 'mac',
            width:200
        }, {
            title: intl.get(MODULE, 16)/*_i18n:IP地址*/,
            dataIndex: 'ip',
            width: 160
        }, {
            title: intl.get(MODULE, 17)/*_i18n:状态*/,
            dataIndex: 'enable',
            width:90,
            render: enable => (
                <span>
                    {!enable ? (<label style={{ color: '#D33419' }}>{intl.get(MODULE, 18)/*_i18n:失效*/}</label>) : (<label>{intl.get(MODULE, 19)/*_i18n:有效*/}</label>)}
                </span>
            )
        }, {
            title: intl.get(MODULE, 20)/*_i18n:操作*/,
            width:140,
            render: (text, record) => (
                <span>
                    <a onClick={() => this.handleEdit(record)} href="javascript:;" style={{ color:"#3D76F6"}}>{intl.get(MODULE, 21)/*_i18n:编辑*/}</a>
                    <Divider type="vertical" />
                    <Popconfirm title={intl.get(MODULE, 22)/*_i18n:确定删除？*/} okText={intl.get(MODULE, 38)/*_i18n:确定*/} cancelText={intl.get(MODULE, 39)/*_i18n:取消*/} onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#FB8632" }}>{intl.get(MODULE, 23)/*_i18n:删除*/}</a>
                    </Popconfirm>
                </span>
            )
        }];

        const onlineCols = [{
            title: '',
            dataIndex: 'address',
            width: 60,
            className:'center',
            render: (address, record) => (
                <Logo mac={address.mac} size={32}  />
            )
        }, {
            title: intl.get(MODULE, 24)/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 245
        }, {
            title: intl.get(MODULE, 25)/*_i18n:IP/MAC地址*/,
            dataIndex: 'address',
            width: 210,
            render: (address, record) => (
                <span>
                    <span><label style={{marginRight: 3}}>IP:</label><label>{address.ip}</label></span><br />
                    <span><label style={{marginRight: 3}}>MAC:</label><label>{address.mac}</label></span>
                </span>
            )
        }, {
            title: intl.get(MODULE, 26)/*_i18n:操作*/,
            dataIndex: 'checked',
            width: 60,
            render: (checked, record) => (
                <Checkbox checked={checked} onChange={() => this.handleSelect(record.address.mac)}></Checkbox>
            )
        }];
        const total = staticLists.length;
        return (
            <div style={{margin:"20px 60px 48px 60px"}}>
                <PanelHeader title='静态地址分配' />
                <div style={{margin:"29px 0 20px 0", display: 'flex', justifyContent: 'space-between'}}>
                    <p style={{fontSize: 14}}>
                        {total > 1 ? intl.get(MODULE, 0, {total})/*_i18n:已添加{total}台设备*/ : intl.get(MODULE, 41, {total})}
                    </p>
                    <div>
                        <Button onClick={this.selectAdd} style={{marginRight:20}}>{intl.get(MODULE, 27)/*_i18n:列表添加*/}</Button>
                        <Button onClick={this.manualAdd}>{intl.get(MODULE, 28)/*_i18n:手动添加*/}</Button>
                    </div>
                </div>
                <Table columns={columns} dataSource={staticLists} rowKey={record=>record.index} 
                    bordered={false}
                    size="middle" pagination={pagination} locale={{ emptyText: intl.get(MODULE, 29)/*_i18n:暂无设备*/}} />
                <Modal
                    cancelText={intl.get(MODULE, 31)/*_i18n:取消*/}
                    okText={intl.get(MODULE, 32)/*_i18n:添加*/}
                    closable={false}
                    maskClosable={false}
                    centered={true}
                    width={960}
                    style={{ position:'relative'}}
                    visible={visible}
                    footer={[
                        <Button key="back" onClick={this.onSelectCancle}>{intl.get(MODULE, 31)/*_i18n:取消*/}</Button>,
                        <Button key="submit" type="primary" disabled={disAddBtn} loading={loading} onClick={this.onSelectOk}>
                            {intl.get(MODULE, 32)/*_i18n:添加*/}
                        </Button>,
                    ]} >
                    <div style={{padding: '0 0 16px',marginBottom: 24}}>
                        <p style={{fontSize: 16,lineHeight: '22px',fontWeight: 500,color: 'rgba(0,0,0,.85)',display: 'inline-block',marginRight: 10}}>{intl.get(MODULE, 30)/*_i18n:在线列表*/}</p>
                        <Button size="large" style={{
                            display: 'inline-block',
                            border: 0,
                            padding: 0,
                            height: 22,
                        }} onClick={this.fetchBasic}><CustomIcon type="refresh" /></Button>
                    </div>
                    <div style={{position: 'absolute',width: '100%',left: 0,top:62,borderBottom: '1px solid #e8e8e8'}}></div>
                    <Table columns={onlineCols} dataSource={onlineList} rowKey={record => record.address.mac}
                        scroll={{ y: 336 }}
                        style={{ minHeight: 360 }}
                        bordered={false}
                        size="middle" pagination={false} locale={{ emptyText: intl.get(MODULE, 33)/*_i18n:暂无设备*/ }} />
                </Modal>
                <Modal title={editType === 'edit' ? intl.get(MODULE, 34)/*_i18n:编辑静态地址*/ : intl.get(MODULE, 35)/*_i18n:备注名称*/}
                    cancelText={intl.get(MODULE, 31)/*_i18n:取消*/} okText={editType === 'edit' ? intl.get(MODULE, 40)/*_i18n:保存*/ : intl.get(MODULE, 32)/*_i18n:添加*/}
                    closable={false} maskClosable={false} width={360}
                    visible={editShow} centered={true}
                    confirmLoading={editLoading}
                    onOk={this.onEditOk}
                    okButtonProps={{ disabled: ('' !== editNameTip || '' !== editIpTip || '' !== editMacTip) }}
                    onCancel={this.onEditCancle} >
                    <label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 35)/*_i18n:备注名称*/}</label>
                    <FormItem showErrorTip={editNameTip} type="small" >
                        <Input type="text" value={editName} onChange={value => this.onChange(value, 'editName')} placeholder={intl.get(MODULE, 36)/*_i18n:请输入备注名称*/} maxLength={32} />
                        <ErrorTip>{editNameTip}</ErrorTip>
                    </FormItem>
                    <label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 37)/*_i18n:IP地址*/}</label>
                    <FormItem showErrorTip={editIpTip} >
                        <InputGroup size="small"
                            inputs={[{ value: editIp[0], maxLength: 3 }, { value: editIp[1], maxLength: 3 }, { value: editIp[2], maxLength: 3 }, { value: editIp[3], maxLength: 3 }]}
                            onChange={value => this.onChange(value, 'editIp')} />
                        <ErrorTip>{editIpTip}</ErrorTip>
                    </FormItem>
                    <label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 15)/*_i18n:MAC地址*/}</label>
                    <FormItem showErrorTip={editMacTip} style={{ marginBottom:8 }}>
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







