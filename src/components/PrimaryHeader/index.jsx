import React from 'react';
import Icon from '~/components/Icon';
import './header.scss';
import { withRouter, NavLink } from "react-router-dom";
import { get, clear } from '~/assets/common/auth';
import SwitchLang from '../SwitchLang';
import {getQuickStartVersion} from '~/utils';

const MODULE = 'primaryheader';

class PrimaryHeader extends React.Component {
	constructor(props) {
        super(props);
    }

    state = {
        isGuidePage: false,
    }

    static getDerivedStateFromProps(){
        const pathname = location.pathname;
        return {
            isGuidePage : pathname.indexOf('/guide') > -1,
        };
    }

    downloadPage = () =>{
        this.props.history.push('/app');
    }

    logout = async ()=>{
        let resp = await common.fetchApi({
            opcode: 'ACCOUNT_LOGOUT',
            data:{
                account: {
                    token: get()
                }
            }
        });

        // 删除cookie
        clear();
        this.props.history.push('/login');
    }

	render() {
        const {match} = this.props;
        const { isGuidePage } = this.state;

		return (
			<div className="header">
                <ul>
                    <li>
                        <div className="ui-ib logo">
                            <Icon type="logo" size={40} color="#fff" />
                        </div>
                    </li>
                    {
                        !isGuidePage ? [
                            <nav key="1" className="menu">
                                {/* <Icon type="netstat"></Icon> */}
                                <NavLink to={match.path + "home"} activeClassName="active">{intl.get(MODULE, 0)/*_i18n:网络状态*/}</NavLink>
                                {/* <Icon type="set"></Icon> */}
                                <NavLink to={match.path + "clientlist"} activeClassName="active">{intl.get(MODULE, 1)/*_i18n:基本设置*/}</NavLink>
                                {/* <Icon type="advancedsetup"></Icon> */}
                                <NavLink to={match.path + "routersetting"} activeClassName="active">{intl.get(MODULE, 2)/*_i18n:高级设置*/}</NavLink>
                            </nav>,
                            <li key="2" className="sidebar">
                                {'abroad' === getQuickStartVersion()?
                                    [<SwitchLang className='ui-ib lang'/>,
                                    <span className="ui-ib">|</span>]
                                    : ''
                                }
                                <a href="javascript:"  onClick={this.downloadPage} className="ui-ib">{intl.get(MODULE, 3)/*_i18n:下载手机版*/}</a>
                                <span className="ui-ib">|</span>
                                <a href="javascript:;" onClick={this.logout} className="ui-ib">{intl.get(MODULE, 4)/*_i18n:退出管理*/}</a>
                            </li>
                        ] : ''
                    }
                </ul>
			</div>
		);
	}

};


export default withRouter(PrimaryHeader);



