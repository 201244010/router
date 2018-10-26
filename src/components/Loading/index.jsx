import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';

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
				this.setState({
					visible: 'hidden'
				});
			}, duration * 1000);
		}
	}

	render() {
		const { className, icon } = this.props;

		return (
			<div className={'sm-loading-wrap ' + className} style={{visibility: this.state.visible}}>
				<div className='sm-loading-content'>
					<Icon type={icon} style={{ fontSize: 36, color: "#FB8632" }} spin />
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
	doc.querySelector(mount).appendChild(div);
}

let close = (opt = {}) => {
	opt = Object.assign({
		//remve: false,		// 是否要删除loading，默认隐藏loading而是不删除
		mount: 'body',		// 节点
	}, opt);

	const { mount, remove } = opt, doc = document;

	let parent = doc.querySelector(mount);
	let child = parent.getElementsByClassName('sm-loading-wrap')[0];
	parent.removeChild(child);
	/*if (remove) {
		parent.removeChild(child);
	} else{
		child.style.visibility = 'hidden';
	}*/
}

const loading = { show, close }

export default loading;