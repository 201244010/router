import React from 'react';
import { Button, Icon, Modal, message, Table, Popconfirm, Progress} from 'antd';
import CustomIcon from '~/components/Icon';
import CustomProgress from '~/components/Progress';
import { clear } from '~/assets/common/auth';
import SubLayout from '~/components/SubLayout';
import {RebootContext} from '~/context';
const MODULE = 'reboot';

class Reboot extends React.Component{
    constructor(props){
        super(props);
        this.onlineDev = [];
        this.columns = [{
            title: intl.get(MODULE, 10)/*_i18n:设备名称*/,
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
            title: intl.get(MODULE, 11)/*_i18n:接入方式*/,
            dataIndex: 'model',
            width: 240
        }, {
            title: intl.get(MODULE, 12)/*_i18n:接入方式*/,
            width: 240,
            render: (_, record) => {
                const online = record.online;
                return <div><i className={'dot ' + (online ? '' : 'offline')}></i><span style={{fontSize: 12}}>{online ? intl.get(MODULE, 13) : intl.get(MODULE, 14)}</span></div>                                
            }
        }, {
            title: intl.get(MODULE, 15)/*_i18n:接入方式*/,
            dataIndex: 'operation',
            width: 336,
            render: (_, record) => {
                const online = record.online;
                const Update = (record, online, value) => {
                    const percent = value.reboot[record.devid];
                    if ((typeof percent === 'undefined' && online) || (percent > 100 && online)) {
                        return <Popconfirm
                        title= {intl.get(MODULE, 16)}
                        okText={
                            <div className='reboot-confirm'>
                                确定
                            </div>	
                        }
                        cancelText={intl.get(MODULE, 4)}
                        placement="topRight"
                        onConfirm={() => this.reboot([record.devid], record.role, record, value)}>
                        <span style={{fontSize: 12, color: '#6174F1', cursor: 'pointer'}}>{intl.get(MODULE, 3)}</span>
                        </Popconfirm> 
                    }
         
                    if ((typeof percent === 'undefined' && !online) || (percent > 100 && !online)) {
                         return <span style={{fontSize: 12, color: '#ADB1B9' }}>{intl.get(MODULE, 3)}</span>
                    }
         
                    if (percent >= 1 || percent <= 100) {
                        return <Progress percent={percent} strokeWidth={8} size='small'></Progress>
                    }
                 }
                return (
                    <RebootContext.Consumer>
                        {
                            value => (
                                Update(record, online, value)
                            )
                        }
                    </RebootContext.Consumer>
                )
            }
        }];
    }

    state = {
        duration: 120,
        loadingActive: false,
        succeedActive: false,
        disabled: false,
        rebootModal: false,
        routerList: [],
        recordList: {}
    }

    reboot = async (devid, role, record = {}, value = {}) =>{
        let resp = await common.fetchApi({ opcode: 'SYSTEMTOOLS_RESTART',data: {devs: [...devid]} });
        const { errcode, data } = resp;
        const duration = parseInt(data[0].result.restart_duration);
        if (0 === errcode) {
            if (parseInt(role)) {
                clear();
                this.setState({
                    loadingActive: true,
                    duration: duration,
                    rebootModal: false
                });

                setTimeout(() => {
                    this.setState({
                        loadingActive: false,
                        succeedActive: true,
                    });
                }, duration * 1000);
            } else {
                value.setProgress('reboot', record, duration);
            }
        } else {
            message.error(intl.get(MODULE, 0, {error: errcode})/*_i18n:路由器重启失败[{error}]*/);    
        }
    }

    showModal = () => {
        this.setState({
            rebootModal: true
        })
    }

    rebootCancel = () => {
        this.setState({
            rebootModal: false
        })
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode:'MESH_FIRMWARE_GET' },
            { opcode: 'ROUTE_GET'},
        ], { ignoreErr: true });
        const {errcode, data} = resp;
        if (errcode !== 0) {
            message.warning(intl.get(MODULE, 17))
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

    login = () =>{
        location.href = '/login';
    }

    componentDidMount(){
        this.fetchRouter();
    }

    render(){
        const { duration, loadingActive, succeedActive, disabled, routerList, rebootModal } = this.state;
        return (
             <SubLayout className="settings">
                    <div className="system-reboot">
                        <label className="reboot-title">{intl.get(MODULE, 18)}</label>
                        <Button style={{height: 32}} disabled={disabled} type="primary" onClick={this.showModal}>{intl.get(MODULE, 6)/*_i18n:立即重启*/}</Button>
                    </div>
                    <div className="static-table">
                        <Table
                            columns={this.columns}
                            dataSource={routerList}
                            rowClassName={(record, index) => {
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
                            locale={{ emptyText: intl.get(MODULE, 19)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 8)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:重置*/ }}
                            />
                    </div>
                    {loadingActive &&
                        <CustomProgress
                            duration={duration}
                            title={intl.get(MODULE, 7)/*_i18n:正在重启路由器，请耐心等待...*/}
                        />
                    }
                    <Modal
                        visible={succeedActive}
                        className='modal-center'
                        closable={false}
                        centered={true}
                        footer={[<Button type="primary" onClick={this.login}>{intl.get(MODULE, 8)/*_i18n:确定*/}</Button>]}
                    >
                        <CustomIcon type="succeed" size={64} color='#87D068' style={{ marginTop: 20 }} />
                        <h3 style={{ marginTop: 15 }}>{intl.get(MODULE, 9)/*_i18n:重启成功，请重新连接无线网络*/}</h3>
                    </Modal>
                    <Modal
                        visible={rebootModal}
                        width={560}
                        className='reboot-modal'
                        closable={false}
                        centered={true}
                        title={<div className='reboot-modal-title'>
                                <CustomIcon color="#D0021B" type="hint" size={14}></CustomIcon>
                                <label>{intl.get(MODULE, 20)}</label>
                            </div>
                        }
                        footer={
                            [
                                <Button onClick={this.rebootCancel}>{intl.get(MODULE, 4)}</Button>,
                                <Button className="reboot-confirm" onClick={() => this.reboot(this.onlineDev, 1)}>{intl.get(MODULE, 8)/*_i18n:确定*/}</Button>
                            ]
                        }
                    >
                        <span className="reboot-modal-content">{intl.get(MODULE, 21, {duration})}</span>
                    </Modal>
            </SubLayout>
        );
    }
}

Reboot.contextType = RebootContext;
export default Reboot;