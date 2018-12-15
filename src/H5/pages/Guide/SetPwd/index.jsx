import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Form from 'h5/components/Form';
import Loading from 'h5/components/Loading';
import {checkStr} from '~/assets/common/check';

export default class SetPwd extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        pwd: '',
        pwdTip: '',
        surePwd: '',
        surePwdTip: '',
        loading: false,
        disabled: true
    };

    // 表单提交
    post = async () => {
        const {pwd, surePwd} = this.state;

        if (pwd !== surePwd) {
            this.setState({
                surePwdTip: '两次密码输入不一致'
            });
            return;
        }

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
            this.props.history.push('/guide/setwan');
            break;
        case '-1608':
            // Modal.info({
            //         title: '提示',
            //         content: '已设置过密码',
            //         okText: '确定',
            //         centered: true,
            //         onOk: () => {
            //             location.href = '/';
            //         }
            //     });
            // break;
        default:
            this.setState({ pwdTip: `未知错误[${errcode}]`});
            break;
        }
    }

    // 监听输入实时改变
    onChange = (name, value) => {
        let tip = checkStr(value, { who: '密码', min: 6, max: 32, type: 'english' });
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        }, () => {
            const { pwd, pwdTip, surePwd, surePwdTip } = this.state;
            this.setState({
                disabled: '' !== pwdTip || '' !== surePwdTip || '' === pwd || '' === surePwd
            });
        });
    }



    render() {
        const { pwd, pwdTip, surePwd, surePwdTip, loading, disabled }  = this.state;

        return (
            <div>
                <GuideHeader title='设置管理密码' tips='管理员密码是进入路由器管理页面的凭证' />
                <form>
                    <Form
                        value={pwd}
                        type='password'
                        placeholder='密码长度6～32位'
                        tip={pwdTip}
                        onChange={value => this.onChange('pwd', value)}
                    />
                    <Form
                        value={surePwd}
                        type='password'
                        placeholder='请再次输入密码'
                        tip={surePwdTip}
                        onChange={value => this.onChange('surePwd', value)}
                    />
                    <Button type='primary' loading={loading} onClick={this.post} disabled={disabled}>下一步</Button>
                </form>
                {/* <Loading visible={visible} content='正在检测上网方式，请稍后...' /> */}
            </div>
        )
    }
}