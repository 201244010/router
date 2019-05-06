import React from 'react';
import { Button, Modal, Spin, Icon } from 'antd';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';

import './mesh.scss';

const MODULE = 'mesh';
export default class Mesh extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
        showBtn: false,
        btnStr: '',
        state: 'running',  // running/done
        title: '',
        devices: [
            /*{ model: 'v2pro', mac: '00:11:22:33:44:55' },
            { model: 'T2 mini', mac: '00:11:22:33:44:56' },
            { model: 'V1s', mac: '00:11:22:33:44:58' },
            { model: 'V2 PRO', mac: '00:11:22:33:44:00' },
            { model: 'T2 mini', mac: '00:11:22:33:44:99' },
            { model: 'v1s', mac: '00:11:22:33:44:53' },
            { model: 'V2 PRO', mac: '00:11:22:33:44:45' },
            { model: 'T2 mini', mac: '00:11:22:33:44:22' },
            { model: 'd1s', mac: '00:11:22:33:44:76' },*/
        ],
    }

    refreshMeshInfo = async (duration) => {
        this.timer = setInterval(() => {
            let currentTime = new Date().getTime();
            if ((currentTime - this.startTime) > duration * 1000){
                clearInterval(this.timer);
                this.setState({
                    title: intl.get(MODULE, 0)/*_i18n:搜寻设备*/,
                    showBtn: true,
                    btnStr: intl.get(MODULE, 1)/*_i18n:我知道了*/,
                    state: 'done',
                });
                return;
            }

            let status = common.fetchApi({ opcode: 'SUNMIMESH_INFO_GET' });
            status.then((resp) => {
                let { errcode, data, message } = resp;
                if (errcode == 0) {
                    let { devices } = data[0].result.sunmimesh;
                    let num = devices.length;
                    let title = (num > 0) ? intl.get(MODULE, 2, {num})/*_i18n:搜寻到{num}台商米设备，已自动接入商米网络*/ : intl.get(MODULE, 4)/*_i18n:正在搜寻商米设备...*/;
                    this.setState({
                        devices: devices.map(item => Object.assign({}, item)),
                        title: title,
                        showBtn: (num > 0),
                    });
                } else {
                    clearInterval(this.timer);
                    Modal.error({ title: intl.get(MODULE, 5)/*_i18n:获取商米设备列表指令异常*/, content: message, centered: true });
                }
            })
        }, 5000);
    }

    startSunmiMesh = () => {
        this.startTime = new Date().getTime();
        this.setState({
            visible: true,
            showBtn: false,
            state: 'running',
            title: intl.get(MODULE, 6)/*_i18n:正在搜寻商米设备...*/,
            btnStr: intl.get(MODULE, 7)/*_i18n:已找到全部商米设备*/,
            devices: [],
        });

        let start = common.fetchApi({ opcode: 'SUNMIMESH_START' });

        start.then((resp) => this.refreshMeshInfo(resp.data[0].result.sunmimesh.duration));
    }

    stopSunmiMesh = () => {
        this.setState({
            visible: false,
        })

        // stop sunmi mesh
        clearInterval(this.timer);
        common.fetchApi({ opcode: 'SUNMIMESH_STOP' });
    }

    render() {
        const { visible, state, title, showBtn, btnStr, devices }  = this.state;
        const num = devices.length;
        const icon = <CustomIcon color="#6174F1" type="loading" size={20} spin/>
        let Title = [
            'running' === state && <Spin className='spin' indicator={icon} />,
            <span dangerouslySetInnerHTML={{ __html: title }} className='title' />
        ];

        const meshList = devices.map(item => {
            return (
                <li key={item.mac} className='mesh-device'>
                    <div><Logo model={item.model} size={34} /></div>
                    <p>{item.model}</p>
                </li>
            );
        });

        return (
        <Modal className='sunmi-mesh-modal' title={Title} maskClosable={false} width={560} visible={visible}
            onCancel={this.stopSunmiMesh} centered={true}
            footer={showBtn && <Button type="primary" onClick={this.stopSunmiMesh}>{btnStr}</Button>}>
            {'running' === state &&
            <ul className='mesh-list'>{meshList}</ul>
            }
            {'done' === state && num > 0 &&
            <div>
                <div className='status-icon'><CustomIcon color="#87D068" type="succeed" size={64} /></div>
                <h4 dangerouslySetInnerHTML={{ __html: intl.getHTML(MODULE, 9, {num})}} />
            </div>
            }
            {'done' === state && num == 0 &&
            <div>
                <div className='status-icon'><CustomIcon color="#FF5500" type="hint" size={64} /></div>
                <h4>{intl.get(MODULE, 8)/*_i18n:没有搜寻到新商米设备*/}</h4>
            </div>
            }
        </Modal>
        );
    }
}
