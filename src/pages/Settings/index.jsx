
import React from 'react';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '~/components/Icon';

import './settings.scss';


export default class Setting extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <SubLayout className="settings">
                <nav>
                    <div className="now nav-item">
                        <CustomIcon type="wifiset" size={28} />
                        <span>WI-FI设置</span>
                    </div>
                    <div className="nav-item">
                        <CustomIcon type="browser"  size={28} />
                        <span>WI-FI设置</span>
                    </div>
                    <div className="nav-item">
                        <CustomIcon type="lanset"  size={28} />
                        <span>WI-FI设置</span>
                    </div>
                </nav>
                <article>
                    右侧内容
                </article>
            </SubLayout>
        )
    }
};







