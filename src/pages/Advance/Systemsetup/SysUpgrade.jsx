
import React from 'react';
import {Button, Table, message, Progress} from 'antd';
import Upgrade from '../../UpgradeDetect/Upgrade';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '~/components/Icon';
import { SIGHUP } from 'constants';

const MODULE = 'upgrade';

export default class SysUpgrade extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            detecting: false,
            routerList: [],
            detectTip: '重新检测',
            duration: 150,
            update: false,
            devList: {},
            codeList: {}
        };
        this.devList = {};
        this.codeList = {};
        this.columns = [{
            title: '设备名称'/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 400,
        },  {
            title: '型号名称'/*_i18n:接入方式*/,
            dataIndex: 'model',
            width: 240
        }, {
            title: '当前版本'/*_i18n:接入方式*/,
            dataIndex: 'version',
            width: 240
        }, {
            title: '状态'/*_i18n:接入方式*/,
            dataIndex: 'status',
            width: 336,
            render: (value, record) => {
                const {detecting, update, duration, devList, codeList} = this.state;
                const online = record.online;
                if (update) {
                    return <ProgressStatus duration={duration} status={devList[record.name]} failTip={codeList[record.name]} />
                } else if (detecting && online) {
                    return (
                        <div>
                            <CustomIcon type="loading_ring" color='#779FF8' size={14} spin/>
                            <span style={{marginLeft: 4}}>检测中...</span>
                        </div>
                    )
                } else {
                    return <span style={{fontSize: 14, color: online ? '#333C4F' : '#ADB1B9' }}>
                    {record.status}
                    </span>
                } 
            }
        }];
    }

    componentDidMount() {
        this.fetchRouter();
    }

    render(){
        const {detecting, routerList, detectTip, update} = this.state;
        return (
            <SubLayout className="settings">
                <div className='sys-upgrade'>
                    <p>
                        检测是否有适用的新固件
                    </p>
                    <div>
                        <Button onClick={this.reDetect} disabled={detecting || update} style={{marginRight: 20, borderRadius: 8}}>{detectTip}</Button>
                        <Button type="primary" disabled={detecting || update} onClick={this.startUpgrade}>全部升级</Button>
                    </div>
                </div>
                <div className="static-table">
                    <Table
                        columns={this.columns}
                        dataSource={routerList}
                        rowClassName={(record, index) => {
                            let className = 'editable-row';
                            if (index % 2 === 1) {
                                className = 'editable-row-light';
                            }
                            return className;
                        }}
                        bordered={false}
                        rowKey={record => record.mac}
                        // scroll={{ y: window.innerHeight - 267 }}
                        style={{ minHeight: 360 }}
                        pagination={false}
                        locale={{ emptyText: intl.get(MODULE, 28)/*_i18n:暂无设备*/, filterConfirm: intl.get(MODULE, 15)/*_i18n:确定*/, filterReset: intl.get(MODULE, 29)/*_i18n:重置*/ }}
                        />
                </div>
            </SubLayout>
        );
    }

    startUpgrade = async () => {
        this.setState({
            update: true
        });
        common.fetchApi({
            opcode : 'UPGRADE_START',
        }).then((resp)=>{
            if(resp.errcode == 0){
                this.setState({
                    duration : resp.data[0].result.upgrade.restart_duration,
                });
            common.fetchApi(
                {opcode : 'UPGRADE_STATE'},
                {},
                {
                    loop : true,
                    interval : 1000,
                    stop : () => this.stop,
                    pending : res => {
                        const result = res.data[0].result.upgrade;
                        let state = false;
                        result.some(item => {
                                const progress = item.progress;
                                return state = progress === 'wait to start!' || progress === 'start downloading!' || progress === 'start checking!' || progress === 'download success!';
                        })
                        return state;
                    }
                }
            ).then((resp)=>{
                const result = resp.data[0].result.upgrade;
                result.map(item => {
                    Object.assign(this.devList, {[item.devid]: item.progress});
                    Object.assign(this.codeList, {[item.devid]: intl.get(MODULE, 5, {error: item.code})});
                });
                this.setState({
                    devList: this.devList,
                    codeList: this.codeList
                });
            }) 
        }else{
            Modal.error({title : intl.get(MODULE, 6)/*_i18n:启动升级失败*/, centered: true});
        }});
    }

    reDetect = () => {
        this.setState({
            detecting: true,
            detectTip: '检测中...'
        });
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode:'FIRMWARE_GET' },
            { opcode: 'ROUTE_GET' }
        ], { ignoreErr: true });
        const {errcode, data} = resp;
        if (errcode !== 0) {
            message.warning('获取信息失败！')
        }

        const routerList = data[0].result.upgrade.map(item => {
            const current = item.current_version;
            const newVersion = item.newest_version;
            let versiontTip = '';
            if (newVersion === '') {
                versiontTip = '当前已是最新版本';
            } else {
                versiontTip = '发现新版本：' + newVersion
            }
            return {
                name: item.devid,
                model: 'W1',
                version: current,
                status: versiontTip,
                online: 1
            }
        });

        data[1].result.sonconnect.devices.map(item => {
            if (item.online === '0') {
                routerList.push({
                    name: item.devid,
                    model: 'W1',
                    version: '--',
                    status: '设备已离线',
                    online: 0
                })
            }
        })

        this.setState({
            routerList: routerList
        })
    }

}

class ProgressStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        percent: 0
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            const max = this.props.max || 100;
            let percent = this.state.percent + 1;
            if (percent <= max) {
                this.setState({
                    percent: percent,
                });
            } else {
                clearInterval(this.timer);
                // this.props.onDone && this.props.onDone();
            }
        }, this.props.duration * 10);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const percent = this.state.percent;
        const {status, failTip} = this.props;
        const Info = () => {
            switch(status) {
                case 'download failed!': 
                    return  <p style={{color: '#D0021B', fontSize: 14}}>
                        {`升级失败(下载文件失败，${failTip || '错误码：未知'})`}
                    </p>
                case 'check failed!':
                    return  <p style={{color: '#D0021B', fontSize: 14}}>
                        {`升级失败(校验文件失败，${failTip || '错误码：未知'})`}
                    </p>
                case 'start upgrading!': 
                    return <div>
                    <Progress percent={percent} strokeWidth={8} />
                </div>
                default:
                    return <div>
                    <Progress percent={percent} strokeWidth={8} />
                </div>
            }
        }
        return (
            <Info />
        )
    }
}