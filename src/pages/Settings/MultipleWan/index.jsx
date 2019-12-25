import React from 'react';
import { Select, Button, message, Tabs } from 'antd';
import NetworkTemple from '~/components/NetworkTemple';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';
import Form from "~/components/Form";
import WanIcon from './WanIcon';

import './multipleWan.scss';

const Option = Select.Option;
const { TabPane } = Tabs;

export default class MultipleWan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wanNum: 3,
		}
	}

	onWanNumChange = num => {
		this.setState({
			wanNum: num
		})
	}

	callback(key) {
		console.log(key);
	}

    render() {
		const { wanNum } = this.state;

		const tabsContent = [];
		for(let i = 1; i <= wanNum; i++) {
			tabsContent.push(
				<TabPane tab={`WAN${i}`} key={i}>
					<NetworkTemple
						port={i+1}
					/>
				</TabPane>
			);
		}
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
				<WanIcon wanNum={wanNum}/>
				<Tabs className={`settings-tabs ${wanNum === 0 && 'settings-tabs-disappear'}`} defaultActiveKey="1" onChange={this.callback}>
					{tabsContent}
				</Tabs>
			</Form>
		</SubLayout>;
    }
};
