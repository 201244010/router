import React from 'react';
import { Button } from 'antd';
import Form from '~/components/Form';

import './location.scss';
const MODULE = 'location'
const { FormItem, ErrorTip, Input }  = Form;

export default class Location extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        routeList: [],
        disabled: false,
        loading: false,
    }

    onChange = (value, deviceId) => {
        const {routeList} = this.state;
        let index = 0;

        if ('' === value) {
            value = deviceId;
        }

        for (var i = 0; i < routeList.length; i++) {
            if (deviceId === routeList[i].deviceId) {
                routeList[i].location = value;
                index = i;
                break;
            }
        }

        routeList[index].tip = '';
        for (var i = 0; i < routeList.length; i++) {
            if (index !== i && routeList[index].location === routeList[i].location) {
                routeList[index].tip = intl.get(MODULE, 0);
            }
        }
        this.setState({routeList: routeList});
    }

    getRouterLocation = async() => {
        let response = await common.fetchApi({opcode: 'ROUTE_GET'});
        const {errcode, data} = response;
        if (0 === errcode) {
            let routes = data[0].result.sonconnect.devices || [];
            let routeList = [];
            routes.map(item => {
                routeList.push({deviceId: item.devid, location: item.location, role: item.role, mac: item.mac, tip: '' });
            });
            this.setState({routeList: routeList});
        }
    }

    setRouterLocation = async() => {
        const {routeList} = this.state;
        let data = {sonconnect:[]};
        routeList.map(item => {
            data.sonconnect.push({devid: item.deviceId, mac: item.mac, location: item.location});
        });

        this.setState({loading: true});
        let response = await common.fetchApi(
            {
                opcode: 'ROUTENAME_SET',
                data: data
            }
        );
        this.setState({loading: false});
        let {errcode} = response;
        if (0 === errcode) {
            this.props.history.push('/guide/addsubrouter/finish');
        }
    }

    componentDidMount() {
        this.getRouterLocation();
    }
    render() {
        let {routeList, disabled, loading} = this.state;
        let routeShow = [];
        let i = 1;
        routeList.map(item => {
            if ('' !== item.tip) {
                disabled = true;
            }
            let labelInfo = '';
            if('1' === item.role) {
                labelInfo = <label style={{marginBottom: 8,display: 'inline-block'}}><span style={{fontSize: 16,color: '#333C4F'}}>{intl.get(MODULE, 1)}</span><span style={{fontSize: 14,color: '#ADB1B9'}}>（SN:{item.deviceId}）</span></label>;
                
            } else {
                labelInfo = <label style={{marginBottom: 8,display: 'inline-block'}}><span style={{fontSize: 16,color: '#333C4F'}}>{intl.get(MODULE, 2)}{i}</span><span style={{fontSize: 14,color: '#ADB1B9'}}>（SN:{item.deviceId}）</span></label>;
                i++;
            }
            routeShow.push(
                labelInfo,
                <FormItem
                    label={intl.get(MODULE, 3)}
                    showErrorTip={item.tip}
                    labelStyle={{width: 'auto', verticalAlign: 'top'}}
                    inputStyle={{marginLeft: 12, width: 260}}
                    >
                    <Input
                        type="text"
                        placeholder={intl.get(MODULE, 4)}
                        value={item.location === item.deviceId? '':item.location}
                        onChange = {value => this.onChange(value, `${item.deviceId}`)}
                        maxLength={32}
                         />
                    <ErrorTip style={{width: 260}}>{item.tip}</ErrorTip>
                </FormItem>
            );
        });
        return (
            <div className="location">
                <h2>{intl.get(MODULE, 5)}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 6)}</p>
                <div className="content">
                <Form style={{margin : '24px auto',display: 'inline-block',textAlign: 'left'}}>
                    {routeShow}
                    <FormItem
                        label="#"
                        labelStyle={{width:0}}
                        >
                        <Button
                            disabled={disabled}
                            loading={loading}
                            style={{ width: 260,height: 42,float: 'right',marginTop:8}}
                            onClick={this.setRouterLocation}
                            size="large"
                            type="primary">{intl.get(MODULE, 7)}</Button>
                    </FormItem>
                </Form>
                </div>
            </div>
        );
    }
}