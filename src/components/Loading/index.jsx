import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';
import CustomIcon from '~/components/Icon';

import './loading.scss';

class Loading extends React.PureComponent {
	constructor(props) {
		super(props)
	}

	state = {
		visible: 'visible',
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	componentDidMount() {
		const duration = this.props.duration;
		if (duration > 0) {
			this.timer = setTimeout(() => {
				close();
				/*
				this.setState({
					visible: 'hidden'
				});
				*/
			}, duration * 1000);
		}
	}

	render() {
		const { className, icon } = this.props;

		return (
			<div className={'sm-loading-wrap ' + className} style={{visibility: this.state.visible}}>
				<div className='sm-loading-content'>
					<CustomIcon size={36} color="#6174F1" type="loading_ring" spin />
				</div>
			</div>
		)
	}
}

let show = (opt = {}) => {
	opt = Object.assign({
		className: '',
		duration: 10,  		// 自动关闭的延时，单位秒。设为 0 时不自动关闭
		mount: 'body',		// 配置渲染节点的输出位置
		icon: 'loading',	// 图标
	}, opt);

	const { mount, className, duration, icon } = opt, doc = document;

	let div = doc.createElement('div');
	ReactDOM.render(<Loading className={className} icon={icon} duration={duration} />, div);

	let mounter = doc.querySelector(mount);
	mounter && mounter.appendChild(div);
}

let close = (opt = {}) => {
	opt = Object.assign({
		mount: 'body',		// 节点
	}, opt);

	const { mount } = opt, doc = document;

	let mounter = doc.querySelector(mount);
	if (mounter) {
		let loading = mounter.querySelector('div>.sm-loading-wrap');
		if (loading) {
			mounter.removeChild(loading.parentNode);
		}
	} else {
		console.error('[Loading]Not found: ' + mount);
	}
}

const loading = { show, close }

export default loading;