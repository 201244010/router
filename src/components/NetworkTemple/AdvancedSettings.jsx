import React from 'react';
import { Button } from 'antd';
import { checkIp, checkRange } from '~/assets/common/check';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";

import './AdvancedSettings.scss';

const MODULE = 'network';

const {FormItem, Input, InputGroup, ErrorTip } = Form;

export default class AdvancedSettings extends React.PureComponent {
	onChange = (value, key, name) => {
		const { onChange } = this.props;
		onChange(value, key, name);
	}
	checkDnsSame = (dns, dnsBackup) => {
		let same = 0;
		if(dns.every(item => item !== '') && dnsBackup.every(item => item !== '')) {
			const len = dns.length;
			for(let i = 0; i < len; i++) {
				if(dns[i] === dnsBackup[i]){
					same++;
				}
			}
		}
		return same === 4;
	}
	render() {
		const { setWanInfo, disabledStatus, buttonLoading, advanceType = '', serviceName = '', mtu = '', upBandwidth = '', downBandwidth = '', dns = ['', '', '', ''], dnsBackup = ['', '', '', ''] } = this.props;
		const dnsSame = this.checkDnsSame(dns, dnsBackup);
		const content = [
			[
				{
					key: 'up',
					label: intl.get(MODULE, 3)/*_i18n:上行带宽（1～5000）*/,
					value: upBandwidth,
					tip: checkRange(upBandwidth, { min: 1, max: 5000, who: intl.get(MODULE, 4)/*_i18n:上行带宽*/}),
					unit: 'Mbps',
				},
				{
					key: 'down',
					label: intl.get(MODULE, 5)/*_i18n:下行带宽（1～5000）*/,
					value: downBandwidth,
					tip: checkRange(downBandwidth, { min: 1, max: 5000, who: intl.get(MODULE, 6)/*_i18n:下行带宽*/}),
					unit: 'Mbps',
				}
			],
			[
				{
					key: 'dns1',
					label: advanceType === 'staticIP'? intl.get(MODULE, 7)/*_i18n:首选DNS*/ : intl.get(MODULE, 8)/*_i18n:首选DNS（选填）*/,
					value: dns,
					tip: advanceType === 'staticIP'? checkIp(dns, {who: intl.get(MODULE, 7)/*_i18n:首选DNS*/}) : (dns.every(item => item === '') ? '' : checkIp(dns, {who: intl.get(MODULE, 7)/*_i18n:首选DNS*/})),
				},
				{
					key: 'dns2',
					label: intl.get(MODULE, 9)/*_i18n:备选DNS（选填）*/,
					value: dnsBackup,
					tip: dnsBackup.every(item => item === '') ? '' : (dnsSame? intl.get(MODULE, 10)/*_i18n:备选DNS（选填）*/ : checkIp(dnsBackup, {who: intl.get(MODULE, 11)/*_i18n:备选DNS*/})),
				}
			],
		];

		let firstItem = [];
		if(advanceType === 'pppoe') {
			firstItem = [
				{
					key: 'service',
					label: intl.get(MODULE, 12)/*_i18n:服务名（选填）*/,
					value: serviceName,
					tip: '',
				},
				{
					key: 'mtu',
					label: 'MTU（576～1492）',
					value: mtu,
					tip: checkRange(mtu, { min: 576, max: 1492, who: 'MTU'}),
				}
			];
		} else {
			firstItem = [
				{
					key: 'mtu',
					label: 'MTU（576～1500）',
					value: mtu,
					tip: checkRange(mtu, { min: 576, max: 1500, who: 'MTU'}),
				}
			];
		}
		
		content.unshift(firstItem);

		const buttonStatus = content.some(item => item.some(item => item.tip !== ''));
		const disabled = disabledStatus || buttonStatus;
		return (
			<React.Fragment>
				<PanelHeader className='advancedSettings-PanelHeader' title={intl.get(MODULE, 13)/*_i18n:高级设置*/} checkable={false} checked={true} />
				{
					content.map(item => (
						<React.Fragment key={item[0].key}>
							<div className='advancedSettings-row'>
								{item.map((item, index) => (
									<div className={index > 0 && 'row-right'} key={item.key}>
										<label>{item.label}</label>
										<FormItem showErrorTip={item.tip} style={{ width : 320}}>
											{
												typeof(item.value) === 'object' ?
												<InputGroup                                                                     
													inputs={[{value: item.value[0], maxLength: 3}, {value: item.value[1], maxLength: 3}, {value: item.value[2], maxLength: 3}, {value: item.value[3], maxLength: 3}]} 
													onChange={value => this.onChange(value, item.key, advanceType)}
												/>
												:
												<Input
													type='text'
													maxLength={32} 
													value={item.value}
													onChange={value => this.onChange(value, item.key, advanceType)}
												/>
											}
											<ErrorTip>{item.tip}</ErrorTip>
										</FormItem>
									</div>
								))}
							</div>
						</React.Fragment>
					))
				}
				<section className="advancedSettings-save">
			<Button type="primary" size='large' className='advancedSettings-save-button' loading={buttonLoading} disabled={disabled} onClick={setWanInfo} >{intl.get(MODULE, 14)/*_i18n:保存*/}</Button>
                </section>
			</React.Fragment>
		);
	}
}