import React from 'react';
import { Button, message, Radio, Cascader } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';
import {getOptions} from '~/assets/common/cascader';

import './system.scss';

const MODULE = 'customupgrade';

export default class CustomUpgrade extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		enable: true,
		upgradeTime: [],
		mode: '',
	}

	onPanelChange = () => {
		this.setState({
			enable: !this.state.enable
		})
	}

	fetchUpgradeTime = async () => {
		const resp = await common.fetchApi([
			{ 
				opcode:'UPGRADETIME_GET',
		 	},
		], { ignoreErr: true });
		const {errcode, data} = resp;
		if (0 === errcode) {
			const { enable, time_week: week = '', time_day: day = '', time_start_hour: startHour, mode } = data[0].result;

			let upgradeTime = [];
			if (week !== '') {
				upgradeTime = ['week', week, startHour];
			} else if (day !== '') {
				upgradeTime = ['month', day, startHour];
			} else {
				upgradeTime = ['day', startHour];
			}

			this.setState({
				enable: enable === '1',
				upgradeTime: upgradeTime,
				mode: mode,
			});
		} else {
			message.error(intl.get(MODULE, 3)/*_i18n:获取信息失败*/)
		}
	}

	save = async () => {
		const { enable, upgradeTime, mode } = this.state;
		const startHour = upgradeTime[upgradeTime.length - 1];
		const stopHour = upgradeTime[upgradeTime.length - 1] !== '23'? `${parseInt(upgradeTime[upgradeTime.length - 1])+1}` : '0';

		let data = {};
		if (upgradeTime[0] === 'week') {
			data = {
				time_week: upgradeTime[1],
			}
		}

		if (upgradeTime[0] === 'month') {
			data = {
				time_day: upgradeTime[1],
			}
		}

		const resp = await common.fetchApi([
			{ 
				opcode:'UPGRADETIME_SET', 
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
			upgradeTime: value
		});
	}

	componentDidMount() {
		this.fetchUpgradeTime();
	}

	render() {
		const { enable, mode, upgradeTime } = this.state;
		return (
			<React.Fragment>
				<div className='settings-content'>
					<PanelHeader
						className='custom-upgrade-location'
						title={intl.get(MODULE, 0)/*_i18n:自动升级*/}
						checkable={true} checked={enable}
						onChange={this.onPanelChange}
						checkedChildren={intl.get(MODULE, 11)/*_i18n:开*/}				
						unCheckedChildren={intl.get(MODULE, 12)/*_i18n:关*/}/>
					{!enable&&<p>{intl.get(MODULE, 10)/*_i18n:路由器可以在指定空闲时间点自动升级最新固件*/}</p>}
					{
						enable&&<React.Fragment>
							<div>
								<p className="custom-paragraph">{intl.get(MODULE, 1)/*_i18n:选择升级时间*/}</p>
								<Radio.Group onChange={this.onRadioChange} value={mode}>
									<Radio value='cycle'>{intl.get(MODULE, 7)/*_i18n:循环执行*/}</Radio>
									<Radio value='single'>{intl.get(MODULE, 8)/*_i18n:仅执行一次*/}</Radio>
								</Radio.Group>
							</div>
							<div>
								<p className="custom-paragraph">{intl.get(MODULE, 6)/*_i18n:执行规则*/}</p>
								<Cascader
									options={getOptions()}
									value={upgradeTime}
									onChange={this.onCascaderChange}
									className='settings-cascader'
									placeholder={intl.get(MODULE, 9)/*_i18n:请选择时间*/}
								/>
							</div>
						</React.Fragment>
					}	
				</div>
				<div className="custom-save">
					<Button type="primary" size='large' className='custom-button' onClick={this.save}>{intl.get(MODULE, 2)/*_i18n:保存*/}</Button>
				</div>
			</React.Fragment>
		);
			
		
	}
}