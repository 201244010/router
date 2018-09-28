
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
        sunmiClients:[],
        normalClients: [],
        whitelistClients: [],
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

    formatSpeed = (speed) => {
        let kSpeed = 1024;
        let mSpeed = kSpeed * 1024;
        let gSpeed = mSpeed * 1024;

        speed = parseInt(speed, 10);
        if (speed >= gSpeed) {
            speed = (speed / gSpeed).toFixed(2) + "GB/s";
        }
        else if (speed >= mSpeed) {
            speed = (speed / mSpeed).toFixed(2) + "MB/s";
        }
        else if (speed >= kSpeed) {
            speed = (speed / kSpeed).toFixed(0) + "KB/s";
        }
        else {
            speed = speed.toFixed(0) + "B/s";
        }

        return speed.toString();
    }

    fetchClinetsInfo = () => {
        let fetchClinets = common.fetchWithCode('CLIENT_LIST_GET', { method: 'POST' });
        let fetchTraffic = common.fetchWithCode('TRAFFIC_STATS_GET', { method: 'POST' });

        Promise.all([fetchClinets, fetchTraffic]).then(results =>{
            let clients, traffics;
            let { errcode, data } = results[0];
            if (0 !== errcode){
                return;
            } else {
                clients = data[0].result.data;
            }

            if (0 !== results[1].errcode) {
                return;
            } else {
                traffics = results[1].data[0].result.traffic_stats.hosts;
            }

            // merge clients && traffic info
            let totalList = clients.map(client => {
                const modeMap = {
                    '2.4g': '2.4G',
                    '5g': '5G',
                    'not wifi': '有线'
                };
                let dft = {
                    total_tx_bytes: 0,
                    total_rx_bytes: 0,
                    cur_tx_bytes: 0,
                    cur_rx_bytes: 0
                };
                let tf = traffics.find(item => item.mac.toUpperCase() === client.mac.toUpperCase()) || dft;
                let rssi = ('not wifi' == client.wifi_mode) ? '--' : (('good' === client.rssi) ? '好' : '差');
                let mode = modeMap[client.wifi_mode];
                let ontime = this.formatTime(client.ontime);
                let flux = this.formatSpeed(tf.total_tx_bytes + tf.total_rx_bytes);
                return {
                    icon: 'logo',
                    name: client.hostname,
                    ip: client.ip,
                    mac: client.mac.toUpperCase(),
                    type: client.type,
                    mode: mode,
                    ontime: ontime,
                    rssi: rssi,
                    tx: this.formatSpeed(tf.cur_tx_bytes),
                    rx: this.formatSpeed(tf.cur_rx_bytes),
                    flux: flux,
                }
            });
            this.setState({
                sunmiClients: totalList.filter(item => item.type !== 'sunmi'),
                normalClients: totalList.filter(item => item.type !== 'normal'),
                whitelistClients: totalList.filter(item => item.type !== 'whitelist'),
            });
        }).catch((error) => {
            console.log(error);
        })
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

        this.fetchClinetsInfo();
    }

    render(){
        const { sunmiClients, normalClients, whitelistClients, qosData}  = this.state;
        const total = sunmiClients.length + normalClients.length + whitelistClients.length;
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
                        <div className='whitelist-list'>
                            <ClientList type='whitelist' data={whitelistClients} placement='top' />
                        </div>
                    </div>
                </SubLayout>
                <PrimaryFooter />
            </div>
        );
    }
};
