import React from 'react';
import {Button} from 'antd';
import CustomIcon from '~/components/Icon';
import './finish.scss';

const MODULE = 'finish';

export default class Success extends React.Component {
    constructor(props) {
        super(props);
    }
    
    goHome = () => {
        this.props.history.push('/home');
    }

    render() {
        return (
            <React.Fragment>
                <div className='finish'>
                    <CustomIcon size={72} color='#87D068' type='succeed' style={{marginBottom: 16}} />
                    <h4>{intl.get(MODULE, 0)}</h4>
                    <p>{intl.get(MODULE, 1)}</p>
                    <div className='QR'>
                        <img src={require('~/assets/images/qr.png')} />
                        <p>{intl.get(MODULE, 2)}</p>
                    </div>
                    <div className="footButtons">
                        <Button type="primary" className="complete" onClick={this.goHome}>{intl.get(MODULE, 3)}</Button>
                    </div> 
                </div>
            </React.Fragment>
        );
    }
}