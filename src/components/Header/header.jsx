import React from 'react';

import './header.scss';
import Grid from "../Grid";

export default class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="header">
				<Grid>
					<ul className="ui-none">
						<li>
							<span>SUNMI</span>
							<span>SUNMI W1</span>
						</li>
						<li className="menu">
							<a href="javascript:;" className="ui-ib now">网络状态</a>
							<a href="javascript:;" className="ui-ib">基础设置</a>
							<a href="javascript:;" className="ui-ib">高级设置</a>
						</li>
						<li className="sidebar">
							<a href="javascript:;" className="ui-ib">下载手机版</a>
							<span className="ui-ib">|</span>
							<a href="javascript:;" className="ui-ib">退出管理</a>
						</li>
					</ul>
				</Grid>
			</div>
		);
	}

};




