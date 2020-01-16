import React from 'react';
import { Checkbox, Select, Button, Radio, message, Modal, Icon } from 'antd';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import Form from '~/components/Form';
import DynamicPassword from './DynamicPassword';
import PortalAccess from './PortalAccess';
import { checkStr, checkRange } from '~/assets/common/check';
import './index.scss';

const { FormItem, ErrorTip, Input } = Form;
const { Option } = Select;

const MODULE = 'wi-fi';
export default class GuestWifi extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			guestEnable: true,
			radioValue: 4,
			inputValue: {
				guestSsid: '',
				hostSsidPassword: '',
				period: '',
				welcome: '',
				connectButton: '',
				version: '',
				jumpText: '',
				jumpLink: '',
				messageTime: '',
				appKey: '',
				appSecret: '',
				modelId: '',
				sign: '',
				accessPassword: ''
			},
			guestDynamicPassword: '',
			messageValue: 1,
			portalValue: 3,
			navigateValue: 1,
			validValue: 2,
			emptyValue: 10,
			previewValue: 0,
			logoFileList: [],
			bgFileList: []
		};
		this.strObjectTip = {};
	}

	submit = async () => {};

	fetchGuest = async () => {
		const response = await common.fetchApi({
			opcode: ''
		});
	};

	onSelectChange = (type, value) => {
		this.setState({
			[type]: value
		});
	};

	onGuestEnableChange = type => {
		this.setState({
			guestEnable: type
		});
	};

	onRadioChange = (type, e) => {
		this.setState({
			[type]: e.target.value
		});
	};

	setFile = (fileKey, fileList) => {
		this.setState({ [fileKey]: fileList });
	};

	onChange = (type, value) => {
		const { inputValue } = this.state;
		const strObjectTip = {
			guestSsid: checkStr(value, {
				who: 'Wi-Fi名称',
				min: 1,
				max: 32,
				byte: true
			}),
			connectButton: checkStr(value, {
				who: '连接按钮文案',
				min: 1,
				max: 30,
				byte: true
			}),
			welcome: checkStr(value, {
				who: '欢迎语',
				min: 1,
				max: 30,
				byte: true
			}),
			jumpText: checkStr(value, {
				who: '跳转按钮文案',
				min: 1,
				max: 30,
				byte: true
			}),
			jumpLink: checkStr(value, {
				who: '跳转按钮链接',
				min: 1,
				max: 30,
				byte: true
			}),
			version: checkStr(value, {
				who: '版权声明',
				min: 1,
				max: 30,
				byte: true
			}),
			messageTime: checkStr(value, {
				who: '验证码有效时长',
				min: 1,
				max: 30,
				byte: true
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
				who: '模板ID',
				min: 1,
				max: 30,
				byte: true
			}),
			sign: checkStr(value, {
				who: '签名名称',
				min: 1,
				max: 30,
				byte: true
			}),
			hostSsidPassword: checkStr(value, {
				who: 'Wi-Fi密码',
				min: 8,
				max: 32,
				type: 'english',
				byte: true
			}),
			period: checkRange(value, {
				min: 1,
				max: 72,
				who: '动态变更周期'
			}),
			messageTime: checkRange(value, {
				min: 30,
				max: 180,
				who: '验证码有效时长'
			})
		};
		this.strObjectTip[type + 'Tip'] = strObjectTip[type];
		this.setState({
			inputValue: {
				...inputValue,
				[type]: value
			}
		});
	};

	checkDisable = () => {
		const {
			radioValue,
			inputValue: { guestSsid, hostSsidPassword, period }
		} = this.state;
		const disableResult = {
			1: guestSsid === '',
			2:
				[guestSsid, hostSsidPassword].includes('') ||
				this.strObjectTip['hostSsidPasswordTip'] !== '',
			3:
				[guestSsid, period].includes('') ||
				this.strObjectTip['periodTip'] !== '',
			4: this.checkMessage()
		};

		return disableResult[radioValue];
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
		if (navigateValue) {
			radioResult =
				[jumpText, jumpLink].includes('') ||
				[jumpTextTip, jumpLinkTip].some(item => item !== '');
		}
		if (portalValue === 1) {
			return fixResult || radioResult;
		}

		if (portalValue === 2) {
			return (
				fixResult ||
				radioResult ||
				accessPassword === '' ||
				accessPasswordTip !== ''
			);
		}

		if (portalValue === 3) {
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

	render() {
		const {
			guestEnable,
			radioValue,
			inputValue: { guestSsid, hostSsidPassword, period },
			guestDynamicPassword
		} = this.state;
		const {
			guestSsidTip,
			hostSsidPasswordTip,
			periodTip
		} = this.strObjectTip;
		return (
			<SubLayout className="settings">
				<Form>
					<div className="guest-wifi">
						<PanelHeader
							title={'客用Wi-Fi' /*_i18n:客用Wi-Fi*/}
							checkable={true}
							checked={guestEnable}
							onChange={this.onGuestEnableChange}
							tip={'建议开放给顾客使用'}
						/>
						{guestEnable ? (
							<div>
								<label className="ssidLabel">
									{'Wi-Fi名称'}
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
									<label>加密方式：</label>
									<Radio.Group
										value={radioValue}
										onChange={e =>
											this.onRadioChange('radioValue', e)
										}
									>
										<Radio value={1}>不设密码</Radio>
										<Radio value={2}>普通密码</Radio>
										<Radio value={3}>动态密码</Radio>
										<Radio value={4}>Portal认证</Radio>
									</Radio.Group>
								</div>
								{radioValue === 2 && (
									<div>
										<label className="ssidLabel">
											{'Wi-Fi密码'}
										</label>
										<FormItem
											type="small"
											showErrorTip={hostSsidPasswordTip}
											style={{ width: 320 }}
										>
											<Input
												type="text"
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
								{radioValue === 3 && (
									<DynamicPassword
										{...{
											period,
											periodTip,
											onChange: this.onChange,
											guestDynamicPassword
										}}
									/>
								)}
								{radioValue === 4 && (
									<PortalAccess
										{...{
											state: this.state,
											onChange: this.onChange,
											onRadioChange: this.onRadioChange,
											strObjectTip: this.strObjectTip,
											onSelectChange: this.onSelectChange,
											setFile: this.setFile
										}}
									/>
								)}
								<div className="guest-button">
									<Button
										type="primary"
										size="large"
										style={{ width: 200, height: 42 }}
										disabled={this.checkDisable()}
									>
										{'保存'}
									</Button>
								</div>
							</div>
						) : (
							<div className="guest-close-content">
								专为店内顾客设立的Wi-Fi网络，即使客流高峰也不影响店内主网络，建议开启
							</div>
						)}
					</div>
				</Form>
			</SubLayout>
		);
	}
}
