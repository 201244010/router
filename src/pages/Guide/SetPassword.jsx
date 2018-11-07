
import React from 'react';
import Form from '~/components/Form';
import { Button, Modal } from 'antd';
import { Base64 } from 'js-base64';
import routes from '../../routes';
import {checkStr} from '~/assets/common/check';

const { FormItem, ErrorTip, Input }  = Form;


export default class SetPassword extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        PWD: '',
        PWDTip: '',
        surePWD: '',
        surePWDTip: '',
        disabled: true,
        loading: false
    };

    componentWillUnmount(){
        this.stop = true;
    }

    // 表单提交
    post = async () => {
        this.setState({ loading : true });
        if(this.state.PWD !== this.state.surePWD){
            console.log('PWD',this.state.PWD,'surePWD',this.state.surePWD,this.state.PWD === this.state.surePWD);
            this.setState({
                surePWDTip: '两次密码不一致',
                loading: false
            });    
        }else{
            const password = this.state.PWD;
            const response = await common.fetchApi(
                [{
                    opcode: 'ACCOUNT_INITIAL_PASSWORD',
                    data: { account : { password : Base64.encode(password), user : 'admin' } }
                }],
                {}, 
                { loop : 10, stop : () => this.stop, interval : 3000, handleError : true }
            );
            this.setState({ loading : false });
            let { errcode } = response;
            if(errcode == 0){
                this.props.history.push(routes.guideSetWan);
                return;
            }
            if(errcode === "-1608"){
                Modal.info({
                    title: '提示',
                    content: '已设置过密码',
                    okText: '确定',
                    onOk() {
                        location.href = '/';
                    },
                });
            }
            this.setState({ PWDTip : errcode === "-1608" ? "" : errcode});
        }    
    }

    // 监听输入实时改变
    onChange = (name, value) => {
        const field = {
            PWD:{
                func: checkStr(value,{who:'密码',min: 6,max: 32,type: 'english'}),
            },
            surePWD:{
                func: ''
            }
        }; 
        const tip = field[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        },()=>{
            this.setState({
                disabled : this.state.PWDTip !== '' || this.state.surePWDTip !== '' || this.state.surePWD.length === 0,
            });
        });
    }
    
    render(){
        const { PWD, PWDTip, surePWD, surePWDTip, disabled, loading } = this.state;
        return (
            <div className="setpassword"> 
                <h2>设置管理密码</h2>
                <p className="ui-tips guide-tip">管理密码是进入路由器管理页面的凭证 </p>
                <Form style={{margin : '24px auto'}}>
                    <FormItem label="设置密码" style={{ marginBottom : 28 }} showErrorTip={PWDTip}>
                        <Input placeholder="请设置密码" value={PWD} onChange = {value => this.onChange('PWD',value)}    maxLength='32'/>
                        <ErrorTip>{PWDTip}</ErrorTip> 
                    </FormItem>
                    <FormItem label="确认密码" style={{ marginBottom : 32 }} showErrorTip={surePWDTip}>
                        <Input placeholder="请确认密码" value={surePWD} onChange = {value => this.onChange('surePWD',value)}  maxLength='32'/>
                        <ErrorTip>{surePWDTip}</ErrorTip> 
                    </FormItem>
                    <FormItem label="#">
                        <Button disabled={disabled} loading={loading} style={{ width : "100%" }} onClick={this.post} size="large" type="primary">下一步</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
};




