
import React from 'react';
import Form from '~/components/Form';
import CustomModal from '~/components/Modal';
import Icon from '~/components/Icon';
import { Button, Switch, Modal, Progress } from 'antd';

const { FormItem, Input } = Form;


export default class SetWifi extends React.Component {
    constructor(props){
        super(props); 
        this.tick = 1;   
    }

    state = {
        guestWifi : false,
        loading : false,
        percent : 10,
        done : false,
        active : false,
        hostWifiName : '',
        hostWifiPsw : '',
        guestWifiName : '',
        guestWifiPsw : '',
        canSubmit : false
    };

    back = ()=>{
        this.props.history.push("/guide/speed");
    };

    openGuestSetting = () => {
        this.setState({guestWifi : !this.state.guestWifi}, () => {
            this.setState({ canSubmit : this.valid() });
        });
    }

    handleChange = (value, field) => {
        this.setState({ [field] : value }, function(){
            this.setState({ canSubmit : this.valid() });
        });
    }

    submit = async ()=> {
        this.setState({ loading : true});
        this.mainWireLess.host.band_2g.ssid = this.state.hostWifiName;
        this.mainWireLess.host.band_2g.password = btoa(this.state.hostWifiPsw);
        this.guestWireLess.ssid = this.state.guestWifiName;
        this.guestWireLess.password = btoa(this.state.guestWifiPsw);
        this.guestWireLess.enable = this.state.guestWifi === false ? '0' : '1';

        this.mainWireLess.host.band_2g.enable = "1";
        
        let response = await common.fetchWithCode(
            'WIRELESS_SET',
            { method : 'POST', data : { main : this.mainWireLess, guest : this.guestWireLess}}
        ).catch(ex => {});

        this.setState({ loading : false});
        
        let {errcode, data, message} = response;
        if(errcode == 0){
            this.setState({active : true})
            this.timer = setInterval(()=> {
                this.tick++;
                this.setState({ percent : this.state.percent += 0.5 }, function(){
                    if(this.state.percent >= 100){
                        this.setState({done : true});
                        clearInterval(this.timer);
                    }
                });
            }, 20);
            return;
        }
        Modal.error({ title : 'WI-FI设置失败', content : message });
    }

    format = ()=>{
        return this.tick + 'S';
    }

    valid(){
        let ret = true;
        let { guestWifi, hostWifiName, hostWifiPsw, guestWifiName, guestWifiPsw } = this.state;
        
        [hostWifiName, hostWifiPsw].forEach( item => {
            if(item.length === 0 || hostWifiPsw.length < 8){
                ret = false;
            }
        })
        if(guestWifi){
            [guestWifiName, guestWifiPsw].forEach( item => {
                if(item.length === 0 || guestWifiPsw.length < 8){
                    ret = false;
                }
            })  
        }
        return ret;
    }

    async fetchWireLessInfo(){
        let response = await common.fetchWithCode('WIRELESS_GET', { method : 'POST' }, { handleError : true })
        let { errcode, data, message } = response;
        if(errcode == 0){
            let { main, guest } = data[0].result;
            this.mainWireLess = main;
            this.hostWireLess = main.host.band_2g;
            this.guestWireLess = guest;
            // console.log(this.hostWireLess, this.guestWireLess);
            this.setState({
                hostWifiName : this.hostWireLess.ssid,
                guestWifiName : this.guestWireLess.ssid,
                guestWifi : this.guestWireLess.enable !== '0'
                // guestWifiPsw : atob(guest.password)
            });
            return;
        }
        Modal.error({title : '无线配置指令异常', message});
    }

    componentDidMount(){
        this.fetchWireLessInfo();
    }

    componentWillUnmount(){
        this.stop = true;
    }

    render(){
        const { guestWifi, hostWifiName, hostWifiPsw, guestWifiName, guestWifiPsw, canSubmit } = this.state;
        return (
            <div className="setwifi">
                <h2>设置无线网络</h2> 
                <p className="ui-tips guide-tip">客人Wi-Fi可开放给客人使用，保障隐私安全 </p>
                <div className="wifi-box ui-relative ui-center">
                    <Form>
                        <FormItem label="主Wi-Fi" labelStyle={{ fontSize : 16 }} style={{ marginBottom : 20 }}></FormItem>
                        <FormItem label="Wi-Fi名称">
                            <Input value={hostWifiName} maxLength={32} type="text" placeholder="请输入Wi-Fi名称" onChange={value => this.handleChange(value, 'hostWifiName')} />
                        </FormItem>
                        <FormItem label="Wi-Fi密码">
                            <Input value={hostWifiPsw} type="password" placeholder="请输入Wi-Fi密码" onChange={value => this.handleChange(value, 'hostWifiPsw')} />
                        </FormItem>
                    </Form>
                    <div className="border"></div>
                    <Form>
                        <FormItem label="客人Wi-Fi" labelStyle={{ fontSize : 16 }} style={{ marginBottom : 20 }}> 
                            <Switch checkedChildren="开" checked={guestWifi} onChange={this.openGuestSetting} unCheckedChildren="关" defaultChecked />
                        </FormItem>
                        <FormItem label="Wi-Fi名称">
                            <Input value={guestWifiName} maxLength={32}  disabled={!guestWifi} type="text" placeholder="请输入Wi-Fi名称" onChange={value => this.handleChange(value, 'guestWifiName')} />
                        </FormItem>
                        <FormItem label="Wi-Fi密码">
                            <Input value={guestWifiPsw} disabled={!guestWifi} type="password" placeholder="请输入Wi-Fi密码" onChange={value => this.handleChange(value, 'guestWifiPsw')} />
                        </FormItem>
                    </Form>
                </div>
                <div style={{ margin : "auto", textAlign : 'center', width : 260 }}>
                    <Button type="primary" loading={this.state.loading} onClick={this.submit} disabled={!canSubmit} style={{width : "100%"}} >完成</Button>
                    <div className="help">
                        <a href="javascript:;" onClick={this.back} className="ui-tips">上一步</a>
                    </div>
                </div>
                <CustomModal active={this.state.active}>
                    {
                        !this.state.done ? 
                            <div className="progress">
                                <Progress type="circle" showInfo={false} percent={this.state.percent} width={92} format={this.format} style={{ marginBottom : 20 }} />
                                <h3>正在等待WI-FI重启，请稍后...</h3>
                            </div>
                            : 
                            <div className="success">
                                <div style={{ marginBottom : 20 }}><Icon size={80} color="#87d068" type="correct"></Icon></div>
                                <div className="ui-t2">设置完成，请重新连接你的无线网络</div>
                                <div className="ui-t3">主：{this.state.hostWifiName}</div>
                                {
                                    this.state.guestWifi ? <div className="ui-t3">客用：{this.state.guestWifiName}</div> : ''
                                }
                            </div>
                    }
                </CustomModal>
            </div> 
        );
    }
};



