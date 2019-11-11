import React from 'react';
import './index.scss';
import { Button } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import { getLang } from '~/i18n/index.js';
import {getQuickStartVersion} from '~/utils';
// import 'echarts/lib/component/legend';
const MODULE = 'speedallocation';

export default class Allocation extends React.Component {
	constructor(props) {
		super(props);
		this.isEnglish = getLang() === 'en-us';
		this.myChart = null;
	}

	initChart = () => {
		// const echarts = require('echarts');
		this.myChart = echarts.init(this.refs['dom']);
		this.renderChart();
	};

	renderChart = () => {
		const data = this.props.percent;
		this.myChart.setOption({
			title: {
				text: ''
			},
			grid: {
				left: -10,
				right: 0,
				top: '1',
				height: 80,
				bottom: 0
			},
			tooltip: {
				trigger: 'axis',
				backgroundColor: 'rgba(255,255,255,0.90)',
				extraCssText: 'box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);',
				position: function(point, params, dom, rect, size) {
					return [
						point[0] - size.contentSize[0] / 2,
						-size.contentSize[1] - 2
					];
				},
				formatter: function(params) {
					const index = params[0].dataIndex;
					return (
						`<span style="display: inline-block;border-radius:100%;background:#FF6900;height:6px;width:6px;margin-right:8px"></span>${params[2].seriesName} : ${data['sunmiPercent'][index]}%<br>` +
						`<span style="display: inline-block;border-radius:100%;background:#60CC13;height:6px;width:6px;margin-right:8px"></span>${params[1].seriesName} : ${data['priorityPercent'][index]}%<br>` +
						`<span style="display: inline-block;border-radius:100%;background:#446CE6;height:6px;width:6px;margin-right:8px"></span>${params[0].seriesName} : ${data['normalPercent'][index]}%`
					);
				},
				textStyle: {
					color: 'black'
				},
				axisPointer: {
					color: '#333C4F',
					label: {
						backgroundColor: '#6a7985'
					}
				},
				padding: [12, 32, 12, 13]
			},
			xAxis: {
				type: 'category',
				show: false,
				boundaryGap: true,
				data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				splitLine: {
					show: false
				},
				axisLabel: {
					show: false
				},
				axisTick: {
					show: false
				}
			},
			yAxis: {
				show: false,
				type: 'value',
				min: 0,
				max: 100
			},
			legend: {
				show: false
			},
			series: [
				{
					name: intl.get(MODULE, 0) /*_i18n:普通*/,
					type: 'line',
					stack: 'device',
					animation: false,
					smooth: true,
					symbol: 'circle',
					symbolSize: 1, //
					lineStyle: {
						width: 1,
						color: 'rgba(73,116,255,1)'
					},
					itemStyle: {
						normal: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: 'rgba(73,116,255,0.6)'
									},
									{
										offset: 1,
										color: 'rgba(73,116,255,0.2)'
									}
								],
								global: false
							},
							areaStyle: {
								type: 'default',
								opacity: 0.5
							}
						}
					},
					data: (function(data) {
						const priority = data.map(function(item) {
							return item + 2;
						});
						return priority;
					})(this.props.percent['normalPercent'])
				},
				{
					name: intl.get(MODULE, 1) /*_i18n:优先*/,
					type: 'line',
					animation: false,
					stack: 'device',
					smooth: true,
					symbol: 'circle',
					symbolSize: 1,
					lineStyle: {
						width: 1,
						color: 'rgba(135,208,104,1)'
					},
					itemStyle: {
						normal: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: 'rgba(135,208,104,0.6)'
									},
									{
										offset: 1,
										color: 'rgba(135,208,104,0.2)'
									}
								],
								global: false
							},
							areaStyle: {
								type: 'default',
								opacity: 0.5
							}
						}
					},
					data: (function(data) {
						const priority = data.map(function(item) {
							return item + 1.5;
						});
						return priority;
					})(this.props.percent['priorityPercent'])
				},
				{
					name: intl.get(MODULE, 2) /*_i18n:商米*/,
					type: 'line',
					animation: false,
					stack: 'device',
					smooth: true,
					symbol: 'circle',
					symbolSize: 1,
					lineStyle: {
						width: 1,
						color: 'rgba(255,96,0,1)'
						// opacity: 0.5，
					},
					itemStyle: {
						normal: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: 'rgba(255,96,0,0.6)'
									},
									{
										offset: 1,
										color: 'rgba(255,96,0,0.2)'
									}
								],
								global: false
							},
							areaStyle: {
								type: 'default',
								opacity: 0.5
							}
						}
					},
					data: (function(data) {
						const priority = data.map(function(item) {
							return item + 1.5;
						});
						return priority;
					})(this.props.percent['sunmiPercent'])
				}
			]
		});
	};

	componentDidMount() {
		this.props.status && this.initChart();
	}

	componentDidUpdate() {
		const { status } = this.props;
		if (this.myChart) {
			status && this.renderChart();
		} else {
			status && this.initChart();
		}
	}

	render() {
		const { largestPercent, status } = this.props;
		return status ? (
			<div className="allocation">
				<div
					className={
						this.isEnglish ? 'first-title-us' : 'first-title'
					}
				>
					{intl.get(MODULE, 3) /*_i18n:网速智能分配*/}
				</div>
				<span className="subtitle">
					{intl.get(MODULE, 4) /*_i18n:当前带宽占用*/}
				</span>
				<span className="percent">{largestPercent}%</span>
				<div
					className="chart"
					style={{
						height: 80,
						width: getQuickStartVersion() === 'abroad' ? 378 : 280,
					}}
					ref="dom"
				></div>
				<div className="legend">
					<div className="sunmi"></div>
					<span>{intl.get(MODULE, 5) /*_i18n:商米设备*/}</span>
					<div className="priority"></div>
					<span>{intl.get(MODULE, 6) /*_i18n:优先设备*/}</span>
					<div className="normal"></div>
					<span>{intl.get(MODULE, 7) /*_i18n:普通设备*/}</span>
				</div>
				<Button onClick={this.goBandwidth} className="button">
					{intl.get(MODULE, 8) /*_i18n:修改设置*/}
				</Button>
			</div>
		) : (
			<div className="allocation">
				<span
					className={
						this.isEnglish ? 'first-title-us' : 'first-title'
					}
				>
					{intl.get(MODULE, 9) /*_i18n:网速分配*/}
				</span>
				<div
					className={
						this.isEnglish ? 'second-title-us' : 'second-title'
					}
				>
					{intl.get(MODULE, 10) /*_i18n:保障经营设备网速*/}
				</div>
				{this.isEnglish ? (
					''
				) : (
					<p>
						<span>
							{intl.get(MODULE, 11) /*_i18n:划分设备优先级*/}
						</span>
						<span>
							{intl.get(MODULE, 12) /*_i18n:按优先级分配网速*/}
						</span>
					</p>
				)}

				<Button onClick={this.goBandwidth} className="button">
					{intl.get(MODULE, 13) /*_i18n:去开启*/}
				</Button>
			</div>
		);
	}

	goBandwidth = () => {
		this.props.history.push('/routersetting/bandwidth');
	};
}
