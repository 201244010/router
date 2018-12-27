
import React from 'react';
import classnames from 'classnames';
import { Switch, Route, Redirect } from "react-router-dom";
import Icon from '~/components/Icon';

import Guide from './Guide';
import Status from './Status';

import './wechat.scss';

export default class Wechat extends React.Component {
    constructor(props) {
        super(props);
    }

    async fetchConf() {
        let resp = await common.fetchApi({ opcode: 'AUTH_WEIXIN_CONFIG_GET' });
        let { errcode, data } = resp;
        if (0 == errcode) {
            let enable = data[0].result.weixin.enable;
            if ('1' == enable) {
                const { match } = this.props;
                this.props.history.push(`${match.path}/status`);
            } else {
                this.props.history.push(`${match.path}/guide`);
            }
        }
    }

    componentDidMount() {
        //this.fetchConf();
    }

    render() {
        const { match } = this.props;
        return (
            <Switch>
                <Route path={`${match.path}/setup`} component={Guide} />
                <Route path={`${match.path}/status`} component={Status} />
                <Redirect from={match.path} to={`${match.path}/status`}></Redirect>
            </Switch>
        );
    }

}
