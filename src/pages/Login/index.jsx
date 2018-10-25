import React from 'react';
import { Button, Icon } from 'antd';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import { clearAll } from '~/assets/common/cookie';
import "./QRcode.scss";

const { FormItem, ErrorTip, Input }  = Form;

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        password: '',
        tip : '',
        loading: false,
    };

    onChange = value => {
        this.setState({ 
            password: value,
        })
    }

    onKeyUp = e => {
        this.setState({ tip : '' });
    }

    flush = () => {
        this.passwordInput.focus();
        this.setState({ password: '' });
    }

    onEnter = () => {
        this.post();
    }

    componentWillMount() {
        // 删除认证cookie
        clearAll();
    }

    post = async () => {
        const password = this.state.password;
        this.setState({ loading : true });
        const response = await common.fetchApi(
            [{ 
                opcode: 'ACCOUNT_LOGIN',
                data: { account : { password : btoa(password), user : 'admin' }}
            }],
            {
                loading: true,
            }
        );
        const { errcode, message } = response;
        this.setState({ loading : false });
        if(errcode == 0){
            this.props.history.push('/');
            return;
        }
        if(message === 'ERRCODE_PARAMS_INVALID'){
            this.setState({tip : "密码错误"});
        }else if(message === 'ERRCODE_PERMISSION'){
            this.setState({tip : '密码错误次数过多，请5分钟后再试'});
        }else{
            this.setState({tip : message});
        }    
    }

    render() {
        // const password = this.state.password.trim();
        const {tip} = this.state;
        // const suffix = password.length ? <Icon type="close-circle" onClick={this.flush} /> : null;
        return [
            <div key='login-content' className="ui-center ui-fullscreen">
                    <div className="form-box" style={{ textAlign : 'center' }}>
                        <CustomIcon type="logo" size={90} color="#fff" />
                        <Form style={{ width : 320, padding: 0 }} >
                            <FormItem style={{ margin: '45px auto 30px' }}>
                                <Input placeholder="请输入您的登录密码"
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                        maxLength='32'
                                        onEnter={this.onEnter} 
                                        />
                            <ErrorTip style={{
                                color: '#FF5500',
                                position: 'absolute',
                                right: 35,
                                top: 10,
                                textAlign: 'right',
                                }}>{ tip }</ErrorTip>
                            </FormItem>
                        </Form>
                        <Button type="primary"
                                size='large'
                                onClick={this.post}
                                style={{ margin: "0 0 10px", width: 320 }}
                                loading={this.state.loading}>登录</Button>
                        <p style={{ fontSize : 12, lineHeight : 1.5, color: '#FFF', opacity: 0.6 }}>忘记密码请按RESET键1秒复位，重新设置路由器 <br/>或通过APP找回密码，无需重新设置路由器 </p>
                    </div>
                    <div className="qr">
                        <img src="QRcode.png"></img>
                        <p>扫描二维码下载APP</p>
                    </div>
                </div>
                
        ];
    }
}

export default Login;

