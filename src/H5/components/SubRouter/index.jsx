import React from 'react';
import { Checkbox, Modal, Button } from 'antd';
import CustomModal from 'h5/components/Modal';

import './subrouter.scss';

export default class SubRouter extends React.Component {
    constructor (props) {
        super (props);
    }

    state = {
        visible: false,
        location: '',
    }

    onChange = (e) => {
        this.props.onChange(e.target.checked);
    }

    inputOnChange = (e) => {
        this.setState({location: e.target.value});
    }

    addLocation = () => {
        this.setState({
            visible: true,
        });
    }

    cancel = () => {
        this.setState({
            visible: false,
        });
    }

    sure = async() => {
        const { mac, deviceId } = this.props;
        let  { location } = this.state;

        if ('' === location) {
            location = deviceId;
        }

        let data = {sonconnect:[]};
        data.sonconnect.push({devid: deviceId, mac: mac, location: location});

        let response = await common.fetchApi(
            {
                opcode: 'ROUTENAME_SET',
                data: data
            }
        );

        let {errcode} = response;
        if (0 === errcode) {
            this.setState({
                visible: false,
            });
        }
    }

    render () {
        const { state='success', deviceId='W1000000000', checked=true } = this.props;
        const {visible, location} = this.state;
        let router = '';

        switch(state) {
            case 'checkbox':
                router = <div className='router-outline'>
                            <div className='left'>
                                <div className='routerImg'></div>
                                <div className='deviceId'>{deviceId}</div>
                            </div>
                            <Checkbox onChange={this.onChange} checked={checked}></Checkbox>
                        </div>;
                break;
            case 'success':
                router = <div className='router-outline not-checkbox'>
                            <div className='left'>
                                <div className='routerImg'><div className='successImg'></div></div>
                                <div className='deviceId'>
                                    {deviceId}
                                    <p className='description'>设置同步成功</p>
                                </div>
                            </div>
                            <div className='addLocation'>备注<div className='addLocationImg' onClick={this.addLocation}></div></div>
                        </div>;
                break;
            case 'failed':
                router = <div className='router-outline not-checkbox'>
                            <div className='left'>
                                <div className='routerImg'><div className='failedImg'></div></div>
                                <div className='deviceId'>
                                    {deviceId}
                                    <p className='description'>状态异常，请检查</p>
                                </div>
                            </div>
                        </div>;
                break;
            case 'loading':
                router = <div className='router-outline not-checkbox'>
                            <div className='left'>
                                <div className='routerImg'><div className='loadingImg'></div></div>
                                <div className='deviceId'>
                                    {deviceId}
                                    <p className='description'>正在同步路由器设置...</p>
                                </div>
                            </div>
                        </div>;
                break;
        }
        return (
            <React.Fragment>
                {router}
                <CustomModal
                    className='locationModal'
                    visible={visible}
                    footer={null}
                    >
                    <div className='Content'>
                        <div className='Title'>备注</div>
                        <input placeholder='请输入备注信息' className='input' onChange={this.inputOnChange} value={location} />
                    </div>
                    <div className='Footer'>
                        <div className='footerButton cancel' onClick={this.cancel}>取消</div>
                        <div className='footerButton sure' onClick={this.sure}>确定</div>
                    </div>
                </CustomModal>
            </React.Fragment>   
        );
    }
}