import React from 'react';
import { Button, Modal, Spin, Icon } from 'antd';
import CustomIcon from '~/components/Icon';

import './mesh.scss';

export default class Mesh extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        visible: false,
        disabled: true,
        btnStr: '已找到全部商米设备',
        state: 'running',  // running/done
        title: '',
        devices: [
            /*{ model: 'V2x PRO', mac: '00:11:22:33:44:55' },
            { model: 'T2x mini', mac: '00:11:22:33:44:56' },
            { model: 'V1xs', mac: '00:11:22:33:44:58' },
            { model: 'V2x PRO', mac: '00:11:22:33:44:00' },
            { model: 'T2x mini', mac: '00:11:22:33:44:99' },
            { model: 'V1xs', mac: '00:11:22:33:44:53' },
            { model: 'V2x PRO', mac: '00:11:22:33:44:45' },
            { model: 'T2x mini', mac: '00:11:22:33:44:22' },
            { model: 'V1xs', mac: '00:11:22:33:44:76' },*/
        ],
    }

    refreshMeshInfo = async (duration) => {
        let i = 0,
            interval = 5000,
            count = Math.ceil(duration * 1000 / interval);
        this.timer = setInterval(() => {
            if (i++ > count) {
                clearInterval(this.timer);
                let num = this.state.devices.length;
                this.setState({
                    title: '搜寻设备',
                    disabled: false,
                    btnStr: (num > 0) ? '已找到全部商米设备' : '我知道了',
                    state: 'done',
                });
                return;
            }

            let status = common.fetchWithCode('SUNMIMESH_INFO_GET', { method: 'POST' });
            status.then((resp) => {
                let { errcode, data, message } = resp;
                if (errcode == 0) {
                    let { devices } = data[0].sunmimesh;
                    let num = devices.length;
                    let title = (num > 0) ? `搜寻到附近 ${num} 台商米设备` : '正在搜寻商米设备...';
                    this.setState({
                        devices: devices.map(item => Object.assign({}, item)),
                        title: title,
                    });
                } else {
                    clearInterval(this.timer);
                    Modal.error({ title: '获取商米设备列表指令异常', message });
                }
            })
        }, interval);
    }

    startSunmiMesh = () => {
        this.setState({
            visible: true,
            disabled: true,
            state: 'running',
            //title: '正在搜寻商米设备...',
            title: `搜寻到附近<span>2</span>台商米设备`,
            devices: [],
        });

        let start = common.fetchWithCode('SUNMIMESH_START',{ method: 'POST'});

        start.then((resp) => this.refreshMeshInfo(resp.data[0].sunmimesh.duration));
    }

    stopSunmiMesh = () => {
        this.setState({
            visible: false,
        })

        // stop sunmi mesh
        clearInterval(this.timer);
        common.fetchWithCode('SUNMIMESH_STOP', { method: 'POST' });
    }

    render() {
        const { visible, state, title, disabled, btnStr, devices }  = this.state;
        const num = devices.length;
        const icon = <Icon type="loading" style={{ fontSize: 20, color: '#FB8632' }} spin />;
        let Title = [
            'running' === state && <Spin className='spin' indicator={icon} />,
            <span dangerouslySetInnerHTML={{ __html: title }} className='title' />
        ];

        const iconMap = {   // TODO
            v2pro: 'v2pro', m2: 'm2', v1s: 'v1s', l2: 'l2', v1: 'v1', m1: 'm1', p1: 'p1', s2: 's2',
            t2: 't2', t2lite: 't2lite', t2mini: 't2mini', t1: 't1', d2: 'd2', d1s: 'd1s', d1: 'd1',
        };

        const meshList = devices.map(item => {
            let icon = iconMap[item.model.replace(/ /g, '').toLowerCase()] || 'bootdevice'; //TODO
            return (
                <li key={item.mac} className='mesh-device'>
                    <div><CustomIcon color="#333C4F" type={icon} size={34} /></div>
                    <p>SUNMI {item.model}</p>
                </li>
            );
        });

        return (
        <Modal className='sunmi-mesh-modal' title={Title} maskClosable={false} width={560} visible={visible}
            onCancel={this.stopSunmiMesh}
            footer={<Button type="primary" disabled={disabled} onClick={this.stopSunmiMesh}>{btnStr}</Button>}>
            {'running' === state &&
            <ul className='mesh-list'>{meshList}</ul>
            }
            {'done' === state && num > 0 &&
            <div>
                <div className='status-icon'><CustomIcon color="#87D068" type="succeed" size={64} /></div>
                <h4>搜寻到<span>{num}</span>台附近的新商米设备，已自动为其连上专属网络</h4>
            </div>
            }
            {'done' === state && num == 0 &&
            <div>
                <div className='status-icon'><CustomIcon color="#FF5500" type="defeated" size={64} /></div>
                <h4>没有搜寻到新商米设备</h4>
            </div>
            }
        </Modal>
        );
    }
}
