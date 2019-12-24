import React from 'react';
import Icon from '~/components/Icon';

import './multipleWan.scss';

export default class WanIcon extends React.Component {
    render() {
		const { wanNum = 0 } = this.props;
		const wanIconList = [];
		let lanNum = 1;
		for(let i = 0; i < 4; i++) {
			if(i < wanNum) {
				wanIconList.push(<WanItem num={i+1}/>);
			} else {
				wanIconList.push(<LanItem num={lanNum++}/>);
			}
		}
		return (
			<React.Fragment>
				<WanItem
					className='WanIcon-mainWan'
				/>
				{wanIconList}
			</React.Fragment>
		);
    }
};

const WanItem = (props) => {
	return (
		<div className={`wanIcon ${props.className}`}>
			<div className='wanIcon-wan-image'></div>
			<Icon
				size={24}
				type="Internet"
				color='#6174F1'
			/>
			<p className='wanIcon-wan-p'>WAN{props.num}</p>
		</div>
	);
}

const LanItem = (props) => {
	return (
		<div className={`wanIcon ${props.className}`}>
			<div className='wanIcon-lan-image'></div>
			<Icon
				size={24}
				type="lan"
			/>
			<p className='wanIcon-lan-p'>LAN{props.num}</p>
		</div>
	);
}
