import React from 'react';
import SubRouter from '~/components/SubRouter';
import CustomIcon from '~/components/Icon';

const MODULE = 'setting';

class SettingRouter extends React.Component {
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
                <div className="settingHeader">
                    <div className="smallLoading">
                        <CustomIcon className='smallLoading-icon-loading' size={24} type="loading" spin />
                    </div>
                    <span className='smallTitle'>{intl.get(MODULE, 12)/*_i18n:正在设置子路由，请稍后……*/}</span>
                </div>
                <div className="body">
                {showList}
                </div>
            </React.Fragment>
        );
    }
};
export default SettingRouter;