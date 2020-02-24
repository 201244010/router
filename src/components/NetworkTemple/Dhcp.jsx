import React from 'react';
import AdvancedSettings from './AdvancedSettings';

class Dhcp extends React.Component {
	onChange = (value, key, name) => {
		const { onChange } = this.props;
		onChange(value, key, name);
	}
	render() {
		const { dhcp, setWanInfo, buttonLoading } = this.props;
		const {
			dns1 = ['', '', '', ''],
			dns2 = ['', '', '', ''],
			down = '',
			up = '',
			mtu = '',
		} = dhcp;
		return [
			<AdvancedSettings
				advanceType='dhcp'
				disabledStatus={false}
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
export default Dhcp;
