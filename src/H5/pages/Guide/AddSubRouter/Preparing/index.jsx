import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';

import './preparing.scss';

const MODULE = 'h5preparing'

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
                <GuideHeader title={intl.get(MODULE, 0)} tips={intl.get(MODULE, 2)} />
                <div className='pictures'>
                    <div className='picture'></div>
                    <div className='picture'></div>
                </div>
            </div>,
            <div className='h5-next'>
                <Button type='primary' style={{margrinTop: 0}} onClick={this.add} >{intl.get(MODULE, 1)}</Button>
            </div>  
        ]);
    }
}