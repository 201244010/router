import React from 'react';
import CustomIcon from '~/components/Icon';
import Loading from '~/components/Loading';
import { getQuickStartVersion } from '~/utils';
import { Popover, Button, Input, Carousel } from 'antd';
import './topology.scss';

import RouterContent from './RouterContent';

const MODULE = 'topology';

export default class Topology extends React.Component {
	constructor(props) {
		super(props);
		this.chooseIndex = null;
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

	arrayGroup = (data, num = 6) => {
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

	toggleEdit = () => {
		const { stopRefresh } = this.props;
		const { editing } = this.state;
		this.setState({
			editing: !editing
		});
		stopRefresh();
	};

	setTitle = ({ editing, name, mac, devid }) => {
		if (!editing) {
			return (
				<p>
					<label title={name}>{name}</label>
					<label className="edit-position" onClick={this.toggleEdit}>
						<CustomIcon size={14} type="rename" />
					</label>
				</p>
			);
		} else {
			return (
				<Input
					defaultValue={name}
					placeholder={intl.get(MODULE, 9) /*_i18n:请输入设备位置*/}
					autoFocus={true}
					onPressEnter={e =>
						this.handleSave({ editing: e, name, mac, devid })
					}
					onBlur={e =>
						this.handleSave({ editing: e, name, mac, devid })
					}
					maxLength={32}
				/>
			);
		}
	};

	handleSave = async payload => {
		const { startRefresh } = this.props;
		await this.save(payload);
		this.setState({
			editing: false
		});
		startRefresh();
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
			online,
			apInfo,
			startRefresh,
			stopRefresh
		} = this.props;
		const { editing } = this.state;
		const listItems = this.arrayGroup(reList, 6).map(item => {
			return (
				<div>
					{item.map(items => {
						return (
							<span className="satelite-li" key={items.mac}>
								<RouterContent
									reList={items}
									save={this.save}
									startRefresh={startRefresh}
									stopRefresh={stopRefresh}
								/>
							</span>
						);
					})}
					{reList.length < 6 && (
						<div className="satelite-li-add">
							<div
								className="add-router"
								onClick={this.addRouter}
							>
								<CustomIcon
									size={40}
									className="topology-white"
									type="add"
								/>
							</div>
							<label>
								{intl.get(MODULE, 4) /*_i18n:添加子路由*/}
							</label>
						</div>
					)}
				</div>
			);
		});
		const { name, mac, devid, ip } = apInfo;
		return (
			<div className="wrapper">
				<div className="internet">
					<ul className="router">
						<li>
							<div>
								<CustomIcon
									size={100}
									className="topology-white"
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
										className="icon-break"
										type="break"
									/>
									<div className="dashpart">
										<div />
										<div />
										<div />
									</div>
									<div className='dashline-button'>
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
								</div>
							)}

							<div className="circle" />
						</li>
						<li>
							<Popover
								placement="bottom"
								arrowPointAtCenter
								trigger="click"
								content={
									<div className="satelite-info">
										{this.setTitle({
											editing,
											name,
											mac,
											devid
										})}
										<ul>
											<li>
												<label>
													{intl.get(
														MODULE,
														10
													) /*_i18n:联网状态：*/}
												</label>
												<span
													className={
														online
															? 'ap-online'
															: 'ap-offline'
													}
												>
													{online
														? intl.get(MODULE, 21)
														: intl.get(MODULE, 8)}
												</span>
											</li>
											<li>
												<label>IP：</label>
												<span>{ip}</span>
											</li>
											<li>
												<label>MAC：</label>
												<span>{mac}</span>
											</li>
										</ul>
									</div>
								}
							>
								<div>
									<CustomIcon
										size={100}
										className="topology-white"
										type="link"
									/>
									<label className="main-router">
										<span>{name}</span>
										<span>{name ? intl.get(MODULE,23)/*_i18n:（主路由）*/ : ''}</span>
									</label>
								</div>
							</Popover>
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
									className="topology-white"
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
											className="topology-white"
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
											className="topology-white"
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
												className="topology-white"
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
											className="topology-white"
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
									type="upload"
									className="icon-speed"
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
									type="download"
									className="icon-speed"
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
