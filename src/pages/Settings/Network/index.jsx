import React from 'react';
import NetworkTemple from '~/components/NetworkTemple';
import SubLayout from '~/components/SubLayout';
import Form from "~/components/Form";

import './network.scss';
export default class Network extends React.Component {
    render() {
        return <SubLayout className="settings">
            <Form className="network-settings">
                <NetworkTemple
                    opcodeSet='NETWORK_WAN_IPV4_SET'
                    opcodeGet='NETWORK_WAN_IPV4_GET'
                />
            </Form>
        </SubLayout>;
    }
};
