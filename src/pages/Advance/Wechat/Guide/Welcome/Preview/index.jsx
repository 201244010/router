import React from 'react';
import { Button, Checkbox } from 'antd';

import './preview.scss';

export default class Preview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { style, bgImg, logoImg, logo, welcome, btnStr, statement } = this.props;

        return (
            <div className='preview-wrap' style={style}>
                <p className='title'>预览效果</p>
                <div className='preview-translate'>
                    <div
                        className='preview-content'
                        style={{ backgroundImage: `url(${bgImg})` }}
                    >
                        <div className='body'>
                            <div className='logo-img' style={{ backgroundImage: `url(${logoImg})` }}></div>
                            <div className='logo'>{logo}</div>
                            <div className='welcome'>{welcome}</div>
                            <div className='button-outline'>
                                <Button type="primary" className='button'>{btnStr}</Button>
                            </div>
                            <div className='agreement'>
                                <Checkbox className='checkbox' checked={true} ><span>我已阅读并同意《上网协议》</span></Checkbox>
                            </div>
                        </div>
                        <div className='footer'>©{statement}</div>
                    </div>
                </div>
            </div>
        );
    }
}