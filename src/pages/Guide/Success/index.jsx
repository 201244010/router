import React from 'react';
import {Button} from 'antd';
import CustomIcon from '~/components/Icon';
import './success.scss';

const MODULE = 'success';

export default class Success extends React.Component {
    constructor(props) {
        super(props);
    }
    
    goHome = () => {
        this.props.history.push('/home');
    }

    addSubRouter = () => {
        this.props.history.push('/guide/addsubrouter');
    }

    render() {
        return (
            <React.Fragment>
                <div className='success'>
                    <CustomIcon size={72} color='#87D068' type='succeed' style={{marginBottom: 16}} />
                    <h4>{intl.get(MODULE, 11)/*_i18n:设置完成*/}</h4>
                    <p>{intl.get(MODULE, 0)/*_i18n:下载商米助手APP，体验更多功能！*/}</p>
                    <div className='QR'>
                        <img src={require('~/assets/images/qr.png')} />
                        <p>{intl.get(MODULE, 10)/*_i18n:扫描二维码下载APP*/}</p>
                    </div>
                    <div className="footButtons">
                        <Button type="primary" onClick={this.goHome}>{intl.get(MODULE, 1)/*_i18n:配置完成*/}</Button>
                        <Button onClick={this.addSubRouter}>{intl.get(MODULE, 2)/*_i18n:添加更多商米路由器*/}</Button>
                    </div> 
                </div>
            </React.Fragment>
        );
    }
}