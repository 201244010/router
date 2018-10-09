
import React from 'react';
import Form from '~/components/Form';
import {message,Button,Modal} from 'antd';

const {FormItem,Input} = Form;

export default class ChangePassword extends React.Component{

    state={
        userName : 'admin',
        oldPWD : '',
        newPWD : '',
<<<<<<< HEAD
<<<<<<< HEAD
        surePWD : '',
        disabled : true,
=======
        surePWD : ''
>>>>>>> 修改管理员密码发开基本完成
=======
        surePWD : '',
        disabled : true,
>>>>>>> 完善修改管理员密码功能、完成路由器重启
    }

    onChange = (name,value) =>{
        this.setState({
<<<<<<< HEAD
<<<<<<< HEAD
            [name] : value,  
        },()=>{this.setState({disabled : this.state.surePWD.trim().length<6})})
=======
            [name]:value
        })
>>>>>>> 修改管理员密码发开基本完成
=======
            [name] : value,  
        },()=>{this.setState({disabled : this.state.surePWD.trim().length<6})})
>>>>>>> 完善修改管理员密码功能、完成路由器重启
    }

    submit = async() =>{
        if(this.state.newPWD != this.state.surePWD){
            message.error('请保持两次输入新密码一致');
<<<<<<< HEAD
<<<<<<< HEAD
            this.setState({surePWD : '',disabled : true});
=======
            this.setState({surePWD : ''});
>>>>>>> 修改管理员密码发开基本完成
=======
            this.setState({surePWD : '',disabled : true});
>>>>>>> 完善修改管理员密码功能、完成路由器重启
            return ;
        }else{
            this.user= this.state.userName;
            this.oldpassword = btoa(this.state.oldPWD);
            this.password = btoa(this.state.newPWD);
<<<<<<< HEAD
<<<<<<< HEAD
            this.account={'user':this.user,'oldpassword':this.oldpassword,'password':this.password};
            let response = await common.fetchWithCode('ACCOUNT_MODIFY',{method : 'post', data : {account:this.account}}).catch(ex => {});
            let {errcode} = response;
            if(errcode == '0'){
                message.success('修改成功,5秒后将跳转到登陆页面',1,setTimeout(()=>{location.href = '/login'}),5000);    
            }
            
            Modal.error({title : '修改失败',content : '旧密码错误'});
=======
            this.account={'user':this.user,'oldpassword':this.oldpassword,'password':this.password}
            console.log(this.account);
=======
            this.account={'user':this.user,'oldpassword':this.oldpassword,'password':this.password};
>>>>>>> 完善修改管理员密码功能、完成路由器重启
            let response = await common.fetchWithCode('ACCOUNT_MODIFY',{method : 'post', data : {account:this.account}}).catch(ex => {});
            let {errcode} = response;
            if(errcode == '0'){
                message.success('修改成功,3秒后将跳转到登陆页面',1,setTimeout(3000,()=>{location.href = '/login'}));    
            }
<<<<<<< HEAD
            Modal.error({title : '修改失败',content : ''});
>>>>>>> 修改管理员密码发开基本完成
=======
            
            Modal.error({title : '修改失败',content : '旧密码错误'});
>>>>>>> 完善修改管理员密码功能、完成路由器重启
        }
    }

    render(){
<<<<<<< HEAD
<<<<<<< HEAD
        const {oldPWD,newPWD,surePWD,disabled} = this.state;
=======
        const {oldPWD,newPWD,surePWD} = this.state;
>>>>>>> 修改管理员密码发开基本完成
=======
        const {oldPWD,newPWD,surePWD,disabled} = this.state;
>>>>>>> 完善修改管理员密码功能、完成路由器重启
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
<<<<<<< HEAD
<<<<<<< HEAD
                        <Button disabled={disabled} className="weixin-auth-button" type="primary" onClick={this.submit}>保存</Button>
=======
                        <Button className="weixin-auth-button" type="primary" onClick={this.submit}>保存</Button>
>>>>>>> 修改管理员密码发开基本完成
=======
                        <Button disabled={disabled} className="weixin-auth-button" type="primary" onClick={this.submit}>保存</Button>
>>>>>>> 完善修改管理员密码功能、完成路由器重启
                    </section>
                </Form>
            </div>
        );
    }
}