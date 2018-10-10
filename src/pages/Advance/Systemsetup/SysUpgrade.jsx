
import React from 'react';

import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Button, Modal, Icon} from 'antd';
import CustomIcon from '~/components/Icon';

export default class SysUpgrade extends React.Component{
    state = {
        loading : false,
        disable : false,
        currentVersion : 'V1.0.0',//当前版本
        latestVersion : 'V2.0.0',//最新版本

        version : false,//版本说明弹窗
        download : false,//下载新版本及安装新版本弹窗
        downloadFail : false,//文件下载失败弹窗
        downloadSuccess : false, //升级完成弹窗
        //checkFail : false,//文件校验失败弹窗

        duration : 5,//文件下载时间
        downloadTip : '正在下载新版本，请稍候...',
        warningTip : '下载过程中请勿断电！！！',
        downloadFailtip : '升级文件下载失败，请重试',
        failReason : '这里是失败原因【1000】'
    }

    post = async ()=> {
        this.setState({
            downloadSuccess : true,
        })

        let response = await common.fetchWithCode(
            'UPGRADE_START',
            {method : 'POST'}
        ).catch(ex =>{});

        this.setState({
            duration : response.duration,
        })

        response = common.fetchWithCode(
            'UPGRADE_STATE',
            {method : 'POST'}
        ).catch(ex =>{});

        

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

    updateFail = () => {
        this.setState({
            downloadFail : false
        })
    }

    updateFill = () => {
        this.setState({
            downloadSuccess : false
        })
    }

    getInfo = async ()=>{
        let response = await common.fetchWithCode(
            'FIRMWARE_GET',
            { method : 'POST'}
        ).catch(ex=>{})
        console.log(response)
        let {data,errcode} =response;
        let result = data[0].result.upgrade

        if(errcode == 0){       
            this.setState({
                currentVersion : result.current_version,
                latestVersion : result.newest_version
            })

            return;
        }
        
        Modal.error({title : '获取路由器当前版本信息和最新版本信息失败'});
    }

    componentDidMount(){
        this.getInfo();
        this.handleDisable();
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

    updateFail = () => {
        this.setState({
            downloadFail : false
        })
    }

    updateFill = () => {
        this.setState({
            downloadSuccess : false
        })
    }

    getInfo = async ()=>{
        let response = await common.fetchWithCode(
            'FIRMWARE_GET',
            { method : 'POST'}
        ).catch(ex=>{})
        console.log(response)
        let {data,errcode} =response;

        if(errcode == 0){       
            this.setState({
                currentVersion : data.current_version,
                latestVersion : data.newest_version
            })
        }
        
        Modal.error({title : '获取路由器当前版本信息和最新版本信息失败'});
    }

    componentDidMount(){
        this.getInfo();
    }

    render(){
        const {downloadSuccess, downloadFailtip,failReason,loading,download,downloadFail, disable, version, currentVersion, latestVersion,downloadTip,warningTip} = this.state;

        return (
            <div style={{paddingLeft : 60}}>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="在线升级" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
                <div style={{height :　44, marginTop : 20}}>
                    <ul className="ui-mute">当前版本:</ul>
                    <label className="oneline" style={{marginLeft : 10, color : 'black'}}>{currentVersion}</label>
                </div>
                {
                    (currentVersion === latestVersion || latestVersion === "") ? <div style={{color : '#ADB1B9', marginBottom : 20}}>你的版本是最新，无需升级</div>
                    : <LatestVer latestVersion={latestVersion} versionClick={this.versionClick}/>
                }
                <section className="wifi-setting-save" style={{marginTop : -10 ,borderTop : 'none'}}>
                    <Button disabled={disable} style={{left:0}} className="wifi-setting-button" type="primary" loading={loading} onClick={this.post}>立即更新</Button>
                </section>
                <Modal closable={false} visible={version} centered={true} footer={null} okText="知道了"
                    onCancel={this.handleCancle}
                >
                    <div className="head-line">
                        <CustomIcon type="mistake" size={16} color='black'/>
                        <label className="head-title">版本说明</label>
                    </div>
                    <div className="head-content">
                        这是版本说明这是版本说明这是版本说明这是版本说明
                    </div>
                    <section className="button-bottom">
                            <Button className="button-click" type="primary" onClick={this.handleCancle}>我知道了</Button>
                    </section>
                </Modal>
                <Modal closable={false} visible={download} centered={true} footer={null} >
                    <div className="progress-test">
                    <Icon key="progress-icon" type="loading" style={{ fontSize: 65, marginTop : 30, marginBottom : 10, color : "#FB8632" }}  spin />,
                    <h3 key="active-h3" style={{fontSize : 16, fontWeight : 600}}>{downloadTip}</h3>
                    <h4 key="active-h4" style={{fontSize : 12, color : 'red'}}>{warningTip}}</h4>
                    </div>
                </Modal>
                <Modal closable={false} visible={downloadFail} centered={true} footer={null}>
                    <div className="progress-test">
                        <CustomIcon color="red" type="defeated" size={64}/>
                        <div className="speedfill">{downloadFailtip}</div>
                        <div style={{marginBottom : 32, marginTop : 6,fontSize : 12}}>{failReason}</div>
                    </div>
                    <section className="speed-bottom">
                            <Button className="speed-button" type="primary" onClick={this.updateFail}>我知道了</Button>
                    </section>
                </Modal>
                <Modal closable={false} visible={downloadSuccess} centered={true} footer={null}>
                    <div className="progress-test">
                        <CustomIcon color="lightgreen" type="succeed" size={64}/>
                        <div className="speedfill" style={{color : '#333C4F', marginBottom : 30}}>升级完成，请重新登录管理界面</div>
                    </div>
                    <section className="speed-bottom">
                            <Button className="speed-button" type="primary" onClick={this.updateFill}>确定</Button>
                    </section>
                </Modal>
            </div>
        );
    }
}

const LatestVer = props => {
    return [
        <div key='latest' style={{height :　44}}>
            <ul className="ui-mute">最新版本:</ul>
            <label className="oneline" style={{marginLeft : 10, color : 'black'}}>{props.latestVersion}</label>
            <label style={{color : 'blue',marginLeft : 6}} onClick={props.versionClick}>（版本说明）</label>
        </div>
    ]
}
