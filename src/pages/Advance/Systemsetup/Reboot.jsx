import React from 'react';
import { Button, Icon, Modal, message } from 'antd';
import CustomIcon from '~/components/Icon';
import Progress from '~/components/Progress';
import { clear } from '~/assets/common/auth';

const MODULE = 'reboot';

export default class Reboot extends React.Component{
    constructor(props){
        super(props);
    }

    state = {
        duration: 120,
        loadingActive: false,
        succeedActive: false,
    }

    reboot = async() =>{
        let resp = await common.fetchApi({ opcode: 'SYSTEMTOOLS_RESTART' });
        const { errcode, data } = resp;
        const duration = parseInt(data[0].result.restart_duration);
        if (0 === errcode) {
            clear();
            this.setState({
                loadingActive: true,
                duration: duration
            });

            setTimeout(() => {
                this.setState({
                    loadingActive: false,
                    succeedActive: true,
                });
            }, duration * 1000);
        } else {
            // message.error(`路由器重启失败[${errcode}]`);
            message.error(intl.get(MODULE, 0, {error: errcode})/*_i18n:路由器重启失败[{error}]*/);    
        }
    }

    showModal = () => {
        Modal.confirm({
            centered: true,
            // title: '提示',
            // content: '确定要立即重启路由器？',
            // okText: '立即重启',
            // cancelText: '取消',
            title: intl.get(MODULE, 1)/*_i18n:提示*/,
            content: intl.get(MODULE, 2)/*_i18n:确定要立即重启路由器？*/,
            okText: intl.get(MODULE, 3)/*_i18n:立即重启*/,
            cancelText: intl.get(MODULE, 4)/*_i18n:取消*/,
            onOk: this.reboot,
        });
    }

    login = () =>{
        location.href = '/login';
    }

    render(){
        const { duration, loadingActive, succeedActive } = this.state;
        return (
            <div>
                <div style={{marginTop : 8}}>
                    <span style={{marginLeft:60}}>{intl.get(MODULE, 5)/*_i18n:说明：路由器系统将立即重新启动*/}</span>
                    <section style={{borderTop:0,marginTop:8}} className="system-save">
                        <Button style={{width:116}} className="system-button" type="primary" onClick={this.showModal}>{intl.get(MODULE, 6)/*_i18n:立即重启*/}</Button>
                    </section>
                </div>
                {loadingActive &&
                    <Progress
                        duration={duration}
                        title={intl.get(MODULE, 7)/*_i18n:正在重启路由器，请耐心等待...*/}
                    />
                }
                <Modal
                    visible={succeedActive}
                    className='modal-center'
                    closable={false}
                    centered={true}
                    footer={[<Button type="primary" onClick={this.login}>{intl.get(MODULE, 8)/*_i18n:确定*/}</Button>]}
                >
                    <CustomIcon type="succeed" size={64} color='#87D068' style={{ marginTop: 20 }} />
                    <h3 style={{ marginTop: 15 }}>{intl.get(MODULE, 9)/*_i18n:重启成功，请重新连接无线网络*/}</h3>
                </Modal>
        </div>
        );
    }
}