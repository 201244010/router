import React from 'react';
import Form from "~/components/Form";
import { checkIp, checkMask } from '~/assets/common/check';
import AdvancedSettings from './AdvancedSettings';

const {FormItem, InputGroup, ErrorTip} = Form;
const MODULE = 'network';

class Static extends React.Component {
	onChange = (value, key, name) => {
		const { onChange } = this.props;
		onChange(value, key, name);
	}

	render() {
		const { staticIP, setWanInfo, buttonLoading } = this.props;
		const {
			down = '',
			up = '',
			gateway = ['', '', '', ''],
			mask = ['', '', '', ''],
			ipv4 = ['', '', '', ''],
			dns1 = ['', '', '', ''],
			dns2 = ['', '', '', ''],
			mtu = '',
		} = staticIP;
		const list = [
			[
				{
					label: intl.get(MODULE, 43)/*_i18n:IP地址*/,
					key: 'ipv4',
					value: ipv4,
					tip: checkIp(ipv4, {who: intl.get(MODULE, 43)/*_i18n:IP地址*/}),
				},
			],
			[
				{
					label: intl.get(MODULE, 44)/*_i18n:子网掩码*/,
					key: 'mask',
					value: mask,
					tip: checkMask(mask, {who: intl.get(MODULE, 44)/*_i18n:子网掩码*/}),
				},
				{
					label: intl.get(MODULE, 45)/*_i18n:默认网关*/,
					key: 'gateway',
					value: gateway,
					tip: checkIp(gateway, {who: intl.get(MODULE, 45)/*_i18n:默认网关*/}),
				},
			],
		];
		const disabledStatus = list.some(item => item.some(item => item.tip !== ''));
		return [
			<div key="static" className="wifi-settings">
				{
					list.map(item => (
						<React.Fragment key={item[0].label}>
							<div className='network-row'>
								{
									item.map((item, index) => (
										<div className={index > 0 && 'row-right'}>
											<label>{item.label}</label>
											<FormItem key={item.key} showErrorTip={item.tip} style={{ width : 320}}>
												<InputGroup                                                                     
													inputs={[{value: item.value[0], maxLength: 3}, {value: item.value[1], maxLength: 3}, {value: item.value[2], maxLength: 3}, {value: item.value[3], maxLength: 3}]} 
													onChange={value => this.onChange(value, item.key, 'staticIP')} />
												<ErrorTip>{item.tip}</ErrorTip>
											</FormItem>
										</div>
									))
								}
							</div>
						</React.Fragment>	
					))
				}
			</div>,
			<AdvancedSettings
				advanceType='staticIP'
				disabledStatus={disabledStatus}
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
export default Static;