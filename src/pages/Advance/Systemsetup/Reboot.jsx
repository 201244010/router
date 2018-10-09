
import React from 'react';
import {Button,Modal,Icon} from 'antd';
import CustomModal from '~/components/Modal';
import CustomIcon from '~/components/Icon';

export default class Reboot extends React.Component{

    state = {
        visible: false,
        loadingActive:false,
        succeedActive:false,

    }
    
    reboot = async() =>{
        common.fetchWithCode('SYSTEM_RESTART',{method : 'post',data:{}}).then((resp) =>{
            this.setState({visible : false},()=>{this.setState({loadingActive :true},()=>{setTimeout(()=>{this.setState({loadingActive:false,succeedActive:true})},90000)})});
        });
    }

    showModal = () => {
        this.setState({visible: true,});
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    login = () =>{
        location.href='/login';
        this.setState({succeedActive:false})
    }

    render(){
        const {visible,loadingActive,succeedActive} = this.state;
        return (
            <div>
                <div>
                    <span style={{marginLeft:65}}>说明：路由器系统将立即重新启动</span>
                    <section style={{borderTop:0,marginTop:20}} className="weixin-auth-save">
                        <Button style={{width:130}} className="weixin-auth-button" type="primary" onClick={this.showModal}>立即重启</Button>
                    </section>
                    <Modal title="提示" visible={visible} onOk={this.reboot} onCancel={this.handleCancel}  
                        footer={[
                            <Button key="back" style={{fontSize:12}} onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" style={{fontSize:12}} type="primary" onClick={this.reboot}>
                            立即重启
                            </Button>,
                        ]}>
                        <p>&nbsp;</p>
                        <p>确定要立即重启路由器？</p>
                        <p>&nbsp;</p>
                    </Modal>
                </div>
                <CustomModal active={loadingActive}>
                    <Icon key="progress-icon1" type="loading" style={{ fontSize: 80, marginBottom : 30, color : "#FB8632" }}  spin />
                    <h3 key="active-h3">正在重启路由器，请稍候...</h3>
                    <span style={{color:'#D33419'}}>重启过程中请勿断电！！！</span>
                </CustomModal>
                <CustomModal active={succeedActive}>
                    <CustomIcon key="progress-icon2" type="succeed" size="large" color='#87D068'/>
                    <h3 style={{marginTop:10}} key="active-h3">重启完成，请重新登录管理界面</h3>
                    <div style={{borderTop:'1px solid #d8d8d8',marginTop:25}}>
                        <Button style={{width:160,bottom:-20}} className="weixin-auth-button" type="primary" onClick={this.login}>确定</Button>
                    </div>
                </CustomModal>
        </div>
        );
    }
}