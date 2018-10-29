
import React from 'react';
import { Checkbox, Select, Button, Radio, Modal } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";
import {checkStr} from '~/assets/common/check';

const {FormItem, ErrorTip, Input} = Form;
const Option = Select.Option;
const RadioGroup=Radio.Group;



export default class WIFI extends React.Component {
    state = {
        channelType: true,
        guestSsid : '',
        guestEncryption : '',
        guestStaticPassword : '',
        guestDynamicPassword : '',
        guestPasswordDisabled:false,
        guestPwdForbid:false,
        PWDType:'',
        guestEnable:true,
        disabledType2:false,
        period : '',
        displayType:'none',
        //2.4G
        host24Enable:true,
        hostSsid24:'',
        hostSsid24Password:'',
        hostSsid24PasswordDisabled:false,
        pwdForbid24:false,
        hide_ssid24:false,
        encryption24:'',
        htmode24:'HT80',
        channel24:'',
        current_channel24 : '',
        disabledType24:false,
        //5G
        host5Enable:true,
        hostSsid5:'',
        hostSsid5Passwrod:'',
        hostSsid5PasswordDisabled:false,
        pwdForbid5:false,
        hide_ssid5:false,
        encryption5:'',
        htmode5:'HT80',
        channel5:'',
        current_channel5 : '',
        disabledType5:false,
        //more
        moreSettingType:'pulldown',
        moreDisplaydHost:'none',
        moreSettingType24:'pulldown',
        moreDisplaydHost24:'none',
        moreSettingType5:'pulldown',
        moreDisplaydHost5:'none',
        //tip
        tipGuest: '',
        tipGuestPsw: '',
        tip2g: '',
        tip2gPsw: '',
        tip5g: '',
        tip5g:'',
        loading: false,
    };
    onChange = (name,value) =>{
        switch (name){
            case 'hostSsid24' : this.setState({
                [name]:value,
                tip2g: checkStr(value, { who: 'Wi-Fi名称', min: 1, max: 32 }),    
            });
            break;
            case 'hostSsid24Password': this.setState({
                tip2gPsw: checkStr(value, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' }),
                [name]:value
            });
            break;
            case 'hostSsid5' : this.setState({
                tip5g: checkStr(value, { who: 'Wi-Fi名称', min:1 , max: 32 }),
                [name]:value
            });
            break;
            case 'hostSsid5Passwrod': this.setState({
                tip5gPsw: checkStr(value, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' }),
                [name]:value
            });
            break;
            case 'guestSsid' : this.setState({
                tipGuest: checkStr(value, { who: 'Wi-Fi名称', min: 1, max: 32 }),
                [name]:value
            });
            break;
            case 'guestStaticPassword': this.setState({
                tipGuestPsw: checkStr(value, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' }
                ),
                [name]:value
            });
            break;
            default: this.setState({
                [name]:value
            });
        }
        
    }
    onChannelTypeChange = type =>{
        this.setState({
            channelType : type
        })
    }
    onPWDTypeChange = e =>{
        this.setState({
            PWDType:e.target.value,
            displayType:e.target.value == 'static'? 'none' : 'block'
        });
    }

    onGuestEnableChange = type =>{
        this.setState({
            guestEnable:type,
            disabledType2:!type,
            guestPasswordDisabled:!type,
        });
        if(type==false){
            this.setState({ tipGuest: '', tipGuestPsw: '' });
        }else{
            this.setState({ 
                tipGuest: checkStr(this.state.guestSsid, { who: 'Wi-Fi名称', min: 1, max: 32}),
                tipGuestPsw: checkStr(this.state.guestStaticPassword, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })
            });
        }
    }

    onGuestPwdForbidChange = e =>{
        this.setState({
            guestPwdForbid:e.target.checked,
            guestPasswordDisabled:e.target.checked
        });
        if(e.target.checked == true){
            this.setState({
                guestEncryption : 'none',
                tipGuestPsw: ''      
            });
        }else{
            this.setState({
                guestEncryption : 'psk-mixed/ccmp+tkip',
                tipGuestPsw: checkStr(this.state.guestStaticPassword, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })
            });
        }
    }
     
    //2.4G
    onHost24EnableChange = type =>{
        this.setState({
            host24Enable: type,
            disabledType24:!type,
            hostSsid24PasswordDisabled:!type,
        });
        if(type==false){
            this.setState({ tip2g: '', tip2gPsw: ''});
        }else{
            this.setState({
                tip2g: checkStr(this.state.hostSsid24, { who: 'Wi-Fi名称', min: 1, max: 32 }),
                tip2gPsw: checkStr(this.state.hostSsid24Password, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })
            })
        }
    }

    onPwdForbid24Change = e =>{
        this.setState({
            pwdForbid24:e.target.checked,
            hostSsid24PasswordDisabled:e.target.checked  
        });
        if(e.target.checked == true){
            this.setState({
                encryption24 : 'none',
                tip2gPsw: ''
            });
        }else{
            this.setState({
                encryption24 : 'psk-mixed/ccmp+tkip',
                tip2gPsw: checkStr(this.state.hostSsid24Password, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })   
            });
        }
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
            this.setState({ tip5g: '',tip5gPsw: ''});
        }else{
            this.setState({
                tip5g: checkStr(this.state.hostSsid5, { who: 'Wi-Fi名称', min:1 , max: 32 }),
                tip5gPsw: checkStr(this.state.hostSsid5Passwrod, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })
            })
        }
    }

    onPwdForbid5Change = e =>{
        this.setState({
            pwdForbid5:e.target.checked,
            hostSsid5PasswordDisabled:e.target.checked
        });
        if(e.target.checked == true){
            this.setState({
                encryption5 : 'none',
                tip5gPsw: ''
            });
        }else{
            this.setState({
                encryption5 : 'psk-mixed/ccmp+tkip',
                tip5gPsw: checkStr(this.state.hostSsid5Passwrod, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })   
            });
        }
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
        //是否双频合一
        this.setState({ loading : true});
        this.hostWireLess.band_division = this.state.channelType == true? '0' : '1';

        //guest
        this.guestWireLess.ssid = this.state.guestSsid;
        this.guestWireLess.static_password = btoa(this.state.guestStaticPassword);
        this.guestWireLess.encryption = this.state.guestEncryption;
        this.guestWireLess.password_type = this.state.PWDType;
        this.guestWireLess.enable = this.state.guestEnable == true? '1' : '0';         
        this.guestWireLess.period = this.state.period,
        this.guestWireLess.password = this.state.PWDType == 'static'? btoa(this.state.guestStaticPassword) : btoa(this.state.guestDynamicPassword);
        this.guestWireLess.static_password = btoa(this.state.guestStaticPassword);

        //2.4G
        this.hostWireLess.band_2g.enable = this.state.host24Enable == true? '1' : '0';
        this.hostWireLess.band_2g.ssid = this.state.hostSsid24;
        this.hostWireLess.band_2g.password = btoa(this.state.hostSsid24Password);
        this.hostWireLess.band_2g.hide_ssid = this.state.hide_ssid24 == true? '1' : '0';
        this.hostWireLess.band_2g.encryption = this.state.encryption24;
        this.hostWireLess.band_2g.htmode = this.state.htmode24;
        this.hostWireLess.band_2g.channel = this.state.channel24;

        //5G
        this.hostWireLess.band_5g.enable = this.state.host5Enable == true? '1' : '0';
        this.hostWireLess.band_5g.ssid = this.state.hostSsid5;
        this.hostWireLess.band_5g.password = btoa(this.state.hostSsid5Passwrod);
        this.hostWireLess.band_5g.hide_ssid = this.state.hide_ssid5 == true? '1' : '0';
        this.hostWireLess.band_5g.encryption = this.state.encryption5;
        this.hostWireLess.band_5g.htmode = this.state.htmode5;
        this.hostWireLess.band_5g.channel = this.state. channel5;
        
        this.mainWireLess.host=this.hostWireLess;
        let response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_SET',
                data: { main : this.mainWireLess, guest : this.guestWireLess}
            }]
        ).catch(ex => {});

        let {errcode, message} = response;
        if(errcode == 0){
            this.setState({ loading : false});
            return;
        }
        Modal.error({ title : 'Wi-Fi设置失败', content : message });
        this.setState({ loading : false});
    }

    format = ()=>{
        return this.tick + 'S';
    }

    async fetchWireLessInfo(){
        let response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_GET',
            }]
        )
        let { errcode, data, message } = response;
        if(errcode == 0){
            let { main, guest } = data[0].result;
            this.mainWireLess = main;
            this.hostWireLess = main.host;
            this.guestWireLess = guest;
            this.setState({
                //host
                channelType : this.hostWireLess.band_division == '0'? true : false,

                //guest
                guestSsid : this.guestWireLess.ssid,
                guestEncryption : this.guestWireLess.encryption,
                guestStaticPassword : atob(this.guestWireLess.static_password),
                guestPasswordDisabled : this.guestWireLess.enable == '1'? false : true,
                PWDType : this.guestWireLess.password_type,
                displayType : this.guestWireLess.password_type == 'static'? 'none' : 'block',
                guestEnable : this.guestWireLess.enable == '1'? true : false,
                disabledType2 : this.guestWireLess.enable == '1'? false : true,
                period : this.guestWireLess.period,
                guestDynamicPassword : this.guestWireLess.password_type == 'static'? '' : atob(this.guestWireLess.password),
                guestStaticPassword : atob(this.guestWireLess.static_password), 
                
                //2.4G
                host24Enable : this.hostWireLess.band_2g.enable == '1'? true : false,
                hostSsid24 : this.hostWireLess.band_2g.ssid,
                hostSsid24Password : atob(this.hostWireLess.band_2g.password),
                hide_ssid24 : this.hostWireLess.band_2g.hide_ssid == '1'? true : false,
                encryption24 : this.hostWireLess.band_2g.encryption,
                pwdForbid24 :this.hostWireLess.band_2g.encryption == 'none' ? true :false,
                hostSsid24PasswordDisabled : this.hostWireLess.band_2g.encryption == 'none' ? true :false,
                htmode24 : this.hostWireLess.band_2g.htmode,
                channel24 : this.hostWireLess.band_2g.channel,
                current_channel24 : this.hostWireLess.band_2g.current_channel,
                disabledType24 : this.hostWireLess.band_2g.enable == '1'? false : true,

                //5G
                host5Enable : this.hostWireLess.band_5g.enable == '1'? true : false,
                hostSsid5 : this.hostWireLess.band_5g.ssid,
                hostSsid5Passwrod : atob(this.hostWireLess.band_5g.password),
                hostSsid5PasswordDisabled : this.hostWireLess.band_5g.enable == '1'? false : true,
                hide_ssid5 : this.hostWireLess.band_5g.hide_ssid == '1'? true : false,
                encryption5 : this.hostWireLess.band_5g.encryption,
                pwdForbid5 :this.hostWireLess.band_5g.encryption == 'none' ? true :false,
                hostSsid5PasswordDisabled : this.hostWireLess.band_5g.encryption == 'none' ? true :false,
                htmode5 : this.hostWireLess.band_5g.htmode,
                channel5 : this.hostWireLess.band_5g.channel,
                current_channel5 : this.hostWireLess.band_5g.current_channel,
                disabledType5 : this.hostWireLess.band_5g.enable == '1'? false : true,

                //more设置
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
        const { channelType, guestSsid, guestStaticPassword, guestDynamicPassword, guestPasswordDisabled, PWDType, guestEnable, disabledType2, period, displayType, guestPwdForbid, host24Enable, hostSsid24,hostSsid24PasswordDisabled, pwdForbid24, hostSsid24Password, hide_ssid24, encryption24, htmode24, channel24, current_channel24, disabledType24, host5Enable, hostSsid5, hostSsid5PasswordDisabled, pwdForbid5, hostSsid5Passwrod, hide_ssid5, encryption5, htmode5, channel5, current_channel5, disabledType5, moreSettingType, moreDisplaydHost, moreSettingType24, moreDisplaydHost24, moreSettingType5, moreDisplaydHost5, tipGuest, tipGuestPsw, tip2g, tip2gPsw,
         tip5g, tip5gPsw, loading } = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0,paddingLeft:0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="双频合一" checkable={true} checked={channelType} onChange={this.onChannelTypeChange}/>
                        <p>2.4G和5G信号合并显示，终端自动适配更优的信号，推荐开启</p>
                    </section>
                    {this.state.channelType ? (
                    <section className="wifi-setting-item">
                        <PanelHeader title="商户Wi-Fi" checkable={true} checked={host24Enable} onChange={this.onHost24EnableChange} />
                        <label style={{marginTop:20}}>Wi-Fi名称</label>
                        <FormItem type="small" showErrorTip={tip2g} style={{ width : 320}}>
                            <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24}/>
                            <ErrorTip>{tip2g}</ErrorTip>
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>Wi-Fi密码</label></li>
                            <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>不设密码</Checkbox></li>
                        </ul>
                        <FormItem type="small" showErrorTip={tip2gPsw} style={{ width : 320}}>
                            <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                            <ErrorTip>{tip2gPsw}</ErrorTip>
                        </FormItem>
                        {!(encryption24 =='none')?
                            <div>
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting}>
                                    更多设置 <CustomIcon type={moreSettingType} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost}}>
                                    <div style={{ padding: 0, position: 'relative' }} id="encryption24Area">
                                        <label>加密方式</label>
                                        <Select value={encryption24} style={{ width: 320 }} disabled={disabledType24} onChange={(value)=>this.onChange('encryption24',value)} getPopupContainer={() => document.getElementById('encryption24Area')}>
                                            <Option value={'psk2+ccmp'}>psk2+ccmp</Option>
                                            <Option value={'psk2+ccmp+tkip'}>psk2+ccmp+tkip</Option>
                                            <Option value={'psk-mixed/ccmp'}>psk-mixed/ccmp</Option>
                                            <Option value={'psk-mixed/ccmp+tkip'}>psk-mixed/ccmp+tkip</Option>
                                            </Select>
                                    </div> 
                                </div>
                            </div>: ''
                        }  
                    </section>
                    ):(
                    <section className="wifi-setting-item">
                        <PanelHeader title="商户Wi-Fi" checkable={false} checked={false} /> 
                        <section className="wifi-setting-twocolumn">
                            <section>
                                <PanelHeader title="2.4G信号" checkable={true} checked={host24Enable} onChange={this.onHost24EnableChange}/> 
                                <label>Wi-Fi名称</label>
                                <FormItem type="small" showErrorTip={tip2g} style={{ width : 320}}>
                                    <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24} />
                                    <ErrorTip>{tip2g}</ErrorTip>
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" showErrorTip={tip2gPsw} style={{ width : 320}}>
                                    <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                                    <ErrorTip>{tip2gPsw}</ErrorTip>
                                </FormItem>  
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting24}>
                                    更多设置 <CustomIcon type={moreSettingType24} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost24}}>
                                    <ul className="ui-tiled compact">
                                        <li><Checkbox checked={hide_ssid24} onChange={this.onHide_ssid24Change} disabled={disabledType24}>隐藏网络不被发现</Checkbox></li>
                                    </ul>
                                    {!(encryption24 =='none')?
                                        (
                                            <div style={{ padding: 0, position: 'relative' }} id="encryption24Area">
                                                <label>加密方式</label>
                                                <Select value={encryption24} onChange={(value)=>this.onChange('encryption24',value)} style={{ width: 320 }} disabled={disabledType24} getPopupContainer={() => document.getElementById('encryption24Area')}>
                                                    <Option value={'psk2+ccmp'}>psk2+ccmp</Option>
                                                    <Option value={'psk2+ccmp+tkip'}>psk2+ccmp+tkip</Option>
                                                    <Option value={'psk-mixed/ccmp'}>psk-mixed/ccmp</Option>
                                                    <Option value={'psk-mixed/ccmp+tkip'}>psk-mixed/ccmp+tkip</Option>
                                                </Select>
                                            </div>
                                        ) : ''
                                    }
                                    <div style={{ padding: 0, position: 'relative' }} id="htmode24Area">
                                        <label>频道带宽</label>
                                        <Select value={htmode24} onChange={(value)=>this.onChange('htmode24',value)} style={{ width: 320 }} disabled={disabledType24} getPopupContainer={() => document.getElementById('htmode24Area')}>
                                            <Option value={'auto'}>自动</Option>
                                            <Option value={'HT20'}>20M</Option>
                                            <Option value={'HT40'}>40M</Option>
                                        </Select>
                                    </div>
                                    <div style={{ padding: 0, position: 'relative' }} id="channel24Area">
                                        <label>无线信道</label> 
                                        <Select value={channel24} style={{width:320}} onChange={(value)=>this.onChange('channel24',value)} disabled={disabledType24} getPopupContainer={() => document.getElementById('channel24Area')}>
                                            <Option value={'auto'}>自动(当前信道{current_channel24})</Option>
                                            <Option value={'1'}>1</Option>
                                            <Option value={'2'}>2</Option>
                                            <Option value={'3'}>3</Option>
                                            <Option value={'4'}>4</Option>
                                            <Option value={'5'}>5</Option>
                                            <Option value={'6'}>6</Option>
                                            <Option value={'7'}>7</Option>
                                            <Option value={'8'}>8</Option>
                                            <Option value={'9'}>9</Option>
                                            <Option value={'10'}>10</Option>
                                            <Option value={'11'}>11</Option>
                                            <Option value={'12'}>12</Option>
                                            <Option value={'13'}>13</Option>
                                        </Select>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <PanelHeader title="5G信号" checkable={true} checked={host5Enable} onChange={this.onHost5EnableChange}/> 
                                    <label>Wi-Fi名称</label>
                                    <FormItem type="small" showErrorTip={tip5g} style={{ width : 320}}>
                                        <Input type="text" maxLength={32} value={hostSsid5} onChange={(value)=>this.onChange('hostSsid5',value)} disabled={disabledType5} />
                                        <ErrorTip>{tip5g}</ErrorTip>
                                    </FormItem>
                                    <ul className="ui-tiled compact">
                                        <li><label>Wi-Fi密码</label></li>
                                        <li><Checkbox checked={pwdForbid5} onChange={this.onPwdForbid5Change} disabled={disabledType5}>不设密码</Checkbox></li>
                                    </ul>
                                    <FormItem type="small" showErrorTip={tip5gPsw} style={{ width : 320}}>
                                        <Input type="password" maxLength={32} disabled={hostSsid5PasswordDisabled} value={hostSsid5Passwrod} onChange={(value)=>this.onChange('hostSsid5Passwrod',value)} />
                                        <ErrorTip>{tip5gPsw}</ErrorTip>
                                    </FormItem>  
                                    <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting5}>
                                        更多设置 <CustomIcon type={moreSettingType5} size={14}/>
                                    </div>
                                    <div style={{display:moreDisplaydHost5}}>
                                        <ul className="ui-tiled compact">
                                            <li><Checkbox checked={hide_ssid5} onChange={this.onHide_ssid5Change} disabled={disabledType5}>隐藏网络不被发现</Checkbox></li>
                                        </ul>
                                        {!(encryption5 =='none')?
                                            (
                                                <div style={{ padding: 0, position: 'relative' }} id="encryption5Area">
                                                    <label>加密方式</label>
                                                    <Select value={encryption5} onChange={(value)=>this.onChange('encryption5',value)} style={{ width: 320 }} disabled={disabledType5} getPopupContainer={() => document.getElementById('encryption5Area')}>
                                                        <Option value={'psk2+ccmp'}>psk2+ccmp</Option>
                                                        <Option value={'psk2+ccmp+tkip'}>psk2+ccmp+tkip</Option>
                                                        <Option value={'psk-mixed/ccmp'}>psk-mixed/ccmp</Option>
                                                        <Option value={'psk-mixed/ccmp+tkip'}>psk-mixed/ccmp+tkip</Option>
                                                    </Select>
                                                </div>
                                            ) : ''
                                        }
                                        <div style={{ padding: 0, position: 'relative' }} id="htmode5Area">
                                            <label>频道带宽</label>
                                            <Select value={htmode5} onChange={(value)=>this.onChange('htmode5',value)} style={{ width: 320 }} disabled={disabledType5} getPopupContainer={() => document.getElementById('htmode5Area')}>
                                                <Option value={'auto'}>自动</Option>
                                                <Option value={'HT20'}>20M</Option>
                                                <Option value={'HT40'}>40M</Option>
                                                <Option value={'HT80'}>80M</Option>
                                            </Select>
                                        </div>
                                        <div style={{ padding: 0, position: 'relative' }} id="channel5Area">
                                            <label>无线信道</label> 
                                            <Select value={channel5} style={{width:320}} onChange={(value)=>this.onChange('channel5',value)} disabled={disabledType5} getPopupContainer={() => document.getElementById('channel5Area')}>
                                                <Option value={'auto'}>自动(当前信道{current_channel5})</Option>
                                                <Option value={'36'}>36</Option>
                                                <Option value={'40'}>40</Option>
                                                <Option value={'44'}>44</Option>
                                                <Option value={'48'}>48</Option>
                                                <Option value={'149'}>149</Option>
                                                <Option value={'153'}>153</Option>
                                                <Option value={'157'}>157</Option>
                                                <Option value={'161'}>161</Option>
                                        </Select>
                                        </div>
                                    </div>
                            </section>
                        </section>
                    </section>
                    )}
                    <section className="wifi-setting-item">
                        <PanelHeader title="顾客Wi-Fi" checkable={true} checked={guestEnable} onChange={this.onGuestEnableChange} />
                        <label style={{marginTop:20}}>Wi-Fi名称</label>
                        <FormItem type="small" showErrorTip={tipGuest} style={{ width : 320}}>
                            <Input type="text" maxLength={32} value={guestSsid} onChange={(value)=>this.onChange('guestSsid',value)} disabled={disabledType2}/>
                            <ErrorTip>{tipGuest}</ErrorTip>
                        </FormItem>
                        <label>密码方式</label>
                        <RadioGroup onChange={this.onPWDTypeChange} value={PWDType} disabled={disabledType2}>
                            <Radio style={{display:'inline-block'}} value={'static'}>静态密码</Radio>
                            <Radio style={{display:'inline-block'}} value={'dynamic'}>动态密码</Radio>
                        </RadioGroup>
                        <section style={{display:displayType}}>
                            <label style={{marginTop:10}}>动态变更周期</label>
                            <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="text" value={period} onChange={(value)=>this.onChange('period',value)} disabled={disabledType2} placeholder={'请输入变更周期时间(1～72)'}/>    
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-35,marginBottom:0,zIndex:1}}>小时</span>
                            </div>
                            <div style={{display:'flex',flexDirection : 'row',flexWrap :'nowrap'}}>
                                <label>当前密码是：</label>
                                <span style={{color:'orange'}} value={guestDynamicPassword}>{guestDynamicPassword}</span>
                            </div> 
                            <span style={{visibility: 'hidden', opacity:'0.5'}}>如您有配套的商米收银设备，顾客Wi-Fi名称和密码将打印在小票上</span>   
                        </section>
                        <section style={{display:displayType=='none'?'block':'none'}}>
                            <ul className="ui-tiled compact">
                                <li><label>Wi-Fi密码</label></li>
                                <li><Checkbox checked={guestPwdForbid} onChange={this.onGuestPwdForbidChange} disabled={disabledType2}>不设密码</Checkbox></li>
                            </ul>
                            <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" style={{ width : 320}}>
                                <Input type="password" maxLength={32} disabled={guestPasswordDisabled} value={guestStaticPassword} onChange={(value)=>this.onChange('guestStaticPassword',value)} />
                                <ErrorTip style={{color:'#fb8632'}}>{tipGuestPsw}</ErrorTip>
                            </FormItem>
                            <span style={{visibility:'hidden',height:40,lineHeight:'40px',marginLeft:10,marginBottom:0,zIndex:1,opacity:'0.5'}}>如您有配套的商米收银设备，顾客Wi-Fi名称和密码将打印在小票上</span>
                            </div>
                        </section>  
                    </section>
                    <section className="wifi-setting-save">
                        <Button className="wifi-setting-button" type="primary" loading={loading} onClick={this.submit}>保存</Button>
                    </section>
                </Form>
            </div>
        );
    }
};







