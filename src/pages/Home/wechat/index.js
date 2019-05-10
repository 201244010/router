import React from 'react';
import {Button} from 'antd';
import echarts from 'echarts/lib/echarts';
import {transformTime} from '~/assets/common/utils';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip' 
import './index.scss';

export default class Connection extends React.Component {
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
        this.myChart.setOption({
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255,255,255,0.90)',
                // extraCssText: 'box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);',
                textStyle: {
                    fontFamily: 'PingFangSC-Regular',
                    fontSize: 12,
                    color: '#333C4F',
                },
                axisPointer: {
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                padding: [12,12,12,12],
                formatter: '<span style="font-size:14px;font-family: HelveticaNeue;display: block;height: 22px;line-height: 22px;">{b0}</span>' +
                    '<span style="display: inline-block;height: 22px;line-height: 22px">接入用户： {c0}</span>',
            },
            grid: {
                left: 0,
                height: 80,
                top: 0
            },
            xAxis: {
                type: 'category',
                show: false,
                boundaryGap: true,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                data: (function(e){
                    var res = [];
                    e.map(function(item) {
                        res.push(transformTime(parseInt(item.time) * 1000))
                    });
                    return res;
                })(this.props.wechatList),
            },
            yAxis: {
                show: false,
                type: 'value'
            },
            series: [{
                name: '用户数',
                type: 'bar',
                smooth: true,
                symbol: 'circle', // 拐点类型
                symbolSize: 0, // 拐点圆的大小
                color: '#7BF3B6',
                data: (function(e){
                    var res = [];
                    e.map(function(item) {
                        res.push(item.count)
                    });
                    return res;
                })(this.props.wechatList),
                barWidth: 10
            }],
        });
    }

    componentDidMount() {
        !this.props.wechatConfig && this.initChart();
    }

    componentDidUpdate() {
        !this.props.wechatConfig && this.renderChart();
    }
    
    render() {
        const {chatTotal} = this.props;
        return (
            this.props.wechatConfig ?
                <div className='connection'>
                    <span className='first-title'>
                        微信连Wi-Fi
                    </span>
                    <span className='second-title'>
                        顾客连接Wi-Fi新方式
                    </span>
                    <p>
                        <span>无需告知密码</span>
                        <span>安全防蹭网</span>
                    </p>
                    <Button onClick={this.goWechat} className="button">去开启</Button>
                </div>
                : <div className='connection'>
                <span className='first-title'>
                    微信连Wi-Fi
                </span>
                <span className='subtitle'>
                    累计连接用户
                </span>
                <span className='number'>
                    {chatTotal}
                </span>
                <div className='chart' style={{width: 250, height: 80}} ref='dom'></div>
                <Button onClick={this.goWechat} className="button">修改设置</Button>
            </div>
        )
    }

    goWechat = () => {
        this.props.history.push('/routersetting/wechat')
    }
}