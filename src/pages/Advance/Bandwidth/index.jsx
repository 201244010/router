import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import { Button, Table, Modal, message } from 'antd';
import Progress from '~/components/Progress';
import { TIME_SPEED_TEST } from '~/assets/common/constants';
import { checkRange } from '~/assets/common/check';
import CustomIcon from '~/components/Icon';
import SubLayout from '~/components/SubLayout';
import { getQuickStartVersion } from '~/utils';

const MODULE = 'bandwidth';

const { FormItem, Input, ErrorTip } = Form;
import './bandwidth.scss';

export default class Bandwidth extends React.PureComponent {
	constructor(props) {
		super(props);
		this.err = {
			'-1001': intl.get(MODULE, 0) /*_i18n:参数格式错误*/,
			'-1002': intl.get(MODULE, 1) /*_i18n:参数非法*/,
			'-1005': intl.get(MODULE, 2) /*_i18n:内存不足，无法进行测速*/,
			'-1007': intl.get(MODULE, 3) /*_i18n:网络异常，无法进行测速*/
		};
		this.qos = {};
	}
	state = {
		visible: false, //自动设置弹窗是否可见
		manualShow: false, //手动设置弹窗是否可见
		speedFill: false, //带宽测速完成弹窗是否可见
		speedFail: false, //带宽测速失败弹窗是否可见
		bandenable: true,
		upband: '',
		downband: '',
		source: '', //测速方式
		unit: 'Mbps',
		loading: false,

		//自动设置
		failTip: intl.get(MODULE, 4) /*_i18n:网络未连接*/,
		speedTest: false, //1测速成功，0测速失败

		//设备权重
		sunmi: '50',
		white: '30',
		normal: '20',
		sunmiTip: '',
		whiteTip: '',
		normalTip: '',

		//手动设置
		upbandTip: '',
		downbandTip: '',
	};

	onbandChange = (val, key) => {
		let tip = '';
		let valid = {
			upband: {
				func: checkRange,
				args: {
					min: 1,
					max: 1000,
					who: intl.get(MODULE, 5) /*_i18n:上行带宽*/
				}
			},
			downband: {
				func: checkRange,
				args: {
					min: 1,
					max: 1000,
					who: intl.get(MODULE, 6) /*_i18n:下行带宽*/
				}
			}
		};
		tip = valid[key].func(val, valid[key].args);
		this.setState({
			[key]: val,
			[key + 'Tip']: tip
		});
	};

	onChange = (val, key) => {
		val = val.replace(/\D/g, '');

		let valid = {
			sunmi: {
				func: checkRange,
				args: {
					min: 0,
					max: 100,
					who: intl.get(MODULE, 7) /*_i18n:带宽比例*/
				}
			},
			white: {
				func: checkRange,
				args: {
					min: 0,
					max: 100,
					who: intl.get(MODULE, 7) /*_i18n:带宽比例*/
				}
			},
			normal: {
				func: checkRange,
				args: {
					min: 0,
					max: 100,
					who: intl.get(MODULE, 7) /*_i18n:带宽比例*/
				}
			}
		};

		let tip = valid[key].func(val, valid[key].args);
		this.setState(
			{
				[key]: val,
				[key + 'Tip']: tip
			},
			() => {
				let tips = ['sunmi', 'white', 'normal'];
				let ok = tips.every(tip => {
					let stateTip = this.state[tip + 'Tip'];
					return (
						intl.get(
							MODULE,
							8
						) /*_i18n:带宽比例总和不能大于100%*/ === stateTip ||
						'' === stateTip
					);
				});

				if (ok) {
					const { sunmi, white, normal } = this.state;
					let total =
						parseInt(sunmi) + parseInt(white) + parseInt(normal);
					if (total > 100) {
						this.setState({
							[key + 'Tip']: intl.get(
								MODULE,
								9
							) /*_i18n:带宽比例总和不能大于100%*/,
						});
						return;
					} else {
						this.setState({
							sunmiTip: '',
							whiteTip: '',
							normalTip: '',
						});
						return;
					}
				}
			}
		);
	};

	OnBandEnable = async value => {
		const { source, upband, downband } = this.state;
		this.composeparams(source, upband, downband);
		this.qos.enable = value;
		this.qos.source = source;
		const response = await common.fetchApi(
			{
				opcode: 'QOS_SET',
				data: { qos: this.qos }
			},
			{ loading: true }
		);
		const { errcode } = response;
		if (errcode == 0) {
			this.setState({
				bandenable: value
			});
			message.success(
				value ? intl.get(MODULE, 46) : intl.get(MODULE, 47)
			);
		} else {
			message.error(intl.get(MODULE, 48));
		}
	};

	speedTestStatus = async () => {
		let resp = await common.fetchApi({
			opcode: 'WANWIDGET_SPEEDTEST_START'
		});

		if (0 !== resp.errcode) {
			message.error(this.err[resp.errcode]);
			return;
		}

		this.setState({ visible: true });
		let response = await common.fetchApi(
			{ opcode: 'WANWIDGET_SPEEDTEST_INFO_GET' },
			{},
			{
				interval: 3000,
				stop: () => this.stop,
				pending: res =>
					res.data[0].result.speedtest.status === 'testing'
			}
		);
		this.setState({ visible: false });

		let { errcode: code, data } = response;
		let info = data[0].result.speedtest;

		if (0 !== code) {
			return;
		}

		if ('ok' === info.status) {
			this.setState({
				speedFill: true,
				upband: (info.up_bandwidth / 1024).toFixed(0),
				downband: (info.down_bandwidth / 1024).toFixed(0),
				source: 'speedtest',
			});
			let payload = this.composeparams(
				'speedtest',
				this.state.upband,
				this.state.downband
			);
			common.fetchApi({
				opcode: 'QOS_SET',
				data: payload
			});
		}

		if ('fail' === info.status) {
			this.setState({
				speedFail: true
			});
		}
	};

	showManual = () => {
		this.setState({
			manualShow: true
		});
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	onEditCancle = () => {
		this.setState({
			manualShow: false
		});
	};

	onEditOk = async () => {
		let payload = this.composeparams(
			'manual',
			this.state.upband,
			this.state.downband
		);
		await common
			.fetchApi({
				opcode: 'QOS_SET',
				data: payload
			})
			.then(response => {
				let { errcode } = response;
				if (errcode == 0) {
					this.setState({
						manualShow: false,
					});
					this.getBandInfo();
					return;
				}
				this.setState({
					manualShow: false,
				});
				message.error(
					intl.get(MODULE, 11, {
						error: errcode
					}) /*_i18n:配置失败[{error}]*/
				);
			});
	};

	onSpeedFailCancle = () => {
		this.setState({
			speedFail: false
		});
	};

	onSpeedFillCancle = () => {
		this.setState({
			speedFill: false
		});
	};

	onPercentChange = () => {
		this.speedTestStatus();
	};

	//获取QoS数据
	getBandInfo = async () => {
		let response = await common.fetchApi({ opcode: 'QOS_GET' });

		let { data, errcode } = response;
		if (errcode == 0) {
			let qos = data[0].result.qos;
			this.qosdata = qos;
			this.setState({
				source: qos.source,
				upband:
					qos.source === 'default'
						? ''
						: (qos.up_bandwidth / 1024).toFixed(0),
				downband:
					qos.source === 'default'
						? ''
						: (qos.down_bandwidth / 1024).toFixed(0),
				sunmi: qos.sunmi_weight,
				white: qos.white_weight,
				normal: qos.normal_weight,
				bandenable: qos.enable
			});
			return;
		}
		message.error(
			intl.get(MODULE, 12, {
				error: errcode
			}) /*_i18n:信息获取失败![{error}]*/
		);
	};

	//定义数据格式
	composeparams = (val, upband, downband) => {
		const { bandenable, sunmi, white, normal } = this.state;
		const qos = {
			enable: bandenable,
			source: val,
			up_bandwidth:
				val === 'default' ? '1024000' : parseInt(upband * 1024) + '',
			down_bandwidth:
				val === 'default' ? '1024000' : parseInt(downband * 1024) + '',
			sunmi_weight: sunmi,
			white_weight: white,
			normal_weight: normal
		};
		this.qos = qos;
		return { qos };
	};

	async componentDidMount() {
		this.stop = false;
		await this.getBandInfo();
	}

	componentWillUnmount() {
		this.stop = true;
	}

	post = async () => {
		let { upband, downband } = this.state;
		this.setState({ loading: true });
		let payload = this.composeparams('manual', upband, downband);
		await common
			.fetchApi({
				opcode: 'QOS_SET',
				data: payload
			})
			.then(response => {
				let { errcode } = response;
				if (errcode == 0) {
					message.success(intl.get(MODULE, 14) /*_i18n:配置生效*/);
					this.getBandInfo();
					this.setState({ loading: false });
					return;
				}
				this.setState({ loading: false });
				message.error(
					intl.get(MODULE, 11, {
						errcode
					}) /*_i18n:配置失败[{error}]*/
				);
			});
	};

	render() {
		const {
			unit,
			bandenable,
			visible,
			manualShow,
			speedFail,
			speedFill,
			failTip,
			sunmi,
			white,
			normal,
			sunmiTip,
			whiteTip,
			normalTip,
			upband,
			downband,
			upbandTip,
			downbandTip,
			loading,
		} = this.state;
		let checkTip = sunmiTip !== '' || whiteTip !== '' || normalTip !== '' || upbandTip !== '' || downbandTip !== '';
		let saveDisable = checkTip || upband === '' || downband === '';
		const columns = [
			{
				title: intl.get(MODULE, 15) /*_i18n:设备类型*/,
				dataIndex: 'type'
			},
			{
				title: intl.get(MODULE, 16) /*_i18n:带宽分配优先级*/,
				dataIndex: 'priority'
			},
			{
				title: intl.get(MODULE, 17) /*_i18n:最低保证比例*/,
				dataIndex: 'percent',
				render: (text, record) => (
					<div>
						<FormItem
							type="small"
							style={{ marginBottom: 0, position: 'relative' }}
						>
							<div className="qos-input">
								<Input
									style={{ height: 28 }}
									disabled={!bandenable}
									maxLength={3}
									type="text"
									value={text}
									onChange={value =>
										this.onChange(value, record.key)
									}
								/>
							</div>
							<label>%</label>
							<p className="qos-tip">{record.errorTip}</p>
						</FormItem>
					</div>
				)
			}
		];

		const data = [
			{
				key: 'sunmi',
				type: intl.get(MODULE, 18) /*_i18n:商米设备*/,
				priority: intl.get(MODULE, 19) /*_i18n:高*/,
				percent: sunmi,
				errorTip: sunmiTip
			},
			{
				key: 'white',
				type: intl.get(MODULE, 20) /*_i18n:优先设备*/,
				priority: intl.get(MODULE, 21) /*_i18n:中*/,
				percent: white,
				errorTip: whiteTip
			},
			{
				key: 'normal',
				type: intl.get(MODULE, 22) /*_i18n:普通设备*/,
				priority: intl.get(MODULE, 23) /*_i18n:低*/,
				percent: normal,
				errorTip: normalTip
			}
		];

		return (
			<SubLayout className="settings">
				<div>
					<div className="title-bandwidth">
						<PanelHeader
							title={intl.get(MODULE, 43) /*_i18n:网速智能分配*/}
							checkable={true}
							checked={bandenable}
							tip={
								intl.get(
									MODULE,
									30
								) /*_i18n:启用后，当网络带宽占满时，路由器将按照设置的最低保证比例为三类设备划分带宽，进而保证核心设备业务正常处理*/
							}
							onChange={this.OnBandEnable}
						/>
					</div>
					{bandenable ? (
						<div>
							<Form>
								<div className="bandwidth-set-title">
									<label>{intl.get(MODULE,49) /*_i18n:保存*/}</label>
									<span>{intl.get(MODULE, 50) /*_i18n:保存*/}</span>
								</div>
								<div className="bandwidth-set">
									<FormItem
										showErrorTip={upbandTip}
										type="small"
										className="bandwidth-input"
									>
										<label className="bandwidth-unit">
											{unit}
										</label>
										<Input
											type="text"
											value={upband}
											maxLength={4}
											onChange={value =>
												this.onbandChange(
													value,
													'upband'
												)
											}
											placeholder={
												intl.get(
													MODULE,
													36
												) /*_i18n:请输入上行总带宽*/
											}
										/>
										<ErrorTip>{upbandTip}</ErrorTip>
									</FormItem>
									<FormItem
										showErrorTip={downbandTip}
										type="small"
										className="bandwidth-input"
									>
										<label className="bandwidth-unit">
											{unit}
										</label>
										<Input
											type="text"
											value={downband}
											maxLength={4}
											onChange={value =>
												this.onbandChange(
													value,
													'downband'
												)
											}
											placeholder={
												intl.get(
													MODULE,
													38
												) /*_i18n:请输入下行总带宽*/
											}
										/>
										<ErrorTip>{downbandTip}</ErrorTip>
									</FormItem>
									{getQuickStartVersion() === 'domestic' ? (
										<label
											className="speed-auto"
											onClick={this.onPercentChange}
										>
											{intl.get(MODULE, 28)}
										</label>
									) : (
										''
									)}
								</div>
								<Table
									className="qos-table"
									style={{ fontSize: 16, marginTop: 12 }}
									pagination={false}
									columns={columns}
									dataSource={data}
								/>
							</Form>
							<div className="save">
								<Button
									disabled={saveDisable}
									size="large"
									style={{ width: 200, height: 42 }}
									type="primary"
									loading={loading}
									onClick={this.post}
								>
									{intl.get(MODULE, 31) /*_i18n:保存*/}
								</Button>
							</div>
						</div>
					) : (
						<div className="bandwidth-content">
							{intl.get(MODULE, 51) /*_i18n:保存*/}
						</div>
					)}
					{visible && (
						<Progress
							duration={TIME_SPEED_TEST}
							title={
								intl.get(
									MODULE,
									32
								) /*_i18n:正在进行网络测速，请耐心等待…*/
							}
							showPercent={true}
						/>
					)}
					<Modal
						className="speed-result-modal"
						width={560}
						closable={false}
						visible={speedFill}
						centered={true}
						footer={
							<Button
								type="primary"
								onClick={this.onSpeedFillCancle}
							>
								{intl.get(MODULE, 39) /*_i18n:确定*/}
							</Button>
						}
					>
						<div className="status-icon">
							<CustomIcon
								color="#87D068"
								type="succeed"
								size={64}
							/>
						</div>
						<h4>{intl.get(MODULE, 40) /*_i18n:带宽测速完成*/}</h4>
						<ul className="speed-result">
							<li>
								<CustomIcon
									color="#779FF8"
									type="kbyte"
									size={16}
								/>
								<label>
									<span style={{ color: '#adb1b9' }}>
										{intl.get(
											MODULE,
											44
										) /*_i18n:上行带宽：*/}
									</span>
									<span>
										{upband}
										{unit}
									</span>
								</label>
							</li>
							<li>
								<CustomIcon
									color="#ABDE95"
									type="downloadtraffic"
									size={16}
								/>
								<label>
									<span style={{ color: '#adb1b9' }}>
										{intl.get(
											MODULE,
											45
										) /*_i18n:下行带宽：*/}
									</span>
									<span>
										{downband}
										{unit}
									</span>
								</label>
							</li>
						</ul>
					</Modal>
					<Modal
						className="speed-result-modal"
						width={560}
						closable={false}
						visible={speedFail}
						centered={true}
						footer={
							<Button
								type="primary"
								onClick={this.onSpeedFailCancle}
							>
								{intl.get(MODULE, 41) /*_i18n:我知道了*/}
							</Button>
						}
					>
						<div className="status-icon">
							<CustomIcon color="red" type="defeated" size={64} />
						</div>
						<div className="speed-fail">
							{intl.get(
								MODULE,
								42
							) /*_i18n:带宽测速失败，请重试*/}
						</div>
						<div className="speed-fail-tip">
							<div style={{ fontSize: 12, color: '#ADB1B9' }}>
								{failTip}
							</div>
						</div>
					</Modal>
				</div>
			</SubLayout>
		);
	}
}
