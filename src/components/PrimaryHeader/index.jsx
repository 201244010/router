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
        let resp = await common.fetchApi({ opcode: 'ACCOUNT_LOGOUT' });

        // 删除cookie
        clearAll();
        this.props.history.push('/login');
    }

	render() {
        const {match} = this.props;
        const { isGuidePage } = this.state;
		return (
			<div className="header">
				<SubLayout>
					<ul>
						<li>
                            <div className="ui-ib logo">
                                <Icon type="logo" size={40} color="#fff" />
                            </div>
						</li>
						{
                            !isGuidePage ? [
                                <nav key="1" className="menu">
                                    <Icon type="netstat"></Icon>
                                    <NavLink to={match.path + "home"} activeClassName="active">网络状态</NavLink>
                                    <Icon type="set"></Icon>
                                    <NavLink to={match.path + "settings"} activeClassName="active">基础设置</NavLink>
                                    <Icon type="advancedsetup"></Icon>
                                    <NavLink to={match.path + "advance"} activeClassName="active">高级设置</NavLink>
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



