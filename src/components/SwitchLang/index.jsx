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
        let language = SUPPORT_LANG.find(item => {
            return show === item.key;
        }).label;

        return (
            <Button className={className} onClick={this.changeLang} ghost>{language}</Button>   
        );
    }  
}