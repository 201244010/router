
import React from 'react';
import Form from '~/components/Form';
import { Button, Modal } from 'antd';
import { Base64 } from 'js-base64';
import routes from '../../routes';
import { init } from '~/assets/common/auth';
import {checkStr} from '~/assets/common/check';

const MODULE = 'setpassword';
const { FormItem, ErrorTip, Input }  = Form;

export default class SetPassword extends React.Component {
    constructor(props){
        super(props);
    }

    state = {
        pwd: '',
        pwdTip: false,
        surePwd: '',
        surePwdTip: false,
        loading: false
    };

    // 表单提交
    post = async () => {
        const {pwd, surePwd} = this.state;

        if (pwd !== surePwd && surePwd !== '') {
            this.setState({
                // surePwdTip: '两次密码输入不一致',
                surePwdTip: intl.get(MODULE, 0),
            });
            return;
        }

        if (pwd !== surePwd && surePwd === '') {
            this.setState({
                // surePwdTip: '请再次输入密码',
                surePwdTip: intl.get(MODULE, 1),
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
            this.props.history.push(routes.guideSetWan);
            break;
        case '-1608':
            Modal.info({
                    // title: '提示',
                    // content: '已设置过密码',
                    // okText: '确定',
                    title: intl.get(MODULE, 2),
                    content: intl.get(MODULE, 3),
                    okText: intl.get(MODULE, 4),
                    centered: true,
                    onOk: () => {
                        location.href = '/';
                    }
                });
            break;
        default:
            // this.setState({pwdTip: `未知错误[${errcode}]`});
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

    render(){
        const { pwd, pwdTip, surePwd, surePwdTip, loading } = this.state;
        const disabled = '' !== pwdTip || '' !== surePwdTip || pwd === '';

        return (
            <div className="setpassword"> 
                <h2>{intl.get(MODULE, 7)}</h2>
                <p className="ui-tips guide-tip">{intl.get(MODULE, 8)}</p>
                <Form style={{margin : '24px auto', width:335}}>
                    <FormItem label={intl.get(MODULE, 9)} showErrorTip={pwdTip}>
                        <Input
                            placeholder={intl.get(MODULE, 10)}
                            value={pwd}
                            onChange = {value => this.onChange('pwd', value)}
                            maxLength={32} />
                        <ErrorTip>{pwdTip}</ErrorTip>
                    </FormItem>
                    <FormItem label={intl.get(MODULE, 11)} showErrorTip={surePwdTip}>
                        <Input
                            placeholder={intl.get(MODULE, 12)}
                            value={surePwd}
                            onChange = {value => this.onChange('surePwd', value)} />
                        <ErrorTip>{surePwdTip}</ErrorTip>
                    </FormItem>
                    <FormItem label="#">
                        <Button
                            disabled={disabled}
                            loading={loading}
                            style={{ width : '100%',height: 42 }}
                            onClick={this.post}
                            size="large"
                            type="primary">{intl.get(MODULE, 13)}</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
};
