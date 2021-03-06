import React from 'react';
import { Button } from 'antd';
import {getLang} from '~/i18n/index';

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';

const MODULE = 'qos';
export default class QoS extends React.Component {
    constructor(props) {
        super(props);
        this.pieDom = null;
        this.option = null;
    }

    initPie () {
        let bwPie = (this.pieDom == null) ? echarts.init(this.ID) : this.pieDom;
        this.option = {
            legend: {
                show: true, //this.props.enable,
                orient: 'vertical',//竖直放置
                icon: 'circle',//图标为圆形，默认是方形
                align: 'auto',
                itemGap: 10,//两个属性的距离
                itemWidth: 10,//图标的宽度，对应有itemHeight为高度,圆形只有半径
                x: '42%',//距离左侧位置
                y: '25%',//距离上面位置
                data: this.props.data.slice(0, -1),//属性名称
                align: 'left',//图标与属性名的相对位置
                selectedMode: false,//可选择
                textStyle: {//属性名的字体样式设置
                    fontSize: 12,
                    color: '#333C4F'
                }
            },
            series: [{//饼状图设置
                type: 'pie',//类型为饼状
                radius: ['74%', '100%'],//内圈半径，外圈半径
                center: ['20%', '50%'],//饼状图位置，第一个参数是左右，第二个是上下。
                avoidLabelOverlap: false,
                hoverAnimation: false,//鼠标悬停效果，默认是true
                label: {//设置饼状图圆心属性
                    normal: {
                        show: false
                    }
                },
                data: this.props.data.map(item => { return { name: item.name, value: item.value } }),//对应数据
                itemStyle: {//元素样式
                    normal: {
                        //柱状图颜色  
                        color: (params) => {//对每个颜色赋值
                            return this.props.data[params.dataIndex].color;
                        },
                    }
                }
            }]
        };

        bwPie.setOption(this.option);
    }

    goQoS = () => {
        this.props.history.push('/advance/bandwidth');
    }

    componentWillMount() {
        this.title = getLang() === 'zh-cn' ? 'title' : 'title-us';
        this.band = getLang() === 'zh-cn' ? 'band-desc': 'band-desc-us';
    }

    componentDidMount() {
        this.initPie();
    }

    componentDidUpdate() {
        this.initPie();
    }

    render() {
        const { data, enable, online } = this.props;
        let total = data.slice(0, -1);
        let cost = 0, bandList = [];

        total.forEach(item => {
            let val = parseFloat(item.value);
            cost += val;
            bandList.push(<li key={item.name}><label>{intl.get(MODULE, 0)/*_i18n:带宽使用占比*/}</label><span>{val.toFixed(0) + '%'}</span></li>);
        });

        cost = cost.toFixed(0);

        return (
            <li className='func-item bandwidth'>
                <div className={this.title}>
                    <div className='percent'>{cost + '%'}</div>
                    <div className='desc'>{intl.get(MODULE, 1)/*_i18n:下行带宽使用率*/}</div>
                </div>
                <div className='pie' ref={ID => this.ID = ID} style={{ height: 120, width: 250 }}></div>
                {enable && online && (cost >= 80 ?
                    <h4 className='warning'>{intl.get(MODULE, 2)/*_i18n:当前网络较为拥挤，建议将重要设备添加到优先队列*/}</h4> :
                    <h4 className='nice'>{intl.get(MODULE, 3)/*_i18n:当前网络畅通，可放心使用*/}</h4>)}
                {<ul className={this.band}>{bandList}</ul>}
                {!enable && <div className='qos-disabled'>{intl.get(MODULE, 4)/*_i18n:网速智能分配功能未开启*/}</div>}
                <Button onClick={this.goQoS} className='set-band'>{enable ? intl.get(MODULE, 5)/*_i18n:设置带宽*/ : intl.get(MODULE, 6)/*_i18n:前往设置*/}</Button>
            </li>
        )
    }
}
