
import React from 'react';
import Form from '~/components/Form';
import Modal from '~/components/Modal';
import Icon from '~/components/Icon';
import { Button, Switch, Progress } from 'antd';

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

    submit = ()=>{
        this.setState({ loading : true, active : true });
        this.timer = setInterval(()=> {
            this.tick++;
            this.setState({ percent : this.state.percent += 10 }, function(){
                if(this.state.percent >= 100){
                    this.setState({done : true});
                    clearInterval(this.timer);
                }
            });
        }, 1000)
    }

    format = ()=>{
        return this.tick + 'S';
    }

    valid(){
        let ret = true;
        let { guestWifi, hostWifiName, hostWifiPsw, guestWifiName, guestWifiPsw } = this.state;
        
        [hostWifiName, hostWifiPsw].forEach( item => {
            if(item.trim().length === 0){
                ret = false;
            }
        })
        if(guestWifi){
            [guestWifiName, guestWifiPsw].forEach( item => {
                if(item.trim().length === 0){
                    ret = false;
                }
            })  
        }
        return ret;
    }

    render(){
        const { guestWifi, canSubmit } = this.state;
        return (
            <div className="setwifi">
                <h2>设置无线网络</h2> 
                <p className="ui-tips guide-tip">客人Wi-Fi可开放给客人使用，保障隐私安全 </p>
                <div className="wifi-box ui-relative ui-center">
                    <Form>
                        <FormItem label="主Wi-Fi" labelStyle={{ fontSize : 16 }} style={{ marginBottom : 20 }}></FormItem>
                        <FormItem label="Wi-Fi名称">
                            <Input type="text" placeholder="请输入Wi-Fi名称" onChange={value => this.handleChange(value, 'hostWifiName')} />
                        </FormItem>
                        <FormItem label="Wi-Fi密码">
                            <Input type="password" placeholder="请输入Wi-Fi密码" onChange={value => this.handleChange(value, 'hostWifiPsw')} />
                        </FormItem>
                    </Form>
                    <div className="border"></div>
                    <Form>
                        <FormItem label="客人Wi-Fi" labelStyle={{ fontSize : 16 }} style={{ marginBottom : 20 }}> 
                            <Switch checkedChildren="开" checked={guestWifi} onChange={this.openGuestSetting} unCheckedChildren="关" defaultChecked />
                        </FormItem>
                        <FormItem label="Wi-Fi名称">
                            <Input disabled={!guestWifi} type="text" placeholder="请输入Wi-Fi名称" onChange={value => this.handleChange(value, 'guestWifiName')} />
                        </FormItem>
                        <FormItem label="Wi-Fi密码">
                            <Input disabled={!guestWifi} type="password" placeholder="请输入Wi-Fi密码" onChange={value => this.handleChange(value, 'guestWifiPsw')} />
                        </FormItem>
                    </Form>
                </div>
                <div style={{ margin : "auto", textAlign : 'center' }}>
                    <Button type="primary" loading={this.state.loading} onClick={this.submit}  style={{ width : 260 }} disabled={!canSubmit}>完成</Button>
                </div>
                <Modal active={this.state.active}>
                    {
                        !this.state.done ? 
                            <div className="progress">
                                <Progress type="circle" percent={this.state.percent} width={92} format={this.format} style={{ marginBottom : 20 }} />
                                <h3>正在等待WI-FI重启，请稍后...</h3>
                            </div>
                            : 
                            <div className="success">
                                <div style={{ marginBottom : 20 }}><Icon size={80} color="#87d068" type="correct"></Icon></div>
                                <div className="ui-t2">设置完成，请重新连接你的无线网络</div>
                                <div className="ui-t3">主：{this.state.hostWifiName}</div>
                                {
                                    this.state.guestWifi ? <div className="ui-t3">客：{this.state.guestWifiName}</div> : ''
                                }
                            </div>
                    }
                </Modal>
            </div> 
        );
    }
};



