import React from 'react';
import { Button, Icon, Modal, message } from 'antd';
import CustomIcon from '~/components/Icon';
import { clearAll } from '~/assets/common/cookie';

export default class Reboot extends React.Component{
    constructor(props){
        super(props);
    }

    state = {
        loadingActive:false,
        succeedActive:false,

    }

    reboot = async() =>{
        let resp = await common.fetchApi({ opcode: 'SYSTEMTOOLS_RESTART' });
        const errcode = resp.errcode;
        if (0 === errcode) {
            clearAll();
            this.setState({
                loadingActive: true
            });

            setTimeout(() => {
                this.setState({
                    loadingActive: false,
                    succeedActive: true,
                });
            }, 90000);
        } else {
            message.error(`路由器重启失败[${errcode}]`);
        }
    }

    showModal = () => {
        Modal.confirm({
            centered: true,
            title: '提示',
            content: '确定要立即重启路由器？',
            okText: '立即重启',
            cancelText: '取消',
            onOk: this.reboot,
        });
    }

    login = () =>{
        location.href = '/login';
    }

    render(){
        const {loadingActive,succeedActive} = this.state;
        return (
            <div>
                <div style={{marginTop : 6}}>
                    <span style={{marginLeft:60}}>说明：路由器系统将立即重新启动</span>
                    <section style={{borderTop:0,marginTop:8}} className="weixin-auth-save">
                        <Button style={{width:116}} className="weixin-auth-button" type="primary" onClick={this.showModal}>立即重启</Button>
                    </section>
                </div>
                <Modal
                    visible={loadingActive}
                    className='modal-center'
                    closable={false}
                    centered={true}
                    style={{ textAlign: 'center' }}
                    footer={null}
                >
                    <Icon key="progress-icon1" type="loading" style={{ fontSize: 64, marginBottom: 10, color: "#FB8632" }} spin />
                    <h3>正在重启路由器，请稍候...</h3>
                    <span style={{ color: '#D33419' }}>重启过程中请勿断电！！！</span>
                </Modal>
                <Modal
                    visible={succeedActive}
                    className='modal-center'
                    closable={false}
                    centered={true}
                    style={{ textAlign: 'center' }}
                    footer={[<Button type="primary" onClick={this.login}>确定</Button>]}
                >
                    <CustomIcon key="progress-icon2" type="succeed" size={64} color='#87D068' style={{ marginTop: 20 }} />
                    <h3 style={{ marginTop: 15 }}>重启完成，请重新登录管理界面</h3>
                </Modal>
        </div>
        );
    }
}