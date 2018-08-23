
import React from 'react';
import Form from '~/components/Form';
import {Button} from 'antd';
import routes from '../../routes';

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
        // else {
        //     this.setState({
        //         disabled : false
        //     });
        // }
    };


    // 表单提交
    post = async () => {
        const password = this.state.password;

        this.setState({ loading : true });
        const result = await common.fetchWithCode(
            'ACCOUNT_MODIFY', 
            { method : 'POST', data : { account : { password : btoa(password), username : 'admin' } } }, 
            { loop : 3, interval : 2000 }
        ).catch(ex => console.error('outer catch', ex))

        this.setState({ loading : false });
        const data = result.data;
        if(data.errcode == 0){
            this.props.history.push(routes.guideSetWan);
            return;
        }
        this.setState({ tip : data.message });
    }

    // 监听输入实时改变
    onPassportChange = value => {
        this.setState({
            password : value,
            tip : '',
            disabled : value.length < 6
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
            <div> 
                <h2>设置上网参数</h2> 
                <p className="ui-tips guide-tip">上网参数设置完成后，即可连接网络 </p>
                <Form style={{margin : '24px auto'}}>
                    <FormItem label="设置密码" style={{ marginBottom : 32 }} showErrorTip={tip}>
                        <Input placeholder="请设置密码" onChange = {this.onPassportChange} onBlur={ this.onPassportBlur } onEnter={this.onEnter} />
                        <ErrorTip>{tip}</ErrorTip> 
                    </FormItem>
                    {/* <FormItem style={{ paddingLeft : 71 }}>
                        <Button disabled={disabled} loading={loading} style={{ width : 260 }} onClick={this.post} size="large" type="primary">下一步</Button>
                    </FormItem> */}
                    <FormItem label="#">
                        <Button disabled={disabled} loading={loading} style={{ width : "100%" }} onClick={this.post} size="large" type="primary">下一步</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
};




