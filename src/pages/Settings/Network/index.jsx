import React from 'react';
import NetworkTemple from '~/components/NetworkTemple';
import SubLayout from '~/components/SubLayout';
import Form from "~/components/Form";

import './network.scss';
export default class Network extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			refreshInfo: {},
		}
    }
    
    refreshWanIno = async() => {
        const response = await common.fetchApi(
            { opcode : 'NETWORK_MULTI_WAN_GET'}
        );
        const { data, errcode } = response;
        if(errcode === 0) {
			const { wans } = data[0].result;
			const refreshInfos = wans.map(item => {
				return {
					dial_type: item.dial_type,
					...item.info,
				}
			});

			this.setState({
				refreshInfo: refreshInfos[0],
			});
        }
    }

    componentDidMount() {
		this.refreshWanInfo = setInterval(this.refreshWanIno, 3000);
    }

    componentWillUnmount(){
        clearInterval(this.refreshWanInfo);
    }

    render() {
        const { refreshInfo } = this.state;

        return <SubLayout className="settings">
            <Form className="network-settings">
                <NetworkTemple
                    port={1}
                    refreshInfo={refreshInfo}
                />
            </Form>
        </SubLayout>;
    }
};
