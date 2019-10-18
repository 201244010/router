import React from 'react';
import { Button, Table, message, Input } from 'antd';
import SubLayout from '~/components/SubLayout';
import Loading from '~/components/Loading';
import CustomIcon from '~/components/Icon';
import Upgrade from '~/pages/UpgradeDetect/Upgrade';
import PanelHeader from '~/components/PanelHeader';
import CustomUpgrade from './CustomUpgrade';
const MODULE = 'sysupgrade';

export default class SysUpgrade extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			detecting: false,
			routerList: [],
			detectTip: intl.get(MODULE, 0) /*_i18n:重新检测*/,
			duration: 150,
			hasVersion: false,
			update: false
		};
		this.devList = {};
		this.codeList = {};
		this.columns = [
			{
				title: intl.get(MODULE, 1) /*_i18n:设备名称*/,
				dataIndex: 'name',
				width: 400,
				render: (name, record) => {
					const { devid, role, editing, mac } = record;
					console.log(record);
					return (
						<div className="sub-router-set">
							<div>
								<img
									src={require('~/assets/images/router.png')}
								/>
								{editing ? (
									<div className="sub-input">
										<Input
											defaultValue={name || devid}
											placeholder={
												intl.get(
													MODULE,
													9
												) /*_i18n:请输入设备位置*/
											}
											autoFocus={true}
											onPressEnter={e =>
												this.handleSave({
													editing: e,
													name,
													mac,
													devid
												})
											}
											onBlur={e =>
												this.handleSave({
													editing: e,
													name,
													mac,
													devid
												})
											}
											maxLength={32}
										/>
									</div>
								) : (
									<div className="sub-router-title">
										<label className="sub-router-name">
											{name || devid}{' '}
										</label>
										{role == 1 ? (
											<span className="sub-mainrouter">
												主路由
											</span>
										) : (
											''
										)}
										<span
											onClick={() =>
												this.toggleEdit(devid)
											}
										>
											<CustomIcon
												size={8}
												type="rename"
											/>
										</span>
									</div>
								)}
							</div>
						</div>
					);
				}
			},
			{
				title: intl.get(MODULE, 2) /*_i18n:型号名称*/,
				dataIndex: 'model',
				width: 240
			},
			{
				title: intl.get(MODULE, 3) /*_i18n:当前版本*/,
				dataIndex: 'version',
				width: 240
			},
			{
				title: intl.get(MODULE, 4) /*_i18n:状态*/,
				dataIndex: 'status',
				width: 336,
				render: (_, record) => {
					const online = record.online;
					const Upgrade = () => {
						const { detecting } = this.state;
						if (detecting && online) {
							return (
								<div className="columns-status">
									<CustomIcon
										className="status-loading"
										type="loading"
										size={14}
										spin
									/>
									<span className="status-tip">
										{intl.get(
											MODULE,
											5
										) /*_i18n:检测中...*/}
									</span>
								</div>
							);
						} else {
							return (
								<span
									className={
										online
											? 'status-online'
											: 'status-offline'
									}
								>
									{record.status}
								</span>
							);
						}
					};
					return Upgrade();
				}
			}
		];
	}

	toggleEdit = devid => {
		console.log(devid);
		const { routerList } = this.state;
		const tmpList = routerList.map(item => {
			if (item.devid === devid) {
				item.editing = true;
			}
			return item;
		});
		console.log(tmpList);
		this.setState({
			routerList: tmpList
		});
	};

	handleSave = async payload => {
        await this.save(payload);
        await this.fetchRouter();
	};

	save = async ({ editing, name, mac, devid }) => {
		const editName = editing.target.value;
		if (editName === name) {
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
		}
	};

	componentDidMount() {
		this.fetchRouter();
	}

	render() {
		const {
			detecting,
			routerList,
			detectTip,
			update,
			hasVersion
		} = this.state;
		return (
			<SubLayout className="settings">
				<CustomUpgrade />
				<PanelHeader
					className="sysUpgrade-panelHeader"
					title="手动升级"
				/>
				<div className="sys-upgrade">
					<p>
						{intl.get(MODULE, 6) /*_i18n:检测是否有适用的新固件*/}
					</p>
					<div>
						<Button
							onClick={this.reDetect}
							disabled={detecting || update}
							style={{ marginRight: 20, borderRadius: 8 }}
						>
							{detectTip}
						</Button>
						<Button
							type="primary"
							disabled={detecting || update || !hasVersion}
							onClick={this.startUpgrade}
						>
							{intl.get(MODULE, 7) /*_i18n:全部升级*/}
						</Button>
					</div>
				</div>
				<div className="static-table">
					<Table
						columns={this.columns}
						dataSource={routerList}
						rowClassName={(_, index) => {
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
						pagination={false}
						locale={{
							emptyText: intl.get(MODULE, 8) /*_i18n:暂无设备*/,
							filterConfirm: intl.get(
								MODULE,
								15
							) /*_i18n:undefined*/,
							filterReset: intl.get(
								MODULE,
								29
							) /*_i18n:undefined*/
						}}
					/>
				</div>
				<Upgrade ref="upgrade" />
			</SubLayout>
		);
	}

	startUpgrade = () => {
		this.refs.upgrade.startUpgrade();
	};

	reDetect = () => {
		this.setState({
			detecting: true,
			detectTip: intl.get(MODULE, 9) /*_i18n:检测中...*/
		});
		setTimeout(() => this.fetchRouter(), 3000);
	};

	fetchRouter = async () => {
		const resp = await common.fetchApi(
			[{ opcode: 'MESH_FIRMWARE_GET' }, { opcode: 'ROUTE_GET' }],
			{ ignoreErr: true }
		);
		const { errcode, data } = resp;
		if (errcode !== 0) {
			message.warning(intl.get(MODULE, 10) /*_i18n:获取信息失败！*/);
		}

		let hasVersion = false;
		const routerList = [];

		data[1].result.sonconnect.devices.map(items => {
			data[0].result.upgrade.map(item => {
				if (item.devid === items.devid) {
					const current = item.current_version;
					const newVersion = item.newest_version;
					const online = parseInt(item.online);
					let versiontTip = '';
					if (newVersion === '') {
						versiontTip = intl.get(
							MODULE,
							11
						) /*_i18n:当前已是最新版本*/;
					} else {
						versiontTip =
							intl.get(MODULE, 12) /*_i18n:发现新版本：*/ +
							newVersion;
						hasVersion = hasVersion || online;
					}

					return routerList.push({
						devid: item.devid,
						name: item.location,
						model: item.model || '--',
						version: current || '--',
						status: online
							? versiontTip
							: intl.get(MODULE, 13) /*_i18n:设备已离线*/,
						releaseLog: item.release_log,
						online: online,
						newVersion: newVersion,
						role: items.role,
						mac: items.mac,
						editing: false
					});
				}
			});
		});
		this.setState({
			routerList: routerList,
			detecting: false,
			detectTip: intl.get(MODULE, 14) /*_i18n:重新检测*/,
			hasVersion: hasVersion
		});
	};
}
