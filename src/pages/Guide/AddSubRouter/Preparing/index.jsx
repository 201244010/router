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
                <h2>{intl.get(MODULE, 0)}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 1)}</p>
                <div className="content">
                    <img className='image' src={require('~/assets/images/guide-router.png')}/>
                    <Button type="primary" className="next" onClick={this.next}>{intl.get(MODULE, 2)}</Button>
                </div>
            </div>
        );
    }
}