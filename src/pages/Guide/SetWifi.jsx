
import React from 'react';
import Form from '~/components/Form';
import { Button, Switch } from 'antd';

const { FormItem, Input } = Form;


export default class SetWifi extends React.Component {
    constructor(props){
        super(props);    
    }

    state = {
        checked : true
    };

    openGuestSetting = () => {
        this.setState({checked : !this.state.checked});
    }

    render(){
        const { checked } = this.state;
        return (
            <div className="setwifi">
                <h2>设置无线网络</h2> 
                <p className="ui-tips guide-tip">客人Wi-Fi可开放给客人使用，保障隐私安全 </p>
                <div className="wifi-box ui-relative ui-center">
                    <Form>
                        <FormItem label="主Wi-Fi" labelStyle={{ fontSize : 16 }} style={{ marginBottom : 20 }}></FormItem>
                        <FormItem label="Wi-Fi名称">
                            <Input type="text" placeholder="请输入Wi-Fi名称" onChange={()=>{}} />
                        </FormItem>
                        <FormItem label="Wi-Fi密码">
                            <Input type="text" placeholder="请输入Wi-Fi密码" onChange={()=>{}} />
                        </FormItem>
                    </Form>
                    <div className="border"></div>
                    <Form>
                        <FormItem label="客人Wi-Fi" labelStyle={{ fontSize : 16 }} style={{ marginBottom : 20 }}> 
                            <Switch checkedChildren="开" checked={checked} onChange={this.openGuestSetting} unCheckedChildren="关" defaultChecked />
                        </FormItem>
                        <FormItem label="Wi-Fi名称">
                            <Input type="text" placeholder="请输入Wi-Fi名称" onChange={()=>{}} />
                        </FormItem>
                        <FormItem label="Wi-Fi密码">
                            <Input type="text" placeholder="请输入Wi-Fi密码" onChange={()=>{}} />
                        </FormItem>
                    </Form>
                </div>
                <div style={{ margin : "auto", textAlign : 'center' }}>
                    <Button type="primary" style={{ width : 260 }} disabled>完成</Button>
                </div>
            </div> 
        );
    }
};



