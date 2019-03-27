import React from 'react';
import './index.scss'
import { Button } from 'antd';


export default class Allocation extends React.Component{
    constructor(props) {
        super(props);
    }

    renderChart = () => {
        const echarts = require('echarts');
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
                backgroundColor: 'rgba(255,255,255,0.90)',
                // extraCssText: 'box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);',
                textStyle: {
                    fontFamily: 'PingFangSC-Regular',
                    fontSize: 12,
                    color: '#333C4F',
                },
                padding: [12,12,12,12],
                formatter: '<span style="font-size:14px;font-family: HelveticaNeue;display: block;height: 22px;line-height: 22px;">{b0}</span>' +
                    '<span style="display: inline-block;height: 22px;line-height: 22px">接入用户： {c0}</span>',
            },
            xAxis: {
                type: 'category',
                show: false,
                boundaryGap: true,
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
                    <div className='chart' style={{height: 80, width: 250}} ref='dom'></div>
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