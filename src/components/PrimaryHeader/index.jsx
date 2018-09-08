import React from 'react';

import './header.scss';
import classnames from 'classnames';
import SubLayout from "../SubLayout";
import Icon from '~/components/Icon';

export default class Header extends React.Component {
	constructor(props) {
        super(props);
	}

	render() {
        const logined = this.props.logined;
		return (
			<div className="header">
				<SubLayout>
					<ul>
						<li>
                            <div className="ui-ib logo">
                                <Icon type="logo" size={40} color="#fff" />
                            </div>
							<span className="ui-ib slogan">SUNMI W1</span>
						</li>
						{
                            logined ? [
                                <li key="1" className="menu">
                                    <a href="javascript:;" className="ui-ib now">网络状态</a>
                                    <a href="javascript:;" className="ui-ib">基础设置</a>
                                    <a href="javascript:;" className="ui-ib">高级设置</a>
                                </li>,
                                <li key="2" className="sidebar">
                                    <a href="javascript:;" className="ui-ib">下载手机版</a>
                                    <span className="ui-ib">|</span>
                                    <a href="javascript:;" className="ui-ib">退出管理</a>
                                </li>
                            ] : ''
                        }
					</ul>
				</SubLayout>
			</div>
		);
	}

};




