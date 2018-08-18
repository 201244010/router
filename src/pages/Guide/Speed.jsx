import React from 'react';
import { Button, Progress } from 'antd';
import classnames from 'classnames';
import Icon from '~/components/Icon';
import Modal from '~/components/Modal';
import Tips from '~/components/Tips';
import Form from '~/components/Form';

const { FormItem, Input } = Form;

export default class Speed extends React.Component {
  constructor(props){
    super(props);
    this.state = {
	  	showModal : false,
	 	speedTestdone : false,
        mode : 'auto',
        upBandWidth : 0,
        downBankWidth : 0
    };
  }

  back = ()=>this.props.history.go(-1);
  
  nextStep = () => {}

  autoSpeedTest = () => {
	this.setState({ showModal : true });
	setTimeout(() => {
		this.setState({ 
			showModal : false,
			speedTestdone : true
		});
	}, 2000);
  }

  changeToAutoMode = () => {
    this.setState({ mode : 'auto' });
  }

  changeToManualMode = () => {
    this.setState({ mode : 'manual' });
  }

  switchMode(mode){
    return this[`changeTo${mode}Mode`];
  }

  changeBandWidth = (value, field)=>{
      this.setState({
          [field] : value
      });
  }

  render(){
    const {showModal, mode}  = this.state;
    return (
      <div className="speed">
        <h2>设置上下行宽带</h2> 
        <p className="ui-tips guide-tip">设置之后，路由器就可以根据设备优先级智能调配网速。 </p>
        <div className="ui-relative">
            <div className="button-group">
                <a href="javascript:;" className={classnames(["ui-ib", {'now' : mode === 'auto'}])} onClick={this.switchMode('Auto')}>自动测速</a>
                <span className="border ui-ib"></span>
                <a href="javascript:;" className={classnames(["ui-ib", {'now': mode === 'manual'}])} onClick={this.switchMode('Manual')}>手动设置</a>
            </div>
            <div className="ui-center entry">
                {
                    mode === 'auto' ? 
                    <SpeedAutoConfig back={this.back} nextStep={this.nextStep} /> : 
                    <SpeedManualConfig back={this.back} nextStep={this.nextStep} 
                                        changeBandWidth={this.changeBandWidth} />
                }
            </div>
            <div className="ui-center speed-result">
                <span>网络测试完成，您的网络带宽为</span>
                <ul className="board">
                    <li>131311</li>
                    <li></li>
                    <li>2222</li>
                </ul>
                <div className="button-wrap">
                    <Button type="primary" style={{ width : "100%" }}>下一步</Button>
                    <div className="help">
                        <a href="javascript:;" onClick={this.back} className="ui-tips">上一步</a>
                        
                        <div className="more">
                            <a href="javascript:;" className="ui-tips">重新测速</a> 或 
                            <a href="javascript:;" className="ui-tips">手动设置</a>
                        </div>
                    </div>
                </div>
            </div>
            <Modal active={showModal} >
                <h4 style={{ fontSize : 32 }}>60%</h4>
                <Progress percent={50} status="active" showInfo={false} strokeWidth={10} />
                <Tips size="16" top={5}>测速中，请稍后…</Tips>
            </Modal>
        </div>
      </div>
    )
  }
};

const SpeedAutoConfig = props => {
	return [
        <Icon key="autoSpeedIcon" type="correct" size={140} />,
		<Button key="autoSpeedButton" type="primary" onClick={props.autoSpeedTest} size="large" style={{ width : "100%", margin : "30px auto 5px" }}>开始测速</Button>,
        <Helper key="help" back={props.back} more={props.nextStep} moreText="跳过，不需要只能带宽功能" />
    ];
}

const SpeedAutoConfigResult = props => {
    return [
        
    ];
};

const SpeedManualConfig = props => {
	return (
        <Form style={{ width : 385 }}>
            <FormItem label="#" style={{ marginBottom : 15 }}>
                <span>为了准确分配网速，请确保带宽值输入准确</span>
            </FormItem>
            <FormItem label="上行总带宽">
                <Input type="text" placeholder="请输入上行总宽带" onChange={value => props.changeBandWidth(value, 'upBandWidth')} name="up" />
            </FormItem>
            <FormItem label="下行总带宽">
                <Input type="text" placeholder="请输入下行总宽带" onChange={value => props.changeBandWidth(value, 'downBandWidth')} name="down" />
            </FormItem>
            <FormItem label="#">
        		<Button type="primary" size="large" style={{ width : "100%"}}>下一步</Button>
            </FormItem>
            <FormItem label="#" style={{ marginTop : -20 }}>
                <Helper back={props.back} more={props.nextStep} moreText="重新测速" />
            </FormItem>
        </Form>
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



