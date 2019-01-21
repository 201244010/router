import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Form from 'h5/components/Form';
import confirm from 'h5/components/confirm';
import {checkStr} from '~/assets/common/check';
import { init } from '~/assets/common/auth';

const MODULE = 'setpwd';

export default class SetPwd extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        pwd: '',
        pwdTip: '',
        surePwd: '',
        surePwdTip: '',
        loading: false
    };

    onOk = () =>{
        this.props.history.push('/');
    }

    // 表单提交
    post = async () => {
        const {pwd, surePwd} = this.state;

        if (pwd !== surePwd && surePwd !== '') {
            this.setState({
                surePwdTip: intl.get(MODULE, 0)
            });
            return;
        }

        if (pwd !== surePwd && surePwd === '') {
            this.setState({
                surePwdTip: intl.get(MODULE, 1)
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
            this.props.history.push('/guide/setwan/detect');
            break;
        case '-1608':
            confirm({
                    content: intl.get(MODULE, 2),
                    cancelText: intl.get(MODULE, 3),
                    okText: intl.get(MODULE, 4),
                    onOk: this.onOk
                });
            break;
        default:
            this.setState({pwdTip: intl.get(MODULE, 5, {error: errcode})});
            break;
        }
    }

    // 监听输入实时改变
    onChange = (name, value) => {
        const type = {
            pwd: {
                func: checkStr,
                agr: { who: intl.get(MODULE, 6), min: 6, max: 32, type: 'english' }
            },
            surePwd: {
                func: () => {
                    return '';
                }
            }
        }

        this.setState({surePwdTip : ''});  //surePwdTip清空
        let tip = type[name].func(value,type[name].agr);
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        });
    }

    render() {
        const { pwd, pwdTip, surePwd, surePwdTip, loading }  = this.state;
        const disabled = '' !== pwdTip || '' !== surePwdTip || pwd === '';

        return (
            <div>
                <GuideHeader title={intl.get(MODULE, 7)} tips={intl.get(MODULE, 8)} />
                <form>
                    <Form
                        value={pwd}
                        type='password'
                        placeholder={intl.get(MODULE, 9)}
                        maxLength={32}
                        tip={pwdTip}
                        onChange={value => this.onChange('pwd', value)}
                    />
                    <Form
                        value={surePwd}
                        type='password'
                        placeholder={intl.get(MODULE, 10)}
                        tip={surePwdTip}
                        onChange={value => this.onChange('surePwd', value)}
                    />
                    <Button type='primary' loading={loading} onClick={this.post} disabled={disabled}>{intl.get(MODULE, 11)}</Button>
                </form>
            </div>
        )
    }
}