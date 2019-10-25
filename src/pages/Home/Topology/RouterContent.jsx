import React from 'react';
import CustomIcon from '~/components/Icon';
import { Popover, Input, Tooltip } from 'antd';
import './topology.scss';

const MODULE = 'topology';

export default class RouterContent extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		editing: false
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
		const { save, startRefresh } = this.props;
		await save(payload);
		this.setState({
			editing: false
		});
		startRefresh();
	};

	render() {
		const { reList } = this.props;
		const {
			rssi,
			name,
			online,
			connMode: { wired }
		} = reList;
		const type = parseInt(online);
		const highSignal = wired || rssi >= 20;
		const signalClass = highSignal ? 'high-signal' : 'low-signal';
		const apDetail = highSignal ? 'ap-high' : 'ap-low';
		const rssiType = highSignal
			? intl.get(MODULE, 7) /*_i18n:信号较好*/
			: intl.get(MODULE, 18); /*_i18n:信号较差*/
		const Info = ({ type }) => {
			const { ip, mac, parent, name, devid } = reList;
			const { editing } = this.state;
			return (
				<div className="satelite-info">
					{this.setTitle({ editing, name, mac, devid })}
					<ul>
						<li>
							<label>
								{type
									? intl.get(MODULE, 11) /*_i18n:信号强度：*/
									: intl.get(MODULE, 13) /*_i18n:离线*/}
							</label>
							<span className={apDetail}>
								{type ? rssiType : ''}
							</span>
						</li>
						<li>
							<label>IP：</label>
							<span>{ip || '--'}</span>
						</li>
						<li>
							<label>MAC：</label>
							<span>{mac || '--'}</span>
						</li>
						<li>
							<label>
								{intl.get(MODULE, 12) /*_i18n:上级路由：*/}
							</label>
							<span>{parent || '--'}</span>
						</li>
					</ul>
				</div>
			);
		};

		return (
			<Popover
				placement="bottom"
				arrowPointAtCenter
				trigger="click"
				content={<Info type={type} />}
			>
				<div className="sate-router">
					<div>
						<CustomIcon
							size={60}
							type="router"
							className="topology-white"
						/>
					</div>
					<label title={name}>
						{!highSignal && type ? (
							<Tooltip
								placement="bottom"
								title={intl.get(MODULE, 22)}
							>
								<span>
									<CustomIcon
										size={12}
										type="m-hint"
										className="topology-error"
									/>
								</span>
							</Tooltip>
						) : (
							''
						)}
						<span>{name}</span>
					</label>
					<div className={type ? signalClass : 'sate-offline'}>
						{type ? rssiType : intl.get(MODULE, 17)}
					</div>
				</div>
			</Popover>
		);
	}
}
