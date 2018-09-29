
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Table, Progress, Modal } from 'antd'

import CustomIcon from '~/components/Icon';
const {FormItem,ErrorTip, Input,InputGroup} = Form;
import '../../Settings/settings.scss'
import '../advance.scss'

export default class Bandwidth extends React.PureComponent {
    state = {
        visible:false,  //自动设置弹窗是否可见
        manualShow:false, //手动设置弹窗是否可见
        speedFill:false,//带宽测速完成弹窗是否可见
        speedFail:false,//带宽测速失败弹窗是否可见
        bandunset : false,//总带宽未设置弹窗
        bandenable : false,
        upband : '--',
        downband : '--',
        source : '', //测速方式
        buttonloading : false,
        unit : 'Mbps',

        //自动设置
        failTip:'网络未连接',
        speedTest : false, //1测速成功，0测速失败
        percent: 0 ,//测速百分比

        //设备权重
        sunmi : '50',
        white : '30',
        normal : '20',
        sunmiTip : '',
        whiteTip : '',
        normalTip : '',

        //手动设置
        upbandTmp : '',
        downbandTmp : '',
        loading:false,
        disable : true, //按钮灰显
    }
    
    handleSpace = (val) => {
        if (val === ''){
            val = 0
        }
        return parseInt(val);
    }

    onChange = (val, key) => {
        let tip = '各设备百分比总和需不大于100%',value = val.replace(/\D/g,'');
        this.setState({
            [key]: value === "" ? value : value,
            sunmiTip : '',
            whiteTip : '',
            normalTip : ''
        },() =>{ 
                    const {sunmi, white, normal, upbandTmp ,downbandTmp} = this.state;
                    if((this.handleSpace(sunmi) + this.handleSpace(white) + this.handleSpace(normal)) > 100){
                        this.setState({
                            sunmiTip : '',
                            whiteTip : '',
                            normalTip : '',
                            [key + 'Tip'] : tip
                        })
                    }
                    if (upbandTmp === "" || downbandTmp === ""){
                        this.setState({
                            disable : true
                        })
                     }else {
                        this.setState({
                            disable : false
                        })
                    }
        })       
    }

    OnBandEnable = value => {
        if(this.state.upband === '--' || this.state.downband === '--'){
            this.setState({
                bandunset : true
            });
            setTimeout(()=>{
                this.setState({
                    bandunset : false
                })},3000)
        }else{
            this.setState({
                bandenable : value
            })
        }
    }

    speedTestStatus = async ()=> {
        common.fetchWithCode(
            'WANWIDGET_SPEEDTEST_START',
            {method : 'POST'}
        );
        let status = await common.fetchWithCode(
            'WANWIDGET_SPEEDTEST_INFO_GET',
            {method : 'POST'},
            {
                loop : 5,
                interval : 20000,
                stop : ()=>this.stop
            }
        ).catch(ex=>{});
        let {errcode:code, data,message} = status;
        if (code == 0){
            let info = data[0].result.speedtest;
            if(info.status === "ok"){
                this.setState({
                    speedFill : true,
                    visible : false,
                    upband : info.up_bandwidth,
                    downband : info.down_bandwidth,
                    percent : 0,
                });
                return;
            }
            if(info.status === "fail"){
                this.setState({
                    speedFail : true,
                    visible : false,
                    percent : 0
                });
                return;
            }
        }
        Modal.error({ title: '获取测速失败', content: message});
    }

    showManual = () => {
        this.setState({
            manualShow : true,
        })
    }

    handleCancel = () => {
        this.setState({ 
            visible: false ,
        });
    }
    
    onEditCancle = () => {
        this.setState({
            manualShow : false, 
        })
    }

    onEditOk = async ()=>{
        this.setState({
            loading : true
        });
        let payload = this.composeparams("manual",this.state.upbandTmp,this.state.downbandTmp);
        let response = await common.fetchWithCode(
            'QOS_SET',
            {method : 'POST', data : payload}
        ).catch(ex=>{})
        let {errcode, message} = response;
        if (errcode == 0){
            this.setState({
                manualShow :false,
                loading : false
            });
            this.getBandInfo();
            return;
        }
        this.setState({
            loading : false
        })
        Modal.error({titile : 'QOS设置失败', content : message});
    }

    onSpeedFailCancle = () => {
        this.setState({
            speedFail:false,
        })
    }

    onSpeedFillCancle = () => {
        this.setState({
            speedFill:false,
        })
    }

    onPercentChange = () =>{
        this.setState({
            visible:true,
        });
        let handleTime = setInterval(() => {
            this.setState({
                    percent: this.state.percent + 1
            }, () =>{
                if (this.state.percent >= 100){
                    this.setState({
                        visible: false,
                        percent: 0
                    });
                    clearInterval(handleTime); 
                }
                if (this.state.speedFail === true || this.state.speedFill === true ){
                    clearInterval(handleTime); 
                }
            })
        }, 1000);
        this.speedTestStatus();
    }

    //获取QoS数据
    getBandInfo = async ()=>{
        let response = await common.fetchWithCode(
            'QOS_GET',
            {method : 'POST'},
            {
                loop : true,
                interval : 3000,
                stop : ()=>this.stop
            }
        ).catch(ex=>{});

        let {data, errcode, message} = response;
        if (errcode == 0){
            let qos = data[0].result.qos;
            this.setState({
                upband : qos.up_bandwidth.replace(/[A-Za-z]+/,''),
                downband : qos.down_bandwidth.replace(/[A-Za-z]+/,''),
                unit : qos.up_bandwidth.replace(/[0-9]+/,''),
                sunmi : qos.sunmi_weight,
                white : qos.white_weight,
                normal : qos.normal_weight,
                bandenable : qos.enable
            })
            return;
        }

        Modal.error({ title: '路由器QoS模块信息获取失败', content: message});
    }

    //定义数据格式
    composeparams(val,upband,downband){
        let qos = {}, {bandenable, upbandTmp, downbandTmp, sunmi, white, normal} = this.state;
        qos['enable'] = bandenable;
        qos['source'] = val;
        qos['up_bandwidth'] = upband + 'Mbps';
        qos['down_bandwidth'] = downband + 'Mbps';
        qos['sunmi_weight'] = sunmi;
        qos['white_weight'] = white;
        qos['normal_weight'] = normal;

        return {qos};
    }

    componentDidMount(){
        this.stop = false;
        this.getBandInfo();
    }

    componentWillUnmount(){
        this.stop = true
    }

    post = async ()=>{
        this.setState({
            buttonloading : true
        })
        let payload = this.composeparams("default",this.state.upband,this.state.downband);
        let response = await common.fetchWithCode(
            'QOS_SET',
            {method : 'POST', data : payload}).catch(ex=>{}
        )
        let {errcode, message} = response;
        if (errcode == 0){
            this.setState({
                buttonloading : false
            });
            this.getBandInfo();
            return;
        }
        Modal.error({titile : 'QOS设置失败', content : message});
    }

    

    render(){
        const {bandunset, unit,loading, bandenable, visible, percent, manualShow, speedFail, 
            speedFill, failTip, upband, downband, disable, sunmi, 
            white,normal, sunmiTip, whiteTip, normalTip, upbandTmp, downbandTmp, buttonloading} = this.state;
        const columns = [{
            title : '设备类型',
            dataIndex : 'type'
        },{
            title : '带宽分配优先级',
            dataIndex : 'priority'
        },{
            title : '最低保证比例',
            dataIndex : 'percent',
            render: (text,record) =><div>
                        <FormItem type="small" style={{ width: 100, marginBottom : 0 }}>
                            <label style={{ position: 'absolute', right: -20, top: 0, zIndex: 1 }}>%</label>
                            <Input style={{height : 28}} type="text" value={text} onChange={value => this.onChange(value, record.key)} />
                            <label style={{ position: 'absolute', right: -231, top: 0,color : 'red', zIndex: 1 }}>{record.errorTip}</label>
                        </FormItem> 
                    </div>   
        }]
    
        const data = [{
            key : 'sunmi',
            type : '商米设备',
            priority : '高',
            percent : sunmi,
            errorTip : sunmiTip
        },{
            key : 'white',
            type : '优先设备',
            priority : '中',
            percent : white,
            errorTip : whiteTip
        },{
            key : 'normal',
            type : '普通设备',
            priority : '低',
            percent : normal,
            errorTip : normalTip
        }]  

        return (
            <div style={{paddingLeft : 60}}>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="总带宽" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
                <section className="band-value">
                    <div className="band-size">{upband}
                        <span className="band-unit">{unit}</span>
                        <span className="band-bottom">上行带宽<span className="icon-band"><CustomIcon size={12} color="blue" type="kbyte"/></span></span>
                    </div>
                    <div className="band-line"></div> 
                    <div className="band-size">{downband}
                        <span className="band-unit">{unit}</span>
                        <span className="band-bottom">下行带宽<span className="icon-band"><CustomIcon size={12} color="green" type="downloadtraffic"/></span></span>
                    </div>
                </section>
                <section style={{margin:"20px 20px 20px 0"}}>
                        <Button style={{marginRight:20,width : 116}} onClick={this.onPercentChange}>自动设置</Button>
                        <Button style={{width : 116}} onClick={this.showManual}>手动设置</Button>
                </section>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="网速智能分配" checkable={true} checked={bandenable} onChange={this.OnBandEnable}/>
                        <div className="speed-distribution"><CustomIcon size={16} color="gray" type="help"/></div>
                    </section>
                    {
                        bandenable ?  <Bandon columns={columns} data={data} post={this.post} loading={buttonloading}/> : <Bandclose />
                    }
                </Form>
                <Modal closable={false} footer={null} visible={visible} centered={true}>
                    <div className="percent-position">{percent}%</div>
                    <Progress percent={percent} strokeColor="orange" showInfo={false}/>
                    <div className="progress-position">测速中，请稍后…</div>
                </Modal>

                <Modal title='手动设置带宽' okText="确定" cancelText="取消" 
                    onOk={this.onEditOk} onCancel={this.onEditCancle} maskClosable={false}
                    closable={false} visible={manualShow} 
                    centered={true} width={360} 
                    okButtonProps={{disabled : this.state.disable}}
                    confirmLoading={loading}
                    >
                    <label style={{ marginTop: 24 }}>上行总带宽</label>
                        <FormItem type="small" style={{ width: 320 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>{unit}</label>
                            <Input type="text" value={upbandTmp} onChange={value => this.onChange(value, 'upbandTmp')} placeholder="请输入上行总带宽" />
                        </FormItem>                    
                    <label style={{ marginTop: 24 }}>下行总带宽</label>
                        <FormItem  type="small" style={{ width: 320 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>{unit}</label>
                            <Input type="text" value={downbandTmp} onChange={value => this.onChange(value, 'downbandTmp')} placeholder="请输入下行总带宽" />
                        </FormItem>
                </Modal>
                <Modal closable={false} visible={speedFill} centered={true} footer={null}>
                    <div className="progress-test">
                        <CustomIcon color="lightgreen" type="succeed" size={64}/>
                        <div className="speedfill">带宽测速完成!</div>
                    </div>
                    <div className="band-line">
                        <CustomIcon color="blue" type="kbyte" size={16}/>
                        <label>上行带宽：{upband}{unit}</label>
                    </div>
                    <div className="band-line">
                        <CustomIcon color="green" type="downloadtraffic" size={16}/>
                        <label>上行带宽：{downband}{unit}</label>
                    </div>
                    <section className="speed-bottom">
                            <Button className="speed-button" type="primary" onClick={this.onSpeedFillCancle}>确定</Button>
                    </section>
                </Modal>
                <Modal closable={false} visible={speedFail} centered={true} footer={null}>
                    <div className="progress-test">
                        <CustomIcon color="red" type="defeated" size={64}/>
                        <div className="speedfill">带宽测速失败，请重试</div>
                        <div style={{marginBottom : 32, marginTop : 6,fontSize : 12}}>{failTip}</div>
                    </div>
                    <section className="speed-bottom">
                            <Button className="speed-button" type="primary" onClick={this.onSpeedFailCancle}>我知道了</Button>
                    </section>
                </Modal>
                <Modal closable={false} mask={false} visible={bandunset} footer={null} width={170} style={{padding : 10,top : 78}}>
                    <div className="band-line" style={{margin : 0, padding : 0}}>
                        <CustomIcon color="orange" type="clean" size={14}  />
                        <label style={{fontSize : 14,marginLeft : 6}}>请先设置总带宽</label>
                    </div>
                </Modal>
            </div>
        );
    }
};

const Bandclose = props => {
    return (
        <p>"网速智能分配"启用后，路由器会根据设备优先级调配带宽，当网络繁忙时，最低保证比例的设置可以保证最低优先级设备也可以上网。</p>
     )
}

const Bandon = props => {
     return [
    <div key='speedbutton'>
        <Table className="anti-table" style={{fontSize : 16}}  pagination={false} columns={props.columns} dataSource={props.data} />,
        <section className="wifi-setting-save" style={{marginTop:30}}>
            <Button  style={{left:0}} className="wifi-setting-button" type="primary" loading={props.loading} onClick={props.post}>保存</Button>
        </section>
     </div>
    ]
} 

