import React from 'react';

import './multipleWan.scss';

export default class Wan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wanNum: 0,
		}
	}

	onWanNumChange = num => {

	}

    render() {
		const { wanNum } = this.state;

		return <SubLayout className="settings">
			<Form className='multipleWan-settings'>
				<PanelHeader title='多WAN设置' checkable={false} checked={true} />
				<div className='settings-selectArea' id="multipleWanArea">
					<label>请选择新增WAN口数量：</label>
					<Select value={wanNum} className='settings-select' onChange={this.onWanNumChange} getPopupContainer={() => document.getElementById('multipleWanArea')}>
						<Option value={0}>0</Option>
						<Option value={1}>1</Option>
						<Option value={2}>2</Option>
						<Option value={3}>3</Option>
					</Select>
				</div>
				
				<NetworkTemple
					opcodeSet='NETWORK_WAN_IPV4_SET'
					opcodeGet='NETWORK_WAN_IPV4_GET'
				/>
			</Form>
		</SubLayout>;
    }
};
