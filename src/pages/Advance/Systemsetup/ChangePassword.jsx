
import React from 'react';
import { Base64 } from 'js-base64';
import Form from '~/components/Form';
import { message, Button } from 'antd';
import {checkStr} from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';

const MODULE = 'changepassword';
const {FormItem,Input,ErrorTip} = Form;

export default class ChangePassword extends React.Component{
    constructor(props) {
        super(props);
        this.err = {
            '-1605': intl.get(MODULE, 0)/*_i18n:原密码错误*/,
            '-1606': intl.get(MODULE, 1)/*_i18n:原密码错误次数过多，请5分钟后再试*/,
        };
    }
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
                func: checkStr(value, { who: intl.get(MODULE, 2)/*_i18n:新密码*/, min: 6,max:  32, type: 'english'}),
            },
            oldPWD: {
                func: '',
            },
            surePWD: {
                func: '',
            }
        };

        this.setState({surePWDTip : ''});  //surePWDTip清空
        let tip = field[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        });
    }

    submit = async() =>{
        if(this.state.newPWD != this.state.surePWD){
            this.setState({
                // surePWDTip: '两次密码不一致'
                surePWDTip: intl.get(MODULE, 3)/*_i18n:两次密码不一致*/,
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
                    // message.success('修改成功,5秒后将跳转到登陆页面');
                    message.success(intl.get(MODULE, 4)/*_i18n:修改成功,5秒后将跳转到登陆页面*/);
                    setTimeout(()=>{location.href = '/login'}, 5000);
                }else{
                    message.error(`${this.err[errcode]}`);
                    this.setState({loading : false});
                }
            });  
        }    
    }

    render(){
        const { oldPWD, newPWD, surePWD, loading, surePWDTip, oldPWDTip, newPWDTip } = this.state;
        const disabled = surePWD === '' || oldPWD === '' || oldPWDTip !==''|| newPWDTip !== '' || surePWDTip !== '';

        return (
            <SubLayout className="settings">
            <div>
                <Form style={{width:'100%',margin:0,paddingLeft:0}}>
                    <div style={{paddingLeft:60,marginTop:30,marginBottom:124}}>
                        <label style={{marginBottom: 6,display: 'block',lineHeight:'22px'}}>{intl.get(MODULE, 5)/*_i18n:原密码*/}</label>                       
                        <FormItem type="small" showErrorTip={oldPWDTip} style={{ width : 320}}>    
                            <Input type="password" placeholder={intl.get(MODULE, 6)/*_i18n:请输入原密码*/} value={oldPWD} onChange={(value)=>this.onChange('oldPWD',value)} />
                            <ErrorTip>{oldPWDTip}</ErrorTip>
                        </FormItem> 
                        <label style={{marginBottom: 6,display: 'block',lineHeight:'22px'}}>{intl.get(MODULE, 7)/*_i18n:新密码*/}</label>                      
                        <FormItem type="small" showErrorTip={newPWDTip} style={{ width : 320}}>    
                            <Input type="password" maxLength={32} placeholder={intl.get(MODULE, 8)/*_i18n:请输入新密码*/} value={newPWD} onChange={(value)=>this.onChange('newPWD',value)} />
                            <ErrorTip>{newPWDTip}</ErrorTip>
                        </FormItem>
                        <label style={{marginBottom: 6,display: 'block',lineHeight:'22px'}}>{intl.get(MODULE, 9)/*_i18n:确认新密码*/}</label>  
                        <FormItem type="small" showErrorTip={surePWDTip} style={{ width : 320}}> 
                            <Input type="password" placeholder={intl.get(MODULE, 10)/*_i18n:请确认新密码*/} value={surePWD} onChange={(value)=>this.onChange('surePWD',value)} />
                            <ErrorTip>{surePWDTip}</ErrorTip>
                        </FormItem>
                    </div>
                </Form>
                <section className="save">
                    <Button loading={loading} disabled={disabled} size='large' style={{ width: 200, height: 42 }} type="primary" 
                    onClick={this.submit}>{intl.get(MODULE, 11)/*_i18n:保存*/}</Button>
                </section>
            </div>
            </SubLayout>
        );
    }
}