import React from 'react';
import { Button, Icon } from 'antd';
import Form from '~/components/Form';
import CustomIcon from '~/components/Icon';
import { init, clear } from '~/assets/common/auth';
import { Base64 } from 'js-base64';
import "./QRcode.scss";

const MODULE = 'login';
const { FormItem, ErrorTip, Input }  = Form;

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        password: '',
        tip : '',
        loading: false,
    };

    onChange = value => {
        this.setState({ 
            password: value,
            tip: (value.length > 0) ? '' : intl.get(MODULE, 0),
        });
    }

    onEnter = () => {
        this.post();
    }

    componentWillMount() {
        // 删除认证cookie
        clear();
    }

    post = async () => {
        const password = this.state.password;

        if ('' === password) {
            this.setState({
                tip: intl.get(MODULE, 1),
            });
            return;
        }

        this.setState({ loading : true });
        const response = await common.fetchApi(
            [{ 
                opcode: 'ACCOUNT_LOGIN',
                data: { account : { password : Base64.encode(password), user : 'admin' }}
            }]
        );
        const { errcode, data } = response;
        this.setState({ loading : false });

        let tip = '';
        switch (errcode) {
            case 0:
                init(data[0].result.account.token);
                this.props.history.push('/');
                return;
            case '-1604':
                this.props.history.push('/welcome');
                return;
            case '-1601':
                tip = intl.get(MODULE, 2);
                break;
            case '-1605':
                tip = intl.get(MODULE, 3);
                break;
            case '-1606':
                tip = intl.get(MODULE, 4);
                break;
            default:
                tip = intl.get(MODULE, 5, {errcode});
                break;
        }

        this.setState({
            tip: tip,
        });
    }

    render() {
        const { tip, password } = this.state;
        return <div className="ui-center ui-fullscreen">
                    <div className="form-box" style={{ textAlign : 'center' }}>
                        <CustomIcon type="logo" size={90} color="#fff" />
                        <Form style={{ width : 320, padding: 0 }} >
                            <FormItem style={{ margin: '45px auto 30px' }}>
                                <Input placeholder={intl.get(MODULE, 6)}
                                        type="password"
                                        value={password}
                                        onChange={this.onChange}
                                        maxLength='32'
                                        onEnter={this.onEnter}
                                        />
                            <ErrorTip style={{
                                color: '#FF5500',
                                position: 'absolute',
                                right: 35,
                                top: 10,
                                textAlign: 'right',
                                }}>{ tip }</ErrorTip>
                            </FormItem>
                        </Form>
                        <Button type="primary"
                                size='large'
                                onClick={this.post}
                                style={{ margin: "0 0 10px", width: 320 }}
                                loading={this.state.loading}>{intl.get(MODULE, 7)}</Button>
                        <p style={{ fontSize : 12, lineHeight : 1.5, color: '#FFF', opacity: 0.6 }}>{intl.get(MODULE, 8)}</p>
                    </div>
                    <div className="qr">
                        <img src={require('~/assets/images/qr.png')} />
                        <p>{intl.get(MODULE, 9)}</p>
                    </div>
            </div>;
    }
}

export default Login;
