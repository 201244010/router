
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
        hostSsid : '123',
        hostSsidPasswrod : '',
        hostSsidPasswordDisabled : false,
        guestSsid : '456',
        guestSsidPasswrod:'',
        guestSsidPasswordDisabled:false,
        merge : true,
        encryption : 11,
        way:2,
        PWDType:1
    };

    onChannelChange= checked =>{
        this.setState({
            channelType:checked
        });
    }

    onHostSsidChange = value => {
        this.setState({
            hostSsid : value
        });
    }

    onHostPswChange = value => {
        this.setState({
            hostSsidPasswrod : value
        });
    }

    handleHostPassword = checked => {
        this.setState({
            hostSsidPasswordDisabled : checked
        });
    }
    
    onGuestSsidChange=value=>{
        this.setState({
            guestSsid:value
        });
    }

    handleGuestPassword=checked=>{
        this.setState({
            guestSsidPasswordDisabled:checked
        });
    }

    onGuestPswChange=value=>{
        this.setState({
            guestSsidPasswrod:value       
        });
    }

    onPWDTypeChange=e=>{
        this.setState({
            PWDType:e.target.value
        });
    }
    render(){
        const { channelType,hostSsid, hostSsidPasswrod, encryption, hostSsidPasswordDisabled,guestSsid,guestSsidPasswrod,guestSsidPasswordDisabled,way,PWDType} = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="双频合一" checkable={true} checked={channelType} onChange={this.onChannelChange}/>
                        <p>2.4G和5G信号合并显示，终端自动适配更优的信号，推荐勾选</p>
                    </section>
                    {channelType ? (
                    <section className="wifi-setting-item">
                        <PanelHeader title="主Wi-Fi" checkable={true} checked={true} />
                        <label>Wi-Fi名称</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" value={hostSsid} onChange={this.onHostSsidChange} />
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>Wi-Fi密码</label></li>
                            <li><Checkbox onChange={this.handleHostPassword}>不设密码</Checkbox></li>
                        </ul>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" disabled={hostSsidPasswordDisabled} value={hostSsidPasswrod} onChange={this.onHostPswChange} />
                        </FormItem>  
                        <div className="ui-t3 ui-mute more">
                            更多设置 <CustomIcon type="pulldown" size={14}/>
                        </div>  
                        <label>加密方式</label>
                        <Select value={this.state.encryption} style={{ width: 320 }}>
                            <Option value={11}>混合加密(WAP/WAP2个人版)</Option>
                            <Option value={22}>22</Option>
                        </Select>
                    </section>
                    ):(
                    <section className="wifi-setting-item">
                        <PanelHeader title="主Wi-Fi" checkable={false} checked={false} /> 
                        <section className="wifi-setting-twocolumn">
                            <section>
                                <PanelHeader title="2.4G信号" checkable={false} checked={false} /> 
                                <label>Wi-Fi名称</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" value={hostSsid} onChange={this.onHostSsidChange} />
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox onChange={this.handleHostPassword}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="password" disabled={hostSsidPasswordDisabled} value={hostSsidPasswrod} onChange={this.onHostPswChange} />
                                </FormItem>  
                                <div className="ui-t3 ui-mute more">
                                    更多设置 <CustomIcon type="pulldown" size={14}/>
                                </div>
                                <ul className="ui-tiled compact">
                                    <li><Checkbox onChange={this.hiddenWifi}>隐藏网络不被发现</Checkbox></li>
                                </ul>
                                <label>加密方式</label>
                                <Select value={this.state.encryption} style={{ width: 320 }}>
                                    <Option value={11}>混合加密(WAP/WAP2个人版)</Option>
                                    <Option value={22}>22</Option>
                                </Select>
                                <label>无线信道</label> 
                                <Select value={this.state.way} style={{width:320}}>
                                    <Option value={2}>自动(当前信道2))</Option>
                                    <Option value={1}>信道1</Option>
                                </Select>

                            </section>
                            <section>
                                <PanelHeader title="5G信号" checkable={false} checked={false} />
                                <label>Wi-Fi名称</label>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="text" value={hostSsid} onChange={this.onHostSsidChange} />
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox onChange={this.handleHostPassword}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="password" disabled={hostSsidPasswordDisabled} value={hostSsidPasswrod} onChange={this.onHostPswChange} />
                                </FormItem>  
                                <div className="ui-t3 ui-mute more">
                                    更多设置 <CustomIcon type="pulldown" size={14}/>
                                </div>  
                            </section>
                        </section>
                    </section>
                    )}
                    <section className="wifi-setting-item">
                        <PanelHeader title="客人Wi-Fi" checkable={true} checked={true} />
                        <label>Wi-Fi名称</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" value={guestSsid} onChange={this.onGuestSsidChange} />
                        </FormItem>
                        <label>密码方式</label>
                        <RadioGroup onChange={this.onPWDTypeChange} value={PWDType}>
                            <Radio style={{display:'inline-block'}} value={1}>静态密码</Radio>
                            <Radio style={{display:'inline-block'}} value={2}>动态密码</Radio>
                        </RadioGroup>
                        <ul className="ui-tiled compact">
                            <li><label>Wi-Fi密码</label></li>
                            <li><Checkbox onChange={this.handleGuestPassword}>不设密码</Checkbox></li>
                        </ul>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" disabled={guestSsidPasswordDisabled} value={guestSsidPasswrod} onChange={this.onGuestPswChange} />
                        </FormItem>  
                    </section>
                    <section className="wifi-setting-save">
                        <Button className="wifi-setting-button" type="primary">保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
};







