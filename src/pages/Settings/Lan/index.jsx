
import React from 'react';
import LanSet from './LanSet';
import StaticBind from './StaticBind';
import SubLayout from '~/components/SubLayout';

import './lan.scss';

const MODULE = 'lan';

export default class Lan extends React.Component {
    render(){
        return (
            <SubLayout className="settings">
                    <LanSet />
                    <StaticBind />
            </SubLayout>
        );
    }
};







