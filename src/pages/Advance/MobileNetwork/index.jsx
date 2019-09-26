import React from 'react';
import { Button, Select, message } from 'antd';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import './index.scss';

const MODULE = 'mobileNetwork';
const Option = Select.Option;
const {FormItem, Input} = Form;

class MobileNetwork extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			enable: true,
			status: 'online',
			mode: '4G/3G/2G',
			modeOptions: ['4G/3G/2G','3G/2G','2G'],
			ipType: 'ipv4',
			ipTypeOptions: ['ipv4','ipv6','ipv4v6'],
			auth: 'none',
			authOptions: ['pap','chap','both','none'],
			apn: 'cmnet',
		};
	}

	onChange = (type, value) => {
		this.setState({[type]: value});
	}

	getMobileConfig = async() => {
		const response = await common.fetchApi([{ opcode: 'MOBILE_CONFIG_GET' }]);
        const { errcode, data } = response;
        if(errcode === 0){
			const { mobile: { switch: enable, status, mode, iptype: ipType, auth, apn } = {} } = data[0].result;
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
			});
		} else {
			message.error(intl.get(MODULE, 10)/*_i18n:配置获取失败*/);
		}
	}

	setMobileConfig = async() => {
		const { enable, mode, ipType, auth } = this.state;

		let response = await common.fetchApi([{
			opcode: 'MOBILE_CONFIG_SET',
			data: {
				mobile: {
					switch: enable? 'on' : 'off',
					mode,
					iptype: ipType,
					auth,
					apncfg: 'auto',
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
		const { enable, status, mode, modeOptions, ipType, ipTypeOptions, auth, authOptions, apn } = this.state;

		const netStatus = status === 'online'? intl.get(MODULE, 2)/*_i18n:已连接*/: intl.get(MODULE, 3)/*_i18n:未连接*/;
		const dialInfo = [
			{
				label: intl.get(MODULE, 5)/*_i18n:IP类型*/,
				selectId: 'ipTypeArea',
				value: ipType,
				type: 'ipType',
				options: ipTypeOptions,

			},
			{
				label: intl.get(MODULE, 6)/*_i18n:认证方式*/,
				selectId: 'authArea',
				value: auth,
				type: 'auth',
				options: authOptions,
			},
		];
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
					<label className='mobile-label'>{intl.get(MODULE, 4)/*_i18n:网络模式*/}</label>
					<div className='mobile-selectArea' id="netModeArea">
						<Select
							value={mode}
							style={{ width: 320 }}
							onChange={(value)=>this.onChange('mode',value)}
							getPopupContainer={() => document.getElementById('netModeArea')}
						>
							{modeOptions.map(item => (
								<Option value={item} key={item}>{item}</Option>
							))}
						</Select>
					</div>
					<p className='mobile-dilInfo'>{intl.get(MODULE, 9)/*_i18n:拨号信息*/}</p>
					{dialInfo.map(item => (
						<React.Fragment key={item.label}>
							<label className='mobile-label'>{item.label}</label>
							<div className='mobile-selectArea' id={item.selectId}>
								<Select
									value={item.value}
									style={{ width: 320 }}
									onChange={(value)=>this.onChange(item.type,value)}
									getPopupContainer={() => document.getElementById(item.selectId)}
									disabled
								>
									{item.options.map(item => (
										<Option value={item} key={item}>{item}</Option>
									))}
								</Select>
							</div>
						</React.Fragment>
					))}
					<label className='mobile-label'>{intl.get(MODULE, 7)/*_i18n:APN*/}</label>
					<FormItem className='mobile-formItem' type="small">
						<Input type="text" value={apn} disabled onChange={value => {this.onChange('apn', value)}}/>
					</FormItem>
				</Form>
				<section className="save-area">
					<Button
						size="large"
						type="primary"
						disabled={false}
						onClick={this.setMobileConfig}
						className='button'
					>{intl.get(MODULE, 8)/*_i18n:保存*/}</Button>
				</section>
			</SubLayout>
		);
	}
}

export default MobileNetwork;
