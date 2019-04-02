import React from 'react';
import {Button} from 'antd';
import CustomIcon from '~/components/Icon';
import './finish.scss';

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
                    <h4>组网完成</h4>
                    <p>下载商米助手APP，体验更多功能！</p>
                    <div className='QR'>
                        <img src={require('~/assets/images/qr.png')} />
                        <p>扫描二维码下载APP</p>
                    </div>
                    <div className="footButtons">
                        <Button type="primary" className="complete" onClick={this.goHome}>配置完成</Button>
                    </div> 
                </div>
            </React.Fragment>
        );
    }
}