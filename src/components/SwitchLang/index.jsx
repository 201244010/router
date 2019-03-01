import React from 'react';
import { Button } from 'antd';
import { getLang, setLang } from '~/i18n/index.js';
import {LANGUAGE_LIST} from '~/assets/common/constants';

export default class SwitchLang extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        lang: getLang()
    }

    getVersion = () => {
        let QUICK_SETUP = JSON.parse(window.sessionStorage.getItem('QUICK_SETUP'));     //获取版本信息

        if (3 === QUICK_SETUP.length) {             //根据快速设置的步骤数，判断是国内版还是海外版
            return "domestic";
        }

        if (4 === QUICK_SETUP.length) {
            return "abroad";
        }
    }

    changeLang = () => {
        let language = 'zh-cn' === this.state.lang ? 'en-us' : 'zh-cn';
        let language_param = 'zh-cn' === this.state.lang ? 'en-US' : 'zh-CN';

        common.fetchApi({
            opcode: 'LANGUAGE_SET',
            data: {
                "language": language_param
            }
         }).then(res => {
             setLang(language);
             this.setState({
                 lang: language,
             })
        });
    }

    render() {
        const { className } = this.props;
        const { lang } = this.state;
        let show = 'zh-cn' === lang ? 'en-us' : 'zh-cn';
        const SUPPORT_LANG = JSON.parse(window.sessionStorage.getItem('_LANGUAGE_LIST')) || LANGUAGE_LIST;
        const version = this.getVersion();       //获取路由器版本（国内版还是海外版）

        if ('domestic' === version) {       //判断版本（国内版还是海外版）
            return '';
        }

        if ('abroad' === version) {
            let language = SUPPORT_LANG.find(item => {
                return show === item.key;
            }).label;

            return (
                <Button className={className} onClick={this.changeLang} ghost>{language}</Button>
            );
        }
    }  
}