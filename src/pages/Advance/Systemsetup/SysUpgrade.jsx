
import React from 'react';

import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Button} from 'antd';
export default class SysUpgrade extends React.Component{
    state = {
        loading : false,

    }

    post = async ()=> {

    }

    render(){
        const {loading} = this.state;

        return (
            <div style={{paddingLeft : 60}}>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="在线升级" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
                <div style={{height :　44, marginTop : 20}}>
                    <ul className="ui-mute">当前版本:</ul>
                    <label className="oneline" style={{marginLeft : 10, color : 'black'}}>V1.0.0</label>
                </div>                
                <div style={{height :　44}}>
                    <ul className="ui-mute">最新版本:</ul>
                    <label className="oneline" style={{marginLeft : 10, color : 'black'}}>V2.0.0</label>
                </div>
                <section className="wifi-setting-save" style={{marginTop : -10 ,borderTop : 'none'}}>
                    <Button  style={{left:0}} className="wifi-setting-button" type="primary" loading={loading} onClick={this.post}>立即更新</Button>
                </section>
            </div>
        );
    }
}