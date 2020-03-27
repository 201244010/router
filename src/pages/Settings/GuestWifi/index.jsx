import React from 'react';
import { Checkbox, Select, Button, Radio, message, Modal, Icon } from 'antd';
import { Base64 } from 'js-base64';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import ModalLoading from '~/components/ModalLoading';
import DynamicPassword from './DynamicPassword';
import PortalAccess from './PortalAccess';
import { checkStr, checkRange } from '~/assets/common/check';
import { PORTAL, STATIC, DYNAMIC, NONE, PWD_AUTH, SMS } from '~/assets/common/constants';
import './index.scss';

const { FormItem, ErrorTip, Input } = Form;
const { Option } = Select;

const MODULE = 'guestwifi';
export default class GuestWifi extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			guestEnable: true,
			radioValue: PORTAL,
			inputValue: {
				guestSsid: '',
				hostSsidPassword: '',
				period: '',
				welcome: '',
				connectButton: '',
				version: '',
				jumpText: '',
				jumpLink: '',
				messageTime: '60',
				appKey: '',
				appSecret: '',
				modelId: '',
				sign: '',
				accessPassword: ''
			},
			guestDynamicPassword: '',
			messageValue: 'ali',
			portalValue: SMS,
			navigateValue: '1',
			validValue: '2h',
			emptyValue: 10,
			previewValue: 0,
			logoFileList: [],
			bgFileList: [],
			logoUrl: '',
			bgUrl: '',
			visibile: false,
			jumpLinkHeader: 'http://',
		};
		this.strObjectTip = {
			guestSsidTip: '',
			hostSsidPasswordTip: '',
			periodTip: '',
			welcomeTip: '',
			connectButtonTip: '',
			versionTip: '',
			jumpTextTip: '',
			jumpLinkTip: '',
			messageTimeTip: '',
			appKeyTip: '',
			appSecretTip: '',
			modelIdTip: '',
			signTip: '',
			accessPasswordTip: '',
		};
	}

	fetchGuest = async () => {
		const response = await common.fetchApi({
			opcode: 'WIRELESS_GUEST_GET'
		});

		const { errcode, data } = response;
		if(errcode === 0) {
			let {
				guest: {
					enable,
					ssid = '',
					connect_type = '',
					encryption,
					dynamic: { period = '', password: dynamicPassword = '' },
					static: { password: staticPassword = '' },
					portal: {
						server_type,
						auth_config: {
							welcome = '',
							connect_label = '',
							link_enable = '',
							link_label = '',
							link_addr = '',
							statement = '',
							online_limit = '',
							idle_limit = '',
							auth_type = '',
							logo_url = '',
							background_url = '',
							pwd_auth: { auth_password = '' },
							sms: {
								code_expired = '',
								server_provider = '',
								access_key_id = '',
								access_key_secret = '',
								template_code = '',
								sign_name = '',
							}
						}
					}
				}
			} = data[0].result || {};

			let jumpLinkHeader = '';
			if (link_addr.indexOf('https://') > -1) {
				link_addr = link_addr.replace('https://','');
				jumpLinkHeader = 'https://';
			} else if (link_addr.indexOf('http://') > -1) {
				link_addr = link_addr.replace('http://','');
				jumpLinkHeader = 'http://';
			}

			this.strObjectTip = {
				guestSsidTip: checkStr(ssid, {
					who: intl.get(MODULE,0),
					min: 1,
					max: 32,
					byte: true
				}),
				hostSsidPasswordTip: checkStr(Base64.decode(staticPassword), {
					who: intl.get(MODULE,9),
					min: 8,
					max: 32,
					type: 'english',
					byte: true
				}),
				periodTip: checkRange(period, {
					min: 1,
					max: 72,
					who: intl.get(MODULE,10)
				}),
				welcomeTip: checkStr(welcome, {
					who: intl.get(MODULE,2),
					min: 1,
					max: 30,
				}),
				connectButtonTip: checkStr(connect_label, {
					who: intl.get(MODULE,1),
					min: 1,
					max: 15,
				}),
				versionTip: checkStr(statement, {
					who: intl.get(MODULE,5),
					min: 1,
					max: 30,
				}),
				jumpTextTip: checkStr(link_label, {
					who: intl.get(MODULE,3),
					min: 1,
					max: 10,
				}),
				jumpLinkTip: checkStr(link_addr, {
					who: intl.get(MODULE,4),
					min: 1,
				}),
				messageTimeTip: checkRange(code_expired, {
					min: 60,
					max: 180,
					who: intl.get(MODULE,11)
				}),
				appKeyTip: checkStr(access_key_id, {
					who: 'AppKey',
					min: 1,
					max: 30,
					byte: true
				}),
				appSecretTip: checkStr(access_key_secret, {
					who: 'APP Secret',
					min: 1,
					max: 30,
					byte: true
				}),
				modelIdTip: checkStr(template_code, {
					who: intl.get(MODULE,7),
					min: 1,
					max: 30,
					byte: true
				}),
				signTip: checkStr(sign_name, {
					who: intl.get(MODULE,8),
					min: 1,
					max: 50,
				}),
				accessPasswordTip: checkStr(auth_password, {
					who: intl.get(MODULE,12),
					min: 8,
					max: 32,
					type: 'english',
					byte: true
				}),
			};
	
			this.setState({
				inputValue: {
					guestSsid: ssid,
					period,
					hostSsidPassword: Base64.decode(staticPassword),
					welcome,
					connectButton: connect_label,
					jumpLink: link_addr,
					jumpText: link_label,
					messageTime: code_expired,
					appKey: access_key_id,
					appSecret: access_key_secret,
					modelId: template_code,
					sign: sign_name,
					accessPassword: auth_password,
					version: statement
				},
				guestEnable: enable === '1',
				radioValue: connect_type,
				guestDynamicPassword: Base64.decode(dynamicPassword),
				navigateValue: link_enable,
				messageValue: server_provider,
				validValue: Number(online_limit),
				emptyValue: Number(idle_limit),
				bgUrl: background_url,
				logoUrl: logo_url,
				portalValue: auth_type,
				jumpLinkHeader: jumpLinkHeader,
			});	
		} else {
			message.error(intl.get(MODULE, 22)/*配置获取失败*/);
		}	
	};

	submit = async() => {
		this.setState({
			visibile: true,
		});
		let {
			inputValue: {
				guestSsid,
				period,
				hostSsidPassword,
				welcome,
				connectButton,
				jumpLink,
				jumpText,
				messageTime,
				appKey,
				appSecret,
				modelId,
				sign,
				accessPassword,
				version
			},
			guestEnable,
			radioValue,
			guestDynamicPassword,
			navigateValue,
			messageValue,
			validValue,
			emptyValue,
			portalValue,
			jumpLinkHeader,
		} = this.state;

		if (jumpLink.indexOf('https://') > -1) {
			jumpLink = jumpLink.replace('https://','');
		} else if (jumpLink.indexOf('http://') > -1) {
			jumpLink = jumpLink.replace('http://','');
		}

		const data = {
			none: {
				enable: guestEnable? '1' : '0',
				ssid: guestSsid,
				connect_type: radioValue,
				encryption: "none",
			},
			static: {
				enable: guestEnable? '1' : '0',
				ssid: guestSsid,
				connect_type: radioValue,
				encryption: "psk-mixed/ccmp+tkip",
				static:{
					password: Base64.encode(hostSsidPassword),
				}
			},
			dynamic: {
				enable: guestEnable? '1' : '0',
				ssid: guestSsid,
				connect_type: radioValue,
				encryption: "psk-mixed/ccmp+tkip",
				dynamic: {
					period,
					password: Base64.encode(guestDynamicPassword),
				},
			},
			portal: {
				enable: guestEnable? '1' : '0',
				ssid: guestSsid,
				connect_type: radioValue,
				encryption: "none",
				portal: {
					server_type: "local",
					auth_config: {
						welcome,
						connect_label: connectButton,
						link_enable: navigateValue,
						link_label: jumpText,
						link_addr: jumpLinkHeader+jumpLink+'',
						statement: version,
						online_limit: String(validValue),
						idle_limit: String(emptyValue),
						auth_type: portalValue,
						pwd_auth: {
							auth_password: accessPassword
						},
						sms: {
							server_provider: messageValue,
							code_expired: messageTime,
							access_key_id: appKey,
							access_key_secret: appSecret,
							template_code: modelId,
							sign_name: sign
						}
					}
				}
			}
		};
		const response = await common.fetchApi({
			opcode: 'WIRELESS_GUEST_SET',
			data: {
				guest: data[radioValue]
			}
		});

		this.setState({
			visibile: false,
		});
		const { errcode } = response;
		if(errcode === 0) {
			this.fetchGuest();
			message.success(intl.get(MODULE, 23)/*配置成功*/);
		} else {
			message.error(intl.get(MODULE, 24)/*配置失败*/);
		}
	}

	onSelectChange = (type, value) => {
		this.setState({
			[type]: value
		});
	};

	onGuestEnableChange = async(type) => {
		const response = await common.fetchApi({
			opcode: 'WIRELESS_GUEST_SET',
			data: {
				guest:  {
					enable: type? '1' : '0',
				}
			}
			
		}, { loading: true });
		
		const { errcode } = response;
		if(errcode === 0) {
			this.setState({
				guestEnable: type
			});
			message.success(type? intl.get(MODULE, 25)/*打开成功*/ : intl.get(MODULE, 26)/*关闭成功*/);
			this.fetchGuest();
		} else {
			message.error(type? intl.get(MODULE, 25)/*打开成功*/ : intl.get(MODULE, 26)/*关闭成功*/);
		}
	};

	onRadioChange = (type, e) => {
		this.setState({
			[type]: e.target.value
		});
	};

	setFile = (fileKey, fileList) => {
		this.setState({ [fileKey]: fileList });
	};

	jumpLinkHeaderChange = (type, value) => {
		console.log('type',type, 'value', value);
		this.setState({
			[type]: value,
		});
	}

	onChange = (type, value) => {
		console.log('type',type, 'value', value);
		const { inputValue } = this.state;
		const strObjectTip = {
			guestSsid: checkStr(value, {
				who: intl.get(MODULE,0),
				min: 1,
				max: 32,
				byte: true
			}),
			connectButton: checkStr(value, {
				who: intl.get(MODULE,1),
				min: 1,
				max: 15,
			}),
			welcome: checkStr(value, {
				who: intl.get(MODULE,2),
				min: 1,
				max: 30,
			}),
			jumpText: checkStr(value, {
				who: intl.get(MODULE,3),
				min: 1,
				max: 10,
			}),
			jumpLink: checkStr(value, {
				who: intl.get(MODULE,4),
				min: 1,
			}),
			version: checkStr(value, {
				who: intl.get(MODULE,5),
				min: 1,
				max: 30,
			}),
			appKey: checkStr(value, {
				who: 'AppKey',
				min: 1,
				max: 30,
				byte: true
			}),
			appSecret: checkStr(value, {
				who: 'APP Secret',
				min: 1,
				max: 30,
				byte: true
			}),
			modelId: checkStr(value, {
				who: intl.get(MODULE,7),
				min: 1,
				max: 30,
				byte: true
			}),
			sign: checkStr(value, {
				who: intl.get(MODULE,8),
				min: 1,
				max: 50,
			}),
			hostSsidPassword: checkStr(value, {
				who: intl.get(MODULE,9),
				min: 8,
				max: 32,
				type: 'english',
				byte: true
			}),
			period: checkRange(value, {
				min: 1,
				max: 72,
				who: intl.get(MODULE,10)
			}),
			messageTime: checkRange(value, {
				min: 60,
				max: 180,
				who: intl.get(MODULE,11)
			}),
			accessPassword: checkStr(value, {
				who: intl.get(MODULE,12),
				min: 8,
				max: 32,
				type: 'english',
				byte: true
			}),
		};
		this.strObjectTip[type + 'Tip'] = strObjectTip[type];
		this.setState({
			inputValue: {
				...inputValue,
				[type]: value
			}
		});
	};

	checkMessage = () => {
		const {
			inputValue: {
				guestSsid,
				welcome,
				connectButton,
				version,
				jumpText,
				jumpLink,
				messageTime,
				appKey,
				appSecret,
				modelId,
				sign,
				accessPassword
			},
			portalValue,
			navigateValue
		} = this.state;
		const {
			guestSsidTip,
			welcomeTip,
			connectButtonTip,
			versionTip,
			accessPasswordTip,
			jumpTextTip,
			jumpLinkTip,
			messageTimeTip,
			appKeyTip,
			appSecretTip,
			modelIdTip,
			signTip
		} = this.strObjectTip;
		const fixResult =
			[guestSsid, welcome, connectButton, version].includes('') ||
			[guestSsidTip, welcomeTip, connectButtonTip, versionTip].some(
				item => item !== ''
			);
		let radioResult = false;
		if (navigateValue === '1') {
			radioResult =
				[jumpText, jumpLink].includes('') ||
				[jumpTextTip, jumpLinkTip].some(item => item !== '');
		}
		if (portalValue === NONE) {
			return fixResult || radioResult;
		}

		if (portalValue === PWD_AUTH) {
			return (
				fixResult ||
				radioResult ||
				accessPassword === '' ||
				accessPasswordTip !== ''
			);
		}

		if (portalValue === SMS) {
			return (
				fixResult ||
				radioResult ||
				[messageTime, appKey, appSecret, modelId, sign].includes('') ||
				[
					messageTimeTip,
					appKeyTip,
					appSecretTip,
					modelIdTip,
					signTip
				].some(item => item !== '')
			);
		}

		return fixResult || radioResult;
	};

	componentDidMount() {
		this.fetchGuest();
	}

	render() {
		const {
			guestEnable,
			radioValue,
			inputValue: { guestSsid, hostSsidPassword, period },
			guestDynamicPassword,
			visibile,
		} = this.state;

		const {
			guestSsidTip,
			hostSsidPasswordTip,
			periodTip
		} = this.strObjectTip;

		const disableResult = {
			none: guestSsid === '',
			static:
				[guestSsid, hostSsidPassword].includes('') ||
				this.strObjectTip['hostSsidPasswordTip'] !== '',
			dynamic:
				[guestSsid, period].includes('') ||
				this.strObjectTip['periodTip'] !== '',
			portal: this.checkMessage()
		};

		const buttonDisabled = disableResult[radioValue];
		return (
			<SubLayout className="settings">
				<Form>
					<div className="guest-wifi">
						<PanelHeader
							title={intl.get(MODULE,13) /*_i18n:客用Wi-Fi*/}
							checkable={true}
							checked={guestEnable}
							onChange={this.onGuestEnableChange}
							tip={intl.get(MODULE,14)}
						/>
						{guestEnable ? (
							<div>
								<label className="ssidLabel">
									{intl.get(MODULE,0)}
								</label>
								<FormItem
									type="small"
									showErrorTip={guestSsidTip}
									style={{ width: 320 }}
								>
									<Input
										type="text"
										maxLength={32}
										value={guestSsid}
										onChange={value =>
											this.onChange('guestSsid', value)
										}
									/>
									<ErrorTip>{guestSsidTip}</ErrorTip>
								</FormItem>
								<div className="guest-select">
									<label>{intl.get(MODULE,15)}</label>
									<Radio.Group
										value={radioValue}
										onChange={e =>
											this.onRadioChange('radioValue', e)
										}
									>
										<Radio value={NONE}>{intl.get(MODULE,16)}</Radio>
										<Radio value={STATIC}>{intl.get(MODULE,17)}</Radio>
										<Radio value={DYNAMIC}>
											{intl.get(MODULE,18)}
										</Radio>
										<Radio value={PORTAL}>
											{intl.get(MODULE,19)}
										</Radio>
									</Radio.Group>
								</div>
								{radioValue === STATIC && (
									<div>
										<label className="ssidLabel">
											{intl.get(MODULE,9)}
										</label>
										<FormItem
											type="small"
											showErrorTip={hostSsidPasswordTip}
											style={{ width: 320 }}
										>
											<Input
												type="password"
												maxLength={32}
												value={hostSsidPassword}
												onChange={value =>
													this.onChange(
														'hostSsidPassword',
														value
													)
												}
											/>
											<ErrorTip>
												{hostSsidPasswordTip}
											</ErrorTip>
										</FormItem>
									</div>
								)}
								{radioValue === DYNAMIC && (
									<DynamicPassword
										{...{
											period,
											periodTip,
											onChange: this.onChange,
											guestDynamicPassword
										}}
									/>
								)}
								{radioValue === PORTAL && (
									<PortalAccess
										{...{
											state: this.state,
											onChange: this.onChange,
											onRadioChange: this.onRadioChange,
											strObjectTip: this.strObjectTip,
											onSelectChange: this.onSelectChange,
											setFile: this.setFile,
											jumpLinkHeaderChange: this.jumpLinkHeaderChange
										}}
									/>
								)}
								<div className="guest-button">
									<Button
										type="primary"
										size="large"
										style={{ width: 200, height: 42 }}
										disabled={buttonDisabled}
										onClick={this.submit}
									>
										{intl.get(MODULE,20)}
									</Button>
								</div>
							</div>	
						) : (
							<div className="guest-close-content">
								{intl.get(MODULE,21)}
							</div>
						)}
					</div>
				</Form>
				<ModalLoading
                    visible={visibile}
                    tip={intl.get(MODULE, 27)/*_i18n:正在配置客用Wi-Fi，请稍候...*/}
                />
			</SubLayout>
		);
	}
}
