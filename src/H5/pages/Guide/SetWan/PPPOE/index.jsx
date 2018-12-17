import React from 'react';
import { Base64 } from 'js-base64';
import GuideHeader from 'h5/components/GuideHeader';
import Form from 'h5/components/Form';
import Button from 'h5/components/Button';
import Link from 'h5/components/Link';
import { checkStr } from '~/assets/common/check';
import { detect } from './wan';

export default class PPPoE extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        account: '',
        accountTip: '',
        pwd: '',
        pwdTip: '',
        loading: false,
    }

    onChange = (name, value) => {
        const type = {
            account: {
                func: checkStr(value, { who:'账号', min: 1, max: 64, type: 'all' })
            },
            pwd: {
                func: checkStr(value, { who: '密码', min: 1, max: 32, type: 'english' })
            }
        }

        const tip = type[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        });
    }

    submit = async () => {    
        const { account, pwd } = this.state;
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
        if(0 === errcode) {
            let online = detect ();
            if(false === online) {
                this.setState({loading: false});
                // 实力代码：confirm
                confirm({
                    title: '无法连接网络',
                    content: '请检查您的网线是否插好',
                    cancelText: '重新检测',
                    okText: '继续设置',
                    onOk: this.onOk,
                    onCancel: this.onCancel,
                });
            }
        }
        message.error(`参数不合法[${errcode}]`);
        this.setState({loading : false});
    }

    checkDisabled(state){
        const disabled = [ 'account', 'pwd' ].some(item => {
            return (state[item] === '' || state[item + 'Tip'] !== '');
        })
        return disabled;
    }

    changeType = () => {

    }

    render() {
        const { account, accountTip, pwd, pwdTip, loading } = this.state;
        const disabled = this.checkDisabled(this.state);
        return (
            <div>
                <GuideHeader title='宽带拨号上网（PPPOE）' tips='这是说明文字这是说明文字这是说明文字' />
                <form>
                    <Form
                        value={account}
                        onChange={value => this.onChange('account', value)}
                        tip={accountTip}
                        placeholder='请输入账号'
                        maxLength={64}
                    />
                    <Form
                        type='password'
                        value={pwd}
                        onChange={value => this.onChange('pwd', value)}
                        tip={pwdTip}
                        placeholder='请输入密码'
                        maxLength={32}
                    />
                    <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>下一步</Button>
                    <div className='bottom-link'>
                        <Link onClick={this.changeType}>切换上网方式</Link>
                    </div>
                </form>
            </div>
        );
    }
}