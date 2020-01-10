import React from 'react';
import { Checkbox, Select, Button, Radio, message, Modal, Icon } from 'antd';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import DynamicPassword from './DynamicPassword';
import PortalAccess from './PortalAccess';
import './index.scss';

const { FormItem, ErrorTip, Input } = Form;
const { Option } = Select;

const MODULE = 'wi-fi';
export default class GuestWifi extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			guestEnable: true,
			radioValue: 4,
			guestSsid: '',
			guestSsidTip: ''
		};
	}

	onGuestEnableChange = type => {
		this.setState({
			guestEnable: type
		});
	};

	onRadioChange = e => {
		this.setState({
			radioValue: e.target.value
		});
	};

	onChange = () => {

	}

	render() {
		const { guestEnable, radioValue, guestSsid, guestSsidTip } = this.state;
		return (
			<SubLayout className="settings">
				<div className="guest-wifi">
					<div className="guest-padding">
						<PanelHeader
							title={intl.get(MODULE, 65) /*_i18n:客用Wi-Fi*/}
							checkable={true}
							checked={guestEnable}
							onChange={this.onGuestEnableChange}
							tip={intl.get(MODULE, 86) /*_i18n:建议开放给顾客使用*/}
						/>
					</div>
					{guestEnable ? (
						<div>
                			<Form className='guest-form'>
								<label className='ssidLabel'>{intl.get(MODULE, 66)/*_i18n:Wi-Fi名称*/}</label>
								<FormItem type="small" showErrorTip={guestSsidTip} style={{ width : 320}}>
									<Input type="text" maxLength={32} value={guestSsid} onChange={(value)=>this.onChange('guestSsid',value)}/>
									<ErrorTip>{guestSsidTip}</ErrorTip>
								</FormItem>
							</Form>
							<div className='guest-select'>
								<label>加密方式：</label>
								<Radio.Group value={radioValue} onChange={this.onRadioChange}>
									<Radio value={1}>不设密码</Radio>
									<Radio value={2}>普通密码</Radio>
									<Radio value={3}>动态密码</Radio>
									<Radio value={4}>Portal认证</Radio>
								</Radio.Group>
							</div>
							{
								radioValue === 2 && 
								<div>
									<Form>
										<label className='ssidLabel'>{intl.get(MODULE, 66)/*_i18n:Wi-Fi名称*/}</label>
										<FormItem type="small" showErrorTip={guestSsidTip} style={{ width : 320}}>
											<Input type="text" maxLength={32} value={guestSsid} onChange={(value)=>this.onChange('guestSsid',value)}/>
											<ErrorTip>{guestSsidTip}</ErrorTip>
										</FormItem>
									</Form>
								</div>
							}
							{
								radioValue === 3 && <DynamicPassword {...{  }}/> 
							}
							{
								radioValue === 4 && <PortalAccess />
							}
							<Button
								type="primary"
								size="large"
								className="guest-button "
								style={{ width: 200, height: 42 }}
							>
								{intl.get(MODULE, 77) /*_i18n:保存*/}
							</Button>
						</div>
					) : (
						<div className="guest-close-content">
							专为店内顾客设立的Wi-Fi网络，即使客流高峰也不影响店内主网络，建议开启
						</div>
					)}
				</div>
			</SubLayout>
		);
	}
}
