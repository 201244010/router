import React from 'react';
import { Button } from 'antd';
import { getLang, setLang, SUPPORTED_LANG } from '~/i18n/index.js';

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
        let language = SUPPORTED_LANG.find(item => {
            return show === item.key;
        }).label;

        return (
            <Button className={className} onClick={this.changeLang} ghost>{language}</Button>   
        );
    }  
}