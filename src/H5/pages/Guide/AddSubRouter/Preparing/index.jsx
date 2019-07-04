import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';

import './preparing.scss';

export default class Preparing extends React.Component {
    constructor(props) {
        super(props);
    }

    add = () => {
        this.props.history.push('/guide/addsubrouter/setting')
    }

    render () {
        return ([
            <div className='guide-upper'>
                <GuideHeader title='添加更多路由器' tips='将要添加的路由放置在合适的位置，然后接通电源，待系统信号指示灯停止闪烁后点击「开始添加」' />
                <div className='pictures'>
                    <div className='picture'></div>
                    <div className='picture'></div>
                </div>
            </div>,
            <div className='h5-next'>
                <Button type='primary' style={{margrinTop: 0}} onClick={this.add} >开始添加</Button>
            </div>  
        ]);
    }
}