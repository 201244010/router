
import React from 'react';
import {Button, Table, message} from 'antd';
import Upgrade from '../../UpgradeDetect/Upgrade';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '~/components/Icon';

const MODULE = 'sysupgrade';

export default class SysUpgrade extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            detecting: false,
            routerList: [],
            detectTip: '重新检测'
        }
        this.columns = [{
            title: '设备名称'/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 400,
        },  {
            title: '型号名称'/*_i18n:接入方式*/,
            dataIndex: 'model',
            width: 240
        }, {
            title: '当前版本'/*_i18n:接入方式*/,
            dataIndex: 'version',
            width: 240
        }, {
            title: '状态'/*_i18n:接入方式*/,
            dataIndex: 'status',
            width: 336,
            render: (value, record) => {
                console.log(value, record);
                const {detecting} = this.state;
                const online = record.online;
                if (detecting && online) {
                    return (
                        <div>
                            <CustomIcon type="refresh" color='#779FF8' size={14} spin/>
                            <span style={{marginLeft: 4}}>检测中...</span>
                        </div>
                    )
                } else {
                    return <span style={{fontSize: 14, color: online ? '#333C4F' : '#ADB1B9' }}>
                    {record.status}
                    </span>
                } 
            }
        }];
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode:'FIRMWARE_GET' },
            { opcode: 'ROUTE_GET' }
        ], { ignoreErr: true });
        const {errcode, data} = resp;
        console.log(resp);
        if (errcode !== 0) {
            message.warning('获取信息失败！')
        }

        const routerList = data[0].result.upgrade.map(item => {
            const current = item.current_version;
            const newVersion = item.newest_version;
            let versiontTip = '';
            if (current === newVersion) {
                versiontTip = '当前已是最新版本';
            } else {
                versiontTip = '发现新版本：' + newVersion
            }
            return {
                name: item.devid,
                model: 'W1',
                version: current,
                status: versiontTip,
                online: 1
            }
        });

        data[1].result.sonconnect.devices.map(item => {
            if (item.online === '0') {
                routerList.push({
                    name: item.devid,
                    model: 'W1',
                    version: '--',
                    status: '设备已离线',
                    online: 0
                })
            }
        })

        this.setState({
            routerList: routerList
        })
    }

    componentDidMount() {
        this.fetchRouter();
    }

    render(){
        const {detecting, routerList, detectTip} = this.state;

        return (
            <SubLayout className="settings">
                <div className='sys-upgrade'>
                    <p>
                        检测是否有适用的新固件
                    </p>
                    <div>
                        <Button onClick={this.reDetect} style={{marginRight: 20, borderRadius: 8}}>{detectTip}</Button>
                        <Button type="primary" disabled={detecting} onClick={this.upgrade}>全部升级</Button>
                    </div>
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
                        // scroll={{ y: window.innerHeight - 267 }}
                        style={{ minHeight: 360 }}
                        pagination={false}
                        locale={{ emptyText: intl.get(MODULE, 28)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 15)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:重置*/ }}
                        />
                </div>
            </SubLayout>
        );
    }

    reDetect = () => {
        this.setState({
            detecting: true,
            detectTip: '检测中...'
        });
    }
}

