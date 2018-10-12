
import React from 'react';
import { Button, Icon } from 'antd';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import "./welcome.scss";

const { FormItem, ErrorTip, Input }  = Form;

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
 
    state ={

    }

    post = async () => {
        const password = this.state.password;

        // if(!password.trim().length){
        //     return this.setState({ tip : '密码不能为空' });
        // }
        this.setState({ loading : true });
        const response = await common.fetchWithCode('ACCOUNT_LOGIN', {
            method : 'POST', 
            data : { account : { password : btoa(password), user : 'admin' }}
        });
        const { errcode, message } = response;
        this.setState({ loading : false });
        if(errcode == 0){
            this.props.history.push('/');
            return;
        }
        if(message === 'ERRCODE_PARAMS_INVALID'){
            this.setState({tip : "密码错误"});
        }else if(message === 'ERRCODE_PERMISSION'){
            this.setState({tip : '密码错误次数过多，请5分钟后再试'});
        }else{
            this.setState({tip : message});
        }    
    }

    render() {
        const {tip, disabled} = this.state;
        return (
            <div className='welcome-content' style={{border:'1px solid black'}}>
                <div style={{ textAlign : 'center' }}>
                    <CustomIcon type="logo" size={90} color="#fff" />
                    <Form style={{ width : 320, padding: 0 }} >
                        <FormItem showErrorTip={tip} style={{ marginBottom : 30 }}>
                            <Input placeholder="管理密码"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.onChange} 
                                    />
                            <ErrorTip>{ tip }</ErrorTip>
                            </FormItem>
                        </Form>
                        <Button type="primary"
                                size='large'
                                onClick={this.post}
                                disabled={disabled}
                                style={{ margin: "0 0 10px", width: 320 }}
                                loading={this.state.loading}>登录</Button>
                        <p style={{ fontSize : 12, lineHeight : 1.5 }}>忘记密码请按RESET键1秒复位，重新设置路由器 <br/>或通过APP找回密码，无需重新设置路由器 </p>
                    </div>
            </div>        
        );
    }
}


