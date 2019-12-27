import React from 'react';
import { checkIp, checkMask, checkSameNet, checkStr } from '~/assets/common/check';
import AdvancedSettings from './AdvancedSettings';
import Form from "~/components/Form";

const {FormItem, Input, ErrorTip} = Form;
const MODULE = 'network';

class PPPoE extends React.Component {
	onChange = (value, key, name) => {
		const { onChange } = this.props;
		onChange(value, key, name);
	}
	render() {
		const {pppoe, usernameTip = '', passwordTip = '', setWanInfo, buttonLoading} = this.props;
		const {
			dns1 = ['', '', '', ''],
			dns2 = ['', '', '', ''],
			down = '',
			up = '',
			username = '',
			password = '',
			mtu = '',
			service = '',
		} = pppoe;
		const disabledStatus = usernameTip !== '' || passwordTip!=='';
		return [
			<div key="pppoe" className="wifi-settings">
				<div className='network-row'>
					<div>
						<label>{intl.get(MODULE, 35)/*_i18n:账号*/}</label>
						<FormItem showErrorTip={usernameTip} key="pppoessid" type="small" style={{ width : 320}}>
							<Input type="text" value={username} maxLength={64} onChange={value => this.onChange(value, 'username', 'pppoe')} />
							<ErrorTip>{usernameTip}</ErrorTip>
						</FormItem>
					</div>
					<div className='row-right'>
						<label>{intl.get(MODULE, 36)/*_i18n:密码*/}</label>
						<FormItem showErrorTip={passwordTip} key="pppoepassword" type="small" style={{ width : 320}}>
							<Input type="password" maxLength={32} value={password} onChange={value => this.onChange(value, 'password', 'pppoe')} />
							<ErrorTip>{passwordTip}</ErrorTip>
						</FormItem>
					</div>
				</div>
			</div>,
			<AdvancedSettings
				advanceType='pppoe'
				disabledStatus={disabledStatus}
				serviceName={service}
				mtu={mtu}
				upBandwidth={up}
				downBandwidth={down}
				dns={dns1}
				dnsBackup={dns2}
				onChange={this.onChange}
				setWanInfo={setWanInfo}
				buttonLoading={buttonLoading}
			/>
		];
	}  
};
export default PPPoE;