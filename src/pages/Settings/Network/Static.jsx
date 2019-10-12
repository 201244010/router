import React from 'react';
import Form from "~/components/Form";

const {FormItem, InputGroup, ErrorTip} = Form;
const MODULE = 'network';

class Static extends React.Component {
	render() {
		const {ipv4Tip, ipv4, subnetmaskTip, subnetmask, gatewayTip, gateway, onChange} = this.props;
		const list = [
			{
				label: intl.get(MODULE, 43)/*_i18n:IP地址*/,
				key: 'ipv4',
				value: ipv4,
				tip: ipv4Tip,
			},
			{
				label: intl.get(MODULE, 44)/*_i18n:子网掩码*/,
				key: 'subnetmask',
				value: subnetmask,
				tip: subnetmaskTip,
			},
			{
				label: intl.get(MODULE, 45)/*_i18n:默认网关*/,
				key: 'gateway',
				value: gateway,
				tip: gatewayTip,
			},
		];
		return [
			<div key="static" className="wifi-settings">
				{
					list.map(item => (
						<React.Fragment key={item.label}>
							<label>{item.label}</label>
							<FormItem key={item.key} showErrorTip={item.tip} style={{ width : 320}}>
								<InputGroup                                                                     
									inputs={[{value: item.value[0], maxLength: 3}, {value: item.value[1], maxLength: 3}, {value: item.value[2], maxLength: 3}, {value: item.value[3], maxLength: 3}]} 
									onChange={value => onChange(value, item.key)} />
								<ErrorTip>{item.tip}</ErrorTip>
							</FormItem>
						</React.Fragment>	
					))
				}
			</div>
		];
	}   
};
export default Static;