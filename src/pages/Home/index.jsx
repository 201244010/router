
import React from 'react';
import { Button, Modal } from 'antd';
import SubLayout from '~/components/SubLayout';
import PrimaryFooter from '~/components/PrimaryFooter';
import CustomIcon from '~/components/Icon';
import ClientList from './ClientList';
import QoS from './QoS';

import './home.scss'

export default class Home extends React.PureComponent {
    state = {
        sunmiNum: 10,
        priorityNum:12,
        normalNum:21,
        sunmiClients:[{
            name:'Bla Bla Bla Bla Bla Bla Bla Bla',
            ip:'192.168.100.1',
            mac:'00:11:22:33:44:00',
            icon:'computer',
            type:'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            ip:'192.168.100.1',
            mac:'00:11:22:33:44:01',
            icon: 'bootdevice',
            type: 'sunmi'
        },
        {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:02',
            icon: 'bootdevice',
            type: 'sunmi'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:03',
            icon: 'pad',
            type: 'sunmi'
        }],
        normalClients: [{
            name:'Bla Bla Bla Bla Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac:'00:11:22:33:44:00',
            icon:'computer',
            type:'normal'
        }, {
            name: 'Bla Bla Bla Bla',
                ip: '192.168.100.1',
            mac:'00:11:22:33:44:01',
            icon: 'bootdevice',
            type: 'normal'
        },
        {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:02',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:03',
            icon: 'pad',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:04',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:05',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:06',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:07',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:08',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:09',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0A',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0B',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0C',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0D',
            icon: 'bootdevice',
            type: 'normal'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0E',
            icon: 'bootdevice',
            type: 'normal'
        }],
        priorityClients: [{
            name:'Bla Bla Bla Bla Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac:'00:11:22:33:44:00',
            icon:'computer',
            type:'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip:'192.168.100.1',
            mac:'00:11:22:33:44:01',
            icon: 'bootdevice',
            type: 'priority'
        },
        {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:02',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:03',
            icon: 'pad',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:04',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:05',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:06',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:07',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:08',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:09',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0A',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0B',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0C',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0D',
            icon: 'bootdevice',
            type: 'priority'
        }, {
            name: 'Bla Bla Bla Bla',
            ip: '192.168.100.1',
            mac: '00:11:22:33:44:0E',
            icon: 'bootdevice',
            type: 'priority'
        }],
        qosData: [{
            name: '商米设备',
            value: 20,
            color: '#FF8F00'
        },
        {
            name: '优先设备',
            value: 10,
            color: '#87D068'
        },
        {
            name: '普通设备',
            value: 5,
            color: '#4687FF'
        },
        {
            name: '剩余带宽',
            value: 10,
            color: '#DFE8F3'
        }]
    }
    componentDidMount(){
        setInterval(() =>{
            this.setState({
                qosData: this.state.qosData.map(item => {
                    return {
                        name: item.name,
                        value: parseInt(50 * Math.random()),
                        color: item.color
                    }
                })
            })
        }, 3000)
    }

    render(){
        const { sunmiClients, normalClients, priorityClients, qosData}  = this.state;
        const total = sunmiClients.length + normalClients.length + priorityClients.length;
        return (
            <div>
                <SubLayout>
                    <ul className='func-list'>
                        <li className='func-item internet'>
                            <img className='router-bg' src={require('~/assets/images/router-bg.png')} />
                            <img className='router' src={require('~/assets/images/router.svg')} />
                            <div className='content'>
                                <h4><span>网络状态</span><span className='state'>正常</span></h4>
                                <div className='down'>
                                    <label className='speed'>6.25</label>
                                    <div className='tip'>
                                        <span>上行带宽</span><CustomIcon type='kbyte' size={12} color='#3D76F6' />
                                        <div className='unit'>Mbps</div>
                                    </div>
                                </div>
                                <div className='up'>
                                    <label className='speed'>6.25</label>
                                    <div className='tip'>
                                        <span>下行带宽</span><CustomIcon type='downloadtraffic' size={12} color='#87D068' />
                                        <div className='unit'>Mbps</div>
                                    </div>
                                </div>
                                <Button className='test-speed'>自动测速</Button>
                            </div>
                        </li>
                        <QoS data={qosData} />
                        <li className='func-item search' style={{padding:'20px 0px'}}>
                            <img className='radar' src={require('~/assets/images/radar.png')} />
                            <div className='content'>
                                <h3>搜寻商米设备</h3>
                                <p>一键添加附近的<br />商米设备专属网络业务不掉线</p>
                                <Button className='search'>搜寻设备</Button>
                            </div>
                        </li>
                    </ul>
                    <p className='online-clinet'>在线设备（<span>{total}</span>）</p>
                    <div className='online-list'>
                        <div className='left-list'>
                            <ClientList type='sunmi' data={sunmiClients} placement='top' />
                            <ClientList type='normal' data={normalClients} placement='top' />
                        </div>
                        <div className='priority-list'>
                            <ClientList type='priority' data={priorityClients} placement='top' />
                        </div>
                    </div>
                </SubLayout>
                <PrimaryFooter />
            </div>
        );
    }
};
