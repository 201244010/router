import React from 'react';
import { Button } from 'antd';
import CustomIcon from '~/components/Icon';

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
                <h2>{intl.get(MODULE, 0)/*_i18n:组网设置准备*/}</h2>
                <div className="content">
                    <img className='image' src={require('~/assets/images/guide-router.png')}/>
                    <div className='attention'>
                        <p>{intl.get(MODULE, 3)/*_i18n:1. 将需要加入网络的路由器接通电源，待系统指示灯*/}<CustomIcon size={20} color="rgba(51,60,79,1)" type="Internet"/>{intl.get(MODULE, 4)/*_i18n:停止闪烁，即启动完成；*/}</p>
                        <p>{intl.get(MODULE, 5)/*_i18n:2. 若需要加入网络的路由器已被配置过，请先长按路由器背面Reset孔5秒以上，将之恢复出厂设置后重新启动；*/}</p>
                        <p>{intl.get(MODULE, 6)/*_i18n:3. 点击“开始设置”*/}</p>
                    </div>
                    <Button type="primary" className="next" onClick={this.next}>{intl.get(MODULE, 2)/*_i18n:下一步*/}</Button>
                </div>
            </div>
        );
    }
}