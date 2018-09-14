
import React from 'react';
import { Checkbox, Select } from 'antd';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import CustomIcon from "~/components/Icon";

const {FormItem, ErrorTip, Input} = Form;
const Option = Select.Option;



export default class WIFI extends React.Component {
    state = {
        hostSsid : '123',
        hostSsidPasswrod : '',
        hostSsidPasswordDisabled : false,
        guestSsid : '456',
        merge : true,
        encryption : 11
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

    render(){
        const { hostSsid, hostSsidPasswrod, encryption, hostSsidPasswordDisabled} = this.state;
        return (
            <div className="wifi-settings">
                <Form style={{ width : '100%', marginTop : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="双频合一" checkable={true} checked={true} />
                        <p>2.4G和5G信号合并显示，终端自动适配更优的信号，推荐勾选</p>
                    </section>
                    <section className="wifi-setting-item">
                        <PanelHeader title="主Wi-Fi" checkable={true} checked={true} />
                        <label>Wi-Fi名称</label>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="text" value={hostSsid} onChange={this.onHostSsidChange} />
                        </FormItem>
                        <ul className="ui-tiled compact">
                            <li><label>Wi-Fi密码</label></li>
                            <li><Checkbox onChange={this.handleHostPassword}>不设密码</Checkbox></li>
                        </ul>
                        <FormItem type="small" style={{ width : 320}}>
                            <Input type="password" disabled={hostSsidPasswordDisabled} value={hostSsidPasswrod} onChange={this.onHostPswChange} />
                        </FormItem>  
                        <div className="ui-t3 ui-mute more">
                            更多设置 <CustomIcon type="pulldown" size={14}/>
                        </div>  
                        <label>加密方式</label>
                        <Select value={this.state.encryption} style={{ width: 320 }}>
                            <Option value={11}>11</Option>
                            <Option value={22}>22</Option>
                        </Select>
                    </section>
                </Form>
            </div>
        );
    }
};







