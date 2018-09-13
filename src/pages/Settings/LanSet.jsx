
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Button} from 'antd';

const { FormItem, ErrorTip, Input : FormInput, InputGroup, Input } = Form;

export default class Lan extends React.Component {
    state = {
        tabKey: "lanSet",  //lanSet/staticBind
        ip : ['192', '168', '1', '1'],
        netmask : ['255', '255', '255', '0'],
        dhcp: true,
        startIp : ['192', '168', '1', '100'],
        endIp : ['192', '168', '1', '199'],
        leaseTime : 120,
        tip : "地址租期必须为数字（测试）",
        disabled : false,
        loading : false
    };

    onChange = (value, key) => {
        console.log(value, key);
        this.setState({
            [key] : value
        });
    }

    render(){
        const { ip, netmask, dhcp, startIp, endIp, leaseTime, tip, disabled, loading } = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="局域网IP地址" />
                        <label style={{marginTop:24}}>IP地址</label>
                        <FormItem style={{ width : 320}}>
                            <InputGroup size="small"
                                inputs={[{value : ip[0], maxLength : 3}, {value : ip[1], maxLength : 3}, {value : ip[2], maxLength : 3}, {value : ip[3], maxLength : 3}]} 
                                onChange={value => this.onChange(value, 'ip')} />
                        </FormItem>
                        <label>子网掩码</label>
                        <FormItem style={{ width : 320}}>
                            <InputGroup size="small"
                                inputs={[{value : netmask[0], maxLength : 3}, {value : netmask[1], maxLength : 3}, {value : netmask[2], maxLength : 3}, {value : netmask[3], maxLength : 3}]} 
                                onChange={value => this.onChange(value, 'netmask')} />
                        </FormItem>
                    </section>
                    <section className="wifi-setting-item">
                        <PanelHeader title="DHCP服务" checkable={true} checked={dhcp} />
                        <label style={{marginTop:24}}>开始IP地址</label>
                        <FormItem style={{ width : 320}}>
                            <InputGroup size="small"
                                inputs={[{value : startIp[0], maxLength : 3}, {value : startIp[1], maxLength : 3}, {value : startIp[2], maxLength : 3}, {value : startIp[3], maxLength : 3}]} 
                                onChange={value => this.onChange(value, 'startIp')} />
                        </FormItem>
                        <label>结束IP地址</label>
                        <FormItem style={{ width : 320}}>
                            <InputGroup size="small"
                                inputs={[{value : endIp[0], maxLength : 3}, {value : endIp[1], maxLength : 3}, {value : endIp[2], maxLength : 3}, {value : endIp[3], maxLength : 3}]} 
                                onChange={value => this.onChange(value, 'endIp')} />
                        </FormItem>
                        <label>地址租期</label>
                        <FormItem showErrorTip={tip} type="small" style={{ width : 320}}>
                            <Input type="text" value={leaseTime} onChange={value => this.onChange(value, 'leaseTime')} placeholder="分钟" />
                            <ErrorTip>{tip}</ErrorTip>
                        </FormItem>
                    </section>
                </Form>
                <div style={{width:"100%", borderTop:"1px solid #ccc", paddingTop:20}}>
                    <Button disabled={disabled} loading={loading} style={{ width : 320 }} onClick={this.post} size="large" type="primary">保存</Button>
                </div>
            </div>
        );
    }
};







