import {Modal, Icon,Button} from 'antd';
import CustomIcon from '~/components/Icon';
import React from "react";

export default class Upgrade extends React.Component{
    constructor(props){
        super(props)
    }
    
    state = {
        download : false,//下载新版本及安装新版本弹窗
        downloadFail : false,//文件下载失败弹窗
        downloadSuccess : false, //升级完成弹窗

        duration : 5,//文件下载时间
        downloadTip : '正在下载新版本，请稍候...',
        warningTip : '下载过程中请勿断电！！！',
        downloadFailtip : '升级文件下载失败，请重试',
        failReason : ''
    }

    startUpgrade = async () => {
        this.setState({
            download : true,
            update : false,
        })
        common.fetchApi({
            opcode : 'UPGRADE_START',
        }).then((resp)=>{
            if(resp.errcode == 0){
                this.setState({
                    duration : resp.data[0].result.upgrade.duration,
                });
            common.fetchApi(
                {opcode : 'UPGRADE_STATE'},
                {},
                {
                    loop : true,
                    interval : 1000,
                    stop : () => this.stop,
                    pending : res => res.data[0].result.upgrade.progress === 'start downloading!' ||  res.data[0].result.upgrade.progress === 'start checking!' || res.data[0].result.upgrade.progress === 'download success!'
                }
            ).then((resp)=>{
                const result = resp.data[0].result.upgrade.progress;
                const errcode = resp.data[0].result.upgrade.code;
                switch(result){
                    case 'download failed!':
                        this.setState({
                            downloadFail : true,
                            download : false,
                            failReason : `错误码：${errcode}`
                        });
                        return;
                    case 'check failed!':
                        this.setState({
                            download : false,
                            downloadFail : true,
                            downloadFailtip : '文件校验失败，请重试',
                            failReason : `错误码：${errcode}`
                        })
                        return;
                    case 'check success!':
                        this.setState({
                            downloadTip : '正在安装新版本，请等待两分钟...',
                            warningTip : '安装过程中请勿断电！！！'
                        });
                        setTimeout(() => {
                                this.setState({
                                downloadSuccess : true,
                                download : false,
                            });
                        },140000)
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

    render(){
        let {downloadSuccess, downloadFailtip,failReason, download, downloadFail,downloadTip,warningTip} = this.state;

        return (
            <div>
                <Modal closable={false} maskClosable={false} visible={download} centered={true} footer={null} width={560} >
                    <div className="progress-download">
                    <Icon key="progress-icon" type="loading" style={{ fontSize: 65, marginTop : 30, marginBottom : 10, color : "#FB8632" }}  spin />
                    <h3 key="active-h3" className="upgrade-download">{downloadTip}</h3>
                    <h4 key="active-h4" className="upgrade-warning">{warningTip}</h4>
                    </div>
                </Modal>
                <Modal closable={false} maskClosable={false} visible={downloadFail} centered={true} footer={<Button className="speed-btn" type="primary" onClick={this.updateFail}>我知道了</Button>} width={560}>
                    <div className="progress-result">
                        <CustomIcon color="red" type="defeated" size={64}/>
                        <div className="progressfill">{downloadFailtip}</div>
                        <div className="progressfail">{failReason}</div>
                    </div>
                </Modal>
                <Modal closable={false} maskClosable={false} visible={downloadSuccess} centered={true} footer={<Button className="speed-btn" type="primary" onClick={this.updateFill}>确定</Button>} width={560}>
                    <div className="progress-result">
                        <CustomIcon color="lightgreen" type="succeed" size={64}/>
                        <div className="progressfill" style={{color : '#333C4F', marginBottom : 30}}>升级完成，请重新登录管理界面</div>
                    </div>
                </Modal>
            </div>
        )
    }
}