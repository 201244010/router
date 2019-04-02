import React from 'react';
import { Button } from 'antd';
import Form from '~/components/Form';

import './location.scss';

const { FormItem, ErrorTip, Input }  = Form;

export default class Location extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        routeList: [],
        disabled: false,
        loading: false,
        // mainRouteDeviceId: '',
        // mainRouteLocation: '',
        // mainRouteTip: '',
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

        for (var i = 0; i < routeList.length; i++) {
            if (routeList[index].location === routeList[i].location) {
                routeList[index].tip = '位置信息重复';
            } else {
                routeList[index].tip = '';
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
                labelInfo = <label>主路由（SN:{item.deviceId}）</label>;
                
            } else {
                labelInfo = <label>子路由{i}（SN:{item.deviceId}）</label>;
                i++;
            }
            routeShow.push(
                labelInfo,
                <FormItem
                    label="位置"
                    showErrorTip={item.tip}
                    labelStyle={{width: 'auto', verticalAlign: 'top'}}
                    inputStyle={{marginLeft: 12, width: 260}}
                    >
                    <Input
                        placeholder="如大堂、收银区等"
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
                <h2>设置位置</h2> 
                <p className="ui-tips guide-tip">位置将作为路由器的名称，有助于您今后识别和管理</p>
                <div className="content">
                <Form style={{margin : '24px auto'}}>
                    {routeShow}
                    <FormItem
                        label="#"
                        labelStyle={{width:0}}
                        >
                        <Button
                            disabled={disabled}
                            loading={loading}
                            style={{ width: 260,height: 42}}
                            onClick={this.setRouterLocation}
                            size="large"
                            type="primary">下一步</Button>
                    </FormItem>
                </Form>
                </div>
            </div>
        );
    }
}