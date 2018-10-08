
import React from 'react';
import Form from '~/components/Form';
import {message,Button,Modal} from 'antd';

const {FormItem,Input} = Form;

export default class ChangePassword extends React.Component{

    state={
        userName : 'admin',
        oldPWD : '',
        newPWD : '',
        surePWD : ''
    }

    onChange = (name,value) =>{
        this.setState({
            [name]:value
        })
    }

    submit = async() =>{
        if(this.state.newPWD != this.state.surePWD){
            message.error('请保持两次输入新密码一致');
            this.setState({surePWD : ''});
            return ;
        }else{
            this.user= this.state.userName;
            this.oldpassword = btoa(this.state.oldPWD);
            this.password = btoa(this.state.newPWD);
            this.account={'user':this.user,'oldpassword':this.oldpassword,'password':this.password}
            console.log(this.account);
            let response = await common.fetchWithCode('ACCOUNT_MODIFY',{method : 'post', data : {account:this.account}}).catch(ex => {});
            let {errcode} = response;
            if(errcode == '0'){
                return;
            }
            Modal.error({title : '修改失败',content : ''});
        }
    }

    render(){
        const {oldPWD,newPWD,surePWD} = this.state;
        return (
            <div>
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div style={{paddingLeft:60,marginTop:30,marginBottom:100}}>
                        <label>输入旧密码</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" placeholder={'请输入旧密码'} value={oldPWD} onChange={(value)=>this.onChange('oldPWD',value)} />
                        </FormItem>
                        <label>设置新密码</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" placeholder={'请输入新密码'} value={newPWD} onChange={(value)=>this.onChange('newPWD',value)} />
                        </FormItem>
                        <label>确认新密码</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" placeholder={'请确认新密码'} value={surePWD} onChange={(value)=>this.onChange('surePWD',value)} />
                        </FormItem>
                    </div>
                    <section className="weixin-auth-save">
                        <Button className="weixin-auth-button" type="primary" onClick={this.submit}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
}