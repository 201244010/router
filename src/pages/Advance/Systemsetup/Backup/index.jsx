import React from 'react';
import Progress from '~/components/Progress';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Checkbox, Button, Modal, Radio, Upload, message} from 'antd';
import CustomIcon from '~/components/Icon';
import Loading from '~/components/Loading';
import { get } from '~/assets/common/auth';
import { get as getCookie } from '~/assets/common/cookie';
import {getLang} from '~/i18n/index';
import SubLayout from '~/components/SubLayout';

const MODULE = 'backup';
const {FormItem, Input} = Form;
const RadioGroup = Radio.Group;
let checkToCloud = true;

import './backup.scss'

const error = {
    // '-1500' : '未绑定商米账号，请先下载商米助手APP进行绑定',
    // '-1501' : '响应超时，请检查网络连接并重试',
    // '-1502' : '响应超时，请检查网络连接并重试',
    // '-1503' : '抱歉，服务暂时不可用，请稍后再试'
    '-1500' : intl.get(MODULE, 0)/*_i18n:未绑定商米账号，请先下载商米助手APP进行绑定*/,
    '-1501' : intl.get(MODULE, 1)/*_i18n:响应超时，请检查网络连接并重试*/,
    '-1502' : intl.get(MODULE, 2)/*_i18n:响应超时，请检查网络连接并重试*/,
    '-1503' : intl.get(MODULE, 3)/*_i18n:抱歉，服务暂时不可用，请稍后再试*/,
}

export default class Backup extends React.Component{
    state = {
        backupCloud : false,//备份到云弹窗
        backupFail : false,//备份失败，恢复失败
        // backupFailTip : '备份失败！请重试～',//备份失败以及网络未连接提示
        backupFailTip : intl.get(MODULE, 4)/*_i18n:备份失败！请重试*/,//备份失败以及网络未连接提示
        backupSuccess : false,//备份成功 , 恢复成功
        // backupSuccessTip : '备份成功！',
        backupSuccessTip : intl.get(MODULE, 5)/*_i18n:备份成功！*/,
        filename : '',

        baseBackup : true,
        authBackup : true,

        recoverCloud : false,//从云恢复
        recoverDisable : true,//从云恢复保存按钮
        backupDisable : false,//备份到云保存按钮
        radioChoose : '',
        cloudList : [],
        duration: 120,
        loadingActive: false,
        succeedActive: false,
    }

    checkBasebackup = () => {
        this.setState({
            baseBackup : !this.state.baseBackup
        })
    }

    checkAuthbackup = () => {
        this.setState({
            authBackup : !this.state.authBackup
        })
    }

    handleCancle = () => {
        this.setState({
            backupCloud : false,
            recoverCloud : false
        })
    }

    cloudBackup = async () => {
        const {filename} = this.state; 
        let response = await common.fetchApi({
            opcode : 'SYSTEMTOOLS_CLOUD_LIST'
        })
        let {errcode, data} = response;
        if(errcode == 0){
            let result = data[0].result.configlist;
            let sortObj = result.sort(this.compare('id'))
            this.setState({
                backupCloud : true,
                backupDisable : filename === '' ? true : false,
                cloudList : sortObj.map(item => {
                    return Object.assign({}, item)
                }),
            });

            return;
        }else{
            // message.error(`获取备份列表失败[${error[errcode]}]`);
            message.error(intl.get(MODULE, 6, {error: error[errcode]})/*_i18n:获取备份列表失败[{error}]*/);
        }
    }

    compare = (id) => {
        return (object1, object2) => {
            return object2[id] - object1[id];
        }
    }

    cloudRecover = async () => {
        let response = await common.fetchApi({
            opcode : 'SYSTEMTOOLS_CLOUD_LIST'
        })
  
        let {errcode, data} = response;
        if(errcode == 0){
            let result = data[0].result.configlist;
            let sortObj = result.sort(this.compare('id'))
            this.setState({
                recoverCloud : true,
                cloudList : sortObj.map(item => {
                    
                    return Object.assign({}, item)
                }),
                recoverDisable : (result.length === 0 || this.state.radioChoose === '') ? true : false
            });
            return;
        }else{
            // message.error(`获取备份列表失败[${error[errcode]}]`);
            message.error(intl.get(MODULE, 7, {error: error[errcode]})/*_i18n:获取备份列表失败[{error}]*/);
        }
    }


    backupFailCancle = () => {
        this.setState({
            backupFail : false
        })
    }

    backupSuccessCancle = () => {
        if(this.state.backupSuccess && !checkToCloud){
            location.href = '/login';
        }
        this.setState({
            backupSuccess : false
        });   
    }

    radioChange = (event) => {
        this.setState({
            radioChoose : event.target.value,
            recoverDisable : false
        })
    }

    onChange = (key,feild) => {
        this.setState({
            [feild] : key,
            backupDisable : key === '' ? true : false,
        })
    }
    //备份到本地
    postBackupLocal = () => {
        const {  baseBackup, authBackup } = this.state;
        let backup = {
            basebackup: baseBackup ? 1 : 0,
            authbackup: authBackup ? 1 : 0,
        };

        common.fetchApi({
            opcode : 'SYSTEMTOOLS_BACKUP',
            data : {backup}
        }, {
            fileLink : true, responseType : 'blob'
        }).then(res => {
            if (res.errcode) {
                // message.error('备份到本地失败');
                message.error(intl.get(MODULE, 8)/*_i18n:备份到本地失败*/);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    //备份到云
    postBackupCloud = async () => {
        const { filename, baseBackup, authBackup } = this.state;
        let backup = {
            filename: filename,
            basebackup: baseBackup ? 1 : 0,
            authbackup: authBackup ? 1 : 0,
        };
        console.log('backup',backup);
        await common.fetchApi(
            {
                opcode : 'SYSTEMTOOLS_CLOUD_BACKUP',
                data : {backup}
            }
        ).then((res) => {
            let {errcode} = res;
            Loading.show({duration : 0});
            if(errcode === 0){
                common.fetchApi(
                    {
                        opcode : 'SYSTEMTOOLS_CLOUD_BACKUP_PROGRESS',
                    },
                    {},
                    {
                        loop : true,
                        interval : 1000,
                        stop : ()=>{this.stop},
                        pending : (res) => res.data[0].result.state === 'wait'
                    }).then((res) => {
                        Loading.close();
                        let state = res.data[0].result.state;
                        if(res.errcode === 0){
                            if(state === 'success'){
                                checkToCloud = true;
                                this.setState({
                                    backupSuccess : true,
                                    backupCloud : false,
                                    // backupSuccessTip : '备份成功',
                                    backupSuccessTip : intl.get(MODULE, 9)/*_i18n:备份成功*/,
                                    filename : '',
                                });
                                return;
                            }else{
                                this.setState({
                                    backupFail : true,
                                    backupCloud : false,
                                    // backupFailTip : '备份失败！请重试~',
                                    backupFailTip : intl.get(MODULE, 10)/*_i18n:备份失败！请重试*/,
                                });
                                return;
                            }
                        }else{
                            // message.error(`获取备份进度失败${error[errcode]}`);
                            message.error(intl.get(MODULE, 11, {error: error[errcode]})/*_i18n:获取备份进度失败[{error}]*/);
                        }
                    })
            }else{
                if(errcode === '-1501'){
                    this.setState({
                        backupFail : true,
                        // backupFailTip : '路由器无法连接网络，请检查～',
                        backupFailTip : intl.get(MODULE, 12)/*_i18n:路由器无法连接网络，请检查*/,
                    })
                }else{
                    // message.error(`无法完成操作${error[errcode]}`);
                    message.error(intl.get(MODULE, 13, {error: error[errcode]})/*_i18n:无法完成操作[{error}]*/);
                }
            }
        })
    }

    //从本地恢复
    postRecoverLocal = (info) => {
        if(info.file.status === 'done'){
            if(info.file.response.data[0].errcode == 0){
                common.fetchApi({opcode : 'SYSTEMTOOLS_RESTART'}).then(res => {
                    const duration = res.data[0].result.restart_duration;
                    if(res.errcode === 0){
                        this.setState({
                            loadingActive: true,
                            duration: duration,
                        });   
                        setTimeout(() => {
                            checkToCloud = false;
                            this.setState({
                                loadingActive: false,
                                backupSuccess : true,
                                // backupSuccessTip : '恢复成功！请重新连接无线网络',
                                backupSuccessTip : intl.get(MODULE, 14)/*_i18n:恢复成功！请重新连接无线网络*/,
                                recoverCloud : false
                            });
                        }, duration * 1000);
                        return;
                    }else{
                        this.setState({
                            loadingActive: false,
                        });
                        //Loading.close();
                        // message.error('重启失败!');
                        message.error(intl.get(MODULE, 15)/*_i18n:重启失败*/);
                        return;
                    }
                });
            }else{
                //Loading.close();
                this.setState({
                    backupFail : true,
                    // backupFailTip : '恢复失败！请重试～',
                    backupFailTip : intl.get(MODULE, 16)/*_i18n:恢复失败！请重试*/,
                    recoverCloud : false,
                });
                return;
            }
        }
        if(info.file.status === 'error'){
            if (403 == info.file.error.status) {
                location.href = '/login';
                return;
            }

            // message.error('上传失败');
            message.error(intl.get(MODULE, 17)/*_i18n:上传失败*/);
        }
    }

    //从云恢复
    postRecoverCloud = async () => {
        this.setState({
            recoverCloud: false,
            loadingActive: true,
            duration: 90
        });
        let param = {
            id : this.state.radioChoose
        };
        await common.fetchApi(
            {
                opcode : 'SYSTEMTOOLS_CLOUD_RESTORE',
                data : param
            }
        ).then((res) => {
            let {errcode} = res;
            if(errcode === 0){
                common.fetchApi(
                    {opcode : 'SYSTEMTOOLS_CLOUD_RESTORE_PROGRESS'},
                    {},
                    {
                        loop : true,
                        interval : 1000,
                        stop : () => this.stop,
                        pending : (res) => {
                            let state = res.data[0].result.state;
                            return state === 'wait' || state === 'start restore'
                        }
                    }
                ).then((res) => {
                    let state = res.data[0].result.state;
                    if(res.errcode === 0){
                        switch(state){
                            case 'download fail':
                                this.setState({
                                    loadingActive: false,
                                    backupFail : true,
                                    // backupFailTip : '下载失败，请重试～',
                                    backupFailTip : intl.get(MODULE, 18)/*_i18n:下载失败，请重试*/,
                                });
                                return;
                            case 'restore fail':
                                this.setState({
                                    loadingActive: false,
                                    backupFail : true,
                                    // backupFailTip : '恢复失败！请重试～',
                                    backupFailTip : intl.get(MODULE, 19)/*_i18n:恢复失败！请重试*/,
                                });
                                return;
                            case 'restore success':
                                common.fetchApi({opcode : 'SYSTEMTOOLS_RESTART'}).then(res => {
                                if(res.errcode === 0){
                                    setTimeout(() => {
                                        checkToCloud = false;
                                        this.setState({
                                            loadingActive: false,
                                            backupSuccess : true,
                                            backupSuccessTip : intl.get(MODULE, 20)/*_i18n:恢复成功！请重新连接无线网络*/,
                                        });
                                    }, 90000);
                                    return;
                                }else{
                                    this.setState({
                                        loadingActive: false,
                                    });
                                    // message.error('重启失败!');
                                    message.error(intl.get(MODULE, 21)/*_i18n:重启失败*/);
                                }
                            })
                        }
                    }else{
                        this.setState({
                            loadingActive: false,
                        });
                        // message.error('获取云恢复状态失败');
                        message.error(intl.get(MODULE, 22)/*_i18n:获取云恢复状态失败*/);
                    }
                })
            }else{
                // message.error(`无法完成操作${error[errcode]}`);
                message.error(intl.get(MODULE, 23, {error: error[errcode]})/*_i18n:无法完成操作[{error}]*/);
            }
        })
    }

    render(){
        const { backupSuccessTip, baseBackup, authBackup, backupCloud, radioChoose, backupFail, backupSuccess, 
            backupFailTip, recoverCloud, cloudList, backupDisable, recoverDisable, filename, loadingActive, duration
             } = this.state;
        const recoverList = cloudList.map(item => {
            return (
                <li key={item.id} className="recover-li">
                    <Radio value={item.id}></Radio><p className="recover-filename">{item.filename}</p>
                    <p className="recover-time">{item.upload_time}</p>
                </li>
            )
        });

        return (
            <SubLayout className="net-setting">
            <div className="backup-restore">
                <Form>
                    <section style={{marginTop:10}}>
                        <PanelHeader title={intl.get(MODULE, 24)/*_i18n:备份*/} checkable={false} onChange={{}} />
                    </section>
                    <section>
                        {
                            getCookie('_WECHAT') === 'IS_WECHAT' ? (<ul className='backup-list'>
                                <li><Checkbox checked={baseBackup} onChange={this.checkBasebackup}>{intl.get(MODULE, 25)/*_i18n:管理密码、Wi-Fi配置、上网配置、局域网配置、带宽设置、优先设备、防蹭网*/}</Checkbox></li>
                                <li><Checkbox checked={authBackup} onChange={this.checkAuthbackup}>{intl.get(MODULE, 26)/*_i18n:微信连Wi-Fi配置*/}</Checkbox></li>
                            </ul>) : ''
                        }
                        <div className={getLang() === 'zh-cn' ? 'func-btn' : 'func-btn-us'}>
                            <Button onClick={this.postBackupLocal}>{intl.get(MODULE, 27)/*_i18n:备份到本地*/}</Button>
                            <Button onClick={this.cloudBackup}>{intl.get(MODULE, 28)/*_i18n:备份到云*/}</Button>
                        </div>
                    </section>
                    <section className='restore'>
                        <PanelHeader title={intl.get(MODULE, 29)/*_i18n:恢复*/} checkable={false} onChange={{}} />
                        <div className='restore-func'>
                            <Upload
                                onChange={this.postRecoverLocal}
                                name='file'
                                data={{ opcode: '0x2018' }}
                                multiple={false}
                                headers={{
                                    'XSRF-TOKEN': get(),
                                }}
                                action={__BASEAPI__}
                            >
                                <Button>{intl.get(MODULE, 30)/*_i18n:从本地恢复*/}</Button>
                            </Upload>
                            <Button className={getLang() === 'zh-cn' ? 'cloud-restore' : 'cloud-restore-us'} onClick={this.cloudRecover}>{intl.get(MODULE, 31)/*_i18n:从云恢复*/}</Button>
                        </div>
                    </section>
                </Form>
                <Modal title={intl.get(MODULE, 32)/*_i18n:备份到云*/} visible={backupCloud} maskClosable={false} centered={true} width={360} closable={false} cancelText={intl.get(MODULE, 44)/*_i18n:取消*/} okText={intl.get(MODULE, 33)/*_i18n:开始备份*/} okButtonProps={{disabled : backupDisable}} onCancel={this.handleCancle} onOk={this.postBackupCloud}>
                    <div className="backup-modal">
                        <div className="backup-filename">{intl.get(MODULE, 34)/*_i18n:文件名*/}</div>
                        <div>
                            <FormItem type="small" >
                                <Input type="text" value={filename} maxLength={32} onChange={value => this.onChange(value, 'filename')} placeholder={intl.get(MODULE, 35)/*_i18n:请输入文件名*/} />
                            </FormItem>
                        </div>
                        <div className="backup-latest">
                            <div>{intl.get(MODULE, 36)/*_i18n:最新的备份：*/}</div>
                            {
                                cloudList.length === 0 ? <div className="backup-not">{intl.get(MODULE, 37)/*_i18n:您还未进行过备份*/}</div> : <Latestbackup cloudList={cloudList[0].filename} time={cloudList[0].upload_time} />
                            }
                        </div>
                    </div>
                </Modal>
                <Modal closable={false} visible={backupFail} maskClosable={false} centered={true} footer={<Button className="backup-btm" type="primary" onClick={this.backupFailCancle}>{intl.get(MODULE, 38)/*_i18n:我知道了*/}</Button>} width={560}>
                    <div className="backup-icon">
                        <CustomIcon color="#FF5500" type="defeated" size={64} />
                        <div className="backup-result">{backupFailTip}</div>
                    </div>
                </Modal>
                <Modal closable={false} visible={backupSuccess} maskClosable={false} centered={true} footer={<Button className="backup-btm" type="primary" onClick={this.backupSuccessCancle}>{intl.get(MODULE, 39)/*_i18n:确定*/}</Button>} width={560} >
                    <div className="backup-icon">
                        <CustomIcon color="#87D068" type="succeed" size={64} />
                        <div className="backup-result">{backupSuccessTip}</div>
                    </div>
                </Modal>
                <Modal title={intl.get(MODULE, 41)/*_i18n:从云选择备份文件*/} visible={recoverCloud} maskClosable={false} width={360} centered={true} closable={false} cancelText={intl.get(MODULE, 44)/*_i18n:取消*/} okText={intl.get(MODULE, 40)/*_i18n:开始恢复*/} okButtonProps={{disabled : recoverDisable}} onCancel={this.handleCancle} onOk={this.postRecoverCloud}>
                    <ul className="recover-ul">
                        <RadioGroup onChange={this.radioChange} value={radioChoose}>
                            {
                                cloudList.length === 0 ? <div className="backup-not">{intl.get(MODULE, 42)/*_i18n:您还未进行过备份*/}</div> : recoverList
                            }
                        </RadioGroup>
                    </ul>
                </Modal>
                {loadingActive &&
                    <Progress
                        duration={duration}
                        title={intl.get(MODULE, 43)/*_i18n:正在恢复配置，请耐心等待...*/}
                    />
                }
            </div>
            </SubLayout>
        );
    }
}

const Latestbackup = props => {
    return (
        <div className="backup-message-time">
            <label className="backup-message">{props.cloudList}</label>
            <label className="backup-time">{props.time}</label>
        </div>
    )
}