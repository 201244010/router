import React from 'react';
import Icon from '~/components/Icon';
import './header.scss';
import SubLayout from "../SubLayout";
import { withRouter, NavLink } from "react-router-dom";
import { get, clear } from '~/assets/common/auth';
import { getLang, setLang } from '~/i18n/index.js';

const MODULE = 'primaryheader';

class PrimaryHeader extends React.Component {
	constructor(props) {
        super(props);
    }

    state = {
        isGuidePage: false,
        lang: getLang(),
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

    changeLang = () => {
        let  language = 'zh-cn' === this.state.lang ? 'en-us' : 'zh-cn';
        console.log('language',language);
        setLang(language);
        this.setState({
            lang: language,
        })
    }

	render() {
        const {match} = this.props;
        const { isGuidePage, lang } = this.state;
        console.log('lang',lang);
        let language = 'zh-cn' === lang ? 'English' : '简体中文';
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
                                    <NavLink to={match.path + "home"} activeClassName="active">{intl.get(MODULE, 0)}</NavLink>
                                    <Icon type="set"></Icon>
                                    <NavLink to={match.path + "settings"} activeClassName="active">{intl.get(MODULE, 1)}</NavLink>
                                    <Icon type="advancedsetup"></Icon>
                                    <NavLink to={match.path + "advance"} activeClassName="active">{intl.get(MODULE, 2)}</NavLink>
                                </nav>,
                                <li key="2" className="sidebar">
                                    <a href="javascript:" onClick={this.changeLang} className="ui-ib">{language}</a>
                                    <span className="ui-ib">|</span>
                                    <a href="javascript:"  onClick={this.downloadPage} className="ui-ib">{intl.get(MODULE, 3)}</a>
                                    <span className="ui-ib">|</span>
                                    <a href="javascript:;" onClick={this.logout} className="ui-ib">{intl.get(MODULE, 4)}</a>
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



