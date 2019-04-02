import React from 'react';
// import Search from './Search';
import FindRouter from './FindRouter';

import './setting.scss';

export default class Setting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="setting">
                <h2>设置子路由</h2> 
                <p className="ui-tips guide-tip">检测完成后，请确认您需要添加的子路由</p>
                <div className="content">
                    {/* <Search /> */}
                    <FindRouter />
                </div>
            </div>
        );
    }
}
