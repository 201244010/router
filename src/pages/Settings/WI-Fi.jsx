
import React from 'react';
import { Checkbox, Select,Button,Radio } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";

const {FormItem, ErrorTip, Input} = Form;
const Option = Select.Option;
const RadioGroup=Radio.Group;



export default class WIFI extends React.Component {
    state = {
        channelType: true,
        hostSsid : '主Wi-Fi',
        hostSsidPasswrod : '',
        hostSsidPasswordDisabled : false,
        guestSsid : '客Wi-Fi',
        guestSsidPasswrod:'',
        guestSsidPasswordDisabled:false,
        merge : true,
        encryption : 11,
        way:2,
        PWDType:'none',
        channelWidth:11,
        signal:11,
        hostSwitch:true,
        disabledType:false,
        hiddenType:false,
        guestSwitch:true,
        disabledType2:false,
        timeCyc : '456',
        displayType:'none',
        //2.4G
        host24Swtich:true,
        hostSsid24:'主Wi-Fi2.4',
        hostSsid24Passwrod:'',
        hostSsid24PasswordDisabled:false,
        encryption24:11,
        channelWidth24:11,
        way24:2,
        signal24:11,
        disabledType24:false,
        //5G
        host5Swtich:true,
        hostSsid5:'主Wi-Fi5',
        hostSsid5Passwrod:'',
        hostSsid5PasswordDisabled:false,
        encryption5:11,
        channelWidth5:11,
        way5:2,
        signal5:11,
        disabledType5:false,
        //more
        moreSettingType:'pulldown',
        moreDisplaydHost:'none',
        moreSettingType24:'pulldown',
        moreDisplaydHost24:'none',
        moreSettingType5:'pulldown',
        moreDisplaydHost5:'none',
    };
    onChange = (name,value) =>{
        this.setState({
            [name]:value
        });
    }

    onPWDTypeChange = e =>{
        this.setState({
            PWDType:e.target.value,
            displayType:e.target.value
        });
    }
    onHostSwitchChange = type =>{
        this.setState({
            hostSwitch:type,
            disabledType:!type,
            hiddenType:!type,
            hostSsidPasswordDisabled:!type
        });
    }
    onguestSwitchChange = type =>{
        this.setState({
            guestSwitch:type,
            disabledType2:!type,
            guestSsidPasswordDisabled:!type
        });
    }
 
    //2.4G
    onHiddenWifi24Change = checked =>{
        this.setState({

        });
    }
 
    onHost24SwitchChange = type =>{
        this.setState({
            host24Swtich:type,
            disabledType24:!type,
            hostSsid24PasswordDisabled:!type,
        });
    }

    //5G
    onHiddenWifi5Change = checked =>{
        this.setState({

        });
    }

    onHost5SwitchChange = type =>{
        this.setState({
            host5Swtich:type,
            disabledType5:!type,
            hostSsid5PasswordDisabled:!type,
        });
    }

    //更多设置
    moreSetting = (e) =>{
        this.setState({
            moreSettingType:(this.state.moreSettingType=='pulldown'?'pullup':'pulldown'),
            moreDisplaydHost:(this.state.moreSettingType=='pulldown'?'block':'none')
        });
    }

    moreSetting24 = (e) =>{
        this.setState({
            moreSettingType24:(this.state.moreSettingType24=='pulldown'?'pullup':'pulldown'),
            moreDisplaydHost24:(this.state.moreSettingType24=='pulldown'?'block':'none')
        });
    }

    moreSetting5 = (e) =>{
        this.setState({
            moreSettingType5:(this.state.moreSettingType5=='pulldown'?'pullup':'pulldown'),
            moreDisplaydHost5:(this.state.moreSettingType5=='pulldown'?'block':'none')
        });
    }

    render(){
        const { channelType,hostSsid, hostSsidPasswrod, encryption, hostSsidPasswordDisabled,guestSsid,guestSsidPasswrod,guestSsidPasswordDisabled,way,PWDType,channelWidth,signal,disabledType,hostSwitch,hiddenType,guestSwitch,disabledType2,timeCyc,displayType,host24Swtich,hostSsid24,hostSsid24PasswordDisabled,hostSsid24Passwrod,encryption24,channelWidth24,way24,signal24,disabledType24,host5Swtich,hostSsid5,hostSsid5PasswordDisabled,hostSsid5Passwrod,encryption5,channelWidth5,way5,signal5,disabledType5,moreSettingType,moreDisplaydHost,moreSettingType24,moreDisplaydHost24,moreSettingType5,moreDisplaydHost5} = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="双频合一" checkable={true} checked={channelType} onChange={(value)=>this.onChange('channelType',value)}/>
                        <p>2.4G和5G信号合并显示，终端自动适配更优的信号，推荐勾选</p>
                    </section>
                    {this.state.channelType ? (
                    <section className="wifi-setting-item">
                        <PanelHeader title="商户Wi-Fi" checkable={true} checked={hostSwitch} onChange={this.onHostSwitchChange} />
                        <label>Wi-Fi名称</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" value={hostSsid} onChange={(value)=>this.onChange('hostSsid',value)} disabled={disabledType}/>
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>Wi-Fi密码</label></li>
                            <li><Checkbox onChange={(value)=>this.onChange('hostSsidPasswordDisabled',value)} disabled={disabledType}>不设密码</Checkbox></li>
                        </ul>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" disabled={hostSsidPasswordDisabled} value={hostSsidPasswrod} onChange={(value)=>this.onChange('hostSsidPasswrod',value)} />
                        </FormItem>  
                        <div className="ui-t3 ui-mute more" onClick={this.moreSetting}>
                            更多设置 <CustomIcon type={moreSettingType} size={14} />
                        </div>
                        <div style={{display:moreDisplaydHost}}>
                        <label>加密方式</label>
                        <Select value={encryption} style={{ width: 320 }} disabled={disabledType} onChange={(value)=>this.onChange('encryption',value)}>
                            <Option value={11}>混合加密(WAP/WAP2个人版)</Option>
                            <Option value={22}>22</Option>
                        </Select>
                        </div>  
                    </section>
                    ):(
                    <section className="wifi-setting-item">
                        <PanelHeader title="商户Wi-Fi" checkable={false} checked={false} /> 
                        <section className="wifi-setting-twocolumn">
                            <section>
                                <PanelHeader title="2.4G信号" checkable={true} checked={host24Swtich} onChange={this.onHost24SwitchChange}/> 
                                <label>Wi-Fi名称</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24} />
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox onChange={(value)=>this.onChange('hostSsid24PasswordDisabled',value)} disabled={disabledType24}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="password" disabled={hostSsid24PasswordDisabled} value={hostSsid24Passwrod} onChange={(value)=>this.onChange('hostSsid24Passwrod',value)} />
                                </FormItem>  
                                <div className="ui-t3 ui-mute more" onClick={this.moreSetting24}>
                                    更多设置 <CustomIcon type={moreSettingType24} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost24}}>
                                <ul className="ui-tiled compact">
                                    <li><Checkbox onChange={this.onHiddenWifi24Change} disabled={disabledType24}>隐藏网络不被发现</Checkbox></li>
                                </ul>
                                <label>加密方式</label>
                                <Select value={encryption24} onChange={(value)=>this.onChange('encryption24',value)} style={{ width: 320 }} disabled={disabledType24}>
                                    <Option value={11}>混合加密(WAP/WAP2个人版)</Option>
                                    <Option value={22}>22</Option>
                                </Select>
                                <label>频道带宽</label>
                                <Select value={channelWidth24} onChange={(value)=>this.onChange('channelWidth24',value)} style={{ width: 320 }} disabled={disabledType24}>
                                    <Option value={11}>20M(抗干扰能力强)</Option>
                                    <Option value={22}>10M</Option>
                                </Select>
                                <label>无线信道</label> 
                                <Select value={way24} style={{width:320}} onChange={(value)=>this.onChange('way24',value)} disabled={disabledType24}>
                                    <Option value={2}>自动(当前信道2))</Option>
                                    <Option value={1}>信道1</Option>
                                </Select>
                                <label>信号强度</label>
                                <Select value={signal24} style={{ width: 320 }} onChange={(value)=>this.onChange('signal24',value)} disabled={disabledType24}>
                                    <Option value={11}>强</Option>
                                    <Option value={22}>弱</Option>
                                </Select>
                                </div>
                            </section>
                            <section>
                            <PanelHeader title="5G信号" checkable={true} checked={host5Swtich} onChange={this.onHost5SwitchChange}/> 
                                <label>Wi-Fi名称</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" value={hostSsid5} onChange={(value)=>this.onChange('hostSsid5',value)} disabled={disabledType5} />
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox onChange={(value)=>this.onChange('hostSsid5PasswordDisabled',value)} disabled={disabledType5}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="password" disabled={hostSsid5PasswordDisabled} value={hostSsid5Passwrod} onChange={(value)=>this.onChange('hostSsid5Passwrod',value)} />
                                </FormItem>  
                                <div className="ui-t3 ui-mute more" onClick={this.moreSetting5}>
                                    更多设置 <CustomIcon type={moreSettingType5} size={14}/>
                                </div>
                                <div style={{display:moreDisplaydHost5}}>
                                <ul className="ui-tiled compact">
                                    <li><Checkbox onChange={this.onHiddenWifi5Change} disabled={disabledType5}>隐藏网络不被发现</Checkbox></li>
                                </ul>
                                <label>加密方式</label>
                                <Select value={encryption5} onChange={(value)=>this.onChange('encryption5',value)} style={{ width: 320 }} disabled={disabledType5}>
                                    <Option value={11}>混合加密(WAP/WAP2个人版)</Option>
                                    <Option value={22}>22</Option>
                                </Select>
                                <label>频道带宽</label>
                                <Select value={channelWidth5} onChange={(value)=>this.onChange('channelWidth5',value)} style={{ width: 320 }} disabled={disabledType5}>
                                    <Option value={11}>20M(抗干扰能力强)</Option>
                                    <Option value={22}>10M</Option>
                                </Select>
                                <label>无线信道</label> 
                                <Select value={way5} style={{width:320}} onChange={(value)=>this.onChange('way5',value)} disabled={disabledType5}>
                                    <Option value={2}>自动(当前信道2))</Option>
                                    <Option value={1}>信道1</Option>
                                </Select>
                                <label>信号强度</label>
                                <Select value={signal5} style={{ width: 320 }} onChange={(value)=>this.onChange('signal5',value)} disabled={disabledType5}>
                                    <Option value={11}>强</Option>
                                    <Option value={22}>弱</Option>
                                </Select>
                                </div>
                            </section>
                        </section>
                    </section>
                    )}
                    <section className="wifi-setting-item">
                        <PanelHeader title="客人Wi-Fi" checkable={true} checked={guestSwitch} onChange={this.onguestSwitchChange} />
                        <label>Wi-Fi名称</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" value={guestSsid} onChange={(value)=>this.onChange('guestSsid',value)} disabled={disabledType2}/>
                        </FormItem>
                        <label>密码方式</label>
                        <RadioGroup onChange={this.onPWDTypeChange} value={PWDType} disabled={disabledType2}>
                            <Radio style={{display:'inline-block'}} value={'none'}>静态密码</Radio>
                            <Radio style={{display:'inline-block'}} value={'block'}>动态密码</Radio>
                        </RadioGroup>
                        <section style={{display:displayType}}>
                            <label>动态变更周期</label>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="text" value={timeCyc} onChange={(value)=>this.onChange('timeCyc',value)} disabled={disabledType2} />
                            </FormItem>
                            <ul className="ui-tiled compact">
                                <li><label>当前密码是：</label></li>
                                <li><p>123456</p></li>
                            </ul>    
                        </section>
                        <section style={{display:displayType=='none'?'block':'none'}}>
                            <ul className="ui-tiled compact">
                                <li><label>Wi-Fi密码</label></li>
                                <li><Checkbox onChange={(value)=>this.onChange('guestSsidPasswordDisabled',value)} disabled={disabledType2}>不设密码</Checkbox></li>
                            </ul>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="password" disabled={guestSsidPasswordDisabled} value={guestSsidPasswrod} onChange={(value)=>this.onChange('guestSsidPasswrod',value)} />
                            </FormItem>
                        </section>  
                    </section>
                    <section className="wifi-setting-save">
                        <Button className="wifi-setting-button" type="primary">保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
};







