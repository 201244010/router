
import React from 'react';
import Form from '~/components/Form';
import {Button} from 'antd';
import routes from '../../routes';
import {checkStr} from '~/assets/common/check';

const { FormItem, ErrorTip, Input }  = Form;


export default class SetPassword extends React.Component {
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
        const result = checkStr(value,{who:'密码',min: 6,max: 32,characterSetType: 'english'});
        const { tip} = result;
        this.setState({
            tip : tip,
            disabled : tip === ''? false : true,
        });   
    };

    componentWillUnmount(){
        this.stop = true;
    }

    // 表单提交
    post = async () => {
        let password = this.state.password;

        this.setState({ loading : true });
        const response = await common.fetchApi(
            [{
                opcode: 'ACCOUNT_INITIAL_PASSWORD',
                data: { account : { password : btoa(password), user : 'admin' } }
            }],
            {}, 
            { loop : 10, stop : () => this.stop, interval : 2000, handleError : true }
        ).catch(ex => { console.error(ex) })

        this.setState({ loading : false });
        let { errcode, message } = response;
        if(errcode == 0){
            this.props.history.push(routes.guideSetWan);
            return;
        }
        this.setState({ tip : message == "ERRCODE_PERMISSION" ? "已设置过密码" : message});
    }

    // 监听输入实时改变
    onPassportChange = value => {
        const result = checkStr(value,{who:'密码',min: 6,max: 32,characterSetType: 'english'});
        const { tip} = result;
        this.setState({
            password : value,
            tip : tip,
            disabled : tip === ''? false : true,
        });
    }

    // 回车提交数据
    onEnter = ()=>{
        if(this.state.disabled){
            return false;
        }
        this.post();
    }
    
    render(){
        const { match } = this.props;
        const { tip, disabled, loading } = this.state;
        return (
            <div className="setpassword"> 
                <h2>设置管理员密码</h2> 
                <p className="ui-tips guide-tip">管理员密码是进入路由器管理页面的凭证 </p>
                <Form style={{margin : '24px auto'}}>
                    <FormItem label="设置密码" style={{ marginBottom : 32 }} showErrorTip={tip}>
                        <Input placeholder="请设置密码" onChange = {this.onPassportChange} onBlur={ this.onPassportBlur } onEnter={this.onEnter} maxLength='32'/>
                        <ErrorTip>{tip}</ErrorTip> 
                    </FormItem>
                    <FormItem label="#">
                        <Button disabled={disabled} loading={loading} style={{ width : "100%" }} onClick={this.post} size="large" type="primary">下一步</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
};




