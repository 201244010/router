import React from 'react';
import {Modal, Button, Icon, message, Table, Progress, Popconfirm } from 'antd';
import CustomIcon from '~/components/Icon';
import CustomProgress from '~/components/Progress';
import {RecoveryContext} from '~/context';
import { clear } from '~/assets/common/auth';
import { PAGE_STYLE_KEY } from '~/utils';
import SubLayout from '~/components/SubLayout';

const MODULE = 'recovery';

export default class Recovery extends React.Component{
    constructor(props){
        super(props);
        this.onlineDev = [];
        this.columns = [{
            title: intl.get(MODULE, 11)/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 400,
            render: (name, record) => {
                return <div className="sub-router-set">
                    <div>
                        <img  src={require('~/assets/images/router.png')}/>
                        <label style={{marginLeft: 12}}>{record.devid} ({name})</label>
                    </div>
                </div>
            }
        },  {
            title: intl.get(MODULE, 12)/*_i18n:型号名称*/,
            dataIndex: 'model',
            width: 240
        }, {
            title: intl.get(MODULE, 13)/*_i18n:状态*/,
            width: 240,
            render: (_, record) => {
                const online = record.online;
                return <div><i className={'dot ' + (online ? '' : 'offline')}></i><span style={{fontSize: 12}}>{online ? intl.get(MODULE, 14)/*_i18n:在线*/ : intl.get(MODULE, 15)/*_i18n:离线*/}</span></div>                                
            }
        }, {
            title: intl.get(MODULE, 16)/*_i18n:操作*/,
            dataIndex: 'operation',
            width: 336,
            render: (_, record) => {
                const online = record.online;
                const Update = (record, online, value) => {
                    const percent = value.recovery[record.devid];
                    if ((typeof percent === 'undefined' && online) || (percent > 100 && online)) {
                        return <Popconfirm
                        title= {intl.get(MODULE, 17)/*_i18n:您确定将此设备恢复出厂设置？*/}
                        okText={
                            <div className='reboot-confirm'>
                                {intl.get(MODULE, 9)/*_i18n:确定*/}
                            </div>	
                        }
                        className="recovery-popconfirm"
                        cancelText={intl.get(MODULE, 4)/*_i18n:取消*/}
                        placement="topRight"
                        onConfirm={() => this.reset([record.devid], record.role, record, value)}>
                        <span style={{fontSize: 12, color: '#6174F1', cursor: 'pointer'}}>{intl.get(MODULE, 3)/*_i18n:立即恢复*/}</span>
                        </Popconfirm> 
                    }
         
                    if ((typeof percent === 'undefined' && !online) || (percent > 100 && !online)) {
                         return <span style={{fontSize: 12, color: '#ADB1B9' }}>{intl.get(MODULE, 3)/*_i18n:立即恢复*/}</span>
                    }
         
                    if (percent >= 1 || percent <= 100) {
                        return <Progress percent={percent} strokeWidth={8} size='small'></Progress>
                    }
                 }
                return (
                    <RecoveryContext.Consumer>
                        {
                            value => (
                                Update(record, online, value)
                            )
                        }
                    </RecoveryContext.Consumer>
                )
            }
        }];
    }

    state = {
        duration: 120,
        loadingActive: false,
        succeedActive: false,
        disabled: false,
        recoveryModal: false,
        routerList: [],
        recordList: {}
    }

    recoveryRouter = (record, value) => {
        const {duration} = this.state;
        const role = parseInt(record.role);
        !role && value.setProgress('recovery', record, duration);
        this.reset([record.devid], role);
    }

    reset = async (devid, role, record = {}, value = {}) =>{
        let resp = await common.fetchApi({opcode: 'SYSTEMTOOLS_RESET', data: {devs: devid}});
        const { errcode, data } = resp;
        const duration = parseInt(data[0].result.restart_duration);
        if (0 === errcode) {
            if (parseInt(role)) {
                this.setState({
                    loadingActive: true,
                    duration: duration,
                    recoveryModal: false
                });
    
                setTimeout(() => {
                    this.setState({
                        loadingActive: false,
                        succeedActive: true,
                    });
                }, duration * 1000);
            } else {
                value.setProgress('recovery', record, duration);
            }
        } else {
            // message.error(`恢复出厂失败[${errcode}]`);
            message.error(intl.get(MODULE, 0, {error: errcode})/*_i18n:恢复出厂失败[{error}]*/);
        }
    }

    showModal = () => {
        this.setState({
            recoveryModal: true
        });
    }

    recoveryCancel = () => {
        this.setState({
            recoveryModal: false
        })
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode:'MESH_FIRMWARE_GET' },
            { opcode: 'ROUTE_GET'},
        ], { ignoreErr: true });
        const {errcode, data} = resp;
        if (errcode !== 0) {
            message.warning(intl.get(MODULE, 18)/*_i18n:获取信息失败！*/)
        }
        const routerList = [];
        data[1].result.sonconnect.devices.map(item => {
            data[0].result.upgrade.map(items => {
                if (item.devid === items.devid) {
                    return routerList.push({
                        devid: item.devid,
                        name: item.location,
                        model: items.model || '--',
                        online: parseInt(item.online),
                        role: item.role
                    })
                }
            })
        })
        routerList.map(item => {
            item.online === 1 && this.onlineDev.push(item.devid);
        });

        this.setState({
            routerList: routerList
        });
    }

    guide = () => {
        try {   // Fix SIG-909
            web = window.sessionStorage.removeItem(PAGE_STYLE_KEY);
        } catch(e) {}

        clear();        // 删除认证信息
        location.href = '/';
    }

    componentDidMount(){
        this.fetchRouter();
    }

    render(){
        const { duration, loadingActive, succeedActive, disabled, routerList, recoveryModal} = this.state;
        return (
             <SubLayout className="settings">
                        <div className="system-recovery">
                            <label className="recovery-title">{intl.get(MODULE, 19)/*_i18n:恢复出厂设置*/}</label>
                            <Button style={{height: 32}} disabled={disabled} type="primary" onClick={this.showModal}>{intl.get(MODULE, 20)/*_i18n:全部恢复*/}</Button>
                        </div>
                        <div className="static-table">
                            <Table
                                columns={this.columns}
                                dataSource={routerList}
                                rowClassName={(_, index) => {
                                    let className = 'editable-row';
                                    if (index % 2 === 1) {
                                        className = 'editable-row-light';
                                    }
                                    return className;
                                }}
                                bordered={false}
                                rowKey={record => record.mac}
                                style={{ minHeight: 360 }}
                                pagination={false}
                                locale={{ emptyText: intl.get(MODULE, 21)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 9)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:undefined*/ }}
                                />
                        </div>
                        {loadingActive &&
                            <CustomProgress
                                duration={duration}
                                title={intl.get(MODULE, 7)/*_i18n:正在恢复出厂设置，请耐心等待...*/}
                                tips={intl.get(MODULE, 8)/*_i18n:恢复出厂过程中请勿断电！*/}
                            />
                        }
                        <Modal
                            visible={succeedActive}
                            className='modal-center'
                            closable={false}
                            centered={true}
                            footer={[<Button type="primary" onClick={this.guide}>{intl.get(MODULE, 9)/*_i18n:确定*/}</Button>]}
                        >
                            <CustomIcon className='center-icon-succeed' type="succeed" size={64} />
                            <h3 style={{ marginTop: 15 }}>{intl.get(MODULE, 10)/*_i18n:恢复出厂设置完成，请重新连接无线网络*/}</h3>
                        </Modal>
                        <Modal
                            visible={recoveryModal}
                            width={560}
                            className='reboot-modal'
                            closable={false}
                            centered={true}
                            title={<div className='reboot-modal-title'>
                                    <CustomIcon className='reboot-icon-hint' type="hint" size={14} />
                                    <label>{intl.get(MODULE, 1)/*_i18n:警告*/}</label>
                                </div>
                            }
                            footer={
                                [
                                    <Button onClick={this.recoveryCancel}>{intl.get(MODULE, 4)/*_i18n:取消*/}</Button>,
                                    <Button className="reboot-confirm" onClick={() => this.reset(this.onlineDev, 1)}>{intl.get(MODULE, 9)/*_i18n:确定*/}</Button>
                                ]
                            }
                        >
                            <span className="reboot-modal-content">{intl.get(MODULE, 22, {duration})/*_i18n:路由器恢复出厂设置需要等待{duration}秒左右，确定要重启全部恢复出厂设置？*/}</span>
                        </Modal>
                </SubLayout>
        );
    }
}