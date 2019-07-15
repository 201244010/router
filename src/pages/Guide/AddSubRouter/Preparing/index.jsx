import React from 'react';
import { Button } from 'antd';

import './preparing.scss';
const MODULE = 'preparing';

export default class Preparing extends React.Component {
    constructor(props){
        super(props);
    }

    next = () => {
        this.props.history.push('/guide/addsubrouter/setting');
    }

    render() {
        return (
            <div className="preparing">
                <h2>{intl.get(MODULE, 0)/*_i18n:子路由设置准备*/}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 1)/*_i18n:将所有子路由放置在合适的位置，两个路由之间距离不要超过两个房间，然后接通电源，待子路由的信号灯呈白色后点击「下一步」。*/}</p>
                <div className="content">
                    <img className='image' src={require('~/assets/images/guide-router.png')}/>
                    <Button type="primary" className="next" onClick={this.next}>{intl.get(MODULE, 2)/*_i18n:下一步*/}</Button>
                </div>
            </div>
        );
    }
}