import React from 'react';
import Button from 'h5/components/Button';
import Icon from 'h5/components/Icon';
import Link from 'h5/components/Link';
import Checkbox from 'h5/components/Checkbox';
import Modal from 'h5/components/Modal';

import { UA, PAGE_STYLE_KEY, PAGE_STYLE_WEB } from '~/utils';

import './welcome.scss';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        policy: false,
        visible: false,
        checked: true,
    }

    nextStep = () => {
        this.props.history.push('/guide');
    }

    onCheckBoxChange = e => {
        this.setState({
            checked: e.target.checked,
        })
    }

    showAgreement = () => {
        this.setState({
            visible: true,
        });
    }

    showPolicy = () => {
        this.setState({
            policy: true,
        });
    }

    iknow = () => {
        this.setState({
            policy: false,
            visible: false,
        });
    }

    render() {
        const { checked, visible, policy } = this.state;

        return (
            <div className="welcome">
                <Icon type='earth' size={'6.9333rem'} style={{
                    color: '#FFF',
                    opacity: 0.1,
                    position: 'fixed',
                    top: '-1.8667rem',
                    left: '-2.3067rem',
                    zIndex: '-1'
                }} />
                <h2>欢迎使用商米路由器</h2>
                <p>简单几步设置，路由器就可以上网啦</p>
                <div><Button disabled={!checked} onClick={this.nextStep} className='start-setup' type='primary'>开始配置</Button></div>
                <div className='policy'>
                    <Checkbox
                        style={{ color: '#FFF' }}
                        checked={checked}
                        onChange={this.onCheckBoxChange}>
                        <span className='agreement'>
                            同意《<Link onClick={this.showAgreement}>商米用户协议</Link>》和
                            《<Link onClick={this.showPolicy}>隐私政策</Link>》
                        </span>
                    </Checkbox>
                </div>
                <Modal
                    title='商米用户协议'
                    visible={visible}
                    footer={<div onClick={this.iknow}>我知道了</div>}
                >
                    <div className='policy-content'>
                        欢迎您使用“商米”软件及相关服务！
为了更好地为您提供服务，请您仔细阅读本《用户服务协议及隐私保护政策》（以下简称“本协议”）。在您开始使用“商米”软件及相关服务之前，请您务必认真阅读并充分理解本协议，特别是涉及免除或者限制责任的条款、权利许可和信息使用的条款、同意开通和使用特殊单项服务的条款、法律适用和争议解决条款等。其中，免除或者限制责任条款等重要内容将以加粗形式提示您注意，您应重点阅读。如您未满18周岁，请您在法定监护人陪同下仔细阅读并充分理解本协议，并征得法定监护人的同意后下载本软件。
除非您完全接受本协议的全部内容，否则您无权下载、安装、注册、登录、使用（以下统称“使用”）“商米”软件，或者通过任何方式使用“商米”服务，或者获得“商米”软件提供的任何服务 （本协议中统称“使用”）。若您使用“商米”软件及相关服务
则视为您已充分理解本协议并承诺作为本协议的一方当事人接受协议的约束。
                    </div>
                </Modal>
                <Modal
                    title='隐私政策'
                    visible={policy}
                    footer={<div onClick={this.iknow}>我知道了</div>}
                >
                    <div className='policy-content'>
                        欢迎您使用“商米”软件及相关服务！
为了更好地为您提供服务，请您仔细阅读本《用户服务协议及隐私保护政策》（以下简称“本协议”）。在您开始使用“商米”软件及相关服务之前，请您务必认真阅读并充分理解本协议，特别是涉及免除或者限制责任的条款、权利许可和信息使用的条款、同意开通和使用特殊单项服务的条款、法律适用和争议解决条款等。其中，免除或者限制责任条款等重要内容将以加粗形式提示您注意，您应重点阅读。如您未满18周岁，请您在法定监护人陪同下仔细阅读并充分理解本协议，并征得法定监护人的同意后下载本软件。
除非您完全接受本协议的全部内容，否则您无权下载、安装、注册、登录、使用（以下统称“使用”）“商米”软件，或者通过任何方式使用“商米”服务，或者获得“商米”软件提供的任何服务 （本协议中统称“使用”）。若您使用“商米”软件及相关服务
则视为您已充分理解本协议并承诺作为本协议的一方当事人接受协议的约束。
                    </div>
                </Modal>
                <div className='copyright'>© 2018 上海商米科技有限公司</div>
                <Icon type='earth' size={'10.6667rem'} style={{
                    color: '#FFF',
                    opacity: 0.06,
                    position: 'fixed',
                    bottom: '-1.7333rem',
                    right: '-4rem',
                    zIndex: '-1'
                }} />
            </div>
        );
    }
}
