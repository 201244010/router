
import React from 'react';
import classnames from 'classnames';
import { Button, Modal, Progress } from 'antd';
import SubLayout from '~/components/SubLayout';
import PrimaryFooter from '~/components/PrimaryFooter';
import CustomIcon from '~/components/Icon';
import ClientList from "./ClientList";
import QoS from './QoS';
import Mesh from './Mesh';

import './home.scss';

const TOTAL_TIME = 60 * 1000;

export default class Home extends React.PureComponent {
    state = {
        visible: false,
        percent: 0,
        successShow: false,
        upBand: 0,
        downBand: 0,
        failShow: false,
        refresh: true,
        upSpeed: 0,
        upUnit: 'Kbps',
        downSpeed: 0,
        downUnit: 'Kbps',
        online: true,
        qosEnable: true,
        totalBand: 8 * 1024 * 1024,
        me: '',
        sunmiClients:[],
        normalClients: [],
        whitelistClients: [],
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

        speed = parseInt(speed, 10) * 8; // byte -> bit
        if (speed >= gSpeed) {
            speed = (speed / gSpeed).toFixed(2) + "Gbps";
        }
        else if (speed >= mSpeed) {
            speed = (speed / mSpeed).toFixed(2) + "Mbps";
        }
        else if (speed >= kSpeed) {
            speed = (speed / kSpeed).toFixed(0) + "Kbps";
        }
        else {
            speed = speed.toFixed(0) + "bps";
        }

        return speed.toString();
    }

    stopRefresh = () => {
        clearInterval(this.timer);
        this.setState({
            refresh : false,
        })
    }

    startRefresh = () => {
        this.setState({
            refresh: true,
        });

        clearTimeout(this.timer);
        this.resreshStatus();
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

    resreshStatus = async () => {
        if (!this.state.refresh) {
            return;
        }

        let resp = await common.fetchApi([
            { opcode:'CLIENT_LIST_GET' },
            { opcode: 'TRAFFIC_STATS_GET' },
            { opcode: 'WIRELESS_LIST_GET' },
            { opcode: 'NETWORK_WAN_IPV4_GET' },
        ]);

        let { errcode, data } = resp;
        if (0 !== errcode) {
            message.warning('网络状态刷新失败');
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
            const deviceMap = {
                iphone: 'number',
                android: 'android',
                ipad: 'pad',
                pc: 'computer',
                unknown: 'unknown',
            };
            const modeMap = {
                '2.4g': '2.4G',
                '5g': '5G',
                'sunmi': '商米专用Wi-Fi',
                'not wifi': '有线'
            };
            let dft = {
                total_tx_bytes: 0,
                total_rx_bytes: 0,
                cur_tx_bytes: 0,
                cur_rx_bytes: 0
            };
            let tf = traffics.find(item => item.mac.toUpperCase() === client.mac.toUpperCase()) || dft;
            let mode = modeMap[client.wifi_mode];
            let device = deviceMap[client.device || 'unknown'];
            let ontime = this.formatTime(client.ontime);
            let flux = this.formatSpeed(tf.total_tx_bytes + tf.total_rx_bytes).replace('ps', '');

            let rssi;
            if ('not wifi' == client.wifi_mode) {
                rssi = '--';
            } else {
                let wi = wifiInfo[client.mac.toLowerCase()] || {rssi:100};
                rssi = (wi.rssi <= 75) ? '好' : '差';
            }

            // 统计不同类型设备带宽
            client.type = client.type || 'normal';
            band[client.type] += tf.cur_rx_bytes;

            return {
                icon: device,
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

        let wan = data[1].result.traffic_stats.wan;
        let tx = this.formatSpeed(wan.cur_tx_bytes);
        let rx = this.formatSpeed(wan.cur_rx_bytes);
        let total = this.state.totalBand;
        let rest = total - (band.sunmi + band.whitelist + band.normal);
        let bandCount = [band.sunmi, band.whitelist, band.normal, (rest > 0 ? rest : 0)];

        let { online } = data[3].result.wan.info;

        this.setState({
            online: online,
            upSpeed: tx.match(/[0-9\.]+/g),
            upUnit: tx.match(/[a-z]+/gi),
            downSpeed: rx.match(/[0-9\.]+/g),
            downUnit: rx.match(/[a-z]+/gi),
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

        this.timer = setTimeout(() => {
            this.resreshStatus();
        }, 2000);
    }

    runningSpeedTest = () => {
        let start = common.fetchApi({ opcode: 'WANWIDGET_SPEEDTEST_START' });

        start.then(() => {
            let status = common.fetchApi(
                { opcode: 'WANWIDGET_SPEEDTEST_INFO_GET' },
                { method: 'POST' },
                {
                    loop: TOTAL_TIME / 10000,
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
                            percent: 0,
                            upBand: (info.up_bandwidth / 1024).toFixed(2),
                            downBand: (info.down_bandwidth / 1024).toFixed(2),
                        });
                    } else if (info.status === "fail") {
                        this.setState({
                            failShow: true,
                            visible: false,
                            percent: 0,
                        });
                    }
                }
            })
        });
    }

    startSpeedTest = () => {
        this.runningSpeedTest();

        this.setState({
            visible: true,
        });

        this.speedTimer = setInterval(() => {
            let percent = this.state.percent + 1;
            if (percent <= 100){
                this.setState({
                    percent: percent,
                });
            }else{
                clearInterval(this.speedTimer);
            }
        }, TOTAL_TIME / 100);
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
        this.resreshStatus();
    }

    componentWillUnmount(){
        this.stop = true
        this.stopRefresh();
    }

    render(){
        const { online, qosEnable, upSpeed, upUnit, downSpeed, downUnit,
                visible, percent, successShow, upBand, downBand, failShow, me,
                sunmiClients, normalClients, whitelistClients, qosData }  = this.state;
        const total = sunmiClients.length + normalClients.length + whitelistClients.length;
        return (
            [<SubLayout className='home'>
                <ul className='func-list'>
                    <li className='func-item internet'>
                        <img className='router-bg' src={require('~/assets/images/router-bg.png')} />
                        <img className='router' src={require('~/assets/images/router.svg')} />
                        <div className={classnames(['content', { 'internet-error': !online }])}>
                            <h4><span>网络状态</span><span className='state'>{online ? '正常' : '异常'}</span></h4>
                            <div className='internet-status'>
                                <div className='up'>
                                    <label className='speed'>{upSpeed}</label>
                                    <div className='tip'>
                                        <span>上行带宽</span><CustomIcon type='kbyte' size={12} color='#3D76F6' />
                                        <div className='unit'>{upUnit}</div>
                                    </div>
                                </div>
                                <div className='down'>
                                    <label className='speed'>{downSpeed}</label>
                                    <div className='tip'>
                                        <span>下行带宽</span><CustomIcon type='downloadtraffic' size={12} color='#87D068' />
                                        <div className='unit'>{downUnit}</div>
                                    </div>
                                </div>
                                <Button onClick={this.startSpeedTest} className='test-speed'>一键测速</Button>
                            </div>
                            <Button className='diagnose'><a href="/diagnose">立即诊断</a></Button>
                        </div>
                        <Modal className='speed-testing-modal' closable={false} footer={null} visible={visible} centered={true}>
                            <h4>{percent}%</h4>
                            <Progress percent={percent} strokeColor="linear-gradient(to right, #FAD961, #FB8632)" showInfo={false} />
                            <p>测速中，请稍候...</p>
                        </Modal>
                        <Modal className='speed-result-modal' closable={false} visible={successShow} centered={true}
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
                        <Modal className='speed-result-modal' closable={false} visible={failShow} centered={true}
                            footer={<Button type="primary" onClick={this.closeSpeedTest}>确定</Button>} >
                            <div className='status-icon'><CustomIcon color="#FF5500" type="defeated" size={64} /></div>
                            <h4>带宽测速失败，请重试</h4>
                        </Modal>
                    </li>
                    <QoS data={qosData} enable={qosEnable} />
                    <li className='func-item search' style={{ padding: '20px 0px' }}>
                        <img className='radar' src={require('~/assets/images/radar.png')} />
                        <div className='content'>
                            <h3>搜寻商米设备</h3>
                            <p>商米设备一键连接上网快速安全</p>
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
                        <ClientList type='whitelist' data={whitelistClients} mac={me}
                            startRefresh={this.startRefresh} stopRefresh={this.stopRefresh} />
                    </div>
                </div>
            </SubLayout>,
            <PrimaryFooter className='home-footer' />]
        );
    }
};
