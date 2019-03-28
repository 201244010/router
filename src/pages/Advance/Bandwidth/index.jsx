import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Table, Modal, message } from 'antd';
import Progress from '~/components/Progress';
import { TIME_SPEED_TEST } from '~/assets/common/constants';
import {checkRange} from '~/assets/common/check';
import CustomIcon from '~/components/Icon';
import SubLayout from '~/components/SubLayout';

const MODULE = 'bandwidth';

const {FormItem, Input, ErrorTip} = Form;
import './bandwidth.scss';

export default class Bandwidth extends React.PureComponent {
    constructor(props) {
        super(props);
        this.err = {
            '-1001': intl.get(MODULE, 0)/*_i18n:参数格式错误*/,
            '-1002': intl.get(MODULE, 1)/*_i18n:参数非法*/,
            '-1005': intl.get(MODULE, 2)/*_i18n:内存不足，无法进行测速*/,
            '-1007': intl.get(MODULE, 3)/*_i18n:网络异常，无法进行测速*/,
        }
    }
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
        failTip: intl.get(MODULE, 4)/*_i18n:网络未连接*/,
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
                    who : intl.get(MODULE, 5)/*_i18n:上行带宽*/
                }
            },
            downbandTmp : {
                func : checkRange,
                args : {
                    min : 1,
                    max : 1000,
                    who : intl.get(MODULE, 6)/*_i18n:下行带宽*/
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
                    who: intl.get(MODULE, 7)/*_i18n:带宽比例*/,
                }
            },
            white: {
                func: checkRange,
                args: {
                    min: 0,
                    max: 100,
                    who: intl.get(MODULE, 7)/*_i18n:带宽比例*/,
                }
            },
            normal: {
                func: checkRange,
                args: {
                    min: 0,
                    max: 100,
                    who: intl.get(MODULE, 7)/*_i18n:带宽比例*/,
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
                return intl.get(MODULE, 8)/*_i18n:带宽比例总和不能大于100%*/ === stateTip || '' === stateTip
             });

            if (ok) {
                const { sunmi, white, normal } = this.state;
                let total = parseInt(sunmi) + parseInt(white) + parseInt(normal);
                if (total > 100) {
                    this.setState({
                        [key + 'Tip']: intl.get(MODULE, 9)/*_i18n:带宽比例总和不能大于100%*/,
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
            message.error(intl.get(MODULE, 10)/*_i18n:请先设置带宽*/);
            return;
        }else{
            this.setState({
                bandenable: value,
            });
        }
    }

    speedTestStatus = async () => {
        let resp = await common.fetchApi({ opcode :'WANWIDGET_SPEEDTEST_START' });

        if(0 !== resp.errcode) {
            message.error(this.err[resp.errcode]);
            return;
        }

        this.setState({ visible: true });
        let response = await common.fetchApi(
            {opcode : 'WANWIDGET_SPEEDTEST_INFO_GET'},
            {},
            {
                interval : 3000,
                stop : ()=>this.stop,
                pending : res => res.data[0].result.speedtest.status === "testing"
            }
        );
        this.setState({ visible: false });

        let { errcode: code, data } = response;
        let info = data[0].result.speedtest;

        if (0 !== code) {
           return;
        }

        if ("ok" === info.status) {
            this.setState({
                speedFill : true,
                upband : (info.up_bandwidth / 1024).toFixed(0),
                downband : (info.down_bandwidth / 1024).toFixed(0),
                source : 'speedtest'
            });
            let payload = this.composeparams("speedtest",this.state.upband,this.state.downband);
            common.fetchApi({
                opcode : 'QOS_SET',
                data : payload
            })
        }

        if ("fail" === info.status) {
            this.setState({
                speedFail : true
            });
        }
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
            message.error(intl.get(MODULE, 11, {error: errcode})/*_i18n:配置失败[{error}]*/);
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
        message.error(intl.get(MODULE, 12, {error: errcode})/*_i18n:信息获取失败![{error}]*/);
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
            message.error(intl.get(MODULE, 13)/*_i18n:请先设置带宽*/);
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
                message.success(intl.get(MODULE, 14)/*_i18n:配置生效*/);
                this.getBandInfo();
                this.setState({ loading: false });
                return;
            }
            this.setState({ loading: false });
            message.error(intl.get(MODULE, 11, {errcode})/*_i18n:配置失败[{error}]*/);
        })
    }

    render(){
        const { saveDisable, unit, bandenable, visible, manualShow, speedFail, 
            speedFill, failTip, upband, downband, disable, sunmi,  
            white, normal, sunmiTip, whiteTip, normalTip, upbandTmp, downbandTmp, upbandTmpTip, downbandTmpTip, loading,btloading } = this.state;
        const columns = [{
            title : intl.get(MODULE, 15)/*_i18n:设备类型*/,
            dataIndex : 'type'
        },{
            title : intl.get(MODULE, 16)/*_i18n:带宽分配优先级*/,
            dataIndex : 'priority'
        },{
            title : intl.get(MODULE, 17)/*_i18n:最低保证比例*/,
            dataIndex : 'percent',
            render: (text,record) =><div>
                <FormItem type="small" style={{marginBottom : 0,position: 'relative'}}>
                    <div className="qos-input">
                        <Input  style={{height : 28}} disabled={!bandenable} maxLength={3} type="text" value={text} onChange={value => this.onChange(value, record.key)} />
                    </div>
                    <label>%</label>
                    <p className="qos-tip">{record.errorTip}</p>
                </FormItem> 
            </div>   
        }]
    
        const data = [{
            key : 'sunmi',
            type : intl.get(MODULE, 18)/*_i18n:商米设备*/,
            priority : intl.get(MODULE, 19)/*_i18n:高*/,
            percent : sunmi,
            errorTip : sunmiTip
        },{
            key : 'white',
            type : intl.get(MODULE, 20)/*_i18n:优先设备*/,
            priority : intl.get(MODULE, 21)/*_i18n:中*/,
            percent : white,
            errorTip : whiteTip
        },{
            key : 'normal',
            type : intl.get(MODULE, 22)/*_i18n:普通设备*/,
            priority : intl.get(MODULE, 23)/*_i18n:低*/,
            percent : normal,
            errorTip : normalTip
        }]  

        return (
            <SubLayout className="settings">
                <div>
                    {/* <a href="javascript:history.go(-1)" style={{color: 'black'}}>返回上一页</a>                  */}
                    <Form style={{width : '100%',marginTop : 0, paddingLeft : 60}}>
                    <section className="wifi-setting-item">
                        <PanelHeader
                            title={intl.get(MODULE, 24)/*_i18n:总带宽*/}
                            tip={intl.get(MODULE, 25)/*_i18n:自动测速结果受环境因素影响会有不同程度波动，如测试结果与实际不符，建议您采用手动方式设置*/}
                            checkable={false}
                            onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                    <section className="band-value">
                        <div className="band-size">
                            <div className="band-left">{upband}</div>
                            <div className="band-right">
                                <span className="band-unit">{unit}</span>
                                <span className="band-unit">{intl.get(MODULE, 26)/*_i18n:上行带宽*/}
                                    <span style={{marginLeft: 8}}><CustomIcon style={{paddingBottom:3}} size={12} color="#3D76F6" type="kbyte"/></span>
                                </span>
                            </div>
                        </div>
                        <div className="band-line"></div> 
                        <div className="band-size">
                            <div className="band-left">{downband}</div>
                            <div className="band-right">
                                <span className="band-unit">{unit}</span>
                                <span className="band-unit">{intl.get(MODULE, 27)/*_i18n:下行带宽*/}
                                    <span style={{marginLeft: 8}}><CustomIcon style={{paddingBottom:3}} size={12} color="#87D068" type="downloadtraffic"/></span>
                                </span>
                            </div>
                        </div>
                    </section>
                    <section style={{margin:"16px 20px 32px 0"}}>
                            <Button style={{marginRight:20,width : 116}} onClick={this.onPercentChange}>{intl.get(MODULE, 28)/*_i18n:自动测速*/}</Button>
                            <Button style={{width : 116}} onClick={this.showManual}>{intl.get(MODULE, 29)/*_i18n:手动设置*/}</Button>
                    </section>
                    <section>
                        <PanelHeader title={intl.get(MODULE, 43)/*_i18n:网速智能分配*/} checkable={true} checked={bandenable} tip={intl.get(MODULE, 30)/*_i18n:启用后，当网络带宽占满时，路由器将按照设置的最低保证比例为三类设备划分带宽，进而保证核心设备业务正常处理*/} onChange={this.OnBandEnable}/>
                        <Table className="qos-table" style={{fontSize : 16,marginTop:12}}  pagination={false} columns={columns} dataSource={data} />
                    </section>
                </Form>
                <section className="save">
                    <Button disabled={saveDisable} size='large' style={{ width: 320 }} type="primary" loading={loading} onClick={this.post}>{intl.get(MODULE, 31)/*_i18n:保存*/}</Button>
                </section>
                {visible &&
                    <Progress
                        duration={TIME_SPEED_TEST}
                        title={intl.get(MODULE, 32)/*_i18n:正在进行网络测速，请耐心等待…*/}
                        showPercent={true}
                    />
                }
                <Modal title={intl.get(MODULE, 33)/*_i18n:手动设置带宽*/} okText={intl.get(MODULE, 39)/*_i18n:确定*/} cancelText={intl.get(MODULE, 34)/*_i18n:取消*/} 
                    onOk={this.onEditOk} onCancel={this.onEditCancle} maskClosable={false}
                    closable={false} visible={manualShow} 
                    centered={true} width={360} 
                    okButtonProps={{disabled : this.state.disable ,loading: btloading}}
                    >
                    <label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 35)/*_i18n:上行总带宽*/}</label>
                    <FormItem showErrorTip={upbandTmpTip} type="small" >
                        <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>{unit}</label>
                        <Input type="text" value={upbandTmp} maxLength={4} onChange={value => this.onbandChange(value, 'upbandTmp')} placeholder={intl.get(MODULE, 36)/*_i18n:请输入上行总带宽*/} />
                        <ErrorTip>{upbandTmpTip}</ErrorTip>
                    </FormItem>
                    <label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 37)/*_i18n:下行总带宽*/}</label>
                    <FormItem showErrorTip={downbandTmpTip} type="small" style={{ marginBottom: 8 }}>
                        <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 }}>{unit}</label>
                        <Input type="text" value={downbandTmp} maxLength={4} onChange={value => this.onbandChange(value, 'downbandTmp')} placeholder={intl.get(MODULE, 38)/*_i18n:请输入下行总带宽*/} />
                        <ErrorTip>{downbandTmpTip}</ErrorTip>
                    </FormItem>
                </Modal>
                <Modal className='speed-result-modal' width={560} closable={false} visible={speedFill} centered={true} 
                footer={<Button type="primary" onClick={this.onSpeedFillCancle}>{intl.get(MODULE, 39)/*_i18n:确定*/}</Button>}>
                    <div className='status-icon'>
                        <CustomIcon color="#87D068" type="succeed" size={64}/>   
                    </div>
                    <h4>{intl.get(MODULE, 40)/*_i18n:带宽测速完成*/}</h4>
                    <ul className='speed-result'>
                        <li>
                            <CustomIcon color="#779FF8" type="kbyte" size={16}/>
                            <label><span style={{color:'#adb1b9'}}>{intl.get(MODULE, 44)/*_i18n:上行带宽：*/}</span><span>{upband}{unit}</span></label>
                        </li>
                        <li>
                            <CustomIcon color="#ABDE95" type="downloadtraffic" size={16}/>
                            <label><span style={{color:'#adb1b9'}}>{intl.get(MODULE, 45)/*_i18n:下行带宽：*/}</span><span>{downband}{unit}</span></label>
                        </li>
                    </ul>
                </Modal>
                <Modal className='speed-result-modal' width={560} closable={false} visible={speedFail} centered={true} 
                footer={<Button type="primary" onClick={this.onSpeedFailCancle}>{intl.get(MODULE, 41)/*_i18n:我知道了*/}</Button>}>
                    <div className="status-icon">
                        <CustomIcon color="red" type="defeated" size={64}/>
                    </div>
                    <div style={{ textAlign:'center',fontSize: 16,color: '#333C4F'}}>{intl.get(MODULE, 42)/*_i18n:带宽测速失败，请重试*/}</div>
                    <div style={{ textAlign:'center',margin: '4px auto 6px'}}>   
                        <div style={{fontSize : 12,color: '#ADB1B9'}}>{failTip}</div>
                    </div>   
                </Modal>
            </div>
        </SubLayout>
        );
    }
};


