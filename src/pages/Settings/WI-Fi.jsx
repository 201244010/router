
import React from 'react';
import { Checkbox, Select, Button, Radio, message, Modal, Icon } from 'antd';
import { Base64 } from 'js-base64';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";
import Tips from '~/components/Tips';
import { checkStr ,checkRange } from '~/assets/common/check';

const MODULE = 'wi-fi';
const {FormItem, ErrorTip, Input} = Form;
const Option = Select.Option;
const RadioGroup=Radio.Group;

const errorMessage = {
    '-1001': intl.get(MODULE, 0),
    '-1002': intl.get(MODULE, 1),
    '-1100': intl.get(MODULE, 2),
    '-1101': intl.get(MODULE, 3)
};


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
        periodTip: '',
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
        guestSsidTip: '',
        guestStaticPasswordTip: '',
        hostSsid24Tip: '',
        hostSsid24PasswordTip: '',
        hostSsid5Tip: '',
        hostSsid5PasswordTip:'',
        visibile: 'hidden',
        resVisibile: false,
        result: true,
        err: '',
    };

    onChange = (name,value) =>{
        switch (name){
            case 'hostSsid24' : this.setState({
                [name]:value,
                hostSsid24Tip: checkStr(value, { who: intl.get(MODULE, 4), min: 1, max: 32, byte: true }),
            });
            break;
            case 'hostSsid24Password': this.setState({
                hostSsid24PasswordTip: checkStr(value, { who: intl.get(MODULE, 5), min:8 , max: 32, type: 'english', byte: true }),
                [name]:value
            });
            break;
            case 'hostSsid5' : this.setState({
                hostSsid5Tip: checkStr(value, { who: intl.get(MODULE, 6), min:1 , max: 32, byte: true }),
                [name]:value
            });
            break;
            case 'hostSsid5Password': this.setState({
                hostSsid5PasswordTip: checkStr(value, { who: intl.get(MODULE, 7), min:8 , max: 32, type: 'english', byte: true }),
                [name]:value
            });
            break;
            case 'guestSsid' : this.setState({
                guestSsidTip: checkStr(value, { who: intl.get(MODULE, 8), min: 1, max: 32, byte: true }),
                [name]:value
            });
            break;
            case 'guestStaticPassword': this.setState({
                guestStaticPasswordTip: checkStr(value, { who: intl.get(MODULE, 9), min:8 , max: 32, type: 'english', byte: true }
                ),
                [name]:value
            });
            break;
            case 'period': this.setState({
                periodTip: checkRange(value, { min: 1,max: 72,who: intl.get(MODULE, 10) }),
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
    onChannelTypeChange = type =>{
        this.setState({
            channelType : type
        });
    }
    onPWDTypeChange = e =>{
        if(e.target.value === 'static'){
            let check ;
            if(this.state.guestPwdForbid == true){
                check = '';
            }else{
                check = checkStr(this.state.guestStaticPassword, { who: intl.get(MODULE, 11), min:8 , max: 32, type: 'english' });
            }
            this.setState({
                guestStaticPasswordTip: check,
                periodTip: '',
                PWDType:e.target.value,
                displayType:e.target.value == 'static'? 'none' : 'block'
            });
        }else{
            this.setState({
                guestStaticPasswordTip: '',
                periodTip: checkRange(this.state.period, { min: 1,max: 72,who: intl.get(MODULE, 12) }),
                PWDType:e.target.value,
                displayType:e.target.value == 'static'? 'none' : 'block'
            });
        }
    }

    onGuestEnableChange = type =>{
        this.setState({
            guestEnable:type,
            disabledType2:!type,
            guestPasswordDisabled:!type || this.state.guestPwdForbid,
        });
        if(type==false){
            this.setState({ guestSsidTip: '', guestStaticPasswordTip: '',periodTip: '' });
            
        }else{
            let tip ;
            if(this.state.guestPwdForbid){ 
                tip = '';
            }else{
                tip = checkStr(this.state.guestStaticPassword, { who: intl.get(MODULE, 13), min:8 , max: 32, type: 'english' });
            }
            this.setState({
                guestSsidTip: checkStr(this.state.guestSsid, { who: intl.get(MODULE, 14), min: 1, max: 32}),
                guestStaticPasswordTip: tip,
                periodTip: checkRange(this.state.period, { min: 1,max: 72,who: intl.get(MODULE, 15) }),
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
                guestStaticPasswordTip: '',
                guestStaticPassword: '',    
            });
        }else{
            this.setState({
                guestEncryption : 'psk-mixed/ccmp+tkip',
                guestStaticPasswordTip: checkStr(this.state.guestStaticPassword, { who: intl.get(MODULE, 16), min:8 , max: 32, type: 'english' })
            });
        }
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
                    tip = checkStr(hostSsid24Password, { who: intl.get(MODULE, 17), min:8 , max: 32, type: 'english' });
                }
                this.setState({
                    hostSsid24Tip: checkStr(hostSsid24, { who: intl.get(MODULE, 18), min: 1, max: 32 }),
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
                hostSsid24PasswordTip: checkStr(this.state.hostSsid24Password, { who: intl.get(MODULE, 19), min:8 , max: 32, type: 'english' })   
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
                    tip = checkStr(hostSsid5Password, { who: intl.get(MODULE, 20), min:8 , max: 32, type: 'english' });
                }
                this.setState({
                    hostSsid5Tip: checkStr(hostSsid5, { who: intl.get(MODULE, 21), min:1 , max: 32 }),
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
                hostSsid5PasswordTip: checkStr(this.state.hostSsid5Password, { who: intl.get(MODULE, 22), min:8 , max: 32, type: 'english' })   
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

    submit = async ()=> {
        const { channelType, host5Enable, host24Enable, guestEnable, hostSsid5, hostSsid24, guestSsid } = this.state;

        //商户Wi-Fi 2.4G和5G ssid不能相同
        if (!channelType && host24Enable && host5Enable && hostSsid24 === hostSsid5) {
            message.error(intl.get(MODULE, 23));
            return;
        }

        if (host24Enable && guestEnable && hostSsid24 === guestSsid) {
            message.error(channelType ? intl.get(MODULE, 24):intl.get(MODULE, 25));
            return;
        }

        if (host5Enable && guestEnable && hostSsid5 === guestSsid) {
            message.error(intl.get(MODULE, 26));
            return;
        }
        //是否双频合一
        this.setState({
            visibile: 'visible',
        });
        this.hostWireLess.band_division = this.state.channelType == true? '0' : '1';

        
        //guest
        this.guestWireLess.ssid = this.state.guestSsid;
        this.guestWireLess.static_password = this.state.PWDType == 'static'? Base64.encode(this.state.guestStaticPassword) : this.state.guestPwdForbid == true ? '' :this.guestWireLess.static_password;
        this.guestWireLess.encryption = this.state.PWDType == 'static'? this.state.guestEncryption : this.guestWireLess.encryption;
        this.guestWireLess.password_type = this.state.PWDType;
        this.guestWireLess.enable = this.state.guestEnable == true? '1' : '0';         
        this.guestWireLess.period = this.state.PWDType == 'static'? this.guestWireLess.period : this.state.period,
        this.guestWireLess.password = this.state.PWDType == 'static'? Base64.encode(this.state.guestStaticPassword) : Base64.encode(this.state.guestDynamicPassword);

        //2.4G
        this.hostWireLess.band_2g.enable = this.state.host24Enable == true? '1' : '0';
        this.hostWireLess.band_2g.ssid = this.state.hostSsid24;
        this.hostWireLess.band_2g.password = Base64.encode(this.state.hostSsid24Password);
        this.hostWireLess.band_2g.hide_ssid = this.state.hide_ssid24 == true? '1' : '0';
        this.hostWireLess.band_2g.encryption = this.state.encryption24;
        this.hostWireLess.band_2g.htmode = this.state.htmode24;
        this.hostWireLess.band_2g.channel = this.state.channel24;

        //5G
        if( this.state.channelType ){
            this.hostWireLess.band_5g = this.hostWireLess.band_5g;
        }else{
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
                opcode: 'WIRELESS_SET',
                data: { main : this.mainWireLess, guest : this.guestWireLess}
            }]
        );

        let { errcode } = response;
        if(errcode === 0){
            setTimeout(async() => {
                this.setState({
                    visibile: 'hidden',
                    resVisibile: true,
                    result: true,
                });
            }, 15000);
        }else{
            this.setState({
                visibile: 'hidden',
                resVisibile: true,
                result: false,
                err: errorMessage[errcode] || errcode,
            });    
        }   
    }

    format = ()=>{
        return this.tick + 'S';
    }

    async fetchWireLessInfo(){
        let response = await common.fetchApi(
            [
                {
                    opcode: 'WIRELESS_GET',
                },
                {
                    opcode: 'WIRELESS_CHANNEL_LIST_GET',
                }
            ]
        );
        let { errcode, data } = response;
        if(errcode == 0){
            let { main, guest } = data[0].result;
            let { channel_list } = data[1].result;
            this.channel_list = channel_list;
            this.mainWireLess = main;
            this.hostWireLess = main.host;
            this.guestWireLess = guest;
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
                //guest
                guestSsid : this.guestWireLess.ssid,
                guestEncryption : this.guestWireLess.encryption,
                guestStaticPassword : this.guestWireLess.encryption == 'none' ? '' : Base64.decode(this.guestWireLess.static_password),
                guestPasswordDisabled : (this.guestWireLess.enable != '1') || (this.guestWireLess.encryption == 'none'),
                PWDType : this.guestWireLess.password_type,
                displayType : this.guestWireLess.password_type == 'static'? 'none' : 'block',
                guestEnable : this.guestWireLess.enable == '1'? true : false,
                disabledType2 : this.guestWireLess.enable == '1'? false : true,
                period : this.guestWireLess.period,
                guestDynamicPassword : this.guestWireLess.password_type == 'static'? '' : Base64.decode(this.guestWireLess.password),
                guestStaticPassword : Base64.decode(this.guestWireLess.static_password), 
                guestPwdForbid: this.guestWireLess.encryption == 'none',
                
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
        message.error(intl.get(MODULE, 27, {error: errcode})); 
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }

    checkDisabled = (state) =>{
        let checkDisabled24, checkDisabled5, checkDisabled245, checkDisabledGuest;
        let { hostSsid24Tip, hostSsid24PasswordTip, hostSsid24, hostSsid24Password, hostSsid5Tip, hostSsid5PasswordTip,
        hostSsid5, hostSsid5Password, channelType, host24Enable, host5Enable, guestEnable, guestSsidTip, guestStaticPasswordTip, guestSsid,
        periodTip, guestStaticPassword, PWDType } = state;
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
        if(guestEnable === true){
            if(PWDType === 'static'){
                checkDisabledGuest = ( guestSsidTip !== '' || guestStaticPasswordTip !== '' || guestSsid === '' ||
                (guestStaticPassword.length !== 0 && guestStaticPassword.trim() === ''));
            }else{
                checkDisabledGuest = ( guestSsidTip !== '' || guestSsid === '' || periodTip !== '');
            }    
        }else{
            checkDisabledGuest = false;
        }
        return checkDisabled245 || checkDisabledGuest;
    }

    render(){
        const { channelType, guestSsid, guestStaticPassword, guestDynamicPassword, guestPasswordDisabled, PWDType, guestEnable, disabledType2, period, periodTip, displayType, guestPwdForbid, host24Enable, hostSsid24,hostSsid24PasswordDisabled, pwdForbid24, hostSsid24Password, hide_ssid24, encryption24, htmode24, channel24, current_channel24, channelList24, disabledType24, host5Enable, hostSsid5, hostSsid5PasswordDisabled, pwdForbid5, hostSsid5Password, hide_ssid5, encryption5, htmode5, channel5, current_channel5, channelList5, disabledType5, moreSettingType, moreDisplaydHost, moreSettingType24, moreDisplaydHost24, moreSettingType5, moreDisplaydHost5, guestSsidTip, guestStaticPasswordTip, hostSsid24Tip, hostSsid24PasswordTip, hostSsid5Tip, hostSsid5PasswordTip, visibile, resVisibile,result } = this.state;

        let saveDisabled = this.checkDisabled(this.state);

        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0,paddingLeft:0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title={intl.get(MODULE, 28)} checkable={true} checked={channelType} onChange={this.onChannelTypeChange}/>
                        <p style={{marginTop: 16,marginBottom:25}}>{intl.get(MODULE, 29)}</p>
                    </section>
                    {this.state.channelType ? (
                    <section className="wifi-setting-item">
                        <PanelHeader title={intl.get(MODULE, 30)} checkable={true} checked={host24Enable} onChange={this.onHost24EnableChange} />
                        <label className='ssidLabel'>{intl.get(MODULE, 31)}</label>
                        <FormItem type="small" showErrorTip={hostSsid24Tip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24}/>
                            <ErrorTip>{hostSsid24Tip}</ErrorTip>
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>{intl.get(MODULE, 32)}</label></li>
                            <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>{intl.get(MODULE, 33)}</Checkbox></li>
                        </ul>
                        <FormItem type="small" showErrorTip={hostSsid24PasswordTip} style={{ width : 320, marginBottom:24}}>
                            <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                            <ErrorTip>{hostSsid24PasswordTip}</ErrorTip>
                        </FormItem>
                        {!(encryption24 =='none')?
                            <div>
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting}>
                                {intl.get(MODULE, 34)} <CustomIcon type={moreSettingType} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost}}>
                                    <div style={{ padding: 0, position: 'relative' }} id="encryption24Area">
                                        <label>{intl.get(MODULE, 35)}</label>
                                        <Select value={encryption24} style={{ width: 320 }} disabled={disabledType24} onChange={(value)=>this.onChange('encryption24',value)} getPopupContainer={() => document.getElementById('encryption24Area')}>
                                            <Option value={'psk2+ccmp'}>{intl.get(MODULE, 36)})</Option>
                                            <Option value={'psk-mixed/ccmp+tkip'}>{intl.get(MODULE, 37)}</Option>
                                        </Select>
                                    </div> 
                                </div>
                            </div>: ''
                        }  
                    </section>
                    ):(
                    <section className="wifi-setting-item">
                        <PanelHeader title={intl.get(MODULE, 38)} checkable={false} checked={false} /> 
                        <section className="wifi-setting-twocolumn">
                            <section>
                                <PanelHeader title={intl.get(MODULE, 39)} checkable={true} checked={host24Enable} onChange={this.onHost24EnableChange}/> 
                                <label className = 'firstLabel'>{intl.get(MODULE, 40)}</label>
                                <FormItem type="small" showErrorTip={hostSsid24Tip} style={{ width : 320}}>
                                    <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24} />
                                    <ErrorTip>{hostSsid24Tip}</ErrorTip>
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>{intl.get(MODULE, 41)}</label></li>
                                    <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>{intl.get(MODULE, 42)}</Checkbox></li>
                                </ul>
                                <FormItem type="small" showErrorTip={hostSsid24PasswordTip} style={{ width : 320, marginBottom: 24}}>
                                    <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                                    <ErrorTip>{hostSsid24PasswordTip}</ErrorTip>
                                </FormItem>  
                                <div className="ui-t3 ui-mute more" style={{width:90,cursor:'pointer'}} onClick={this.moreSetting24}>
                                {intl.get(MODULE, 43)} <CustomIcon type={moreSettingType24} size={14} />
                                </div>
                                <div style={{display:moreDisplaydHost24}}>
                                    <ul className="ui-tiled compact" style={{ margin: '8px 0 16px' }}>
                                        <li><Checkbox checked={hide_ssid24} onChange={this.onHide_ssid24Change} disabled={disabledType24}>{intl.get(MODULE, 44)}</Checkbox></li>
                                    </ul>
                                    {!(encryption24 =='none')?
                                        (
                                            <div className='moreDiv' id="encryption24Area">
                                                <label>{intl.get(MODULE, 45)}</label>
                                                <Select value={encryption24} onChange={(value)=>this.onChange('encryption24',value)} style={{ width: 320 }} disabled={disabledType24} getPopupContainer={() => document.getElementById('encryption24Area')}>
                                                    <Option value={'psk2+ccmp'}>{intl.get(MODULE, 46)}</Option>
                                                    <Option value={'psk-mixed/ccmp+tkip'}>{intl.get(MODULE, 47)}</Option>
                                                </Select>
                                            </div>
                                        ) : ''
                                    }
                                    <div className='moreDiv' id="htmode24Area">
                                        <label>{intl.get(MODULE, 48)}</label>
                                        <Select value={htmode24} onChange={(value)=>this.onChange('htmode24',value)} style={{ width: 320 }} disabled={disabledType24} getPopupContainer={() => document.getElementById('htmode24Area')}>
                                            <Option value={'auto'}>{intl.get(MODULE, 49)}</Option>
                                            <Option value={'HT20'}>20M</Option>
                                            <Option value={'HT40'}>40M</Option>
                                        </Select>
                                    </div>
                                    <div className='moreDiv' id="channel24Area">
                                        <label>{intl.get(MODULE, 50)}</label> 
                                        <Select value={channel24} style={{width:320}} onChange={(value)=>this.onChange('channel24',value)} disabled={disabledType24} getPopupContainer={() => document.getElementById('channel24Area')}>
                                            <Option value={'auto'}>{intl.get(MODULE, 51, {current_channel24})}</Option>
                                            {channelList24}
                                        </Select>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <PanelHeader title={intl.get(MODULE, 53)} checkable={true} checked={host5Enable} onChange={this.onHost5EnableChange}/> 
                                    <label className = 'firstLabel'>{intl.get(MODULE, 54)}</label>
                                    <FormItem type="small" showErrorTip={hostSsid5Tip} style={{ width : 320}}>
                                        <Input type="text" maxLength={32} value={hostSsid5} onChange={(value)=>this.onChange('hostSsid5',value)} disabled={disabledType5} />
                                        <ErrorTip>{hostSsid5Tip}</ErrorTip>
                                    </FormItem>
                                    <ul className="ui-tiled compact">
                                        <li><label>{intl.get(MODULE, 55)}</label></li>
                                        <li><Checkbox checked={pwdForbid5} onChange={this.onPwdForbid5Change} disabled={disabledType5}>{intl.get(MODULE, 56)}</Checkbox></li>
                                    </ul>
                                    <FormItem type="small" showErrorTip={hostSsid5PasswordTip} style={{ width : 320, marginBottom: 24}}>
                                        <Input type="password" maxLength={32} disabled={hostSsid5PasswordDisabled} value={hostSsid5Password} onChange={(value)=>this.onChange('hostSsid5Password',value)} />
                                        <ErrorTip>{hostSsid5PasswordTip}</ErrorTip>
                                    </FormItem>  
                                    <div className="ui-t3 ui-mute more" style={{width:90, cursor:'pointer'}} onClick={this.moreSetting5}>
                                    {intl.get(MODULE, 57)} <CustomIcon type={moreSettingType5} size={14}/>
                                    </div>
                                    <div style={{display:moreDisplaydHost5}}>
                                        <ul className="ui-tiled compact" style={{ margin: '8px 0 16px' }}>
                                            <li><Checkbox checked={hide_ssid5} onChange={this.onHide_ssid5Change} disabled={disabledType5}>{intl.get(MODULE, 58)}</Checkbox></li>
                                        </ul>
                                        {!(encryption5 =='none')?
                                            (
                                                <div className='moreDiv' id="encryption5Area">
                                                    <label>{intl.get(MODULE, 59)}</label>
                                                    <Select value={encryption5} onChange={(value)=>this.onChange('encryption5',value)} style={{ width: 320 }} disabled={disabledType5} getPopupContainer={() => document.getElementById('encryption5Area')}>
                                                        <Option value={'psk2+ccmp'}>{intl.get(MODULE, 60)}</Option>
                                                        <Option value={'psk-mixed/ccmp+tkip'}>{intl.get(MODULE, 61)}</Option>
                                                    </Select>
                                                </div>
                                            ) : ''
                                        }
                                        <div className='moreDiv' id="htmode5Area">
                                            <label>{intl.get(MODULE, 62)}</label>
                                            <Select value={htmode5} onChange={(value)=>this.onChange('htmode5',value)} style={{ width: 320 }} disabled={disabledType5} getPopupContainer={() => document.getElementById('htmode5Area')}>
                                                <Option value={'auto'}>{intl.get(MODULE, 63)}</Option>
                                                <Option value={'HT20'}>20M</Option>
                                                <Option value={'HT40'}>40M</Option>
                                                <Option value={'HT80'}>80M</Option>
                                            </Select>
                                        </div>
                                        <div className='moreDiv' id="channel5Area">
                                            <label>{intl.get(MODULE, 64)}</label> 
                                            <Select value={channel5} style={{width:320}} onChange={(value)=>this.onChange('channel5',value)} disabled={disabledType5} getPopupContainer={() => document.getElementById('channel5Area')}>
                                                <Option value={'auto'}>{intl.get(MODULE, 65, current_channel5)}</Option>
                                                {channelList5}
                                        </Select>
                                        </div>
                                    </div>
                            </section>
                        </section>
                    </section>
                    )}
                    <section className="wifi-setting-item">
                        <PanelHeader title={intl.get(MODULE, 65)} checkable={true} checked={guestEnable} onChange={this.onGuestEnableChange} />
                        <label className='ssidLabel'>{intl.get(MODULE, 66)}</label>
                        <FormItem type="small" showErrorTip={guestSsidTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} value={guestSsid} onChange={(value)=>this.onChange('guestSsid',value)} disabled={disabledType2}/>
                            <ErrorTip>{guestSsidTip}</ErrorTip>
                        </FormItem>
                        <label className='ui-tiled compact'>{intl.get(MODULE, 67)}</label>
                        <RadioGroup className='radio-choice' onChange={this.onPWDTypeChange} value={PWDType} disabled={disabledType2}>
                            <Radio style={{display:'inline-block'}} value={'static'}>{intl.get(MODULE, 68)}</Radio>
                            <Radio style={{display:'inline-block'}} value={'dynamic'}>{intl.get(MODULE, 69)}</Radio>
                        </RadioGroup>
                        <section style={{display:displayType}}>
                            <label>{intl.get(MODULE, 70)}</label>
                            <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={periodTip} style={{ width : 320}}>
                                <Input type="text" value={period} maxLength={2} onChange={(value)=>this.onChange('period',value)} disabled={disabledType2} placeholder={intl.get(MODULE, 71)}/>
                                <ErrorTip>{periodTip}</ErrorTip>    
                            </FormItem>
                            <span style={{height:40,lineHeight:'40px',marginLeft:-35,marginBottom:0,zIndex:1,opacity:0.5}}>{intl.get(MODULE, 72)}</span>
                            </div>
                            <div style={{display:'flex',flexDirection : 'row',flexWrap :'nowrap', marginBottom: 0}}>
                                <label>{intl.get(MODULE, 73)}</label>
                                <span style={{color:'orange'}} value={guestDynamicPassword}>{guestDynamicPassword}</span>
                            </div> 
                            <span style={{display: 'none', opacity:'0.5'}}>{intl.get(MODULE, 74)}</span>   
                        </section>
                        <section style={{display:displayType=='none'?'block':'none'}}>
                            <ul className="ui-tiled compact">
                                <li><label>{intl.get(MODULE, 55)}</label></li>
                                <li><Checkbox checked={guestPwdForbid} onChange={this.onGuestPwdForbidChange} disabled={disabledType2}>{intl.get(MODULE, 75)}</Checkbox></li>
                            </ul>
                            <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={guestStaticPasswordTip} style={{ width : 320, marginBottom: 0}}>
                                <Input type="password"  maxLength={32} disabled={guestPasswordDisabled} value={guestStaticPassword} onChange={(value)=>this.onChange('guestStaticPassword',value)} />
                                <ErrorTip>{guestStaticPasswordTip}</ErrorTip>
                            </FormItem>
                            <span style={{display:'none',height:40,lineHeight:'40px',marginLeft:10,marginBottom:0,zIndex:1,opacity:'0.5'}}>{intl.get(MODULE, 76)}</span>
                            </div>
                        </section>  
                    </section>
                </Form>
                <section className="save">
                        <Button type="primary" size="large" style={{ width: 320 }} disabled={saveDisabled} onClick={this.submit}>{intl.get(MODULE, 77)}</Button>
                </section>
                <Modal
                    visible={true}
                    maskStyle={{ visibility: visibile }}
                    closable={false}
                    wrapClassName={'hidden' === visibile && 'ui-hidden'}
                    centered={true}
                    style={{ textAlign: 'center', visibility: visibile }}
                    footer={null}
                >
                    <div className="progress">
                        <Icon type="loading" style={{ fontSize: 80, color: "#FB8632", marginBottom: 20 }} spin />
                        <Tips size="16" top={5}>{intl.get(MODULE, 78)}</Tips>
                    </div>
                        
                </Modal>
                <Modal 
                    closable={false}
                    visible={resVisibile}
                    maskClosable={false}
                    centered={true}
                    footer={
                        <Button className="backup-btm" type="primary" onClick={this.resCancle}>
                        {result? intl.get(MODULE, 81) : intl.get(MODULE, 82)}
                        </Button>
                    }
                    width={560}>
                    {result?
                        <div className="backup-icon">
                            <CustomIcon color="#87D068" type="succeed" size={64} />
                            <div className="backup-result">{intl.get(MODULE, 79)}</div>
                        </div>
                        :
                        <div className="backup-icon">
                            <CustomIcon color="#FF5500" type="defeated" size={64} />
                            <div className="backup-result">
                                <div style={{fontSize: 16}}>{intl.get(MODULE, 80)}</div>
                                <div style={{ fontSize: 12, color: '#ADB1B9' }}>{this.state.err}</div>
                            </div>
                        </div>
                    }
                </Modal>
            </div>
        );
    }
};







