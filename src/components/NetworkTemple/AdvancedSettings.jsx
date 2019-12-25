import React from 'react';
import { Button } from 'antd';
import { checkIp, checkMask, checkSameNet, checkStr, checkRange } from '~/assets/common/check';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";

import './AdvancedSettings.scss';

const {FormItem, Input, InputGroup, ErrorTip } = Form;

export default class AdvancedSettings extends React.PureComponent {
	onChange = (value, key, name) => {
		const { onChange } = this.props;
		onChange(value, key, name);
	}
	render() {
		const { type = '', serviceName = '', mtu = '', upBandwidth = '', downBandwidth = '', dns = ['', '', '', ''], dnsBackup = ['', '', '', ''] } = this.props;
		console.log('dns', dns, 'dnsBackup', dnsBackup);
		const content = [
			[
				{
					key: 'up',
					label: '上行带宽（1～5000）',
					value: upBandwidth,
					tip: checkRange(upBandwidth, { min: 1, max: 5000, who: '上行带宽'}),
					unit: 'Mbps',
				},
				{
					key: 'down',
					label: '下行带宽（1～5000）',
					value: downBandwidth,
					tip: checkRange(downBandwidth, { min: 1, max: 5000, who: '上行带宽'}),
					unit: 'Mbps',
				}
			],
			[
				{
					key: 'dns1',
					label: '首选DNS（选填） ',
					value: dns,
					tip: checkIp(dns, {who: '首选DNS'}),
				},
				{
					key: 'dns2',
					label: '备选DNS（选填）',
					value: dnsBackup,
					tip: checkIp(dnsBackup, {who: '备选DNS'}),
				}
			],
		];

		let firstItem = [];
		if(type === 'pppoe') {
			firstItem = [
				{
					key: 'service',
					label: '服务名（选填）',
					value: serviceName,
					tip: '',
				},
				{
					key: 'mtu',
					label: 'MTU（576～1492）',
					value: mtu,
					tip: checkRange(upBandwidth, { min: 576, max: 1492, who: 'MTU'}),
				}
			];
		} else {
			firstItem = [
				{
					key: 'mtu',
					label: 'MTU（576～1492）',
					value: mtu,
					tip: checkRange(upBandwidth, { min: 576, max: 1492, who: 'MTU'}),
				}
			];
		}
		
		content.unshift(firstItem);

		return (
			<React.Fragment>
				<PanelHeader className='advancedSettings-PanelHeader' title={'高级设置'} checkable={false} checked={true} />
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
													onChange={value => this.onChange(value, item.key, type)}
												/>
												:
												<Input
													type='text'
													maxLength={32} 
													value={item.value}
													onChange={value => this.onChange(value, item.key, type)}
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
			</React.Fragment>
		);
	}
}