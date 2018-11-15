import React from 'react';
import { Button, Icon, Modal, message } from 'antd';
import classnames from 'classnames';
import CustomIcon from '~/components/Icon';
import Tips from '~/components/Tips';
import Form from '~/components/Form';
import Progress from '~/components/Progress';
import {checkRange} from '~/assets/common/check';
import { TIME_SPEED_TEST } from '~/assets/common/constants';

const { FormItem, Input, ErrorTip } = Form;
const reg = /\D+/;

export default class Speed extends React.Component {
  constructor(props){
    super(props);

    this.state = {
	  	showModal : false,
	 	speedTestdone : false,
        mode : 'auto',
        upBandWidth : '0',//手动设置上行带宽
        downBandWidth : '0',
        autoUpband : '0',//自动测速上行带宽
        autoDownband : '0',
        upBandTip: '',
        downBandTip: '',
        disabled : true,
        loading: false
    };
  }

  back = ()=>this.props.history.push("/guide/setwan");
  
  nextStep = () => {
      this.props.history.push('/guide/setwifi');
  }

  reTest = ()=>{
      this.autoSpeedTest();
  }

  checkParams(){
      let {upBandWidth, downBandWidth} = this.state;
      upBandWidth = upBandWidth.trim();
      downBandWidth = downBandWidth.trim();
      return !(reg.test(downBandWidth) || reg.test(upBandWidth) || 
      parseInt(downBandWidth) == 0 || parseInt(upBandWidth) == 0 ||
      downBandWidth === "" || upBandWidth === '')
  }

  // 测速请求函数
  async fetchSpeed(){ 
    common.fetchApi(
        [{
            opcode: 'WANWIDGET_SPEEDTEST_START',
            data: { speedtest : { acton : 'start' } }
        }]
        ).then(async()=>{
            let response = await common.fetchApi(
                [{
                    opcode: 'WANWIDGET_SPEEDTEST_INFO_GET',
                    data: { speedtest : { 'force_update' : true }}
                }],
                {},
                {
                    pending : resp => {
                        return resp.data[0].result.speedtest.status === 'testing';
                    }, 
                    stop : () => this.stop, 
                    interval : 3000
                }
            );
            this.setState({ speedTestdone : true, showModal : false });
            let { errcode } = response;
            if(errcode == 0){
                let info = response.data[0].result.speedtest;
                this.setState({
                    autoUpband: (info.up_bandwidth / 1024).toFixed(0),
                    autoDownband : (info.down_bandwidth / 1024).toFixed(0)
                });
                return;
            }
            message.error(`测速信息获取失败[${errcode}]`);
        });
    }

  //  手动配速  
    configure = async (upband,downband,speedtest) => {
        this.setState({ loading: true });
        let state = this.state;
        let upBandWidth = parseInt(state[upband]) * 1024 + '';
        let downBandWidth = parseInt(state[downband]) * 1024 + '';
        let data = {qos : Object.assign(this.qos || {}, {up_bandwidth : upBandWidth, down_bandwidth : downBandWidth, source : speedtest , enable : true})};
        await common.fetchApi(
                {
                    opcode: 'QOS_SET',
                    data: data
                },
                {},
                { loop : 10, stop : () => this.stop }
            ).then(refs => {
            let { errcode } = refs;
            if(errcode == 0){
                this.setState({ loading: false });
                return this.props.history.push('/guide/setwifi');
            }
            this.setState({ loading: false });
            message.error(`手动配速设置失败[${errcode}]`);
        })
    }

    // 获取 qos 信息
    async fetchQOSInfo(){
        let response = await common.fetchApi(
            {opcode: 'QOS_GET'},
            {},
            { loop : 10, stop : () => this.stop }
        ).catch(ex => {});
        let { errcode, data } = response;
        if(errcode == 0){
            return this.qos = data[0].result.qos;
        }
        message.error(`QOS信息获取失败[${errcode}]`);
    }

  autoSpeedTest = () => {
    this.setState({ showModal : true, mode : 'auto' });
    this.fetchSpeed();
  }

  changeToAutoMode = () => {
    this.setState({ mode : 'auto' });
  }

  changeToManualMode = () => {
    this.setState({ mode : 'manual', disabled : !this.checkParams() });
  }

  switchMode(mode){
    return this[`changeTo${mode}Mode`];
  }

  changeBandWidth = (value, field)=>{
        if('upBandWidth' === field){
            const tip = checkRange(value, { min: 1, max: 1000, who: '上行总带宽' });
            this.setState({
                [field] : value,
                upBandTip: tip,
            },() => { 
                this.setState({
                    disabled: !this.checkParams() || ('' !== tip) || this.state.downBandTip !== '',
                });
            })
        }else{
            const tip = checkRange(value, { min: 1, max: 1000, who: '下行总带宽' });
            this.setState({
                [field] : value,
                downBandTip: tip,
            },() => { 
                this.setState({
                    disabled: !this.checkParams()  || ('' !== tip || this.state.upBandTip !== ''),
                });
            })
        }
    }

    componentWillUnmount(){
        this.stop = true;
    }

    componentDidMount(){
        this.fetchQOSInfo();
    }

  render(){
    const { showModal, mode, speedTestdone, upBandWidth, downBandWidth ,autoUpband, autoDownband, upBandTip, downBandTip, loading }  = this.state;
    return (
      <div className="speed">
        <h2>设置上下行带宽</h2> 
        <p className="ui-tips guide-tip">设置之后，路由器就可以根据设备优先级智能调配网速。 </p>
        <div className="ui-relative">
            <div className="button-group">
                <a href="javascript:;" className={classnames(["ui-ib", {'now' : mode === 'auto'}])} onClick={this.switchMode('Auto')}>自动测速</a>
                <span className="border ui-ib"></span>
                <a href="javascript:;" className={classnames(["ui-ib", {'now': mode === 'manual'}])} onClick={this.switchMode('Manual')}>手动设置</a>
            </div>
            {/* 自动测速 | 手动配速 */}
            {
                mode === 'auto' ?
                (!speedTestdone ? 
                    <div className="ui-center entry">
                        <SpeedAutoConfig back={this.back} autoSpeedTest={this.autoSpeedTest} nextStep={this.nextStep} />
                    </div> : "") : 
                (
                    <div className="ui-center entry">
                        <SpeedManualConfig back={this.back} 
                                        nextStep={this.nextStep} 
                                        upBandWidth={upBandWidth}
                                        upBandTip={upBandTip}
                                        downBandTip={downBandTip}
                                        downBandWidth={downBandWidth}
                                        speedTestdone={speedTestdone}
                                        changeBandWidth={this.changeBandWidth} 
                                        configure={this.configure}
                                        reTest={this.reTest}
                                        disabled={this.state.disabled}
                                        nextStep={this.nextStep}
                                        loading={loading} 
                                        /> </div> 
                )
            }
            {/* 自动测速结果看板 */}
            { speedTestdone && mode === 'auto' ? 
                <div className="ui-center entry">
                <SpeedAutoBoard configByManual={this.switchMode('Manual')}
                                back={this.back} 
                                reTest={this.reTest}
                                configure={this.configure}
                                upBandWidth={autoUpband}
                                downBandWidth={autoDownband}
                                loading={loading}
                                /></div> : ""}
            {showModal &&
                <Progress
                    duration={TIME_SPEED_TEST}
                    title='正在进行网络测速，请耐心等待…'
                    showPercent={true}
                />
            }
        </div>
      </div>
    )
  }
};

const SpeedAutoConfig = props => {
	return [
        <CustomIcon key="autoSpeedIcon" type="dashboard" color="#e0e1e2" size={160} />,
        <div className='button-wrap'>
            <Button key="autoSpeedButton" type="primary" onClick={props.autoSpeedTest} size="large" style={{ width : "100%", margin : "30px auto 5px" }}>开始测速</Button>
            <div key="help" className="help" style={{ marginTop : -1 }}>
                <a href="javascript:;" onClick={props.back} className="ui-tips">上一步</a>
                <a href="javascript:;" className="ui-tips" onClick={props.nextStep}>跳过</a>
            </div>
        </div>
    ];
}

const SpeedAutoBoard = props => {
    return (
        <div className="ui-center speed-result">
            <span>网络测试完成，您的网络带宽为</span>
            <div className="board">
                <div className="board-item">
                    <span>
                        <span className="band-width">{props.upBandWidth}</span>
                        <span className="band-result">
                            <em className="ui-tips">Mbps</em>
                            <strong className="ui-tips">上行带宽<CustomIcon type="bandwidthdown" size={12} color="#4687FF"/></strong>
                        </span>
                    </span>
                </div>
                <div className="board-split"/>
                <div className="board-item">
                    <span>
                        <span className="band-width">{props.downBandWidth}</span>
                        <span className="band-result">
                            <em className="ui-tips">Mbps</em>
                            <strong className="ui-tips">下行带宽 <CustomIcon type="bandwidthup" size={12} color="#87D068"/></strong>
                        </span>
                    </span>
                </div>
            </div>
            <div className="button-wrap">
                <Button type="primary" size='large' style={{ width : "100%" }} loading={props.loading} onClick={() => props.configure('autoUpband','autoDownband','speedtest')}>下一步</Button>
                <div className="help" style={{ marginTop : 2 }}>
                    <a href="javascript:;" onClick={props.back} className="ui-tips">上一步</a>
                    <a href="javascript:;" className="ui-tips" onClick={props.reTest}>重新测速</a>
                </div>
            </div>
        </div>
    );
};

const SpeedManualConfig = props => {
	return (
        <div className="ui-center speed-result">
        <Form style={{ width : 385,left:-52 }}>
            <FormItem label="#" style={{ marginBottom : 26 }}>
                <span>为了准确分配网速，请确保带宽值输入准确</span>
            </FormItem>
            <FormItem style={{fontWeight:'regular',marginBottom:26 }} label="上行总带宽" suffix="Mbps">
                <Input type="text" value={props.upBandWidth} maxLength={4} placeholder="请输入上行总带宽" onChange={value => props.changeBandWidth(value, 'upBandWidth')} name="up" />
                <ErrorTip style={{color:'#fb8632'}}>{props.upBandTip}</ErrorTip>
            </FormItem>
            <FormItem style={{fontWeight:'regular',marginBottom:32 }} label="下行总带宽" suffix="Mbps">
                <Input type="text" value={props.downBandWidth} maxLength={4}  placeholder="请输入下行总带宽" onChange={value => props.changeBandWidth(value, 'downBandWidth')} name="down" />
                <ErrorTip style={{color:'#fb8632'}}>{props.downBandTip}</ErrorTip>
            </FormItem>
            <FormItem label="#">
        		<Button type="primary" disabled={props.disabled} size="large" style={{ width : "100%"}} loading={props.loading} onClick={() => props.configure('upBandWidth','downBandWidth','manual')}>下一步</Button>
            </FormItem>
            <FormItem label="#" style={{ marginTop : -40 }}>
                <div className="help">
                    <a href="javascript:;" onClick={props.back} className="ui-tips">上一步</a>
                    {
                        props.speedTestdone ? 
                            '' :
                            <a href="javascript:;" className="ui-tips" onClick={props.nextStep}>跳过</a>
                    }
                    
                </div>
            </FormItem>
        </Form>
        </div>
    )
};

const Helper = props => {
    return (
        <div className="help">
            <a href="javascript:;" onClick={props.back} className="ui-tips">上一步</a>
            <a href="javascript:;" className="ui-tips" onClick={props.more}>{props.moreText}</a>
        </div>
    )
}



