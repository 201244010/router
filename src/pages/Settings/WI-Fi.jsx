
import React from 'react';
import { Checkbox, Select, Button, Radio, message, Modal, Icon } from 'antd';
import { Base64 } from 'js-base64';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";
import { checkStr ,checkRange } from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';
import ModalLoading from '~/components/ModalLoading';
import './settings.scss';

const MODULE = 'wi-fi';
const {FormItem, ErrorTip, Input} = Form;
const Option = Select.Option;
const RadioGroup=Radio.Group;

export default class WIFI extends React.Component {
    constructor(props) {
        super(props);
        // this.channel_list = {};
        this.err = {
            '-1001': intl.get(MODULE, 0)/*_i18n:参数格式错误*/,
            '-1002': intl.get(MODULE, 1)/*_i18n:参数取值非法*/,
            '-1100': intl.get(MODULE, 2)/*_i18n:Wi-Fi名称非法*/,
            '-1101': intl.get(MODULE, 3)/*_i18n:Wi-Fi密码非法*/
        }
    }

    state = {
        channelType: '',
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
        channelList24: [],
        disabledType24:false,
        //5G
        host5Enable:true,
        hostSsid5:'',
        hostSsid5Password:'',
        hostSsid5PasswordDisabled:false,
        pwdForbid5:false,
        hide_ssid5:false,
        encryption5:'',
        htmode5:'HT80',
        channel5:'',
        current_channel5 : '',
        channelList5: [],
        disabledType5:false,
        //more
        moreSettingType:'pulldown',
        moreDisplaydHost:'none',
        moreSettingType24:'pulldown',
        moreDisplaydHost24:'none',
        moreSettingType5:'pulldown',
        moreDisplaydHost5:'none',
        //tip
        // guestSsidTip: '',
        // guestStaticPasswordTip: '',
        hostSsid24Tip: '',
        hostSsid24PasswordTip: '',
        hostSsid5Tip: '',
        hostSsid5PasswordTip:'',
        visibile: false,
        resVisibile: false,
        result: true,
        err: '',
    };

    onChange = (name,value) =>{
        switch (name){
            case 'hostSsid24' : this.setState({
                [name]:value,
                hostSsid24Tip: checkStr(value, { who: intl.get(MODULE, 4)/*_i18n:Wi-Fi名称*/, min: 1, max: 32, byte: true }),
            });
            break;
            case 'hostSsid24Password': this.setState({
                hostSsid24PasswordTip: checkStr(value, { who: intl.get(MODULE, 5)/*_i18n:Wi-Fi密码*/, min:8 , max: 32, type: 'english', byte: true }),
                [name]:value
            });
            break;
            case 'hostSsid5' : this.setState({
                hostSsid5Tip: checkStr(value, { who: intl.get(MODULE, 6)/*_i18n:Wi-Fi名称*/, min:1 , max: 32, byte: true }),
                [name]:value
            });
            break;
            case 'hostSsid5Password': this.setState({
                hostSsid5PasswordTip: checkStr(value, { who: intl.get(MODULE, 7)/*_i18n:Wi-Fi密码*/, min:8 , max: 32, type: 'english', byte: true }),
                [name]:value
            });
            break;
            default: this.setState({
                [name]:value
            },()=>{
                let channelList5 = [];
                if(this.state.htmode5 === 'HT20'){
                    for(let i = 0; i < this.channel_list.band_5g.length; i++){
                        channelList5.push(<Option value={this.channel_list.band_5g[i]} >{this.channel_list.band_5g[i]}</Option>);
                    }
                    this.setState({
                        channelList5: channelList5,    
                    })
                }else{
                    for(let i = 0; i < (this.channel_list.band_5g.length - 1); i++){
                        channelList5.push(<Option value={this.channel_list.band_5g[i]} >{this.channel_list.band_5g[i]}</Option>);
                    }
                    let channel5 =  this.state.channel5;
                    this.setState({
                        channelList5: channelList5,
                        channel5: ('165' === channel5) ? 'auto' : channel5,
                    })
                    
                }
            });
        }
        
    }
    
    onBandSteering = e => {
        this.setState({
            channelType : e.target.value
        });
    }
     
    //2.4G
    onHost24EnableChange = type =>{
        const { hostSsid24, pwdForbid24, hostSsid24Password } = this.state;
        this.setState({
            host24Enable: type,
            disabledType24:!type,
            hostSsid24PasswordDisabled: !type || pwdForbid24
        },() => {
            if(type==false){
                this.setState({ hostSsid24Tip: '', hostSsid24PasswordTip: ''});
            }else{
                let tip;
                if(this.state.hostSsid24PasswordDisabled){
                    tip = '';
                }else{
                    tip = checkStr(hostSsid24Password, { who: intl.get(MODULE, 17)/*_i18n:Wi-Fi密码*/, min:8 , max: 32, type: 'english' });
                }
                this.setState({
                    hostSsid24Tip: checkStr(hostSsid24, { who: intl.get(MODULE, 18)/*_i18n:Wi-Fi名称*/, min: 1, max: 32 }),
                    hostSsid24PasswordTip: tip,
                });
            }
        });   
    }

    onPwdForbid24Change = e =>{
        this.setState({
            pwdForbid24:e.target.checked,
            hostSsid24PasswordDisabled:e.target.checked  
        });
        if(e.target.checked == true){
            this.setState({
                encryption24 : 'none',
                hostSsid24PasswordTip: '',
                hostSsid24Password : '',
            });
        }else{
            this.setState({
                encryption24 : 'psk-mixed/ccmp+tkip',
                hostSsid24PasswordTip: checkStr(this.state.hostSsid24Password, { who: intl.get(MODULE, 19)/*_i18n:Wi-Fi密码*/, min:8 , max: 32, type: 'english' })   
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
        const { pwdForbid5, hostSsid5, hostSsid5Password } = this.state;
        this.setState({
            host5Enable:type,
            disabledType5:!type,
            hostSsid5PasswordDisabled: !type || pwdForbid5
        },()=>{
            if(type==false){
                this.setState({ hostSsid5Tip: '',hostSsid5PasswordTip: ''});
            }else{
                let tip;
                if(this.state.hostSsid5PasswordDisabled){
                    tip = '';
                }else{
                    tip = checkStr(hostSsid5Password, { who: intl.get(MODULE, 20)/*_i18n:Wi-Fi密码*/, min:8 , max: 32, type: 'english' });
                }
                this.setState({
                    hostSsid5Tip: checkStr(hostSsid5, { who: intl.get(MODULE, 21)/*_i18n:Wi-Fi名称*/, min:1 , max: 32 }),
                    hostSsid5PasswordTip: tip,
                });
            }
        });    
    }

    onPwdForbid5Change = e =>{
        this.setState({
            pwdForbid5:e.target.checked,
            hostSsid5PasswordDisabled:e.target.checked
        });
        if(e.target.checked == true){
            this.setState({
                encryption5 : 'none',
                hostSsid5PasswordTip: '',
                hostSsid5Password: '',
            });
        }else{
            this.setState({
                encryption5 : 'psk-mixed/ccmp+tkip',
                hostSsid5PasswordTip: checkStr(this.state.hostSsid5Password, { who: intl.get(MODULE, 22)/*_i18n:WI-Fi密码*/, min:8 , max: 32, type: 'english' })   
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

    resCancle = () => {
        this.fetchWireLessInfo();
        this.setState({
            resVisibile: false,
        });
    }

    submitMain = async ()=> {
        const { channelType, host5Enable, host24Enable, hostSsid5, hostSsid24 } = this.state;

        //商户Wi-Fi 2.4G和5G ssid不能相同
        if (!channelType && host24Enable && host5Enable && hostSsid24 === hostSsid5) {
            message.error(intl.get(MODULE, 23)/*_i18n:2.4G、5G Wi-Fi名称不能相同*/);
            return;
        }
        //是否双频合一
        this.setState({
            visibile: true,
        });
        this.hostWireLess.band_division = this.state.channelType == true? '0' : '1';
        //2.4G
        this.hostWireLess.band_2g.enable = this.state.host24Enable == true? '1' : '0';
        this.hostWireLess.band_2g.ssid = this.state.hostSsid24;
        this.hostWireLess.band_2g.password = Base64.encode(this.state.hostSsid24Password);
        this.hostWireLess.band_2g.hide_ssid = this.state.hide_ssid24 == true? '1' : '0';
        this.hostWireLess.band_2g.encryption = this.state.encryption24;
        this.hostWireLess.band_2g.htmode = this.state.htmode24;
        this.hostWireLess.band_2g.channel = this.state.channel24;

        //5G
        if( !this.state.channelType ){
            this.hostWireLess.band_5g.enable = this.state.host5Enable == true? '1' : '0';
            this.hostWireLess.band_5g.ssid = this.state.hostSsid5;
            this.hostWireLess.band_5g.password = Base64.encode(this.state.hostSsid5Password);
            this.hostWireLess.band_5g.hide_ssid = this.state.hide_ssid5 == true? '1' : '0';
            this.hostWireLess.band_5g.encryption = this.state.encryption5;
            this.hostWireLess.band_5g.htmode = this.state.htmode5;
            this.hostWireLess.band_5g.channel = this.state. channel5;
        }
        this.mainWireLess.host=this.hostWireLess;
        let response = await common.fetchApi(
            [{
                opcode: 'WIRELESS_HOST_SET',
                data: { main : this.mainWireLess }
            }]
        );

        let { errcode } = response;
        if(errcode === 0){
            setTimeout(async() => {
                this.setState({
                    visibile: false,
                    resVisibile: true,
                    result: true,
                });
            }, 10000);
        }else{
            this.setState({
                visibile: false,
                resVisibile: true,
                result: false,
                err: this.err[errcode] || errcode,
            });    
        }   
    }

    async fetchWireLessInfo(){
        let response = await common.fetchApi(
            [
                {
                    opcode: 'WIRELESS_HOST_GET',
                },
                {
                    opcode: 'WIRELESS_CHANNEL_LIST_GET',
                },
            ]
        );
        let { errcode, data } = response;
        if(errcode == 0){
            let { main } = data[0].result;
            let { channel_list } = data[1].result;
            this.channel_list = channel_list;
            this.mainWireLess = main;
            this.initMain = main;
            this.hostWireLess = main.host;
            //channelList24
            const channelList24 = [];
            const channelList5 = [];
            for(let i = 0; i < this.channel_list.band_2g.length; i++){
                channelList24.push(<Option value={this.channel_list.band_2g[i]} >{this.channel_list.band_2g[i]}</Option>);
            }
            if(this.hostWireLess.band_5g.htmode === 'HT20'){
                for(let i = 0; i < this.channel_list.band_5g.length; i++){
                    channelList5.push(<Option value={this.channel_list.band_5g[i]} >{this.channel_list.band_5g[i]}</Option>);
                }
            }else{
                for(let i = 0; i < (this.channel_list.band_5g.length - 1); i++){
                    channelList5.push(<Option value={this.channel_list.band_5g[i]} >{this.channel_list.band_5g[i]}</Option>);
                }
            }
            
            this.setState({
                channelList24: channelList24,
                channelList5: channelList5
            });
            this.setState({
                //host
                channelType : this.hostWireLess.band_division == '0'? true : false,
                
                //2.4G
                host24Enable : this.hostWireLess.band_2g.enable == '1',
                hostSsid24 : this.hostWireLess.band_2g.ssid,
                hostSsid24Password :this.hostWireLess.band_2g.encryption == 'none'? '' : Base64.decode(this.hostWireLess.band_2g.password),
                hide_ssid24 : this.hostWireLess.band_2g.hide_ssid == '1',
                encryption24 : this.hostWireLess.band_2g.encryption,
                pwdForbid24 :this.hostWireLess.band_2g.encryption == 'none' ,
                hostSsid24PasswordDisabled : this.hostWireLess.band_2g.encryption === 'none' || this.hostWireLess.band_2g.enable !== '1',
                htmode24 : this.hostWireLess.band_2g.htmode,
                channel24 : this.hostWireLess.band_2g.channel,
                current_channel24 : this.hostWireLess.band_2g.current_channel,
                disabledType24 : this.hostWireLess.band_2g.enable !== '1' ,

                //5G
                host5Enable : this.hostWireLess.band_5g.enable == '1'? true : false,
                hostSsid5 : this.hostWireLess.band_5g.ssid,
                hostSsid5Password : this.hostWireLess.band_5g.encryption == 'none' ? '' : Base64.decode(this.hostWireLess.band_5g.password),
                hide_ssid5 : this.hostWireLess.band_5g.hide_ssid == '1'? true : false,
                encryption5 : this.hostWireLess.band_5g.encryption,
                pwdForbid5 :this.hostWireLess.band_5g.encryption == 'none' ? true :false,
                hostSsid5PasswordDisabled : this.hostWireLess.band_5g.encryption === 'none' || this.hostWireLess.band_5g.enable !== '1',
                htmode5 : this.hostWireLess.band_5g.htmode,
                channel5 : this.hostWireLess.band_5g.channel,
                current_channel5 : this.hostWireLess.band_5g.current_channel,
                disabledType5 : this.hostWireLess.band_5g.enable !== '1',

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
        message.error(intl.get(MODULE, 27, {error: errcode})/*_i18n:Wi-Fi信息获取失败[{error}]*/); 
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }

    checkDisabled = () =>{
        let checkDisabled24, checkDisabled5, checkDisabled245;
        let { hostSsid24Tip, hostSsid24PasswordTip, hostSsid24, hostSsid24Password, hostSsid5Tip, hostSsid5PasswordTip,
        hostSsid5, hostSsid5Password, channelType, host24Enable, host5Enable} = this.state;
        if(host24Enable === true){
            checkDisabled24 = ( hostSsid24Tip !== '' || hostSsid24PasswordTip !== '' || hostSsid24 === '' || 
            (hostSsid24Password.length !== 0 && hostSsid24Password.trim() === ''));
        }else{
            checkDisabled24 = false;
        }
        if(host5Enable === true){
            checkDisabled5 = ( hostSsid5Tip !== '' || hostSsid5PasswordTip !== '' || hostSsid5 === '' || 
            (hostSsid5Password.length !== 0 && hostSsid5Password.trim() ===''));
        }else{
            checkDisabled5 = false;
        }
        if(channelType === true){
            checkDisabled245 = checkDisabled24;
        }else{
            checkDisabled245 = checkDisabled24 || checkDisabled5;
        }
        
        return checkDisabled245;
    }

    render(){
        const { channelType, host24Enable, hostSsid24, hostSsid24PasswordDisabled, pwdForbid24, hostSsid24Password, hide_ssid24, encryption24, htmode24, channel24, current_channel24, channelList24, disabledType24, host5Enable, hostSsid5, hostSsid5PasswordDisabled, pwdForbid5, hostSsid5Password, hide_ssid5, encryption5, htmode5, channel5, current_channel5, channelList5, disabledType5, moreSettingType, moreDisplaydHost, moreSettingType24, moreDisplaydHost24, moreSettingType5, moreDisplaydHost5, hostSsid24Tip, hostSsid24PasswordTip, hostSsid5Tip, hostSsid5PasswordTip, visibile, resVisibile,result } = this.state;

        let saveDisabled = this.checkDisabled();
        // let guestDisabled = this.checkGuest();

        return [
        <SubLayout className="settings">
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0,paddingLeft:0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title={intl.get(MODULE, 30)/*_i18n:商户Wi-Fi*/} checkable={false} checked={host24Enable} onChange={this.onHost24EnableChange}/>
                        <div className="band-title">
                            <label>{intl.get(MODULE, 28)/*_i18n:双频合一*/}</label>
                            <span>（{intl.get(MODULE, 29)/*_i18n:2.4G和5G信号合并显示，终端自动适配更优的信号，推荐开启*/}）</span>
                        </div>
                        <RadioGroup onChange={this.onBandSteering} value={channelType}>
                            <Radio style={{display:'inline-block'}} value={true}>{intl.get(MODULE, 84)/*_i18n:开启*/}</Radio>
                            <Radio style={{display:'inline-block'}} value={false}>{intl.get(MODULE, 85)/*_i18n:关闭*/}</Radio>
                        </RadioGroup>
                        {/* <PanelHeader title={intl.get(MODULE, 28)/*_i18n:双频合一*/}
                        {/* <p style={{marginTop: 16,marginBottom:25}}>{intl.get(MODULE, 29)/*_i18n:2.4G和5G信号合并显示，终端自动适配更优的信号，推荐开启*/}
                    </section>
                    {this.state.channelType ? (
                    <section className="wifi-setting-item">
                        <label className='ssidLabel'>{intl.get(MODULE, 31)/*_i18n:Wi-Fi名称*/}</label>
                        <FormItem type="small" showErrorTip={hostSsid24Tip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24}/>
                            <ErrorTip>{hostSsid24Tip}</ErrorTip>
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>{intl.get(MODULE, 32)/*_i18n:Wi-Fi密码*/}</label></li>
                            <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>{intl.get(MODULE, 33)/*_i18n:不设密码*/}</Checkbox></li>
                        </ul>
                        <FormItem type="small" showErrorTip={hostSsid24PasswordTip} style={{ width : 320, marginBottom:24}}>
                            <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                            <ErrorTip>{hostSsid24PasswordTip}</ErrorTip>
                        </FormItem>
                        {!(encryption24 =='none')?
                            <div>
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting}>
                                {intl.get(MODULE, 34)/*_i18n:更多设置*/} <CustomIcon type={moreSettingType} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost}}>
                                    <div style={{ padding: 0, position: 'relative' }} id="encryption24Area">
                                        <label>{intl.get(MODULE, 35)/*_i18n:加密方式*/}</label>
                                        <Select value={encryption24} style={{ width: 320 }} disabled={disabledType24} onChange={(value)=>this.onChange('encryption24',value)} getPopupContainer={() => document.getElementById('encryption24Area')}>
                                            <Option value={'psk2+ccmp'}>{intl.get(MODULE, 36)/*_i18n:强加密(WPA2)*/})</Option>
                                            <Option value={'psk-mixed/ccmp+tkip'}>{intl.get(MODULE, 37)/*_i18n:混合加密(WPA/WPA2)*/}</Option>
                                        </Select>
                                    </div> 
                                </div>
                            </div>: ''
                        }  
                    </section>
                    ):(
                    <section className="wifi-setting-item">
                        <section className="wifi-setting-twocolumn">
                            <section>
                                <PanelHeader title={intl.get(MODULE, 39)/*_i18n:2.4G信号*/}  tiled={false} checkable={true} checked={host24Enable} onChange={this.onHost24EnableChange}/> 
                                <label className = 'firstLabel'>{intl.get(MODULE, 40)/*_i18n:Wi-Fi名称*/}</label>
                                <FormItem type="small" showErrorTip={hostSsid24Tip} style={{ width : 320}}>
                                    <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24} />
                                    <ErrorTip>{hostSsid24Tip}</ErrorTip>
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>{intl.get(MODULE, 41)/*_i18n:Wi-Fi密码*/}</label></li>
                                    <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>{intl.get(MODULE, 42)/*_i18n:不设密码*/}</Checkbox></li>
                                </ul>
                                <FormItem type="small" showErrorTip={hostSsid24PasswordTip} style={{ width : 320, marginBottom: 24}}>
                                    <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                                    <ErrorTip>{hostSsid24PasswordTip}</ErrorTip>
                                </FormItem>  
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting24}>
                                {intl.get(MODULE, 43)/*_i18n:更多设置*/} <CustomIcon type={moreSettingType24} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost24}}>
                                    <ul className="ui-tiled compact" style={{ margin: '8px 0 24px' }}>
                                        <li><Checkbox checked={hide_ssid24} onChange={this.onHide_ssid24Change} disabled={disabledType24}>{intl.get(MODULE, 44)/*_i18n:隐藏网络不被发现*/}</Checkbox></li>
                                    </ul>
                                    {!(encryption24 =='none')?
                                        (
                                            <div className='moreDiv' id="encryption24Area">
                                                <label>{intl.get(MODULE, 45)/*_i18n:加密方式*/}</label>
                                                <Select value={encryption24} onChange={(value)=>this.onChange('encryption24',value)} style={{ width: 320 }} disabled={disabledType24} getPopupContainer={() => document.getElementById('encryption24Area')}>
                                                    <Option value={'psk2+ccmp'}>{intl.get(MODULE, 46)/*_i18n:强加密(WPA2)*/}</Option>
                                                    <Option value={'psk-mixed/ccmp+tkip'}>{intl.get(MODULE, 47)/*_i18n:混合加密(WPA/WPA2)*/}</Option>
                                                </Select>
                                            </div>
                                        ) : ''
                                    }
                                    <div className='moreDiv' id="htmode24Area">
                                        <label>{intl.get(MODULE, 48)/*_i18n:频道带宽*/}</label>
                                        <Select value={htmode24} onChange={(value)=>this.onChange('htmode24',value)} style={{ width: 320 }} disabled={disabledType24} getPopupContainer={() => document.getElementById('htmode24Area')}>
                                            <Option value={'auto'}>{intl.get(MODULE, 49)/*_i18n:自动*/}</Option>
                                            <Option value={'HT20'}>20MHZ</Option>
                                            <Option value={'HT40'}>40MHZ</Option>
                                        </Select>
                                    </div>
                                    <div className='moreDiv' id="channel24Area">
                                        <label>{intl.get(MODULE, 50)/*_i18n:无线信道*/}</label> 
                                        <Select value={channel24} style={{width:320}} onChange={(value)=>this.onChange('channel24',value)} disabled={disabledType24} getPopupContainer={() => document.getElementById('channel24Area')}>
                                            <Option value={'auto'}>{intl.get(MODULE, 51, {current_channel24})/*_i18n:自动(当前信道{current_channel24})*/}</Option>
                                            {channelList24}
                                        </Select>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <PanelHeader title={intl.get(MODULE, 53)/*_i18n:5G信号*/}  tiled={false} checkable={true} checked={host5Enable} onChange={this.onHost5EnableChange}/> 
                                    <label className = 'firstLabel'>{intl.get(MODULE, 54)/*_i18n:Wi-Fi名称*/}</label>
                                    <FormItem type="small" showErrorTip={hostSsid5Tip} style={{ width : 320}}>
                                        <Input type="text" maxLength={32} value={hostSsid5} onChange={(value)=>this.onChange('hostSsid5',value)} disabled={disabledType5} />
                                        <ErrorTip>{hostSsid5Tip}</ErrorTip>
                                    </FormItem>
                                    <ul className="ui-tiled compact">
                                        <li><label>{intl.get(MODULE, 55)/*_i18n:Wi-Fi密码*/}</label></li>
                                        <li><Checkbox checked={pwdForbid5} onChange={this.onPwdForbid5Change} disabled={disabledType5}>{intl.get(MODULE, 56)/*_i18n:不设密码*/}</Checkbox></li>
                                    </ul>
                                    <FormItem type="small" showErrorTip={hostSsid5PasswordTip} style={{ width : 320, marginBottom: 24}}>
                                        <Input type="password" maxLength={32} disabled={hostSsid5PasswordDisabled} value={hostSsid5Password} onChange={(value)=>this.onChange('hostSsid5Password',value)} />
                                        <ErrorTip>{hostSsid5PasswordTip}</ErrorTip>
                                    </FormItem>  
                                    <div className="ui-t3 ui-mute more" style={{width:90, cursor:'pointer'}} onClick={this.moreSetting5}>
                                    {intl.get(MODULE, 57)/*_i18n:更多设置*/} <CustomIcon type={moreSettingType5} size={14}/>
                                    </div>
                                    <div style={{display:moreDisplaydHost5}}>
                                        <ul className="ui-tiled compact" style={{ margin: '8px 0 24px' }}>
                                            <li><Checkbox checked={hide_ssid5} onChange={this.onHide_ssid5Change} disabled={disabledType5}>{intl.get(MODULE, 58)/*_i18n:隐藏网络不被发现*/}</Checkbox></li>
                                        </ul>
                                        {!(encryption5 =='none')?
                                            (
                                                <div className='moreDiv' id="encryption5Area">
                                                    <label>{intl.get(MODULE, 59)/*_i18n:加密方式*/}</label>
                                                    <Select value={encryption5} onChange={(value)=>this.onChange('encryption5',value)} style={{ width: 320 }} disabled={disabledType5} getPopupContainer={() => document.getElementById('encryption5Area')}>
                                                        <Option value={'psk2+ccmp'}>{intl.get(MODULE, 60)/*_i18n:强加密(WPA2)*/}</Option>
                                                        <Option value={'psk-mixed/ccmp+tkip'}>{intl.get(MODULE, 61)/*_i18n:混合加密(WPA/WPA2)*/}</Option>
                                                    </Select>
                                                </div>
                                            ) : ''
                                        }
                                        <div className='moreDiv' id="htmode5Area">
                                            <label>{intl.get(MODULE, 62)/*_i18n:频道带宽*/}</label>
                                            <Select value={htmode5} onChange={(value)=>this.onChange('htmode5',value)} style={{ width: 320 }} disabled={disabledType5} getPopupContainer={() => document.getElementById('htmode5Area')}>
                                                <Option value={'auto'}>{intl.get(MODULE, 49)/*_i18n:自动*/}</Option>
                                                <Option value={'HT20'}>20MHZ</Option>
                                                <Option value={'HT40'}>40MHZ</Option>
                                                <Option value={'HT80'}>80MHZ</Option>
                                            </Select>
                                        </div>
                                        <div className='moreDiv' id="channel5Area">
                                            <label>{intl.get(MODULE, 64)/*_i18n:无线信道*/}</label> 
                                            <Select value={channel5} style={{width:320}} onChange={(value)=>this.onChange('channel5',value)} disabled={disabledType5} getPopupContainer={() => document.getElementById('channel5Area')}>
                                                <Option value={'auto'}>{intl.get(MODULE, 63, {current_channel5})/*_i18n:自动(当前信道{current_channel5})*/}</Option>
                                                {channelList5}
                                        </Select>
                                        </div>
                                    </div>
                            </section>
                        </section>
                    </section>
                    )}
                </Form>
                <section className="save" style={{marginTop: moreSettingType5 === 'pullup' || moreSettingType24 === 'pullup' ? 16 : 32}}>
                        <Button type="primary" size="large" style={{ width: 200, height: 42 }} disabled={saveDisabled} onClick={this.submitMain}>{intl.get(MODULE, 77)/*_i18n:保存*/}</Button>
                </section>
                <ModalLoading
                    visible={visibile}
                    tip={intl.get(MODULE, 78)/*_i18n:正在等待Wi-Fi重启，请稍候...*/}
                />
                <Modal 
                    closable={false}
                    visible={resVisibile}
                    maskClosable={false}
                    centered={true}
                    className='setting-wifi-modal'
                    footer={
                        <Button className="backup-btm" type="primary" onClick={this.resCancle}>
                        {result? intl.get(MODULE, 81)/*_i18n:确定*/ : intl.get(MODULE, 82)/*_i18n:我知道了*/}
                        </Button>
                    }
                    width={560}>
                    {result?
                        <div className="backup-icon">
                            <CustomIcon className='backup-icon-succeed' type="succeed" size={64} />
                            <div className="backup-result">{intl.get(MODULE, 79)/*_i18n:配置生效，请重新连接无线网络*/}</div>
                        </div>
                        :
                        <div className="backup-icon">
                            <CustomIcon className='backup-icon-defeated' type="defeated" size={64} />
                            <div className="backup-result">
                                <div className='result-failed'>{intl.get(MODULE, 80)/*_i18n:配置失败!*/}</div>
                                <div className='result-err'>{this.state.err}</div>
                            </div>
                        </div>
                    }
                </Modal>
            </div>
        </SubLayout>
        ];
    }
};







