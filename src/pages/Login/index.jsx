import React from 'react';
import { Button, Icon } from 'antd';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import { clear } from '~/assets/common/cookie';
import { Base64 } from 'js-base64';
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

    onEnter = () => {
        this.post();
    }

    componentWillMount() {
        // 删除认证cookie
        clear();
    }

    post = async () => {
        const password = this.state.password;
        this.setState({ loading : true });
        const response = await common.fetchApi(
            [{ 
                opcode: 'ACCOUNT_LOGIN',
                data: { account : { password : Base64.encode(password), user : 'admin' }}
            }]
        );
        const { errcode } = response;
        this.setState({ loading : false });
        if(errcode == 0){
            this.props.history.push('/');
            return;
        }
        if(errcode == '-1605'){
            this.setState({tip : "密码错误"});
        }else if(errcode == '-1606'){
            this.setState({tip : '密码错误次数过多，请5分钟后再试'});
        }else if(errcode == '-1604'){
            this.setState({tip : '未设置过密码'});
        }else{
            this.setState({tip : errcode});
        }   
    }

    render() {
        const {tip} = this.state;
        return [
            <div key='login-content' className="ui-center ui-fullscreen">
                    <div className="form-box" style={{ textAlign : 'center' }}>
                        <CustomIcon type="logo" size={90} color="#fff" />
                        <Form style={{ width : 320, padding: 0 }} >
                            <FormItem style={{ margin: '45px auto 30px' }}>
                                <Input placeholder="请输入您的管理密码"
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
                        <p style={{ fontSize : 12, lineHeight : 1.5, color: '#FFF', opacity: 0.6 }}>忘记密码请按RESET键5秒复位，重新设置路由器</p>
                    </div>
                    <div className="qr">
                        <img src={require('~/assets/images/qr.png')} />
                        <p>扫描二维码下载APP</p>
                    </div>
                </div>
        ];
    }
}

export default Login;

