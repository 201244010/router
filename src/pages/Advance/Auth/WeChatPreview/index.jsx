import React from 'react';
import { Button, Checkbox } from 'antd';

import './WeChatPreview.scss';

export default class WeChatPreview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { style, BgImage, logoImage, logo, welcome, buttonInfo, statement } = this.props;

        return (
            <div className='preview-outline' style={style}>
                <label style={{margin: 0}}>预览效果</label>
                <div
                    className='preview-content'
                    style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),'+`url(${BgImage})`}}
                > 
                    <div className='body'>
                        <div className='logo-img' style={{backgroundImage: `url(${logoImage})`}}></div>
                        <div className='logo'>{logo}</div>
                        <div className='welcome'>{welcome}</div>
                        <div className='button-outline'>
                            <Button type="primary" className='button'>{buttonInfo}</Button>
                        </div>
                        <div>
                            <Checkbox className='checkbox' checked={true} ><span >我已阅读并同意《上网协议》</span></Checkbox>
                        </div>
                    </div>
                    <div className='footer'>©{statement}</div>    
                </div>
            </div>
        );
    }
}