import React from 'react';
import { Button, Checkbox } from 'antd';
import CustomIcon from '~/components/Icon';
import './success.scss';
import { getQuickStartVersion } from '~/utils';

const MODULE = 'success';

export default class Success extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: true
		}
	}

	onChange = (e) => {
		this.setState({
			checked: e.target.checked
		})
	}

	setAutoUpgrade = async() => {
		const { checked } = this.state;
		const resp = await common.fetchApi([
			{ 
				opcode:'UPGRADETIME_GET',
		 	},
		], { ignoreErr: true });
		const {errcode, data} = resp;
		if (0 === errcode) {
			await common.fetchApi([
				{ 
					opcode:'UPGRADETIME_SET', 
					data: {
						...data[0].result,
						enable: checked ? '1' : '0',
					},
				 },
			], { loading: true });
		}
	}

	goHome = () => {
		this.setAutoUpgrade();
		this.props.history.push('/home');
	};

	addSubRouter = () => {
		this.setAutoUpgrade();
		this.props.history.push('/guide/addsubrouter');
	};

	render() {
		const { checked } = this.state;
		return (
			<React.Fragment>
				<div className="success">
					<CustomIcon
						size={72}
						className='success-icon-succeed'
						type="succeed"
					/>
					<h4>{intl.get(MODULE, 11) /*_i18n:设置完成*/}</h4>
					<p>
						{intl.get(
							MODULE,
							0
						) /*_i18n:下载商米助手APP，体验更多功能！*/}
					</p>
					<div className="QR">
						{getQuickStartVersion() === 'domestic' ? (
							<img src={require(`~/assets/images/qr.png`)} />
						) : (
							<img
								src={require(`~/assets/images/qr-overseas.png`)}
							/>
						)}
						<p>
							{intl.get(MODULE, 10) /*_i18n:扫描二维码下载APP*/}
						</p>
					</div>
					<div className="footButtons">
						<Button type="primary" onClick={this.goHome}>
							{intl.get(MODULE, 1) /*_i18n:配置完成*/}
						</Button>
						<Button onClick={this.addSubRouter}>
							{intl.get(MODULE, 2) /*_i18n:添加更多商米路由器*/}
						</Button>
					</div>
					<div className='auto-upgrade-tip'>
						<Checkbox checked={checked} onChange={this.onChange}><span className='tip-font'>{intl.get(MODULE, 12) /*_i18n:闲时自动升级路由器固件，让您时刻享受最新体验*/}</span></Checkbox>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
