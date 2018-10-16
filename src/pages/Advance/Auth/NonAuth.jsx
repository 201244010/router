
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import { Button, Table, Divider, Popconfirm, Modal, Checkbox } from 'antd';
import CustomIcon from '~/components/Icon';
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

export default class NonAuth extends React.Component{

    state = {
        prioritizedFree :true,
        wiredFree : true,
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
            ip:'192.168.100.139',
            mac:'00:11:22:AA:44:89',
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
    
    onTypeChange = (value,name) =>{
        common.fetchWithCode('AUTH_WHITELIST_SET',{method : 'post',data : {auth : {name :value}}}).then((resp) => {
            let{errcode,message} = resp;
            console.log(errcode,errcode == 0);
            if(errcode == 0){
                this.setState({
                    [name] : value
                })
            }else{
                Modal.error({title : '状态更改失败' ,message});
            }
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
        console.log(1,record);
        let response = await common.fetchWithCode(
            'AUTH_WHITELIST_DELETE',
            {
                method: 'POST', data: {
                    auth:{
                        white_list: [{
                            name: record.name,
                            mac: record.mac,
                        }]
                    }
                }
            }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            const whiteList = [...this.state.whiteList];
            this.setState({ whiteList: whiteList.filter(item =>{return item.mac !== record.mac;})});
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

        let directive = 'AUTH_WHITELIST_SET',
            white_list = this.state.onlineList.filter(item => item.checked).map(item => {
                return {
                    name: item.name,
                    mac: item.mac.toUpperCase()
                };
            });

        let response = await common.fetchWithCode(
            directive, { method: 'POST', data: { auth:{whitelist: white_list}} }
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

        let directive = 'AUTH_WHITELIST_SET';
        let white_list = [{
            mac: this.state.mac.join(':').toUpperCase(),
            name: this.state.name
        }];

        let response = await common.fetchWithCode(directive, { method: 'POST', data: { auth :{whitelist: white_list }} });

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

    fetchWhiteList = async() => {
        let fetchWhite = await common.fetchWithCode('AUTH_WHITELIST_GET',{method : 'post'},{handleError : true});
        let {errcode,data,message} = fetchWhite;
        let whites;
        console.log(fetchWhite,errcode == 0,errcode);
        if(errcode == 0){
            this.auth = data[0].result.auth;
            whites = data[0].result.auth.whitelist;
            this.setState({
                prioritizedFree : this.auth.prioritized_free == '1' ,
                wiredFree : this.auth.wired_free,
                whiteList: whites.map(item => {
                    return {
                        index: item.index,
                        icon: 'unknown',
                        name: item.name,
                        mac: item.mac.toUpperCase(),
                    }
                }),
            },()=>{console.log(this.state.whiteList);});
            return ;
        }
        Modal.error({ title: '获取免认证设备列表指令异常', message });
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
        const { prioritizedFree, wiredFree, whiteList, onlineList, visible, loading,
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
                </div>
            )
        }, {
            title: 'MAC地址',
            width: 220,
            render: (text, record) => (
                <span>
                    <div><label style={{ marginRight: 3 }}>MAC:</label><label>{record.mac}</label></div>
                </span>
            )
        }, {
            title: '操作',
            width: 143,
            render: (text, record) => (
                <span>
                    <Popconfirm title="确定恢复此设备的认证？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>恢复认证</a>
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
                <div style={{borderBottom:'1px solid #ECECEC'}}>
                    <PanelHeader className='unauth-header' title="优先设备免认证" checkable={true} checked={prioritizedFree} onChange={value => this.onTypeChange(value,'prioritizedFree')}/>
                    <PanelHeader className='unauth-header' title="有线端口免认证" checkable={true} checked={wiredFree} onChange={value => this.onTypeChange(value,'wiredFree')}/>
                </div>
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
                <Modal title='添加免认证设备'
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
}