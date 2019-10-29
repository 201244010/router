import React from 'react';
import { Button, message, Radio, Cascader } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';
import {getOptions} from '~/assets/common/cascader';
import './system.scss';

const MODULE = 'customrestart';

export default class CustomRestart extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		enable: true,
		restartTime: [],
		mode: '',
	}

	onPanelChange = () => {
		this.setState({
			enable: !this.state.enable
		})
	}

	fetchRestartTime = async () => {
		const resp = await common.fetchApi([
			{ 
				opcode:'AUTO_RESTART_GET', 
		 	},
		], { ignoreErr: true });
		const {errcode, data} = resp;
		if (0 === errcode) {
			const { enable, time_week: week = '', time_day: day = '', time_start_hour: startHour, mode } = data[0].result;

			let restartTime = [];
			if (week !== '') {
				restartTime = ['week', week, startHour];
			} else if (day !== '') {
				restartTime = ['month', day, startHour];
			} else {
				restartTime = ['day', startHour];
			}

			this.setState({
				enable: enable === '1',
				restartTime: restartTime,
				mode: mode,
			});
		} else {
			message.error(intl.get(MODULE, 3)/*_i18n:获取信息失败*/)
		}
	}

	save = async () => {
		const { enable, restartTime, mode } = this.state;
		const startHour = restartTime[restartTime.length - 1];
		const stopHour = restartTime[restartTime.length - 1] !== '23'? `${parseInt(restartTime[restartTime.length - 1])+1}` : '0';

		let data = {};
		if (restartTime[0] === 'week') {
			data = {
				time_week: restartTime[1],
			}
		}

		if (restartTime[0] === 'month') {
			data = {
				time_day: restartTime[1],
			}
		}

		const resp = await common.fetchApi([
			{ 
				opcode:'AUTO_RESTART_SET', 
				data: {
					...data,
					enable: enable ? '1' : '0',
					time_start_hour: startHour,
					time_stop_hour: stopHour,
					mode: mode,
				},
		 	},
		], { loading: true });
		const {errcode} = resp;
		if (0 === errcode) {
			message.success(intl.get(MODULE, 4)/*_i18n:保存成功*/)
		} else {
			message.error(intl.get(MODULE, 5)/*_i18n:保存失败*/)
		}
	}

	onRadioChange = e => {
		this.setState({
			mode: e.target.value
		})
	}

	onCascaderChange = (value) => {
		this.setState({
			restartTime: value
		});
	}

	componentDidMount() {
		this.fetchRestartTime();
	}

	render() {
		const { enable, mode, restartTime } = this.state;
		return <SubLayout className="settings">
			<div className='settings-content'>
				<PanelHeader title={intl.get(MODULE, 0)/*_i18n:自定义时间*/} checkable={true} checked={enable} onChange={this.onPanelChange}/>
				<div>
					<p className="custom-paragraph">{intl.get(MODULE, 1)/*_i18n:执行规则*/}</p>
					<Radio.Group onChange={this.onRadioChange} value={mode}>
						<Radio value="cycle">{intl.get(MODULE, 7)/*_i18n:循环执行*/}</Radio>
						<Radio value="single">{intl.get(MODULE, 8)/*_i18n:仅执行一次*/}</Radio>
					</Radio.Group>
				</div>
				<div>
					<p className="custom-paragraph">{intl.get(MODULE, 6)/*_i18n:选择升级时间*/}</p>
					<Cascader
						options={getOptions()}
						value={restartTime}
						onChange={this.onCascaderChange}
						className='settings-cascader'
						placeholder= {intl.get(MODULE, 9)/*_i18n:请选择时间*/}
					/>
				</div>
				<div className="customrestart-save">
					<Button type="primary" size='large' className='customrestart-button' onClick={this.save}>{intl.get(MODULE, 2)/*_i18n:保存*/}</Button>
				</div>
			</div>
		</SubLayout>
	}
}