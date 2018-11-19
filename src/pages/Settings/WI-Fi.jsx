
import React from 'react';
import { Checkbox, Select, Button, Radio, message, Modal, Icon } from 'antd';
import { Base64 } from 'js-base64';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";
import Tips from '~/components/Tips';
import { checkStr ,checkRange } from '~/assets/common/check';

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
        saveDisabled: false,
        visibile: 'hidden',
        resVisibile: false,
        result: true,
        err: '',
    };

    checkDisabled =() =>{
        let checkDisabled24, checkDisabled5, checkDisabled245, checkDisabledGuest;
        let { host24Enable, hostSsid24Tip, hostSsid24Password, hostSsid24PasswordTip, hostSsid24, host5Enable, hostSsid5Tip, hostSsid5Password, hostSsid5PasswordTip, hostSsid5, channelType, guestEnable, guestSsidTip, guestStaticPassword, guestStaticPasswordTip, guestSsid, periodTip} = this.state;
        if(host24Enable === true){
            checkDisabled24 = ( hostSsid24Tip !== '' || hostSsid24PasswordTip !== '' || hostSsid24 === '' || 
            hostSsid24Password.trim() === '' );
        }else{
            checkDisabled24 = false;
        }
        if(host5Enable === true){
            checkDisabled5 = ( hostSsid5Tip !== '' || hostSsid5PasswordTip !== '' || hostSsid5 === '' || 
            hostSsid5Password.trim() ==='' );
        }else{
            checkDisabled5 = false;
        }
        if(channelType === true){
            checkDisabled245 = checkDisabled24;
        }else{
            checkDisabled245 = checkDisabled24 || checkDisabled5;
        }
        if(guestEnable === true){
            checkDisabledGuest = ( guestSsidTip !== '' || guestStaticPasswordTip !== '' || guestSsid === '' || periodTip !== '' 
            || guestStaticPassword.trim() === '');
        }else{
            checkDisabledGuest = false;
        }
        return checkDisabled245 || checkDisabledGuest;
    }

    onChange = (name,value) =>{
        switch (name){
            case 'hostSsid24' : this.setState({
                [name]:value,
                hostSsid24Tip: checkStr(value, { who: 'Wi-Fi名称', min: 1, max: 32 }),    
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            break;
            case 'hostSsid24Password': this.setState({
                hostSsid24PasswordTip: checkStr(value, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' }),
                [name]:value
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            break;
            case 'hostSsid5' : this.setState({
                hostSsid5Tip: checkStr(value, { who: 'Wi-Fi名称', min:1 , max: 32 }),
                [name]:value
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            break;
            case 'hostSsid5Password': this.setState({
                hostSsid5PasswordTip: checkStr(value, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' }),
                [name]:value
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            break;
            case 'guestSsid' : this.setState({
                guestSsidTip: checkStr(value, { who: 'Wi-Fi名称', min: 1, max: 32 }),
                [name]:value
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            break;
            case 'guestStaticPassword': this.setState({
                guestStaticPasswordTip: checkStr(value, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' }
                ),
                [name]:value
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            break;
            case 'period': this.setState({
                periodTip: checkRange(value, { min: 1,max: 72,who: '动态变更周期' }),
                [name]:value
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
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
        },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
    }
    onPWDTypeChange = e =>{
        if(e.target.value === 'static'){
            let check ;
            if(this.state.guestPwdForbid == true){
                check = '';
            }else{
                check = checkStr(this.state.guestStaticPassword, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' });
            }
            this.setState({
                guestStaticPasswordTip: check,
                periodTip: '',
                PWDType:e.target.value,
                displayType:e.target.value == 'static'? 'none' : 'block'
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
        }else{
            this.setState({
                guestStaticPasswordTip: '',
                periodTip: checkRange(this.state.period, { min: 1,max: 72,who: '动态变更周期' }),
                PWDType:e.target.value,
                displayType:e.target.value == 'static'? 'none' : 'block'
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
        }
    }

    onGuestEnableChange = type =>{
        this.setState({
            guestEnable:type,
            disabledType2:!type,
            guestPasswordDisabled:!type || this.state.guestPwdForbid,
        });
        if(type==false){
            this.setState({ guestSsidTip: '', guestStaticPasswordTip: '',periodTip: '' },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            
        }else{
            let tip ;
            if(this.state.guestPwdForbid){ 
                tip = '';
            }else{
                tip = checkStr(this.state.guestStaticPassword, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' });
            }
            this.setState({
                guestSsidTip: checkStr(this.state.guestSsid, { who: 'Wi-Fi名称', min: 1, max: 32}),
                guestStaticPasswordTip: tip,
                periodTip: checkRange(this.state.period, { min: 1,max: 72,who: '动态变更周期' }),
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
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
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
        }else{
            this.setState({
                guestEncryption : 'psk-mixed/ccmp+tkip',
                guestStaticPasswordTip: checkStr(this.state.guestStaticPassword, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
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
                this.setState({ hostSsid24Tip: '', hostSsid24PasswordTip: ''},()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            }else{
                let tip;
                if(this.state.hostSsid24PasswordDisabled){
                    tip = '';
                }else{
                    tip = checkStr(hostSsid24Password, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' });
                }
                this.setState({
                    hostSsid24Tip: checkStr(hostSsid24, { who: 'Wi-Fi名称', min: 1, max: 32 }),
                    hostSsid24PasswordTip: tip,
                },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
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
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
        }else{
            this.setState({
                encryption24 : 'psk-mixed/ccmp+tkip',
                hostSsid24PasswordTip: checkStr(this.state.hostSsid24Password, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })   
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
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
                this.setState({ hostSsid5Tip: '',hostSsid5PasswordTip: ''},()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
            }else{
                let tip;
                if(this.state.hostSsid5PasswordDisabled){
                    tip = '';
                }else{
                    tip = checkStr(hostSsid5Password, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' });
                }
                this.setState({
                    hostSsid5Tip: checkStr(hostSsid5, { who: 'Wi-Fi名称', min:1 , max: 32 }),
                    hostSsid5PasswordTip: tip,
                },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
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
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
        }else{
            this.setState({
                encryption5 : 'psk-mixed/ccmp+tkip',
                hostSsid5PasswordTip: checkStr(this.state.hostSsid5Password, { who: 'Wi-Fi密码', min:8 , max: 32, type: 'english' })   
            },()=>{this.setState({ saveDisabled:  this.checkDisabled()})});
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
        this.setState({
            resVisibile: false,
        });
    }

    submit = async ()=> {
        const { channelType, host5Enable, host24Enable, guestEnable, hostSsid5, hostSsid24, guestSsid } = this.state;

        //商户Wi-Fi 2.4G和5G ssid不能相同
        if (!channelType && host24Enable && host5Enable && hostSsid24 === hostSsid5) {
            message.error('2.4G、5G Wi-Fi名称不能相同');
            return;
        }

        if (host24Enable && guestEnable && hostSsid24 === guestSsid) {
            message.error(channelType ? '商户、顾客Wi-Fi名称不能相同':'2.4G、顾客Wi-Fi名称不能相同');
            return;
        }

        if (host5Enable && guestEnable && hostSsid5 === guestSsid) {
            message.error('5G、顾客Wi-Fi名称不能相同');
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
                await common.fetchApi(
                    [{
                        opcode: 'WIRELESS_GET',
                    }]
                ).then(
                        async()=>{
                            await common.fetchApi(
                                [{
                                    opcode: 'WIRELESS_GET',
                                }], 
                                {},
                                {
                                    loop: true,
                                    interval: 2000,
                                    stop: resp => {resp!== 0},
                                }
                            );
                            this.fetchWireLessInfo();
                            this.setState({
                                visibile: 'hidden',
                                resVisibile: true,
                                result: true,
                            });                
                        }
                    );
            }, 7000);       
        }else{
            this.setState({
                visibile: 'hidden',
                resVisibile: true,
                result: false,
                err: errcode,
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
        message.error(`Wi-Fi信息获取失败[${errcode}]`); 
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }
    render(){
        const { channelType, guestSsid, guestStaticPassword, guestDynamicPassword, guestPasswordDisabled, PWDType, guestEnable, disabledType2, period, periodTip, displayType, guestPwdForbid, host24Enable, hostSsid24,hostSsid24PasswordDisabled, pwdForbid24, hostSsid24Password, hide_ssid24, encryption24, htmode24, channel24, current_channel24, channelList24, disabledType24, host5Enable, hostSsid5, hostSsid5PasswordDisabled, pwdForbid5, hostSsid5Password, hide_ssid5, encryption5, htmode5, channel5, current_channel5, channelList5, disabledType5, moreSettingType, moreDisplaydHost, moreSettingType24, moreDisplaydHost24, moreSettingType5, moreDisplaydHost5, guestSsidTip, guestStaticPasswordTip, hostSsid24Tip, hostSsid24PasswordTip,
         hostSsid5Tip, hostSsid5PasswordTip, saveDisabled, visibile, resVisibile,result } = this.state;
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
                        <FormItem type="small" showErrorTip={hostSsid24Tip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24}/>
                            <ErrorTip>{hostSsid24Tip}</ErrorTip>
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>Wi-Fi密码</label></li>
                            <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>不设密码</Checkbox></li>
                        </ul>
                        <FormItem type="small" showErrorTip={hostSsid24PasswordTip} style={{ width : 320}}>
                            <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                            <ErrorTip>{hostSsid24PasswordTip}</ErrorTip>
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
                                            <Option value={'psk2+ccmp'}>强加密(WPA2)</Option>
                                            <Option value={'psk-mixed/ccmp+tkip'}>混合加密(WPA/WPA2)</Option>
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
                                <FormItem type="small" showErrorTip={hostSsid24Tip} style={{ width : 320}}>
                                    <Input type="text" maxLength={32} value={hostSsid24} onChange={(value)=>this.onChange('hostSsid24',value)} disabled={disabledType24} />
                                    <ErrorTip>{hostSsid24Tip}</ErrorTip>
                                </FormItem>
                                <ul className="ui-tiled compact">
                                    <li><label>Wi-Fi密码</label></li>
                                    <li><Checkbox checked={pwdForbid24} onChange={this.onPwdForbid24Change} disabled={disabledType24}>不设密码</Checkbox></li>
                                </ul>
                                <FormItem type="small" showErrorTip={hostSsid24PasswordTip} style={{ width : 320}}>
                                    <Input type="password" maxLength={32} disabled={hostSsid24PasswordDisabled} value={hostSsid24Password} onChange={(value)=>this.onChange('hostSsid24Password',value)} />
                                    <ErrorTip>{hostSsid24PasswordTip}</ErrorTip>
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
                                                    <Option value={'psk2+ccmp'}>强加密(WPA2)</Option>
                                                    <Option value={'psk-mixed/ccmp+tkip'}>混合加密(WPA/WPA2)</Option>
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
                                            {channelList24}
                                        </Select>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <PanelHeader title="5G信号" checkable={true} checked={host5Enable} onChange={this.onHost5EnableChange}/> 
                                    <label>Wi-Fi名称</label>
                                    <FormItem type="small" showErrorTip={hostSsid5Tip} style={{ width : 320}}>
                                        <Input type="text" maxLength={32} value={hostSsid5} onChange={(value)=>this.onChange('hostSsid5',value)} disabled={disabledType5} />
                                        <ErrorTip>{hostSsid5Tip}</ErrorTip>
                                    </FormItem>
                                    <ul className="ui-tiled compact">
                                        <li><label>Wi-Fi密码</label></li>
                                        <li><Checkbox checked={pwdForbid5} onChange={this.onPwdForbid5Change} disabled={disabledType5}>不设密码</Checkbox></li>
                                    </ul>
                                    <FormItem type="small" showErrorTip={hostSsid5PasswordTip} style={{ width : 320}}>
                                        <Input type="password" maxLength={32} disabled={hostSsid5PasswordDisabled} value={hostSsid5Password} onChange={(value)=>this.onChange('hostSsid5Password',value)} />
                                        <ErrorTip>{hostSsid5PasswordTip}</ErrorTip>
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
                                                        <Option value={'psk2+ccmp'}>强加密(WPA2)</Option>
                                                        <Option value={'psk-mixed/ccmp+tkip'}>混合加密(WPA/WPA2)</Option>
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
                                                {channelList5}
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
                        <FormItem type="small" showErrorTip={guestSsidTip} style={{ width : 320}}>
                            <Input type="text" maxLength={32} value={guestSsid} onChange={(value)=>this.onChange('guestSsid',value)} disabled={disabledType2}/>
                            <ErrorTip>{guestSsidTip}</ErrorTip>
                        </FormItem>
                        <label>密码方式</label>
                        <RadioGroup onChange={this.onPWDTypeChange} value={PWDType} disabled={disabledType2}>
                            <Radio style={{display:'inline-block'}} value={'static'}>静态密码</Radio>
                            <Radio style={{display:'inline-block'}} value={'dynamic'}>动态密码</Radio>
                        </RadioGroup>
                        <section style={{display:displayType}}>
                            <label style={{marginTop:10}}>动态变更周期</label>
                            <div style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                            <FormItem type="small" showErrorTip={periodTip} style={{ width : 320}}>
                                <Input type="text" value={period} maxLength={2} onChange={(value)=>this.onChange('period',value)} disabled={disabledType2} placeholder={'请输入变更周期时间(1～72)'}/>
                                <ErrorTip>{periodTip}</ErrorTip>    
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
                                <ErrorTip style={{color:'#fb8632'}}>{guestStaticPasswordTip}</ErrorTip>
                            </FormItem>
                            <span style={{display:'none',height:40,lineHeight:'40px',marginLeft:10,marginBottom:0,zIndex:1,opacity:'0.5'}}>如您有配套的商米收银设备，顾客Wi-Fi名称和密码将打印在小票上</span>
                            </div>
                        </section>  
                    </section>
                </Form>
                <section className="save">
                        <Button type="primary" size="large" style={{ width: 320, margin: "20px 60px 30px" }} disabled={saveDisabled} onClick={this.submit}>保存</Button>
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
                        <Tips size="16" top={5}>正在等待Wi-Fi重启，请稍候...</Tips>
                    </div>
                        
                </Modal>
                <Modal 
                    closable={false}
                    visible={resVisibile}
                    maskClosable={false}
                    centered={true}
                    footer={
                        <Button className="backup-btm" type="primary" onClick={this.resCancle}>
                        {result? '确定' : '我知道了'}
                        </Button>
                    }
                    width={560}>
                    {result?
                        <div className="backup-icon">
                            <CustomIcon color="#87D068" type="succeed" size={64} />
                            <div className="backup-result">配置生效，请重新连接无线网络</div>
                        </div>
                        :
                        <div className="backup-icon">
                            <CustomIcon color="#FF5500" type="defeated" size={64} />
                            <div className="backup-result">配置失败！[{this.state.err}]</div>
                        </div>
                    }
                </Modal>
            </div>
        );
    }
};







