import React from 'react';
import CustomIcon from '~/components/Icon';
import Loading from '~/components/Loading';
import { getQuickStartVersion } from '~/utils';
import { Popover, Button, Input, Carousel } from 'antd';
import './topology.scss';

const MODULE = 'topology';

export default class Topology extends React.Component {
	constructor(props) {
		super(props);
		this.chooseIndex = null;
	}

	state = {
		edit: false
	};

	handleEdit = () => {
		this.setState({
			edit: true
		});
	};

	startDiagnose = () => {
		this.props.history.push('/diagnose');
	};

	setTheme = () => {
		const { online } = this.props;
		const ui = 'ui-fullscreen';
		const doc = document.getElementsByClassName(ui)[0];
		doc.className = `${ui} ${online ? 'home-bg' : 'home-bg-offline'}`;
	};

	arrayGroup = (data, num) => {
		const result = [];

		for (let i = 0, len = data.length; i < len; i += num) {
			result.push(data.slice(i, i + num));
		}

		return result;
	};

	goToBefore = () => {
		this.chooseIndex.prev();
	};

	goToNext = () => {
		this.chooseIndex.next();
	};

	componentDidMount() {
		this.setTheme();
	}

	componentDidUpdate() {
		this.setTheme();
	}

	render() {
		const {
			upSpeed,
			upUnit,
			downSpeed,
			downUnit,
			reList,
			online
		} = this.props;
		const { edit } = this.state;
		const listItems = this.arrayGroup(reList, 6).map(item => {
			return (
				<div>
					{item.map(items => {
						return (
							<span className="satelite-li" key={items.mac}>
								<Item reList={items} />
							</span>
						);
					})}
					{reList.length < 6 && (
						<div className="satelite-li-add">
							<div
								className="add-router"
								onClick={this.addRouter}
							>
								<CustomIcon size={40} color="#fff" type="add" />
							</div>
							<label>
								{intl.get(MODULE, 4) /*_i18n:添加子路由*/}
							</label>
						</div>
					)}
				</div>
			);
		});
		return (
			<div className="wrapper">
				<div className="internet">
					<ul className="router">
						<li>
							<div>
								<CustomIcon
									size={100}
									color="#fff"
									type="network"
								/>
								<label>
									{intl.get(MODULE, 1) /*_i18n:互联网*/}
								</label>
							</div>
						</li>
						<li className="line">
							<div className="circle" />
							{online ? (
								<div className="horizenline" />
							) : (
								<div className="dashline">
									<div className="dashpart">
										<div />
										<div />
										<div />
									</div>
									<CustomIcon
										size={15}
										color="#fff"
										style={{ marginBottom: 8 }}
										type="break"
									/>
									<div className="dashpart">
										<div />
										<div />
										<div />
									</div>
									<Button
										onClick={this.startDiagnose}
										className={
											getQuickStartVersion() === 'abroad'
												? 'diagnose-us'
												: 'diagnose'
										}
									>
										<span>
											{intl.get(
												MODULE,
												0
											) /*_i18n:诊断故障*/}
										</span>
									</Button>
								</div>
							)}

							<div className="circle" />
						</li>
						<li>
							<div>
								<CustomIcon
									size={100}
									color="#fff"
									type="link"
								/>
								<label>
									大厅<span>（主路由）</span>
								</label>
							</div>
						</li>
						<li className="line">
							<div className="circle" />
							<div className="horizenline" />
							<div className="circle" />
						</li>
						<li>
							<div>
								<CustomIcon
									size={100}
									color="#fff"
									type="equipment"
								/>
								<label>
									{intl.get(MODULE, 3) /*_i18n:上网设备*/}
								</label>
							</div>
						</li>
					</ul>
					<div className="strateline">
						<div className="line" />
					</div>
					<div className="satelite">
						<div className="satelite-carousel">
							{reList.length >= 6 && (
								<div className="satelite-pageturning-left">
									<div
										onClick={this.goToBefore}
										className="statelite-custom-left"
									>
										<CustomIcon
											size={32}
											color="white"
											type="pageturning"
										/>
									</div>
									<div className="satelite-linegradient" />
								</div>
							)}
							<Carousel
								ref={el => {
									this.chooseIndex = el;
								}}
							>
								{listItems}
							</Carousel>
							{reList.length === 0 && (
								<div className="satelite-li-add">
									<div
										className="add-router"
										onClick={this.addRouter}
									>
										<CustomIcon
											size={40}
											color="#fff"
											type="add"
										/>
									</div>
									<label>
										{intl.get(
											MODULE,
											4
										) /*_i18n:添加子路由*/}
									</label>
								</div>
							)}
							{reList.length >= 6 && (
								<div className="satelite-pageturning-right">
									<div className="satelite-small-add">
										<div
											className="add-router"
											onClick={this.addRouter}
										>
											<CustomIcon
												size={20}
												color="#fff"
												type="add"
											/>
										</div>
									</div>
									<div className="satelite-linegradient" />
									<div
										onClick={this.goToNext}
										className="statelite-custom-right"
									>
										<CustomIcon
											size={32}
											color="white"
											type="pageturning"
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="speed">
					<ul>
						<li>
							<div>
								<label className="up-speed">
									{intl.get(MODULE, 5) /*_i18n:上传速度*/}
								</label>
								<CustomIcon
									color="#fff"
									type="upload"
									style={{
										marginBottom: 1,
										marginLeft: 3,
										opacity: 0.6
									}}
									size={12}
								/>
							</div>
							<div className="speed-content">
								<label>{upSpeed}</label>
								<span>{upUnit}</span>
							</div>
						</li>
						<li>
							<div>
								<label className="up-speed">
									{intl.get(MODULE, 6) /*_i18n:下载速度*/}
								</label>
								<CustomIcon
									color="#fff"
									type="download"
									style={{
										marginBottom: 1,
										marginLeft: 3,
										opacity: 0.6
									}}
									size={12}
								/>
							</div>
							<div className="speed-content">
								<label>{downSpeed}</label>
								<span>{downUnit}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		);
	}

	addRouter = () => {
		this.props.history.push('/guide/addsubrouter');
	};
}

class Item extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		editing: false
	};

	toggleEdit = () => {
		const editing = !this.state.editing;
		this.setState({
			editing: editing
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
				this.setState({
					editing: false
				});
			}
		}
	};

	render() {
		const reList = this.props.reList;
		console.log('reInfo3', new Date());
		const wired = reList.connMode.wired;
		const type = parseInt(reList.online);
		const role = parseInt(reList.role);
		const highSignal = wired || reList.rssi >= 20;
		const color = highSignal ? '#97E063' : '#FFCEBD';
		const colorDetail = highSignal ? '#60CC13' : '#D0021B';
		const rssi = highSignal
			? intl.get(MODULE, 7) /*_i18n:信号较好*/
			: intl.get(MODULE, 18); /*_i18n:信号较差*/
		const online =
			type === 0
				? intl.get(MODULE, 8) /*_i18n:异常*/
				: intl.get(MODULE, 21); /*_i18n:正常*/
		const Title = (editing, value, mac, devid) => {
			if (!editing) {
				return (
					<p>
						<label title={value}>{value}</label>
						<label
							style={{ marginTop: -30 }}
							onClick={this.toggleEdit}
						>
							<CustomIcon size={8} type="rename" />
						</label>
					</p>
				);
			} else {
				return (
					<Input
						defaultValue={value}
						placeholder={
							intl.get(MODULE, 9) /*_i18n:请输入设备位置*/
						}
						autoFocus={true}
						onPressEnter={e => this.save(e, value, mac, devid)}
						onBlur={e => this.save(e, value, mac, devid)}
						maxLength={32}
					/>
				);
			}
		};
		const Info = (type, role) => {
			if (role) {
				return (
					<div className="satelite-info">
						{Title(
							this.state.editing,
							reList.name,
							reList.mac,
							reList.devid
						)}
						<ul>
							<li>
								<label>
									{intl.get(MODULE, 10) /*_i18n:联网状态：*/}
								</label>
								<span
									style={{
										color:
											type === 0 ? '#DD726D' : '#60CC13'
									}}
								>
									{online}
								</span>
							</li>
							<li>
								<label>IP：</label>
								<span>{reList.ip}</span>
							</li>
							<li>
								<label>MAC：</label>
								<span>{reList.mac}</span>
							</li>
						</ul>
					</div>
				);
			} else {
				switch (type) {
					case 1: //较差较好的情况
						return (
							<div className="satelite-info">
								{Title(
									this.state.editing,
									reList.name,
									reList.mac,
									reList.devid
								)}
								<ul>
									<li>
										<label>
											{intl.get(
												MODULE,
												11
											) /*_i18n:信号强度：*/}
										</label>
										<span style={{ color: colorDetail }}>
											{rssi}
										</span>
									</li>
									<li>
										<label>IP：</label>
										<span>{reList.ip}</span>
									</li>
									<li>
										<label>MAC：</label>
										<span>{reList.mac}</span>
									</li>
									<li>
										<label>
											{intl.get(
												MODULE,
												12
											) /*_i18n:上级路由：*/}
										</label>
										<span>{reList.parent}</span>
									</li>
								</ul>
							</div>
						);
					case 0: //设备离线情况
						return (
							<div className="satelite-info">
								{Title(
									this.state.editing,
									reList.name,
									reList.mac,
									reList.devid
								)}
								<ul>
									<li>
										<label>
											{intl.get(
												MODULE,
												13
											) /*_i18n:离线*/}
										</label>
									</li>
									<li>
										<label>IP：</label>
										<span>--</span>
									</li>
									<li>
										<label>MAC：</label>
										<span>{reList.mac}</span>
									</li>
									<li>
										<label>
											{intl.get(
												MODULE,
												14
											) /*_i18n:上级路由：*/}
										</label>
										<span>--</span>
									</li>
								</ul>
							</div>
						);
					default:
						return <noscript />;
				}
			}
		};

		const contentType = (type, role) => {
			if (role) {
				return (
					<div className="sate-router">
						<CustomIcon size={60} color="#fff" type="router" />
						<label>
							<CustomIcon
								size={14}
								color="#fff"
								style={{
									display: 'inline',
									marginRight: 4,
									verticalAlign: 'unset'
								}}
								type="main"
							/>
							<span title={reList.name}>{reList.name}</span>
						</label>
					</div>
				);
			} else {
				switch (type) {
					case 1: //较差较好的情况
						return (
							<div className="sate-router">
								<div>
									<CustomIcon
										size={60}
										color="#fff"
										type="router"
									/>
								</div>
								<label title={reList.name}>{reList.name}</label>
								<p>
									<span style={{ color: color }}>{rssi}</span>
								</p>
							</div>
						);
					case 0: //设备离线情况
						return (
							<div className="sate-router">
								<div>
									<CustomIcon
										size={60}
										color="#fff"
										type="router"
									/>
								</div>
								<label title={reList.name}>{reList.name}</label>
								<p className="sate-offline">
									{intl.get(MODULE, 17) /*_i18n:已离线*/}
								</p>
							</div>
						);
				}
			}
		};
		return (
			<Popover
				placement="bottomLeft"
				arrowPointAtCenter
				trigger="click"
				content={Info(type, role)}
			>
				{contentType(type, role)}
			</Popover>
		);
	}
}
