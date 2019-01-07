
import React from 'react';

import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Button, Modal} from 'antd';
import CustomIcon from '~/components/Icon';
import Upgrade from '../../UpgradeDetect/Upgrade';
import { get } from '~/assets/common/auth';

export default class SysUpgrade extends React.Component{
    state = {
        loading : false,
        disable : true,
        currentVersion : '',//当前版本
        latestVersion : '',//最新版本
        releaseLog : '',//版本说明
        version : false,//版本说明弹窗
    }

    post = () => {
        this.refs.Upgrade.startUpgrade();
    }

    getInfo = async ()=>{
        let response = await common.fetchApi({
            opcode : 'FIRMWARE_GET'
        })
        let {data,errcode} =response;
        let result = data[0].result.upgrade;
        if(errcode == 0){       
            this.setState({
                currentVersion : result.current_version,
                latestVersion : result.newest_version,
                releaseLog : result.release_log,
            },() => {
                    let {currentVersion, latestVersion} = this.state;
                    if (currentVersion !== latestVersion && latestVersion !== ''){
                        this.setState({
                            disable : false
                        })
                    }
            })
            return;
        }else{
            Modal.error({ title: '获取路由器当前版本信息和最新版本信息失败', centered: true });
        }
    }

    componentDidMount(){
        this.getInfo();
    }

    handleDisable = ()=> {
        if (this.state.currentVersion !== this.state.latestVersion){
            this.setState({
                disable : true
            })
        }
    }

    versionClick = ()=>{
        this.setState({
            version : true
        })
    }

    handleCancle = ()=> {
        this.setState({
            version : false
        })
    }

    //后门弹窗的函数逻辑
    // request(data, callback) {
    //     $.ajax({
    //         url: '/api',
    //         type: 'POST',
    //         dataType: 'json',
    //         contentType: 'application/json',
    //         data: JSON.stringify(data),
    //         beforeSend: function(request) {
    //             var token = window[TOKEN];
    //             if (token) {
    //                 request.setRequestHeader('XSRF-TOKEN', token);
    //             }
    //         },
    //         success: callback
    //     });
    // }

    // close = () => {
    //     this.setState({backDoor: true});
    // }

    // startTelnet = () => {
    //         var param = { "msg_id": "5678", "params": [{ "opcode": "5", "param": {} }] };
    //         this.request(param);
    // }

    render(){
        let Title = [
            <span style={{fontSize : 14, color : '#333C4F'}}><CustomIcon style={{marginRight : 5}} color="#333C4F" type="hint"  size={14} />版本说明</span>
        ];
        const {releaseLog, loading, disable, version, currentVersion, latestVersion, backDoor} = this.state;

        return (
            <div style={{paddingLeft : 60}}>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0,paddingRight : 0}}>
                    <section className="online-update">
                        <PanelHeader title="在线升级" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
                <div style={{height :　44, marginTop : 20}}>
                    <ul className="ui-mute">当前版本:</ul>
                    <label className="oneline" style={{marginLeft : 10, color : 'black'}}>{currentVersion}</label>
                </div>
                {
                    (currentVersion === latestVersion || latestVersion === "") ? <div style={{color : '#ADB1B9', marginBottom : 20}}>当前已是最新版本，无需升级</div>
                    : <LatestVer latestVersion={latestVersion} versionClick={this.versionClick}/>
                }
                <section className="upgrade-save" style={{marginTop : -10 ,borderTop : 'none'}}>
                    <Button disabled={disable} style={{left:0}} className="upgrade-btn" type="primary" loading={loading} onClick={this.post}>立即更新</Button>
                </section>
                <Modal title={Title} closable={false} visible={version} maskClosable={false} centered={true} footer={<Button className="speed-btn" type="primary" onClick={this.handleCancle}>知道了</Button>} okText="知道了"
                    onCancel={this.handleCancle}
                >
                    <pre className="head-content">
                        {releaseLog}
                    </pre>
                </Modal>
                {/* <Modal
                    title={'升级小后门'}
                    closable={false}
                    visible={backDoor}
                    maskClosable={false}
                    centered={true}
                    footer={<Button className="speed-btn" type="primary" onClick={this.close}>知道了</Button>} 
                >
                    <Button onClick={this.startTelnet}>开启Telnet</Button>
                    <Upload
                        onChange={this.postRecoverLocal}
                        name='file'
                        data={{ opcode: '4' }}
                        multiple={false}
                        headers={{
                            'XSRF-TOKEN': get(),
                        }}
                        action={__BASEAPI__}
                    >
                        <Button>升级</Button>
                    </Upload>
                </Modal> */}
                <Upgrade ref='Upgrade'/>
            </div>
        );
    }
}

const LatestVer = props => {
    return [
        <div key='latest' style={{height :　44}}>
            <ul className="ui-mute">最新版本:</ul>
            <label className="oneline" style={{marginLeft : 10, color : 'black'}}>{props.latestVersion}</label>
            <label style={{ cursor: 'pointer', color : 'blue',marginLeft : 6}} onClick={props.versionClick}>（版本说明）</label>
        </div>
    ]
}
