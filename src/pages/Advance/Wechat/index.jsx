
import React from 'react';
import classnames from 'classnames';
import { Switch, Route } from "react-router-dom";
import Icon from '~/components/Icon';

import Guide from './Guide';
import Status from './Status';

import './wechat.scss';

export default function Wechat(props) {
    const { match } = props;
    return (
        <Switch>
            <Route path={`${match.path}`} component={Redirect} exact />
            <Route path={`${match.path}/setup`} component={Guide} />
            <Route path={`${match.path}/status`} component={Status} />
        </Switch>
    );
}

class Redirect extends React.Component {
    constructor(props) {
        super(props);
    }

    fetchConf = async () => {
        let redirect = 'status';
        const path = this.props.match.path;

        let resp = await common.fetchApi({ opcode: 'AUTH_WEIXIN_CONFIG_GET' });
        let { errcode, data } = resp;
        if (0 == errcode) {
            let initial = data[0].result.weixin.initial;
            if ('1' == initial) {
                redirect = 'setup';
            }
        }

        this.props.history.push(`${path}/${redirect}`);
    }

    componentDidMount() {
        this.fetchConf();
    }

    componentWillUnmount() {
        sessionStorage.clear();
        console.log(sessionStorage.getItem('weixin.welcome'));
    }
    render() {
        return (
            <React.Fragment></React.Fragment>
        );
    }
}
