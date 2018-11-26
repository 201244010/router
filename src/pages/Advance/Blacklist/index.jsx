
import React from 'react';
import { Button, Table, Popconfirm, Modal, Checkbox, message } from 'antd';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';
import PanelHeader from '~/components/PanelHeader';
import { checkMac } from '~/assets/common/check';
import Form from "~/components/Form";

const err ={
    '-1073':'设备已存在，请勿重复添加',
};
const { FormItem, ErrorTip, InputGroup, Input } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => `已添加${total}台设备`,
};

export default class Blacklist extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        disabled: true,
        disAddBtn: true,
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
                return this.state[k + 'Tip'].length > 0 || this.state[k].length === 0 || (k !== 'name' && this.state[k].every(item => item.length === 0))
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
            editShow: true,
            editLoading: false,
            name: '',
            mac: ['', '', '', '', '', ''],
            nameTip: '',
            macTip: '',
        });
    }

    handleDelete = async (record) => {
        let response = await common.fetchApi({
            opcode: 'QOS_AC_BLACKLIST_DELETE',
            data: {
                black_list: [{
                    index: record.index,
                    name: record.name,
                    mac: record.mac,
                }]
            }
        }, {
            loading: true
        }).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.fetchBasic();
            return;
        }

        message.error(`删除失败[${errcode}]`);
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
        }, () => {
            const checked = this.state.onlineList.some(item => {
                return item.checked;
            });
            this.setState({
                disAddBtn: !checked,
            });
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

        let response = await common.fetchApi({
            opcode: directive,
            data: { black_list: black_list }
        }, {
            loading: true
        }).catch(ex => { });

        this.setState({
            loading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            // refresh list
            this.fetchBasic();

            this.setState({
                visible: false,
                editShow: false
            })
            return;
        }

        message.error(`保存失败[${errcode}]`);
    }

    onEditOk = async () => {
        let { me, mac, name }  = this.state;
        mac = mac.join(':').toUpperCase();

        if (me === mac) {
            message.warning('不能禁止本机上网');
            return;
        }

        this.setState({
            editLoading: true
        });

        let directive = 'QOS_AC_BLACKLIST_ADD';
        let black_list = [{
            mac: mac,
            name: name
        }];

        let response = await common.fetchApi({
            opcode: directive,
            data: { black_list: black_list }
        }, {
            loading: true
        }).catch(ex => { });

        this.setState({
            editLoading: false
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.fetchBasic();
            this.setState({
                editShow: false
            })
            return;
        }

        message.error(err[errcode]);
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
            { opcode: 'CLIENT_LIST_GET' },
            { opcode: 'QOS_AC_BLACKLIST_GET' },
            { opcode: 'WHOAMI_GET' },
        ]);

        let { errcode, data, message } = response;
        if (0 !== errcode) {
            message.error(`获取列表指令异常[${errcode}]`);
            return;
        }

        let { black_list } = data[1].result;
        let me = data[2].result.mac.toUpperCase();
        // filter clients in dhcp static list
        let restClients = data[0].result.data.filter(item => {
            let mac = item.mac.toUpperCase();
            return (mac !== me) && !!!(black_list.find(client => {
                return (mac == client.mac.toUpperCase());
            }));
        });

        this.setState({
            me: me,
            blockLists: black_list.map(item => {
                return {
                    name: item.name,
                    mac: item.mac,
                    time: new Date(parseInt(item.time) * 1000).toLocaleString(),
                    index: item.index
                }
            }),
            onlineList: restClients.map(item => {
                return {
                    name: item.hostname,
                    mac: item.mac.toUpperCase(),
                    checked: false
                }
            }),
        });
    }

    componentDidMount() {
        this.fetchBasic();
    }

    render() {
        const { blockLists, onlineList, visible, loading,
            editLoading, editShow, name, mac, nameTip, macTip, disAddBtn, disabled } = this.state;

        const columns = [{
            title: '',
            dataIndex: 'mac',
            width: 80,
            className: 'center',
            render: (mac, record) => (
                <Logo mac={mac} size={32} />
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
                    <Popconfirm title="确定恢复上网？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>恢复上网</a>
                    </Popconfirm>
                </span>
            )
        }];

        const onlineCols = [{
            title: '',
            dataIndex: 'mac',
            width: 60,
            className: 'center',
            render: (mac, record) => (
                <Logo mac={mac} size={32} />
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
                    bordered size="middle" pagination={pagination} locale={{ emptyText: "暂无设备" }} />
                <Modal title="在线列表" cancelText="取消" okText="添加" closable={false} maskClosable={false} centered={true}
                    width={960} style={{ position: 'relative' }}
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
                    <Table columns={onlineCols} dataSource={onlineList} rowKey={record => record.mac}
                        scroll={{ y: 336 }}
                        style={{ minHeight: 360 }}
                        bordered size="middle" pagination={false} locale={{ emptyText: "暂无设备" }} />
                </Modal>
                <Modal title='添加黑名单设备' centered={true}
                    cancelText="取消" okText='添加'
                    closable={false} maskClosable={false} width={360}
                    visible={editShow}
                    confirmLoading={editLoading}
                    onOk={this.onEditOk}
                    okButtonProps={{ disabled: disabled }}
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
