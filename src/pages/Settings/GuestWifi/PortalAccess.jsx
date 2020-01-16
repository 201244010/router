import React from 'react';
import { Select, Modal, Upload, Icon, Button, Radio, message } from 'antd';
import Form from '~/components/Form';
import GuestWeb from './GuestWeb';
import GuestPhone from './GuestPhone';
const { FormItem, ErrorTip, Input } = Form;
import {
	VALID_NETWORK_TIME,
	EMPTY_NETWORK_TIME
} from '~/assets/common/constants';

export default class PortalAccess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgUrl: '',
		};
	}

	beforeUpload = (file) => {
		console.log(file);
		const isJpg = file.type === "image/jpeg";
		console.log(isJpg);
		// const isLt128K = file.size / 1024 < 128;
        if (!isJpg) {
			message.error('只支持.jpg后缀的图片');
		}
		
		// if (!isLt128K) {
		// 	message.error('图片大小不超过128k');
		// }
		// console.log(isJpg, isLt128K, isJpg && isLt128K);
        return isJpg;
    }  

	getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	handleUploadChange = (info, fileKey, imgKey) => {
		let fileList = info.fileList;
		console.log(info);
		const { setFile } = this.props;
		setFile(fileKey, fileList);
        const file = info.file;
		if (info.file.status === 'uploading') {
			// this.setState({ loading: true });
			return;
		  }
		  if (info.file.status === 'done') {
			// Get this url from response in real world.
			this.getBase64(info.file.originFileObj, imgUrl =>
			  this.setState({
				imgUrl
			  }),
			);
		  }
	}

	render() {
		const { imgUrl } = this.state;
		const {
			onRadioChange,
			onSelectChange,
			strObjectTip: {
				welcomeTip,
				connectButtonTip,
				versionTip,
				jumpTextTip,
				jumpLinkTip,
				messageTimeTip,
				appKeyTip,
				appSecretTip,
				modelIdTip,
				signTip,
				accessPasswordTip
			},
			state: {
				inputValue: {
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
				messageValue,
				portalValue,
				navigateValue,
				validValue,
				emptyValue,
				previewValue,
				logoFileList,
				bgFileList
			},
			onChange,
		} = this.props;
		const messageMap = [
			{
				type: 'messageTime',
				description: '30s-180s',
				tip: messageTimeTip,
				value: messageTime,
				label: '验证码有效时长'
			},
			{
				type: 'appKey',
				description: '1~50个字符',
				maxLength: 50,
				tip: appKeyTip,
				value: appKey,
				placeholder: '请输入SMK_App_ID',
				label: 'AppKey'
			},
			{
				type: 'appSecret',
				description: '1~50个字符',
				maxLength: 50,
				tip: appSecretTip,
				value: appSecret,
				placeholder: '请输入APP Secret',
				label: 'APP Secret'
			},
			{
				type: 'modelId',
				description: '1~50个字符',
				maxLength: 50,
				tip: modelIdTip,
				value: modelId,
				placeholder: '请输入模板ID',
				label: '模板ID'
			},
			{
				type: 'sign',
				description: '1~50个字符',
				maxLength: 50,
				tip: signTip,
				value: sign,
				placeholder: '请输入签名名称',
				label: '签名名称'
			}
		];
		const portalMap = [
			{
				type: 'welcome',
				description: '1~30个字符',
				tip: welcomeTip,
				maxLength: 30,
				value: welcome,
				label: '欢迎语'
			},
			{
				type: 'connectButton',
				description: '1~15个字符',
				tip: connectButtonTip,
				maxLength: 15,
				value: connectButton,
				label: '连接按钮文案'
			},
			{
				type: 'version',
				description: '1~30个字符',
				tip: versionTip,
				maxLength: 30,
				value: version,
				label: '版权声明'
			}
		];
		console.log(imgUrl);
		return (
			<div>
				<div className={ portalValue !== 3 ? "message-service" : ''}>
					<div>Portal认证</div>
					<Select
						style={{ width: 320 }}
						onChange={value => onSelectChange('portalValue', value)}
						defaultValue={portalValue}
					>
						<Option value={1}>无密码</Option>
						<Option value={2}>普通密码</Option>
						<Option value={3}>短信认证</Option>
					</Select>
					{portalValue === 3 && (
						<div className="guest-message-block">
							<div className="guest-left">
								<div>短信服务商</div>
								<Select
									style={{ width: 320 }}
									onChange={this.onChange}
									defaultValue={messageValue}
								>
									<Option value={1}>阿里云</Option>
									<Option value={2}>腾讯云</Option>
									<Option value={3}>百度云</Option>
									<Option value={4}>网易云信</Option>
								</Select>
							</div>
							{messageMap.map((item, index) => {
								const {
									label,
									description,
									placeholder = '',
									maxLength = 32,
									value,
									tip,
									type
								} = item;
								return (
									<div
										className={
											index % 2 === 0
												? 'guest-right'
												: 'guest-left'
										}
									>
										<label>{label}</label>
										<FormItem
											type="small"
											showErrorTip={tip}
											style={{ width: 320 }}
										>
											<Input
												type="text"
												maxLength={maxLength}
												value={value}
												placeholder={placeholder}
												description={description}
												onChange={e =>
													onChange([type], e)
												}
											/>
											<ErrorTip>{tip}</ErrorTip>
										</FormItem>
									</div>
								);
							})}
						</div>
					)}
				</div>
				<div className="ad-title">自定义广告语</div>
				<div className="guest-upload">
					<Upload {...{
						onChange: (file) => {
							this.handleUploadChange(file, 'logoFileList', 'logo_img');
						},
						// beforeUpload: this.beforeUpload,
						name: 'file',
						multiple: false,
						// data: { opcode: '0x2089' },
						// action: __BASEAPI__,
						action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
						fileList: logoFileList,
						uploadTitle: '上传Logo图'
					}}>
						<Button>
							<Icon type="upload" /> 上传Logo图
						</Button>
					</Upload>
					<span className="guest-tip">图片最大128k, 支持jpg格式</span>
				</div>
				<div className="guest-upload">
					<Upload {...{
						onChange: (file) => {
							this.handleUploadChange(file, 'bgFileList', 'bg_img');
						},
						beforeUpload: this.beforeUpload,
						name: 'file',
						// multiple: false,
						// data: { opcode: '0x2089' },
						// action: __BASEAPI__,
						action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
						fileList: bgFileList,
						uploadTitle: '上传Logo图'
					}}>
						<Button>
							<Icon type="upload" /> 上传背景图
						</Button>
					</Upload>
					<span className="guest-tip">图片最大128k, 支持jpg格式</span>
				</div>
				{portalValue === 2 && (
					<div>
						<label>验证密码</label>
						<FormItem
							type="small"
							showErrorTip={accessPasswordTip}
							style={{ width: 320 }}
						>
							<Input
								type="text"
								maxLength={32}
								value={accessPassword}
								placeholder="请输入验证密码"
								onChange={value =>
									onChange('accessPassword', value)
								}
							/>
							<ErrorTip>{accessPasswordTip}</ErrorTip>
						</FormItem>
					</div>
				)}
				{portalMap.map(item => {
					const {
						label,
						description,
						placeholder = '',
						maxLength = 32,
						value,
						tip,
						type
					} = item;
					return (
						<div>
							<label>{label}</label>
							<FormItem
								type="small"
								showErrorTip={tip}
								style={{ width: 320 }}
							>
								<Input
									type="text"
									maxLength={maxLength}
									value={value}
									placeholder={placeholder}
									description={description}
									onChange={e => onChange([type], e)}
								/>
								<ErrorTip>{tip}</ErrorTip>
							</FormItem>
						</div>
					);
				})}
				<label>跳转按钮</label>
				<FormItem type="small" style={{ width: 320 }}>
					<Radio.Group
						onChange={e => onRadioChange('navigateValue', e)}
						value={navigateValue}
					>
						<Radio value={1}>开启</Radio>
						<Radio value={0}>关闭</Radio>
					</Radio.Group>
				</FormItem>
				{navigateValue === 1 && (
					<div>
						<label>跳转按钮文案</label>
						<FormItem
							type="small"
							showErrorTip={jumpTextTip}
							style={{ width: 320 }}
						>
							<Input
								type="text"
								maxLength={32}
								value={jumpText}
								placeholder="请输入按钮文案"
								onChange={value => onChange('jumpText', value)}
							/>
							<ErrorTip>{jumpTextTip}</ErrorTip>
						</FormItem>
						<label>跳转按钮链接</label>
						<FormItem
							type="small"
							showErrorTip={jumpLinkTip}
							style={{ width: 320 }}
						>
							<Input
								type="text"
								maxLength={32}
								value={jumpLink}
								placeholder="请输入按钮链接"
								onChange={value => onChange('jumpLink', value)}
							/>
							<ErrorTip>{jumpLinkTip}</ErrorTip>
						</FormItem>
					</div>
				)}
				<div className="guest-padding">
					<div className="ad-title">上网时长设置</div>
					<div className="message-service">
						<div>有效上网时长</div>
						<Select
							style={{ width: 320 }}
							onChange={this.onChange}
							defaultValue={validValue}
						>
							{VALID_NETWORK_TIME.map(item => (
								<Option value={item}>{item}h</Option>
							))}
						</Select>
					</div>
					<div className="message-service">
						<div>空闲断网时长</div>
						<Select
							style={{ width: 320 }}
							onChange={this.onChange}
							defaultValue={emptyValue}
						>
							{EMPTY_NETWORK_TIME.map(item => (
								<Option value={item}>{item}min</Option>
							))}
						</Select>
					</div>
				</div>
				<div
					className={
						portalValue === 3
							? 'guest-portal-message'
							: 'guest-portal'
					}
				>
					<Radio.Group
						onChange={e => onRadioChange('previewValue', e)}
						value={previewValue}
					>
						<Radio value={1}>手机效果预览</Radio>
						<Radio value={0}>网页效果预览</Radio>
					</Radio.Group>
					{previewValue === 1 ? (
						<GuestPhone { ...{ portalValue, welcome, version, connectButton, imgUrl } }/>						
					) : (
						<GuestWeb { ...{ portalValue, welcome, version, connectButton, imgUrl } }/>
					)}
				</div>
				<div
					className={
						portalValue === 3
							? 'guest-border-line-message'
							: 'guest-border-line'
					}
				></div>
			</div>
		);
	}
}
