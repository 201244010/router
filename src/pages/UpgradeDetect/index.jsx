import {Modal} from 'antd';
import CustomIcon from '~/components/Icon';
import React from "react";
import Upgrade from './Upgrade';

export default class UpdateDetect extends React.Component{
    constructor(props){
        super(props)
    }

    state = {
        update : false,
        releaseLog : '',
    }

    static getDerivedStateFromProps(){
        const pathname = location.pathname;
        const guide = ['/welcome', 'guide'].some(url => {
            return pathname.indexOf(url) > -1;
        });

        return {guide};
    }

    cancle = () => {
        this.setState({
            update : false
        })
    }

    post = () => {
        this.setState({
            update : false
        });
        this.refs.Upgrade.startUpgrade();
    }

    componentDidMount(){
        let {guide} = this.state;
        if(!guide){
            this.getInfo();
        }
    }

    getInfo = async () => {
        let response = await common.fetchApi({
            opcode : 'FIRMWARE_GET'
        })
        let {data,errcode} =response;
        let result = data[0].result.upgrade;
        if(errcode === 0){
            this.setState({
                update : result.newest_version === '' ? false : true,
                releaseLog : result.release_log,
            })
        }else{
            Modal.error({title : '获取路由器当前版本信息和最新版本信息失败'});
        }
    }

    render (){
        let {update, releaseLog} = this.state;
        let Title = [
            <span style={{fontSize : 14, color : '#333C4F'}}><CustomIcon style={{marginRight : 5}} color="#333C4F" type="hint"  size={14} />软件升级提醒</span>
        ];
        return (
            <div>
                <Modal visible={update} maskClosable={false} title={Title} centered={true} closable={false} okText='立即升级' cancelText='暂不升级' onCancel={this.cancle} onOk={this.post}>
                    <pre style={{color : '#333C4F'}}>{releaseLog}</pre>
                </Modal>
                <Upgrade ref='Upgrade'/>
            </div> 
        )
    }
}