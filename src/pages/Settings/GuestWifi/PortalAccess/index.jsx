import React from 'react';
import { Select, Modal, Upload, Icon, Button, Radio, message } from 'antd';
import Form from '~/components/Form';
import GuestWeb from './GuestWeb';
import GuestPhone from './GuestPhone';
import {
	VALID_NETWORK_TIME,
	EMPTY_NETWORK_TIME,
	NONE,
	PWD_AUTH,
	SMS
} from '~/assets/common/constants';
const { FormItem, ErrorTip, Input } = Form;

const MODULE = 'portalaccess';
export default class PortalAccess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imgUrl: '',
			logoUrl: ''
		};
	}

	beforeUpload = file => {
		// console.log(file);
		const isJpg = file.type === 'image/jpeg';
		// console.log(isJpg);
		// const isLt128K = file.size / 1024 < 128;
		if (!isJpg) {
			message.error('只支持.jpg后缀的图片');
		}

		// if (!isLt128K) {
		// 	message.error('图片大小不超过128k');
		// }
		// console.log(isJpg, isLt128K, isJpg && isLt128K);
		return isJpg;
	};

	getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	};

	onRemove = () => {};

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
					[imgKey]: imgUrl
				})
			);
		}
	};

	render() {
		const { imgUrl, logoUrl } = this.state;
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
			onChange
		} = this.props;
		const messageMap = [
			{
				type: 'messageTime',
				description: '30s-180s',
				tip: messageTimeTip,
				value: messageTime,
				label: intl.get(MODULE, 0)
			},
			{
				type: 'appKey',
				description: intl.get(MODULE, 1),
				maxLength: 50,
				tip: appKeyTip,
				value: appKey,
				placeholder: intl.get(MODULE, 2),
				label: 'AppKey'
			},
			{
				type: 'appSecret',
				description: intl.get(MODULE, 1),
				maxLength: 50,
				tip: appSecretTip,
				value: appSecret,
				placeholder: intl.get(MODULE, 3),
				label: 'APP Secret'
			},
			{
				type: 'modelId',
				description: intl.get(MODULE, 1),
				maxLength: 50,
				tip: modelIdTip,
				value: modelId,
				placeholder: intl.get(MODULE, 4),
				label: intl.get(MODULE, 5)
			},
			{
				type: 'sign',
				description: intl.get(MODULE, 1),
				maxLength: 50,
				tip: signTip,
				value: sign,
				placeholder: intl.get(MODULE, 6),
				label: intl.get(MODULE, 7)
			}
		];
		const portalMap = [
			{
				type: 'welcome',
				description: intl.get(MODULE, 8),
				tip: welcomeTip,
				maxLength: 30,
				value: welcome,
				label: intl.get(MODULE, 9)
			},
			{
				type: 'connectButton',
				description: intl.get(MODULE, 10),
				tip: connectButtonTip,
				maxLength: 15,
				value: connectButton,
				label: intl.get(MODULE, 11)
			},
			{
				type: 'version',
				description: intl.get(MODULE, 8),
				tip: versionTip,
				maxLength: 30,
				value: version,
				label: intl.get(MODULE, 12)
			}
		];
		// console.log(imgUrl);
		return (
			<div>
				<div className={portalValue !== SMS ? 'message-service' : ''}>
					<div>{intl.get(MODULE, 13)}</div>
					<Select
						style={{ width: 320 }}
						onChange={value => onSelectChange('portalValue', value)}
						value={portalValue}
					>
						<Option value={NONE}>{intl.get(MODULE, 14)}</Option>
						<Option value={PWD_AUTH}>{intl.get(MODULE, 15)}</Option>
						<Option value={SMS}>{intl.get(MODULE, 16)}</Option>
					</Select>
					{portalValue === SMS && (
						<div className="guest-message-block">
							<div className="guest-left">
								<div>{intl.get(MODULE, 17)}</div>
								<Select
									style={{ width: 320 }}
									onChange={this.onChange}
									defaultValue={messageValue}
								>
									<Option value={'ali'}>{intl.get(MODULE, 18)}</Option>
									<Option value={'tencent'}>{intl.get(MODULE, 19)}</Option>
									<Option value={'baidu'}>{intl.get(MODULE, 20)}</Option>
									<Option value={'nets'}>{intl.get(MODULE, 21)}</Option>
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
				<div className="ad-title">{intl.get(MODULE, 22)}</div>
				<div className="guest-upload">
					<Upload
						{...{
							onChange: file => {
								this.handleUploadChange(
									file,
									'logoFileList',
									'logoUrl'
								);
							},
							// beforeUpload: this.beforeUpload,
							name: 'file',
							multiple: false,
							// data: { opcode: '0x2089' },
							// action: __BASEAPI__,
							action:
								'https://www.mocky.io/v2/5cc8019d300000980a055e76',
							fileList: logoFileList,
							uploadTitle: '上传Logo图'
						}}
					>
						<Button>
							<Icon type="upload" /> {intl.get(MODULE, 23)}
						</Button>
					</Upload>
					{/* <span className="guest-tip">图片最大128k, 支持jpg格式</span> */}
				</div>
				<div className="guest-upload">
					<Upload
						{...{
							onChange: file => {
								this.handleUploadChange(
									file,
									'bgFileList',
									'imgUrl'
								);
							},
							// beforeUpload: this.beforeUpload,
							name: 'file',
							// multiple: false,
							// data: { opcode: '0x2089' },
							// action: __BASEAPI__,
							action:
								'https://www.mocky.io/v2/5cc8019d300000980a055e76',
							fileList: bgFileList,
							uploadTitle: '上传Logo图'
						}}
					>
						<Button>
							<Icon type="upload" /> {intl.get(MODULE, 24)}
						</Button>
					</Upload>
					{/* <span className="guest-tip">图片最大128k, 支持jpg格式</span> */}
				</div>
				{portalValue === PWD_AUTH && (
					<div>
						<label>{intl.get(MODULE, 25)}</label>
						<FormItem
							type="small"
							showErrorTip={accessPasswordTip}
							style={{ width: 320 }}
						>
							<Input
								type="text"
								maxLength={32}
								value={accessPassword}
								placeholder={intl.get(MODULE, 26)}
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
				<label>{intl.get(MODULE, 27)}</label>
				<FormItem type="small" style={{ width: 320 }}>
					<Radio.Group
						onChange={e => onRadioChange('navigateValue', e)}
						value={navigateValue}
					>
						<Radio value={'1'}>{intl.get(MODULE, 28)}</Radio>
						<Radio value={'0'}>{intl.get(MODULE, 29)}</Radio>
					</Radio.Group>
				</FormItem>
				{navigateValue === '1' && (
					<div>
						<label>{intl.get(MODULE,30)}</label>
						<FormItem
							type="small"
							showErrorTip={jumpTextTip}
							style={{ width: 320 }}
						>
							<Input
								type="text"
								maxLength={32}
								value={jumpText}
								placeholder={intl.get(MODULE,31)}
								onChange={value => onChange('jumpText', value)}
							/>
							<ErrorTip>{jumpTextTip}</ErrorTip>
						</FormItem>
						<label>{intl.get(MODULE,32)}</label>
						<FormItem
							type="small"
							showErrorTip={jumpLinkTip}
							style={{ width: 320 }}
						>
							<Input
								type="text"
								maxLength={32}
								value={jumpLink}
								placeholder={intl.get(MODULE,33)}
								onChange={value => onChange('jumpLink', value)}
							/>
							<ErrorTip>{jumpLinkTip}</ErrorTip>
						</FormItem>
					</div>
				)}
				<div className="guest-padding">
					<div className="ad-title">{intl.get(MODULE,34)}</div>
					<div className="message-service">
						<div>{intl.get(MODULE,35)}</div>
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
						<div>{intl.get(MODULE,36)}</div>
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
						portalValue === SMS
							? 'guest-portal-message'
							: 'guest-portal'
					}
				>
					<Radio.Group
						onChange={e => onRadioChange('previewValue', e)}
						value={previewValue}
					>
						<Radio value={0}>{intl.get(MODULE,37)}</Radio>
						<Radio value={1}>{intl.get(MODULE,38)}</Radio>
					</Radio.Group>
					{previewValue === 1 ? (
						<GuestPhone
							{...{
								portalValue,
								welcome,
								version,
								connectButton,
								imgUrl,
								logoUrl
							}}
						/>
					) : (
						<GuestWeb
							{...{
								portalValue,
								welcome,
								version,
								connectButton,
								imgUrl,
								logoUrl
							}}
						/>
					)}
				</div>
				<div
					className={
						portalValue === SMS
							? 'guest-border-line-message'
							: 'guest-border-line'
					}
				></div>
			</div>
		);
	}
}