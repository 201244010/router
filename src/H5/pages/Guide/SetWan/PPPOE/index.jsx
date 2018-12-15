import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';
import {checkStr} from '~/assets/common/check';

export default class PPPOE extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        account: '',
        accountTip: '',
        pwd: '',
        pwdTip: '',
        loading: false,
        disabled: true
    }

    onChange = (name, value) => {
        const type = {
            account: {
                func: checkStr(value, { who:'账号', min: 1, max: 64, type: 'all' })
            },
            pwd:{
                func: checkStr(value, { who: '密码', min: 1, max: 32, type: 'english' })
            }
        }

        const tip = type[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        }, () => {
            const disabled = [ 'account', 'pwd' ].some(item => {
                return (this.state[item] === '' || this.state[item + 'Tip'] !== '');
            })
            this.setState({ disabled: disabled });
        });
    }

    submit = async () => {
        this.setState({ loading : true });
        let response = await common.fetchApi(
                {
                    opcode: 'NETWORK_WAN_IPV4_SET',
                    data:{
                        wan:{
                            dial_type: 'pppoe',
                            dns_type: 'auto',
                            user_info: {
                                username: Base64.encode(account),
                                password: Base64.encode(pwd)
                            }
                        }
                    }
                }
            
        );
        let { errcode } = response;
        if(errcode == 0){
            // 触发检测联网状态
            common.fetchApi(
                [
                    {opcode: 'WANWIDGET_ONLINETEST_START'}
                ]
            ).then( async() =>{
                // 获取联网状态
                let connectStatus = await common.fetchApi(
                    [
                        {opcode: 'WANWIDGET_ONLINETEST_GET'}
                    ],
                    {},
                    {
                        loop : true,
                        interval : 3000, 
                        stop : ()=> this.stop, 
                        pending : resp => resp.data[0].result.onlinetest.status !== 'ok'
                    }
                );
                let { errcode, data } = connectStatus;
                this.setState({ loading : false });
                if(errcode == 0){
                    let online = data[0].result.onlinetest.online;
                    this.setState({
                        showNetWorkStatus : true,
                        online :online
                    });
                    if(online){
                        setTimeout(() => { this.props.history.push("/guide/speed") }, 3000);
                    }
                    return;
                }
            });  
        }else{
            message.error(`参数不合法[${errcode}]`);
            this.setState({loading : false});
        }   
    }

    changeType = () => {

    }

    render() {
        const { account, accountTip, pwd, pwdTip, loading, disabled } = this.state;

        return (
            <div>
                <GuideHeader title='宽带拨号上网（PPPOE）' tips='这是说明文字这是说明文字这是说明文字' />
                <Form 
                    value={account}
                    onChange={value => this.onChange('account', value)}
                    tip={accountTip}
                    placeholder='请输入账号'
                    maxLength={64} />
                <Form 
                    value={pwd}
                    onChange={value => this.onChange('pwd', value)}
                    tip={pwdTip}
                    placeholder='请输入密码'
                    maxLength={32} />
                <div style={{ textAlign: "center"}}>
                    <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>下一步</Button>
                    <a href='javascript:;' onClick={this.changeType}>切换上网方式</a>
                </div>
            </div>
        );
    }
}