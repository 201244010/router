import React from 'react';
import { Button, Table, Popconfirm, Modal, Checkbox, message } from 'antd';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';
import PanelHeader from '~/components/PanelHeader';
import { checkMac } from '~/assets/common/check';
import Form from "~/components/Form";
import SubLayout from '~/components/SubLayout';
import './index.scss';

const MODULE = 'flowControl';

const { FormItem, ErrorTip, InputGroup, Input } = Form;
const confirm = Modal.confirm;
const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
};

class FlowControl extends React.Component {
    constructor(props) {
        super(props);
        this.blockLists = [],
        this.factory = 1;
    }
    state = {
        controlEnable: false,
        mode: 'device',
        visible: false,    // 是否显示在线客户端列表弹窗
        loading: false,          // 保存loading,
        disAddBtn: true,
        editLoading: false,
        saveLoading: false,
        editShow: false,
        name: '',
        mac: [],
        me: '',
        nameTip: '',
        macTip: '',
        blockLists: [],
        onlineList: []
    };

    onControlEnableChange = async(value) =>{
        const { mode } = this.state;
        const response = await common.fetchApi([
            {
                opcode: 'MOBILE_TC_GLOBAL_SET',
                data: {
                    global: {
                        enable: value? 'on':'off',
                        mode,
                    },
                }
            }
        ], { loading: true });

        const { errcode } = response;
        if( errcode === 0) {
            this.setState({
                controlEnable: value
            });
            message.success(value?intl.get(MODULE, 29)/*_i18n:开启成功*/:intl.get(MODULE, 30)/*_i18n:关闭成功*/);
            this.fetchBasic(true);
        } else {
            this.setState({
                controlEnable: !value
            });
            message.error(intl.get(MODULE, 31)/*_i18n:操作失败*/);
        }
    }

    onChange = (val, key) => {
        let tip = '';

        let valid = {
            name: {
                func: (val) => {
                    return (val.length <= 0) ? intl.get(MODULE, 0)/*_i18n:请输入备注名称*/ : '';
                },
            },
            mac: {
                func: checkMac,
            },
        };

        tip = valid[key].func(val, valid[key].args);

        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val),
            [key + 'Tip']: tip,
        });
    }

    selectAdd = () => {
        const { onlineList, me } = this.state;

        this.setState({
            onlineList: onlineList.map(item => {
                if(item.devicetype !== '' || item.mac === me) {
                    item.checked = true;
                }
                return item;
            }),
            visible: true,
        },() => {
            const checked = this.state.onlineList.some(item => {
                return item.checked;
            });
            this.setState({
                disAddBtn: !checked,
            });
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
        const { blockLists } = this.state;
        if(blockLists.length === 1) {
            confirm({
                title: intl.get(MODULE, 34)/*_i18n:提示*/,
                content: '移除该设备后，将无设备可以使用4G，确认移除？',
                onOk:() => this.deviceDelete(record),
                onCancel(){   

                },
                cancelText: intl.get(MODULE, 13)/*_i18n:取消*/,
                okText: intl.get(MODULE, 12)/*_i18n:确定*/,
                centered: true
            });
        } else {
            this.deviceDelete(record);
        }
    }

    deviceDelete = async(record) => {
        const { controlEnable, mode } = this.state;
        const response = await common.fetchApi([
            {
                opcode: 'MOBILE_TC_DELETE',
                data: {
                    global:{
                        enable: controlEnable? 'on':'off',
                        mode: mode,
                    },
                    white_list:[
                        // mode === 'device'?
                        // {
                        //     name: record.name,
                        //     mac: record.mac,
                        //     devicetype: record.devicetype
                        // }
                        // :
                        // {
                        //     class: record.class,
                        //     name: record.name,
                        //     appid: record.appid,
                        // }
                        record,
                    ]
                }
            }
        ])

        const { errcode } = response;
        if(errcode === 0) {
            this.fetchBasic(false);
            message.success(intl.get(MODULE, 1)/*_i18n:删除成功*/);
        } else {
            message.success(intl.get(MODULE, 28)/*_i18n:删除失败*/);
        }
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
        const { onlineList, mode, controlEnable } = this.state;
        this.setState({
            loading: true
        });
        const checkedList = onlineList.filter(item => item.checked);
        const response = await common.fetchApi([
            {
                opcode: 'MOBILE_TC_ADD',
                data: {
                    global:{
                        enable: this.factory == 0? "on" : controlEnable? "on":"off",
                        mode,
                    },
                    white_list: checkedList,
                }
            }
        ]);

        const { errcode } = response;
        if( errcode === 0 ) {
            this.fetchBasic(false);
            this.setState({
                loading: false,
                visible: false,
            });
            message.success(intl.get(MODULE, 2)/*_i18n:添加成功*/);
        } else {
            this.setState({
                loading: false
            });
            message.success(intl.get(MODULE, 33)/*_i18n:添加失败*/);
        }
    }

    onEditOk = async () => {
        this.setState({
            editLoading: true
        });
        let { mac, name, blockLists, controlEnable, mode }  = this.state;
        mac = mac.join(':').toUpperCase();

        
        if (blockLists.some(item => item.mac === mac)) {
            this.setState({
                editLoading: false,
            });
            message.warning(intl.get(MODULE, 3)/*_i18n:该设备已在白名单，无需重复添加*/);
            return;
        }

        if(this.blockLists.some(item => item.mac === mac)) {
            this.setState({
                editLoading: false,
            });
            message.warning('该设备已在黑名单中，无法添加');
            return;
        }

        const response = await common.fetchApi([
            {
                opcode: 'MOBILE_TC_ADD',
                data: {
                    global:{
                        enable: controlEnable? "on":"off",
                        mode,
                    },
                    white_list: [
                        {
                            name,
                            mac,
                            devicetype: "",
                        } 
                    ],
                }
            }
        ]);
        
        const { errcode } = response;
        if(errcode === 0) {
            this.fetchBasic(false);
            this.setState({
                editLoading: false,
                editShow: false,
            });
            message.success(intl.get(MODULE, 2)/*_i18n:添加成功*/);
        } else {
            this.setState({
                editLoading: false,
            });
            message.success(intl.get(MODULE, 33)/*_i18n:添加失败*/);
        }
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

    factorySet = () => {
        const { onlineList, me } = this.state;

        this.setState({
            onlineList: onlineList.map(item => {
                if(item.devicetype !== '' || item.mac === me) {
                    item.checked = true;
                }
                return item;
            }),
            visible: true,
        }, () => {
            const checked = this.state.onlineList.some(item => {
                return item.checked;
            });
            this.setState({
                disAddBtn: !checked,
            });
        })
    }

    fetchBasic = async (checkable) => {
        let response = await common.fetchApi([
            { opcode: 'CLIENT_LIST_GET' },
            { opcode: 'MOBILE_TC_LIST_GET', data: { global: { mode: 'device' } } },
            { opcode: 'WHOAMI_GET' },
            { opcode: 'CLIENT_ALIAS_GET' },
            { opcode: 'QOS_AC_BLACKLIST_GET' },
        ]);

        let { errcode, data } = response;
        if (0 !== errcode) {
            message.error(intl.get(MODULE, 4, {error: errcode})/*_i18n:接口错误[{error}]*/);
            return;
        }

        const {
            global: {
                enable,
                mode,
                factory, 
            },
            white_list,
        } = data[1].result;
        let me = data[2].result.mac.toUpperCase();
        let alias = data[3].result.aliaslist;
        let { black_list } = data[4].result;
    
        this.blockLists = black_list;
        let restClients = data[0].result.data.filter(item => {
            let mac = item.mac.toUpperCase();
            return (!!!(white_list.find(client => {return (mac == client.mac.toUpperCase());}))) && (!!!(black_list.find(client => {return (mac == client.mac.toUpperCase());})));
        });

        const onlineList = restClients.map(item => {
            let mac = item.mac.toUpperCase();
            let hostname = alias[mac] && alias[mac].alias || item.model || item.hostname;
            return {
                name: hostname.substring(0,32),
                mac: mac,
                devicetype: item.model,
                checked: false,
            }
        });

        const blockLists = white_list.map((item, index) => {
            let mac = item.mac.toUpperCase();
            let name = alias[mac] && alias[mac].alias || item.name || 'unknown';
            return {
                name: name.substring(0,32),
                mac,
                index,
                devicetype: item.devicetype || '',
            }
        });

        const SUNMIList  = onlineList.filter(item => item.devicetype !== '');
        const meList = onlineList.filter(item => item.mac === me);
        const restList = onlineList.filter(items => !(SUNMIList.some(item => item.mac === items.mac) || meList.some(item => item.mac === items.mac)));

        const newOnlineList = [];
        SUNMIList.map(item => newOnlineList.push(item));
        meList.map(item => newOnlineList.push(item));
        restList.map(item => newOnlineList.push(item));

        this.setState({
            controlEnable: enable !== 'off',
            mode,
            me: me,
            blockLists: blockLists,
            onlineList: newOnlineList,
        });

        this.factory = factory;
        if(checkable && (factory == 0 || (blockLists.length === 0 && enable === 'on') )) {
            confirm({
                title: intl.get(MODULE, 34)/*_i18n:提示*/,
                content: intl.get(MODULE, 35)/*_i18n:当前设备白名单为空，打开流量控制开关，将无设备可以使用4G！是否先添加白名单设备？*/,
                onOk: this.factorySet,
                onCancel(){   

                },
                cancelText: intl.get(MODULE, 13)/*_i18n:取消*/,
                okText: intl.get(MODULE, 12)/*_i18n:确定*/,
                centered: true
            });
        }
    }

    componentDidMount() {
        this.fetchBasic(true);
    }

    render() {
        let { controlEnable, mode, blockLists, onlineList, visible, loading,
            editLoading, editShow, name, mac, nameTip, macTip, disAddBtn, saveLoading, me } = this.state;
        const ManualBtn = [nameTip, macTip].some(item => item !== '') || name=== '' || mac.some(item => item === '');

        const columns = [
            {
                title: intl.get(MODULE, 7)/*_i18n:设备名称*/,
                dataIndex: 'mac',
                width: 520,
                className: 'center',
                render: (mac, record) => (
                    <div className="black-list">
                        <div style={{display: 'inline-block'}}>
                            <Logo mac={mac} model={record.devicetype} size={32} />
                        </div>
                        <label>{record.name}{mac === me? intl.get(MODULE, 8)/*_i18n:（当前设备）*/:'' }</label>
                    </div>
                )
            },
            {
                title: intl.get(MODULE, 9)/*_i18n:MAC地址*/,
                dataIndex: 'mac',
                width: 400
            }, 
            {
                title: intl.get(MODULE, 10)/*_i18n:操作*/,
                width: 296,
                render: (text, record) => (
                    <span>
                        <Popconfirm title={intl.get(MODULE, 11)/*_i18n:你确定要将此设备从白名单中移除？*/} okText={intl.get(MODULE, 12)/*_i18n:确定*/} cancelText={intl.get(MODULE, 13)/*_i18n:取消*/} onConfirm={() => this.handleDelete(record)}>
                            <a href="javascript:;" style={{ color: "#3D76F6" }}>{intl.get(MODULE, 14)/*_i18n:移除白名单*/}</a>
                        </Popconfirm>
                    </span>
                )
            }
        ];

        const onlineCols = [{
            title: '',
            dataIndex: 'mac',
            width: 60,
            className: 'center',
            render: (mac, record) => (
                <Logo mac={mac} model={record.devicetype} size={32} />
            )
        }, {
            title: intl.get(MODULE, 7)/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 390,
            render: (name, record) => (
                <label>{record.name}{record.mac === me? intl.get(MODULE, 8)/*_i18n:（当前设备）*/:'' }</label>
            ),
        }, {
            title: intl.get(MODULE, 9)/*_i18n:MAC地址*/,
            dataIndex: 'mac',
            width: 345,
        }, {
            title: intl.get(MODULE, 10)/*_i18n:操作*/,
            dataIndex: 'checked',
            width: 125,
            render: (checked, record) => (
                <Checkbox checked={checked} onChange={() => this.handleSelect(record.mac)}></Checkbox>
            )
        }];

        return (
            <SubLayout className="settings">
                <div className='flowControl-head'>
                    <PanelHeader title={intl.get(MODULE, 15)/*_i18n:设备流量控制*/} checkable={true} checked={controlEnable} onChange={value => this.onControlEnableChange(value)}/>
                    {!controlEnable&&<span className='head-description'>{intl.get(MODULE, 32)/*_i18n:开启设备流量控制，只有白名单设备可以在宽带中断时，切换至4G，节省成本*/}</span>}
                </div>
                {controlEnable &&<React.Fragment>
                    <div className='flowControl-info'>
                        <p>{intl.get(MODULE, 16)/*_i18n:白名单设备*/}</p>
                        <div>
                            <Button onClick={this.selectAdd} className='info-button'>{intl.get(MODULE, 17)/*_i18n:列表添加*/}</Button>
                            <Button onClick={this.manualAdd}>{intl.get(MODULE, 18)/*_i18n:手动添加*/}</Button>
                        </div>
                    </div>
                    <div className="static-table">
                            <Table columns={columns} dataSource={blockLists} 
                            rowKey={record => record.index}
                            rowClassName={(record, index) => {
                                let className = 'editable-row';
                                if (index % 2 === 1) {
                                    className = 'editable-row-light';
                                }
                                return className;
                            }}
                            bordered={false} size="middle" pagination={pagination} locale={{ emptyText: intl.get(MODULE, 27)/*_i18n:暂无设备*/ }} />
                    </div>
                </React.Fragment>}
                <Modal
                    closable={false}
                    maskClosable={false}
                    centered={true}
                    width={960}
                    style={{ position: 'relative' }}
                    visible={visible}
                    footer={
                        <div className='footer-buttons'>
                            <Button key="back" onClick={this.onSelectCancle}>{intl.get(MODULE, 19)/*_i18n:取消*/}</Button>
                            <Button key="submit" type="primary" className='buttons-add' disabled={disAddBtn} loading={loading} onClick={this.onSelectOk}>{intl.get(MODULE, 20)/*_i18n:添加*/}</Button>
                        </div>
                    } >
                    <div className='modal-header'>
                        <p className='header-title'>{intl.get(MODULE, 21)/*_i18n:在线列表*/}</p>
                        <Button size="large" className='header-refresh' onClick={this.fetchBasic}><CustomIcon type="refresh" /></Button>
                    </div>
                    <div className='modal-header-line'></div>
                    <Table columns={onlineCols} dataSource={onlineList} rowKey={record => record.mac}
                        scroll={{ y: 336 }}
                        style={{ minHeight: 360 }}
                        bordered size="middle" pagination={false} locale={{ emptyText: intl.get(MODULE, 22)/*_i18n:暂无设备*/ }} />
                </Modal>
                <Modal
                    title={intl.get(MODULE, 23)/*_i18n:手动添加设备*/}
                    centered={true}
                    closable={false}
                    maskClosable={false}
                    width={360}
                    visible={editShow}
                    footer={
                        <div className='footer-buttons'>
                            <Button key="back" onClick={this.onEditCancle}>{intl.get(MODULE, 19)/*_i18n:取消*/}</Button>
                            <Button key="submit" type="primary" className='buttons-add' disabled={ManualBtn} loading={editLoading} onClick={this.onEditOk}>{intl.get(MODULE, 20)/*_i18n:添加*/}</Button>
                        </div>
                    }>
                    <label className='modal-body-label'>{intl.get(MODULE, 24)/*_i18n:备注名称*/}</label>
                    <FormItem showErrorTip={nameTip} type="small" >
                        <Input type="text" value={name} onChange={value => this.onChange(value, 'name')} placeholder={intl.get(MODULE, 25)/*_i18n:请输入备注名称*/} maxLength={32} />
                        <ErrorTip>{nameTip}</ErrorTip>
                    </FormItem>
                    <label className='modal-body-label'>{intl.get(MODULE, 26)/*_i18n:MAC地址*/}</label>
                    <FormItem showErrorTip={macTip} className='modal-body-lastFormItem'>
                        <InputGroup size="small" type="mac"
                            inputs={[{ value: mac[0], maxLength: 2 }, { value: mac[1], maxLength: 2 }, { value: mac[2], maxLength: 2 }, { value: mac[3], maxLength: 2 }, { value: mac[4], maxLength: 2 }, { value: mac[5], maxLength: 2 }]}
                            onChange={value => this.onChange(value, 'mac')} />
                        <ErrorTip>{macTip}</ErrorTip>
                    </FormItem>
                </Modal>
            </SubLayout>
        );
    }
};

export default FlowControl;
