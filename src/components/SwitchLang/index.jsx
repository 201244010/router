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
        let  language = 'zh-cn' === this.state.lang ? 'en-us' : 'zh-cn';

        setLang(language);
        this.setState({
            lang: language,
        })
    }

    render() {
        const { className } = this.props;
        const { lang } = this.state;
        let language = 'zh-cn' === lang ? SUPPORTED_LANG.find(item => {
            return 'en-us' === item.key;
        }).label : SUPPORTED_LANG.find(item => {
            return 'zh-cn' === item.key;
        }).label;

        return (
            <Button className={className} onClick={this.changeLang} ghost>{language}</Button>   
        );
    }  
}