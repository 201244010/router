
import React from 'react';
import {Button,Icon} from 'antd';
import CustomModal from '~/components/Modal';
import CustomIcon from '~/components/Icon';

export default class Recovery extends React.Component{
    state = {
        visible: false,
        loadingActive:false,
        succeedActive:false,
    }
    
    reboot = async() =>{
        common.fetchApi(
            [{
                opcode: 'SYSTEMTOOLS_RESET'
            }]
        ).then((resp) =>{
            this.setState({visible : false},()=>{this.setState({loadingActive :true},()=>{setTimeout(()=>{this.setState({loadingActive:false,succeedActive:true})},90000)})});
        });
    }

    showModal = () => {
        this.setState({visible: true,});
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    guide = () =>{
        this.props.history.push('/welcome');
        this.setState({succeedActive:false})
    }

    render(){
        const {visible,loadingActive,succeedActive} = this.state;
        return (
            <div>
                <div>
                    <span style={{marginLeft:65}}>说明：恢复出厂设置后，需重新设置后才能正常上网，请注意备份配置信息</span>
                    <section style={{borderTop:0,marginTop:20}} className="weixin-auth-save">
                        <Button style={{width:130}} className="weixin-auth-button" type="primary" onClick={this.showModal}>立即恢复</Button>
                    </section>
                    <CustomModal style={{padding : 0}} active={visible}>
                        <div className='div-header'>
                            <CustomIcon key="progress-icon2" type="hint" size={14} color='#FF5500'/>
                            <span style={{marginLeft:8,color:'#FF5500'}}>警告</span>
                        </div>
                        <div className='div-body'>
                            <p>确定要立即恢复出厂设置？</p>
                        </div>
                        <div className='div-footer'>
                            <Button key="back" style={{fontSize:12,marginRight:16}} onClick={this.handleCancel}>取消</Button>
                            <Button key="submit" style={{fontSize:12,backgroundColor:'#FF5500'}} type="primary" onClick={this.reboot}>立即恢复
                            </Button>
                            </div>  
                    </CustomModal>
                </div>
                <CustomModal active={loadingActive}>
                    <Icon key="progress-icon1" type="loading" style={{ fontSize: 80, marginBottom : 30, color : "#FB8632" }}  spin />
                    <h3 key="active-h3">正在恢复出厂设置，请稍候...</h3>
                    <span style={{color:'#D33419'}}>恢复出厂过程中请勿断电！！！</span>
                </CustomModal>
                <CustomModal style={{paddingLeft:0,paddingRight:0}} active={succeedActive}>
                    <CustomIcon key="progress-icon2" type="succeed" size="large" color='#87D068'/>
                    <h3 style={{marginTop:10}} key="active-h3">恢复出厂完成，请重新登录管理界面</h3>
                    <div style={{borderTop:'1px solid #d8d8d8',marginTop:25}}>
                        <Button style={{width:160,bottom:-20}} className="weixin-auth-button" type="primary" onClick={this.guide}>确定</Button>
                    </div>
                </CustomModal>
        </div>
        );
    }
}