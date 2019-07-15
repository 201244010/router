import React from 'react';
import {Table, message, Popconfirm} from 'antd';
import SubLayout from '~/components/SubLayout';
import {formatTime} from '~/assets/common/utils';

const MODULE = 'router';

export default class Router extends React.Component {
    constructor(props){
        super(props);
        this.columns = [{
            title: intl.get(MODULE, 0)/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 330,
            render: (name, record) => {
                return <div className="sub-router-set">
                    <div>
                        <img  src={require('~/assets/images/router.png')}/>
                    <ul>
                        <li>{name}</li>
                        <li>{intl.get(MODULE, 1)}{record.online ? record.uptime : '--'} </li>
                    </ul>
                    </div>
                </div>
            }
        },  {
            title: intl.get(MODULE, 2)/*_i18n:接入方式*/,
            dataIndex: 'ip',
            width: 140,
            render: (value) => {
                return <span style={{fontSize: 12, color: '#333C4F'}}>{value}</span>
            }
        }, {
            title: intl.get(MODULE, 3)/*_i18n:接入方式*/,
            dataIndex: 'mac',
            width: 180,
            render: (value) => {
                return <span style={{fontSize: 12, color: '#333C4F'}}>{value}</span>
            }
        }, {
            title: intl.get(MODULE, 4)/*_i18n:接入方式*/,
            dataIndex: 'router',
            width: 190,
            render: (router, record) => {
                return record.online ? <ul className='parent-router'>
                    <li>{router}</li>
                    <li>{record.routermac}</li>
                </ul> : '--'
            }
        }, {
            title: intl.get(MODULE, 5),
            dataIndex: 'mode',
            width: 120,
            render: (value) => {
                return <span style={{fontSize: 12, color: '#333C4F'}}>{value}</span>
            }
        }, {
            title: intl.get(MODULE, 6)/*_i18n:信号*/,
            dataIndex: 'rssi',
            width: 120,
            render: (rssi, record) => {
                if (record.online) {
                    return <div>
                        <i className={'dot ' + (intl.get(MODULE, 7) == rssi ? 'warning' : '')}></i>
                        <span style={{fontSize: 12}}>{rssi}</span>
                    </div>
                } else {
                    return <div>
                            <i className='dot offline'></i>
                            <span style={{fontSize: 12, color: '#ADB1B9'}}>{intl.get(MODULE, 8)}</span>
                    </div>
                }
            }
        }, {
            title: intl.get(MODULE, 9)/*_i18n:流量消耗*/,
            width: 136,
            render: (record) => {
                return  <Popconfirm
                            title= {
                                <div className="pop-content">
                                    <label>{intl.get(MODULE, 10)}</label>
                                    <p>{intl.get(MODULE, 11)}</p>
                                </div>
                            }
                            okText={intl.get(MODULE, 19)/*_i18n:确定*/}
                            cancelText={intl.get(MODULE, 20)/*_i18n:取消*/}
                            placement="topRight"
                            onConfirm={() => this.deleteRouter(record)}>
                            <span style={{fontSize: 14, color: '#6174F1', cursor: 'pointer'}}>{intl.get(MODULE, 12)}</span>
                        </Popconfirm>
                }
        }];
    }

    state = {
        routerList: [],
        // routerList: [{
        //         mac: 'mac',
        //         name: 'name',
        //         ip: 'ip',
        //         router: 'adad',
        //         mode: 'dd',
        //         rssi: '较好',
        //         online: 0,
        //         routermac: 'adada',
        //         uptime: '1231414131'
        // }]
    }

    deleteRouter = async (rowdetail) => {
        const resp = await common.fetchApi(
            { 
                opcode: 'ROUTE_RESET',
                data: {
                    sonconnect: [{
                        devid: rowdetail.devid,
                        mac: rowdetail.mac
                    }]
                }
            }
        )
        const {errcode} = resp;
        if (0 !== errcode) {
            message.warning(intl.get(MODULE, 13));
            return;
        }
        message.success(intl.get(MODULE, 14));
        this.fetchRouter();
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode: 'ROUTE_GET'},            
        ], {ignoreErr: true});
        const { errcode, data } = resp;
        if (0 !== errcode) {
            message.warning(intl.get(MODULE, 15));
            return;
        }

        let router = data[0].result.sonconnect.devices;
        const parentList = {};
        router.map(item => {
            parentList[item.mac.toUpperCase()] = item.location;
        });

        let routerList = router.filter((router) => router.role === '0').map(router => {
            if (router.role === '0' ) {
                let rssi;
                const connMode = router.conn_mode;
                if (connMode.wired === 1) {
                    rssi = intl.get(MODULE, 16);
                } else {
                    rssi = router.rssi >= 20 ? intl.get(MODULE, 16) : intl.get(MODULE, 17);
                }
                let mode = '';
                connMode.w_2g && (mode = mode + '/2.4G');
                connMode.w_5g && (mode = mode + '/5G');
                connMode.wired && (mode = mode + `/${intl.get(MODULE, 18)}`);
                mode[0] === '/' && (mode = mode.substr(1));

                const online = parseInt(router.online);
                const routermac = router.routermac;
                const uptime = formatTime(router.uptime);

                return {
                    devid: router.devid,
                    name: router.location,
                    ip: online ? router.ip : '--',
                    mac: router.mac,
                    router: online ? parentList[routermac.toUpperCase()] : '--',
                    routermac: routermac.toUpperCase(),
                    uptime: uptime,
                    mode: online ? mode : '--',
                    rssi: rssi,
                    online: online
                }
            }
        })

        this.setState({
            routerList: routerList
        })
    }

    componentDidMount() {
        this.fetchRouter();
    }

    render() {
        const {routerList} = this.state;
        return (
            <SubLayout className="settings">
                <div className="static-table" style={{marginTop:24}}>
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
                        locale={{ emptyText: intl.get(MODULE, 21)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 15)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:重置*/ }}
                        />
                </div>    
            </SubLayout>
        )
    }
} 