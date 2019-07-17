import React from 'react';
import './system.scss';
import {Table} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';

export default class UPnP extends React.Component {
	constructor(props){
		super(props);
		this.columns = [{
            title: '编号',
			dataIndex: 'hostname',
            width:200			
        }, {
            title: '应用名称',
            dataIndex: 'mac',
            width:200
        }, {
            title: '内部端口',
            dataIndex: 'ip',
            width:200
        }, {
            title: '端口协议',
            dataIndex: 'enable',
            width:200
        }, {
            title: '外部端口',
            width:200
        },{
            title: '端口协议',
            width:216
        }];
	}

	state = {
		enable: true
	}

	onChange = () => {
		this.setState({
			enable: !this.state.enable
		})
	}

	render() {
		const {enable} = this.state;
		return <SubLayout className="settings">
			<div style={{ margin: "0 60px" }}>
				<PanelHeader title='自定义时间' checkable={true} checked={enable} onChange={this.onChange}/>
			</div>
			<div className="static-table">
					<Table columns={this.columns} dataSource={[]} rowKey={record=>record.index} 
					bordered={false}
					rowClassName={(record, index) => {
						let className = 'editable-row';
						if (index % 2 === 1) {
							className = 'editable-row-light';
						}
						return className;
					}}
					size="middle" locale={{ emptyText: enable ? '暂无设备' : 'UPnP已关闭'}} />
				</div>
		</SubLayout>
	}
}