import React from 'react';
import { Checkbox, Modal, Button } from 'antd';
import CustomModal from 'h5/components/Modal';

import './subrouter.scss';

const MODULE = 'h5subrouter';

export default class SubRouter extends React.Component {
    constructor (props) {
        super (props);
    }

    state = {
        visible: false,
        locationInput: '',
    }

    onChange = (e) => {
        this.props.onChange(e.target.checked);
    }

    inputOnChange = (e) => {
        this.setState({locationInput: e.target.value});
    }

    addLocation = () => {
        let  {location} = this.props;
        this.setState({
            locationInput: location,
            visible: true,
        });
    }

    cancel = () => {
        this.setState({
            visible: false,
        });
    }

    sure = async() => {
        const  { mac, deviceId } = this.props;
        let {locationInput} = this.state;

        if ('' === locationInput) {
            locationInput = deviceId;
        }

        let data = {sonconnect:[]};
        data.sonconnect.push({devid: deviceId, mac: mac, location: locationInput});

        let response = await common.fetchApi(
            {
                opcode: 'ROUTENAME_SET',
                data: data
            }
        );

        let {errcode} = response;
        if (0 === errcode) {
            this.props.changeLocation(mac, locationInput);
            this.setState({
                visible: false,
            });
        }
    }

    render () {
        let { state='success', checked=true, status='1', location } = this.props;
        const { visible, locationInput } = this.state;
        if ('1' !== status) {
            state = 'unusual';
        }
        let router = '';

        switch(state) {
            case 'checkbox':
                router = <div className='router-outline'>
                            <div className='left'>
                                <div className='routerImg'></div>
                                <div className='deviceId'>{location}</div>
                            </div>
                            <Checkbox onChange={this.onChange} checked={checked}></Checkbox>
                        </div>;
                break;
            case 'success':
                router = <div className='router-outline not-checkbox'>
                            <div className='left'>
                                <div className='routerImg'><div className='successImg'></div></div>
                                <div className='deviceId'>
                                    {location}
                                    <p className='description'>{intl.get(MODULE, 0)/*_i18n:设置同步成功*/}</p>
                                </div>
                            </div>
                            <div className='addLocation'>{intl.get(MODULE, 1)/*_i18n:备注*/}<div className='addLocationImg' onClick={this.addLocation}></div></div>
                        </div>;
                break;
            case 'failed':
                router = <div className='router-outline not-checkbox'>
                            <div className='left'>
                                <div className='routerImg'><div className='failedImg'></div></div>
                                <div className='deviceId'>
                                    {location}
                                    <p className='description'>{intl.get(MODULE, 2)/*_i18n:状态异常，请检查*/}</p>
                                </div>
                            </div>
                        </div>;
                break;
            case 'loading':
                router = <div className='router-outline not-checkbox'>
                            <div className='left'>
                                <div className='routerImg'><div className='loadingImg'></div></div>
                                <div className='deviceId'>
                                    {location}
                                    <p className='description'>{intl.get(MODULE, 3)/*_i18n:正在同步路由器设置*/}</p>
                                </div>
                            </div>
                        </div>;
                break;
            case 'unusual':
                router = <div className='router-outline'>
                            <div className='left'>
                                <div className='routerImg'></div>
                                <div className='deviceId'>
                                    {location}
                                    <p className='unusual'>{intl.get(MODULE, 4)/*_i18n:已被其他商米账号绑定，请解绑后组网*/}</p>
                                </div>
                            </div>
                            <Checkbox onChange={this.onChange} checked={false} disabled></Checkbox>
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
                        <div className='Title'>{intl.get(MODULE, 5)/*_i18n:备注*/}</div>
                        <input placeholder={intl.get(MODULE, 6)/*_i18n:请输入备注信息*/} className='input' onChange={this.inputOnChange} value={locationInput} />
                    </div>
                    <div className='Footer'>
                        <div className='footerButton cancel' onClick={this.cancel}>{intl.get(MODULE, 7)/*_i18n:取消*/}</div>
                        <div className='footerButton sure' onClick={this.sure}>{intl.get(MODULE, 8)/*_i18n:确定*/}</div>
                    </div>
                </CustomModal>
            </React.Fragment>   
        );
    }
}