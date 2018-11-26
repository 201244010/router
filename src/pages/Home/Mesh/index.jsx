import React from 'react';
import { Button, Modal, Spin, Icon } from 'antd';
import CustomIcon from '~/components/Icon';
import Logo from '~/components/Logo';

import './mesh.scss';

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
                    title: '搜寻设备',
                    showBtn: true,
                    btnStr: '我知道了',
                    state: 'done',
                });
                return;
            }

            let status = common.fetchApi({ opcode: 'SUNMIMESH_INFO_GET' });
            status.then((resp) => {
                let { errcode, data, message } = resp;
                if (errcode == 0) {
                    let { devices } = data[0].sunmimesh;
                    let num = devices.length;
                    let title = (num > 0) ? `搜寻到 ${num} 台商米设备，已自动接入商米网络` : '正在搜寻商米设备...';
                    this.setState({
                        devices: devices.map(item => Object.assign({}, item)),
                        title: title,
                        showBtn: (num > 0),
                    });
                } else {
                    clearInterval(this.timer);
                    Modal.error({ title: '获取商米设备列表指令异常', content: message, centered: true });
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
            title: '正在搜寻商米设备...',
            btnStr: '已找到全部商米设备',
            devices: [],
        });

        let start = common.fetchApi({ opcode: 'SUNMIMESH_START' });

        start.then((resp) => this.refreshMeshInfo(resp.data[0].sunmimesh.duration));
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
        const icon = <Icon type="loading" style={{ fontSize: 20, color: '#FB8632' }} spin />;
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
                <h4>搜寻到<span>{num}</span>台新商米设备，已自动接入商米网络</h4>
            </div>
            }
            {'done' === state && num == 0 &&
            <div>
                <div className='status-icon'><CustomIcon color="#FF5500" type="hint" size={64} /></div>
                <h4>没有搜寻到新商米设备</h4>
            </div>
            }
        </Modal>
        );
    }
}
