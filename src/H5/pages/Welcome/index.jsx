import React from 'react';
import Button from 'h5/components/Button';
import Icon from 'h5/components/Icon';
import Checkbox from 'h5/components/Checkbox';

import { UA, PAGE_STYLE_KEY, PAGE_STYLE_WEB } from '~/utils';

import './welcome.scss';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
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

    render() {
        const { checked } = this.state;

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
                            同意《<a href="javascript:void(0);">商米用户协议</a>》和
                            《<a href="javascript:void(0);">隐私政策</a>》
                        </span>
                    </Checkbox>
                </div>
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
