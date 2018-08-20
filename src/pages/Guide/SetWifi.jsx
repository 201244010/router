
import React from 'react';
import Form from '~/components/Form';
import { Button, Switch } from 'antd';

const { FormItem, Input } = Form;


export default class SetWifi extends React.Component {
    constructor(props){
        super(props);    
    }

    state = {
        guestWifi : true,
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
                    <Button type="primary" style={{ width : 260 }} disabled={!canSubmit}>完成</Button>
                </div>
            </div> 
        );
    }
};



