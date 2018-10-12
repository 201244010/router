import React from 'react';

import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import {Checkbox, Button, Modal, Radio} from 'antd';
import CustomIcon from '~/components/Icon';
const {FormItem, Input} = Form;
import UploadImage from '~/components/Upload';
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

        baseBackup : false,
        authBackup : false,

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

    cloudBackup = () => {
        this.setState({
            backupCloud : true
        })
    }

    cloudRecover = () => {
        this.setState({
            recoverCloud : true
        })
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
        let param = {};
        param['basebackup'] = this.state.baseBackup;
        param['authbackup'] = this.state.authBackup;

        let response = await common.fetchWithCode(
            'CONFIG_LOCAL_BACKUP',
            {method : 'POST', data : param}
        )

        let {errcode} = response;
        if(errcode == 0){
            return;
        }else{
            Modal.error({title : '备份到本地失败'});
        }
    }

    //备份到云
    postBackupCloud = async () => {
        let param = {};
        param['filename'] = this.state.filename;
        param['authbackup'] = this.state.authBackup;
        param['basebackup'] = this.state.baseBackup;
        
        let response = await common.fetchWithCode(
            'CONFIG_CLOUD_BACKUP',
            {method : 'POST', data : param}
        )
        let {errcode} = response;
        if(errcode == 0){
            this.setState({
                backupSuccess : true
            })
            return;
        }else{
            this.setState({
                backupFail : true
            })
        } 
    }

    //从本地恢复
    postRecoverLocal = async () => {
        
    }

    //从云恢复
    postRecoverCloud = async () => {
        let param = {
            id : this.state.radioChoose
        }

        let response = await common.fetchWithCode(
            'CONFIG_CLOUD_RESTORE',
            {method : 'POST', data : param}
        )

        let {errcode} = response;
        if(errcode == 0){
            this.setState({
                backupSuccess : true,
                backupSuccessTip : '恢复成功'
            })
            return;
        }else{
            this.setState({
                backupFail : true,
                backupFailTip : '恢复失败！请重试~'
            })
        }
    }

    //获取备份列表地、
    getListInfo = async () => {
        let response = await common.fetchWithCode(
            'CONFIG_CLOUD_CONFIGLIST',
            {method : 'POST'}
        )
        
        let {errcode, data} = response;
        if(errcode == 0){
            let result = data[0].result.configlist;
            this.setState({
                cloudList : result.map(item => {
                    return Object.assign({}, item)
                })
            });

            return;
        }else{
            Modal.error({title : '获取备份列表失败'});
        }
    }

    componentDidMount(){
        //this.getListInfo();
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
        })

        return (
            <div className="backup">
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0,paddingRight : 0}}>
                    <section className="backup-title">
                        <PanelHeader title="备份" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
                <div className="backup-base">
                    <Checkbox checked={baseBackup} onChange={this.checkBasebackup}><span className="backup-info">管理密码、Wi-Fi配置、上网配置、局域网配置、带宽设置、优先设备、黑名单</span></Checkbox>
                </div>
                <div className="backup-auth">
                    <Checkbox checked={authBackup} onChange={this.checkAuthbackup}><span className="backup-info">认证配置（微信认证、短信认证）</span></Checkbox>
                </div>
                <div className="backup-local">
                    <Button ghost={true} block onClick={this.postBackupLocal}><span className="backup-info">备份到本地</span></Button>
                </div>
                <div className="backup-cloud">
                    <Button ghost={true} block onClick={this.cloudBackup}><span className="backup-info">备份到云</span></Button>
                </div>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0,paddingRight : 0}}>
                    <section className="backup-title">
                        <PanelHeader title="恢复" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
                <div className="recover-local">
                        <UploadImage/>
                        <input class="button-name" type="button" value="从本地恢复"></input>
                </div>
                <div className="recover-cloud">
                    <Button ghost={true} block onClick={this.cloudRecover}><span className="backup-info">从云恢复</span></Button>
                </div>
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
                                cloudList.length === 0 ? <div className="backup-not">您还未进行过备份~</div> : <Latestbackup cloudList={cloudList[0].filename} time={cloudList[0].upload_time}/>
                            }
                        </div> 
                    </div>
                </Modal>   
                <Modal closable={false} visible={backupFail} centered={true} footer={null} width={560}>
                    <div className="backup-icon">
                        <CustomIcon color="#FF5500" type="hint" size={64}/>
                        <div className="backup-result">{backupFailTip}</div>
                    </div>
                    <div className="backup-btm">
                            <Button className="backup-btn" type="primary" onClick={this.backupFailCancle}>确定</Button>
                    </div>
                </Modal>
                <Modal closable={false} visible={backupSuccess} centered={true} footer={null} width={560}>
                    <div className="backup-icon">
                        <CustomIcon color="#87D068" type="succeed" size={64}/>
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