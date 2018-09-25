
import React from 'react';
import classnames from 'classnames';
import { Button, Table, Divider, Popconfirm, Modal } from 'antd';
import SubLayout from '~/components/SubLayout';
import PrimaryFooter from '~/components/PrimaryFooter';
import CustomIcon from '~/components/Icon';

import './home.scss'


export default class Home extends React.PureComponent {
    state = {
        sunmiNum: 10,
        priorityNum:12,
        normalNum:21,
        sunmiClients:[{
            name:'Bla Bla Bla Bla Bla Bla Bla Bla',
            mac:'00:11:22:33:44:00',
            icon:'computer',
            type:'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac:'00:11:22:33:44:01',
            icon: 'bootdevice',
            type: 'sunmi'
        },
        {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:02',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:03',
            icon: 'pad',
            type: 'sunmi'
        }],
        normalClients: [{
            name:'Bla Bla Bla Bla Bla Bla Bla Bla',
            mac:'00:11:22:33:44:00',
            icon:'computer',
            type:'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac:'00:11:22:33:44:01',
            icon: 'bootdevice',
            type: 'sunmi'
        },
        {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:02',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:03',
            icon: 'pad',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:04',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:05',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:06',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:07',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:08',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:09',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0A',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0B',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0C',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0D',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0E',
            icon: 'bootdevice',
            type: 'sunmi'
        }],
        priorityClients: [{
            name:'Bla Bla Bla Bla Bla Bla Bla Bla',
            mac:'00:11:22:33:44:00',
            icon:'computer',
            type:'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac:'00:11:22:33:44:01',
            icon: 'bootdevice',
            type: 'sunmi'
        },
        {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:02',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:03',
            icon: 'pad',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:04',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:05',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:06',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:07',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:08',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:09',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0A',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0B',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0C',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0D',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            mac: '00:11:22:33:44:0E',
            icon: 'bootdevice',
            type: 'sunmi'
        }]
    }



    render(){
        const { sunmiClients, normalClients, priorityClients}  = this.state;
        const total = sunmiClients.length + normalClients.length + priorityClients.length;
        return (
            <div>
                <SubLayout>
                    <ul className='func-list'>
                        <li className='func-item'></li>
                        <li className='func-item'></li>
                        <li className='func-item'></li>
                    </ul>
                    <p className='online-clinet'>在线设备（<span>{total}</span>）</p>
                    <div className='online-list'>
                        <div className='left-list'>
                            <ClientList className='sunmi-list' data={sunmiClients} />
                            <ClientList className='normal-list' data={normalClients} />
                        </div>
                        <div className='priority-list'>
                            <ClientList className='priority-list' data={priorityClients} />
                        </div>
                    </div>
                </SubLayout>
                <PrimaryFooter />
            </div>
        );
    }
};

const ClientList  = (props) => {
    const clients = props.data;
    const total = clients.length;
    let maxConf = {
        'sunmi-list':6,
        'normal-list':12,
        'priority-list':12
    };
    let deviceTypeMap = {
        'sunmi-list': '商米设备',
        'normal-list': '普通设备',
        'priority-list': '优先设备'
    };
    const deviceType = deviceTypeMap[props.className];
    const max = parseInt(maxConf[props.className], 10);
    const current = (total < max) ? total : max;

    const listItems = clients.map((client, index) => {
        if (index < max){
            return (
                <li key={client.mac} className='client-item'>
                    <div className='icon'><CustomIcon type={client.icon} size={24} /></div>
                    <div className='dot'></div><p title={client.name}>{client.name}</p>
                </li>
            );
        }
    });

    return (
        <div className={classnames(['list-content', props.className])}>
            <div className='list-header'>
                <Divider type="vertical" className='divider' /><span>{deviceType}</span><span className='statistics'>（{current}/{total}）</span><Button className='more'>查看全部</Button>
            </div>
            <ul>{listItems}</ul>
    </div>);
}

