
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Table, Modal, message } from 'antd';
import Progress from '~/components/Progress';
import { TIME_SPEED_TEST } from '~/assets/common/constants';
import {checkRange} from '~/assets/common/check';
import CustomIcon from '~/components/Icon';

const {FormItem, Input, ErrorTip} = Form;

import './bandwidth.scss';

export default class Bandwidth extends React.PureComponent {
    state = {
        visible:false,  //自动设置弹窗是否可见
        manualShow:false, //手动设置弹窗是否可见
        speedFill:false,//带宽测速完成弹窗是否可见
        speedFail:false,//带宽测速失败弹窗是否可见
        bandenable : false,
        upband : '--',
        downband : '--',
        source : '', //测速方式
        unit : 'Mbps',
        loading: false,

        //自动设置
        failTip:'网络未连接',
        speedTest : false, //1测速成功，0测速失败

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
        disable : true, //手动设置保存按钮灰显
        saveDisable : false,//保存按钮灰显
        upbandTmpTip : '',
        downbandTmpTip : '',
        btloading: false,
    };

    onbandChange = (val, key) => {
        let tip = '';
        let valid = {
            upbandTmp : {
                func : checkRange,
                args : {
                    min : 1,
                    max : 1000,
                    who : '上行带宽'
                }
            },
            downbandTmp : {
                func : checkRange,
                args : {
                    min : 1,
                    max : 1000,
                    who : '下行带宽'
                }
            }
        }
        tip = valid[key].func(val,valid[key].args);
        this.setState({
            [key] : val,
            [key + 'Tip'] : tip
        },() => {
            const { upbandTmp, downbandTmp, upbandTmpTip, downbandTmpTip } = this.state;
            this.setState({
                disable: upbandTmpTip !== '' || downbandTmpTip!=='' || upbandTmp === '' || downbandTmp === '',
            });
        });
    }

    onChange = (val, key) => {
        val = val.replace(/\D/g, '');

        let valid = {
            sunmi: {
                func: checkRange,
                args: {
                    min: 0,
                    max: 100,
                    who: '带宽比例',
                }
            },
            white: {
                func: checkRange,
                args: {
                    min: 0,
                    max: 100,
                    who: '带宽比例',
                }
            },
            normal: {
                func: checkRange,
                args: {
                    min: 0,
                    max: 100,
                    who: '带宽比例',
                }
            }
        };

        let tip = valid[key].func(val, valid[key].args);
        this.setState({
            [key]: val,
            [key + 'Tip']: tip,
        }, () => {
            let tips = ['sunmi', 'white', 'normal'];
            let ok = tips.every((tip) => { 
                let stateTip = this.state[tip + 'Tip'];
                return '带宽比例总和不能大于100%' === stateTip || '' === stateTip
             });

            if (ok) {
                const { sunmi, white, normal } = this.state;
                let total = parseInt(sunmi) + parseInt(white) + parseInt(normal);
                if (total > 100) {
                    this.setState({
                        [key + 'Tip']: '带宽比例总和不能大于100%',
                        saveDisable: true,
                    });
                    return;
                }else{
                    this.setState({
                        sunmiTip : '',
                        whiteTip : '',
                        normalTip : '',
                        saveDisable: false
                    });
                    return;
                }
            }

            this.setState({
                saveDisable: true,
            })
        })
    }

    OnBandEnable = async (value) => {
        let { source } = this.state;
        if(source === 'default'){
            message.error('请先设置带宽');
            return;
        }else{
            this.setState({
                bandenable: value,
            });
        }
    }

    speedTestStatus = async ()=> {
        common.fetchApi({
            opcode :'WANWIDGET_SPEEDTEST_START'
        }).then((resp => {
            const {errcode} = resp;
            if(errcode === 0){
                common.fetchApi(
                    {opcode : 'WANWIDGET_SPEEDTEST_INFO_GET'},
                    {},
                    {
                        interval : 3000,
                        stop : ()=>this.stop,
                        pending : res => res.data[0].result.speedtest.status === "testing"
                    }
                ).then((resp) => {
                    let {errcode:code, data} = resp;
                    if (code == 0){
                        let info = data[0].result.speedtest;
                        if(info.status === "ok"){
                            this.setState({
                                speedFill : true,
                                visible : false,
                                upband : (info.up_bandwidth / 1024).toFixed(0),
                                downband : (info.down_bandwidth / 1024).toFixed(0),
                                source : 'speedtest'
                            });
                            let payload = this.composeparams("speedtest",this.state.upband,this.state.downband);
                            common.fetchApi({
                                opcode : 'QOS_SET',
                                data : payload
                            })
                        }else if(info.status === "fail"){
                            this.setState({
                                speedFail : true,
                                visible : false,
                            });
                            return;
                        }
                    }
                });
            }else{
                message.error(`获取测速失败![${errcode}]`);
            }
        }))
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
        this.setState({ btloading: true });
        let payload = this.composeparams("manual",this.state.upbandTmp,this.state.downbandTmp);
        await common.fetchApi({
            opcode : 'QOS_SET',
            data : payload
        }).then(response => {
            let { errcode } = response;
            if (errcode == 0){
                this.setState({
                    manualShow :false,
                    btloading: false,
                });
                this.getBandInfo();
                return;
            }
            this.setState({
                manualShow :false,
                btloading: false,
            });
            message.error(`配置失败![${errcode}]`);
        })
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
        this.speedTestStatus();
    }

    //获取QoS数据
    getBandInfo = async ()=>{
        let response = await common.fetchApi(
            {opcode : 'QOS_GET'},
        )

        let { data, errcode } = response;
        if (errcode == 0){
            let qos = data[0].result.qos;
            this.qosdata = qos;
            this.setState({
                source : qos.source,
                upband : qos.source === 'default' ? '--' :(qos.up_bandwidth / 1024).toFixed(0),
                downband : qos.source === 'default' ? '--' : (qos.down_bandwidth / 1024).toFixed(0),
                sunmi : qos.sunmi_weight,
                white : qos.white_weight,
                normal : qos.normal_weight,
                bandenable : qos.enable,
            })
            return;
        }
        message.error(`信息获取失败![${errcode}]`);
    }

    //定义数据格式
    composeparams(val,upband,downband){
        let qos = {}, {bandenable, sunmi, white, normal} = this.state;
        qos['enable'] = bandenable;
        qos['source'] = val;
        qos['up_bandwidth'] = parseInt(upband * 1024) + '';
        qos['down_bandwidth'] = parseInt(downband * 1024) + '';
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
        let { source } = this.state;
        if(source === 'default'){
            message.error('请先设置带宽');
            return;
        }
        this.setState({ loading: true });
        let payload = this.composeparams("manual",this.state.upband,this.state.downband);
        await common.fetchApi({
            opcode : 'QOS_SET',
            data : payload
        }).then(response => {
            let { errcode } = response;
            if (errcode == 0){
                message.success(`配置生效`);
                this.getBandInfo();
                this.setState({ loading: false });
                return;
            }
            this.setState({ loading: false });
            message.error(`配置失败![${errcode}]`);
        })
    }

    render(){
        const { saveDisable, unit, bandenable, visible, manualShow, speedFail, 
            speedFill, failTip, upband, downband, disable, sunmi,  
            white, normal, sunmiTip, whiteTip, normalTip, upbandTmp, downbandTmp, upbandTmpTip, downbandTmpTip, loading,btloading } = this.state;
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
                <FormItem type="small" style={{marginBottom : 0}}>
                    <div className="qos-input">
                        <Input  style={{height : 28}} disabled={!bandenable} maxLength={3} type="text" value={text} onChange={value => this.onChange(value, record.key)} /> 
                    </div>
                    <label>%</label>
                    <label className="qos-tip">{record.errorTip}</label>
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
            <div>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 60}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="总带宽" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                    <section className="band-value">
                        <div className="band-size">{upband}
                            <span className="band-unit">{unit}</span>
                            <span className="band-bottom">上行带宽<span className="icon-band"><CustomIcon size={12} color="#3D76F6" type="kbyte"/></span></span>
                        </div>
                        <div className="band-line"></div> 
                        <div className="band-size">{downband}
                            <span className="band-unit">{unit}</span>
                            <span className="band-bottom">下行带宽<span className="icon-band"><CustomIcon size={12} color="#87D068" type="downloadtraffic"/></span></span>
                        </div>
                    </section>
                    <section style={{margin:"16px 20px 32px 0"}}>
                            <Button style={{marginRight:20,width : 116}} onClick={this.onPercentChange}>自动测速</Button>
                            <Button style={{width : 116}} onClick={this.showManual}>手动设置</Button>
                    </section>
                    <section>
                        <PanelHeader title="网速智能分配" checkable={true} checked={bandenable} tip='启用后，当网络带宽占满时，路由器将按照设置的最低保证比例为三类设备划分带宽，进而保证核心设备业务正常处理' onChange={this.OnBandEnable}/>
                        <Table className="qos-table" style={{fontSize : 16,marginTop:12}}  pagination={false} columns={columns} dataSource={data} />
                    </section>
                </Form>
                <section className="save">
                    <Button disabled={saveDisable} size='large' style={{ width: 320 }} type="primary" loading={loading} onClick={this.post}>保存</Button>
                </section>
                {visible &&
                    <Progress
                        duration={TIME_SPEED_TEST}
                        title='正在进行网络测速，请耐心等待…'
                        showPercent={true}
                    />
                }
                <Modal title='手动设置带宽' okText="确定" cancelText="取消" 
                    onOk={this.onEditOk} onCancel={this.onEditCancle} maskClosable={false}
                    closable={false} visible={manualShow} 
                    centered={true} width={360} 
                    okButtonProps={{disabled : this.state.disable ,loading: btloading}}
                    >
                    <label style={{ display:'block',marginBottom: 6 }}>上行总带宽</label>
                        <FormItem showErrorTip={upbandTmpTip} type="small" style={{ width: 320 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>{unit}</label>
                            <Input type="text" value={upbandTmp} maxLength={4} onChange={value => this.onbandChange(value, 'upbandTmp')} placeholder="请输入上行总带宽" />
                            <ErrorTip>{upbandTmpTip}</ErrorTip>
                        </FormItem>
                    <label style={{ display:'block',marginBottom: 6 }}>下行总带宽</label>
                        <FormItem showErrorTip={downbandTmpTip} type="small" style={{ width: 320,marginBottom: 8 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>{unit}</label>
                            <Input type="text" value={downbandTmp} maxLength={4} onChange={value => this.onbandChange(value, 'downbandTmp')} placeholder="请输入下行总带宽" />
                            <ErrorTip>{downbandTmpTip}</ErrorTip>
                        </FormItem>
                </Modal>
                <Modal className='speed-result-modal' width={560} closable={false} visible={speedFill} centered={true} 
                footer={<Button type="primary" onClick={this.onSpeedFillCancle}>确定</Button>}>
                    <div className='status-icon'>
                        <CustomIcon color="#87D068" type="succeed" size={64}/>   
                    </div>
                    <h4>带宽测速完成</h4>
                    <ul className='speed-result'>
                        <li>
                            <CustomIcon color="#779FF8" type="kbyte" size={16}/>
                            <label>上行带宽：{upband}{unit}</label>
                        </li>
                        <li>
                            <CustomIcon color="#ABDE95" type="downloadtraffic" size={16}/>
                            <label>下行带宽：{downband}{unit}</label>
                        </li>
                    </ul>
                </Modal>
                <Modal width={560} closable={false} visible={speedFail} centered={true} footer={null}>
                    <div className="progress-test">
                        <CustomIcon color="red" type="defeated" size={64}/>
                        <div className="speedfill">带宽测速失败，请重试</div>
                        <div style={{marginBottom : 32, marginTop : 6,fontSize : 12}}>{failTip}</div>
                    </div>
                    <section className="speed-bottom">
                            <Button className="speed-button" type="primary" onClick={this.onSpeedFailCancle}>我知道了</Button>
                    </section>
                </Modal>
            </div>
        );
    }
};


