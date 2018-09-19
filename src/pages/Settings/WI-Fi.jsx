
import React from 'react';
import { Checkbox, Select, Button, Radio, Modal } from 'antd';
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
        guestSsidPassword:'',
        guestSsidPasswordDisabled:false,
        pwdForbid:false,
        guestPwdForbid:false,
        //merge : true,
        encryption : '',
        way:2,
        PWDType:'none',
        channelWidth:11,
        signal:11,
        hostEnable:true,
        disabledType:false,
        hiddenType:false,
        guestEnable:true,
        disabledType2:false,
        timeCyc : '456',
        displayType:'none',
        //2.4G
        host24Enable:true,
        hostSsid24:'主Wi-Fi2.4',
        hostSsid24Passwrod:'',
        hostSsid24PasswordDisabled:false,
        pwdForbid24:false,
        hide_ssid24:false,
        encryption24:'',
        htmode24:'HT80',
        channel24:'',
        signal24:11,
        disabledType24:false,
        //5G
        host5Enable:true,
        hostSsid5:'主Wi-Fi5',
        hostSsid5Passwrod:'',
        hostSsid5PasswordDisabled:false,
        pwdForbid5:false,
        hide_ssid5:false,
        encryption5:'',
        htmode5:'HT80',
        channel5:'',
        signal5:11,
        disabledType5:false,
        //more
        moreSettingType:'pulldown',
        moreDisplaydHost:'none',
        moreSettingType24:'pulldown',
        moreDisplaydHost24:'none',
        moreSettingType5:'pulldown',
        moreDisplaydHost5:'none',
        //tip
        tipHost : '',
        tipGuest : '',
        tip2g : '',
        tip5g : ''
    };
    onChange = (name,value) =>{
        this.setState({
            [name]:value
        });
        if(!value.trim().length){
            switch (name){
                case 'hostSsid' : this.setState({tipHost : '请输入Wi-Fi名称'});
                break;
                case 'guestSsid' : this.setState({tipGuest : '请输入Wi-Fi名称'});
                break;
                case 'hostSsid24' : this.setState({tip2g : '请输入Wi-Fi名称'});
                break;
                case 'hostSsid5' : this.setState({tip5g : '请输入Wi-Fi名称'});
                break;
            }
        }else{
            switch (name){
                case 'hostSsid' : this.setState({tipHost : ''});
                break;
                case 'guestSsid' : this.setState({tipGuest : ''});
                break;
                case 'hostSsid24' : this.setState({tip2g : ''});
                break;
                case 'hostSsid5' : this.setState({tip5g : ''});
                break;
            }
        }
    }

    onPWDTypeChange = e =>{
        this.setState({
            PWDType:e.target.value,
            displayType:e.target.value
        });
    }

    onHostEnableChange = type =>{
        this.setState({
            hostEnable:type,
            disabledType:!type,
            hiddenType:!type,
            hostSsidPasswordDisabled:!type
        });
        if(type==false){
            this.setState({tipHost:''});
        }else{
            if(!this.state.hostSsid.trim().length){
                this.setState({tipHost:'请输入Wi-Fi名称'});
            }else{
                this.setState({tipHost:''});
            }
        }
    }

    onGuestEnableChange = type =>{
        this.setState({
            guestEnable:type,
            disabledType2:!type,
            guestSsidPasswordDisabled:!type,
        });
        if(type==false){
            this.setState({tipGuest:''});
        }else{
            if(!this.state.guestSsid.trim().length){
                this.setState({tipGuest:'请输入Wi-Fi名称'});
            }else{
                this.setState({tipGuest:''});
            }
        }
    }

    onPwdForbidChange = e =>{
        this.setState({
            pwdForbid:e.target.checked,
            hostSsidPasswordDisabled:e.target.checked
        });
    }

    onGuestPwdForbidChange = e =>{
        this.setState({
            guestPwdForbid:e.target.checked,
            guestSsidPasswordDisabled:e.target.checked
        });
    }
     
    //2.4G
    onHost24EnableChange = type =>{
        this.setState({
            host24Enable: type,
            disabledType24:!type,
            hostSsid24PasswordDisabled:!type,
        });
        if(type==false){
            this.setState({tip2g:''});
        }else{
            if(!this.state.hostSsid24.trim().length){
                this.setState({tip2g:'请输入Wi-Fi名称'});
            }else{
                this.setState({tip2g:''});
            }
        }
    }

    onPwdForbid24Change = e =>{
        this.setState({
            pwdForbid24:e.target.checked,
            hostSsid24PasswordDisabled:e.target.checked  
        });
    }
    onHide_ssid24Change = e =>{
        this.setState({
            hide_ssid24:e.target.checked
        });
    }

    //5G
    onHost5EnableChange = type =>{
        this.setState({
            host5Enable:type,
            disabledType5:!type,
            hostSsid5PasswordDisabled:!type
        });
        if(type==false){
            this.setState({tip5g:''});
        }else{
            if(!this.state.hostSsid5.trim().length){
                this.setState({tip5g:'请输入Wi-Fi名称'});
            }else{
                this.setState({tip5g:''});
            }
        }
    }

    onPwdForbid5Change = e =>{
        this.setState({
            pwdForbid5:e.target.checked,
            hostSsid5PasswordDisabled:e.target.checked
        });
    } 

    onHide_ssid5Change = e =>{
        this.setState({
            hide_ssid5:e.target.checked
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

    submit = async ()=> {
        this.hostWireLess.band_division = this.state.channelType;
        this.guestWireLess.ssid = this.state.guestSsid;
        this.guestWireLess.password = btoa(this.state.guestSsidPassword);
        //pwdForbid : 是否设置密码
        //merge : true,
        //way:2,
        //PWDType:动态、静态密码,
        //channelWidth:11,
        //signal:11,
        this.guestWireLess.enable = this.state.guestEnable;         
        //timeCyc : guest wifi 密码更换周期,
        //displayType:是否显示动态密码的地方，与PWDType有关

        //2.4G
        this.hostWireLess.band_2g.enable = this.state.host24Enable;
        this.hostWireLess.band_2g.ssid = this.state.hostSsid24;
        this.hostWireLess.band_2g.password = btoa(this.state.hostSsid24Passwrod);
        this.hostWireLess.band_2g.hide_ssid = this.state.hide_ssid24;
        this.hostWireLess.band_2g.encryption = this.state.encryption24;
        this.hostWireLess.band_2g.htmode = this.state. htmode24;
        this.hostWireLess.band_2g.channel = this.state.channel24;
        //signal24:信号强弱

        //5G
        // this.hostWireLess.band_5g = this.state.band_5g;
        //Object.assign(this.hostWireLess.band_5g, this.state.band_5g);
        this.hostWireLess.band_5g.enable = this.state.host5Enable;
        this.hostWireLess.band_5g.ssid = this.state.hostSsid5;
        this.hostWireLess.band_5g.password = btoa(this.state.hostSsid5Passwrod);
        this.hostWireLess.band_5g.hide_ssid = this.state.hide_ssid5;
        this.hostWireLess.band_5g.encryption = this.state.encryption5;
        this.hostWireLess.band_5g.htmode = this.state.htmode5;
        this.hostWireLess.band_5g.channel = this.state. channel5;
        //signal5:信号强弱

        let response = await common.fetchWithCode(
            'WIRELESS_SET',
            { method : 'POST', data : { main : this.mainWireLess, guest : this.guestWireLess}}
        ).catch(ex => {});

        this.setState({ loading : false});
        
        let {errcode, message} = response;
        if(errcode == 0){
            this.setState({active : true});
            this.timer = setInterval(()=> {
                this.tick++;
                this.setState({ percent : this.state.percent += 0.1 }, function(){
                    if(this.state.percent >= 100){
                        this.setState({done : true});
                        clearInterval(this.timer);
                    }
                });
            }, 20);
        }
        Modal.error({ title : 'WI-FI设置失败', content : message });
    }

    format = ()=>{
        return this.tick + 'S';
    }

    async fetchWireLessInfo(){
        let response = await common.fetchWithCode('WIRELESS_GET', { method : 'POST' }, { handleError : true })
        let { errcode, data, message } = response;
        if(errcode == 0){
            let { main, guest } = data[0].result;
            this.mainWireLess = main;
            this.hostWireLess = main.host;
            this.guestWireLess = guest;
            this.setState({
                channelType : this.hostWireLess.band_division,
                hostSsid : this.hostWireLess.band_2g.ssid,
                hostSsidPasswrod : atob(this.hostWireLess.band_2g.password),
                hostSsidPasswordDisabled : !this.hostWireLess.band_2g.enable,
                guestSsid : this.guestWireLess.ssid,
                guestSsidPassword : atob(this.guestWireLess.password),
                guestSsidPasswordDisabled : !this.guestWireLess.enable,
                //pwdForbid : 是否设置密码
                //merge : true,
                encryption : this.hostWireLess.band_2g.encryption,
                //way:2,
                //PWDType:动态、静态密码,
                //channelWidth:11,
                //signal:11,
                hostEnable : this.hostWireLess.band_2g.enable,
                disabledType : !this.hostWireLess.band_2g.enable,
                hiddenType : !this.hostWireLess.band_2g.enable,
                guestEnable : this.guestWireLess.enable,
                disabledType2 : !this.guestWireLess.enable,
                //timeCyc : guest wifi 密码更换周期,
                //displayType:是否显示动态密码的地方，与PWDType有关

                //2.4G
                host24Enable : this.hostWireLess.band_2g.enable,
                hostSsid24 : this.hostWireLess.band_2g.ssid,
                hostSsid24Passwrod : atob(this.hostWireLess.band_2g.password),
                hostSsid24PasswordDisabled : !this.hostWireLess.band_2g.enable,
                hide_ssid24 : this.hostWireLess.band_2g.hide_ssid,
                encryption24 : this.hostWireLess.band_2g.encryption,
                htmode24 : this.hostWireLess.band_2g.htmode,
                channel24 : this.hostWireLess.band_2g.channel,
                //signal24:信号强弱
                disabledType24 : !this.hostWireLess.band_2g.enable,

                //5G
                host5Enable : this.hostWireLess.band_5g.enable,
                hostSsid5 : this.hostWireLess.band_5g.ssid,
                hostSsid5Passwrod : atob(this.hostWireLess.band_5g.password),
                hostSsid5PasswordDisabled : !this.hostWireLess.band_5g.enable,
                hide_ssid5 : this.hostWireLess.band_5g.hide_ssid,
                encryption5 : this.hostWireLess.band_5g.encryption,
                htmode5 : this.hostWireLess.band_5g.htmode,
                channel5 : this.hostWireLess.band_5g.channel,
                //signal5:信号强弱
                disabledType5 : !this.hostWireLess.band_5g.enable,

                //more
                moreSettingType:'pulldown',
                moreDisplaydHost:'none',
                moreSettingType24:'pulldown',
                moreDisplaydHost24:'none',
                moreSettingType5:'pulldown',
                moreDisplaydHost5:'none',
                
            });
            return;
        }
        Modal.error({title : 'wifi设置异常', message}); 
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }
    render(){
        const { channelType,hostSsid, hostSsidPasswrod, encryption, hostSsidPasswordDisabled,guestSsid,guestSsidPassword,pwdForbid,guestSsidPasswordDisabled,way,PWDType,channelWidth,signal,disabledType,hostEnable,hiddenType,guestEnable,disabledType2,timeCyc,displayType,guestPwdForbid,host24Enable,hostSsid24,hostSsid24PasswordDisabled,pwdForbid24,hostSsid24Passwrod,hide_ssid24,encryption24,htmode24,channel24,signal24,disabledType24,host5Enable,hostSsid5,hostSsid5PasswordDisabled,pwdForbid5,hostSsid5Passwrod,hide_ssid5,encryption5,htmode5,channel5,signal5,disabledType5,moreSettingType,moreDisplaydHost,moreSettingType24,moreDisplaydHost24,moreSettingType5,moreDisplaydHost5,tipHost,tipGuest,tip2g,tip5g} = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0,paddingLeft:0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="双频合一" checkable={true} checked={channelType} onChange={(value)=>this.onChange('channelType',value)}/>
                        <p>2.4G和5G信号合并显示，终端自动适配更优的信号，推荐开启</p>
                    </section>
                    {this.state.channelType ? (
                    <section className="wifi-setting-item">
                        <PanelHeader title="商户Wi-Fi" checkable={true} checked={hostEnable} onChange={this.onHostEnableChange} />
                        <label style={{marginTop:20}}>Wi-Fi名称</label>
                        <FormItem type="small" showErrorTip={tipHost} style={{ width : 320}}>
                            <Input type="text" value={hostSsid} onChange={(value)=>this.onChange('hostSsid',value)} disabled={disabledType}/>
                            <ErrorTip>{tipHost}</ErrorTip>
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>Wi-Fi密码</label></li>
                            <li><Checkbox checked={pwdForbid} onChange={this.onPwdForbidChange} disabled={disabledType}>不设密码</Checkbox></li>
                        </ul>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" disabled={hostSsidPasswordDisabled} value={hostSsidPasswrod} onChange={(value)=>this.onChange('hostSsidPasswrod',value)} />
                        </FormItem>  
                        <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting}>
                            更多设置 <CustomIcon type={moreSettingType} size={14} />
                        </div>
                        <div style={{display:moreDisplaydHost}}>
                        <label>加密方式</label>
                        <Select value={encryption} style={{ width: 320 }} disabled={disabledType} onChange={(value)=>this.onChange('encryption',value)}>
                            <Option value={'none'}>无</Option>
                            <Option value={'psk2+ccmp'}>1</Option>
                            <Option value={'psk2+ccmp+tkip'}>2</Option>
                            <Option value={'psk-mixed/ccmp'}>3</Option>
                            <Option value={'psk-mixed/ccmp+tkip'}>4</Option>
                        </Select>
                        </div>  
                    </section>
                    ):(
                    <section className="wifi-setting-item">
                        <PanelHeader title="商户Wi-Fi" checkable={false} checked={false} /> 
                        <section className="wifi-setting-twocolumn">
                            <section>
                                <PanelHeader title="2.4G信号" checkable={true} checked={host24Enable} onChange={this.onHost24EnableChange}/> 
                                <label>Wi-Fi名称</label>
                                <FormItem type="small" showErrorTip={tip2g} style={{ width : 320}}>
                                    <Input type="text" value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24} />
                                    <ErrorTip>{tip2g}</ErrorTip>
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="password" disabled={hostSsid24PasswordDisabled} value={hostSsid24Passwrod} onChange={(value)=>this.onChange('hostSsid24Passwrod',value)} />
                                </FormItem>  
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting24}>
                                    更多设置 <CustomIcon type={moreSettingType24} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost24}}>
                                <ul className="ui-tiled compact">
                                    <li><Checkbox checked={hide_ssid24} onChange={this.onHide_ssid24Change} disabled={disabledType24}>隐藏网络不被发现</Checkbox></li>
                                </ul>
                                <label>加密方式</label>
                                <Select value={encryption24} onChange={(value)=>this.onChange('encryption24',value)} style={{ width: 320 }} disabled={disabledType24}>
                                    <Option value={'none'}>无</Option>
                                    <Option value={'psk2+ccmp'}>1</Option>
                                    <Option value={'psk2+ccmp+tkip'}>2</Option>
                                    <Option value={'psk-mixed/ccmp'}>3</Option>
                                    <Option value={'psk-mixed/ccmp+tkip'}>4</Option>
                                </Select>
                                <label>频道带宽</label>
                                <Select value={htmode24} onChange={(value)=>this.onChange('htmode24',value)} style={{ width: 320 }} disabled={disabledType24}>
                                    <Option value={'auto'}>自动</Option>
                                    <Option value={'HT20'}>20M</Option>
                                    <Option value={'HT40'}>40M</Option>
                                    <Option value={'HT80'}>80M</Option>
                                </Select>
                                <label>无线信道</label> 
                                <Select value={channel24} style={{width:320}} onChange={(value)=>this.onChange('channel24',value)} disabled={disabledType24}>
                                    <Option value={'auto'}>自动(当前信道2))</Option>
                                    <Option value={'ban1'}>信道1</Option>
                                    <Option value={'ban2'}>信道2</Option>
                                    <Option value={'ban3'}>信道3</Option>
                                    <Option value={'ban4'}>信道4</Option>
                                </Select>
                                <label>信号强度</label>
                                <Select value={signal24} style={{ width: 320 }} onChange={(value)=>this.onChange('signal24',value)} disabled={disabledType24}>
                                    <Option value={11}>强</Option>
                                    <Option value={22}>弱</Option>
                                </Select>
                                </div>
                            </section>
                            <section>
                            <PanelHeader title="5G信号" checkable={true} checked={host5Enable} onChange={this.onHost5EnableChange}/> 
                                <label>Wi-Fi名称</label>
                                <FormItem type="small" showErrorTip={tip5g} style={{ width : 320}}>
                                    <Input type="text" value={hostSsid5} onChange={(value)=>this.onChange('hostSsid5',value)} disabled={disabledType5} />
                                    <ErrorTip>{tip5g}</ErrorTip>
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox checked={pwdForbid5} onChange={this.onPwdForbid5Change} disabled={disabledType5}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" style={{ width : 320}}>
                                    <Input type="password" disabled={hostSsid5PasswordDisabled} value={hostSsid5Passwrod} onChange={(value)=>this.onChange('hostSsid5Passwrod',value)} />
                                </FormItem>  
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting5}>
                                    更多设置 <CustomIcon type={moreSettingType5} size={14}/>
                                </div>
                                <div style={{display:moreDisplaydHost5}}>
                                <ul className="ui-tiled compact">
                                    <li><Checkbox checked={hide_ssid5} onChange={this.onHide_ssid5Change} disabled={disabledType5}>隐藏网络不被发现</Checkbox></li>
                                </ul>
                                <label>加密方式</label>
                                <Select value={encryption5} onChange={(value)=>this.onChange('encryption5',value)} style={{ width: 320 }} disabled={disabledType5}>
                                    <Option value={'none'}>无</Option>
                                    <Option value={'psk2+ccmp'}>1</Option>
                                    <Option value={'psk2+ccmp+tkip'}>2</Option>
                                    <Option value={'psk-mixed/ccmp'}>3</Option>
                                    <Option value={'psk-mixed/ccmp+tkip'}>4</Option>
                                </Select>
                                <label>频道带宽</label>
                                <Select value={htmode5} onChange={(value)=>this.onChange('htmode5',value)} style={{ width: 320 }} disabled={disabledType5}>
                                    <Option value={'auto'}>自动</Option>
                                    <Option value={'HT20'}>20M</Option>
                                    <Option value={'HT40'}>40M</Option>
                                    <Option value={'HT80'}>80M</Option>
                                </Select>
                                <label>无线信道</label> 
                                <Select value={channel5} style={{width:320}} onChange={(value)=>this.onChange('channel5',value)} disabled={disabledType5}>
                                    <Option value={'auto'}>自动(当前信道2))</Option>
                                    <Option value={'ban1'}>信道1</Option>
                                    <Option value={'ban2'}>信道2</Option>
                                    <Option value={'ban3'}>信道3</Option>
                                    <Option value={'ban4'}>信道4</Option>
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
                        <PanelHeader title="客人Wi-Fi" checkable={true} checked={guestEnable} onChange={this.onGuestEnableChange} />
                        <label style={{marginTop:20}}>Wi-Fi名称</label>
                        <FormItem type="small" showErrorTip={tipGuest} style={{ width : 320}}>
                            <Input type="text" value={guestSsid} onChange={(value)=>this.onChange('guestSsid',value)} disabled={disabledType2}/>
                            <ErrorTip>{tipGuest}</ErrorTip>
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
                                <li><Checkbox checked={guestPwdForbid} onChange={this.onGuestPwdForbidChange} disabled={disabledType2}>不设密码</Checkbox></li>
                            </ul>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="password" disabled={guestSsidPasswordDisabled} value={guestSsidPassword} onChange={(value)=>this.onChange('guestSsidPassword',value)} />
                            </FormItem>
                        </section>  
                    </section>
                    <section className="wifi-setting-save">
                        <Button className="wifi-setting-button" type="primary" onClick={this.submit}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
};







