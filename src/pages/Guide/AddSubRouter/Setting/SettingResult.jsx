import React from 'react';
import { Button } from 'antd';
import SubRouter from '~/components/SubRouter';
import CustomIcon from '~/components/Icon';

const MODULE = 'setting';

class SettingResult extends React.Component {
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
					<div className="settingHeader">
						<CustomIcon className='settingHeader-icon-succeed' size={24} type="succeed" />
						<span className='smallTitle small-middle'>{intl.get(MODULE, 13)/*_i18n:组网完成*/}</span>
					</div>
					<div className="body">
					{showList}
					</div>
					<Button type="primary" className="settingButton" disabled={false} onClick={this.props.next}>{intl.get(MODULE, 14)/*_i18n:下一步*/}</Button>
				</React.Fragment>
            );
        }

        if ('allOK' === statement && 0 < showList.length && haveGiveUp) {       //忽略失败设备后都成功的情况
            return (
                <React.Fragment>
					<div className="body" style={{marginTop: 58}}>
					{showList}
					</div>
					<Button type="primary" className="settingButton" disabled={false} onClick={this.props.next}>{intl.get(MODULE, 15)/*_i18n:下一步*/}</Button>
				</React.Fragment>
            );
        }

        if ('haveFailed' === statement) {       //存在设置失败的设备，包括忽略某台设备后还存在其他失败的设备的情况
            return (
                <React.Fragment>
					<div className="haveFailed">
						<p>{intl.get(MODULE, 16)/*_i18n:子路由添加过程发生异常，请按照提示修复后继续设置*/}</p>
					</div>
					<div className="body">
					{showList}
					</div>
					<Button type="primary" className="settingButton" disabled={true} onClick={this.props.next}>{intl.get(MODULE, 17)/*_i18n:下一步*/}</Button>
				</React.Fragment>
            );
        }

        if (haveGiveUp && 0 === showList.length) {  //失败设备都忽略后，没有设备的情况（原本设置都失败）
            return (
                <React.Fragment>
					<div className="settingHeader">
						<CustomIcon className='settingHeader-icon-hint' size={14} type="hint" />
						<span className='smallTitle small-middle'>{intl.get(MODULE, 18)/*_i18n:已放弃添加子路由*/}</span>
					</div>
					<div className="body">
						<CustomIcon className='body-icon-noroute' size={140} type="noroute"/> 
					</div>
					<Button type="primary" className="settingButton" disabled={false} onClick={this.props.goHome}>{intl.get(MODULE, 19)/*_i18n:去首页*/}</Button>
				</React.Fragment>
            );
        } 
    }
};
export default SettingResult;