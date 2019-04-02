import React from 'react';
import { Icon, Button } from 'antd';
import SubRouter from '~/components/SubRouter';
import CustomIcon from '~/components/Icon';

import './findrouter.scss';

export default class FindRouter extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        searchFinish: false,
        devicesShow: [],
        condition: 'selecting'  //'selecting'、'setting'、'settingResult',检测搜索、正在设置、设置完成
    }

    stop = () => {}

    onChange = (deviceId, checked) => {
        let devicesShow = this.state.devicesShow;
        for (var i = 0; i < devicesShow.length; i++) {
            if (deviceId === devicesShow[i].deviceId) {
                devicesShow[i].checked = checked;
                break;
            }
        }

        this.setState({
            devicesShow: devicesShow,
        });
    }

    reSearch = () => {
        this.setState({
            condition: 'selecting'
        });
        this.getSubRouters();
    }

    setSubRouter = async() => {
        const {devicesShow} = this.state;
        let sonconnect = {selected:[],blocked:[]};
        devicesShow.map(item => {
            if (item.checked) {
                sonconnect.selected.push(
                    {
                        mac: item.mac,
                        devid: item.deviceId,
                        location: item.deviceId
                    }
                );
            } else {
                sonconnect.blocked.push(
                    {
                        mac: item.mac,
                        devid: item.deviceId
                    }
                );
            }
        });
        let response = await common.fetchApi(
            [
                {opcode: 'SWITCH_STOP'},
                {opcode: 'ROUTE_SET', data: sonconnect}
            ]
        );
        let {errcode} = response;
        if (0 === errcode) {
            this.setState({
                condition: 'setting',
            });
        }
    }

    getSettingResult = async() => {
        let response = await common.fetchApi(
            {opcode: ''},
            { method: 'POST' },
            {
                loop: true,
                interval: 1000,
                pending: resp => {resp.result.process === 'setting'}
            }
        );
        let {errcode, data} = response;
        if (0 === errcode && 'finish' === data[0].result.process) {
            let devicesResult = data[0].result.state;
            let {devicesShow} = this.state;
            devicesResult.map(item => {
                for (var i = 0; i < devicesShow.length; i++) {
                    if (item.devid === devicesShow[i].deviceId) {
                        devicesShow[i].result = item.state;
                        break;
                    }
                }
            });
            this.setState({
                condition: 'settingResult',
                devicesShow: devicesShow
            });
        }
    }

    getSubRouters = async() => {
        let response = await common.fetchApi({opcode: 'SWITCH_START'});
        let { errcode, data } = response;
        let duration = data[0].result.sonconnect.duration;  //请求持续时间（单位秒）
        let times = duration / 5;
        let i = 0;

        if (0 === errcode) {
            let resp = await common.fetchApi(
                {opcode: 'ROUTE_QUERY'},
                { method: 'POST' },
                {
                    loop: true,            //请求次数
                    interval: 5000,         //请求间隔时间（单位毫秒）
                    stop : () => this.stop,
                    pending: res => {return i++ < times;}
                }
            );
            let {errcode, data} = resp;
            if (0 === errcode) {
                let devicesGet = data[0].result.sonconnect.devices || [];
                let devicesShow = this.state.devicesShow;

                devicesGet.map(item => {
                    let need = true;
                    for (var i = 0; i < devicesShow.length; i++) {
                        if (item.devid === devicesShow[i].devid) {
                            need = false;
                            break;
                        }
                    }
                    if(need) {
                        devicesShow.push({"deviceId":item.devid, "mac":item.mac, "checked":true, result: 'failed', giveUp: false});
                    }

                });
                if (i >= times) {
                    this.setState({
                        searchFinish: true,
                        devicesShow: devicesShow,
                    });
                } else {
                    this.setState({
                        devicesShow: devicesShow,
                    });
                }   
            }  
        }
    }

    componentDidMount(){
        this.stop = false;
        this.getSubRouters();
    }
    
    componentWillUnmount() {
        this.stop = true;
        async() => {
            await common.fetchApi({opcode: 'SWITCH_STOP'});
        }
        
    }
    render() {
        const { searchFinish, devicesShow, condition } = this.state;
        if ('selecting' === condition){
            return <Selecting
                        devicesShow={devicesShow}
                        searchFinish={searchFinish}
                        reSearch={this.reSearch}
                        setSubRouter={this.setSubRouter}
                        />;
        }

        if ('setting' === condition) {
            return <Setting devicesShow={devicesShow}/>
        }

        if ('settingResult' === condition) {
            return <SettingResult devicesShow={devicesShow}/>
        }
    }
}

class Selecting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { devicesShow, searchFinish } = this.props;
        let showList =[];
        devicesShow.map(item => {  
            showList.push(<SubRouter
                            state='checkbox'
                            key={item.deviceId}
                            checked={item.checked}
                            onChange={checked => this.onChange(item.deviceId,checked)}
                            deviceId={item.deviceId}/>
            );
        });

        if (0 === showList.length && !searchFinish) {       //搜索进行中，且设备列表为空
            return (
                <React.Fragment>
                    <Icon key="progress-icon" type="loading" className="bigLoading"  spin />
                    <h3 className='bigTitle'>正在检测子路由……</h3>
                </React.Fragment>
            );
        }
        if (0 === showList.length && searchFinish) {        //搜索完成，且设备列表为空
            return (
                <React.Fragment>
                    
                        <CustomIcon size={200} color='#D7D8DC' type="noroute" style={{margin: '40px auto 12px'}}/>

                    <p className='noFindTip'>没有检测到其他路由器</p>
                    <div className='warning'>
                        <p className='warningTip' style={{marginBottom: 8}}><CustomIcon size={12} color='#FB8632' type="hint" style={{marginRight: 4}}/>请确认子路由已插上电源，并放置在距离主路由较近的位置</p>
                        <p className='warningTip'><CustomIcon size={12} color='#FB8632' type="hint" style={{marginRight: 4}}/>如完成上述步骤仍无法检测到子路由，请将子路由恢复出厂后重试</p>
                    </div>
                    <Button type="primary" className="settingButton" onClick={this.props.reSearch}>重新检测</Button>
                </React.Fragment>
            );
        }
        if (0 !== showList.length && !searchFinish) {       //搜索进行中，设备列表不为空
            return (
                <React.Fragment>
                    <div className="header">
                        <Icon key="progress-icon" type="loading" className="smallLoading"  spin />
                        <h3 className='smallTitle'>正在检测子路由……</h3>
                    </div>
                    <div className="body">
                    {showList}
                    </div>
                    <Button type="primary" className="settingButton" onClick={this.props.setSubRouter}>设置</Button>
                </React.Fragment>
            );
        }
        if (0 !== showList.length && searchFinish) {       //搜索完成，且设备列表不为空
            return (
                <React.Fragment>
                    <div className="header">
                        <CustomIcon size={24} color='#4EC53F' type="succeed" />
                        <h3 className='smallTitle'>检测完成，请选择您要添加的子路由</h3>
                    </div>
                    <div className="body">
                    {showList}
                    </div>
                    <Button type="primary" className="settingButton" onClick={this.props.setSubRouter}>设置</Button>
                    <p className="research" onClick={this.props.reSearch}>重新检测</p>
                </React.Fragment>
            );
        }
    }
}

class Setting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { devicesShow } = this.props;
        let showList =[];
        devicesShow.map(item => {
            if (item.checked) {
                showList.push(<SubRouter
                    state='normal'
                    key={item.deviceId}
                    deviceId={item.deviceId}/>
                );
            }  
        });

        return (
            <React.Fragment>
                <div className="header">
                    <Icon key="progress-icon" type="loading" className="loading"  spin />
                    <h3>正在设置子路由，请稍后……</h3>
                </div>
                <div className="body">
                {showList}
                </div>
            </React.Fragment>
        );
    }
}

class SettingResult extends React.Component {
    constructor(props) {
        super(props);
    }

    next = () => {
        this.props.history.push('/guide/addsubrouter/location');
    }

    goHome = () => {
        this.props.history.push('/');
    }

    render() {
        const { devicesShow } = this.props;
        let showList =[];
        let statement = 'allOK';     //'allOK'、'haveFailed'
        let haveGiveUp = false;
        devicesShow.map(item => {
            if (item.giveUp) {
                haveGiveUp = true;
            }
            
            if (item.checked && !item.giveUp) {
                if ('failed' === item.result) {
                    statement = 'haveFailed';
                }
                showList.push(<SubRouter
                    state={item.result}
                    key={item.deviceId}
                    mac={item.mac}
                    deviceId={item.deviceId}/>
                );
            }  
        });

        if ('allOK' === statement && 0 < showList.length && !haveGiveUp) {      //设置都成功的情况
            return (
                <React.Fragment>
                <div className="header">
                    <CustomIcon size={24} color='#4EC53F' type="succeed" />
                    <h3>设置完成</h3>
                </div>
                <div className="body">
                {showList}
                </div>
                <Button type="primary" className="settingButton" disabled={false} onClick={this.next}>下一步</Button>
            </React.Fragment>
            );
        }

        if ('allOK' === statement && 0 < showList.length && haveGiveUp) {       //忽略失败设备后都成功的情况
            return (
                <React.Fragment>
                <div className="body" style={{marginTop: 58}}>
                {showList}
                </div>
                <Button type="primary" className="settingButton" disabled={false} onClick={this.next}>下一步</Button>
            </React.Fragment>
            );
        }

        if ('haveFailed' === statement) {       //存在设置失败的设备，包括忽略某台设备后还存在其他失败的设备的情况
            return (
                <React.Fragment>
                <div className="haveFailed">
                    <p>子路由添加过程发生异常，请按照提示修复后继续设置</p>
                </div>
                <div className="body">
                {showList}
                </div>
                <Button type="primary" className="settingButton" disabled={true} onClick={this.next}>下一步</Button>
            </React.Fragment>
            );
        }

        if (haveGiveUp && 0 === showList.length) {  //失败设备都忽略后，没有设备的情况（原本设置都失败）
            return (
                <React.Fragment>
                <div className="header">
                    <CustomIcon size={14} color='#FB8632' type="hint" />
                    <h3>已放弃添加子路由</h3>
                </div>
                <div className="body">
                    
                        <CustomIcon size={140} color='#D7D8DC' type="noroute"/>
                    
                </div>
                <Button type="primary" className="settingButton" disabled={false} onClick={this.goHome}>去首页</Button>
            </React.Fragment>
            );
        } 
    }
}