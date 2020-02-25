import React from 'react';
import classnames from 'classnames';
import { Button, Modal, message } from 'antd';
import SubLayout from '~/components/SubLayout';
import Progress from '~/components/Progress';
import { TIME_SPEED_TEST } from '~/assets/common/constants';
import { formatSpeed, transformTime } from '~/assets/common/utils';
import Topology from './Topology';
import Device from './deviceInfo';
import Allocation from './speedAllocation';
import Connection from './wechat';
import CustomIcon from '~/components/Icon';
import Mesh from './Mesh';
import { getQuickStartVersion } from '~/utils';
import { getLang } from '~/i18n/index.js';
import { set, clear } from '~/assets/common/cookie';

import './home.scss';

const MODULE = 'home';
const TYPE_SUNMI = 'sunmi',
	TYPE_NORMAL = 'normal',
	TYPE_WHITE = 'whitelist',
	TYPE_PRIORITY = 'priority';

export default class Home extends React.Component {
	constructor(props) {
		super(props);
		this.isEnglish = getLang() === 'en-us';
		this.RSSI_GOOD = intl.get(MODULE, 0) /*_i18n:较好*/;
		this.RSSI_BAD = intl.get(MODULE, 25) /*_i18n:较差*/;
		this.err = {
			'-1001': intl.get(MODULE, 1) /*_i18n:参数格式错误*/,
			'-1002': intl.get(MODULE, 2) /*_i18n:参数非法*/,
			'-1005': intl.get(MODULE, 3) /*_i18n:内存不足，无法进行测速*/,
			'-1007': intl.get(MODULE, 4) /*_i18n:网络异常，无法进行测速*/
		};
	}
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
		onlineTip: '',
		qosEnable: false,
		totalBand: 8 * 1024 * 1024,
		source: 'default',
		me: '',
		apModal: false,
		wechatConfig: false,
		normalLength: 0,
		priorityLength: 0,
		sunmiLength: 0,
		percent: {
			normalPercent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			priorityPercent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			sunmiPercent: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		},
		largestPercent: 0,
		chatTotal: 0,
		wechatList: [],
		totalList: [],
		reList: [],
		apInfo: {},
		normalClients: [],
		priorityClients: [],
		qosData: [
			{
				name: intl.get(MODULE, 5) /*_i18n:优先设备*/,
				value: 0,
				color: '#87D068'
			},
			{
				name: intl.get(MODULE, 6) /*_i18n:普通设备*/,
				value: 0,
				color: '#4687FF'
			},
			{
				name: intl.get(MODULE, 7) /*_i18n:剩余带宽*/,
				value: 100,
				color: '#DFE8F3'
			}
		]
	};

	stopRefresh = () => {
		clearInterval(this.timer);
	};

	startRefresh = (once = false) => {
		this.refreshStatus();
		if (!once) {
			clearInterval(this.timer);
			this.timer = setInterval(this.refreshStatus, 3000);
		}
	};

	fetchBasic = async () => {
		let response = await common.fetchApi([
			{ opcode: 'QOS_GET' },
			{ opcode: 'WHOAMI_GET' },
			{ opcode: 'WIRELESS_GET' }
		]);
		let { errcode, data } = response;
		if (errcode == 0) {
			let { result: { qos = {} } = {} } = data[0] || {};
			let { result: { mac = '' } = {} } = data[1] || {};
			let { result: { guest: { enable = '' } = {} } = {} } =
				data[2] || {};
			this.setState({
				qosEnable: qos.enable,
				totalBand: parseInt(qos.down_bandwidth, 10) * 128, // kbps -> byte
				source: qos.source,
				me: mac.toUpperCase(),
				wechatConfig: !(enable === '1')
			});
			return;
		}
	};

	fetchMainRouter = async () => {
		const response = await common.fetchApi([{ opcode: 'ROUTE_GET' }]);
		const { errcode, data } = response;

		const reInfo = data[0].result.sonconnect.devices;
		const routeList = {};
		const routeName = [];
		reInfo.map(item => {
			routeList[item.mac.toUpperCase()] = item.location;
			routeName.push({
				text: item.location,
				value: item.location
			});
		});

		const tmpList = reInfo.map(re => {
			return {
				mac: re.mac.toUpperCase(),
				online: re.online,
				name: re.location,
				role: re.role,
				rssi: re.rssi,
				ip: re.ip,
				devid: re.devid,
				parent: routeList[re.routermac.toUpperCase()],
				connMode: re.conn_mode || {}
			};
		});

		const reList = tmpList.filter(item => item.role == 0);
		const apInfo = tmpList.filter(item => item.role == 1)[0] || {};
		this.setState({
			apInfo,
			reList
		});
	};

	fetchService = async () => {
		let response = await common.fetchApi([{ opcode: 'SRVICELIST_GET' }]);
		let { errcode, data } = response;
		if (errcode == 0) {
			const serviceList = data[0].result.services;
			//weChat
			serviceList.map(item => {
				if (item.service === 'wifidog_mod') {
					window.sessionStorage.setItem('_WECHAT', 'IS_WECHAT');
				}
			});
		}
	};

	refreshStatus = async () => {
		const opcodes = [
			{ opcode: 'CLIENT_LIST_GET' },
			{ opcode: 'TRAFFIC_STATS_GET' },
			{ opcode: 'WIRELESS_LIST_GET' },
			{ opcode: 'NETWORK_MULTI_WAN_CONN_GET' },
			{ opcode: 'CLIENT_ALIAS_GET' },
			{ opcode: 'AUTH_CHAT_TOTAL_LIST' },
			{ opcode: 'ROUTE_GET' },
			{ opcode: 'SUNMIMESH_ROLE_GET' },
		];
		if(getQuickStartVersion() === 'abroad') {
			opcodes.push({ opcode: 'MOBILE_STATS_GET' });
		}

		let resp = await common.fetchApi(
			opcodes,
			{ ignoreErr: true }
		);

		const ME = this.state.me;
		let { errcode, data } = resp;
		if (0 !== errcode) {
			message.warning(
				intl.get(MODULE, 8, {
					error: errcode
				}) /*_i18n:请求失败[{error}]*/
			);
			return;
		}

		let clients = data[0].result.data,
			alias = data[4].result.aliaslist,
			traffics = data[1].result.traffic_stats.hosts,
			wifiInfo = data[2].result.rssilist || {},
			wechats = data[5].result,
			reInfo = data[6].result.sonconnect.devices,
			role = data[7].result.sunmimesh.role;

		//时间戳转时间，获取每天微信接入的数量
		const wechatList = wechats.access_report;
		let band = {
			sunmi: 0.2,
			whitelist: 0.1,
			normal: 0
		};
		// merge clients && traffic info
		let totalList = clients.map(client => {
			let mac = client.mac.toUpperCase();
			client.mac = mac;
			const modeMap = {
				'5g': '0',
				'2.4g': '1',
				'not wifi': '2'
			};
			let dft = {
				total_tx_bytes: 0,
				total_rx_bytes: 0,
				cur_tx_bytes: 0,
				cur_rx_bytes: 0
			};
			let tf = traffics.find(item => item.ip === client.ip) || dft;
			let flux = tf.total_tx_bytes + tf.total_rx_bytes;

			let mode = modeMap[client.wifi_mode];

			let rssi;
			if ('not wifi' == client.wifi_mode) {
				rssi = this.RSSI_GOOD;
			} else {
				let wi = wifiInfo[mac.toLowerCase()] || { rssi: 0 };
				rssi = wi.rssi >= 20 ? this.RSSI_GOOD : this.RSSI_BAD;
			}

			let aliasName = alias[mac] && alias[mac].alias;

			// 优先显示用户编辑名称，其次显示机型，最次显示hostname
			let hostname = aliasName || client.model || client.hostname;

			// 统计不同类型设备带宽
			client.type = client.type || TYPE_NORMAL;
			band[client.type] += tf.cur_rx_bytes;

			return {
				me: client.mac === ME,
				name: hostname,
				model: client.model,
				ip: client.ip,
				mac: client.mac,
				type: client.type,
				mode: mode,
				ontime: client.ontime,
				rssi: rssi,
				tx: formatSpeed(tf.cur_tx_bytes),
				rx: formatSpeed(tf.cur_rx_bytes),
				flux: flux
			};
		});

		let priorityClients = totalList
			.filter(item => {
				return item.type === TYPE_WHITE;
			})
			.sort((a, b) => {
				if (a.type === b.type) {
					return a.ontime - b.ontime;
				} else {
					return TYPE_SUNMI === a.type ? -1 : 1;
				}
			});

		let normalClients = totalList
			.filter(item => {
				return item.type === TYPE_NORMAL;
			})
			.sort((a, b) => {
				return a.ontime - b.ontime;
			});

		let wan = data[1].result.traffic_stats.wan;
		let tx = formatSpeed(wan.cur_tx_bytes);
		let rx = formatSpeed(wan.cur_rx_bytes);

		const {
			percent: { normalPercent, priorityPercent, sunmiPercent }
		} = this.state;

		let total = this.state.totalBand;
		const normal = parseInt(((band['normal'] / total) * 100).toFixed(0));
		const whitelist = parseInt(
			((band['whitelist'] / total) * 100).toFixed(0)
		);
		const sunmi = parseInt(((band['sunmi'] / total) * 100).toFixed(0));
		const totalPercent = sunmi + whitelist + normal;

		let online = true;
		const { wans } = data[3].result;
		if(getQuickStartVersion() === 'abroad') {
			const { status } = data[8].result.mobile;
			online = (!wans.every(item => item.online === false)) || (status === 'online');
		} else {
			online = (!wans.every(item => item.online === false));
		}

		const tips = [];
		wans.map(item => {
			if(item.port == 1) {
				tips.push(`${intl.get(MODULE, 34) /*_i18n:默认WAN口*/}${item.online ? intl.get(MODULE, 35) /*_i18n:网络连通*/:intl.get(MODULE, 36) /*_i18n:网络未连通*/}`);
			} else {
				tips.push(`WAN ${item.port - 1}${intl.get(MODULE, 37) /*_i18n:口*/}${item.online ? intl.get(MODULE, 35) /*_i18n:网络连通*/:intl.get(MODULE, 36) /*_i18n:网络未连通*/}`);
			}
		});
		const onlineTip = tips.join('，');
		const routeList = {};
		const routeName = [];
		reInfo.map(item => {
			routeList[item.mac.toUpperCase()] = item.location;
			routeName.push({
				text: item.location,
				value: item.location
			});
		});

		const tmpList = reInfo.map(re => {
			return {
				mac: re.mac.toUpperCase(),
				online: re.online,
				name: re.location,
				role: re.role,
				rssi: re.rssi,
				ip: re.ip,
				devid: re.devid,
				parent: routeList[re.routermac.toUpperCase()],
				connMode: re.conn_mode || {}
			};
		});
		const reList = tmpList.filter(item => item.role == 0);

		const apInfo = tmpList.filter(item => item.role == 1)[0] || {};

		window.sessionStorage.setItem(
			'_ROUTER_LIST',
			JSON.stringify(routeName)
		);

		this.setState({
			onlineTip,
			online: online,
			upSpeed: tx.match(/[0-9\.]+/g),
			upUnit: tx.match(/[a-z/]+/gi),
			downSpeed: rx.match(/[0-9\.]+/g),
			downUnit: rx.match(/[a-z/]+/gi),
			priorityLength: priorityClients.length,
			normalLength: normalClients.length,
			sunmiLength:
				totalList.length -
				priorityClients.length -
				normalClients.length,
			totalList: totalList,
			priorityClients: priorityClients,
			normalClients: normalClients,
			wechatList: wechatList,
			chatTotal: wechats.access_total,
			reList,
			apInfo,
			percent: {
				normalPercent: (() => {
					normalPercent.shift();
					normalPercent.push(normal);
					return normalPercent;
				})(),
				priorityPercent: (() => {
					priorityPercent.shift();
					priorityPercent.push(whitelist);
					return priorityPercent;
				})(),
				sunmiPercent: (() => {
					sunmiPercent.shift();
					sunmiPercent.push(sunmi);
					return sunmiPercent;
				})()
			},
			largestPercent: totalPercent,
			apModal: role === 'TAP' && online
		});
	};

	runningSpeedTest = async () => {
		let start = await common.fetchApi({
			opcode: 'WANWIDGET_SPEEDTEST_START'
		});

		if (0 !== start.errcode) {
			message.error(this.err[start.errcode]);
			return;
		}

		this.setState({ visible: true });
		let status = await common.fetchApi(
			{ opcode: 'WANWIDGET_SPEEDTEST_INFO_GET' },
			{ method: 'POST' },
			{
				loop: TIME_SPEED_TEST / 10,
				interval: 10000,
				stop: () => this.stop,
				pending: res =>
					res.data[0].result.speedtest.status === 'testing'
			}
		);
		this.setState({ visible: false });

		let { errcode: code, data } = status;
		let info = data[0].result.speedtest;

		if (0 !== code) {
			return;
		}

		if ('ok' === info.status) {
			this.setState({
				successShow: true,
				upBand: (info.up_bandwidth / 1024).toFixed(0),
				downBand: (info.down_bandwidth / 1024).toFixed(0)
			});
		}

		if ('fail' === info.status) {
			this.setState({
				failShow: true
			});
		}
	};

	startDiagnose = () => {
		this.props.history.push('/diagnose');
	};

	startSpeedTest = () => {
		this.runningSpeedTest();
	};

	closeSpeedTest = () => {
		this.setState({
			visible: false,
			successShow: false,
			failShow: false
		});
	};

	startSunmiMesh = () => {
		this.refs.sunmiMesh.startSunmiMesh();
	};

	confirmAp = async () => {
		let resp = await common.fetchApi({ opcode: 'SUNMIMESH_ROLE_SET' });
		const { errcode } = resp;
		if (0 === errcode) {
			this.setState({
				apModal: false
			});
		}
	};

	async componentDidMount() {
		this.stop = false;
		await this.fetchMainRouter();
		await this.fetchBasic();
		await this.startRefresh();
		await this.fetchService();
	}

	componentWillUnmount() {
		this.stop = true;
		this.stopRefresh();
	}

	render() {
		const {
			onlineTip,
			online,
			qosEnable,
			upSpeed,
			upUnit,
			downSpeed,
			downUnit,
			reList,
			wechatConfig,
			sunmiLength,
			priorityLength,
			apModal,
			normalLength,
			totalList,
			wechatList,
			percent,
			largestPercent,
			chatTotal,
			apInfo
		} = this.state;
		return (
			<SubLayout className="home">
				<div>
					<Topology
						upSpeed={upSpeed}
						upUnit={upUnit}
						downSpeed={downSpeed}
						downUnit={downUnit}
						reList={reList}
						apInfo={apInfo}
						online={online}
						onlineTip={onlineTip}
						startRefresh={this.startRefresh}
						stopRefresh={this.stopRefresh}
						history={this.props.history}
					/>
					<ul
						className={
							getQuickStartVersion() === 'abroad' ? 'container-us' : 'container'
						}
					>
						<li>
							<Device
								sunmiLength={sunmiLength}
								priorityLength={priorityLength}
								normalLength={normalLength}
								totalList={totalList}
								startRefresh={this.startRefresh}
								stopRefresh={this.stopRefresh}
								history={this.props.history}
							/>
						</li>
						<div className="grid"></div>
						<li>
							<Allocation
								status={qosEnable}
								percent={percent}
								largestPercent={largestPercent}
								history={this.props.history}
							/>
						</li>
						{getQuickStartVersion() !== 'abroad'
							? [
									<div className="grid"></div>,
									<li>
										<Connection
											chatTotal={chatTotal}
											wechatList={wechatList}
											wechatConfig={wechatConfig}
											history={this.props.history}
										/>
									</li>
							  ]
							: ''}
						<div className="grid"></div>
						<li>
							<span
								className={
									this.isEnglish
										? 'first-title-us'
										: 'first-title'
								}
							>
								{intl.get(MODULE, 26) /*_i18n:搜寻商米设备*/}
							</span>
							<div className={this.isEnglish ? 'second-title-us' : 'second-title'}>
								{intl.get(
									MODULE,
									27
								) /*_i18n:商米设备一键联网*/}
							</div>
							{this.isEnglish ? (
								''
							) : (
								<p>
									<span>
										{intl.get(
											MODULE,
											28
										) /*_i18n:无需输入密码*/}
									</span>
									<span>
										{intl.get(
											MODULE,
											29
										) /*_i18n:快捷安全*/}
									</span>
								</p>
							)}

							<Button
								onClick={this.startSunmiMesh}
								className="button"
							>
								{intl.get(MODULE, 30) /*_i18n:搜寻*/}
							</Button>
							<Mesh ref="sunmiMesh" />
						</li>
					</ul>
				</div>
				<Modal
					visible={apModal}
					width={560}
					className="home-modal"
					closable={false}
					centered={true}
					title={
						<div className="home-ap-title">
							<CustomIcon type="hint" size={14}></CustomIcon>
							<label>{intl.get(MODULE, 31) /*_i18n:提示*/}</label>
						</div>
					}
					footer={[
						<Button type="primary" onClick={this.confirmAp}>
							{intl.get(MODULE, 32) /*_i18n:我知道了*/}
						</Button>
					]}
				>
					<span className="reboot-modal-content">
						{intl.get(
							MODULE,
							33
						) /*_i18n:检测到当前网络没有主路由，为了保障更好的体验，已将当前设备设置为主路由*/}
					</span>
				</Modal>
			</SubLayout>
		);
	}
}
