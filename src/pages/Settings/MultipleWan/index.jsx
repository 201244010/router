import React from 'react';
import { Select, message, Tabs, Button } from 'antd';
import ModalLoading from '~/components/ModalLoading';
import NetworkTemple from '~/components/NetworkTemple';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';
import Form from "~/components/Form";
import WanIcon from './WanIcon';

import './multipleWan.scss';

const MODULE = 'network';
const Option = Select.Option;
const { TabPane } = Tabs;

export default class MultipleWan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wanNum: 0,
			buttonLoading: false,
			refreshInfo: [],
			modalLoading: false,
		}
	}

	setWanInfo = async() => {
		this.setState({
			buttonLoading: true,
			modalLoading: true,
		});
		const resp = await common.fetchApi(
            { opcode : 'NETWORK_MULTI_WAN_GET'}
        );
		const { data, errcode } = resp;
		if(errcode === 0) {
			const len = data[0].result.wans.length;
			if(len > 1) {
				const ports = [];
				for(let i = len; i > 1; i--){
					ports.push(`${i}`);
				}
				await common.fetchApi(
					{
						opcode : 'NETWORK_MULTI_WAN_RESET',
						data: { ports }
					}
				);

				const response = await common.fetchApi(
					{
						opcode : 'NETWORK_MULTI_WAN_SET',
						data: {mode: 1},
					}
				);
				const { errcode: err } = response;
				if(err === 0) {
					message.success(intl.get(MODULE, 15)/*_i18n:设置成功*/);
				}
			} else {
				message.success(intl.get(MODULE, 15)/*_i18n:设置成功*/);
			}
		}
		this.setState({
			buttonLoading: false,
			modalLoading: false,
		});
	}
	
	getWanInfo = async() => {
        const response = await common.fetchApi(
            { opcode : 'NETWORK_MULTI_WAN_GET'}
        );
        const { data, errcode } = response;
		if(errcode === 0) {
			const { wans } = data[0].result;
			const refreshInfo = wans.map(item => {
				return {
					dial_type: item.dial_type,
					...item.info,
				}
			});

			this.setState({
				wanNum: wans.length - 1 || 0,
				refreshInfo: refreshInfo,
			});
		}
	}

	refreshWanIno = async() => {
        const response = await common.fetchApi(
            { opcode : 'NETWORK_MULTI_WAN_GET'}
        );
        const { data, errcode } = response;
        if(errcode === 0) {
			const { wans } = data[0].result;
			const refreshInfo = wans.map(item => {
				return {
					dial_type: item.dial_type,
					...item.info,
				}
			});

			this.setState({
				refreshInfo: refreshInfo,
			});
        }
	}

	onWanNumChange = async(num) => {
		this.setState({
			wanNum: num
		});
	}

	refreshWanNum = (num) => {
		this.setState({
			wanNum: num
		})
	}

	callback(key) {
		console.log(key);
	}

	componentDidMount() {
		this.getWanInfo();
		this.refreshWanInfos = setInterval(this.refreshWanIno, 3000);
	}

	componentWillUnmount(){
        clearInterval(this.refreshWanInfos);
    }

    render() {
		const { wanNum, buttonLoading, refreshInfo, modalLoading } = this.state;

		const tabsContent = [];
		for(let i = 1; i <= wanNum; i++) {
			if (i < refreshInfo.length) {
				tabsContent.push(
					<TabPane tab={`WAN${i}`} key={i}>
						<NetworkTemple
							port={i+1}
							wanNum={wanNum}
							parent={this}
							refreshInfo={refreshInfo[i]}
						/>
					</TabPane>
				);
			} else {
				tabsContent.push(
					<TabPane tab={`WAN${i}`} key={i}>
						<NetworkTemple
							port={i+1}
							wanNum={wanNum}
							parent={this}
						/>
					</TabPane>
				);
			}
			
		}
		return <SubLayout className="settings">
			<Form className='multipleWan-settings'>
				<PanelHeader title={intl.get(MODULE, 33)/*_i18n:多WAN设置*/} checkable={false} checked={true} />
				<div className='settings-selectArea' id="multipleWanArea">
					<label>{intl.get(MODULE, 32)/*_i18n:请选择新增WAN口数量：*/}</label>
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
				{
					wanNum === 0&&
					<section className="advancedSettings-save">
						<Button type="primary" size='large' className='advancedSettings-save-button' loading={buttonLoading} onClick={this.setWanInfo} >{intl.get(MODULE, 14)/*_i18n:保存*/}</Button>
					</section>
				}
			</Form>
			<ModalLoading
				visible={modalLoading}
				tip={intl.get(MODULE, 50)/*_i18n:正在配置，请稍后...*/}
			/>
		</SubLayout>;
    }
};
