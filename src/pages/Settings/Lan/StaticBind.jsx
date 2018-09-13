
import React from 'react';
import { Button, Table, Divider} from 'antd';

const pagination = {
    pageSize: 6,
    hideOnSinglePage: true
};

const data = [{
    name: 'John Brown John Brown John Brown John Brown John Brown John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.100',
    state: '0',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.101',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.102',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.103',
    state: '0',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.100',
    state: '0',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.101',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.102',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.103',
    state: '0',
}, {
    name: 'John Brown John Brown John Brown John Brown John Brown John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.100',
    state: '0',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.101',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.102',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.103',
    state: '0',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.100',
    state: '0',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.101',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.102',
    state: '1',
}, {
    name: 'John Brown',
    mac: '00:AA:BB:CC:DD:11',
    ip: '192.168.0.103',
    state: '0',
}];

export default class StaticBind extends React.Component {
    state = {
        filteredInfo: null,
        sortedInfo: null,
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    }

    manualAdd = () => {
        this.setState({ filteredInfo: null });
    }

    selectAdd = () => {
        this.setState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            },
        });
    }

    render() {
        let { sortedInfo, filteredInfo } = this.state;
        const columns = [{
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
            width:340
        }, {
            title: 'MAC地址',
            dataIndex: 'mac',
            key: 'mac',
            width:200
        }, {
            title: 'IP地址',
            dataIndex: 'ip',
            key: 'ip',
            width: 160
        }, {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            width:90,
            render: state => (
                <span>
                    {state == 0 ? (<label style={{ color: '#D33419' }}>失效</label>) : (<label>有效</label>)}
                </span>
            )
        }, {
            title: '操作',
            key: 'action',
            width:140,
            render: (text, record) => (
                <span>
                    <a href="javascript:;" style={{ color:"#3D76F6"}}>编辑</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" style={{ color:"#FB8632"}}>删除</a>
                </span>
            )
        }];
        return (
            <div>
                <div style={{margin:"20px 20px 20px 0"}}>
                    <Button onClick={this.selectAdd} style={{marginRight:20}}>在线列表添加</Button>
                    <Button onClick={this.manualAdd}>手动添加</Button>
                </div>
                <Table columns={columns} dataSource={data} onChange={this.handleChange} bordered size="middle" pagination={pagination}/>
            </div>
        );
    }
};







