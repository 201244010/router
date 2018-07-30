import React from 'react';
import { hot } from 'react-hot-loader';
import { Input, Button } from 'antd';


class Login extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        password : '',
        loading : true
    };

    onChange(e){
        this.setState({
            password : e.target.value
        })
    }

    componentDidMount(){
        setTimeout(()=> {
            this.setState({ loading : false })
        }, 2000)
    }

    render(){
        return (
            <div className="ui-center ui-fullscreen">
                <h1>欢迎使用商米路由器</h1>
                {/* <div style={{ width : 300 }}> */}
                    <Input  placeholder="管理密码" 
                            style={{ width : 265 }} 
                            value={this.state.password} 
                            onChange={this.onChange.bind(this)} />
                    <Button type="primary" 
                            style={{ margin : "20px 0 10px", width : 265 }}
                            loading={this.state.loading} 
                            onClick={this.enterLoading}>登录</Button>
                    <p className="ui-tips">忘记密码请按RESET键1秒复位，重新设置路由器</p>
                {/* </div> */}
            </div>
        );
    }
}

export default hot(module)(Login);

// export default common.withHot(Login);
