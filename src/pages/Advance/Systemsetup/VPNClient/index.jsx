import React from 'react';
import { Button } from 'antd';
import Form from "~/components/Form";
import { checkStr } from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';

import './vpnClient.scss';

const {FormItem, Input, ErrorTip} = Form;

class VPNClient extends React.Component {
	state = {
		serviceAddress: '',
		userName: '',
		password: '',
		buttonLoading: false,
	}

	onChange = (value, name) => {
		console.log('value', value, 'name', name);
		this.setState({
			[name]: value
		});
	}

	save = () => {

	}

	render() {
		const { serviceAddress, userName, password, buttonLoading } = this.state;
		const staticInfo = [
			{
				label: '当前状态：',
				value: '',
			},
			{
				label: 'IP地址：',
				value: '0.0.0.0',
			},
			{
				label: 'DNS服务器：',
				value: '0.0.0.0',
			},
		];
		const inputInfo = [
			{
				label: '服务器地址: ',
				value: serviceAddress,
				name: 'serviceAddress',
				type: 'text',
				tip: checkStr(serviceAddress, { who: '服务器地址', min: 1, byte: true }),
			},
			{
				label: '用户名: ',
				value: userName,
				name: 'userName',
				type: 'text',
				tip: checkStr(userName, { who: '用户名', min: 1, byte: true }),
			},
			{
				label: '密码: ',
				value: password,
				name: 'password',
				type: 'password',
				tip: checkStr(password, { who: '密码', min: 1, byte: true }),
			},
		];

		const disabled = inputInfo.some(item => item.tip !== '');
		return (
			<SubLayout className="settings">
				<Form className='vpnClient-settings'>
					<PanelHeader title='当前上网信息' checkable={false} checked={true} />
					{
						staticInfo.map(item => (
							<div className='info-item' key={item.label}>
								<label className='info-item-normal-label'>{item.label}</label>
								<span>{item.value}</span>
							</div>
						))
					}
					<PanelHeader title='VPN设置' className='panelHeader-setting' checkable={false} checked={true} />
					{
						inputInfo.map(item => (
							<div className='info-item' key={item.label}>
								<label className='info-item-input-label'>{item.label}</label>
								<FormItem showErrorTip={item.tip} type="small" className='info-item-formItem'>
									<Input type={item.type} value={item.value} onChange={value => this.onChange(value, item.name)} />
									<ErrorTip>{item.tip}</ErrorTip>
								</FormItem>
							</div>
						))
					}
					<div className='vpnClient-save'>
					<Button type="primary" size='large' className='save-button' loading={buttonLoading} disabled={disabled} onClick={this.save} >保存</Button>
					</div>
				</Form>
			</SubLayout>
		);
	}
}
export default VPNClient;