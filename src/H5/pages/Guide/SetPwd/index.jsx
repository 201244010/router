import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Input from 'h5/components/Input';
import confirm from 'h5/components/confirm';
import {checkStr} from '~/assets/common/check';
import { init } from '~/assets/common/auth';

const MODULE = 'h5setpwd';

export default class SetPwd extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        pwd: '',
        pwdTip: '',
        // surePwd: '',
        // surePwdTip: '',
        loading: false
    };

    onOk = () =>{
        this.props.history.push('/');
    }

    // 表单提交
    post = async () => {
        const {pwd} = this.state;

        // if (pwd !== surePwd && surePwd !== '') {
        //     this.setState({
        //         surePwdTip: intl.get(MODULE, 0)/*_i18n:两次密码输入不一致*/
        //     });
        //     return;
        // }

        // if (pwd !== surePwd && surePwd === '') {
        //     this.setState({
        //         surePwdTip: intl.get(MODULE, 1)/*_i18n:请再次输入密码*/
        //     });
        //     return;
        // }

        this.setState({ loading: true });
        const response = await common.fetchApi({
            opcode: 'ACCOUNT_INITIAL_PASSWORD',
            data: { account: { password: Base64.encode(pwd), user: 'admin' } }
        });
        this.setState({ loading: false });

        let { errcode, data } = response;
        switch (errcode) {
        case 0:
            init(data[0].result.account.token);
            this.props.history.push('/guide/setwan/detect');
            break;
        case '-1608':
            confirm({
                    content: intl.get(MODULE, 2)/*_i18n:已设置过密码*/,
                    cancelText: intl.get(MODULE, 3)/*_i18n:取消*/,
                    okText: intl.get(MODULE, 4)/*_i18n:确定*/,
                    onOk: this.onOk
                });
            break;
        default:
            this.setState({pwdTip: intl.get(MODULE, 5, {error: errcode})/*_i18n:未知错误[{error}]*/});
            break;
        }
    }

    // 监听输入实时改变
    onChange = (name, value) => {
        const type = {
            pwd: {
                func: checkStr,
                agr: { who: intl.get(MODULE, 6)/*_i18n:密码*/, min: 6, max: 32, type: 'english' }
            },
            // surePwd: {
            //     func: () => {
            //         return '';
            //     }
            // }
        }

        // this.setState({surePwdTip : ''});  //surePwdTip清空
        let tip = type[name].func(value,type[name].agr);
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        });
    }

    render() {
        const { pwd, pwdTip, loading }  = this.state;
        const disabled = '' !== pwdTip || pwd === '';

        return ([
            <div className='guide-upper'>
                <GuideHeader title={intl.get(MODULE, 7)/*_i18n:设置管理密码*/} tips={intl.get(MODULE, 8)/*_i18n:管理员密码是进入路由器管理页面的凭证*/} />
                <form>
                    <Input
                        inputName="密码"
                        value={pwd}
                        type='password'
                        placeholder={intl.get(MODULE, 9)/*_i18n:密码长度6～32位*/}
                        maxLength={32}
                        tip={pwdTip}
                        onChange={value => this.onChange('pwd', value)}
                        style={{marginTop: '1.28rem'}}
                    />
                    {/* <Form
                        value={surePwd}
                        type='password'
                        placeholder={intl.get(MODULE, 10)}
                        tip={surePwdTip}
                        onChange={value => this.onChange('surePwd', value)}
                    /> */}
                    
                </form>
            </div>,
            <Button type='primary' loading={loading} style={{marginTop: '8.52rem'}} onClick={this.post} disabled={disabled}>{intl.get(MODULE, 11)/*_i18n:下一步*/}</Button>
        ])
    }
}