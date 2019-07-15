
import React from 'react';
import {Button, Table, message, Progress, Modal} from 'antd';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '~/components/Icon';
import Upgrade from '~/pages/UpgradeDetect/Upgrade';
const MODULE = 'sysupgrade';

export default class SysUpgrade extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            detecting: false,
            routerList: [],
            detectTip: intl.get(MODULE, 0),
            duration: 150,
            hasVersion: false,
            update: false
        };
        this.devList = {};
        this.codeList = {};
        this.columns = [{
            title: intl.get(MODULE, 1)/*_i18n:设备名称*/,
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
            title: intl.get(MODULE, 2)/*_i18n:接入方式*/,
            dataIndex: 'model',
            width: 240
        }, {
            title: intl.get(MODULE, 3)/*_i18n:接入方式*/,
            dataIndex: 'version',
            width: 240
        }, {
            title: intl.get(MODULE, 4)/*_i18n:接入方式*/,
            dataIndex: 'status',
            width: 336,
            render: (_, record) => {
                const online = record.online;
                const Upgrade = () => {
                    const {detecting} = this.state;
                    if (detecting && online) {
                        return (
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <CustomIcon type="loading" color='#6174F1' size={14} spin/>
                                <span style={{marginLeft: 4}}>{intl.get(MODULE, 5)}</span>
                            </div>
                        )
                    } else {
                        return <span style={{fontSize: 14, color: online ? '#333C4F' : '#ADB1B9' }}>
                        {record.status}
                        </span>
                    }
                }
                return (
                    Upgrade()
                )
            }
        }];
    }

    componentDidMount() {
        this.fetchRouter();
    }

    render(){
        const {detecting, routerList, detectTip, update, hasVersion} = this.state;
        return (
            <SubLayout className="settings">
                <div className='sys-upgrade'>
                    <p>
                        {intl.get(MODULE, 6)}
                    </p>
                    <div>
                        <Button onClick={this.reDetect} disabled={detecting || update} style={{marginRight: 20, borderRadius: 8}}>{detectTip}</Button>
                        <Button type="primary" disabled={detecting || update || hasVersion} onClick={this.startUpgrade}>{intl.get(MODULE, 7)}</Button>
                    </div>
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
                        // scroll={{ y: window.innerHeight - 267 }}
                        style={{ minHeight: 360 }}
                        pagination={false}
                        locale={{ emptyText: intl.get(MODULE, 8)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 15)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:重置*/ }}
                        />
                </div>
                <Upgrade ref='upgrade' />
            </SubLayout>
        );
    }

    startUpgrade = () => {
        this.refs.upgrade.startUpgrade();
    }

    reDetect = () => {
        this.setState({
            detecting: true,
            detectTip: intl.get(MODULE, 9)
        });
        setTimeout(() => this.fetchRouter(), 3000);
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode:'MESH_FIRMWARE_GET' },
            { opcode: 'ROUTE_GET'},
        ], { ignoreErr: true });
        const {errcode, data} = resp;
        if (errcode !== 0) {
            message.warning(intl.get(MODULE, 10))
        }

        let hasVersion = true;
        const routerList = [];

        data[1].result.sonconnect.devices.map(items => {
            data[0].result.upgrade.map(item => {
                if (item.devid === items.devid) {
                    const current = item.current_version;
                    const newVersion = item.newest_version;
                    const online = parseInt(item.online);
                    let versiontTip = '';
                    if (newVersion === '') {
                        versiontTip = intl.get(MODULE, 11);
                    } else {
                        versiontTip = intl.get(MODULE, 12) + newVersion;
                        hasVersion = online ? false : true;
                    }

                    return routerList.push({
                        devid: item.devid,
                        name: item.location,
                        model: item.model || '--',
                        version: current || '--',
                        status: online ? versiontTip : intl.get(MODULE, 13),
                        releaseLog: item.release_log,
                        online: online,
                        newVersion: newVersion,
                        role: items.role
                    })
                } 
            }); 
        })
        this.setState({
            routerList: routerList,
            detecting: false,
            detectTip: intl.get(MODULE, 14),
            hasVersion: hasVersion
        })
    }

}