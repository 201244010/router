import React from 'react';
import { Radio } from 'antd';
import AdvancedSettings from './AdvancedSettings';

const RadioGroup = Radio.Group;
const MODULE = 'network';

class Dhcp extends React.Component {
	render() {
		const { onDhcpRadioChange, dhcpType } = this.props;
		return [
			// <div key="dhcp" className="wifi-settings">
			// 	<label>{intl.get(MODULE, 40)/*_i18n:配置*/}</label>
			// 	<RadioGroup key="dhcpdns" className='radio-choice' onChange={onDhcpRadioChange} value={dhcpType}>
			// 		<Radio className="label-in" value='auto'>{intl.get(MODULE, 41)/*_i18n:自动设置*/}</Radio>
			// 		<Radio className="label-in" value='manual'>{intl.get(MODULE, 42)/*_i18n:手动设置*/}</Radio>
			// 	</RadioGroup>
			// </div>,
			<AdvancedSettings
				type='dhcp'
			/>
		];
	}
};
export default Dhcp;
