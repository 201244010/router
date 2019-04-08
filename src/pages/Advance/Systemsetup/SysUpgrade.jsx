
import React from 'react';
import {Button, Table} from 'antd';
import Upgrade from '../../UpgradeDetect/Upgrade';
import SubLayout from '~/components/SubLayout';
const MODULE = 'sysupgrade';

export default class SysUpgrade extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            detecting: false
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
            width: 336
        }];
    }

    render(){
        const routerList = [{
            name: 'name',
            model: 'ip',
            version: 'dd',
            status: 'adada',
        },{
            name: 'name',
            model: 'ip',
            version: 'dd',
            status: 'adada',
        },{
            name: 'name',
            model: 'ip',
            version: 'dd',
            status: 'adada',
        }]
        const {detecting} = this.state;

        return (
            <SubLayout className="settings">
                <div className='sys-upgrade'>
                    <p>
                        检测是否有适用的新固件
                    </p>
                    <div>
                        <Button onClick={this.reDetect} style={{marginRight: 20, borderRadius: 8}}>重新检测</Button>
                        <Button type="primary" disable={detecting} onClick={this.upgrade}>全部升级</Button>
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
}

