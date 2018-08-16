
import React from 'react';
import Form from '~/components/Form';
import {Button} from 'antd';

const { FormItem, ErrorTip, Input }  = Form;


export default class Steps extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        tip : '',
        password : '',
        disabled : true,
        loading : false
    };

    onPassportBlur = value => {
        if(value.length < 6){
            this.setState({
                tip : '请输入6位以上密码',
                disabled : true
            });
        }
        else {
            this.setState({
                disabled : false
            });
        }
    };


    // 表单提交
    post = async () => {
        const password = this.state.password;

        this.setState({ loading : true });
        const {data} = await common.fetchWithCode('ACCOUNT_LOGIN', {
            method : 'POST', 
            data : { account : { password : btoa(password), username : 'admin' }}
        });
        this.setState({ loading : false });
        if(data.errcode == 0){
            alert('登录成功');
            return;
        }
        this.setState({ tip : data.message });
    }

    // 监听输入实时改变
    onPassportChange = value => {
        this.setState({
            password : value,
            tip : ''
        });
    }
    
    render(){
        const { match } = this.props;
        const { tip, disabled, loading } = this.state;
        return (
            <div> 
                <h2>设置管理员密码</h2> 
                <p className="ui-tips">管理员密码是进入路由器管理页面的凭证 {match.params.id} </p>
                <Form style={{width : 340, margin : '24px auto'}}>
                    <FormItem label="设置密码" style={{ marginBottom : 32 }} showErrorTip={tip}>
                        <Input placeholder="请设置密码" onChange = {this.onPassportChange} onBlur={ this.onPassportBlur } />
                        <ErrorTip>{tip}</ErrorTip> 
                    </FormItem>
                    <FormItem style={{ paddingLeft : 71 }}>
                        <Button disabled={disabled} loading={loading} style={{ width : 260 }} onClick={this.post} size="large" type="primary">下一步</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
};




