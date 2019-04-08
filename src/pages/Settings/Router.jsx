import React from 'react';
import {Table, message} from 'antd';
import SubLayout from '~/components/SubLayout';


const MODULE = 'clientlist';

export default class Router extends React.Component {
    constructor(props){
        super(props);
        this.columns = [{
            title: '设备名称'/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 330,
        },  {
            title: 'IP地址'/*_i18n:接入方式*/,
            dataIndex: 'ip',
            width: 140
        }, {
            title: 'MAC地址'/*_i18n:接入方式*/,
            dataIndex: 'mac',
            width: 180
        }, {
            title: '上级路由'/*_i18n:接入方式*/,
            dataIndex: 'router',
            width: 190
        }, {
            title: '连接方式',
            dataIndex: 'mode',
            width: 120
        }, {
            title: '信号质量'/*_i18n:信号*/,
            dataIndex: 'rssi',
            width: 120
        }, {
            title: '操作'/*_i18n:流量消耗*/,
            width: 136,
        }];
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode: 'ROUTE_GET'},            
        ], {ignoreErr: true});
        const { errcode, data } = resp;
        if (0 !== errcode) {
            message.warning('请求失败');
            return;
        }

        let router = data[0].result.sonconnect.devices;

        let routerList = router.map(router => {

            return {
                name: '',
                ip: '',
                mac: '',
                router: '',
                mode: '',
                rssi: ''
            }
        })
    }

    deleteRouter = async () => {
        const resp = await common.fetchApi({
            opcode: 'ROUTE_RESET',
            data: {
                sonconnect: [{devid: devid, mac: mac}]
            }
        })
        const { errcode } = resp;
        if (errcode !== 0) {
            message.warning('设置失败');            
        }
    }

    componentDidMount() {
        //this.fetchRouter();
    }

    render() {
        const routerList = [{
            mac: 'mac',
            name: 'name',
            ip: 'ip',
            router: 'adad',
            mode: 'dd',
            rssi: 'adada',
        }]

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
                        // scroll={{ y: window.innerHeight - 267 }}
                        style={{ minHeight: 360 }}
                        pagination={false}
                        locale={{ emptyText: intl.get(MODULE, 28)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 15)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:重置*/ }}
                        />
                </div>    
            </SubLayout>
        )
    }
} 