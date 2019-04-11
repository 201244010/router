import React from 'react';
import Button from 'h5/components/Button';
import Icon from 'h5/components/Icon';
import Link from 'h5/components/Link';
import CheckBox from 'h5/components/CheckBox';
import Modal from 'h5/components/Modal';

import Agreement from './Agreement';
import Privacy from './Privacy';

import { UA, PAGE_STYLE_KEY, PAGE_STYLE_WEB } from '~/utils';

import './welcome.scss';

const MODULE = 'h5welcome';

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
                <div className='welcomeImg'></div>
                <h2>{intl.get(MODULE, 0)/*_i18n:欢迎使用商米路由器*/}</h2>
                <p>{intl.get(MODULE, 1)/*_i18n:简单几步设置，路由器就可以上网啦*/}</p>
                <div className='policy'>
                    <CheckBox
                        style={{ color: '#FFF' }}
                        checked={checked}
                        onChange={this.onCheckBoxChange}>
                    </CheckBox>
                    <span className='checkbox' >{intl.get(MODULE, 3)/*_i18n:同意*/}<Link onClick={this.showAgreement}>{intl.get(MODULE, 4)/*_i18n:《商米用户协议》*/}</Link>{intl.get(MODULE, 5)/*_i18n:和*/}<Link onClick={this.showPolicy}>{intl.get(MODULE, 6)/*_i18n:《隐私政策》*/}</Link></span>
                </div>
                <div><Button disabled={!checked} onClick={this.nextStep} className='start-setup' type='primary'>{intl.get(MODULE, 2)/*_i18n:开始配置*/}</Button></div>
                <Modal
                    title={intl.get(MODULE, 8)/*_i18n:商米用户协议*/}
                    visible={visible}
                    footer={<div onClick={this.iknow}>{intl.get(MODULE, 9)/*_i18n:我知道了*/}</div>}
                >
                    <Agreement />
                </Modal>
                <Modal
                    title={intl.get(MODULE, 10)/*_i18n:隐私政策*/}
                    visible={policy}
                    footer={<div onClick={this.iknow}>{intl.get(MODULE, 11)/*_i18n:我知道了*/}</div>}
                >
                    <Privacy />
                </Modal>
                <div className='copyright'>{intl.get(MODULE, 12)}</div>
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
