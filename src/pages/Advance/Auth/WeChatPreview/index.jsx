import React from 'react';
import { Button, Checkbox } from 'antd';

import './WeChatPreview.scss';

export default class WeChatPreview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { style, bg_img, logo_img, logo, welcome, loginHint, statement } = this.props;

        return (
            <div className='preview-outline' style={style}>
                <label style={{margin: 0}}>预览效果</label>
                <div
                    className='preview-content'
                    style={{backgroundImage: 'linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),'+`url(${bg_img})`}}
                > 
                    <div className='preview-content-top'>
                        <div className='preview-content-logo_img' style={{backgroundImage: `url(${logo_img})`}}></div>
                        <div className='preview-content-logo'>{logo}</div>
                        <div className='preview-content-welcome'>{welcome}</div>
                        <div className='preview-content-loginHint'>
                            <Button type="primary" className='preview-content-loginHint-button'>{loginHint}</Button>
                        </div>
                        <div>
                            <Checkbox className='preview-content-checkbox' checked={true} ><span >我已阅读并同意《上网协议》</span></Checkbox>
                        </div>
                    </div>
                    <div className='preview-content-statement'>©{statement}</div>    
                </div>
            </div>
        );
    }
}