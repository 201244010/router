import React from 'react';
import { Button } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";

import './AdvancedSettings.scss';

const {FormItem, Input, InputGroup, ErrorTip } = Form;

export default class AdvancedSettings extends React.PureComponent {
	render() {
		const { type = '', serviceName = '', mtu = '', upBandwidth = '', downBandwidth = '', dns = [], dnsBackup = [] } = this.props;
		const content = [
			[
				{
					key: 'upBandwidth',
					label: '上行带宽（1～5000）',
					value: upBandwidth,
					tip: '',
					unit: 'Mbps',
				},
				{
					key: 'downBandwidth',
					label: '下行带宽（1～5000）',
					value: downBandwidth,
					tip: '',
					unit: 'Mbps',
				}
			],
			[
				{
					key: 'dns',
					label: '首选DNS（选填） ',
					value: dns,
					tip: '',
				},
				{
					key: 'dnsBackup',
					label: '备选DNS（选填）',
					value: dnsBackup,
					tip: '',
				}
			],
		];

		let firstItem = [];
		if(type === 'pppoe') {
			firstItem = [
				{
					key: 'serviceName',
					label: '服务名（选填）',
					value: serviceName,
					tip: '',
				},
				{
					key: 'mtu',
					label: 'MTU（576～1492）',
					value: mtu,
					tip: '',
				}
			];
		} else {
			firstItem = [
				{
					key: 'mtu',
					label: 'MTU（576～1492）',
					value: mtu,
					tip: '',
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
													onChange={value => onChange(value, item.key)}
												/>
												:
												<Input
													type='text'
													maxLength={32} 
													value={item.value}
													onChange={value => onChange(value, item.key)}
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