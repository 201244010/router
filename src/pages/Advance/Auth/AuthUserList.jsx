
import React from 'react';
import { Table, Popconfirm, message } from 'antd';
import Logo from '~/components/Logo';

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => `已添加${total}台设备`,
};

export default class AuthUserList extends React.Component{

    state={
        authUserList :[]
    }

    formatTime = (total) => {
        let seconds = parseInt(total, 10);
        let day = parseInt(seconds / 86400);
        let hour = parseInt((seconds % 86400) / 3600);
        let minute = parseInt((seconds % 3600) / 60);
        let second = parseInt(seconds % 60);

        let timeStr = "";
        if (day > 0) {
            timeStr += day + "天";
        }

        if (hour > 0) {
            timeStr += hour + "时";
        }

        if (minute > 0) {
            timeStr += minute + "分";
        }

        if (second >= 0) {
            timeStr += second + "秒";
        }

        return timeStr;
    }

    GetAuthUserList = async() =>{
        let results = await common.fetchApi(
            [
                {
                    opcode: 'CLIENT_LIST_GET'
                },
                {
                    opcode: 'AUTH_CLIENT_LIST'
                }
            ]
        );
        let clients,authClient;
        let { errcode, data } = results;
        if (0 !== errcode) {
            return;
        } else {
            clients = data[0].result.data;
            authClient = data[1].result.auth.clientlist;
        }
        this.setState({
            authUserList: authClient.map(item => {
                let mac = item.mac.toUpperCase();
                let client = clients.find(item => item.mac.toUpperCase() === mac) || {
                    ontime: 0, 
                    name:'unknown',                  
                };
                return {
                    index: item.index,
                    name: item.hostname,
                    online: client.ontime !== 0,
                    ontime: this.formatTime(client.ontime),
                    ip: item.ip, 
                    auth_type: item.auth_type,
                    phone : item.phone,
                    access_time : item.access_time,
                    mac: mac,
                }
            }),
        });
    }

    handleDelete = async(record) =>{
        let response = await common.fetchApi(
            [{
                opcode: 'AUTH_USER_OFFLINE',
                data: {
                    auth:{
                        offline_list: [{
                            mac: record.mac,
                        }]
                    }    
                }
            }]
        );

        let { errcode } = response;
        if (errcode == 0) {
            const authUserList = [...this.state.authUserList];
            this.setState({ authUserList: authUserList.filter(item => item.index !== record.index) });
            return;
        }

        message.error(`删除失败[${errcode}]`);
    }

    startRefresh = () =>{
        this.timer = setInterval(this.GetAuthUserList,3000);
    }

    stopRefresh =() =>{
        clearInterval(this.timer);
    }

    componentDidMount(){
        this.GetAuthUserList();
        this.startRefresh();
    }

    componentWillUnmount(){
        this.stopRefresh();
    }
    render(){

        const {authUserList} = this.state;

        const columns = [{
            title: '',
            dataIndex: 'mac',
            width: 60,
            className: 'center',
            render: (mac, record) => (
                <Logo mac={mac} size={32} />
            )
        }, {
            title: '设备名称',
            width: 216,
            render: (text, record) => (
                <div>
                    <div style={{
                        width:'280px',
                        overflow: 'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace: 'pre',
                    }} title={record.name}>{record.name}</div>
                    <i style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        backgroundColor: (record.online ? '#87D068' : '#ADB1B9' ),
                        marginRight: '5px',
                        borderRadius: '50%',
                    }}></i>
                    {record.online?(
                        <span><label>在线时长：</label><label>{record.ontime}</label></span>
                    ) : (
                        <span style={{ color: '#ADB1B9' }}>离线</span>
                    )}
                </div>
            )
        }, {
            title: 'IP/MAC地址',
            // width: 178,
            render: (text, record) => (
                <span>
                    {record.online && <div><label style={{ marginRight: 3 }}>IP:</label><label>{record.ip}</label></div>}
                    <div><label style={{ marginRight: 3 }}>MAC:</label><label>{record.mac}</label></div>
                </span>
            )
        }, {
            title: '认证方式',
            dataIndex: 'auth_type',
            // width: 107,
            render : (text, record) => (
                <span>{record.auth_type == '0'?'微信':'短信'}</span>
            )
        },{
            title: '手机号码',
            dataIndex: 'phone',
            // width: 116,
            render : (text, record) => (
                <span>{record.phone == ''? '--' :record.phone}</span>
            )
        },{
            title: '接入时间',
            dataIndex: 'access_time',
            // width: 162,
            render : (text, record) => (
                <span>{record.access_time}</span>
            )
        },{
            title: '操作',
            width: 94,
            render: (text, record) => (
                <span>
                    <Popconfirm title="确定下线？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>下线</a>
                    </Popconfirm>
                </span>
            )
        }];

        return (
            <div style={{ margin: "0 60px" }}>
               <Table columns={columns} dataSource={authUserList} rowKey={record => record.index} 
               bordered size="middle" pagination={pagination} locale={{ emptyText: "暂无设备" }} scroll={{ x: 563 }} />
            </div>
        );
    }
}