import React from 'react';
import Form from "~/components/Form";

const {FormItem, InputGroup, ErrorTip} = Form;
const MODULE = 'network';

class Dns extends React.Component  {
    render (){
		const {dnsname, dnsTip, dns, dnsbackupname, dnsbackupTip, dnsbackup, onChange} = this.props;
		const list = [
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
        return (
            <div className="wifi-settings">
				{
					list.map(item => (
						<React.Fragment key={item.left.key}>
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
        )
    }
};
export default Dns;
