import React from 'react';
import { Button, message, Select, Cascader, Radio } from 'antd';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";
import { checkStr, checkIp, checkRange } from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import { OPTION_FIRST } from './options';
import InputList from './InputList';

import './vpnClient.scss';

const MODULE = 'vpn';
const { FormItem, Input, InputGroup, ErrorTip } = Form;
const Option = Select.Option;

class VPNClient extends React.Component {
	state = {
		serviceAddress: '',
		userName: '',
		password: '',
		buttonLoading: false,
		status: 'off',
		ip: '',
		dns: '',
		vpnEnable: true,
		tunnelType: 'ipsec',
		shareKey: '',
		remoteIP: ['.../'],
		keyExchange: 'ikev2',
		ike: ['aes128', 'sha1', 'modp1024'],
		esp: ['aes128', 'sha1', 'modp1024'],
		showInfo: 'pulldown',
		advanceDisplay: false,
		aggressive: '0',
		localSubnet: ['.../'],
		leftId: '',
		rightId: '',
		ikeLifeTime: '',
		lifeTime: '',
		wanIface: '',
		// lanIface: '',
	}

	getVPNInfo = async() => {
		const resp = await common.fetchApi(
            { opcode : 'VPN_GET'}
		);
		const { errcode, data } = resp;
		if(errcode === 0) {
			const { 
				vpn_enable,
            	status,
            	ip,
            	dns,
				vpn
			} = data[0].result || {};

			const {
                server = '',
                tunnel_type = '',
                pre_shared_key = '',
                keyexchange = 'ikev2',
                ike = '',
                esp = '',
                remote_subnet = '.../',
                username = '',
				password = '',
				leftid = '',
				rightid = '',
				aggressive = '0',
				local_subnet = '.../',
				ikelifetime = '',
				lifetime = '',
				wan_iface = '',
				// lan_iface = '',
			} = vpn[0];

			this.setState({
				vpnEnable: vpn_enable === '1',
				serviceAddress: server,
				tunnelType: tunnel_type,
				userName: username,
				password: password,
				status: status,
				ip: ip,
				dns: dns,
				keyExchange: keyexchange,
				ike: ike.split('-'),
				esp: esp.split('-'),
				remoteIP: remote_subnet.split(','),
				shareKey: pre_shared_key,
				leftId: leftid,
				rightId: rightid,
				aggressive: aggressive,
				localSubnet: local_subnet.split(','),
				ikeLifeTime: ikelifetime,
				lifeTime: lifetime,
				wanIface: wan_iface,
				// lanIface: lan_iface,
			});
		}
	}

	refreshVPNInfo = async() => {
		const resp = await common.fetchApi(
            { opcode : 'VPN_GET'}
		);
		const { errcode, data } = resp;
		if(errcode === 0) {
			const { 
            	status,
            	ip,
            	dns,
			} = data[0].result || {};

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

	showAdvance = () => {
		this.setState({
			showInfo: this.state.showInfo === 'pulldown'? 'pullup':'pulldown',
			advanceDisplay: this.state.showInfo === 'pulldown',
		});
	}

	save = async() => {
		this.setState({
			buttonLoading: true,
		});
		const { serviceAddress, userName, password, vpnEnable, tunnelType, shareKey, keyExchange, ike, esp, remoteIP, leftId, rightId, aggressive, localSubnet, ikeLifeTime, lifeTime, wanIface } = this.state;
		const resp = await common.fetchApi(
            {
				opcode : 'VPN_SET',
				data: {
					vpn_enable: vpnEnable? '1' : '0',
					vpn: [{
						enable: "1",
						server: serviceAddress,
						tunnel_type: tunnelType,
						pre_shared_key: shareKey,
						keyexchange: keyExchange,
						ike: ike.join('-'),
						esp: esp.join('-'),
						remote_subnet: remoteIP.filter(item => item !== '.../').join(','),
						username: userName,
						password: password,
						leftid: leftId,
						rightid: rightId,
						aggressive: aggressive,
						local_subnet: localSubnet.filter(item => item !== '.../').join(','),
						ikelifetime: ikeLifeTime,
						lifetime: lifeTime,
						wan_iface: wanIface,
						// lan_iface: lanIface,
					}]
				}
			}
		);

		this.setState({
			buttonLoading: false,
		});
		const { errcode } = resp;
		if(errcode === 0) {
			this.getVPNInfo();
			message.success(intl.get(MODULE, 0)/*_i18n:设置成功*/);
		} else {
			message.error(intl.get(MODULE, 1)/*_i18n:设置失败*/);
		}
	}

	checkInputList = (value, name, require) => {
		let hasError = false;
		let hasItem = false;
		value.map(item => {
			if(item !== '.../') {
				hasItem = true;
				const content = item.split('/');
				const ip = content[0].split('.');
				const num = content[1];
				hasError = checkIp(ip, { who: '' }) !== '' || checkRange(num, { who: '', min: 0, max: 31 }) !== '';
			}
		})

		if(hasError) {
			return true;
		} else {
			return require? (hasItem? '': `${intl.get(MODULE, 31)/*_i18n:请输入*/}${name}`) : '';
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
		const { serviceAddress, userName, password, buttonLoading, status, ip, dns, vpnEnable, tunnelType, shareKey, remoteIP, keyExchange, ike, esp, showInfo, advanceDisplay, aggressive, localSubnet, leftId, rightId, ikeLifeTime, lifeTime, wanIface } = this.state;

		const VPN_STATUS = {
			'on': intl.get(MODULE, 16)/*_i18n:已连接*/,
			'off': intl.get(MODULE, 17)/*_i18n:未连接*/,
			'dialing': intl.get(MODULE, 18)/*_i18n:拨号中*/,
			'dial fail': intl.get(MODULE, 19)/*_i18n:拨号失败*/,
		}
		const staticInfo = [
			{
				label: intl.get(MODULE, 2)/*_i18n:当前状态：*/,
				value: VPN_STATUS[status],
				// value: status === 'offline'? intl.get(MODULE, 3)/*_i18n:未连接*/: intl.get(MODULE, 4)/*_i18n:已连接*/,
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
		const basicInfo = {
			'ipsec/l2tp': [
				[
					{
						label: intl.get(MODULE, 7)/*_i18n:服务器地址: */,
						value: serviceAddress,
						name: 'serviceAddress',
						type: 'text',
						placeholder: intl.get(MODULE, 20)/*_i18n:请输入服务器地址*/,
						tip: vpnEnable? checkStr(serviceAddress, { who: intl.get(MODULE, 8)/*_i18n:服务器地址*/, min: 1 }) : '',
					},
					{
						label: intl.get(MODULE, 21)/*_i18n:预共享密钥*/,
						value: shareKey,
						name: 'shareKey',
						type: 'text',
						placeholder: intl.get(MODULE, 22)/*_i18n:请输入预共享密钥*/,
						tip: vpnEnable? checkStr(shareKey, { who: intl.get(MODULE, 21)/*_i18n:预共享密钥*/, min: 1 }) : '',
					}
				],
				[
					{
						label: intl.get(MODULE, 9)/*_i18n:用户名: */,
						value: userName,
						name: 'userName',
						type: 'text',
						placeholder: intl.get(MODULE, 23)/*_i18n:请输入用户名*/,
						tip: vpnEnable? checkStr(userName, { who: intl.get(MODULE, 10)/*_i18n:设置成功*/, min: 1 }) : '',
					},
					{
						label: intl.get(MODULE, 11)/*_i18n:密码: */,
						value: password,
						name: 'password',
						type: 'password',
						placeholder: intl.get(MODULE, 24)/*_i18n:请输入密码*/,
						tip: vpnEnable? checkStr(password, { who: intl.get(MODULE, 12)/*_i18n:密码*/, min: 1 }) : '',
					}
				],
			],
			'ipsec': [
				[
					{
						label: intl.get(MODULE, 7)/*_i18n:服务器地址: */,
						value: serviceAddress,
						name: 'serviceAddress',
						type: 'text',
						placeholder: intl.get(MODULE, 20)/*_i18n:请输入服务器地址*/,
						tip: vpnEnable? checkStr(serviceAddress, { who: intl.get(MODULE, 8)/*_i18n:服务器地址*/, min: 1 }) : '',
					},
					{
						label: intl.get(MODULE, 21)/*_i18n:预共享密钥*/,
						value: shareKey,
						name: 'shareKey',
						type: 'text',
						placeholder: intl.get(MODULE, 22)/*_i18n:请输入预共享密钥*/,
						tip: vpnEnable? checkStr(shareKey, { who: intl.get(MODULE, 21)/*_i18n:预共享密钥*/, min: 1 }) : '',
					}
				],
				[
					{
						label: intl.get(MODULE, 25)/*_i18n:对端IP*/,
						value: remoteIP,
						name: 'remoteIP',
						type: 'inputList',
						placeholder: intl.get(MODULE, 26)/*_i18n:示例：192.168.100.0/24*/,
						tip: vpnEnable? this.checkInputList(remoteIP, intl.get(MODULE, 25)/*_i18n:对端IP*/, true) : '',
					},
				]
			]
		};

		const advanceInfo = [
			[
				{
					label: 'Key Exchange',
					value: keyExchange,
					name: 'keyExchange',
					id: 'keyExchangeArea',
					options: ['ikev1', 'ikev2'],
					type: 'select',
				},
				{
					label: 'IKE',
					value: ike,
					name: 'ike',
					id: 'ikeArea',
					options: OPTION_FIRST,
					placeholder: intl.get(MODULE, 27)/*_i18n:请选择IKE加密组合*/,
					type: 'cascader',
				},
			],
			[
				{
					label: 'ESP',
					value: esp,
					name: 'esp',
					id: 'espArea',
					options: OPTION_FIRST,
					placeholder: intl.get(MODULE, 28)/*_i18n:请选择ESP加密组合*/,
					type: 'cascader',
				},
			],
		];

		const aggressiveInfo = [
			[
				{
					label: intl.get(MODULE, 32)/*_i18n:本地ID（选填）*/,
					value: leftId,
					name: 'leftId',
					type: 'text',
					placeholder: intl.get(MODULE, 33)/*_i18n:请输入本地ID*/,
					tip: '',
					unit: '',
				},
				{
					label: intl.get(MODULE, 34)/*_i18n:对端ID（选填）*/,
					value: rightId,
					name: 'rightId',
					type: 'text',
					placeholder: intl.get(MODULE, 35)/*_i18n:请输入对端ID*/,
					tip: '',
					unit: '',
				},
			],
			[
				{
					label: intl.get(MODULE, 36)/*_i18n:本地子网（选填）*/,
					value: localSubnet,
					name: 'localSubnet',
					type: 'inputList',
					placeholder: intl.get(MODULE, 37)/*_i18n:请输入本地子网*/,
					tip: this.checkInputList(localSubnet, intl.get(MODULE, 38)/*_i18n:本地子网*/, false),
				},
			],
			[
				{
					label: intl.get(MODULE, 39)/*_i18n:IKE有效时间（选填）*/,
					value: ikeLifeTime,
					name: 'ikeLifeTime',
					type: 'text',
					placeholder: intl.get(MODULE, 40)/*_i18n:IKE有效时间范围2440~86400*/,
					tip: vpnEnable? (ikeLifeTime !== ''? checkRange(ikeLifeTime, { who: intl.get(MODULE, 41)/*_i18n:IKE有效时间*/, min: 2440, max: 86400 }) : '') : '',
					unit: intl.get(MODULE, 42)/*_i18n:秒*/,
				},
				{
					label: intl.get(MODULE, 43)/*_i18n:隧道生存时间（选填）*/,
					value: lifeTime,
					name: 'lifeTime',
					type: 'text',
					placeholder: intl.get(MODULE, 44)/*_i18n:隧道生存时间范围2440~86400*/,
					tip: vpnEnable? (lifeTime !== ''? checkRange(lifeTime, { who: intl.get(MODULE, 45)/*_i18n:隧道生存时间*/, min: 2440, max: 86400 }) : '') : '',
					unit: intl.get(MODULE, 42)/*_i18n:秒*/,
				},
			],
			[
				{
					label: intl.get(MODULE, 46)/*_i18n:WAN接口（选填）*/,
					value: wanIface,
					name: 'wanIface',
					type: 'text',
					placeholder: intl.get(MODULE, 47)/*_i18n:请输入WAN接口*/,
					// tip: vpnEnable? (wanIface.some(item => item !== '')? checkIp(wanIface, { who: intl.get(MODULE, 48)/*_i18n:WAN接口*/ }) : '') : '',
					tip: '',
					unit: '',
				},
				// {
				// 	label: intl.get(MODULE, 49)/*_i18n:LAN接口（选填）*/,
				// 	value: lanIface,
				// 	name: 'lanIface',
				// 	type: 'text',
				// 	placeholder: intl.get(MODULE, 50)/*_i18n:请输入LAN接口*/,
				// 	tip: vpnEnable? (lanIface.some(item => item !== '')? checkIp(lanIface, { who: intl.get(MODULE, 51)/*_i18n:LAN接口*/ }) : '') : '',
				// 	unit: '',
				// },
			]
		];
		const disabled = basicInfo[tunnelType].some(item => item.some(item => item.tip !== '')) || aggressiveInfo.some(item => item.some(item => item.tip !== ''));
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
					<PanelHeader title={intl.get(MODULE, 14)/*_i18n:VPN设置*/} className='panelHeader-setting' checkable={true} checked={vpnEnable} onChange={value => this.onChange(value, 'vpnEnable')}/>
					<div className='info-item' id="tunnelTypeArea">
						<label className='info-item-input-label'>{intl.get(MODULE, 29)/*_i18n:隧道类型*/}</label>
						<Select
							value={tunnelType}
							className='info-item-select'
							disabled={!vpnEnable}
							onChange={(value)=>this.onChange(value, 'tunnelType')}
							getPopupContainer={() => document.getElementById('tunnelTypeArea')}
						>
							<Option value={'ipsec'}>IPSEC</Option>
							<Option value={'ipsec/l2tp'}>IPSEC/L2TP</Option>
						</Select>
						{/* <Radio.Group className='info-item-select' value={tunnelType} disabled={!vpnEnable} onChange={(e)=>this.onChange(e.target.value,'tunnelType')}>
							<Radio value={'ipsec'}>IPSEC</Radio>
							<Radio value={'ipsec/l2tp'}>IPSEC/L2TP</Radio>
						</Radio.Group> */}
					</div>
					{
						basicInfo[tunnelType].map((item, index) => (
							<div className='info-list' key={index}>
								{
									item.map((item, index) => {
										return (
										<div className={`info-item ${index > 0? 'info-item-right':''}`} key={item.label}>
											<label className='info-item-input-label'>{item.label}</label>
											<FormItem showErrorTip={item.tip} type="small" className='info-item-formItem'>
												{item.type !== 'inputList'?
												<Input type={item.type} value={item.value} onChange={value => this.onChange(value, item.name)} disabled={!vpnEnable} placeholder={item.placeholder}/>
												:
												<InputList
													name={item.label}
													value={item.value}
													onChange={value => this.onChange(value, item.name)}
													disabled={!vpnEnable}
												/>
												}
												<ErrorTip>{item.tip}</ErrorTip>
											</FormItem>
										</div>);
									})
								}
							</div>	
						))
					}
					<div className="advance-info"onClick={this.showAdvance}>
						<span>{intl.get(MODULE, 30)/*_i18n:高级设置*/}</span>
						<CustomIcon type={showInfo} size={14}/>
					</div>
					{advanceDisplay&&<React.Fragment>
						{
							advanceInfo.map((item,index) => (
								<div className='info-list' key={index}>
									{
										item.map((item, index) => (
											<div className={`info-item  ${index > 0? 'info-item-right':''}`} id={item.id} key={item.id}>
												<label className='info-item-input-label'>{item.label}</label>
												{
													item.type === 'select'?
													<Select
														value={item.value}
														className='info-item-select'
														disabled={!vpnEnable}
														onChange={(value)=>this.onChange(value, item.name)}
														getPopupContainer={() => document.getElementById(item.id)}
													>
														{item.options.map(item => (
															<Option value={item}>{item}</Option>
														))}
													</Select>
													:
													<Cascader
														value={item.value}
														options={item.options}
														className='info-item-select'
														disabled={!vpnEnable}
														onChange={(value)=>this.onChange(value, item.name)}
														getPopupContainer={() => document.getElementById(item.id)}
														placeholder={item.placeholder}
														allowClear={false}
													/>
												}
											</div>
										))
									}
								</div>
							))
						}
						<div className='info-item' id="tunnelTypeArea">
							<label className='info-item-input-label'>{intl.get(MODULE, 52)/*_i18n:协商模式*/}</label>
							<Radio.Group className='info-item-select' value={aggressive} disabled={!vpnEnable} onChange={(e)=>this.onChange(e.target.value,'aggressive')}>
								<Radio value={'0'}>{intl.get(MODULE, 53)/*_i18n:主模式*/}</Radio>
								<Radio value={'1'}>{intl.get(MODULE, 54)/*_i18n:野蛮模式*/}</Radio>
							</Radio.Group>
						</div>
						{
							aggressiveInfo.map((item,index) => (
								<div className='info-list' key={index}>
									{
										item.map((item, index) => (
											<div className={`info-item ${index > 0? 'info-item-right':''}`} key={item.label}>
												<label className='info-item-input-label'>{item.label}</label>
												<FormItem showErrorTip={item.tip} type="small" className='info-item-formItem'>
													{item.type === 'inputList'?
													<InputList
														name={item.label}
														value={item.value}
														onChange={value => this.onChange(value, item.name)}
														disabled={!vpnEnable}
													/>
													:
													item.type === 'text'?
													<Input type={item.type} value={item.value} onChange={value => this.onChange(value, item.name)} disabled={!vpnEnable} placeholder={item.placeholder} unit={item.unit}/>
													:
													<InputGroup                                                                    
														inputs={[{value: item.value[0], maxLength: 3}, {value: item.value[1], maxLength: 3}, {value: item.value[2], maxLength: 3}, {value: item.value[3], maxLength: 3}]}
														disabled={!vpnEnable}
														onChange={value => this.onChange(value, item.name)} />
													}
													<ErrorTip>{item.tip}</ErrorTip>
												</FormItem>
											</div>
										))
									}
								</div>	
							))
						}
					</React.Fragment>}
					<div className='vpnClient-save'>
					<Button type="primary" size='large' className='save-button' loading={buttonLoading} disabled={disabled} onClick={this.save} >{intl.get(MODULE, 15)/*_i18n:保存*/}</Button>
					</div>
				</Form>
			</SubLayout>
		);
	}
}
export default VPNClient;