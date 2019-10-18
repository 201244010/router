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
                    <CustomIcon className='finish-icon-succeed' size={72} type='succeed'/>
                    <h4>{intl.get(MODULE, 0)/*_i18n:设置完成*/}</h4>
                    <p>{intl.get(MODULE, 1)/*_i18n:下载商米助手APP，随时随地管理路由器！*/}</p>
                    <div className='QR'>
                        <img src={require('~/assets/images/qr.png')} />
                        <p>{intl.get(MODULE, 2)/*_i18n:扫描二维码下载*/}</p>
                    </div>
                    <div className="footButtons">
                        <Button type="primary" className="complete" onClick={this.goHome}>{intl.get(MODULE, 3)/*_i18n:去首页*/}</Button>
                    </div> 
                </div>
            </React.Fragment>
        );
    }
}