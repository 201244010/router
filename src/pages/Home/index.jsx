
import React from 'react';
import classnames from 'classnames';
import { Button, Modal } from 'antd';
import SubLayout from '~/components/SubLayout';
import Progress from '~/components/Progress';
import { TIME_SPEED_TEST } from '~/assets/common/constants';
import { formatTime, formatSpeed } from '~/assets/common/utils';
import CustomIcon from '~/components/Icon';
import ClientList from "./ClientList";
import QoS from './QoS';
import Mesh from './Mesh';

import './home.scss';

const RSSI_GOOD = '较好', RSSI_BAD = '较差';

export default class Home extends React.Component {
    state = {
        visible: false,
        successShow: false,
        upBand: 0,
        downBand: 0,
        failShow: false,
        upSpeed: 0,
        upUnit: 'KB/s',
        downSpeed: 0,
        downUnit: 'KB/s',
        online: true,
        qosEnable: true,
        totalBand: 8 * 1024 * 1024,
        me: '',
        sunmiClients:[/*
            {
                "icon": "computer",
                "name": "PC-20180711HEOR",
                "ip": "192.168.100.181",
                "model": "V2 PRO",
                "mac": "0C:25:76:EC:24:69",
                "type": "sunmi",
                "mode": "有线",
                "ontime": "17时23分8秒",
                "rssi": "--",
                "tx": "445B/s",
                "rx": "88.54MB/s",
                "flux": "10.90MB"
            },
            {
                "icon": "computer",
                "name": "WIN-NTSFVIF9B7A",
                "ip": "192.168.100.140",
                "model": "V1 S",
                "mac": "0C:25:76:F1:10:D4",
                "type": "sunmi",
                "mode": "有线",
                "ontime": "43分26秒",
                "rssi": "--",
                "tx": "830B/s",
                "rx": "5KB/s",
                "flux": "771MB"
            },
            {
                "icon": "android",
                "name": "Honor_9-11984856d914199b",
                "ip": "192.168.100.196",
                "mac": "0C:25:76:B3:09:80",
                "type": "sunmi",
                "mode": "5G",
                "ontime": "21分44秒",
                "rssi": "较好",
                "tx": "0B/s",
                "rx": "1B/s",
                "flux": "186KB"
            },
            {
                "icon": "computer",
                "name": "PC-20180711HEOR",
                "ip": "192.168.100.181",
                "model": "V2 PRO",
                "mac": "0C:25:76:EC:24:70",
                "type": "sunmi",
                "mode": "有线",
                "ontime": "17时23分8秒",
                "rssi": "--",
                "tx": "445B/s",
                "rx": "232B/s",
                "flux": "10.90MB"
            },
            {
                "icon": "computer",
                "name": "WIN-NTSFVIF9B7A",
                "ip": "192.168.100.140",
                "model": "V2 PRO",
                "mac": "0C:25:76:F1:10:D5",
                "type": "sunmi",
                "mode": "有线",
                "ontime": "43分26秒",
                "rssi": "--",
                "tx": "830B/s",
                "rx": "5KB/s",
                "flux": "771MB"
            },
            {
                "icon": "android",
                "name": "Honor_9-11984856d914199b",
                "ip": "192.168.100.196",
                "model": "V2 PRO",
                "mac": "0C:25:76:B3:09:81",
                "type": "sunmi",
                "mode": "5G",
                "ontime": "21分44秒",
                "rssi": "较好",
                "tx": "0B/s",
                "rx": "1B/s",
                "flux": "186KB"
            },
            {
                "icon": "computer",
                "name": "PC-20180711HEOR",
                "ip": "192.168.100.181",
                "model": "V2 PRO",
                "mac": "0C:25:76:EC:24:98",
                "type": "sunmi",
                "mode": "有线",
                "ontime": "17时23分8秒",
                "rssi": "--",
                "tx": "445B/s",
                "rx": "232B/s",
                "flux": "10.90MB"
            },
            {
                "icon": "computer",
                "name": "WIN-NTSFVIF9B7A",
                "ip": "192.168.100.140",
                "model": "V2 PRO",
                "mac": "0C:25:76:F1:10:D6",
                "type": "sunmi",
                "mode": "有线",
                "ontime": "43分26秒",
                "rssi": "--",
                "tx": "830B/s",
                "rx": "5KB/s",
                "flux": "771MB"
            }*/
        ],
        normalClients: [/*
            {
                "icon": "computer",
                "name": "PC-20180711HEOR",
                "ip": "192.168.100.181",
                "mac": "0C:25:76:EC:24:69",
                "type": "normal",
                "mode": "有线",
                "ontime": "17时23分8秒",
                "rssi": "--",
                "tx": "445B/s",
                "rx": "88.54MB/s",
                "flux": "10.90MB"
            },
            {
                "icon": "computer",
                "name": "WIN-NTSFVIF9B7A",
                "ip": "192.168.100.140",
                "mac": "68:F7:28:F1:10:D4",
                "type": "normal",
                "mode": "有线",
                "ontime": "43分26秒",
                "rssi": "--",
                "tx": "830B/s",
                "rx": "5KB/s",
                "flux": "771MB"
            },
            {
                "icon": "android",
                "name": "Honor_9-11984856d914199b",
                "ip": "192.168.100.196",
                "mac": "C8:14:51:B3:09:80",
                "type": "normal",
                "mode": "5G",
                "ontime": "21分44秒",
                "rssi": "较好",
                "tx": "0B/s",
                "rx": "1B/s",
                "flux": "186KB"
            },
            {
                "icon": "computer",
                "name": "PC-20180711HEOR",
                "ip": "192.168.100.181",
                "mac": "F0:76:6F:EC:24:69",
                "type": "normal",
                "mode": "有线",
                "ontime": "17时23分8秒",
                "rssi": "--",
                "tx": "445B/s",
                "rx": "232B/s",
                "flux": "10.90MB"
            }*/
        ],
        whitelistClients: [/*
            {
                "icon": "computer",
                "name": "PC-20180711HEOR",
                "ip": "192.168.100.181",
                "mac": "74:5F:00:EC:24:69",
                "type": "whitelist",
                "mode": "有线",
                "ontime": "17时23分8秒",
                "rssi": "--",
                "tx": "445B/s",
                "rx": "88.54MB/s",
                "flux": "10.90MB"
            },
            {
                "icon": "computer",
                "name": "WIN-NTSFVIF9B7A",
                "ip": "192.168.100.140",
                "mac": "68:F7:28:F1:10:D4",
                "type": "whitelist",
                "mode": "有线",
                "ontime": "43分26秒",
                "rssi": "--",
                "tx": "830B/s",
                "rx": "5KB/s",
                "flux": "771MB"
            },
            {
                "icon": "android",
                "name": "Honor_9-11984856d914199b",
                "ip": "192.168.100.196",
                "mac": "C8:14:51:B3:09:80",
                "type": "whitelist",
                "mode": "5G",
                "ontime": "21分44秒",
                "rssi": "较好",
                "tx": "0B/s",
                "rx": "1B/s",
                "flux": "186KB"
            },
            {
                "icon": "computer",
                "name": "PC-20180711HEOR",
                "ip": "192.168.100.181",
                "mac": "F0:76:6F:EC:24:69",
                "type": "whitelist",
                "mode": "有线",
                "ontime": "17时23分8秒",
                "rssi": "--",
                "tx": "445B/s",
                "rx": "232B/s",
                "flux": "10.90MB"
            }*/
        ],
        qosData: [{
            name: '商米设备',
            value: 0,
            color: '#FF8F00'
        },
        {
            name: '优先设备',
            value: 0,
            color: '#87D068'
        },
        {
            name: '普通设备',
            value: 0,
            color: '#4687FF'
        },
        {
            name: '剩余带宽',
            value: 100,
            color: '#DFE8F3'
        }]
    }

    stopRefresh = () => {
        clearInterval(this.timer);
    }

    startRefresh = (once = false) => {
        this.refreshStatus();
        if (!once) {
            clearInterval(this.timer);
            this.timer = setInterval(this.refreshStatus, 3000);
        }
    }

    fetchBasic = async () => {
        let response = await common.fetchApi([
            { opcode: 'QOS_GET' },
            { opcode: 'WHOAMI_GET' }
        ]);
        let { errcode, data } = response;
        if (errcode == 0) {
            let { qos } = data[0].result;
            let { mac } = data[1].result;
            this.setState({
                qosEnable: qos.enable,
                totalBand: parseInt(qos.down_bandwidth, 10) * 128, // kbps -> byte
                me: mac.toUpperCase(),
            });
            return;
        }
    }

    refreshStatus = async () => {
        let resp = await common.fetchApi([
            { opcode:'CLIENT_LIST_GET' },
            { opcode: 'TRAFFIC_STATS_GET' },
            { opcode: 'WIRELESS_LIST_GET' },
            { opcode: 'NETWORK_WAN_IPV4_GET' },
        ], { ignoreErr: true });

        const ME = this.state.me;
        let { errcode, data } = resp;
        if (0 !== errcode) {
            message.warning(`请求失败[${errcode}]`);
            return;
        }

        let clients = data[0].result.data,
            traffics = data[1].result.traffic_stats.hosts,
            wifiInfo = data[2].result.rssilist || {};
        let band = {
            sunmi: 0,
            whitelist: 0,
            normal: 0,
        };
        // merge clients && traffic info
        let totalList = clients.map(client => {
            client.mac = client.mac.toUpperCase();
            const modeMap = {
                '5g': '0',
                '2.4g': '1',
                'not wifi': '2',
                'sunmi': '3',
            };
            let dft = {
                total_tx_bytes: 0,
                total_rx_bytes: 0,
                cur_tx_bytes: 0,
                cur_rx_bytes: 0
            };
            let tf = traffics.find(item => item.mac.toUpperCase() === client.mac) || dft;
            let mode = modeMap[client.wifi_mode];
            let flux = tf.total_tx_bytes + tf.total_rx_bytes;

            let rssi;
            if ('not wifi' == client.wifi_mode) {
                rssi = RSSI_GOOD;
            } else {
                let wi = wifiInfo[client.mac.toLowerCase()] || {rssi:0};
                rssi = (wi.rssi >= 15) ? RSSI_GOOD : RSSI_BAD;
            }

            // 统计不同类型设备带宽
            client.type = client.type || 'normal';
            band[client.type] += tf.cur_rx_bytes;

            return {
                me: (client.mac === ME),
                name: client.hostname,
                ip: client.ip,
                mac: client.mac,
                type: client.type,
                mode: mode,
                ontime: client.ontime,
                rssi: rssi,
                tx: formatSpeed(tf.cur_tx_bytes),
                rx: formatSpeed(tf.cur_rx_bytes),
                flux: flux,
            }
        });

        let wan = data[1].result.traffic_stats.wan;
        let tx = formatSpeed(wan.cur_tx_bytes);
        let rx = formatSpeed(wan.cur_rx_bytes);
        let total = this.state.totalBand;
        let rest = total - (band.sunmi + band.whitelist + band.normal);
        let bandCount = [band.sunmi, band.whitelist, band.normal, (rest > 0 ? rest : 0)];

        let { online } = data[3].result.wan.info;

        this.setState({
            online: online,
            upSpeed: tx.match(/[0-9\.]+/g),
            upUnit: tx.match(/[a-z/]+/gi),
            downSpeed: rx.match(/[0-9\.]+/g),
            downUnit: rx.match(/[a-z/]+/gi),
            sunmiClients: totalList.filter(item => item.type === 'sunmi'),
            normalClients: totalList.filter(item => item.type === 'normal'),
            whitelistClients: totalList.filter(item => item.type === 'whitelist'),
            qosData: this.state.qosData.map((item, index) => {
                return {
                    name: item.name,
                    value: (bandCount[index] / total * 100) + '',
                    color: item.color
                }
            }),
        });
    }

    runningSpeedTest = () => {
        let start = common.fetchApi({ opcode: 'WANWIDGET_SPEEDTEST_START' });

        start.then(() => {
            let status = common.fetchApi(
                { opcode: 'WANWIDGET_SPEEDTEST_INFO_GET' },
                { method: 'POST' },
                {
                    loop: TIME_SPEED_TEST / 10,
                    interval: 10000,
                    stop: () => this.stop,
                    pending: res => res.data[0].result.speedtest.status === "testing"
                }
            );

            status.then((resp) => {
                let { errcode: code, data } = resp;
                if (code == 0) {
                    let info = data[0].result.speedtest;
                    if (info.status === "ok") {
                        this.setState({
                            successShow: true,
                            visible: false,
                            upBand: (info.up_bandwidth / 1024).toFixed(0),
                            downBand: (info.down_bandwidth / 1024).toFixed(0),
                        });
                    } else if (info.status === "fail") {
                        this.setState({
                            failShow: true,
                            visible: false,
                        });
                    }
                }
            })
        });
    }

    startDiagnose = () => {
        this.props.history.push('/diagnose');
    }

    startSpeedTest = () => {
        this.runningSpeedTest();

        this.setState({
            visible: true,
        });
    }

    closeSpeedTest = () => {
        this.setState({
            visible: false,
            successShow: false,
            failShow: false,
        });
    }

    startSunmiMesh = () => {
        this.refs.sunmiMesh.startSunmiMesh();
    }

    componentDidMount(){
        this.stop = false;
        this.fetchBasic();
        this.startRefresh();
    }

    componentWillUnmount(){
        this.stop = true
        this.stopRefresh();
    }

    render(){
        const { online, qosEnable, upSpeed, upUnit, downSpeed, downUnit,
                visible, successShow, upBand, downBand, failShow, me,
                sunmiClients, normalClients, whitelistClients, qosData }  = this.state;
        const total = sunmiClients.length + normalClients.length + whitelistClients.length;
        return (
            <SubLayout className='home'>
                <ul className='func-list'>
                    <li className='func-item internet' style={{ paddingRight: 0 }}>
                        <img className='router-bg' src={require('~/assets/images/router-bg.png')} />
                        <img className='router' src={require('~/assets/images/router.png')} />
                        <div className={classnames(['content', { 'internet-error': !online }])}>
                            <h4><span>网络状态</span><span className='state'>{online ? '正常' : '异常'}</span></h4>
                            <div className='internet-status'>
                                <div className='up'>
                                    <label className='speed'>{upSpeed}</label>
                                    <div className='tip'>
                                        <span>上行速率</span><CustomIcon type='kbyte' size={12} color='#3D76F6' />
                                        <div className='unit'>{upUnit}</div>
                                    </div>
                                </div>
                                <div className='down'>
                                    <label className='speed'>{downSpeed}</label>
                                    <div className='tip'>
                                        <span>下行速率</span><CustomIcon type='downloadtraffic' size={12} color='#87D068' />
                                        <div className='unit'>{downUnit}</div>
                                    </div>
                                </div>
                                <Button onClick={this.startSpeedTest} className='test-speed'>一键测速</Button>
                            </div>
                            <Button onClick={this.startDiagnose} className='diagnose'>立即诊断</Button>
                        </div>
                        {visible && 
                            <Progress
                                duration={TIME_SPEED_TEST}
                                title='正在进行网络测速，请耐心等待…'
                                showPercent={true}
                            />
                        }
                        <Modal className='speed-result-modal' width={560} closable={false} visible={successShow} centered={true}
                            footer={<Button type="primary" onClick={this.closeSpeedTest}>确定</Button>}>
                            <div className='status-icon'><CustomIcon color="#87D068" type="succeed" size={64} /></div>
                            <h4>带宽测速完成</h4>
                            <ul className='speed-result'>
                                <li>
                                    <CustomIcon color="#3D76F6" type="kbyte" size={12} />
                                    <label>上行带宽：</label><span>{upBand}Mbps</span>
                                </li>
                                <li>
                                    <CustomIcon color="#87D068" type="downloadtraffic" size={12} />
                                    <label>下行带宽：</label><span>{downBand}Mbps</span>
                                </li>
                            </ul>
                        </Modal>
                        <Modal className='speed-result-modal' width={560} closable={false} visible={failShow} centered={true}
                            footer={<Button type="primary" onClick={this.closeSpeedTest}>确定</Button>} >
                            <div className='status-icon'><CustomIcon color="#FF5500" type="defeated" size={64} /></div>
                            <h4>带宽测速失败，请重试</h4>
                        </Modal>
                    </li>
                    <QoS data={qosData} enable={qosEnable} online={online} history={this.props.history}/>
                    <li className='func-item search' style={{ padding: '10px 0px' }}>
                        <img className='radar' src={require('~/assets/images/radar.png')} />
                        <div className='content'>
                            <h3>搜寻商米设备</h3>
                            <p>一键连接附近商米设备</p>
                            <Button onClick={this.startSunmiMesh} className='search'>搜寻设备</Button>
                        </div>
                        <Mesh ref="sunmiMesh" />
                    </li>
                </ul>
                <p className='online-clinet'>在线设备（<span>{total}</span>）</p>
                <div className='online-list'>
                    <div className='left-list'>
                        <ClientList type='sunmi' data={sunmiClients} mac={me} startSunmiMesh={this.startSunmiMesh}
                            startRefresh={this.startRefresh} stopRefresh={this.stopRefresh} />
                        <ClientList type='normal' data={normalClients} mac={me}
                            startRefresh={this.startRefresh} stopRefresh={this.stopRefresh} />
                    </div>
                    <div className='whitelist-list'>
                        <ClientList type='whitelist' data={whitelistClients} mac={me} history={this.props.history}
                            startRefresh={this.startRefresh} stopRefresh={this.stopRefresh} />
                    </div>
                </div>
            </SubLayout>
        );
    }
};
