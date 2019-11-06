import React from 'react';
import { Button, message, Tooltip } from 'antd';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import Icon from '~/components/Icon';
import { init, clear } from '~/assets/common/auth';
import { Base64 } from 'js-base64';
import SwitchLang from '~/components/SwitchLang';
import { getQuickStartVersion } from '~/utils';
import './login.scss';

const MODULE = 'login';
const { FormItem, Input } = Form;

class Login extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		password: '',
		loading: false,
	};

	onChange = value => {
		this.setState({
			password: value
		});
		if (0 >= value.length) {
			message.error(intl.get(MODULE, 0) /*_i18n:请输入密码*/);
		}
	};

	onEnter = () => {
		this.post();
	};

	componentWillMount() {
		// 删除认证cookie
		clear();
	}

	post = async () => {
		const { password } = this.state;
		if ('' === password) {
			message.error(intl.get(MODULE, 1) /*_i18n:请输入密码*/);
			return;
		}

		this.setState({ loading: true });
		const response = await common.fetchApi([
			{
				opcode: 'ACCOUNT_LOGIN',
				data: {
					account: {
						password: Base64.encode(password),
						user: 'admin'
					}
				}
			}
		]);
		const { errcode, data } = response;
		this.setState({ loading: false });

		switch (errcode) {
			case 0:
				init(data[0].result.account.token);
				this.props.history.push('/');
				return;
			case '-1604':
				this.props.history.push('/welcome');
				return;
			case '-1601':
				message.error(intl.get(MODULE, 2) /*_i18n:请输入密码*/);
				break;
			case '-1605':
				message.error(intl.get(MODULE, 3) /*_i18n:密码错误*/);
				break;
			case '-1606':
				message.error(
					intl.get(
						MODULE,
						4
					) /*_i18n:密码错误次数过多，请5分钟后再试*/
				);
				break;
			default:
				message.error(
					intl.get(MODULE, 5, {
						error: errcode
					}) /*_i18n:未知错误[{error}]*/
				);
				break;
		}
	};

	render() {
		const { password } = this.state;

		return (
			<div
				className="ui-center ui-fullscreen"
				style={{ height: window.innerHeight - 76 }}
			>
				<SwitchLang className="login-lang" />
				<div className="form-box">
					<CustomIcon className='login-icon-logo' type="logo" size={90} />
					<Form className='login-form'>
						<FormItem className='login-form-item'>
							<Input
								placeholder={
									intl.get(
										MODULE,
										6
									) /*_i18n:请输入您的管理密码*/
								}
								type="password"
								value={password}
								onChange={this.onChange}
								maxLength={32}
								onEnter={this.onEnter}
							/>
						</FormItem>
					</Form>
					<Button
						className='login-button'
						type="primary"
						size="large"
						onClick={this.post}
						loading={this.state.loading}
					>
						{intl.get(MODULE, 7) /*_i18n:登录*/}
					</Button>
					<p className='login-tip'>
						{/* {intl.get(MODULE, 8) /*_i18n:忘记密码请按RESET键5秒复位，重新设置路由器*/}
						<span>忘记密码</span>
						<Tooltip placement='right' title={intl.get(MODULE, 8) /*_i18n:忘记密码请按RESET键5秒复位，重新设置路由器*/}>
							<span className="tooltip-icon" >
								<Icon
									size={12}
									className='icon-white'
									type="help"
								/>
							</span>
						</Tooltip>
					</p>
				</div>
				<div className="qr">
					{getQuickStartVersion() === 'domestic' ? (
						<img src={require(`~/assets/images/qr.png`)} />
					) : (
						<img src={require(`~/assets/images/qr-overseas.png`)} />
					)}
					<p>{intl.get(MODULE, 9) /*_i18n:扫描二维码下载APP*/}</p>
				</div>
			</div>
		);
	}
}

export default Login;
