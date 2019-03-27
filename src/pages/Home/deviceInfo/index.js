import React from 'react';
import './index.scss';
import CustomIcon from '~/components/Icon';
import { Button, Divider, Popover, Modal, Table, message, Popconfirm, Input, Form } from 'antd';
import Loading from '~/components/Loading';
import classnames from 'classnames';
import { formatTime, formatSpeed } from '~/assets/common/utils';
import Logo from '~/components/Logo';

const MODULE = 'clientlist';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    }

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = (bediting) => {
        const editing = (undefined !== bediting) ? bediting : (!this.state.editing);
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            //this.toggleEdit();
            handleSave({ ...record, ...values }, () => this.toggleEdit(false));
        });
    }

    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;

        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: intl.get(MODULE, 3, {title})/*_i18n:请输入{title}*/,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                                maxLength={32}
                                            />
                                            )}
                                    </FormItem>
                                ) : (
                                        <div
                                            key={record.mac}
                                            className="editable-cell-value-wrap"
                                            onClick={this.toggleEdit}
                                        >
                                            {restProps.children}
                                        </div>
                                    )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

export default class Device extends React.Component {
    constructor(props) {
        super(props);
        this.RSSI_GOOD = intl.get(MODULE, 0)/*_i18n:较好*/;
        this.RSSI_BAD = intl.get(MODULE, 1)/*_i18n:较差*/;
        this.modeMap = {
            '0': '5G',
            '1': '2.4G',
            '2': intl.get(MODULE, 2)/*_i18n:有线*/,
        };
        this.deviceList = {
            'sunmi': '商米设备',
            'whitelist': '优先设备',
            'normal': '普通设备'
        };
        this.logoType = {
            'sunmi': '商米',
            'whitelist': '优先'
        };
        this.columns = [{
            dataIndex: 'mac',
            width: 60,
            className: 'center',
            render: (mac, record) => {
                return (
                    <div className='logo-cell'>
                        <Logo logoColor='#AEB1B9' mac={mac} model={record.model} size={32} />
                        {('sunmi' === record.type) && <img src={require('~/assets/images/sunmi-badge.svg')}></img>}
                    </div>
                )
            }
        }, {
            title: intl.get(MODULE, 4)/*_i18n:设备名称*/,
            width: 271,
            dataIndex: 'name',
            className: 'editable-cell',
            editable: true,
            defaultSortOrder: 'ascend',
            filters: [{
                text: this.deviceList['sunmi'],
                value: 'sunmi',
            }, {
                text: this.deviceList['whitelist'],
                value: 'whitelist',
            }, {
                text: this.deviceList['normal'],
                value: 'normal',
            }],
            onFilter: (value, record) => record.type.indexOf(value) === 0,
            render: (text, record, index) => {
                let ontime = formatTime(record.ontime);
                let hostname = record.name;
                let type = record.type;
                const maxWidth = (() => {
                    if (record.me && 'normal' !== type) {
                        return 124;
                    } 
                    if (record.me && 'normal' === type) {
                        return 164;
                    }
                    if ('normal' !== type) {
                        return 194;
                    }
                    return 243;
                })();
                return ([
                    <div style={{display: 'inline-flex', alignItems: 'center'}}>
                        <label className='device hostname' style={{maxWidth: maxWidth}} title={hostname}>
                            {hostname}
                        </label>
                        {record.me && <span className="current-device">（当前设备）</span>}
                        <span className={`logo ${type}`}>{this.logoType[type]}</span>
                    </div>,
                    <div className='device' title={ontime}>
                        <label style={{ marginRight: 3 }}>{intl.get(MODULE, 5)/*_i18n:在线时长:*/}</label><label>{ontime}</label>
                    </div>
                ])
            }
        }, {
            title: '信号质量'/*_i18n:信号*/,
            dataIndex: 'rssi',
            filters: [{
                text: this.RSSI_GOOD,
                value: this.RSSI_GOOD,
            }, {
                text: this.RSSI_BAD,
                value: this.RSSI_BAD,
            }],
            onFilter: (value, record) => record.rssi.indexOf(value) === 0,
            width: 140,
            render: (rssi, record) => (
                <div><i className={'dot ' + (this.RSSI_BAD == rssi ? 'warning' : '')}></i><span>{rssi}</span></div>
            )
        }, {
            title: intl.get(MODULE, 9)/*_i18n:当前速率*/,
            width: 110,
            render: (text, record) => (
                <div>
                    <div><CustomIcon type="kbyte" color='#779FF8' size={12} /><span style={{ marginLeft: 5 }}>{record.tx}</span></div>
                    <div><CustomIcon type="downloadtraffic" color='#87D068' size={12} /><span style={{ marginLeft: 5 }}>{record.rx}</span></div>
                </div>
            )
        }, {
            title: intl.get(MODULE, 10)/*_i18n:流量消耗*/,
            width: 140,
            dataIndex: 'flux',
            sorter: (a, b) => a.flux - b.flux,
            render: (flux, record) => formatSpeed(flux).replace('/s', ''),
        }, {
            title: intl.get(MODULE, 11)/*_i18n:操作*/,
            width: 169,
            render: (text, record) => {
                let type = record.type;
                return (
                    <span>
                        {'sunmi' !== type &&
                            <a
                                onClick={() => this.handleEdit(record)}
                                href="javascript:;"
                                style={{ color: "#3D76F6", fontSize: 12, marginRight: 12}}
                            >
                                {'whitelist' === record.type ? intl.get(MODULE, 12)/*_i18n:解除优先*/ : intl.get(MODULE, 13)/*_i18n:优先上网*/}
                            </a>
                        }
                        <Popconfirm
                            title={intl.get(MODULE, 14)/*_i18n:确定禁止此设备上网？*/}
                            okText={intl.get(MODULE, 15)/*_i18n:确定*/}
                            cancelText={intl.get(MODULE, 16)/*_i18n:取消*/}
                            placement="topRight"
                            onConfirm={() => this.handleDelete(record)}>
                            {
                                !record.me && <a href="javascript:;" style={{ color: "#BF4C41", fontSize: 12}}>{intl.get(MODULE, 17)/*_i18n:禁止上网*/}</a>
                            }                       
                        </Popconfirm>
                    </span>
                );
            }
        }];
    }

    state = {
        visible: false,
        refresh: false,
    }

    showMore = () => {
        this.props.stopRefresh();
        this.setState({
            visible: true
        });
    }

    handleEdit = async (record) => {
        let directive = ('normal' === record.type) ? 'QOS_AC_WHITELIST_ADD' : 'QOS_AC_WHITELIST_DELETE';

        Loading.show({ duration: 3 });
        let response = await common.fetchApi(
            { opcode: directive, data: { white_list: [{ name: record.name, mac: record.mac }] } }
        );

        let { errcode } = response;
        if (errcode == 0) {
            // 后台生效需要1秒左右，延迟2秒刷新数据，
            setTimeout(() => {
                this.props.startRefresh(true);
            }, 2000);
            return;
        }

        message.error(intl.get(MODULE, 18, {error: errcode})/*_i18n:操作失败[{error}]*/);
    }


    handleDelete = async (record) => {
        if (this.props.mac === record.mac) {
            message.warning(intl.get(MODULE, 19)/*_i18n:不能禁止本机上网*/);
            return;
        }

        Loading.show({ duration: 3 });
        let response = await common.fetchApi(
            { opcode: 'QOS_AC_BLACKLIST_ADD', data: { black_list: [{ name: record.name, mac: record.mac }] } }
        ).catch(ex => { });

        let { errcode } = response;
        if (errcode == 0) { 
            message.success(intl.get(MODULE, 20)/*_i18n:配置生效！如需恢复，可在高级设置-防蹭网中恢复上网*/);

            // 后台生效需要1秒左右，延迟2秒刷新数据，
            setTimeout(() => {
                this.props.startRefresh(true);
            }, 2000);
            return;
        }

        message.error(intl.get(MODULE, 21, {error: errcode})/*_i18n:操作失败[{error}]*/);
    }


    handleSave = async (record, toggleEdit) => {
        const { mac, name } = record;
        const clients = this.props.totalList;
        const client = clients.find((client, index) => {
            return (client.mac === record.mac);
        });

        if (client.name !== name) {
            Loading.show({ duration: 2 });
            let resp = await common.fetchApi({
                opcode: 'CLIENT_ITEM_SET',
                data: { aliaslist: [{ mac, alias: name }] },
            });

            let { errcode } = resp;
            if (0 !== errcode) {
                message.error(intl.get(MODULE, 22)/*_i18n:保存失败，设备名称过长*/);
                return;
            }

            // 后台生效需要1秒左右，延迟1.5秒刷新数据，
            setTimeout(() => {
                this.props.startRefresh(true);
                setTimeout(toggleEdit, 500);
            }, 1500);
        }else { // 数据没更改，不用发送请求保存数据
            toggleEdit();
        }
    }

    handleCancel = () => {
        this.props.startRefresh();
        this.setState({
            visible: false
        });
    }

    goWhiteList = () => {
        this.props.history.push('/advance/whitelist');
    }



    render() {
        const {visible, refresh} = this.state;
        const {sunmiLength, priorityLength, normalLength, totalList} = this.props;

        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return(
            <div className='device'>
                <span className='first-title'>
                    上网设备
                </span>
                <span className='second-title'>
                    设置优先上网设备
                </span>
                <div className='third-div'>
                    <div className='device-number'>
                        <div className='yellow'>
                        
                        </div>
                        <span className='left-border'>
                            商米设备
                        </span>
                        <span className={sunmiLength === 0 ? 'device-number-show-zero' : 'device-number-show'}>
                            {sunmiLength}
                        </span>
                    </div>
                    <div className='device-grid'>
                    
                    </div>
                    <div className='device-number'>
                        <div className='green'>
    
                        </div>
                        <span className='left-border'>
                            优先设备
                        </span>
                        <span className={priorityLength === 0 ? 'device-number-show-zero' : 'device-number-show'}>
                            {priorityLength}
                        </span>
                    </div>
                    <div className='device-grid'>
                    
                    </div>
                    <div className='device-number'>
                        <div className='blue'>
    
                        </div>
                        <span className='left-border'>
                            普通设备
                        </span>
                        <span className={normalLength === 0 ? 'device-number-show-zero' : 'device-number-show'}>
                            {normalLength}
                        </span>
                    </div>
                </div>
                <Button onClick={this.viewDevice} className="button">查看设备</Button>
                <Modal
                    visible={visible}
                    width={960}
                    closable={true}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key='cancel' onClick={this.handleCancel}>取消</Button>
                    ]}
                >
                    <div style={{padding: '0 0 16px',marginBottom: 24}}>
                        <p style={{fontSize: 16,lineHeight: '22px',fontWeight: 500,color: 'rgba(0,0,0,.85)',display: 'inline-block',marginRight: 10}}>上网设备 ({totalList.length}台)</p>
                        <Button style={{
                            display: 'inline-block',
                            border: 0,
                            padding: 0,
                            height: 22,
                        }} onClick={this.updateClientsInfo}><CustomIcon type="refresh" spin={refresh} /></Button>
                    </div>
                    <div style={{position: 'absolute',width: '100%',left: 0,top:62,borderBottom: '1px solid #e8e8e8'}}></div>
                    <Table
                        columns={columns}
                        dataSource={totalList}
                        components={components}
                        rowClassName={() => 'editable-row-device'}
                        bordered
                        rowKey={record => record.mac}
                        scroll={{ y: 336 }}
                        style={{ minHeight: 360 }}
                        size="middle"
                        pagination={false}
                        locale={{ emptyText: intl.get(MODULE, 28)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 15)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:重置*/ }}
                    />
                </Modal>
            </div>
        )
    }

    updateClientsInfo = () => {
        // 转圈1秒
        this.setState({
            refresh: true,
        }, () => {
            setTimeout(() => {
                this.setState({
                    refresh: false,
                });
            }, 1000);
        });
        // this.props.startRefresh(true);
    }
    viewDevice = () => {
        this.setState({
            visible: true
        });
    }
}