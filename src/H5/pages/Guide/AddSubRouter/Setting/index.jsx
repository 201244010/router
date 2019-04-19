import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import SubRouter from 'h5/components/SubRouter';

import './setting.scss';

export default class Setting extends React.Component {
    constructor (props) {
        super (props);
    }

    state = {
        searchFinish: false,
        devicesShow: [],
        condition: 'selecting'  //'selecting'、'setting'、'settingResult',检测搜索、正在设置、设置完成
    }

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

    goHome = () => {
        this.props.history.push("/");
    }

    getSubRouters = async() => {
        let response = await common.fetchApi({opcode: 'SWITCH_START'});
        const { errcode, data } = response;
        let duration = data[0].result.sonconnect.duration || 0;  //请求持续时间（单位秒）
        let flag = 0;
        if (0 === errcode) {
            setTimeout(() => {
                common.fetchApi({opcode: 'SWITCH_STOP'});
                flag = 1;
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
                        if (0 === errcode && 0 === flag) {
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
                                        mac: item.mac,
                                        checked: true,
                                        result: 'failed',
                                        giveUp: false,
                                        bh2mac: item.bh2mac,
                                        bh5mac: item.bh5mac,
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
                        return 0 === errcode && 0 === flag;
                    }
                }
            );
            let {errcode, data} = resp;
            let devicesShow = this.state.devicesShow;
            if (0 === errcode && 0 === flag) {
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
                            mac: item.mac || '',
                            checked: true,
                            result: 'failed',
                            giveUp: false,
                            bh2mac: item.bh2mac || '',
                            bh5mac: item.bh5mac || '',
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
        let data = {sonconnect: {selected:[],blocked:[]}};
        devicesShow.map(item => {
            if (item.checked) {
                data.sonconnect.selected.push(
                    {
                        mac: item.mac,
                        devid: item.deviceId,
                        location: item.deviceId,
                        bh2mac: item.bh2mac,
                        bh5mac: item.bh5mac
                    }
                );
            } else {
                data.sonconnect.blocked.push(
                    {
                        mac: item.mac,
                        devid: item.deviceId,
                        bh2mac: item.bh2mac,
                        bh5mac: item.bh5mac
                    }
                );
            }
        });

        this.setState({condition: 'setting'});
        let response = await common.fetchApi(
            [
                {opcode: 'SWITCH_STOP'},
                {opcode: 'ROUTE_SET', data: data}
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
            condition: 'settingResult',
            devicesShow: devicesShow
        });
    }

    refresh = () => {
        this.setState({
            condition: 'selecting',
            searchFinish: false,
        });
        this.getSubRouters();
    }

    componentDidMount() {
        this.getSubRouters();
    }

    render () {
        const { searchFinish, devicesShow, condition } = this.state;
        let findRouter = '';

        if ('selecting' === condition) {
            findRouter = <Selecting 
                            devicesShow={devicesShow}
                            searchFinish={searchFinish}
                            refresh={this.refresh}
                            setSubRouter={this.setSubRouter}
                            onChange={this.onChange}
                        />;
        }

        if ('settingResult' === condition) {
            findRouter = <SettingResult devicesShow={devicesShow} refresh={this.refresh} goHome={this.goHome}/>
        }

        return (
            <React.Fragment>
                {findRouter}
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
        let showList =[];
        let disabled = true;
        devicesShow.map(item => {
            if (item.checked) {
                disabled = false;
            } 
            showList.push(<SubRouter
                            state='checkbox'
                            key={item.deviceId}
                            checked={item.checked}
                            onChange={checked => this.props.onChange(item.deviceId,checked)}
                            deviceId={item.deviceId}/>
            );
        });

        if (0 === showList.length && searchFinish) {
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
                    <div className={`routerList ${0 !== showList.length? 'haveLine': ''}`}>
                        {showList}
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
        const { devicesShow } = this.props;
        let showList =[];
        let allFailed = true;
        let footer = '';
        devicesShow.map(item => {
            
            if (item.checked) {
                if('success' === item.result) {
                    allFailed = false;
                }
                showList.push(<SubRouter
                    state={item.result}
                    key={item.deviceId}
                    mac={item.mac}
                    deviceId={item.deviceId}/>
                );
            }  
        });

        if (allFailed) {
            footer = [<Button onClick={this.props.refresh}>重新添加</Button>,
                    <Button onClick={this.props.goHome}>返回首页</Button>];
        } else {
            footer = <Button type='primary' onClick={this.props.goHome}>完成</Button>;
        }

        return ([
            <div className={`guide-upper ${allFailed? 'result': ''}`}>
                <GuideHeader title='路由器添加完成' tips='' />
                <div className='routerList-result'>
                    {showList}
                </div>
            </div>,
            {footer}
        ]);
    }
}