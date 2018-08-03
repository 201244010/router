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
        this.setState({ password : e.target.value })
    }

    

    componentDidMount(){
        setTimeout(()=> {
            this.setState({ loading : false })
        }, 2000)
    }

    enter(){
    }

    post(){
        common.fetcher('http://www.fdax.com', {})();
    }

    render(){
        return (
            <div className="ui-center ui-fullscreen">
                <h1>欢迎使用商米路由器</h1>
                    <Input  placeholder="管理密码" 
                            style={{ width : 265, marginTop : 20 }} 
                            value={this.state.password} 
                            onChange={this.onChange.bind(this)} />
                    <Button type="primary" 
                            onClick={this.post.bind(this)}
                            style={{ margin : "20px 0 10px", width : 265 }}
                            loading={this.state.loading}>登录</Button>
                    <p className="ui-tips">忘记密码请按RESET键1秒复位，重新设置路由器</p>
            </div>
        );
    }
}

export default hot(module)(Login);

// export default common.withHot(Login);
