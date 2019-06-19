import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import SubRouter from 'h5/components/SubRouter';

import './setting.scss';

const SETTING_CONDITION = [
    'selecting',         //检测搜索
    'Finish',           //设置完成
];

export default class Setting extends React.Component {
    constructor (props) {
        super (props);
        this.flag = 0;
    }

    state = {
        searchFinish: false,
        devicesShow: [],
        condition: SETTING_CONDITION[0],
    }

    onChange = (mac, checked) => {
        let devicesShow = this.state.devicesShow;
        for (var i = 0; i < devicesShow.length; i++) {
            if (mac === devicesShow[i].mac) {
                devicesShow[i].checked = checked;
                break;
            }
        }
        this.setState({
            devicesShow: devicesShow,
        });
    }
    changeLocation = (mac, locationInput) => {
        let devicesShow = this.state.devicesShow;
        for (var i = 0; i < devicesShow.length; i++) {
            if (mac === devicesShow[i].mac) {
                devicesShow[i].location = locationInput;
                break;
            }
        }
        this.setState({
            devicesShow: devicesShow,
        });
    }
    goHome = () => {
        this.props.history.push("/");
    }

    getSubRouters = async() => {
        let response = await common.fetchApi({opcode: 'SWITCH_START'});
        const { errcode, data } = response;
        let duration = data[0].result.sonconnect.duration || 0;  //请求持续时间（单位秒）

        if (0 === errcode) {
            setTimeout(() => {
                common.fetchApi({opcode: 'SWITCH_STOP'});
                this.flag = 1;
            }, duration*1000);
            let resp = await common.fetchApi(
                {opcode: 'ROUTE_QUERY'},
                { method: 'POST' },
                {
                    loop: true,            //请求次数
                    interval: 5000,         //请求间隔时间（单位毫秒）
                    stop : () => this.stop,
                    pending: resp => {
                        let {errcode, data} = resp;
                        let devicesShow = this.state.devicesShow;
                        if (0 === errcode && 0 === this.flag) {
                            let devicesGet = data[0].result.sonconnect.devices || [];
                            devicesGet.map(item => {
                                let need = true;
                                for (var i = 0; i < devicesShow.length; i++) {
                                    if (item.devid === devicesShow[i].deviceId) {
                                        need = false;
                                        break;
                                    }
                                }
                                if(need) {
                                    devicesShow.push({
                                        deviceId: item.devid,
                                        location: item.devid,
                                        mac: item.mac,
                                        checked: '1' === item.status,
                                        result: 'failed',
                                        giveUp: false,
                                        bh2mac: item.bh2mac,
                                        bh5mac: item.bh5mac,
                                        status: item.status,
                                    });
                                }

                            });
                            this.setState({
                                devicesShow: devicesShow,
                            });
                        } else {
                            this.setState({
                                searchFinish: true,
                                devicesShow: devicesShow,
                            });
                        }
                        return 0 === errcode && 0 === this.flag;
                    }
                }
            );
            let {errcode, data} = resp;
            let devicesShow = this.state.devicesShow;
            if (0 === errcode && 0 === this.flag) {
                let devicesGet = data[0].result.sonconnect.devices || [];
                devicesGet.map(item => {
                    let need = true;
                    for (var i = 0; i < devicesShow.length; i++) {
                        if (item.devid === devicesShow[i].devid) {
                            need = false;
                            break;
                        }
                    }
                    if(need) {
                        devicesShow.push({
                            deviceId: item.devid || '',
                            location: item.devid,
                            mac: item.mac || '',
                            checked: '1' === item.status,
                            result: 'failed',
                            giveUp: false,
                            bh2mac: item.bh2mac || '',
                            bh5mac: item.bh5mac || '',
                            status: item.status,
                        });
                    }

                });
                this.setState({
                    devicesShow: devicesShow,
                });
            } else {
                this.setState({
                    searchFinish: true,
                    devicesShow: devicesShow,
                });
            }  
        }
    }

    setSubRouter = async() => {
        let {devicesShow} = this.state;
        let sonconnect = {selected:[],blocked:[]};
        devicesShow.map(item => {
            if (item.checked) {
                sonconnect.selected.push(
                    {
                        mac: item.mac,
                        devid: item.deviceId,
                        location: item.deviceId,
                        bh2mac: item.bh2mac,
                        bh5mac: item.bh5mac
                    }
                );
            } else {
                if ('1' === item.status)
                sonconnect.blocked.push(
                    {
                        mac: item.mac,
                        devid: item.deviceId,
                        bh2mac: item.bh2mac,
                        bh5mac: item.bh5mac
                    }
                );
            }
        });

        let res = await common.fetchApi(
            [
                {opcode: 'SWITCH_STOP'}
            ]
        );
        if(0 === res.errcode) {
            this.flag = 1;
        }
    
        let response = await common.fetchApi(
            [
                {opcode: 'ROUTE_SET', data: {sonconnect: sonconnect}}
            ]
        );

        let {errcode} = response;
        if (0 === errcode) {
            for (var i = 0; i < devicesShow.length; i++) {
                if (devicesShow[i].checked) {
                    devicesShow[i].result = 'success';
                }
            }   
        } else {
            for (var i = 0; i < devicesShow.length; i++) {
                if (devicesShow[i].checked) {
                    devicesShow[i].result = 'failed';
                }
            }
        }
        this.setState({
            condition: SETTING_CONDITION[1],
            devicesShow: devicesShow
        });
    }

    refresh = () => {
        this.flag = 0;
        this.setState({
            condition: SETTING_CONDITION[0],
            searchFinish: false,
        });
        this.getSubRouters();
    }

    componentDidMount() {
        this.getSubRouters();
    }

    render () {
        const { searchFinish, devicesShow, condition } = this.state;

        return (
            <React.Fragment>
                {SETTING_CONDITION[0] === condition ?
                    <Selecting 
                        devicesShow={devicesShow}
                        searchFinish={searchFinish}
                        refresh={this.refresh}
                        setSubRouter={this.setSubRouter}
                        onChange={this.onChange}
                    />
                    :
                    <SettingResult
                        devicesShow={devicesShow}
                        refresh={this.refresh}
                        goHome={this.goHome}
                        changeLocation={this.changeLocation}
                    />
                }
            </React.Fragment>
        );
    }
}

class Selecting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { devicesShow, searchFinish } = this.props;
        let disabled = true;
        devicesShow.map(item => {
            if (item.checked) {
                disabled = false;
            }
        });

        if (0 === devicesShow.length && searchFinish) {
            return (
                <div className='noRouter'>
                    <div className='no-router'></div>
                    <p className='noRouterTitle'>没有可添加的路由器</p>
                    <p className='noRouterDescription'>请检查路由器电源是否接通，并处于可添加范围内</p>
                    <Button type='primary' onClick={this.props.refresh} style={{width: '2.88rem',marginTop: 0}} >刷新</Button>
                </div>
            );
        } else {
            return ([
                <div className='guide-upper'>
                    <GuideHeader title='添加更多路由器' tips='将要添加的路由放置在合适的位置，然后接通电源，待信号灯呈白色后点击「开始添加」' />
                    <div className={`routerList ${0 !== devicesShow.length? 'haveLine': ''}`}>
                        {devicesShow.map(item =>{
                            return  [<SubRouter
                                        state='checkbox'
                                        key={item.mac}
                                        checked={item.checked}
                                        onChange={checked => this.props.onChange(item.mac, checked)}
                                        deviceId={item.deviceId}
                                        location={item.location}
                                        status={item.status}/>]
                        })}
                    </div>
                    <div className='h5addsubrouter-icon'>
                            {searchFinish?
                            <div className='refresh' onClick={this.props.refresh}><div className='refreshImg'></div>刷新</div>
                            :
                            <div className='icon'>
                                <i className='img spin'></i><span className='content'>搜索中…</span>
                            </div>
                            }
                    </div>
                </div>,
                <Button type='primary' onClick={this.props.setSubRouter} disabled={disabled}>下一步</Button>   
            ]);
        }
    }
}

class SettingResult extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { devicesShow } = this.props;
        let allFailed = true;
        
        devicesShow = devicesShow.filter(item => {return item.checked;});
        devicesShow.map(item => {
            if('success' === item.result) {
                allFailed = false;
            }
        });

        return ([
            <div className={`guide-upper ${allFailed? 'result': ''}`}>
                <GuideHeader title='路由器添加完成' tips='' />
                <div className='routerList-result'>
                    {devicesShow.map(item => {
                        return  [<SubRouter
                                    location={item.location}
                                    state={item.result}
                                    key={item.mac}
                                    mac={item.mac}
                                    deviceId={item.deviceId}
                                    changeLocation={(mac, locationInput) => this.props.changeLocation(mac, locationInput)}
                                />]
                    })}
                </div>
            </div>,
            <div>
                {allFailed?
                    [<Button onClick={this.props.refresh}>重新添加</Button>,
                    <Button onClick={this.props.goHome}>返回首页</Button>]
                    :
                    <Button type='primary' onClick={this.props.goHome}>完成</Button>
                }
            </div>
        ]);
    }
}