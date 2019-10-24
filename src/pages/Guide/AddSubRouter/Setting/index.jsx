import React from 'react';
import SettingResult from'./SettingResult';
import Selecting from './Selecting';
import SettingRouter from './SettingRouter';
import './setting.scss';

const MODULE = 'setting';

export default class Setting extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        searchFinish: false,
        devicesShow: [],
        condition: 'selecting'  //'selecting'、'setting'、'settingResult',检测搜索、正在设置、设置完成
    }

    stop = () => {}

    next = () => {
        this.props.history.push("/guide/addsubrouter/location");
    }

    goHome = () => {
        this.props.history.push("/");
    }

    goBack = () => {
        this.props.history.goBack();
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

    reSearch = () => {
        this.setState({
            condition: 'selecting',
            searchFinish: false,
        });
        this.getSubRouters();
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
                if ('1' === item.status) {
                    data.sonconnect.blocked.push(
                        {
                            mac: item.mac,
                            devid: item.deviceId,
                            bh2mac: item.bh2mac,
                            bh5mac: item.bh5mac
                        }
                    );
                }  
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
                                        checked: '1' === item.status,
                                        result: 'failed',
                                        giveUp: false,
                                        bh2mac: item.bh2mac,
                                        bh5mac: item.bh5mac,
                                        status: item.status || '1',
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
                            checked: '1' === item.status,
                            result: 'failed',
                            giveUp: false,
                            bh2mac: item.bh2mac || '',
                            bh5mac: item.bh5mac || '',
                            status: item.status || '1',
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
        let findRouter = '';
        if ('selecting' === condition){
            findRouter = <Selecting
                            devicesShow={devicesShow}
                            searchFinish={searchFinish}
                            reSearch={this.reSearch}
                            setSubRouter={this.setSubRouter}
                            onChange={this.onChange}
                            goBack={this.goBack}
                        />;
        }

        if ('setting' === condition) {
            findRouter = <SettingRouter devicesShow={devicesShow}/>
        }

        if ('settingResult' === condition) {
            findRouter = <SettingResult devicesShow={devicesShow} next={this.next} goHome={this.goHome}/>
        }
        return (
            <div className="setting">
                <h2>{intl.get(MODULE, 0)/*_i18n:组网设置*/}</h2> 
                <p className="ui-tips guide-tip">{intl.get(MODULE, 1)/*_i18n:搜索完成后，勾选您需要添加的子路由即可*/}</p>
                <div className="content">
                    {findRouter}
                </div>
            </div>
        );  
    }
}
