import React from 'react';
// import { Radio } from 'antd';
import AdvancedSettings from './AdvancedSettings';
import Form from "~/components/Form";

const {FormItem, Input, ErrorTip} = Form;
// const RadioGroup = Radio.Group;
const MODULE = 'network';

class PPPoE extends React.Component {
	render() {
		const { pppoeAccountTip, pppoeAccount, handleAccountChange, pppoePasswordTip, hostSsidPasswordDisabled, pppoePassword, handlePasswordChange, onPppoeRadioChange, pppoeType } = this.props;

		return [
			<div key="pppoe" className="wifi-settings">
				<div className='network-row'>
					<div>
						<label>{intl.get(MODULE, 35)/*_i18n:账号*/}</label>
						<FormItem showErrorTip={pppoeAccountTip} key="pppoessid" type="small" style={{ width : 320}}>
							<Input type="text" value={pppoeAccount} maxLength={64} onChange={handleAccountChange} />
							<ErrorTip>{pppoeAccountTip}</ErrorTip>
						</FormItem>
					</div>
					<div className='row-right'>
						<label>{intl.get(MODULE, 36)/*_i18n:密码*/}</label>
						<FormItem showErrorTip={pppoePasswordTip} key="pppoepassword" type="small" style={{ width : 320}}>
							<Input type="password" disabled={hostSsidPasswordDisabled} maxLength={32} 
							value={pppoePassword} onChange={handlePasswordChange} />
							<ErrorTip>{pppoePasswordTip}</ErrorTip>
						</FormItem>
					</div>
				</div>
			</div>,
			<AdvancedSettings
				type='pppoe'
			/>
		];
	}  
};
export default PPPoE;