import React from 'react';
import '../index.scss';
import { PWD_AUTH, SMS } from '~/assets/common/constants';

const MODULE = 'guestpreview';

export default class GuestWeb extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const {
			portalValue,
			welcome,
			version,
			connectButton,
			imgUrl,
			logoUrl
		} = this.props;
		return (
			<div>
				<div
					className="guest-web"
					style={{
						backgroundImage: `url(${imgUrl})`
					}}
				>
					<div
						className="guest-logo"
						style={{
							backgroundImage: `url(${logoUrl})`
						}}
					></div>
					<div className="guest-text">{welcome}</div>
					{portalValue === PWD_AUTH && (
						<div className="guest-password">
							<div className="guest-password-icon"></div>
							<label>{intl.get(MODULE, 0)}</label>
						</div>
					)}
					{portalValue === SMS && (
						<div>
							<div className="guest-password guest-margin">
								<div className="guest-phone-icon"></div>
								<span>{intl.get(MODULE, 1)}</span>
							</div>
							<div className="guest-password guest-code">
								<div className="guest-code-icon"></div>
								<span>{intl.get(MODULE, 2)}</span>
							</div>
						</div>
					)}
					<div className="guest-web-button">
						<span>{connectButton}</span>
					</div>
					<div className="guest-copyright">
						{version !== '' && [
							<div className="guest-copyright-icon"></div>,
							<span>{version}</span>
						]}
					</div>
				</div>
			</div>
		);
	}
}
