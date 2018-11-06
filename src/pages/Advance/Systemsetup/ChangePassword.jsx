
import React from 'react';
import Form from '~/components/Form';
import { message, Button } from 'antd';
import {checkStr} from '~/assets/common/check';

const {FormItem,Input,ErrorTip} = Form;

export default class ChangePassword extends React.Component{

    state={
        userName : 'admin',
        oldPWD: '',
        newPWD: '',
        surePWD: '',
        loading: false,
        disabled: true,
        surePWDTip: '',
        oldPWDTip: '',
        newPWDTip: '',
    }

    onChange = (name,value) =>{
        const field = {
            newPWD: {
                func: checkStr(value, { who: '新密码', min: 6,max:  32, type: 'english'}),
            },
            oldPWD: {
                func: checkStr(value, { who: '原密码', min: 1,max:  32, type: 'english'}),
            },
            surePWD: {
                func: '',
            }
        };
        let tip = field[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        },() =>{
            const { oldPWDTip, newPWD, newPWDTip, surePWD, surePWDTip } = this.state;
            this.setState({
            disabled : (surePWD.trim().length<6 || newPWD.trim().length<6 || oldPWDTip !=='' || newPWDTip !== '' || surePWDTip !== '')
        })});
    }

    submit = async() =>{
        if(this.state.newPWD != this.state.surePWD){
            this.setState({surePWD : '',disabled : true,surePWDTip : '请保持两次输入新密码一致'});
            return ;
        }else{
            this.setState({loading : true});
            this.user= this.state.userName;
            this.oldpassword = btoa(this.state.oldPWD);
            this.password = btoa(this.state.newPWD);
            this.account={'user':this.user,'oldpassword':this.oldpassword,'password':this.password};
            common.fetchApi({
                opcode: 'ACCOUNT_MODIFY',
                data: { account: this.account }
            }).then((resp)=>{
                let { errcode } = resp; 
                if(errcode == '0'){
                    message.success('修改成功,5秒后将跳转到登陆页面');
                    setTimeout(()=>{location.href = '/login'}, 5000);
                }else{
                    message.error(`原密码错误`);
                    this.setState({loading : false});
                }
            });  
        }    
    }

    render(){
        const { oldPWD, newPWD, surePWD, loading, disabled, surePWDTip, oldPWDTip, newPWDTip } = this.state;
        return (
            <div>
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div style={{paddingLeft:60,marginTop:30,marginBottom:100}}>
                        <label>原密码</label>
                        <FormItem type="small" showErrorTip={oldPWDTip} style={{ width : 320}}>
                            <Input type="password" placeholder={'请输入原密码'} value={oldPWD} onChange={(value)=>this.onChange('oldPWD',value)} />
                            <ErrorTip>{oldPWDTip}</ErrorTip>
                        </FormItem>
                        <label>新密码</label>
                        <FormItem type="small" showErrorTip={newPWDTip} style={{ width : 320}}>
                            <Input type="password" maxLength={32} placeholder={'请输入新密码'} value={newPWD} onChange={(value)=>this.onChange('newPWD',value)} />
                            <ErrorTip>{newPWDTip}</ErrorTip>
                        </FormItem>
                        <label>确认新密码</label>
                        <FormItem type="small" showErrorTip={surePWDTip} style={{ width : 320}}>
                            <Input type="password" placeholder={'请确认新密码'} value={surePWD} onChange={(value)=>this.onChange('surePWD',value)} />
                            <ErrorTip>{surePWDTip}</ErrorTip>
                        </FormItem>
                    </div>
                    <section className="weixin-auth-save">
                        <Button loading={loading} disabled={disabled} className="weixin-auth-button" type="primary" onClick={this.submit}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
}