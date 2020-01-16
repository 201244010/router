import React from 'react';
import './index.scss';

export default class GuestWeb extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { portalValue, welcome, version, connectButton, imgUrl } = this.props;
		return (
			<div>
				<div className="guest-web" style={{
					backgroundImage: `url(${imgUrl})`,
					backgroundRepeat:'no-repeat',
					backgroundSize: 'contain',
					backgroundPosition:'center',
				}}>
					<div className="guest-logo"></div>
					<div className="guest-text">{welcome}</div>
					{portalValue === 2 && (
						<div className="guest-password">
							<div className="guest-password-icon"></div>
							<label>请输入Wi-Fi密码</label>
						</div>
					)}
					{portalValue === 3 && (
						<div>
							<div className="guest-password guest-margin">
								<div className="guest-phone-icon"></div>
								<span>请输入手机号</span>
							</div>
							<div className="guest-password guest-code">
								<div className="guest-code-icon"></div>
								<span>请输入验证码</span>
							</div>
						</div>
					)}
					<div className="guest-web-button">
						<span>{connectButton}</span>
					</div>
					<div className="guest-copyright">
						{
							version !== '' && [
								<div className="guest-copyright-icon"></div>,
								<span>{version}</span>
							]
						}
					</div>
				</div>
			</div>
		);
	}
}
