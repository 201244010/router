import React from 'react';
import { Button, Icon } from 'antd';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
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
        disabled : true
    };

    onChange = value => {
        this.setState({ 
            password: value,
            disabled : value.trim().length < 6
        })
    }

    onKeyUp = e => {
        this.setState({ tip : '' });
    }

    componentDidMount() { }

    enter() {}

    flush = () => {
        this.passwordInput.focus();
        this.setState({ password: '' });
    }

    post = async () => {
        const password = this.state.password;

        // if(!password.trim().length){
        //     return this.setState({ tip : '密码不能为空' });
        // }
        this.setState({ loading : true });
        const response = await common.fetchWithCode('ACCOUNT_LOGIN', {
            method : 'POST', 
            data : { account : { password : btoa(password), user : 'admin' }}
        });
        const { errcode, message } = response;
        this.setState({ loading : false });
        if(errcode == 0){
            this.props.history.push('/');
            return;
        }
        this.setState({ tip : message === 'ERRCODE_PARAMS_INVALID' ? "密码错误" : message });
    }

    render() {
        // const password = this.state.password.trim();
        const {tip, disabled} = this.state;
        // const suffix = password.length ? <Icon type="close-circle" onClick={this.flush} /> : null;
        return [
            <div key='login-content' className="ui-center ui-fullscreen">
                    <div className="form-box" style={{ textAlign : 'center' }}>
                        <CustomIcon type="logo" size={90} color="#fff" />
                        <Form style={{ width : 320, padding: 0 }} >
                            <FormItem showErrorTip={tip} style={{ marginBottom : 30 }}>
                                <Input placeholder="管理密码"
                                        type="password"
                                        //style={{ width: 265 }}
                                        value={this.state.password}
                                        //ref={node => this.passwordInput = node}
                                        //suffix={suffix}
                                        //onKeyUp={this.onKeyUp}
                                        onChange={this.onChange} 
                                        />
                                <ErrorTip>{ tip }</ErrorTip>
                            </FormItem>
                        </Form>
                        <Button type="primary"
                                onClick={this.post}
                                disabled={disabled}
                                style={{ margin: "0 0 10px", width: 320 }}
                                loading={this.state.loading}>登录</Button>
                        <p style={{ fontSize : 12, lineHeight : 1.5 }}>忘记密码请按RESET键1秒复位，重新设置路由器 <br/>或通过APP找回密码，无需重新设置路由器 </p>
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

