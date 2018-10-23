import React from 'react';
import Icon from '~/components/Icon';
import './header.scss';
import SubLayout from "../SubLayout";
import { withRouter, NavLink } from "react-router-dom";
import { clearAll } from '~/assets/common/cookie';

class PrimaryHeader extends React.Component {
	constructor(props) {
        super(props);
    }
    
    state = {
        isLoginPage : false
    };

    static getDerivedStateFromProps(){
        const pathname = location.pathname;
        return {
            isLoginPage : pathname === '/login',
            isGuidePage : pathname.indexOf('/guide') > -1,
            isWelcomPage : pathname.indexOf('/welcome') >-1
        };
    }

    downloadPage = () =>{
        this.props.history.push('/app');
    }

    logout = async ()=>{
        let response = await common.fetchApi({ opcode: 'ACCOUNT_LOGOUT' });

        // 删除cookie
        clearAll();

        let { errcode, message } = response;
        if(errcode == 0){
            this.props.history.push('/login');
            return;
        }
    }

	render() {
        const {match} = this.props;
        const logined = this.props.logined, { isLoginPage, isGuidePage,isWelcomPage } = this.state;
		return (
			<div className="header">
				<SubLayout>
					<ul>
						<li>
                            {
                                isLoginPage ? "" :
                                <div className="ui-ib logo">
                                    <Icon type="logo" size={40} color="#fff" />
                                </div>
                            }
                            {
                                isWelcomPage ? "" :
                                <span className="ui-ib slogan">SUNMI W1</span>
                            }	
						</li>
						{
                            logined && !isLoginPage && !isGuidePage && !isWelcomPage ? [
                                <nav key="1" className="menu">
                                    <NavLink to={match.path + "home"} activeClassName="active">
                                        <Icon type="netstat"></Icon> 网络状态
                                    </NavLink>
                                    <NavLink to={match.path + "settings"} activeClassName="active">
                                        <Icon type="set"></Icon> 基础设置
                                    </NavLink>
                                    <NavLink to={match.path + "advance"} activeClassName="active">
                                        <Icon type="advancedsetup"></Icon> 高级设置
                                    </NavLink>
                                </nav>,
                                <li key="2" className="sidebar">
                                    <a href="javascript:"  onClick={this.downloadPage} className="ui-ib">下载手机版</a>
                                    <span className="ui-ib">|</span>
                                    <a href="javascript:;" onClick={this.logout} className="ui-ib">退出管理</a>
                                </li>
                            ] : ''
                        }
					</ul>
				</SubLayout>
			</div>
		);
	}

};


export default withRouter(PrimaryHeader);



