import React from 'react';
import { Button } from 'antd';
import SubRouter from '~/components/SubRouter';
import CustomIcon from '~/components/Icon';

const MODULE = 'setting';

class Selecting extends React.Component {
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
                            deviceId={item.deviceId}
                            status={item.status}/>
            );
        });

        if (0 === showList.length && !searchFinish) {       //搜索进行中，且设备列表为空
            return (
                <React.Fragment>
                    <div className="bigLoading">
                        <CustomIcon size={80} color="#6174F1" type="loading" spin />
                    </div>
                    {/* <Icon key="progress-icon" type="loading" className="bigLoading"  spin /> */}
                    <h3 className='bigTitle'>{intl.get(MODULE, 2)/*_i18n:正在搜索子路由……*/}</h3>
                </React.Fragment>
            );
        }

        if (0 === showList.length && searchFinish) {        //搜索完成，且设备列表为空
            return (
                <React.Fragment>
                    <CustomIcon size={200} color='#D7D8DC' type="noroute" style={{margin: '40px auto 12px'}}/>
                    <p className='noFindTip'>{intl.get(MODULE, 3)/*_i18n:没有检测到其他路由器*/}</p>
                    <div className='warning'>
                        <p className='warningTip' style={{marginBottom: 8}}><CustomIcon size={12} color='#FB8632' type="hint" style={{marginRight: 4}}/>{intl.get(MODULE, 4)/*_i18n:请确认子路由已插上电源，并放置在距离主路由较近的位置*/}</p>
                        <p className='warningTip'><CustomIcon size={12} color='#FB8632' type="hint" style={{marginRight: 4}}/>{intl.get(MODULE, 5)/*_i18n:如完成上述步骤仍无法检测到子路由，请将子路由恢复出厂后重试*/}</p>
                    </div>
                    <Button type="primary" className="settingButton" onClick={this.props.reSearch}>{intl.get(MODULE, 6)/*_i18n:重新检测*/}</Button>
                </React.Fragment>
            );
        }

        if (0 !== showList.length && !searchFinish) {       //搜索进行中，设备列表不为空
            return (
                <React.Fragment>
                    <div className="settingHeader">
                        <div className="smallLoading">
                            <CustomIcon size={24} color="#6174F1" type="loading" spin />
                        </div>
                        <span className='smallTitle'>{intl.get(MODULE, 7)/*_i18n:正在搜索子路由……*/}</span>
                    </div>
                    <div className="body">
                    {showList}
                    </div>
                    <Button type="primary" className="settingButton" disabled={disabled} onClick={this.props.setSubRouter}>{intl.get(MODULE, 8)/*_i18n:设置*/}</Button>
                </React.Fragment>
            );
        }

        if (0 !== showList.length && searchFinish) {       //搜索完成，且设备列表不为空
            return (
                <React.Fragment>
                    <div className="settingHeader">
                        <CustomIcon size={24} color='#4EC53F' type="succeed" style={{marginRight: 8}}/>
                        <span className='smallTitle' style={{verticalAlign: 'middle'}}>{intl.get(MODULE, 9)/*_i18n:检测完成，请选择您要添加的子路由*/}</span>
                    </div>
                    <div className="body">
                    {showList}
                    </div>
                    <Button type="primary" className="settingButton" disabled={disabled} onClick={this.props.setSubRouter}>{intl.get(MODULE, 10)/*_i18n:设置*/}</Button>
                    <p className="research" onClick={this.props.reSearch}>{intl.get(MODULE, 11)/*_i18n:重新检测*/}</p>
                </React.Fragment>
            );
        }
    }
};

export default Selecting;