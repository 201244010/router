import React from 'react';
import './index.scss'
import { Button } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';

export default class Allocation extends React.Component{
    constructor(props) {
        super(props);
    }

    renderChart = () => {
        const myChart = echarts.init(this.refs['dom']);
        myChart.setOption({
            title: {
                text: ''
            },
            grid:{
                left: 0,
                right: 0,
                top: '1',
                height: 80,
                bottom: 0
            },
            tooltip: {
                show: true,
                backgroundColor: 'rgba(255,255,255,0.90)',
                extraCssText: 'box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);',
                formatter:
                    '<span style="display: inline-block;border-radius:100%;background:#FB8632;height:6px;width:6px;margin-right:8px"></span>{a0} : {c0}%<br>' +
                    '<span style="display: inline-block;border-radius:100%;background:#87D068;height:6px;width:6px;margin-right:8px"></span>{a1} : {c1}%<br>' +
                    '<span style="display: inline-block;border-radius:100%;background:#446CE6;height:6px;width:6px;margin-right:8px"></span>{a2} : {c2}%',
                textStyle: {
                    color: 'black'
                },
                padding: [12,32,12,13],
                alwaysShowContent: true
            },
            xAxis: {
                type: 'category',
                show: false,
                boundaryGap: false,
                data: [1,2,3,4,5,6,7,8,9,10,11,12],
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
            legend:{
                show: false
            },
            series: [
                {
                    name: '普通设备',
                    type: 'line',
                    stack: 'device',
                    animation: false,
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 0, //
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
                                colorStops: [{
                                    offset: 0, color: 'rgba(73,116,255,0.6)'
                                }, {
                                    offset: 1, color: 'rgba(73,116,255,0.2)'
                                }],
                                global: false
                            },
                            areaStyle: {
                                type: 'default',
                                opacity: 0.5
                            }
                        }
                    },
                    data: this.props.percent['normalPercent']
                },
                {
                    name: '优先设备',
                    type: 'line',
                    animation: false,
                    stack: 'device',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 0,
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
                                colorStops: [{
                                    offset: 0, color: 'rgba(135,208,104,0.6)'
                                }, {
                                    offset: 1, color: 'rgba(135,208,104,0.2)'
                                }],
                                global: false
                            },
                            areaStyle: {
                                type: 'default',
                                opacity: 0.5
                            }
                        }
                    },
                    data: this.props.percent['priorityPercent']
                },
                {
                    name: '商米设备',
                    type: 'line',
                    animation: false,
                    stack: 'device',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 0,
                    lineStyle: {
                        width: 1,
                        color: 'rgba(255,96,0,1)',
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
                                colorStops: [{
                                    offset: 0, color: 'rgba(255,96,0,0.6)'
                                }, {
                                    offset: 1, color: 'rgba(255,96,0,0.2)'
                                }],
                                global: false
                            },
                            areaStyle: {
                                type: 'default',
                                opacity: 0.5
                            }
                        }
                    },
                    data: this.props.percent['sunmiPercent']
                }
            ],
        })
    }

    componentDidMount() {
        this.props.status && this.renderChart();
    }

    componentDidUpdate() {
        this.props.status && this.renderChart();
    }
    
    render() {
        const {largestPercent} = this.props;
        return (
            this.props.status
                ? <div className='allocation'>
                <span className='first-title'>
                网速分配
                </span>
                <span className='subtitle'>
                最大网速占用
                </span>
                <span className='percent'>
                    {largestPercent}%
                </span>
                    <div style={{height: 80, width: 250}} ref='dom'>
                    </div>
                    <div className='legend'>
                            <div className='sunmi'></div>
                            <span>商米设备</span>
                            <div className='priority'>
                            </div>
                            <span>优先设备</span>
                            <div className='normal'></div>
                            <span>普通设备</span>
                    </div>
                    <Button onClick={this.goBandwidth} className="button">修改设置</Button>
                </div>
                : <div className='allocation'>
                    <span className='first-title'>
                        网速分配
                    </span>
                    <span className='second-title'>
                        保障经营设备网速
                    </span>
                    <span>最大网速占用</span>
                    <span className='fourth-title'>
                        {largestPercent}%
                    </span>
                <Button onClick={this.goBandwidth} className="button">去开启</Button>
                </div>
        )
    }

    goBandwidth = () => {
        this.props.history.push('./advance/bandwidth');
    }
}