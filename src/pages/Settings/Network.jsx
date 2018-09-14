
import React from 'react';
import { Checkbox, Select ,Radio,Button} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";

const {FormItem, ErrorTip, Input,InputGroup} = Form;
const Option = Select.Option;
const RadioGroup = Radio.Group;



export default class WIFI extends React.Component {
    state = {
        hostSsid : '123',
        hostSsidPasswrod : '',
        hostSsidPasswordDisabled : false,
        guestSsid : '456',
        merge : true,
        encryption : 22,
        setType: 1,

        //静态IP
        ip : [],
        subnetmask : [],
        gateway : [],
        dns : [],
        dnsbackup : []
    };

    onHostSsidChange = value => {
        this.setState({
            hostSsid : value
        });
    }

    onHostPswChange = value => {
        this.setState({
            hostSsidPasswrod : value
        });
    }

    handleHostPassword = checked => {
        this.setState({
            hostSsidPasswordDisabled : this.state.hostSsidPasswordDisabled
        });
    }

    onHostEncryChange = value => {
        this.setState({
            encryption:value
        })
    }
    
    onRadioChange = event => {
        this.setState({
            setType:event.target.value
        })
    }


    render(){
        const { hostSsid, hostSsidPasswrod, encryption, hostSsidPasswordDisabled,ip,subnetmask,gateway,dns,dnsbackup} = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="当前上网信息" checkable={false} checked={true} />
                        <div>
                            <ul className="ui-mute">联网状态:</ul>
                            <label className="oneline">已联网</label>
                        </div>
                        <div>
                            <ul className="ui-mute">上网方式:</ul>
                            <label className="oneline">PPPoE拨号</label>
                        </div>
                        <div>
                            <ul className="ui-mute">IP地址:</ul>
                            <label className="oneline">192.168.2.1</label>
                        </div>
                        <div>
                            <ul className="ui-mute">子网掩码:</ul>
                            <label className="oneline">255.255.255.0</label>
                        </div>
                        <div>
                            <ul className="ui-mute">默认网关:</ul>
                            <label className="oneline">255.255.255.0</label>
                        </div>
                        <div>    
                            <ul className="ui-mute">DNS:</ul>
                            <label className="oneline">255.255.255.0</label>
                        </div>
                    </section>
                    <section className="wifi-setting-item">
                        <PanelHeader title="上网设置" checkable={false} checked={true} />
                        <label>上网方式</label>
                        <Select value={this.state.encryption} style={{ width: 320, marginBottom: 16}} onChange={this.onHostEncryChange}>
                            <Option value={11}>宽带账号上网（PPPoE）</Option>
                            <Option value={22}>自动获取IP（DHCP）</Option>
                            <Option value={33}>手动输入IP（静态IP）</Option>
                        </Select>
                        {
                            encryption === 11 ? <PPPoE hostSsid={this.state.hostSsid}
                                    onHostSsidChange={this.onHostSsidChange}
                                    hostSsidPasswordDisabled = {this.state.hostSsidPasswordDisabled}
                                    hostSsidPasswrod = {this.state.hostSsidPasswrod}
                                    onHostPswChange = {this.onHostPswChange}
                                    dnsbackup={dnsbackup}
                                    dns={dns} 
                                    onRadioChange={this.onRadioChange}
                                    setType={this.state.setType}
                            /> : ''
                        }
                        {
                            encryption === 22 ? <Dhcp onRadioChange={this.onRadioChange}
                                    setType={this.state.setType}
                                    dns={dns} 
                                    dnsbackup={dnsbackup}
                            /> : ''
                        }
                        {
                            encryption === 33 ? <Static ip={ip}
                                            dns={dns} 
                                            gateway={gateway} 
                                            subnetmask={subnetmask}
                                            dnsbackup={dnsbackup} 
                                            onChange={this.onIPConifgChange}
                            /> : ''
                        }
                        <div className="lan-setting">
                            <div className="save">
                                <Button  style={{ width : 320 }}  size="large" type="primary">保存</Button>
                            </div>
                        </div>
                    </section>
                </Form>
            </div>
        );
    }
};

const PPPoE = props => {
    return [
    <div className="wifi-settings">
        <label>账号</label>
        <FormItem type="small" style={{ width : 320}}>
            <Input type="text" value={props.hostSsid} onChange={props.onHostSsidChange}/>
        </FormItem>
        <label>密码</label>
        <FormItem type="small" style={{ width : 320}}>
            <Input type="password" disabled={props.hostSsidPasswordDisabled} value={props.hostSsidPasswrod} onChange={props.onHostPswChange} />
        </FormItem>
        <label>DNS配置</label>
        <RadioGroup className="radio" onChange={props.onRadioChange} value={props.setType}>
            <Radio className="label-in" value={1}>自动设置</Radio>
            <Radio className="label-in" value={2}>手动设置</Radio>
        </RadioGroup>
        <label>首选DNS</label>
        <FormItem key='dns' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dns')} />
        </FormItem>
        <label>备选DNS</label>
        <FormItem key='dnsbackup' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dnsbackup')}
            />
        </FormItem>
    </div>
    ]; 

}

const Dhcp = props => {
    return [
        <div className="wifi-settings">
            <label>DNS配置</label>
            <RadioGroup className="radio" onChange={props.onRadioChange} value={props.setType}>
                <Radio className="label-in" value={1}>自动设置</Radio>
                <Radio className="label-in" value={2}>手动设置</Radio>
            </RadioGroup>
            <label>首选DNS</label>
            <FormItem key='dns' style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, 'dns')} />
            </FormItem>
            <label>备选DNS</label>
            <FormItem key='dnsbackup' style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                    onChange={value => props.onChange(value, 'dnsbackup')}
                />
            </FormItem>
        </div>
    ];
}

const Static = props => {
    return [
    <div className="wifi-settings">
        <label>IP地址</label>
        <FormItem key='ip' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.ip[0], maxLength : 3}, {value : props.ip[1], maxLength : 3}, {value : props.ip[2], maxLength : 3}, {value : props.ip[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'ip')} />
         </FormItem>
        <label>子网掩码</label>
        <FormItem key='subnetmask' style={{ width : 320}}>
            <InputGroup                                                                     
                inputs={[{value : props.subnetmask[0], maxLength : 3}, {value : props.subnetmask[1], maxLength : 3}, {value : props.subnetmask[2], maxLength : 3}, {value : props.subnetmask[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'subnetmask')} />
        </FormItem>
        <label>网关</label>
        <FormItem key='gateway' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.gateway[0], maxLength : 3}, {value : props.gateway[1], maxLength : 3}, {value : props.gateway[2], maxLength : 3}, {value : props.gateway[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'gateway')} />
        </FormItem>
        <label>首选DNS</label>
        <FormItem key='dns' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.dns[0], maxLength : 3}, {value : props.dns[1], maxLength : 3}, {value : props.dns[2], maxLength : 3}, {value : props.dns[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dns')} />
        </FormItem>
        <label>备选DNS</label>
        <FormItem key='dnsbackup' style={{ width : 320}}>
            <InputGroup 
                inputs={[{value : props.dnsbackup[0], maxLength : 3}, {value : props.dnsbackup[1], maxLength : 3}, {value : props.dnsbackup[2], maxLength : 3}, {value : props.dnsbackup[3], maxLength : 3}]} 
                onChange={value => props.onChange(value, 'dnsbackup')}
            />
        </FormItem>
    </div>
    ];
}



