import React from 'react';
import Form from "~/components/Form";

const {FormItem, InputGroup, ErrorTip} = Form;
const MODULE = 'network';

class Dns extends React.Component  {
    render (){
		const {dnsname, dnsTip, dns, dnsbackupname, dnsbackupTip, dnsbackup, onChange} = this.props;
		const list = [
			{
				label: intl.get(MODULE, 46)/*_i18n:首选DNS*/,
				key: dnsname,
				tip: dnsTip,
				value: dns,
			},
			{
				label: intl.get(MODULE, 47)/*_i18n:备选DNS（选填）*/,
				key: dnsbackupname,
				tip: dnsbackupTip,
				value: dnsbackup,
			},
		];
        return (
            <div className="wifi-settings">
				{
					list.map(item => (
						<React.Fragment key={item.key}>
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
        )
    }
};
export default Dns;