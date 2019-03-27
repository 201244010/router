
import React from 'react';
import Form from '~/components/Form';
import { Button, Modal } from 'antd';
import { Base64 } from 'js-base64';
import { init } from '~/assets/common/auth';
import {checkStr} from '~/assets/common/check';
import {getQuickStartVersion} from '~/utils';
import './setpassword.scss';

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

        if (pwd !== surePwd) {
            this.setState({
                // surePwdTip: '两次密码输入不一致',
                surePwdTip: intl.get(MODULE, surePwd === '' ? 1 : 0)/*_i18n:两次密码输入不一致*/,
            });
            return;
        }

        this.setState({ loading: true });
        const response = await common.fetchApi({
            opcode: 'ACCOUNT_INITIAL_PASSWORD',
            data: { account: { password: Base64.encode(pwd), user: 'admin' } }
        });
        this.setState({ loading: false });

        const {errcode, data} = response;
        switch (errcode) {
            case 0:
                init(data[0].result.account.token);
                const quickStartVersion = getQuickStartVersion();

                if ('domestic' === quickStartVersion) { //国内版，跳转到设置上网参数
                    this.props.history.push('/guide/setwan');
                } else if ('abroad' === quickStartVersion) {   //海外版，跳转到设置时区
                    this.props.history.push('/guide/timezone');
                }
                break;
            case '-1608':
                Modal.info({
                        // title: '提示',
                        // content: '已设置过密码',
                        // okText: '确定',
                        title: intl.get(MODULE, 2)/*_i18n:提示*/,
                        content: intl.get(MODULE, 3)/*_i18n:已设置过密码*/,
                        okText: intl.get(MODULE, 4)/*_i18n:确定*/,
                        centered: true,
                        onOk: () => {
                            location.href = '/';
                        }
                    });
                break;
            default:
                // this.setState({pwdTip: `未知错误[${errcode}]`});
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
            <div className="setPassword"> 
                <h2>{intl.get(MODULE, 7)/*_i18n:设置管理密码*/}</h2>
                <p className="ui-tips guide-tip">{intl.get(MODULE, 8)/*_i18n:管理密码是进入路由器管理页面的凭证*/}</p>
                <Form style={{margin : '24px auto', width:260}}>
                    <FormItem
                        label={intl.get(MODULE, 9)/*_i18n:设置密码*/}
                        showErrorTip={pwdTip}
                        labelStyle={{position: 'absolute',right: 272}}
                        >
                        <Input
                            placeholder={intl.get(MODULE, 10)/*_i18n:请设置密码*/}
                            value={pwd}
                            onChange = {value => this.onChange('pwd', value)}
                            maxLength={32}
                             />
                        <ErrorTip>{pwdTip}</ErrorTip>
                    </FormItem>
                    <FormItem
                        label={intl.get(MODULE, 11)/*_i18n:确认密码*/}
                        showErrorTip={surePwdTip}
                        labelStyle={{position: 'absolute',right: 272}}
                        >
                        <Input
                            placeholder={intl.get(MODULE, 12)/*_i18n:请确认密码*/}
                            value={surePwd}
                            onChange = {value => this.onChange('surePwd', value)}
                            />
                        <ErrorTip>{surePwdTip}</ErrorTip>
                    </FormItem>
                    <FormItem
                        label="#"
                        labelStyle={{width:0}}
                        >
                        <Button
                            className="nextButton"
                            disabled={disabled}
                            loading={loading}
                            // style={{ width : '100%',height: 42 }}
                            onClick={this.post}
                            size="large"
                            type="primary">{intl.get(MODULE, 13)/*_i18n:下一步*/}</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
};
