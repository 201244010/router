import React from 'react';
import {Modal, Button, Icon, message } from 'antd';
import CustomIcon from '~/components/Icon';
import Progress from '~/components/Progress';
import { clear } from '~/assets/common/auth';
import { PAGE_STYLE_KEY } from '~/utils';

export default class Recovery extends React.Component{

    constructor(props){
        super(props);
    }

    state = {
        duration: 120,
        loadingActive: false,
        succeedActive: false,
    }

    reset = async () =>{
        let resp = await common.fetchApi({opcode: 'SYSTEMTOOLS_RESET'});
        const { errcode, data } = resp;
        const duration = parseInt(data[0].result.restart_duration);
        if (0 === errcode) {
            this.setState({
                loadingActive: true,
                duration: duration,
            });

            setTimeout(() => {
                this.setState({
                    loadingActive: false,
                    succeedActive: true,
                });
            }, duration * 1000);
        } else {
            message.error(`恢复出厂失败[${errcode}]`);
        }
    }

    showModal = () => {
        Modal.confirm({
            centered: true,
            title: '警告',
            content: '确定要立即恢复出厂设置？',
            okText: '立即恢复',
            cancelText: '取消',
            onOk: this.reset,
        });
    }

    guide = () => {
        try {   // Fix SIG-909
            web = window.sessionStorage.removeItem(PAGE_STYLE_KEY);
        } catch(e) {}

        clear();        // 删除认证信息
        location.href = '/';
    }

    render(){
        const { duration, loadingActive, succeedActive } = this.state;
        return (
            <div>
                <div style={{marginTop : 6}}>
                    <span style={{marginLeft:60}}>说明：恢复出厂设置后，需重新设置后才能正常上网，请注意备份配置信息</span>
                    <section style={{borderTop:0,marginTop:8}} className="system-save">
                        <Button style={{width:116}} className="system-button" type="primary" onClick={this.showModal}>立即恢复</Button>
                    </section>
                </div>
                {loadingActive &&
                    <Progress
                        duration={duration}
                        title='正在恢复出厂设置，请耐心等待...'
                        tips='恢复出厂过程中请勿断电！'
                    />
                }
                <Modal
                    visible={succeedActive}
                    className='modal-center'
                    closable={false}
                    centered={true}
                    footer={[<Button type="primary" onClick={this.guide}>确定</Button>]}
                >
                    <CustomIcon type="succeed" size={64} color='#87D068' style={{marginTop:20}} />
                    <h3 style={{ marginTop: 15 }}>恢复出厂设置完成，请重新连接无线网络</h3>
                </Modal>
        </div>
        );
    }
}