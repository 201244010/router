import React from 'react';
import { Button, message } from 'antd';
import Form from "~/components/Form";
import { checkStr } from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';

import './vpnClient.scss';

const MODULE = 'vpn';
const {FormItem, Input, ErrorTip} = Form;

class VPNClient extends React.Component {
	state = {
		serviceAddress: '',
		userName: '',
		password: '',
		buttonLoading: false,
		status: 'offline',
		ip: '',
		dns: '',
	}

	getVPNInfo = async() => {
		const resp = await common.fetchApi(
            { opcode : 'VPN_GET'}
		);
		const { errcode, data } = resp;
		if(errcode === 0) {
			const vpnInfo = data[0].result.vpn || {};
			const {
				server= '',
                conntype= '',
                psk= '',
                user= '',
                password= '',
                status= '',
                ip= '',
                dns= '',
			} = vpnInfo;
			this.setState({
				serviceAddress: server,
				userName: user,
				password: password,
				status: status,
				ip: ip,
				dns: dns,
			});
		}
	}

	refreshVPNInfo = async() => {
		const resp = await common.fetchApi(
            { opcode : 'VPN_GET'}
		);
		const { errcode, data } = resp;
		if(errcode === 0) {
			const vpnInfo = data[0].result.vpn || {};
			const {
                status= '',
                ip= '',
                dns= '',
			} = vpnInfo;
			this.setState({
				status: status,
				ip: ip,
				dns: dns,
			});
		}
	}

	onChange = (value, name) => {
		this.setState({
			[name]: value
		});
	}

	save = async() => {
		const { serviceAddress, userName, password } = this.state;
		const resp = await common.fetchApi(
            {
				opcode : 'VPN_SET',
				data: {
					vpn:{
						server: serviceAddress,
						conntype: '0',
						psk: '123456',
						user: userName,
						password: password,
					}
				}
			}
		);

		const { errcode } = resp;
		if(errcode === 0) {
			message.success(intl.get(MODULE, 0)/*_i18n:设置成功*/);
		} else {
			message.error(intl.get(MODULE, 1)/*_i18n:设置失败*/);
		}
	}

	componentDidMount() {
		this.getVPNInfo();
		this.refresh = setInterval(this.refreshVPNInfo, 3000);
	}

	componentWillUnmount() {
		clearInterval(this.refresh);
	}

	render() {
		const { serviceAddress, userName, password, buttonLoading, status, ip, dns } = this.state;
		const staticInfo = [
			{
				label: intl.get(MODULE, 2)/*_i18n:当前状态：*/,
				value: status === 'offline'? intl.get(MODULE, 3)/*_i18n:未连接*/: intl.get(MODULE, 4)/*_i18n:已连接*/,
			},
			{
				label: intl.get(MODULE, 5)/*_i18n:IP地址：*/,
				value: ip,
			},
			{
				label: intl.get(MODULE, 6)/*_i18n:DNS服务器：*/,
				value: dns,
			},
		];
		const inputInfo = [
			{
				label: intl.get(MODULE, 7)/*_i18n:服务器地址: */,
				value: serviceAddress,
				name: 'serviceAddress',
				type: 'text',
				tip: checkStr(serviceAddress, { who: intl.get(MODULE, 8)/*_i18n:服务器地址*/, min: 1, byte: true }),
			},
			{
				label: intl.get(MODULE, 9)/*_i18n:用户名: */,
				value: userName,
				name: 'userName',
				type: 'text',
				tip: checkStr(userName, { who: intl.get(MODULE, 10)/*_i18n:设置成功*/, min: 1, byte: true }),
			},
			{
				label: intl.get(MODULE, 11)/*_i18n:密码: */,
				value: password,
				name: 'password',
				type: 'password',
				tip: checkStr(password, { who: intl.get(MODULE, 12)/*_i18n:密码*/, min: 1, byte: true }),
			},
		];

		const disabled = inputInfo.some(item => item.tip !== '');
		return (
			<SubLayout className="settings">
				<Form className='vpnClient-settings'>
					<PanelHeader title={intl.get(MODULE, 13)/*_i18n:当前上网信息*/} checkable={false} checked={true} />
					{
						staticInfo.map(item => (
							<div className='info-item' key={item.label}>
								<label className='info-item-normal-label'>{item.label}</label>
								<span>{item.value}</span>
							</div>
						))
					}
					<PanelHeader title={intl.get(MODULE, 14)/*_i18n:VPN设置*/} className='panelHeader-setting' checkable={false} checked={true} />
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
					<Button type="primary" size='large' className='save-button' loading={buttonLoading} disabled={disabled} onClick={this.save} >{intl.get(MODULE, 15)/*_i18n:保存*/}</Button>
					</div>
				</Form>
			</SubLayout>
		);
	}
}
export default VPNClient;