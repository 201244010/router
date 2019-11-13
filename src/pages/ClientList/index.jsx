import React from 'react';
import classnames from 'classnames';
import {
	Button,
	Divider,
	Popover,
	Modal,
	Table,
	message,
	Popconfirm,
	Input,
	Form
} from 'antd';
import Loading from '~/components/Loading';
import { formatTime, formatSpeed } from '~/assets/common/utils';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';
import SubLayout from '~/components/SubLayout';
import { getQuickStartVersion } from '~/utils';

import './clients.scss';

const MODULE = 'clientlist';
const TYPE_SUNMI = 'sunmi',
	TYPE_NORMAL = 'normal',
	TYPE_WHITE = 'whitelist',
	TYPE_PRIORITY = 'priority';
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
	state = {
		editing: false
	};

	componentDidMount() {
		if (this.props.editable) {
			document.addEventListener('click', this.handleClickOutside, true);
		}
	}

	componentWillUnmount() {
		if (this.props.editable) {
			document.removeEventListener(
				'click',
				this.handleClickOutside,
				true
			);
		}
	}

	toggleEdit = bediting => {
		const editing = undefined !== bediting ? bediting : !this.state.editing;
		this.setState({ editing }, () => {
			if (editing) {
				this.input.focus();
			}
		});
	};

	handleClickOutside = e => {
		const { editing } = this.state;
		if (
			editing &&
			this.cell !== e.target &&
			!this.cell.contains(e.target)
		) {
			this.save();
		}
	};

	save = () => {
		const { record, handleSave } = this.props;
		this.form.validateFields((error, values) => {
			if (error) {
				return;
			}
			//this.toggleEdit();
			handleSave({ ...record, ...values }, () => this.toggleEdit(false));
		});
	};

	render() {
		const { editing } = this.state;
		const {
			editable,
			dataIndex,
			title,
			record,
			index,
			handleSave,
			...restProps
		} = this.props;

		return (
			<td ref={node => (this.cell = node)} {...restProps}>
				{editable ? (
					<EditableContext.Consumer>
						{form => {
							this.form = form;
							return editing ? (
								<FormItem style={{ margin: 0 }}>
									{form.getFieldDecorator(dataIndex, {
										rules: [
											{
												required: true,
												message: intl.get(MODULE, 3, {
													title
												}) /*_i18n:请输入{title}*/
											}
										],
										initialValue: record[dataIndex]
									})(
										<Input
											ref={node => (this.input = node)}
											onPressEnter={this.save}
											maxLength={32}
										/>
									)}
								</FormItem>
							) : (
								<div
									key={record.mac}
									className="editable-cell-value-wrap"
									onClick={this.toggleEdit}
								>
									{restProps.children}
								</div>
							);
						}}
					</EditableContext.Consumer>
				) : (
					restProps.children
				)}
			</td>
		);
	}
}

export default class ClientList extends React.Component {
	constructor(props) {
		super(props);
		this.RSSI_GOOD = intl.get(MODULE, 0) /*_i18n:较好*/;
		this.RSSI_BAD = intl.get(MODULE, 1) /*_i18n:较差*/;
		this.modeMap = {
			'0': '5G',
			'1': '2.4G',
			'2': intl.get(MODULE, 2) /*_i18n:有线*/
		};
		this.logoType = {
			sunmi: intl.get(MODULE, 40) /*_i18n:商米*/,
			whitelist: intl.get(MODULE, 41) /*_i18n:优先*/
		};
		this.deviceList = {
			sunmi: intl.get(MODULE, 42) /*_i18n:商米设备*/,
			whitelist: intl.get(MODULE, 43) /*_i18n:优先设备*/,
			normal: intl.get(MODULE, 44) /*_i18n:普通设备*/
		};
		this.connectRouter =
			JSON.parse(window.sessionStorage.getItem('_ROUTER_LIST')) || [];
		this.columns = [
			{
				title: intl.get(MODULE, 45) /*_i18n:设备*/,
				dataIndex: 'mac',
				width: 112,
				className: 'center',
				filters: [
					{
						text: this.deviceList['sunmi'],
						value: 'sunmi'
					},
					{
						text: this.deviceList['whitelist'],
						value: 'whitelist'
					},
					{
						text: this.deviceList['normal'],
						value: 'normal'
					}
				],
				onFilter: (value, record) => record.type.indexOf(value) === 0,
				render: (mac, record) => {
					return (
						<React.Fragment>
							<div className="logo-cell">
								<Logo
									logoColor="#AEB1B9"
									mac={mac}
									model={record.model}
									size={32}
								/>
							</div>
							{TYPE_SUNMI === record.type && (
								<img
									src={require('~/assets/images/sunmi-badge.svg')}
								/>
							)}
						</React.Fragment>
					);
				}
			},
			{
				width: 100,
				dataIndex: 'name',
				className: 'editable-cell-client',
				editable: true,
				defaultSortOrder: 'ascend',
				render: (text, record) => {
					let ontime = formatTime(record.ontime);
					let hostname = record.name;
					let type = record.type;
					const maxWidth = (() => {
						if (record.me && 'normal' !== type) {
							return 50;
						}
						if (record.me && 'normal' === type) {
							return 96;
						}
						if ('normal' !== type) {
							return 125;
						}
						return 186;
					})();
					return [
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								height: 20
							}}
						>
							<label
								className="device hostname"
								style={{ maxWidth: maxWidth }}
								title={hostname}
							>
								{hostname}
							</label>
							{record.me && (
								<span className="current-device">
									{intl.get(
										MODULE,
										46
									) /*_i18n:（当前设备）*/}
								</span>
							)}
							<span className={`logo ${type}`}>
								{this.logoType[type]}
							</span>
						</div>,
						<div className="device" title={ontime}>
							<label style={{ marginRight: 6 }}>
								{intl.get(MODULE, 5) /*_i18n:在线时长:*/}
							</label>
							<label>{ontime}</label>
						</div>
					];
				}
			},
			{
				title: intl.get(MODULE, 6) /*_i18n:IP/MAC地址*/,
				width: 140,
				render: (text, record) => (
					<ul className="macAddress">
						<li>
							<span>{record.ip}</span>
						</li>
						<li>
							<span>{record.mac}</span>
						</li>
					</ul>
				)
			},
			{
				title: intl.get(MODULE, 47) /*_i18n:连接路由*/,
				dataIndex: 'routerName',
				filters: this.connectRouter,
				onFilter: (value, record) => {
					if (typeof record.routerName === 'undefined') {
						return false;
					} else {
						return record.routerName.indexOf(value) === 0;
					}
				},
				render: (routerName, record) => (
					<div className="routerName">{routerName || '--'}</div>
				),
				width: 158
			},
			{
				title: intl.get(MODULE, 7) /*_i18n:接入方式*/,
				dataIndex: 'mode',
				filters: [
					{
						text: this.modeMap['2'],
						value: '2'
					},
					{
						text: this.modeMap['1'],
						value: '1'
					},
					{
						text: this.modeMap['0'],
						value: '0'
					}
				],
				onFilter: (value, record) => record.mode.indexOf(value) === 0,
				render: (mode, record) => this.modeMap[mode],
				width: 120
			},
			{
				title: intl.get(MODULE, 48) /*_i18n:信号质量*/,
				dataIndex: 'rssi',
				filters: [
					{
						text: this.RSSI_GOOD,
						value: this.RSSI_GOOD
					},
					{
						text: this.RSSI_BAD,
						value: this.RSSI_BAD
					}
				],
				onFilter: (value, record) => record.rssi.indexOf(value) === 0,
				width: 100,
				render: (rssi, record) => (
					<div>
						<i
							className={
								'dot ' +
								(this.RSSI_BAD == rssi ? 'warning' : '')
							}
						></i>
						<span style={{ fontSize: 12 }}>{rssi}</span>
					</div>
				)
			},
			{
				title: intl.get(MODULE, 9) /*_i18n:当前速率*/,
				width: 100,
				render: (text, record) => (
					<div>
						<div>
							<CustomIcon
								type="kbyte"
								color="#779FF8"
								size={12}
							/>
							<span style={{ marginLeft: 5 }}>{record.tx}</span>
						</div>
						<div>
							<CustomIcon
								type="downloadtraffic"
								color="#87D068"
								size={12}
							/>
							<span style={{ marginLeft: 5 }}>{record.rx}</span>
						</div>
					</div>
				)
			},
			{
				title: intl.get(MODULE, 10) /*_i18n:流量消耗*/,
				width: 110,
				render: (text, record) => (
					<div>
						<div>
							<CustomIcon
								type="kbyte"
								color="#779FF8"
								size={12}
							/>
							<span style={{ marginLeft: 5 }}>
								{record.fluxTx}
							</span>
						</div>
						<div>
							<CustomIcon
								type="downloadtraffic"
								color="#87D068"
								size={12}
							/>
							<span style={{ marginLeft: 5 }}>
								{record.fluxRx}
							</span>
						</div>
					</div>
				)
			},
			{
				title: intl.get(MODULE, 11) /*_i18n:操作*/,
				width: 178,
				render: (text, record) => {
					let type = record.type;
					return (
						<span>
							{TYPE_SUNMI !== type && (
								<a
									onClick={() => this.handleEdit(record)}
									href="javascript:;"
									className="client-priority"
								>
									{TYPE_WHITE === record.type
										? intl.get(
												MODULE,
												12
										  ) /*_i18n:解除优先*/
										: intl.get(
												MODULE,
												13
										  ) /*_i18n:优先上网*/}
								</a>
							)}
							<Popconfirm
								title={
									<div className="pop-content">
										<label>
											{intl.get(
												MODULE,
												14
											) /*_i18n:您确定要将此设备加入黑名单？*/}
										</label>
										<p>
											{intl.get(
												MODULE,
												56
											) /*_i18n:可从“路由设置-黑名单”中恢复*/}
										</p>
									</div>
								}
								okText={intl.get(MODULE, 15) /*_i18n:确定*/}
								cancelText={intl.get(MODULE, 16) /*_i18n:取消*/}
								placement="topRight"
								onConfirm={() => this.handleDelete(record)}
							>
								{!record.me && (
									<a
										href="javascript:;"
										className={
											getQuickStartVersion() !== 'abroad'
												? 'client-blacklist'
												: 'client-blacklist-us'
										}
									>
										{intl.get(
											MODULE,
											17
										) /*_i18n:禁止上网*/}
									</a>
								)}
							</Popconfirm>
						</span>
					);
				}
			}
		];
	}

	state = {
		visible: false,
		refresh: false,
		qosEnable: true,
		totalBand: 8 * 1024 * 1024,
		me: '',
		clients: [
			// {
			//     "icon": "computer",
			//     "routerName": 'dasdasdasd',
			//     "name": "PC-2OR",
			//     "ip": "192.168.100.181",
			//     "mac": "0C:25:76:EC:24:69",
			//     "type": "sunmi",
			//     "mode": "0",
			//     "ontime": "17时23分8秒",
			//     "rssi": "--",
			//     "tx": "445B/s",
			//     "rx": "88.54MB/s",
			//     "flux": "10.90MB"
			// },
			// {
			//     "me": '1',
			//     "icon": "computer",
			//     "routerName": "locationssdada",
			//     "name": "WIN-NTSFVIF9B7ADADADASDADADADADAD",
			//     "ip": "192.168.100.140",
			//     "mac": "68:F7:28:F1:10:D4",
			//     "type": "whitelist",
			//     "mode": "1",
			//     "ontime": "43分26秒",
			//     "rssi": "--",
			//     "tx": "830B/s",
			//     "rx": "5KB/s",
			//     "flux": "771MB"
			// }
		]
	};

	handleEdit = async record => {
		let directive =
			TYPE_NORMAL === record.type
				? 'QOS_AC_WHITELIST_ADD'
				: 'QOS_AC_WHITELIST_DELETE';

		Loading.show({ duration: 3 });
		let response = await common.fetchApi({
			opcode: directive,
			data: { white_list: [{ name: record.name, mac: record.mac }] }
		});

		let { errcode } = response;
		if (errcode == 0) {
			// 后台生效需要1秒左右，延迟2秒刷新数据，
			setTimeout(() => {
				// this.props.startRefresh(true);
				this.fetchStatus();
				if (TYPE_NORMAL === record.type) {
					message.success(
						intl.get(MODULE, 55) /*_i18n:已设为优先设备*/
					);
				} else {
					message.success(
						intl.get(MODULE, 57) /*_i18n:已解除优先设备*/
					);
				}
			}, 2000);
			return;
		}

		message.error(
			intl.get(MODULE, 18, { error: errcode }) /*_i18n:操作失败[{error}]*/
		);
	};

	handleDelete = async record => {
		if (this.props.mac === record.mac) {
			message.warning(intl.get(MODULE, 19) /*_i18n:不能禁止本机上网*/);
			return;
		}

		Loading.show({ duration: 3 });
		let response = await common
			.fetchApi({
				opcode: 'QOS_AC_BLACKLIST_ADD',
				data: { black_list: [{ name: record.name, mac: record.mac }] }
			})
			.catch(ex => {});

		let { errcode } = response;
		if (errcode == 0) {
			message.success(
				intl.get(
					MODULE,
					20
				) /*_i18n:配置生效！如需恢复，可在路由设置-防蹭网中恢复上网*/
			);

			// 后台生效需要1秒左右，延迟2秒刷新数据，
			setTimeout(() => {
				this.fetchStatus();
			}, 2000);
			return;
		}

		message.error(
			intl.get(MODULE, 21, { error: errcode }) /*_i18n:操作失败[{error}]*/
		);
	};

	handleSave = async (record, toggleEdit) => {
		const { mac, name } = record;
		const clients = this.state.clients;
		const client = clients.find((client, index) => {
			return client.mac === record.mac;
		});
		if (client.name !== name) {
			Loading.show({ duration: 2 });
			let resp = await common.fetchApi({
				opcode: 'CLIENT_ITEM_SET',
				data: { aliaslist: [{ mac, alias: name }] }
			});

			let { errcode } = resp;
			if (0 !== errcode) {
				message.error(
					intl.get(MODULE, 22) /*_i18n:保存失败，设备名称过长*/
				);
				return;
			}

			// 后台生效需要1秒左右，延迟1.5秒刷新数据，
			setTimeout(() => {
				// this.props.startRefresh(true);
				this.fetchStatus();
				setTimeout(toggleEdit, 500);
			}, 1500);
		} else {
			// 数据没更改，不用发送请求保存数据
			toggleEdit();
		}
	};

	goWhiteList = () => {
		this.props.history.push('/advance/whitelist');
	};

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
				me: mac.toUpperCase()
			});
			return;
		}
	};

	fetchStatus = async () => {
		let resp = await common.fetchApi(
			[
				{ opcode: 'CLIENT_LIST_GET' },
				{ opcode: 'TRAFFIC_STATS_GET' },
				{ opcode: 'WIRELESS_LIST_GET' },
				{ opcode: 'CLIENT_ALIAS_GET' },
				{ opcode: 'ROUTE_GET' }
			],
			{ ignoreErr: true }
		);

		const ME = this.state.me;
		let { errcode, data } = resp;
		if (0 !== errcode) {
			message.warning(
				intl.get(MODULE, 8, { error: errcode }) /*_i18n:信号*/
			);
			return;
		}

		let clients = data[0].result.data,
			alias = data[3].result.aliaslist,
			traffics = data[1].result.traffic_stats.hosts,
			wifiInfo = data[2].result.rssilist || {},
			routerInfo = data[4].result.sonconnect.devices;

		let band = {
			sunmi: 0,
			whitelist: 0,
			normal: 0
		};

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
			const { total_tx_bytes: fluxTx, total_rx_bytes: fluxRx } = tf;

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

			let routerName;
			routerInfo.map(item => {
				if (item.mac.toUpperCase() === client.routermac.toUpperCase()) {
					routerName = item.location;
				}
			});

			return {
				me: client.mac === ME,
				name: hostname,
				routerName: routerName,
				model: client.model,
				ip: client.ip,
				mac: client.mac,
				type: client.type,
				mode: mode,
				ontime: client.ontime,
				rssi: rssi,
				tx: formatSpeed(tf.cur_tx_bytes),
				rx: formatSpeed(tf.cur_rx_bytes),
				fluxTx: formatSpeed(fluxTx).replace('/s', ''),
				fluxRx: formatSpeed(fluxRx).replace('/s', '')
			};
		});
		const currentDevice = totalList.filter(item => item.me == 1);
		const sunmiList = totalList.filter(
			item => item.me != 1 && item.type === 'sunmi'
		);
		const priorityList = totalList.filter(
			item => item.me != 1 && item.type === 'whitelist'
		);
		const normalList = totalList.filter(
			item =>
				item.me != 1 &&
				item.type !== 'whitelist' &&
				item.type !== 'sunmi'
		);
		let wan = data[1].result.traffic_stats.wan;
		let tx = formatSpeed(wan.cur_tx_bytes);
		let rx = formatSpeed(wan.cur_rx_bytes);

		this.setState({
			upSpeed: tx.match(/[0-9\.]+/g),
			upUnit: tx.match(/[a-z/]+/gi),
			downSpeed: rx.match(/[0-9\.]+/g),
			downUnit: rx.match(/[a-z/]+/gi),
			clients: [
				...currentDevice,
				...sunmiList,
				...priorityList,
				...normalList
			]
		});
	};

	updateClientsInfo = () => {
		this.fetchStatus();
	};

	componentDidMount() {
		this.fetchBasic();
		this.fetchStatus();
	}

	render() {
		const { clients } = this.state;
		const total = clients.length;

		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell
			}
		};

		const columns = this.columns.map(col => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					handleSave: this.handleSave
				})
			};
		});
		return (
			<SubLayout
				className="net-setting"
				style={{
					marginTop: 8,
					height: window.innerHeight - 148,
					maxHeight: window.innerHeight - 148,
					overflow: 'auto'
				}}
			>
				<div className="net-title">
					<p>
						<span>{intl.get(MODULE, 54) /*_i18n:上网设备*/}</span>
						<span>
							{total} {intl.get(MODULE, 50) /*_i18n:台*/}
						</span>
					</p>
					<Button
						className="net-refersh"
						onClick={this.updateClientsInfo}
					>
						{intl.get(MODULE, 51) /*_i18n:刷新*/}
					</Button>
				</div>
				<div className="table-background">
					<Table
						columns={columns}
						dataSource={clients}
						components={components}
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
						size="middle"
						pagination={false}
						locale={{
							emptyText: intl.get(MODULE, 28) /*_i18n:暂无设备*/,
							filterConfirm: intl.get(MODULE, 15) /*_i18n:确定*/,
							filterReset: intl.get(MODULE, 29) /*_i18n:重置*/
						}}
					/>
				</div>
			</SubLayout>
		);
	}
}
