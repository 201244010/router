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
        const path = location.pathname;
        const guide = ['/welcome', '/guide'].some(url => {
            return path.indexOf(url) > -1;
        });

        return { guide };
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
        if (!this.state.guide){
            this.getInfo();
        }
    }

    getInfo = async () => {
        let response = await common.fetchApi({
            opcode : 'FIRMWARE_GET'
        });

        // 防止 Default组件重定向到 guide 显示升级弹窗提示
        if (this.state.guide) {
            return;
        }

        let {data, errcode} = response;
        if (0 === errcode) {
            let { newest_version, release_log } = data[0].result.upgrade;
            this.setState({
                update : newest_version !== '',
                releaseLog : release_log,
            });
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