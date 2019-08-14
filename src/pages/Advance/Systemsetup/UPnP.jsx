import React from 'react';
import './system.scss';
import { Table, message } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import SubLayout from '~/components/SubLayout';
const MODULE = 'upnp';

export default class UPnP extends React.Component {
	constructor(props) {
		super(props);
		this.intervalTimer = null;
		this.columns = [
			{
				title: intl.get(MODULE, 0),
				dataIndex: 'number',
				width: 200
			},
			{
				title: intl.get(MODULE, 1),
				dataIndex: 'desc',
				width: 200
			},
			{
				title: intl.get(MODULE, 8),
				dataIndex: 'iaddr',
				width: 200
			},
			{
				title: intl.get(MODULE, 2),
				dataIndex: 'iport',
				width: 200
			},
			{
				title: intl.get(MODULE, 4),
				dataIndex: 'eport',
				width: 200
			},
			{
				title: intl.get(MODULE, 3),
				dataIndex: 'proto',
				width: 216
			}
		];
	}

	state = {
		enable: false,
		pagination: {
			pageSize: 5,
			current: 1,
			total: 0
		},
		switchDisable: false,
		upnpList: []
	};

	onChange = () => {
		this.setState({
			enable: !this.state.enable
		});
	};

	fetchUpnp = async ({ page, pageSize = 5 }) => {
		const { pagination } = this.state;
		const resp = await common.fetchApi(
			[
				{
					opcode: 'UPNP_LIST_GET',
					data: {
						page: page || pagination.current,
						pageSize
					}
				}
			],
			{ ignoreErr: true }
		);
		const { errcode, data } = resp;
		let number = (data[0].page - 1) * 5 + 1;
		if (0 === errcode) {
			const tmpList = data[0].result.map(item => {
				item.number = number++;
				return item;
			});
			const enable = parseInt(data[0].enabled);
			this.setState({
				upnpList: enable ? tmpList : [],
				pagination: enable
					? {
							...this.state.pagination,
							total: data[0].sum,
							current: data[0].page
					  }
					: { pageSize: 5, current: 1, total: 0 },
				enable
			});
		} else {
			message.error(intl.get(MODULE, 9) /*_i18n:信息获取失败*/);
		}
	};

	switchUPnP = async value => {
		this.setState({
			switchDisable: true,
			upnpList: [],
			pagination: { pageSize: 5, current: 1, total: 0 }
		});
		const resp = await common.fetchApi([
			{
				opcode: 'UPNP_SWITCH',
				data: {
					enabled: Number(value)
				}
			}
		]);
		const { errcode } = resp;
		if (0 === errcode) {
			message.success(
				Number(value)
					? intl.get(MODULE, 10) /*_i18n:打开成功*/
					: intl.get(MODULE, 11) /*_i18n:关闭成功*/
			);
			this.setState({
				switchDisable: false,
				enable: value
			});
			this.fetchUpnp({});
		} else {
			message.error(this.err[errcode]);
		}
	};

	onTableChange = async pagination => {
		this.fetchUpnp({
			page: pagination.current,
			pageSize: 5
		});
	};

	componentDidMount() {
		this.fetchUpnp({});
		this.intervalTimer = setInterval(() => {
			this.fetchUpnp({});
		}, 3000);
	}

	componentWillMount() {
		clearInterval(this.intervalTimer);
	}

	render() {
		const { enable, upnpList, switchDisable, pagination } = this.state;
		return (
			<SubLayout className="settings">
				<div style={{ margin: '0 60px' }}>
					<PanelHeader
						title={intl.get(MODULE, 5)}
						disabled={switchDisable}
						checkable={true}
						checked={enable}
						onChange={this.switchUPnP}
					/>
				</div>
				<div className="static-table">
					<Table
						columns={this.columns}
						dataSource={upnpList}
						pagination={pagination}
						rowKey="number"
						bordered={false}
						rowClassName={(record, index) => {
							let className = 'editable-row';
							if (index % 2 === 1) {
								className = 'editable-row-light';
							}
							return className;
						}}
						onChange={this.onTableChange}
						size="middle"
						locale={{
							emptyText: enable
								? intl.get(MODULE, 6)
								: intl.get(MODULE, 7)
						}}
					/>
				</div>
			</SubLayout>
		);
	}
}
