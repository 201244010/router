import React from 'react';
import NetworkTemple from '~/components/NetworkTemple';

export default class MultipleWan extends React.Component {
    render() {
        return <NetworkTemple
                opcodeSet='NETWORK_WAN_IPV4_SET'
                opcodeGet='NETWORK_WAN_IPV4_GET'
        />;
    }
};
