import React from 'react';
import CustomIcon from '~/components/Icon';
import Loading from '~/components/Loading';
import { getQuickStartVersion } from '~/utils';
import { Popover, Button, Input, Carousel } from 'antd';
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
		const { editing } = this.state;
		this.setState({
			editing: !editing
		});
	};

	setTitle = (editing, value, mac, devid) => {
		if (!editing) {
			return (
				<p>
					<label title={value}>{value}</label>
					<label style={{ marginTop: -30 }} onClick={this.toggleEdit}>
						<CustomIcon size={8} type="rename" />
					</label>
				</p>
			);
		} else {
			return (
				<Input
					defaultValue={value}
					placeholder={intl.get(MODULE, 9) /*_i18n:请输入设备位置*/}
					autoFocus={true}
					onPressEnter={e => this.save(e, value, mac, devid)}
					onBlur={e => this.save(e, value, mac, devid)}
					maxLength={32}
				/>
			);
		}
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
					{this.setTitle(editing, name, mac, devid)}
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
						<CustomIcon size={60} color="#fff" type="router" />
					</div>
					<label title={name}>{name}</label>
					<div className={type ? signalClass : 'sate-offline'}>
						{type ? rssi : intl.get(MODULE, 17)}
					</div>
				</div>
			</Popover>
		);
	}
}
