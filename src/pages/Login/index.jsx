import React from 'react';
import { hot } from 'react-hot-loader';
import { Input, Button, Icon } from 'antd';
import Form from '~/components/Form';
import axios from 'axios';

const { FormItem, ErrorTip }  = Form;

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        password: '',
        tip : '',
        loading: false
    };

    onChange = e => {
        this.setState({ password: e.target.value })
    }

    onKeyUp = e => {
        this.setState({ tip : '' });
    }

    componentDidMount() {
        console.log(common.fetcher);
    }

    enter() {}

    flush = () => {
        this.passwordInput.focus();
        this.setState({ password: '' });
    }

    post = async () => {
        const password = this.state.password;

        if(!password.trim().length){
            return this.setState({ tip : '密码不能为空' });
        }
        this.setState({ loading : true });
        const {data} = await common.fetch('http://localhost:3000/login', {method : 'POST', data : { password : btoa(password) }});
        this.setState({ loading : false });
        if(data.errcode == 0){
            alert('登录成功');
            return;
        }
        this.setState({ tip : data.message });

    }

    render() {
        const password = this.state.password.trim();
        const tip = this.state.tip;
        const suffix = password.length ? <Icon type="close-circle" onClick={this.flush} /> : null;

        return (
            <div className="ui-center ui-fullscreen">
                <div className="form-box" style={{ textAlign : 'center' }}>
                    <p className="ui-title">欢迎使用商米路由器</p>
                    <Form style={{ width : 265, margin : 'auto' }} >
                        <FormItem showErrorTip={tip} >
                            <Input placeholder="管理密码"
                                    type="password"
                                    style={{ width: 265 }}
                                    value={this.state.password}
                                    ref={node => this.passwordInput = node}
                                    suffix={suffix}
                                    onKeyUp={this.onKeyUp}
                                    onChange={this.onChange} />
                            <ErrorTip>{ tip }</ErrorTip>
                        </FormItem>
                    </Form>
                    <Button type="primary"
                            onClick={this.post}
                            style={{ margin: "0 0 10px", width: 265 }}
                            loading={this.state.loading}>登录</Button>
                    <p className="ui-tips">忘记密码请按RESET键1秒复位，重新设置路由器</p>
                </div>
            </div>
        );
    }
}

export default hot(module)(Login);

// export default common.withHot(Login);
