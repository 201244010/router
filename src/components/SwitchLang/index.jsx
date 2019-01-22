import React from 'react';
import { Button } from 'antd';
import { getLang, setLang } from '~/i18n/index.js';

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
        console.log('className',className);
        const { lang } = this.state;
        let language = 'zh-cn' === lang ? 'English' : '简体中文';

        return (
            <React.Fragment>
                <Button className={className} onClick={this.changeLang} ghost>{language}</Button>  
            </React.Fragment>   
        );
    }  
}