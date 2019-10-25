import React from 'react';
import { Table, message, Popconfirm, Input } from 'antd';
import SubLayout from '~/components/SubLayout';
import Loading from '~/components/Loading';
import CustomIcon from '~/components/Icon';
import { formatTime } from '~/assets/common/utils';

const MODULE = 'router';

export default class Router extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [
			{
				title: intl.get(MODULE, 0) /*_i18n:设备名称*/,
				dataIndex: 'name',
				width: 330,
				render: (name, record) => {
					const { editing } = this.state;
					const { mac, devid } = record;
					return (
						<div className="sub-router-set">
							<div>
								<img
									src={require('~/assets/images/router.png')}
								/>
								<ul>
									<li>
										{editing ? (
											<Input
												defaultValue={name}
												placeholder={
													intl.get(
														MODULE,
														9
													) /*_i18n:请输入设备位置*/
												}
												autoFocus={true}
												onPressEnter={e =>
													this.save(
														e,
														name,
														mac,
														devid
													)
												}
												onBlur={e =>
													this.save(
														e,
														name,
														mac,
														devid
													)
												}
												maxLength={32}
											/>
										) : (
											<div>
												<label>{name}</label>
												<span onClick={this.toggleEdit}>
													<CustomIcon
														size={14}
														type="rename"
													/>
												</span>
											</div>
										)}
									</li>
									<li>
										{intl.get(
											MODULE,
											1
										) /*_i18n:运行时长：*/}
										{record.online ? record.uptime : '--'}{' '}
									</li>
								</ul>
							</div>
						</div>
					);
				}
			},
			{
				title: intl.get(MODULE, 2) /*_i18n:IP地址*/,
				dataIndex: 'ip',
				width: 140,
				render: value => {
					return (
						<span className='router-mode'>
							{value}
						</span>
					);
				}
			},
			{
				title: intl.get(MODULE, 3) /*_i18n:MAC地址*/,
				dataIndex: 'mac',
				width: 180,
				render: value => {
					return (
						<span className='router-mode'>
							{value}
						</span>
					);
				}
			},
			{
				title: intl.get(MODULE, 4) /*_i18n:上级路由*/,
				dataIndex: 'router',
				width: 190,
				render: (router, record) => {
					return record.online ? (
						<ul className="parent-router">
							<li>{router}</li>
							<li>{record.routermac}</li>
						</ul>
					) : (
						'--'
					);
				}
			},
			{
				title: intl.get(MODULE, 5) /*_i18n:连接方式*/,
				dataIndex: 'mode',
				width: 120,
				render: value => {
					return (
						<span className='router-mode'>
							{value}
						</span>
					);
				}
			},
			{
				title: intl.get(MODULE, 6) /*_i18n:信号质量*/,
				dataIndex: 'rssi',
				width: 120,
				render: (rssi, record) => {
					if (record.online) {
						return (
							<div className='router-online'>
								<i
									className={
										'dot ' +
										(intl.get(MODULE, 7) /*_i18n:较差*/ ==
										rssi
											? 'warning'
											: '')
									}
								></i>
								<span>{rssi}</span>
							</div>
						);
					} else {
						return (
							<div className="router-offline">
								<i className="dot offline"></i>
								<span>
									{intl.get(MODULE, 8) /*_i18n:已离线*/}
								</span>
							</div>
						);
					}
				}
			},
			{
				title: intl.get(MODULE, 9) /*_i18n:操作*/,
				width: 136,
				render: record => {
					return (
						<Popconfirm
							title={
								<div className="pop-content">
									<label>
										{intl.get(
											MODULE,
											10
										) /*_i18n:你确定要将此设备从网络中移除？*/}
									</label>
									<p>
										{intl.get(
											MODULE,
											11
										) /*_i18n:移除之后，子路由将自动重置为出厂状态，耗时约2分钟，期间请勿断电*/}
									</p>
								</div>
							}
							okText={intl.get(MODULE, 19) /*_i18n:确定*/}
							cancelText={intl.get(MODULE, 20) /*_i18n:取消*/}
							placement="topRight"
							onConfirm={() => this.deleteRouter(record)}
						>
							<span className="router-remove">
								{intl.get(MODULE, 12) /*_i18n:移除*/}
							</span>
						</Popconfirm>
					);
				}
			}
		];
	}

	state = {
		routerList: [],
		editing: false
		// routerList: [{
		//         mac: 'mac',
		//         name: 'name',
		//         ip: 'ip',
		//         router: 'adad',
		//         mode: 'dd',
		//         rssi: '较好',
		//         online: 0,
		//         routermac: 'adada',
		//         uptime: '1231414131'
		// }]
	};

	toggleEdit = () => {
		const { editing } = this.state;
		this.setState({
			editing: !editing
		});
	};

	save = async (e, defaultValue, mac, devid) => {
		const editName = e.target.value;
		if (editName === defaultValue) {
			this.setState({
				editing: false
			});
		} else {
			Loading.show({ duration: 2 });
			let resp = await common.fetchApi({
				opcode: 'ROUTENAME_SET',
				data: {
					sonconnect: [
						{
							mac,
							location: editName,
							devid
						}
					]
				}
			});
			let { errcode } = resp;
			if (0 !== errcode) {
				message.error(intl.get(MODULE, 22) /*_i18n:undefined*/);
				return;
			}
			if (0 === errcode) {
				await this.fetchRouter();
				this.setState({
                    editing: false,
				});
			}
		}
	};

	deleteRouter = async rowdetail => {
		const resp = await common.fetchApi({
			opcode: 'ROUTE_RESET',
			data: {
				sonconnect: [
					{
						devid: rowdetail.devid,
						mac: rowdetail.mac
					}
				]
			}
		});
		const { errcode } = resp;
		if (0 !== errcode) {
			message.warning(intl.get(MODULE, 13) /*_i18n:删除失败*/);
			return;
		}
		message.success(intl.get(MODULE, 14) /*_i18n:移除成功*/);
		this.fetchRouter();
	};

	fetchRouter = async () => {
		const resp = await common.fetchApi([{ opcode: 'ROUTE_GET' }], {
			ignoreErr: true
		});
		const { errcode, data } = resp;
		if (0 !== errcode) {
			message.warning(intl.get(MODULE, 15) /*_i18n:请求失败*/);
			return;
		}

		let router = data[0].result.sonconnect.devices;
		const parentList = {};
		router.map(item => {
			parentList[item.mac.toUpperCase()] = item.location;
		});

		let routerList = router
			.filter(router => router.role === '0')
			.map(router => {
				if (router.role === '0') {
					let rssi;
					const connMode = router.conn_mode;
					if (connMode.wired === 1) {
						rssi = intl.get(MODULE, 16) /*_i18n:较好*/;
					} else {
						rssi =
							router.rssi >= 20
								? intl.get(MODULE, 16) /*_i18n:较好*/
								: intl.get(MODULE, 17) /*_i18n:较差*/;
					}
					let mode = '';
					connMode.w_2g && (mode = mode + '/2.4G');
					connMode.w_5g && (mode = mode + '/5G');
					connMode.wired &&
						(mode =
							mode + `/${intl.get(MODULE, 18) /*_i18n:有线*/}`);
					mode[0] === '/' && (mode = mode.substr(1));

					const online = parseInt(router.online);
					const routermac = router.routermac;
					const uptime = formatTime(router.uptime);

					return {
						devid: router.devid,
						name: router.location,
						ip: online ? router.ip : '--',
						mac: router.mac,
						router: online
							? parentList[routermac.toUpperCase()]
							: '--',
						routermac: routermac.toUpperCase(),
						uptime: uptime,
						mode: online ? mode : '--',
						rssi: rssi,
						online: online
					};
				}
			});

		this.setState({
			routerList: routerList
		});
	};

	componentDidMount() {
		this.fetchRouter();
	}

	render() {
		const { routerList, editing } = this.state;
		return (
			<SubLayout className="settings">
				<div className="static-table" style={{ marginTop: 24 }}>
					<Table
						columns={this.columns}
						dataSource={routerList}
						rowClassName={(record, index) => {
							let className = 'editable-row';
							if (index % 2 === 1) {
								className = 'editable-row-light';
							}
							return className;
						}}
						bordered={false}
						rowKey={record => record.mac}
						style={{ minHeight: 360 }}
						pagination={false}
						locale={{
							emptyText: intl.get(MODULE, 21) /*_i18n:暂无设备*/,
							filterConfirm: intl.get(
								MODULE,
								15
							) /*_i18n:请求失败*/,
							filterReset: intl.get(
								MODULE,
								29
							) /*_i18n:undefined*/
						}}
					/>
				</div>
			</SubLayout>
		);
	}
}
