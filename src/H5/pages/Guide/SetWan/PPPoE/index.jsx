import React from 'react';
import { Base64 } from 'js-base64';
import toast from 'h5/components/toast';
import GuideHeader from 'h5/components/GuideHeader';
import Input from 'h5/components/Input';
import Button from 'h5/components/Button';
import Link from 'h5/components/Link';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/confirm';
import { checkStr } from '~/assets/common/check';
import { detect } from '../wan';

const MODULE = 'h5pppoe';

export default class PPPoE extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
        account: '',
        accountTip: '',
        pwd: '',
        pwdTip: '',
        loading: false,
    }

    onChange = (name, value) => {
        const type = {
            account: {
                func: checkStr(value, { who: intl.get(MODULE, 0)/*_i18n:账号*/, min: 1, max: 64, type: 'all' })
            },
            pwd: {
                func: checkStr(value, { who: intl.get(MODULE, 1)/*_i18n:密码*/, min: 1, max: 32, type: 'english' })
            }
        }

        const tip = type[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip
        });
    }

    nextStep = () => {
        this.props.history.push('/guide/setwifi');
    }

    submit = async () => {    
        const { account, pwd } = this.state;

        this.setState({
            loading: true
        });
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
        this.setState({
            loading: false
        });

        //检测联网状态
        let { errcode } = response;
        if(0 === errcode) {
            this.setState({
                visible: true
            })
            let online = await detect(this.props);
            this.setState({
                visible: false
            });

            if(false === online) {   //联网失败
                confirm({
                    title: intl.get(MODULE, 2)/*_i18n:无法连接网络*/,
                    content: intl.get(MODULE, 3)/*_i18n:检查您的上网方式是否正确*/,
                    cancelText: intl.get(MODULE, 4)/*_i18n:继续设置*/,
                    okText: intl.get(MODULE, 5)/*_i18n:重新设置*/,
                    onCancel: this.nextStep,
                });
            } else {
                this.nextStep();
            }
            return;
        }
        toast({tip: intl.get(MODULE, 6, {error: errcode})/*_i18n:参数非法[{error}]*/});
    }

    getNetInfo = async () => {
        let response = await common.fetchApi({ opcode: 'NETWORK_WAN_IPV4_GET' });
        let { data, errcode } = response;
        if(errcode == 0){
            this.userInfo = data[0].result.wan.pppoe.user_info;
            const { username, password } = this.userInfo;
            this.setState({
                account: Base64.decode(username),
                pwd: Base64.decode(password)
            });
        }
    }

    componentDidMount(){
        // 获取网络情况
        this.getNetInfo();
    }

    render() {
        const { visible, account, accountTip, pwd, pwdTip, loading } = this.state;

        //下一步按钮的致灰判定
        const disabled = [ account, pwd ].some(item => {return item === '' }) ||
                         [ accountTip, pwdTip ].some(item => { return item !== ''});

        return ([
            <div className='guide-upper'>
                <GuideHeader title={intl.get(MODULE, 7)/*_i18n:宽带拨号上网（PPPoE）*/} tips={intl.get(MODULE, 8)/*_i18n:请输入运营商提供的宽带账号和密码*/} />
                <Loading visible={visible} content={intl.get(MODULE, 9)/*_i18n:正在连网，请稍候...*/} />
                <div style={{marginTop: '1.28rem'}}>
                    <Input
                        inputName='账号'
                        value={account}
                        onChange={value => this.onChange('account', value)}
                        tip={accountTip}
                        placeholder={intl.get(MODULE, 10)/*_i18n:请输入账号*/}
                        maxLength={64}
                    />
                    <Input
                        inputName='密码'
                        type='password'
                        value={pwd}
                        onChange={value => this.onChange('pwd', value)}
                        tip={pwdTip}
                        placeholder={intl.get(MODULE, 11)/*_i18n:请输入密码*/}
                        maxLength={32}
                    />
                </div>
            </div>,
            <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>{intl.get(MODULE, 12)/*_i18n:下一步*/}</Button>
        ]);
    }
}