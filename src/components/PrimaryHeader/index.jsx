import React from 'react';
import Icon from '~/components/Icon';
import './header.scss';
import SubLayout from "../SubLayout";
import { withRouter } from "react-router-dom";

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
            isGuidePage : pathname.indexOf('/guide') > -1
        };
    }

    logout = async ()=>{
        let response = await common.fetchWithCode(
            'ACCOUNT_LOGOUT', 
            { method : 'POST' }
        );
        let { errcode, message } = response;
        if(errcode == 0){
            this.props.history.push('/login');
            return;
        }
        Modal.error({ title : '退出失败', content :  message });
    }

	render() {
        const logined = this.props.logined, { isLoginPage, isGuidePage } = this.state;
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
							<span className="ui-ib slogan">SUNMI W1</span>
						</li>
						{
                            logined && !isLoginPage && !isGuidePage ? [
                                <li key="1" className="menu">
                                    <a href="javascript:;" className="ui-ib now">
                                        <Icon type="netstat"></Icon> 网络状态
                                    </a>
                                    <a href="javascript:;" className="ui-ib">
                                        <Icon type="set"></Icon> 基础设置
                                    </a>
                                    <a href="javascript:;" className="ui-ib">
                                        <Icon type="advancedsetup"></Icon> 高级设置
                                    </a>
                                </li>,
                                <li key="2" className="sidebar">
                                    <a href="javascript:;" className="ui-ib">下载手机版</a>
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



