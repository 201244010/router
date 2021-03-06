import {Modal, Icon,Button} from 'antd';
import CustomIcon from '~/components/Icon';
import Progress from '~/components/Progress';
import React from "react";
import '../Advance/Systemsetup/system.scss';

const MODULE = 'upgrade';

export default class Upgrade extends React.Component{
    constructor(props){
        super(props);
        this.devList = {};
        this.codeList = {};
        this.err = {
            '-1008': intl.get(MODULE, 12)/*_i18n:云端参数异常*/,
            '-1009': intl.get(MODULE, 13)/*_i18n:非法操作*/,
            '-1012': intl.get(MODULE, 14)/*_i18n:当前已有升级流程在执行*/,
        }
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
        failReason : '',
        devList: {},
        codeList: {}
    }

    startUpgrade = async () => {
        this.setState({
            download: true
        });
        common.fetchApi({
            opcode : 'MESH_UPGRADE_START',
        }).then((resp)=>{
            const { errcode } = resp;
            if(errcode == 0){
                this.setState({
                    duration : resp.data[0].result.upgrade.restart_duration,
                });
            common.fetchApi(
                {opcode : 'MESH_UPGRADE_STATE'},
                {},
                {
                    loop : true,
                    interval : 1000,
                    stop : () => this.stop,
                    pending : res => {
                        const result = res.data[0].result.upgrade;
                        result.map(item => {
                            Object.assign(this.devList, {[item.devid]: item.progress});
                            Object.assign(this.codeList, {[item.devid]: item.code});
                        });
                        this.setState({
                            devList: this.devList,
                            codeList: this.codeList
                        });
                        let state = false;
                        result.some(item => {
                                const progress = item.progress;
                                return state = progress === 'download failed!' || progress === 'check failed!' || progress === 'start upgrading!';
                        })
                        return !state;
                    }
                }
            ).then(() => {
                const {devList, codeList} = this.state;
                
                Object.keys(devList).forEach((key) => {
                    const errcode = codeList[key];
                    switch(devList[key]) {
                        case 'download failed!':
                        this.setState({
                            downloadFail : true,
                            download : false,
                            failReason : intl.get(MODULE, 3, {error: errcode})/*_i18n:错误码：{error}*/
                        });
                        return;
                        case 'check failed!':
                            this.setState({
                                download : false,
                                downloadFail : true,
                                downloadFailtip : intl.get(MODULE, 4)/*_i18n:文件校验失败，请重试*/,
                                failReason : intl.get(MODULE, 5, {error: errcode})/*_i18n:错误码：{error}*/
                            })
                            return;
                        case 'start upgrading!':
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
            }) 
        } else {
            Modal.error({title : this.err[errcode] || intl.get(MODULE, 6)/*_i18n:启动升级失败*/, centered: true});
            this.setState({
                download: false
            });
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
                    <Icon key="progress-icon" type="loading" style={{ fontSize: 65, marginTop : 30, marginBottom : 10, color : "#6174F1" }}  spin />
                    <h3 key="active-h3" className="upgrade-download">{downloadTip}</h3>
                    <h4 key="active-h4" className="upgrade-warning">{warningTip}</h4>
                    </div>
                </Modal>
                <Modal closable={false} maskClosable={false} visible={downloadFail} centered={true} footer={<Button className="speed-btn" type="primary" onClick={this.updateFail}>{intl.get(MODULE, 7)/*_i18n:我知道了*/}</Button>} width={560}>
                    <div className="progress-result">
                        <CustomIcon className='result-icon-defeated' type="defeated" size={64}/>
                        <div className="progressfill">{downloadFailtip}</div>
                        <div className="progressfail">{failReason}</div>
                    </div>
                </Modal>
                <Modal closable={false} maskClosable={false} visible={downloadSuccess} centered={true} footer={<Button className="speed-btn" type="primary" onClick={this.updateFill}>{intl.get(MODULE, 8)/*_i18n:确定*/}</Button>} width={560}>
                    <div className="progress-result">
                        <CustomIcon className='result-icon-succeed' type="succeed" size={64}/>
                        <div className="progressfill progressfill-color">{intl.get(MODULE, 9)/*_i18n:升级完成，请重新登录管理界面*/}</div>
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