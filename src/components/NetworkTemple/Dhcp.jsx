import React from 'react';
import { Radio } from 'antd';
import AdvancedSettings from './AdvancedSettings';

const RadioGroup = Radio.Group;
const MODULE = 'network';

class Dhcp extends React.Component {
	onChange = (value, key, name) => {
		const { onChange } = this.props;
		onChange(value, key, name);
	}
	render() {
		const { dhcp } = this.props;
		const {
			dns1 = ['', '', '', ''],
			dns2 = ['', '', '', ''],
			down = '',
			up = '',
			mtu = '',
		} = dhcp;
		return [
			<AdvancedSettings
				type='dhcp'
				mtu={mtu}
				upBandwidth={up}
				downBandwidth={down}
				dns={dns1}
				dnsBackup={dns2}
				onChange={this.onChange}
			/>
		];
	}
};
export default Dhcp;
