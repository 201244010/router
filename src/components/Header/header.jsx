import React from 'react';

import './header.scss';
import { Row, Col } from 'antd';

export default class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Row className="header">
				<Col span={12}>logo</Col>
				<Col span={12} style={{ textAlign: "right" }}>
					<a href="javascript:;">商米官网</a>
				</Col>
			</Row>
		);
	}

};




