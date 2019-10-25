import React from 'react';
import { Button, Modal, Spin, Icon, Checkbox, message } from 'antd';
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
        // showBtn: false,
        // btnStr: '',
        state: 'running',  // running/done
        title: '',
        devices: [
            // { model: 'v2pro', mac: '00:11:22:33:44:55', checked: 1 },
            // { model: 'T2 mini', mac: '00:11:22:33:44:56', checked: 0 },
            // { model: 'V1s', mac: '00:11:22:33:44:58', checked: 1 },
            // { model: 'V2 PRO', mac: '00:11:22:33:44:00', checked: 0 },
            // { model: 'T2 mini', mac: '00:11:22:33:44:99', checked: 1 },
            // { model: 'v1s', mac: '00:11:22:33:44:53', checked: 0 },
            // { model: 'V2 PRO', mac: '00:11:22:33:44:45', checked: 1},
            // { model: 'T2 mini', mac: '00:11:22:33:44:22', checked: 0 },
            // { model: 'd1s', mac: '00:11:22:33:44:76', checked: 1 },
        ],
    }

    refreshMeshInfo = async (duration) => {
        this.timer = setInterval(() => {
            let currentTime = new Date().getTime();
            if ((currentTime - this.startTime) > duration * 1000){
                clearInterval(this.timer);
                this.setState({
                    // showBtn: true,
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
                    let title = (num > 0) ? intl.get(MODULE, 2, {num})/*_i18n:搜寻到附近<span>{num}</span>台商米设备*/  : intl.get(MODULE, 4)/*_i18n:正在搜寻商米设备...*/;
                    this.setState({
                        devices: devices.map(item => {
                            const result = this.state.devices.find(items => items.mac === item.mac);
                            return Object.assign({}, item, {checked: 1}, result || {});
                        }),
                        title: title,
                        // showBtn: (num > 0),
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
            // showBtn: false,
            state: 'running',
            title: intl.get(MODULE, 6)/*_i18n:正在搜寻商米设备...*/,
            // btnStr: intl.get(MODULE, 7)/*_i18n:已找到全部商米设备*/,
            devices: [],     
        });

        let start = common.fetchApi({ opcode: 'SUNMIMESH_START' });

        start.then((resp) => this.refreshMeshInfo(resp.data[0].result.sunmimesh.duration));
    }

    stopSunmiMesh = async () => {
        const {devices} = this.state;
        this.setState({
            visible: false,
        })

        // stop sunmi mesh
        clearInterval(this.timer);
        const blockList = [];
        devices.map(item => {
            blockList.push({
                mac: item.mac
            })
        });
        await common.fetchApi({ 
            opcode: 'SUNMIMESH_BLOCK', 
            data: {
                sunmimesh: {
                    devices: blockList
                }
            } 
        }).then(response => {
            let { errcode } = response;
            if (errcode === 0) {
                // message.success(`${devices.length - blockList.length}台商米设备添加成功`);
            } else {
                message.error(intl.get(MODULE, 10)/*_i18n:商米设备添加失败*/);
            }
        });
        await common.fetchApi({ opcode: 'SUNMIMESH_STOP' });        
    }

    addSunmiMesh = async () => {
        const {devices} = this.state;
        this.setState({
            visible: false,
        })
        clearInterval(this.timer);
        const blockList = [];
        devices.map(item => {
            if (item.checked == 0) {
                blockList.push({
                    mac: item.mac
                })
            }
        });
        await common.fetchApi({ 
            opcode: 'SUNMIMESH_BLOCK', 
            data: {
                sunmimesh: {
                    devices: blockList
                }
            } 
        }).then(response => {
            let { errcode } = response;
            if (errcode === 0) {
                message.success(`${devices.length - blockList.length}${intl.get(MODULE, 11)/*_i18n:台*/}${intl.get(MODULE, 12)/*_i18n:商米设备添加成功*/}`);
            } else {
                message.error(intl.get(MODULE, 10)/*_i18n:商米设备添加失败*/);
            }
        });
        await common.fetchApi({ opcode: 'SUNMIMESH_STOP' });
    }

    changeCheck = (e, mac) => {
        this.setState({
            devices: this.state.devices.map(item => {
                if (item.mac === mac) {
                    item.checked = e.target.checked
                }
                return item;
            })
        })
    }

    render() {
        const { visible, state, title, devices }  = this.state;
        const num = devices.length;
        const icon = <CustomIcon className='spin-icon-loading' type="loading" size={20} spin/>
        let Title = [
            'running' === state && <Spin className='spin' indicator={icon} />,
            <span dangerouslySetInnerHTML={{ __html: title }} className='title' />
        ];

        const meshList = devices.map(item => {
            return (
                <li key={item.mac} className='mesh-device'>
                    <div><Logo model={item.model} size={36} /></div>
                    <p>{item.model}</p>
                    <Checkbox checked={item.checked} onChange={(e) => this.changeCheck(e, item.mac)}></Checkbox>
                </li>
            );
        });

        const selectLength = devices.filter(item => item.checked == 1).length;

        return (
        <Modal className='sunmi-mesh-modal' title={Title} maskClosable={false} width={560} visible={visible}
            onCancel={this.stopSunmiMesh} centered={true}
            footer={<Button type="primary" disabled={selectLength === 0} onClick={this.addSunmiMesh}>{intl.get(MODULE, 13)/*_i18n:添加商米设备*/}</Button>}>
            {'running' === state &&
            <ul className={meshList.length > 5 ? 'mesh-list-left' : 'mesh-list-center'}>{meshList}</ul>
            }
            {'done' === state && num > 0 &&
                <ul className={meshList.length > 5 ? 'mesh-list-left' : 'mesh-list-center'}>{meshList}</ul>
            }
            {'done' === state && num == 0 &&
            <div>
                <div className='status-icon'><CustomIcon className='status-icon-hint' type="hint" size={64} /></div>
                <h4>{intl.get(MODULE, 8)/*_i18n:没有搜寻到新商米设备*/}</h4>
            </div>
            }
        </Modal>
        );
    }
}
