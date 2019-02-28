import React from 'react';
import { Button, message } from 'antd';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import { init, clear } from '~/assets/common/auth';
import { Base64 } from 'js-base64';
import SwitchLang from '~/components/SwitchLang';
import "./login.scss";

const MODULE = 'login';
const { FormItem, Input }  = Form;

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
            password: value,
        });
        if (0 >= value.length) {
            message.error(intl.get(MODULE, 0));
        }
    }

    onEnter = () => {
        this.post();
    }

    componentWillMount() {
        // 删除认证cookie
        clear();
    }

    post = async () => {
        const password = this.state.password;

        if ('' === password) {
            message.error(intl.get(MODULE, 1));
            return;
        }

        this.setState({ loading : true });
        const response = await common.fetchApi(
            [{ 
                opcode: 'ACCOUNT_LOGIN',
                data: { account : { password : Base64.encode(password), user : 'admin' }}
            }]
        );
        const { errcode, data } = response;
        this.setState({ loading : false });

        switch (errcode) {
            case 0:
                init(data[0].result.account.token);
                this.props.history.push('/');
                return;
            case '-1604':
                this.props.history.push('/welcome');
                return;
            case '-1601':
                message.error(intl.get(MODULE, 2));
                break;
            case '-1605':
                message.error(intl.get(MODULE, 3));
                break;
            case '-1606':
                message.error(intl.get(MODULE, 4));
                break;
            default:
                message.error(intl.get(MODULE, 5, {error: errcode}));
                break;
        }
    }

    render() {
        const { password } = this.state;

        return <div className="ui-center ui-fullscreen">
                    <SwitchLang className='login-lang'/>
                    <div className="form-box" style={{ textAlign : 'center' }}>
                        <CustomIcon type="logo" size={90} color="#fff" />
                        <Form style={{ width : 320, padding: 0 , margin: '0 auto'}} >
                            <FormItem style={{ margin: '45px auto 30px' }}>
                                <Input placeholder={intl.get(MODULE, 6)/*_i18n:请输入您的管理密码*/}
                                        type="password"
                                        value={password}
                                        onChange={this.onChange}
                                        maxLength={32}
                                        onEnter={this.onEnter}
                                        />
                            </FormItem>
                        </Form>
                        <Button type="primary"
                                size='large'
                                onClick={this.post}
                                style={{ margin: "0 0 10px", width: 320 }}
                                loading={this.state.loading}>{intl.get(MODULE, 7)/*_i18n:登录*/}</Button>
                        <p style={{ fontSize : 12, lineHeight : 1.5, color: '#FFF', opacity: 0.6 }}>{intl.get(MODULE, 8)/*_i18n:忘记密码请按RESET键5秒复位，重新设置路由器*/}</p>
                    </div>
                    <div className="qr">
                        <img src={require('~/assets/images/qr.png')} />
                        <p>{intl.get(MODULE, 9)/*_i18n:扫描二维码下载APP*/}</p>
                    </div>
            </div>;
    }
}

export default Login;
