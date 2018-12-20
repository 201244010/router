
import React from 'react';
import { Base64 } from 'js-base64';
import Form from '~/components/Form';
import { message, Button } from 'antd';
import {checkStr} from '~/assets/common/check';

const {FormItem,Input,ErrorTip} = Form;
const err = {
    '-1601': '原密码不能为空',
    '-1605': '原密码错误',
    '-1606': '原密码错误次数过多，请5分钟后再试'
};

export default class ChangePassword extends React.Component{

    state={
        userName : 'admin',
        oldPWD: '',
        newPWD: '',
        surePWD: '',
        loading: false,
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
                func: '',
            },
            surePWD: {
                func: '',
            }
        };
        let tip = field[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        });
    }

    submit = async() =>{
        if(this.state.newPWD != this.state.surePWD){
            this.setState({
                surePWD: '',
                surePWDTip: '两次密码不一致'
            });
            return ;
        }else{
            this.setState({loading : true});
            this.user= this.state.userName;
            this.oldpassword = Base64.encode(this.state.oldPWD);
            this.password = Base64.encode(this.state.newPWD);
            this.account={'user':this.user,'oldpassword':this.oldpassword,'password':this.password};
            common.fetchApi({
                opcode: 'ACCOUNT_MODIFY',
                data: { account: this.account }
            }).then((resp)=>{
                let { errcode } = resp; 
                if(errcode === 0){
                    message.success('修改成功,5秒后将跳转到登陆页面');
                    setTimeout(()=>{location.href = '/login'}, 5000);
                }else{
                    message.error(`${err[errcode]}`);
                    this.setState({loading : false});
                }
            });  
        }    
    }

    render(){
        const { oldPWD, newPWD, surePWD, loading, surePWDTip, oldPWDTip, newPWDTip } = this.state;
        const disabled = surePWD === '' || oldPWD === '' || oldPWDTip !==''|| newPWDTip !== '' || surePWDTip !== '';
        return (
            <div>
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div style={{paddingLeft:60,marginTop:30,marginBottom:124}}>
                        <label style={{marginBottom: 6,display: 'block',lineHeight:'22px'}}>原密码</label>                       
                        <FormItem type="small" showErrorTip={oldPWDTip} style={{ width : 320}}>    
                            <Input type="password" placeholder={'请输入原密码'} value={oldPWD} onChange={(value)=>this.onChange('oldPWD',value)} />
                            <ErrorTip>{oldPWDTip}</ErrorTip>
                        </FormItem> 
                        <label style={{marginBottom: 6,display: 'block',lineHeight:'22px'}}>新密码</label>                      
                        <FormItem type="small" showErrorTip={newPWDTip} style={{ width : 320}}>    
                            <Input type="password" maxLength={32} placeholder={'请输入新密码'} value={newPWD} onChange={(value)=>this.onChange('newPWD',value)} />
                            <ErrorTip>{newPWDTip}</ErrorTip>
                        </FormItem>
                        <label style={{marginBottom: 6,display: 'block',lineHeight:'22px'}}>确认新密码</label>  
                        <FormItem type="small" showErrorTip={surePWDTip} style={{ width : 320}}> 
                            <Input type="password" placeholder={'请确认新密码'} value={surePWD} onChange={(value)=>this.onChange('surePWD',value)} />
                            <ErrorTip>{surePWDTip}</ErrorTip>
                        </FormItem>
                    </div>
                </Form>
                <section className="save">
                    <Button loading={loading} disabled={disabled} size='large' style={{ width: 320 }} type="primary" 
                    onClick={this.submit}>保存</Button>
                </section>
            </div>
        );
    }
}