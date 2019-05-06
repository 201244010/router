
import React from 'react';
import {Button, Table, message, Progress} from 'antd';
import SubLayout from '~/components/SubLayout';
import CustomIcon from '~/components/Icon';

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
            hasVersion: true,
            devList: {},
            codeList: {}
        };
        this.devList = {};
        this.codeList = {};
        this.columns = [{
            title: '设备名称'/*_i18n:设备名称*/,
            dataIndex: 'name',
            width: 400,
            render: (name, record) => {
                return <div className="sub-router-set">
                    <div>
                        <img  src={require('~/assets/images/router.png')}/>
                        <label style={{marginLeft: 12}}>{record.devid} ({name})</label>
                    </div>
                </div>
            }
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
                if (update && online) {
                    return <ProgressStatus duration={duration} status={devList[record.devid]} failTip={codeList[record.devid]} />
                } else if (detecting && online) {
                    return (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <CustomIcon type="loading" color='#6174F1' size={14} spin/>
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
        const {detecting, routerList, detectTip, update, hasVersion} = this.state;
        return (
            <SubLayout className="settings">
                <div className='sys-upgrade'>
                    <p>
                        检测是否有适用的新固件
                    </p>
                    <div>
                        <Button onClick={this.reDetect} disabled={detecting || update} style={{marginRight: 20, borderRadius: 8}}>{detectTip}</Button>
                        <Button type="primary" disabled={detecting || update || hasVersion} onClick={this.startUpgrade}>全部升级</Button>
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
            opcode : 'MESH_UPGRADE_START',
        }).then((resp)=>{
            if(resp.errcode == 0){
                this.setState({
                    duration : resp.data[0].result.upgrade.restart_duration,
                });
            common.fetchApi(
                {opcode : 'MESH_UPGRADE_STATE'},
                {},
                {
                    loop : true,
                    interval : 1000,
                    stop : () => this.stop,
                    pending : res => {
                        const result = res.data[0].result.upgrade;
                        result.map(item => {
                            Object.assign(this.devList, {[item.devid]: item.progress});
                            Object.assign(this.codeList, {[item.devid]: intl.get(MODULE, 5, {error: item.code})});
                        });
                        this.setState({
                            devList: this.devList,
                            codeList: this.codeList
                        });
                        let state = false;
                        result.some(item => {
                                const progress = item.progress;
                                return state = progress === 'wait to start!' || progress === 'start downloading!' || progress === 'start checking!' || progress === 'download success!';
                        })
                        return state;
                    }
                }
            ).then((resp)=>{
                
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
        setTimeout(() => this.fetchRouter(), 3000);
    }

    fetchRouter = async () => {
        const resp = await common.fetchApi([
            { opcode:'MESH_FIRMWARE_GET' }
        ], { ignoreErr: true });
        const {errcode, data} = resp;
        if (errcode !== 0) {
            message.warning('获取信息失败！')
        }

        let hasVersion = true;

        const routerList = data[0].result.upgrade.map(item => {
            const current = item.current_version;
            const newVersion = item.newest_version;
            const online = parseInt(item.online);
            let versiontTip = '';
            if (newVersion === '') {
                versiontTip = '当前已是最新版本';
            } else {
                versiontTip = '发现新版本：' + newVersion;
                hasVersion = false;
            }
            return {
                devid: item.devid,
                name: item.location,
                model: item.model || '--',
                version: current || '--',
                status: online ? versiontTip : '设备已离线',
                releaseLog: item.release_log,
                online: online,
                newVersion: newVersion
            }
        });
        this.setState({
            routerList: routerList,
            detecting: false,
            detectTip: '重新检测',
            hasVersion: hasVersion
        })
    }

}

class ProgressStatus extends React.Component {
    constructor(props) {
        super(props);
        this.once = false;
    }

    state = {
        percent: 0
    }

    startProgress = () => {
        this.timer = setInterval(() => {
            this.once = true;
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
                    !this.once && this.startProgress();
                    return <div>
                    <Progress percent={percent} strokeWidth={8} />
                </div>
                case 'start downloading!':
                    return <div>
                        {
                            percent === 0 ? '正在下载' : <Progress percent={percent} strokeWidth={8} />
                        }
                    </div>
                case 'start checking!':
                    return <div>
                    {
                        percent === 0 ? '正在校验' : <Progress percent={percent} strokeWidth={8} />
                    }
                </div>
                default:
                return <div>
                        正在下载
                    </div>
            }
        }
        return (
            <Info />
        )
    }
}