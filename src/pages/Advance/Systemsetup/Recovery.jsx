import React from 'react';
import {Modal, Button, Icon} from 'antd';
import CustomIcon from '~/components/Icon';

export default class Recovery extends React.Component{

    constructor(props){
        super(props);
    }

    state = {
        loadingActive: false,
        succeedActive: false,
    }

    reboot = async () =>{
        await common.fetchApi({opcode: 'SYSTEMTOOLS_RESET'});

        this.setState({
            loadingActive: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    loadingActive: false,
                    succeedActive: true,
                });
            }, 90000);
        });
    }

    showModal = () => {
        Modal.confirm({
            centered: true,
            title: '警告',
            content: '确定要立即恢复出厂设置？',
            okText: '立即恢复',
            cancelText: '取消',
            onOk: this.reboot,
        });
    }

    guide = () =>{
        location.href = '/welcome';
    }

    render(){
        const {loadingActive,succeedActive} = this.state;
        return (
            <div>
                <div>
                    <span style={{marginLeft:60}}>说明：恢复出厂设置后，需重新设置后才能正常上网，请注意备份配置信息</span>
                    <section style={{borderTop:0,marginTop:20}} className="weixin-auth-save">
                        <Button style={{width:130}} className="weixin-auth-button" type="primary" onClick={this.showModal}>立即恢复</Button>
                    </section>
                </div>
                <Modal
                    visible={loadingActive}
                    className='recovery-modal'
                    closable={false}
                    centered={true}
                    style={{ textAlign: 'center' }}
                    footer={null}
                >
                    <Icon key="progress-icon1" type="loading" style={{ fontSize: 64, marginBottom: 10, color: "#FB8632" }} spin />
                    <h3>正在恢复出厂设置，请稍候...</h3>
                    <span style={{ color: '#D33419' }}>恢复出厂过程中请勿断电！！！</span>
                </Modal>
                <Modal
                    visible={succeedActive}
                    className='recovery-modal'
                    closable={false}
                    centered={true}
                    style={{textAlign:'center'}}
                    footer={[<Button type="primary" onClick={this.guide}>确定</Button>]}
                >
                    <CustomIcon key="progress-icon2" type="succeed" size={64} color='#87D068' style={{marginTop:20}} />
                    <h3 style={{ marginTop: 15 }}>恢复出厂完成，请重新登录管理界面</h3>
                </Modal>
        </div>
        );
    }
}