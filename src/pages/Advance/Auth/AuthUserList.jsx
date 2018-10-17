
import React from 'react';
import { Button, Table, Divider, Popconfirm, Modal, Checkbox } from 'antd';
import CustomIcon from '~/components/Icon';

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => `已添加${total}台设备`,
};

const iconMap = {
    iphone: 'number',
    android: 'android',
    ipad: 'pad',
    pc: 'computer',
    unknown: 'unknown',
};

export default class AuthUserList extends React.Component{

    state={
        authUserList :[]
    }

    GetAuthUserList = async() =>{
        let getClient = await common.fetchWithCode('CLIENT_LIST_GET', { method: 'post' });
        let getAuthClient = await common.fetchWithCode('AUTH_CLIENT_LIST',{method : 'post'});
        Promise.all([getClient,getAuthClient]).then(results => {
            console.log(results);
            let client,authClient;
            let { errcode, data } = results[0];
            if (0 !== errcode) {
                return;
            } else {
                client = data[0].result.data;
            }
            if (0 !== results[1].errcode) {
                return;
            } else {
                authClient = results[1].data[0].result.auth.clientlist;
            }

            this.setState({
                authUserList: client.map(item => {
                    let mac = item.mac.toUpperCase();
                    let authclient = authClient.find(item => item.mac.toUpperCase() === mac) || {
                        device: 'unknown',
                        ontime: 0,
                        ip: '0.0.0.0',
                    };

                    return {
                        index: item.index,
                        icon: iconMap[authclient.device] || 'unknown',
                        name: item.name,
                        online: (false !== item.online),  // 设备列表中的设备都是在线的
                        ontime: this.formatTime(authclient.ontime),
                        ip: authclient.ip,
                        auth_type: authclient.auth_type,
                        phone : authclient.phone,
                        access_time : authclient.access_time,
                        mac: mac,
                    }
                }),
            });

        })
    }

    handleDelete = async(record) =>{
        let response = await common.fetchWithCode(
            'AUTH_USER_OFFLINE',
            {
                method: 'POST', data: {
                    offline_list: [{
                        mac: record.mac,
                    }]
                }
            }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            const authUserList = [...this.state.authUserList];
            this.setState({ authUserList: authUserList.filter(item => item.index !== record.index) });
            return;
        }

        Modal.error({ title: '删除失败', content: message });
    }

    componentDidMount(){
        this.GetAuthUserList();
    }

    render(){

        const {authUserList} = this.state;

        const columns = [{
            title: '',
            dataIndex: 'icon',
            width: 60,
            className: 'center',
            render: (text, record) => (
                <CustomIcon type={record.icon} size={42} />
            )
        }, {
            title: '设备名称',
            width: 300,
            render: (text, record) => (
                <div>
                    <div style={{
                        width:'280px',
                        overflow: 'hidden',
                        textOverflow:'ellipsis',
                        whiteSpace: 'nowrap',
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
            width: 220,
            render: (text, record) => (
                <span>
                    {record.online && <div><label style={{ marginRight: 3 }}>IP:</label><label>{record.ip}</label></div>}
                    <div><label style={{ marginRight: 3 }}>MAC:</label><label>{record.mac}</label></div>
                </span>
            )
        }, {
            title: '认证方式',
            dataIndex: 'auth_type',
            width: 150,
            render : (text, record) => (
                <span>{record.auth_type == '0'?'微信':'短信'}</span>
            )
        },{
            title: '手机号码',
            dataIndex: 'phone',
            width: 210,
            render : (text, record) => (
                <span>{record.phone == ''? '--' :record.phone}</span>
            )
        },{
            title: '接入时间',
            dataIndex: 'access_time',
            width: 210,
            render : (text, record) => (
                <span>{record.access_time}</span>
            )
        },{
            title: '操作',
            width: 143,
            render: (text, record) => (
                <span>
                    <Popconfirm title="确定使此设备下线？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>下线</a>
                    </Popconfirm>
                </span>
            )
        }];

        return (
            <div style={{ margin: "0 60px" }}>
               <Table columns={columns} dataSource={authUserList} rowKey={record => record.index} 
               bordered size="middle" pagination={pagination} locale={{ emptyText: "您还未添加任何设备" }} /> 
            </div>
        );
    }
}