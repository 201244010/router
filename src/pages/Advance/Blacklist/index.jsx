
import React from 'react';
import { Button, Table, Popconfirm, Modal, Checkbox, message } from 'antd';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';
import PanelHeader from '~/components/PanelHeader';
import { checkMac } from '~/assets/common/check';
import Form from "~/components/Form";
import intl from '~/i18n/intl';

const MODULE = 'blacklist';

const err ={
    '-1073': intl.get(MODULE, 0),
};
const { FormItem, ErrorTip, InputGroup, Input } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => intl.get(MODULE, 1, {total}),
};

export default class Blacklist extends React.Component {
    state = {
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
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
                    return (val.length <= 0) ? intl.get(MODULE, 4) : '';
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
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.fetchBasic();
            return;
        }

        message.error(intl.get(MODULE, 5, {errcode}));
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
            checked = this.state.onlineList.filter(item => item.checked),
            aliaslist = checked.map(item => {
                return {
                    alias: item.name,
                    mac: item.mac.toUpperCase()
                };
            }),
            black_list = checked.map(item => {
                return {
                    name: item.name,
                    mac: item.mac.toUpperCase()
                };
            });

        let response = await common.fetchApi([
            {
                opcode: directive,
                data: { black_list: black_list }
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

        message.error(intl.get(MODULE, 6, {errcode}));
    }

    onEditOk = async () => {
        let { me, mac, name }  = this.state;
        mac = mac.join(':').toUpperCase();

        if (me === mac) {
            message.warning(intl.get(MODULE, 7));
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
        let aliaslist = [{
            alias: name,
            mac: mac,
        }];

        let response = await common.fetchApi([
            {
                opcode: directive,
                data: { black_list: black_list }
            },
            {
                opcode: 'CLIENT_ITEM_SET',
                data: { aliaslist: aliaslist }
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
            { opcode: 'CLIENT_ALIAS_GET' },
        ]);

        let { errcode, data } = response;
        if (0 !== errcode) {
            message.error(intl.get(MODULE, 8, {errcode}));
            return;
        }

        let { black_list } = data[1].result;
        let me = data[2].result.mac.toUpperCase();
        let alias = data[3].result.aliaslist;

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
                let mac = item.mac.toUpperCase();
                let name = alias[mac] && alias[mac].alias || 'unknown';

                return {
                    name: name,
                    mac: mac,
                    time: new Date(parseInt(item.time) * 1000).toLocaleString(),
                    index: item.index
                }
            }),
            onlineList: restClients.map(item => {
                let mac = item.mac.toUpperCase();
                let hostname = alias[mac] && alias[mac].alias || item.model || item.hostname;

                return {
                    name: hostname,
                    mac: mac,
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
            editLoading, editShow, name, mac, nameTip, macTip, disAddBtn } = this.state;

        //校验手动添加-添加按钮的diasbled属性
        const keys = ['name', 'mac'];
        let check = keys.some(k => {
            return this.state[k + 'Tip'].length > 0 || this.state[k].length === 0;
        });
        const disabled = check;

        const columns = [{
            title: '',
            dataIndex: 'mac',
            width: 80,
            className: 'center',
            render: (mac, record) => (
                <Logo mac={mac} size={32} />
            )
        }, {
            title: intl.get(MODULE, 9),
            dataIndex: 'name',
            width: 300
        }, {
            title: intl.get(MODULE, 10),
            dataIndex: 'mac',
            width: 200
        }, {
            title: intl.get(MODULE, 11),
            dataIndex: 'time',
            width: 210
        }, {
            title: intl.get(MODULE, 12),
            width: 143,
            render: (text, record) => (
                <span>
                    <Popconfirm title={intl.get(MODULE, 13)} okText={intl.get(MODULE, 30)} cancelText={intl.get(MODULE, 31)} onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>{intl.get(MODULE, 14)}</a>
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
            title: intl.get(MODULE, 15),
            dataIndex: 'name',
            width: 245
        }, {
            title: intl.get(MODULE, 16),
            dataIndex: 'mac',
            width: 210,
        }, {
            title: intl.get(MODULE, 17),
            dataIndex: 'checked',
            width: 60,
            render: (checked, record) => (
                <Checkbox checked={checked} onChange={() => this.handleSelect(record.mac)}></Checkbox>
            )
        }];

        return (
            <div style={{ margin: "0 60px" }}>
                <PanelHeader title={intl.get(MODULE, 18)} />
                <div style={{ margin: "20px 20px 20px 0" }}>
                    <Button onClick={this.selectAdd} style={{ marginRight: 20 }}>{intl.get(MODULE, 19)}</Button>
                    <Button onClick={this.manualAdd}>{intl.get(MODULE, 20)}</Button>
                </div>
                <Table columns={columns} dataSource={blockLists} rowKey={record => record.index}
                    bordered size="middle" pagination={pagination} locale={{ emptyText: intl.get(MODULE, 21) }} />
                <Modal title={intl.get(MODULE, 22)} cancelText={intl.get(MODULE, 23)} okText={intl.get(MODULE, 24)} closable={false} maskClosable={false} centered={true}
                    width={960} style={{ position: 'relative' }}
                    visible={visible}
                    footer={[
                        <Button key="back" onClick={this.onSelectCancle}>{intl.get(MODULE, 23)}</Button>,
                        <Button key="submit" type="primary" disabled={disAddBtn} loading={loading} onClick={this.onSelectOk}>
                            {intl.get(MODULE, 24)}
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
                        bordered size="middle" pagination={false} locale={{ emptyText: intl.get(MODULE, 25) }} />
                </Modal>
                <Modal title={intl.get(MODULE, 26)} centered={true}
                    cancelText={intl.get(MODULE, 23)} okText={intl.get(MODULE, 24)}
                    closable={false} maskClosable={false} width={360}
                    visible={editShow}
                    confirmLoading={editLoading}
                    onOk={this.onEditOk}
                    okButtonProps={{ disabled: disabled }}
                    onCancel={this.onEditCancle} >
                    <label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 27)}</label>
                    <FormItem showErrorTip={nameTip} type="small" >
                        <Input type="text" value={name} onChange={value => this.onChange(value, 'name')} placeholder={intl.get(MODULE, 28)} maxLength={32} />
                        <ErrorTip>{nameTip}</ErrorTip>
                    </FormItem>
                    <label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 29)}</label>
                    <FormItem showErrorTip={macTip} style={{ marginBottom:8 }}>
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
