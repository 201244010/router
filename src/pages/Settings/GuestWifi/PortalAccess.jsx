import React from 'react';
import { Select, Modal, Upload, Icon, Button, Radio } from 'antd'; 
import Form from '~/components/Form';
const { FormItem, ErrorTip, Input } = Form;

export default class PortalAccess extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selectValue: 3,
			messageValue: 1,
			visible: false,
			navigateValue: 1
			
		}
	}

	onChange = (value) => {
		this.setState({
			selectValue: value
		})
	}

	viewMessage = () => {
		this.setState({
			visible: true
		})
	}

	render() {
		const { selectValue, visible, messageValue } = this.state;
		return (
			<div>
				<div className="guest-padding">
					<div className="message-service">
						<div>Portal认证</div>
						<Select
							style={{ width: 320 }}
							onChange={this.onChange}
							defaultValue={selectValue}
						>
							<Option value={1}>无密码</Option>
							<Option value={2}>普通密码</Option>
							<Option value={3}>短信认证</Option>
						</Select>
						{
							selectValue === 3 && <span onClick={this.viewMessage} className="message-access">设置短信认证参数</span>
						}
					</div>
					<div className="ad-title">自定义广告语</div>
					<div className='guest-upload'>
						<Upload>
							<Button>
							<Icon type="upload" /> 上传Logo图
							</Button>
						</Upload>
						<span className="guest-tip">图片最大128k, 支持jpg格式</span>
					</div>
					<div className='guest-upload'>
						<Upload>
							<Button>
							<Icon type="upload" /> 上传背景图
							</Button>
						</Upload>
						<span className="guest-tip">图片最大128k, 支持jpg格式</span>
					</div>
				</div>
				<Form>
					<label>欢迎语</label>
					<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
						<Input type="text" maxLength={32} value={''} description='1~30个字符' onChange={(value)=>this.onChange('guestSsid',value)}/>
						<ErrorTip>{''}</ErrorTip>
					</FormItem>
					{
						selectValue === 2 && <div>
							<label>验证密码</label>
							<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
								<Input type="text" maxLength={32} value={''} placeholder='请输入验证密码' onChange={(value)=>this.onChange('guestSsid',value)}/>
								<ErrorTip>{''}</ErrorTip>
							</FormItem>
						</div>
					}
					<label>连接按钮文案</label>
					<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
						<Input type="text" maxLength={32} value={''} description='1~15个字符' onChange={(value)=>this.onChange('guestSsid',value)}/>
						<ErrorTip>{''}</ErrorTip>
					</FormItem>
					<label>版权声明</label>
					<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
						<Input type="text" maxLength={32} value={''} description='1~30个字符' onChange={(value)=>this.onChange('guestSsid',value)}/>
						<ErrorTip>{''}</ErrorTip>
					</FormItem>
				</Form>
				<div>
					<div>跳转按钮</div>

				</div>
				
				<Modal
					visible={visible}
					width={447}
					closable={false}
					onCancel={() => { this.setState({ visible: false }) }}
					title='短信认证参数设置'
				>
					<div className="message-service">
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
					<Form>
						<div>
							<label>验证码有效时长</label>
							<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
								<Input type="text" maxLength={32} value={''} description='30s-180s' onChange={(value)=>this.onChange('guestSsid',value)}/>
								<ErrorTip>{''}</ErrorTip>
							</FormItem>
						</div>
						<label>AppKey</label>
						<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
							<Input type="text" maxLength={32} value={''} description='1~50个字符' placeholder='请输入SMK_App_ID' onChange={(value)=>this.onChange('guestSsid',value)}/>
							<ErrorTip>{''}</ErrorTip>
						</FormItem>
						<label>APP Secret</label>
						<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
							<Input type="text" maxLength={32} value={''} description='1~50个字符' placeholder='请输入APP Secret' onChange={(value)=>this.onChange('guestSsid',value)}/>
							<ErrorTip>{''}</ErrorTip>
						</FormItem>
						<label>模板ID</label>
						<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
							<Input type="text" maxLength={32} value={''} description='1~50个字符' placeholder='请输入模板ID' onChange={(value)=>this.onChange('guestSsid',value)}/>
							<ErrorTip>{''}</ErrorTip>
						</FormItem>
						<span></span>
						<label>签名名称</label>
						<FormItem type="small" showErrorTip={''} style={{ width : 320}}>
							<Input type="text" maxLength={32} value={''} description='1~50个字符' placeholder='请输入签名名称' onChange={(value)=>this.onChange('guestSsid',value)}/>
							<ErrorTip>{''}</ErrorTip>
						</FormItem>
					</Form>
				</Modal>
			</div>
		)
	}
}