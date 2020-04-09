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

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
};

class FlowControl extends React.Component {
    constructor(props) {
        super(props);
        this.onlineList = [];
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
        if(!value) {
            const { mode, blockLists } = this.state;
            const whiteList = blockLists.map(item => {
                return {
                    name: item.name,
                    mac: item.mac,
                };
            })
            const response = await common.fetchApi([
                {
                    opcode: 'MOBILE_TC_MODIFY',
                    data: {
                        global: {
                            enable: value? 'on':'off',
                            mode,
                        },
                        white_list: whiteList,
                    }
                }
            ], { loading: true });

            const { errcode } = response;
            if( errcode === 0) {
                this.setState({
                    controlEnable: value
                });
                message.success(value?intl.get(MODULE, 29)/*_i18n:开启成功*/:intl.get(MODULE, 30)/*_i18n:关闭成功*/);
                this.fetchBasic();
            } else {
                this.setState({
                    controlEnable: !value
                });
                message.error(intl.get(MODULE, 31)/*_i18n:操作失败*/);
            }
        } else {
            this.setState({
                controlEnable: value
            });
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
        const { onlineList, blockLists } = this.state;
        const filterList = onlineList.filter(item => !blockLists.some(list => list.mac === item.mac));
        this.setState({
            onlineList: filterList,
            visible: true,
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
        const { onlineList, blockLists } = this.state;
        const filterList = blockLists.filter(item => !(item.mac === record.mac));
        const inOnlineList = this.onlineList.some(item => item.mac === record.mac);

        //判断是否在一开始的在线列表里，如果之前是手动添加的就不用恢复到在线列表里
        if (inOnlineList) {
            onlineList.push({name: record.name, mac: record.mac});
        }

        this.setState({
            blockLists: filterList,
            onlineList,
        });
        message.success(intl.get(MODULE, 1)/*_i18n:删除成功*/);
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
        const { onlineList, blockLists } = this.state;
        this.setState({
            loading: true
        });

        const checked = onlineList.filter(item => item.checked);
        const unchecked = onlineList.filter(item => !item.checked);
        checked.map(item => {
            blockLists.push({
                mac: item.mac,
                name: item.name,
            });
        });
        this.setState({
            blockLists,
            onlineList: unchecked,
            visible: false,
            editShow: false,
            loading: false
        });
        message.success(intl.get(MODULE, 2)/*_i18n:添加成功*/);
    }

    onEditOk = async () => {
        this.setState({
            editLoading: true
        });
        let { mac, name, blockLists }  = this.state;
        mac = mac.join(':').toUpperCase();

        
        if (blockLists.some(item => item.mac === mac)) {
            this.setState({
                editLoading: false,
            });
            message.warning(intl.get(MODULE, 3)/*_i18n:该设备已在白名单，无需重复添加*/);
            return;
        }

        blockLists.push({mac, name});
        this.setState({
            editLoading: false,
            editShow: false,
        });
        message.success(intl.get(MODULE, 2)/*_i18n:添加成功*/);
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
            { opcode: 'MOBILE_TC_GET' },
            { opcode: 'WHOAMI_GET' },
            { opcode: 'CLIENT_ALIAS_GET' },
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
            },
            whitedevice_list,
            whiteapp_list,
        } = data[1].result;
        let me = data[2].result.mac.toUpperCase();
        let alias = data[3].result.aliaslist;

        let restClients = data[0].result.data.filter(item => {
            let mac = item.mac.toUpperCase();
            return (mac !== me) && !!!(whitedevice_list.find(client => {
                return (mac == client.mac.toUpperCase());
            }));
        });

        this.onlineList = restClients.map(item => {
            let mac = item.mac.toUpperCase();
            let hostname = alias[mac] && alias[mac].alias || item.model || item.hostname;

            return {
                name: hostname,
                mac: mac,
                checked: false
            }
        });

        this.setState({
            controlEnable: enable !== 'off',
            mode,
            me: me,
            blockLists: whitedevice_list.map((item, index) => {
                let mac = item.mac.toUpperCase();
                let name = alias[mac] && alias[mac].alias || item.name || 'unknown';

                return {
                    name,
                    mac,
                    index,
                }
            }),
            onlineList: this.onlineList,
        });
    }

    save = async() => {
        this.setState({
            saveLoading: true,
        });
        const { mode, controlEnable, blockLists } = this.state;
        const whiteList = blockLists.map(item => {
            return {
                name: item.name,
                mac: item.mac,
            };
        })
        const response = await common.fetchApi([
            {
                opcode: 'MOBILE_TC_MODIFY',
                data: {
                    global: {
                        enable: controlEnable? 'on':'off',
                        mode,
                    },
                    white_list: whiteList,
                }
            }
        ]);
        this.setState({
            saveLoading: false,
        });
        const { errcode } = response;
        if( errcode === 0) {
            message.success(intl.get(MODULE, 5)/*_i18n:保存成功*/);
            this.fetchBasic();
        } else {
            message.error(intl.get(MODULE, 6)/*_i18n:保存失败*/);
        }
        
    }

    componentDidMount() {
        this.fetchBasic();
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
                            <Logo mac={mac} size={32} />
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
                    <React.Fragment>
                    {
                        record.mac !== me?
                        <span>
                            <Popconfirm title={intl.get(MODULE, 11)/*_i18n:你确定要将此设备从白名单中移除？*/} okText={intl.get(MODULE, 12)/*_i18n:确定*/} cancelText={intl.get(MODULE, 13)/*_i18n:取消*/} onConfirm={() => this.handleDelete(record)}>
                                <a href="javascript:;" style={{ color: "#3D76F6" }}>{intl.get(MODULE, 14)/*_i18n:移除白名单*/}</a>
                            </Popconfirm>
                        </span>
                        :
                        <span style={{ color: "#ADB1B9" }}>{intl.get(MODULE, 14)/*_i18n:移除白名单*/}</span>
                    }
                    </React.Fragment>
                )
            }
        ];

        const onlineCols = [{
            title: '',
            dataIndex: 'mac',
            width: 60,
            className: 'center',
            render: (mac, record) => (
                <Logo mac={mac} size={32} />
            )
        }, {
            title: intl.get(MODULE, 7)/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 390,
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
                    <div className='flowControl-save'>
                        <Button type="primary" className='save-btn' loading={saveLoading} onClick={this.save}>{intl.get(MODULE, 28)/*_i18n:保存*/}</Button>
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
