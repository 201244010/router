
import React from 'react';

import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Button, Modal, Icon} from 'antd';
import CustomIcon from '~/components/Icon';

export default class SysUpgrade extends React.Component{
    state = {
        loading : false,
        disable : true,
        currentVersion : '',//当前版本
        latestVersion : '',//最新版本
        releaseLog : '',//版本说明

        version : false,//版本说明弹窗
        download : false,//下载新版本及安装新版本弹窗
        downloadFail : false,//文件下载失败弹窗
        downloadSuccess : false, //升级完成弹窗

        duration : 5,//文件下载时间
        downloadTip : '正在下载新版本，请稍候...',
        warningTip : '下载过程中请勿断电！！！',
        downloadFailtip : '升级文件下载失败，请重试',
        failReason : '这里是失败原因【1000】'
    }

    post = async ()=> {
        this.setState({
            download : true,
        })
        common.fetchWithCode(
            'UPGRADE_START',
            {method : 'POST'}
        ).then((resp)=>{
            if(resp.errcode == 0){
                this.setState({
                    duration : resp.data[0].result.upgrade.duration,
                });
            common.fetchWithCode(
                'UPGRADE_STATE',
                {method : 'POST'},
                {
                    loop : true,
                    interval : 1000,
                    stop : () => this.stop,
                    pending : res => res.data[0].result.upgrade.progress === 'start downloading!' ||  res.data[0].result.upgrade.progress === 'start checking!' || res.data[0].result.upgrade.progress === 'download success!'
                }
            ).then((resp)=>{
                const result = resp.data[0].result.upgrade.progress;
                switch(result){
                    case 'download failed!':
                        this.setState({
                            downloadFail : true,
                            download : false
                        });
                        return;
                    case 'check failed!':
                        this.setState({
                            download : false,
                            downloadFail : true,
                            downloadFailtip : '文件校验失败，请重试',
                            failReason : '这里是失败原因【1000】'
                        })
                        return;
                    case 'check success!':
                        this.setState({
                            downloadTip : '正在安装新版本，请等待1分钟...',
                            warningTip : '安装过程中请勿断电！！！'
                        });
                        setTimeout(() => {
                                this.setState({
                                downloadSuccess : true,
                                download : false,
                            });
                        },80000)
                        return;
                    default:
                        break;
                }
            }) 
        }else{
            Modal.error({title : '启动升级失败'});
        }});
    }

    updateFail = () => {
        this.setState({
            downloadFail : false
        })
    }

    updateFill = () => {
        this.setState({
            downloadSuccess : false
        });
        window.location.href = '/login'
    }

    getInfo = async ()=>{
        let response = await common.fetchWithCode(
            'FIRMWARE_GET',
            { method : 'POST'}
        ).catch(ex=>{})
        let {data,errcode} =response;
        let result = data[0].result.upgrade

        if(errcode == 0){       
            this.setState({
                currentVersion : result.current_version,
                latestVersion : result.newest_version,
                releaseLog : result.release_log,
            },() => {
                    if (this.state.currentVersion !== this.state.latestVersion && this.state.latestVersion !== ''){
                        this.setState({
                            disable : false
                        })
                    }
            })
            return;
        }else{
            Modal.error({title : '获取路由器当前版本信息和最新版本信息失败'});
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

    render(){
        const {releaseLog, downloadSuccess, downloadFailtip,failReason,loading,download,downloadFail, disable, version, currentVersion, latestVersion,downloadTip,warningTip} = this.state;

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
                    (currentVersion === latestVersion || latestVersion === "") ? <div style={{color : '#ADB1B9', marginBottom : 20}}>你的版本是最新，无需升级</div>
                    : <LatestVer latestVersion={latestVersion} versionClick={this.versionClick}/>
                }
                <section className="upgrade-save" style={{marginTop : -10 ,borderTop : 'none'}}>
                    <Button disabled={disable} style={{left:0}} className="upgrade-btn" type="primary" loading={loading} onClick={this.post}>立即更新</Button>
                </section>
                <Modal closable={false} visible={version} centered={true} footer={null} okText="知道了"
                    onCancel={this.handleCancle}
                >
                    <div className="head-line">
                        <CustomIcon type="mistake" size={16} color='black'/>
                        <label className="head-title">版本说明</label>
                    </div>
                    <div className="head-content">
                        {releaseLog}
                    </div>
                    <section className="button-bottom">
                            <Button className="button-click" type="primary" onClick={this.handleCancle}>我知道了</Button>
                    </section>
                </Modal>
                <Modal closable={false} visible={download} centered={true} footer={null} width={560} >
                    <div className="progress-download">
                    <Icon key="progress-icon" type="loading" style={{ fontSize: 65, marginTop : 30, marginBottom : 10, color : "#FB8632" }}  spin />,
                    <h3 key="active-h3" className="upgrade-download">{downloadTip}</h3>
                    <h4 key="active-h4" className="upgrade-warning">{warningTip}</h4>
                    </div>
                </Modal>
                <Modal closable={false} visible={downloadFail} centered={true} footer={null} width={560}>
                    <div className="progress-result">
                        <CustomIcon color="red" type="defeated" size={64}/>
                        <div className="progressfill">{downloadFailtip}</div>
                        <div className="progressfail">{failReason}</div>
                    </div>
                    <section className="speed-btm">
                            <Button className="speed-btn" type="primary" onClick={this.updateFail}>我知道了</Button>
                    </section>
                </Modal>
                <Modal closable={false} visible={downloadSuccess} centered={true} footer={null} width={560}>
                    <div className="progress-result">
                        <CustomIcon color="lightgreen" type="succeed" size={64}/>
                        <div className="progressfill" style={{color : '#333C4F', marginBottom : 30}}>升级完成，请重新登录管理界面</div>
                    </div>
                    <section className="speed-btm">
                            <Button className="speed-btn" type="primary" onClick={this.updateFill}>确定</Button>
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
