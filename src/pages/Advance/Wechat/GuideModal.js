import React from 'react';
import { Modal, Timeline, Button } from 'antd';

const MODULE = 'wechatConnectWifi';

export default class GuideModal extends React.Component {
	render() {
		const { visible, close } = this.props;
		const itemColor = '#6174F1';
		return (
			<Modal
				visible={visible}
				className='account-step-guide'
				width={824}
				centered
				closable={false}
				footer={null}
			>
				<div className='body'>
					<h4>{intl.get(MODULE, 11)/*_i18n:微信公众平台设置指引*/}</h4>
					<div className='content'>
						<Timeline>
							<Timeline.Item color={itemColor}>
								<label>{intl.get(MODULE, 12)/*_i18n:添加功能插件*/}</label>
								<p>{intl.get(MODULE, 13)/*_i18n:用已有公众号（必须是服务号）或新注册账号*/}<a href='https://mp.weixin.qq.com' target='_blank'>{intl.get(MODULE, 14)/*_i18n:登录公众平台*/}</a>{intl.get(MODULE, 15)/*_i18n:，添加“*/}<b>{intl.get(MODULE, 16)/*_i18n:门店小程序*/}</b>{intl.get(MODULE, 17)/*_i18n:”和“*/}<b>{intl.get(MODULE, 18)/*_i18n:微信连Wi-Fi*/}</b>{intl.get(MODULE, 19)/*_i18n:”功能插件。*/}</p>
								<img className='img-size' src={require('~/assets/images/add-feature.png')} />
							</Timeline.Item>
							<Timeline.Item color={itemColor}>
								<label>{intl.get(MODULE, 20)/*_i18n:添加门店*/}</label>
								<p>{intl.get(MODULE, 21)/*_i18n:进入“*/}<b>{intl.get(MODULE, 22)/*_i18n:门店小程序*/}</b>{intl.get(MODULE, 23)/*_i18n:”插件，点击添加门店，按照指引添加完成。*/}</p>
							</Timeline.Item>
							<Timeline.Item color={itemColor}>
								<label>{intl.get(MODULE, 24)/*_i18n:添加Wi-Fi设备*/}</label>
								<p>{intl.get(MODULE, 25)/*_i18n:进入“微信连Wi-Fi”插件，选择“用户连网方式”，点击扫二维码连网中的“立即配置”，再点击“添加设备”；设备类型选择密码型设备；网络名（SSID）和密码分别输入客用Wi-Fi的名称和密码（当前客用Wi-Fi名称：WX_SUNMI_XX_Guest；密码：12345）*/}</p>
								<img className='img-size' src={require('~/assets/images/add-wifi.png')} />
							</Timeline.Item>
							<Timeline.Item color={itemColor}>
								<label>{intl.get(MODULE, 26)/*_i18n:获取二维码*/}</label>
								<p>{intl.get(MODULE, 27)/*_i18n:点击“添加”后，在弹窗提醒中点击“下一步”，下载二维码物料。*/}</p>
								<img className='img-size' src={require('~/assets/images/get-qrcode.png')} />
							</Timeline.Item>
							<Timeline.Item color={itemColor}>
								<label>{intl.get(MODULE, 28)/*_i18n:完成*/}</label>
							</Timeline.Item>
						</Timeline>
					</div>
				</div>
				<div className='footer'>
					<Button type='primary' onClick={close}>{intl.get(MODULE, 29)/*_i18n:我知道了*/}</Button>
				</div>
			</Modal>
		);
	}
}