import {Modal, Icon,Button} from 'antd';
import CustomIcon from '~/components/Icon';
import Progress from '~/components/Progress';
import React from "react";
import '../Advance/Systemsetup/system.scss';

const MODULE = 'upgrade';

export default class Upgrade extends React.Component{
    constructor(props){
        super(props)
    }
    
    state = {
        download : false,//下载新版本及安装新版本弹窗
        downloadFail : false,//文件下载失败弹窗
        downloadSuccess : false, //升级完成弹窗

        visible: false,
        duration : 150,//文件下载时间
        downloadTip : intl.get(MODULE, 0)/*_i18n:正在下载软件，请耐心等待*/,
        warningTip : intl.get(MODULE, 1)/*_i18n:下载过程中请勿断电！！！*/,
        downloadFailtip : intl.get(MODULE, 2)/*_i18n:升级文件下载失败，请重试*/,
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
                    duration : resp.data[0].result.upgrade.restart_duration,
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
                            failReason : intl.get(MODULE, 3, {error: errcode})/*_i18n:错误码：*/
                        });
                        return;
                    case 'check failed!':
                        this.setState({
                            download : false,
                            downloadFail : true,
                            downloadFailtip : intl.get(MODULE, 4)/*_i18n:文件校验失败，请重试*/,
                            failReason : intl.get(MODULE, 5, {error: errcode})/*_i18n:错误码：*/
                        })
                        return;
                    case 'check success!':
                        this.setState({
                            download : false,
                            downloadFail : false,
                            visible: true,
                        });
                        setTimeout(() => {
                                this.setState({
                                downloadSuccess : true,
                                visible: false,
                            });
                        },this.state.duration*1000);
                        return;
                    default:
                        break;
                }
            }) 
        }else{
            Modal.error({title : intl.get(MODULE, 6)/*_i18n:启动升级失败*/, centered: true});
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
        let {downloadSuccess, downloadFailtip,failReason, download, downloadFail,downloadTip,warningTip,visible,duration} = this.state;

        return (
            <div>
                <Modal closable={false} maskClosable={false} visible={download} centered={true} footer={null} width={560} >
                    <div className="progress-download">
                    <Icon key="progress-icon" type="loading" style={{ fontSize: 65, marginTop : 30, marginBottom : 10, color : "#FB8632" }}  spin />
                    <h3 key="active-h3" className="upgrade-download">{downloadTip}</h3>
                    <h4 key="active-h4" className="upgrade-warning">{warningTip}</h4>
                    </div>
                </Modal>
                <Modal closable={false} maskClosable={false} visible={downloadFail} centered={true} footer={<Button className="speed-btn" type="primary" onClick={this.updateFail}>{intl.get(MODULE, 7)/*_i18n:我知道了*/}</Button>} width={560}>
                    <div className="progress-result">
                        <CustomIcon color="red" type="defeated" size={64}/>
                        <div className="progressfill">{downloadFailtip}</div>
                        <div className="progressfail">{failReason}</div>
                    </div>
                </Modal>
                <Modal closable={false} maskClosable={false} visible={downloadSuccess} centered={true} footer={<Button className="speed-btn" type="primary" onClick={this.updateFill}>{intl.get(MODULE, 8)/*_i18n:确定*/}</Button>} width={560}>
                    <div className="progress-result">
                        <CustomIcon color="lightgreen" type="succeed" size={64}/>
                        <div className="progressfill" style={{color : '#333C4F'}}>{intl.get(MODULE, 9)/*_i18n:升级完成，请重新登录管理界面*/}</div>
                    </div>
                </Modal>
                {visible && 
                    <Progress
                    duration={duration}
                    title={intl.get(MODULE, 10)/*_i18n:正在升级系统，请耐心等待*/}
                    tips={intl.get(MODULE, 11)/*_i18n:升级过程中请勿断电*/}
                    showPercent={false}
                    />
                }
            </div>
        )
    }
}