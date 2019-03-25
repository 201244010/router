import React from 'react';
import {Button} from 'antd';
import CustomIcon from '~/components/Icon';
import './success.scss';

const MODULE = 'success';

export default class Success extends React.Component {
    goHome = () => {
        this.props.history.push('/home');
    }

    render() {
        return (
            <React.Fragment>
                <div className='success'>
                    <CustomIcon size={72} color='#87D068' type='succeed' style={{marginBottom: 16}} />
                    <h4>{intl.get(MODULE, 11)/*_i18n:设置完成*/}</h4>
                    <p>{intl.get(MODULE, 0)/*_i18n:我们为您准备以下功能，开始体验吧*/}</p>
                    <div className='QR'>
                        <img src={require('~/assets/images/qr.png')} />
                        <p>{intl.get(MODULE, 10)/*_i18n:扫码下载APP*/}</p>
                    </div>
                    <div className="footButtons">
                        <Button type="primary" className="complete" onClick={this.goHome}>{intl.get(MODULE, 1)}</Button>
                        <Button type="primary" className="addMore" onClick={this.goHome}>{intl.get(MODULE, 2)}</Button>
                    </div> 
                </div>
            </React.Fragment>
        );
    }
}