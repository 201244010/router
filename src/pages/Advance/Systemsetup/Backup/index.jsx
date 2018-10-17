import React from 'react';

import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Checkbox, Button, Modal, Radio, Upload,Icon} from 'antd';
import CustomIcon from '~/components/Icon';
const {FormItem, Input} = Form;
const RadioGroup = Radio.Group;

import './backup.scss'

export default class Backup extends React.Component{
    state = {

        backupCloud : false,//备份到云弹窗
        backupFail : false,//备份失败，恢复失败
        backupFailTip : '备份失败请重试',//备份失败以及网络未连接提示
        backupSuccess : false,//备份成功 , 恢复成功
        backupSuccessTip : '备份成功！',
        filename : '',

        baseBackup : true,
        authBackup : true,

        recoverCloud : false,//从云恢复
        radioChoose : '',
        cloudList : []
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
        this.setState({
            backupCloud : true,
        });
        let response = await common.fetchApi({
            opcode : 'CONFIG_CLOUD_CONFIGLIST'
        })
        
        let {errcode, data} = response;
        if(errcode == 0){
            let result = data[0].result.configlist;
            let sortObj = result.sort(this.compare('id'))
            this.setState({
                cloudList : sortObj.map(item => {
                    return Object.assign({}, item)
                }),
                filename : ''
            });

            return;
        }else{
            Modal.error({title : '获取备份列表失败'});
        }

    }

    compare = (id) => {
        return (object1, object2) => {
            return object2[id] - object1[id];
        }
    }

    cloudRecover = async () => {
        this.setState({
            recoverCloud : true
        })
        let response = await common.fetchApi({
            opcode : 'CONFIG_CLOUD_CONFIGLIST'
        })
  
        let {errcode, data} = response;
        if(errcode == 0){
            let result = data[0].result.configlist;
            let sortObj = result.sort(this.compare('id'))
            this.setState({
                cloudList : sortObj.map(item => {
                    
                    return Object.assign({}, item)
                })
            });

            return;
        }else{
            Modal.error({title : '获取备份列表失败'});
        }
    }


    backupFailCancle = () => {
        this.setState({
            backupFail : false
        })
    }

    backupSuccessCancle = () => {
        this.setState({
            backupSuccess : false
        })
    }

    radioChange = (event) => {
        this.setState({
            radioChoose : event.target.value,
        })
    }

    onChange = (key,feild) => {
        this.setState({
            [feild] : key
        })
    }
    //备份到本地
    postBackupLocal = async () => {
        let backup = {};
        backup['basebackup'] = this.state.baseBackup ? 1 : 0;
        backup['authbackup'] = this.state.authBackup ? 1 : 0;

        let response = await common.fetchApi({
            opcode : 'CONFIG_LOCAL_BACKUP',
            data : {backup}
        },
        {
            fileLink : true, responseType : 'blob'
        })

        let {errcode} = response;
        if(errcode == 0){
            return;
        }else{
            Modal.error({title : '备份到本地失败'});
        }
    }

    //备份到云
    postBackupCloud = async () => {
        let backup = {};
        backup['filename'] = this.state.filename;
        backup['authbackup'] = this.state.authBackup ? 1 : 0;
        backup['basebackup'] = this.state.baseBackup ? 1 : 0;
        
        let response = await common.fetchApi({
            opcode : 'CONFIG_CLOUD_BACKUP',
            data : {backup}
        })
        let {errcode} = response;
        if(errcode == 0){
            this.setState({
                backupSuccess : true,
                backupCloud : false,
                backupSuccessTip : '备份成功',
            })
            return;
        }else{
            this.setState({
                backupFail : true,
                backupCloud : false,
                backupFailTip : '备份失败！请重试~',
            })
        } 
    }

    //从本地恢复
    postRecoverLocal = (info) => {
        if(info.file.status === 'uploading') {
            
        }
        if(info.file.status === 'done'){
            if(info.file.response.data[0].errcode == 0){
                this.setState({
                    backupSuccess : true,
                    backupSuccessTip : '恢复成功'
                })
            }else{
                this.setState({
                    backupFail : true,
                    backupFailTip : '恢复失败'
                })
            }
        }
        if(info.file.status === 'error'){
            Modal.error({title : '上传失败'})
        }
    }

    //从云恢复
    postRecoverCloud = async () => {
        let param = {
            id : this.state.radioChoose
        }

        let response = await common.fetchApi({
            opcode : 'CONFIG_CLOUD_RESTORE',
            data : param
        })

        let {errcode} = response;
        if(errcode == 0){
            this.setState({
                backupSuccess : true,
                backupSuccessTip : '恢复成功',
                recoverCloud : false
            })
            return;
        }else{
            this.setState({
                backupFail : true,
                backupFailTip : '恢复失败！请重试~',
                recoverCloud : false
            })
        }
    }

    render(){
        const {backupSuccessTip, baseBackup, authBackup, backupCloud, radioChoose, backupFail, backupSuccess, backupFailTip, recoverCloud, cloudList, options} = this.state;

        const recoverList = cloudList.map(item => {
            return (
                <li key={item.id} className="recover-li">
                    <Radio value={item.id}></Radio><p className="recover-filename">{item.filename}</p>
                    <p className="recover-time">{item.upload_time}</p>
                </li>
            )
        });

        return (
            <div className="backup-restore">
                <Form>
                    <section>
                        <PanelHeader title="备份" checkable={false} onChange={(value) => this.onChange('channelType', value)} />
                        <ul className='backup-list'>
                            <li><Checkbox checked={baseBackup} onChange={this.checkBasebackup}>管理密码、Wi-Fi配置、上网配置、局域网配置、带宽设置、优先设备、黑名单</Checkbox></li>
                            <li><Checkbox checked={authBackup} onChange={this.checkAuthbackup}>认证配置（微信认证、短信认证）</Checkbox></li>
                        </ul>
                        <div className='func-btn'>
                            <Button onClick={this.postBackupLocal}>备份到本地</Button>
                            <Button onClick={this.cloudBackup}>备份到云</Button>
                        </div>
                    </section>
                    <section className='restore'>
                        <PanelHeader title="恢复" checkable={false} onChange={(value) => this.onChange('channelType', value)} />
                        <div className='restore-func'>
                            <Upload onChange={this.postRecoverLocal} name='file' data={{ opcode: '0x2018' }} multiple={false} action={__BASEAPI__}>
                                <Button>从本地恢复</Button>
                            </Upload>
                            <Button className='cloud-restore' onClick={this.cloudRecover}>从云恢复</Button>
                        </div>
                    </section>
                </Form>
                <Modal title='备份到云' visible={backupCloud} centered={true} width={360} closable={false} cancelText='取消' okText='开始备份' onCancel={this.handleCancle} onOk={this.postBackupCloud}>
                    <div className="backup-modal">
                        <div className="backup-filename">文件名</div>
                        <div>
                            <FormItem type="small" style={{ width: 320 }}>
                                <Input type="text" onChange={value => this.onChange(value, 'filename')} placeholder="请输入文件名" />
                            </FormItem>
                        </div>
                        <div className="backup-latest">
                            <div>最新的备份：</div>
                            {
                                cloudList.length === 0 ? <div className="backup-not">您还未进行过备份~</div> : <Latestbackup cloudList={cloudList[0].filename} time={cloudList[0].upload_time} />
                            }
                        </div>
                    </div>
                </Modal>
                <Modal closable={false} visible={backupFail} centered={true} footer={null} width={560}>
                    <div className="backup-icon">
                        <CustomIcon color="#FF5500" type="hint" size={64} />
                        <div className="backup-result">{backupFailTip}</div>
                    </div>
                    <div className="backup-btm">
                        <Button className="backup-btn" type="primary" onClick={this.backupFailCancle}>确定</Button>
                    </div>
                </Modal>
                <Modal closable={false} visible={backupSuccess} centered={true} footer={null} width={560}>
                    <div className="backup-icon">
                        <CustomIcon color="#87D068" type="succeed" size={64} />
                        <div className="backup-result">{backupSuccessTip}</div>
                    </div>
                    <section className="backup-btm">
                        <Button className="backup-btn" type="primary" onClick={this.backupSuccessCancle}>确定</Button>
                    </section>
                </Modal>
                <Modal title='从云选择备份文件' visible={recoverCloud} width={360} centered={true} closable={false} cancelText='取消' okText='开始恢复' onCancel={this.handleCancle} onOk={this.postRecoverCloud}>
                    <ul className="recover-ul">
                        <RadioGroup onChange={this.radioChange} value={radioChoose}>
                            {recoverList}
                        </RadioGroup>
                    </ul>
                </Modal>
            </div>
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