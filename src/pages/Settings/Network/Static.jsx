import React from 'react';
import Form from "~/components/Form";

const {FormItem, InputGroup, ErrorTip} = Form;
const MODULE = 'network';

class Static extends React.Component {
	render() {
		const {ipv4Tip, ipv4, subnetmaskTip, subnetmask, gatewayTip, gateway, onChange,dnsname, dnsTip, dns, dnsbackupname, dnsbackupTip, dnsbackup,} = this.props;
		const list = [
			{
				left: {
					label: intl.get(MODULE, 43)/*_i18n:IP地址*/,
					key: 'ipv4',
					value: ipv4,
					tip: ipv4Tip,
				},
			},
			{
				left: {
					label: intl.get(MODULE, 44)/*_i18n:子网掩码*/,
					key: 'subnetmask',
					value: subnetmask,
					tip: subnetmaskTip,
				},
				right: {
					label: intl.get(MODULE, 45)/*_i18n:默认网关*/,
					key: 'gateway',
					value: gateway,
					tip: gatewayTip,
				},
			},
			{
				left: {
					label: intl.get(MODULE, 46)/*_i18n:首选DNS*/,
					key: dnsname,
					tip: dnsTip,
					value: dns,
				},
				right: {
					label: intl.get(MODULE, 47)/*_i18n:备选DNS（选填）*/,
					key: dnsbackupname,
					tip: dnsbackupTip,
					value: dnsbackup,
				},
			}
		];
		return [
			<div key="static" className="wifi-settings">
				{
					list.map(item => (
						<React.Fragment key={item.left.label}>
							<div className='network-row'>
								<div>
									<label>{item.left.label}</label>
									<FormItem key={item.left.key} showErrorTip={item.left.tip} style={{ width : 320}}>
										<InputGroup                                                                     
											inputs={[{value: item.left.value[0], maxLength: 3}, {value: item.left.value[1], maxLength: 3}, {value: item.left.value[2], maxLength: 3}, {value: item.left.value[3], maxLength: 3}]} 
											onChange={value => onChange(value, item.left.key)} />
										<ErrorTip>{item.left.tip}</ErrorTip>
									</FormItem>
								</div>
								{
									item.right&&<div className='row-right'>
										<label>{item.right.label}</label>
										<FormItem key={item.right.key} showErrorTip={item.right.tip} style={{ width : 320}}>
											<InputGroup                                                                     
												inputs={[{value: item.right.value[0], maxLength: 3}, {value: item.right.value[1], maxLength: 3}, {value: item.right.value[2], maxLength: 3}, {value: item.right.value[3], maxLength: 3}]} 
												onChange={value => onChange(value, item.right.key)} />
											<ErrorTip>{item.right.tip}</ErrorTip>
										</FormItem>
									</div>
								}
							</div>
						</React.Fragment>	
					))
				}
			</div>
		];
	}   
};
export default Static;
