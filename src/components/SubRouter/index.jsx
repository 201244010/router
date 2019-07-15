import React from 'react';
import { Checkbox, Modal, Button } from 'antd';
import CustomIcon from '~/components/Icon';

import './subrouter.scss';
import intl from '../../i18n/intl';

const MODULE = 'subrouter';
export default class SubRouter extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        visible: false,
        loading: false
    }

    onChange = (e) =>{
        this.props.onChange(e.target.checked);
    }

    ignore = () => {
        this.setState({visible: true});
    }

    cancel = () => {
        this.setState({visible: false});
    }

    OK = async() => {
        this.setState({
            loading: true
        });
        const {deviceId, mac} = this.props;
        let response = await common.fetchApi(
            {
                opcode: 'ROUTE_RESET',
                data: { sonconnect: 
                    [{
                        devid: deviceId,
                        mac: mac
                    }]
                }
            }
        );
        let {errcode, data} = response;
        if (0 === errcode) {
            if (0 === data[0].errcode) {
                this.setState({
                    loading: false,
                    visible: false
                })
            }
        }
    }

    render() {
        let {deviceId='W1000000000', state='normal', checked=true, status='1'} = this.props;
        const {visible, loading} = this.state;
        if ('1' !== status) {
            state = 'unusual';
        }
        let footer = '';

        switch(state) {
            case 'normal': 
                footer = <div className='footer'></div>;
                break;
            case 'checkbox':
                footer = <div className='footer checkbox'><Checkbox onChange={this.onChange} checked={checked}></Checkbox></div>;
                break;
            case 'success':
                footer = <div className='footer final'><div><CustomIcon size={14} color='#4EC53F' type="succeed" style={{marginRight: 4}} />{intl.get(MODULE, 0)/*_i18n:设置成功*/}</div></div>;
                break;
            case 'failed':
                footer = <div className='footer final'><div><CustomIcon size={14} color='#FB8632' type="hint" style={{marginRight: 4}} />{intl.get(MODULE, 1)/*_i18n:设备异常，请检查*/}</div><p className='ignoreTip' onClick={this.ignore}>{intl.get(MODULE, 7)/*_i18n:忽略此设备*/}</p></div>;
                break;
            case 'unusual':
                footer = <div className='footer final'><div className='footer-unusual'>{intl.get(MODULE, 2)/*_i18n:已被其他商米账号绑定，请解绑后组网*/}</div></div>;
                break;
        }
        return (
            [<div className='subRouter'>
                <CustomIcon size={80} color='grey' type="router" />
                <p className='macInfo'>SN:{deviceId}</p>
                {footer}
            </div>,
            <Modal
                visible={visible}
                centered={true}
                closable={false}
                footer={null}
                className='subRouterModal'
                >
                <div className='modalTitle'>
                    <CustomIcon size={14} color='#333C4F' type="hint" style={{marginRight: 8}}/>{intl.get(MODULE, 3)/*_i18n:提示*/}
                </div>
                <div className='modalContent'>
					{intl.get(MODULE, 4)/*_i18n:您确定放弃添加子路由？*/}
                </div>
                <div className='modalFooter'>
                    <Button className="cancleButton" disabled={false} onClick={this.cancel}>{intl.get(MODULE, 5)/*_i18n:取消*/}</Button>
                    <Button type="primary" className="OKButton" disabled={false} onClick={this.OK} loading={loading}>{intl.get(MODULE, 6)/*_i18n:确定*/}</Button>
                </div>
            </Modal>]
        );
    }
}