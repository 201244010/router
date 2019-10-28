import React from 'react';
import './index.scss';
import CustomIcon from '~/components/Icon';
import { Button, Modal, Table, message, Popconfirm, Input, Form } from 'antd';
import Loading from '~/components/Loading';
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
            'sunmi': intl.get(MODULE, 42)/*_i18n:商米设备*/,
            'whitelist': intl.get(MODULE, 43)/*_i18n:优先设备*/,
            'normal': intl.get(MODULE, 44)/*_i18n:普通设备*/
        };
        this.logoType = {
            'sunmi': intl.get(MODULE, 40)/*_i18n:商米*/,
            'whitelist': intl.get(MODULE, 41)/*_i18n:优先*/
        };
        this.columns = [{
            dataIndex: 'mac',
            width: 60,
            className: 'center',
            render: (mac, record) => {
                return (
                    <React.Fragment>
                        <div className='logo-cell'>
                            <Logo logoColor='#AEB1B9' mac={mac} model={record.model} size={32} />
                        </div>
                        {('sunmi' === record.type) && <img src={require('~/assets/images/sunmi-badge.svg')} />}
                    </React.Fragment>
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
                        {record.me && <span className="current-device">{intl.get(MODULE, 46)/*_i18n:（当前设备）*/}</span>}
                        <span className={`logo ${type}`}>{this.logoType[type]}</span>
                    </div>,
                    <div className='device' title={ontime}>
                        <label style={{ marginRight: 3 }}>{intl.get(MODULE, 5)/*_i18n:在线时长:*/}</label><label>{ontime}</label>
                    </div>
                ])
            }
        }, {
            title: intl.get(MODULE, 48)/*_i18n:信号质量*/,
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
                    <div><CustomIcon className='device-icon-kbyte' type="kbyte" size={12} /><span>{record.tx}</span></div>
                    <div><CustomIcon className='device-icon-download' type="downloadtraffic" size={12} /><span>{record.rx}</span></div>
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
                            title={
                                <div className="pop-content">
                                    <label>
                                        {intl.get(
                                            MODULE,
                                            14
                                        ) /*_i18n:您确定要将此设备加入黑名单？*/}
                                    </label>
                                    <p>
                                        {intl.get(
                                            MODULE,
                                            56
                                        ) /*_i18n:可从“路由设置-黑名单”中恢复*/}
                                    </p>
                                </div>
                            }
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
                if('normal' === record.type) {
					message.success(intl.get(MODULE, 55) /*_i18n:已设为优先设备*/);
				} else {
					message.success(intl.get(MODULE, 57) /*_i18n:已解除优先设备*/);
				}
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
            message.success(intl.get(MODULE, 20)/*_i18n:配置生效！如需恢复，可在路由设置-防蹭网中恢复上网*/);

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
        this.props.history.push('/routersetting/whitelist');
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
                    {intl.get(MODULE, 49)/*_i18n:上网设备*/}
                </span>
                <span className='second-title'>
                    {intl.get(MODULE, 52)/*_i18n:设置上网设备*/}
                </span>
                <div className='third-div'>
                    <div className='device-number'>
                        <div className='yellow'>
                        
                        </div>
                        <span className='left-border'>
                            {intl.get(MODULE, 42)/*_i18n:商米设备*/}
                        </span>
                        <div className={sunmiLength === 0 ? 'device-number-show-zero' : 'device-number-show'}>
                            {sunmiLength}
                        </div>
                    </div>
                    <div className='device-grid'>
                    
                    </div>
                    <div className='device-number'>
                        <div className='green'>
    
                        </div>
                        <span className='left-border'>
                            {intl.get(MODULE, 43)/*_i18n:优先设备*/}
                        </span>
                        <div className={priorityLength === 0 ? 'device-number-show-zero' : 'device-number-show'}>
                            {priorityLength}
                        </div>
                    </div>
                    <div className='device-grid'>
                    
                    </div>
                    <div className='device-number'>
                        <div className='blue'>
    
                        </div>
                        <span className='left-border'>
                            {intl.get(MODULE, 44)/*_i18n:普通设备*/}
                        </span>
                        <div className={normalLength === 0 ? 'device-number-show-zero' : 'device-number-show'}>
                            {normalLength}
                        </div>
                    </div>
                </div>
                <Button onClick={this.viewDevice} className="button">{intl.get(MODULE, 53)/*_i18n:查看设备*/}</Button>
                <Modal
                    visible={visible}
                    width={960}
                    closable={true}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    className='deviceInfo-modal'
                    footer={[
                        <Button key='cancel' onClick={this.handleCancel}>{intl.get(MODULE, 16)/*_i18n:取消*/}</Button>
                    ]}
                >
                    <div className='deviceInfo-modal-top'>
                        <p className='modal-top-p'>{intl.get(MODULE, 49)/*_i18n:上网设备*/} ({totalList.length}{intl.get(MODULE, 50)/*_i18n:台*/})</p>
                        <Button
                            className='modal-top-button'
                            onClick={this.updateClientsInfo}
                        >
                            <CustomIcon type="refresh" spin={refresh} />
                        </Button>
                    </div>
                    <div className='modal-top-line'></div>
                    <div className="device-table">
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
                    </div>
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