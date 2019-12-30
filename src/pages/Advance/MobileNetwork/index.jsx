import React from 'react';
import { Button, Select, message } from 'antd';
import { checkStr } from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import './index.scss';

const MODULE = 'mobileNetwork';
const Option = Select.Option;
const {FormItem, Input, ErrorTip} = Form;

class MobileNetwork extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			enable: true,
			status: '',
			mode: '',
			modeOptions: ['4G/3G/2G','3G/2G','2G'],
			ipType: '',
			ipTypeOptions: ['ipv4','ipv6','ipv4v6'],
			auth: '',
			authOptions: ['pap','chap','both','none'],
			apn: '',
			fileName: '',
			userName: '',
			password: '',
			disabled: false,
		};
	}

	onChange = (type, value) => {
		this.setState({[type]: value});
	}

	getMobileConfig = async() => {
		const response = await common.fetchApi([{ opcode: 'MOBILE_CONFIG_GET' }]);
        const { errcode, data } = response;
        if(errcode === 0){
			const { mobile: { switch: enable, status, mode, iptype: ipType, auth, apn, user, passwd, profile } = {} } = data[0].result;
			this.setState({
				enable: enable === 'on',
				status,
				mode: mode.cfg,
				modeOptions: mode.list,
				ipType: ipType.cfg,
				ipTypeOptions: ipType.list,
				auth: auth.cfg,
				authOptions: auth.list,
				apn,
				fileName: profile,
				userName: user,
				password: passwd,
			});
		} else {
			message.error(intl.get(MODULE, 10)/*_i18n:配置获取失败*/);
		}
	}

	setMobileConfig = async() => {
		const { enable, mode, ipType, auth, userName, password, fileName } = this.state;

		const response = await common.fetchApi([{
			opcode: 'MOBILE_CONFIG_SET',
			data: {
				mobile: {
					switch: enable? 'on' : 'off',
					mode,
					iptype: ipType,
					auth,
					user: userName,
					passwd: password,
					profile: fileName,
				},
			}
		}]);
		const { errcode } = response;
        if(errcode === 0){
            message.success(intl.get(MODULE, 11)/*_i18n:设置完成*/)
        } else {
            message.error(intl.get(MODULE, 12)/*_i18n:设置失败*/)
        }

	}

	componentDidMount() {
		this.getMobileConfig();
	}

	render() {
		const { enable, status, mode, modeOptions, ipType, ipTypeOptions, auth, authOptions, apn, fileName, userName, password, disabled } = this.state;

		let netStatus = status === ''? '' : status === 'online'? intl.get(MODULE, 2)/*_i18n:已连接*/: intl.get(MODULE, 3)/*_i18n:未连接*/;
		netStatus = enable? netStatus : intl.get(MODULE, 13)/*_i18n:已关闭*/;

		const tip = checkStr(apn, { who: intl.get(MODULE, 7)/*_i18n:APN*/, min: 1, byte: true });
		const dialInfo = [
			[
				{
					label: 'Profile名称（选填）',
					value: fileName,
					type: 'fileName',
					inputType: 'input',
					disabled,
				},
				{
					label: intl.get(MODULE, 5)/*_i18n:IP类型*/,
					value: ipType,
					type: 'ipType',
					selectId: 'ipTypeArea',
					options: ipTypeOptions,
					inputType: 'select',
					disabled,
				},
			],
			[
				{
					label: intl.get(MODULE, 6)/*_i18n:认证方式*/,
					value: auth,
					type: 'auth',
					selectId: 'authArea',
					options: authOptions,
					inputType: 'select',
					disabled,
				},
				{
					label: intl.get(MODULE, 7)/*_i18n:APN*/,
					value: apn,
					type: 'apn',
					inputType: 'input',
					disabled,
					tip,
				},
			],
			[
				{
					label: '用户名（选填）',
					value: userName,
					type: 'userName',
					inputType: 'input',
					disabled,
				},
				{
					label: '密码（选填）',
					value: password,
					type: 'password',
					inputType: 'input',
					disabled,
				},
			],
		];
		const buttonDisabled = enable? (disabled || tip !== ''): false;
		return (
			<SubLayout className="settings">
				<Form className='mobile-form'>
					<PanelHeader
						title={intl.get(MODULE, 0)/*_i18n:移动网络设置*/}
						checkable={true}
						disabled={false}
						checked={enable}
						onChange={value => this.onChange('enable', value)}
					/>
					<p className='mobile-netStatus'><span className='netStatus-title'>{intl.get(MODULE, 1)/*_i18n:网络状态：*/}</span><span className='netStatus-status'>{netStatus}</span></p>
					{enable&&<div>
						<label className='mobile-label'>{intl.get(MODULE, 4)/*_i18n:网络模式*/}</label>
						<div className='mobile-selectArea' id="netModeArea">
							<Select
								value={mode}
								style={{ width: 320 }}
								onChange={(value)=>this.onChange('mode',value)}
								getPopupContainer={() => document.getElementById('netModeArea')}
								disabled={disabled}
							>
								{modeOptions.map(item => (
									<Option value={item} key={item}>{item}</Option>
								))}
							</Select>
						</div>
						<p className='mobile-dilInfo'>{intl.get(MODULE, 9)/*_i18n:拨号信息*/}</p>
						{dialInfo.map(item => (
							<div className='mobile-dilInfo-list'>
								{item.map((item, index) => (
									item.inputType === 'select'?
									<div className={index > 0? 'dilInfo-list-right':''} key={item.label}>
										<label className='mobile-label'>{item.label}</label>
										<div className='mobile-selectArea' id={item.selectId}>
											<Select
												value={item.value}
												style={{ width: 320 }}
												onChange={(value)=>this.onChange(item.type,value)}
												getPopupContainer={() => document.getElementById(item.selectId)}
												disabled={disabled}
											>
												{item.options.map(item => (
													<Option value={item} key={item}>{item}</Option>
												))}
											</Select>
										</div>
									</div>
									:
									<div className={index > 0? 'dilInfo-list-right':''} key={item.label}>
										<label className='mobile-label'>{item.label}</label>
										<FormItem className='mobile-formItem' showErrorTip={item.tip} type="small">
											<Input type="text" value={item.value} disabled={disabled} onChange={value => {this.onChange(item.type, value)}}/>
											<ErrorTip>{item.tip}</ErrorTip>
										</FormItem>
									</div>
								))
								}
							</div>
							
						))}
						
					</div>}
				</Form>
				<section className="save-area">
					<Button
						size="large"
						type="primary"
						disabled={buttonDisabled}
						onClick={this.setMobileConfig}
						className='button'
					>{intl.get(MODULE, 8)/*_i18n:保存*/}</Button>
				</section>
			</SubLayout>
		);
	}
}

export default MobileNetwork;
