import React from 'react';
import './index.scss'
import { Button } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip' 
// import 'echarts/lib/component/legend';

export default class Allocation extends React.Component{
    constructor(props) {
        super(props);
        this.myChart = null;
    }

    initChart = () => {
        // const echarts = require('echarts');
        this.myChart = echarts.init(this.refs['dom']);
        this.renderChart();
    }

    renderChart = () => {
        const data = this.props.percent;
        this.myChart.setOption({
            title: {
                text: ''
            },
            grid:{
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
                formatter:  function(params) {
                    const index = params[0].dataIndex;
                    return `<span style="display: inline-block;border-radius:100%;background:#FF6900;height:6px;width:6px;margin-right:8px"></span>${params[2].seriesName} : ${data['sunmiPercent'][index]}%<br>` + 
                    `<span style="display: inline-block;border-radius:100%;background:#60CC13;height:6px;width:6px;margin-right:8px"></span>${params[1].seriesName} : ${data['priorityPercent'][index]}%<br>` +
                    `<span style="display: inline-block;border-radius:100%;background:#446CE6;height:6px;width:6px;margin-right:8px"></span>${params[0].seriesName} : ${data['normalPercent'][index]}%`
            },
                textStyle: {
                    color: 'black'
                },
                axisPointer: {
                    color: '#333C4F',
                    label: {
                        backgroundColor: '#6a7985'
                    },
                },
                padding: [12,32,12,13],
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
                min: 0,
                max: 100
            },
            legend:{
                show: false
            },
            series: [
                {
                    name: '普通',
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
                    data: function(data) {
                        const priority =  data.map(function(item){
                            return item + 2
                        })
                        return priority
                    } (this.props.percent['normalPercent'])
                },
                {
                    name: '优先',
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
                    data: function(data) {
                        const priority =  data.map(function(item){
                            return item + 1.5
                        })
                        return priority
                    } (this.props.percent['priorityPercent'])
                },
                {
                    name: '商米',
                    type: 'line',
                    animation: false,
                    stack: 'device',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 1,
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
                    data: function(data) {
                        const priority =  data.map(function(item){
                            return item + 1.5
                        })
                        return priority
                    } (this.props.percent['sunmiPercent'])
                }
            ],
        })
    }

    componentDidMount() {
        this.props.status && this.initChart();
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
                    <p>
                        <span>划分设备优先级</span>
                        <span>按优先级分配网速</span>
                    </p>
                <Button onClick={this.goBandwidth} className="button">去开启</Button>
                </div>
        )
    }

    goBandwidth = () => {
        this.props.history.push('/bandwidth');
    }
}