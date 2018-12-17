let detect = async(type, state) => {
    let response;
    switch (type) {
        case 'dhcp':
            response = await common.fetchApi(
                {
                    opcode: 'NETWORK_WAN_IPV4_SET',
                    data:{
                        wan:{
                            dial_type: 'dhcp',
                            dns_type: 'auto',
                        }
                    }
                }   
            );
            break;
        case 'pppoe':
            const { account, pwd } = state;
            response = await common.fetchApi(
                {
                    opcode: 'NETWORK_WAN_IPV4_SET',
                    data:{
                        wan:{
                            dial_type: 'pppoe',
                            dns_type: 'auto',
                            user_info: {
                                username: Base64.encode(account),
                                password: Base64.encode(pwd)
                            }
                        }
                    }
                }   
            );
            break;
        case 'static':
            const { ip, subnetmask, gateway, dns, dnsbackup } = state;
            response = await common.fetchApi(
                {
                    opcode: 'NETWORK_WAN_IPV4_SET',
                    data:{
                        wan:{
                            dial_type: 'static',
                            info: {
                                ipv4 : ip,
                                mask : subnetmask,
                                gateway : gateway,
                                dns1 : dns,
                                dns2 : dnsbackup
                            }
                        }
                    }
                }
            );
            break;
    }
    let { errcode } = response;
    if(0 === errcode) {
        // 触发检测联网状态
        await common.fetchApi(
            {
                opcode: 'WANWIDGET_ONLINETEST_START'
            }
        );
        // 获取联网状态
        let connectStatus = await common.fetchApi(
            {
                opcode: 'WANWIDGET_ONLINETEST_GET'
            },
            {},
            {
                loop : true,
                interval : 3000,
                stop : ()=> this.stop,
                pending : resp => resp.data[0].result.onlinetest.status !== 'ok'
            }
        );
        let { errcode, data } = connectStatus;
        if(0 === errcode) {
            let online = data[0].result.onlinetest.online;
            return online;
        }
        return false;
    }
}

export { detect };