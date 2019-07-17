import React from 'react';
import './system.scss';
import {Button, Select, message} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';

const MODULE = 'customupgrade';
const {Option} = Select;

export default class CustomUpgrade extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		enable: true,
		upgradeTime: 0
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
			const { enable, time_start: timeStart } = data[0].result;
			this.setState({
				enable: parseInt(enable) ? true : false,
				upgradeTime: Math.floor(timeStart / 3600)
			})
		} else {
			message.error(intl.get(MODULE, 3)/*_i18n:获取信息失败*/)
		}
	}

	save = async () => {
		const {enable, upgradeTime} = this.state;
		const resp = await common.fetchApi([
			{ 
				opcode:'UPGRADETIME_SET', 
				data: {
					time_start: upgradeTime * 3600 + '' ,
					time_stop: (upgradeTime + 1) * 3600 + '',
					enable: enable ? '1' : '0'
				},
				loading: true
		 	},
		], { ignoreErr: true });
		const {errcode} = resp;
		if (0 === errcode) {
			message.success(intl.get(MODULE, 4)/*_i18n:保存成功*/)
		} else {
			message.error(intl.get(MODULE, 5)/*_i18n:保存失败*/)
		}
	}

	onSelectChange = (value) => {
		this.setState({
			upgradeTime: value
		});
	}

	componentDidMount() {
		this.fetchUpgradeTime();
	}

	render() {
		const { enable, upgradeTime } = this.state;
		return <SubLayout className="settings">
			<div style={{ margin: "0 60px" }}>
				<PanelHeader title={intl.get(MODULE, 0)/*_i18n:自定义时间*/} checkable={true} checked={enable} onChange={this.onPanelChange}/>
				<p className="custom-paragraph">{intl.get(MODULE, 1)/*_i18n:选择升级时间段*/}</p>
				<Select onChange={this.onSelectChange} value={upgradeTime} disabled={!enable} style={{width:320, height:36}}>
					<Option value={0}>00:00-01:00</Option>
					<Option value={1}>01:00-02:00</Option>
					<Option value={2}>02:00-03:00</Option>
					<Option value={3}>03:00-04:00</Option>
					<Option value={4}>04:00-05:00</Option>
				</Select>
			</div>

			<div className="custom-save">
                <Button type="primary" size='large' style={{ width: 200, height: 42 }} onClick={this.save}>{intl.get(MODULE, 2)/*_i18n:保存*/}</Button>
            </div>
		</SubLayout>
	}
}