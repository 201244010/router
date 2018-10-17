
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

const logoMap = {
    iphone: 'number',
    android: 'android',
    ipad: 'pad',
    pc: 'computer',
    unknown: 'unknown',
};

export default class Blacklist extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        disabled: true,
        editLoading: false,
        editShow: false,
        name: '',
        mac: '',
        me: '',
        nameTip: '',
        macTip: '',
        blockLists: [],
        onlineList: []
    };

    onChange = (val, key) => {
        let tip = '';

        let valid = {
            name: {
                func: (val) => {
                    return (val.length <= 0) ? '请输入备注名称' : '';
                },
            },
            mac: {
                func: checkMac,
            }
        };

        tip = valid[key].func(val, valid[key].args);

        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val),
            [key + 'Tip']: tip,
        }, () => {
            const keys = ['name', 'mac'];
            let disabled = keys.some(k => {
                return this.state[k + 'Tip'].length > 0
            });
            this.setState({ disabled: disabled });
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
            mac: ['', '', '', '', '', ''],
            nameTip: '请输入备注名称',
            macTip: '请输入MAC地址',
        });
    }

    handleDelete = async (record) => {
        let response = await common.fetchWithCode(
            'QOS_AC_BLACKLIST_DELETE',
            { method: 'POST', data: { black_list: [{
                index: record.index,
                name: record.name,
                mac: record.mac,
            }] } }
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

        let directive = 'QOS_AC_BLACKLIST_ADD',
            black_list = this.state.onlineList.filter(item => item.checked).map(item => {
                return {
                    name: item.name,
                    mac: item.mac.toUpperCase()
                };
            });

        let response = await common.fetchWithCode(
            directive, { method: 'POST', data: { black_list: black_list } }
        ).catch(ex => { });

        this.setState({
            loading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            // refresh list
            this.fetchBlackList();

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

        let directive = 'QOS_AC_BLACKLIST_ADD';
        let black_list = [{
            mac: this.state.mac.join(':').toUpperCase(),
            name: this.state.name
        }];

        let response = await common.fetchWithCode(directive, { method: 'POST', data: { black_list: black_list } });

        this.setState({
            editLoading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.fetchBlackList();
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

    fetchBlackList = async () => {
        let response = await common.fetchWithCode('QOS_AC_BLACKLIST_GET', { method: 'POST' })
        let { errcode, data, message } = response;
        if (errcode == 0) {
            let { black_list } = data[0].result;
            this.setState({
                blockLists: black_list.map(item => {
                    return {
                        logo: 'unknown',
                        name: item.name,
                        mac: item.mac,
                        time: new Date(parseInt(item.time) * 1000).toLocaleString(),
                        index: item.index
                    }
                })
            });

            return;
        }

        Modal.error({ title: '获取黑名单列表指令异常', message });
    }

    fetchClientsInfo = async () => {
        let response = await common.fetchWithCode('CLIENT_LIST_GET', { method: 'POST' })
        let { errcode, message } = response;
        if (errcode == 0) {
            let { data } = response.data[0].result;

            // filter clients in dhcp static list
            let restClients = data.filter(item => {
                let mac = item.mac.toUpperCase();
                return (mac !== this.state.me) && !!!(this.state.blockLists.find(client => {
                    return (mac == client.mac.toUpperCase());
                }));
            });

            this.setState({
                onlineList: restClients.map(item => {
                    return {
                        logo: logoMap[item.device] || 'unknown',
                        name: item.hostname,
                        mac: item.mac,
                        checked: false
                    }
                })
            });
            return;
        }

        Modal.error({ title: '获取客户端列表指令异常', message });
    }

    fetchWhoAmI = async () => {
        let response = await common.fetchWithCode('WHOAMI_GET', { method: 'POST' })
        let { errcode } = response;
        if (errcode == 0) {
            let { mac } = response.data[0].result;

            this.setState({
                me: mac.toUpperCase(),
            });
        }
    }

    componentDidMount() {
        this.fetchBlackList();
        this.fetchWhoAmI();
    }

    render() {
        const { blockLists, onlineList, visible, loading,
            editLoading, editShow, name, mac, nameTip, macTip, disabled } = this.state;

        const columns = [{
            title: '',
            dataIndex: 'logo',
            width: 80,
            className: 'center',
            render: (text, record) => (
                <CustomIcon type={record.logo} size={42} />
            )
        }, {
            title: '设备名称',
            dataIndex: 'name',
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
            className: 'center',
            render: (text, record) => (
                <CustomIcon type={record.logo} size={42} />
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
                <PanelHeader title="添加黑名单设备" />
                <div style={{ margin: "20px 20px 20px 0" }}>
                    <Button onClick={this.selectAdd} style={{ marginRight: 20 }}>列表添加</Button>
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
                    <Table columns={onlineCols} dataSource={onlineList} rowKey={record => record.mac}
                        style={{ height: 360, overflowY: 'auto' }}
                        className="tab-online-list" bordered size="middle" pagination={false} locale={{ emptyText: "暂无新设备可添加~" }} />
                </Modal>
                <Modal title='添加黑名单设备'
                    cancelText="取消" okText='添加'
                    closable={false} maskClosable={false} width={360}
                    visible={editShow}
                    confirmLoading={editLoading}
                    onOk={this.onEditOk}
                    okButtonProps={{disabled:disabled}}
                    onCancel={this.onEditCancle} >
                    <label style={{ marginTop: 24 }}>备注名称</label>
                    <FormItem showErrorTip={nameTip} type="small" style={{ width: 320 }}>
                        <Input type="text" value={name} onChange={value => this.onChange(value, 'name')} placeholder="请输入备注名称" maxLength={32} />
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
