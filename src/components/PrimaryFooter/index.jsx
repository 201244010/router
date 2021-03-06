import React from 'react';
import { get } from '~/assets/common/auth';

const MODULE = 'primaryfooter';

export default class PrimaryFooter extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    static getDerivedStateFromProps() {
		const logined = !!get();
        return {logined};
    }

    state = {
        logined: false,
        version : '',
        mac : ''
    }

    fetchFooterInfo = async () => {
        await common.fetchApi(
            [
                {opcode : 'FIRMWARE_GET'},
                {opcode :'NETWORK_WAN_IPV4_GET' },
            ]
        ).then(result => {
            let {errcode, data} = result
            if(errcode === 0){
                this.setState({
                    version : data[0].result.upgrade.current_version,
                    mac : data[1].result.wan.info.mac
                })
            }
        })
    }

	componentDidUpdate() {
		this.fetchFooterInfo();
	}

	componentDidMount() {
		const {logined} = this.state;
		logined && this.fetchFooterInfo();
	}

    render() {
		const {version, mac, logined} = this.state;
		const {className} = this.props;
        return (
            <footer className={className}>
				{
					logined && <p> <span>{intl.get(MODULE, 0, {version})/*_i18n:系统版本：{version}*/}</span><span>{intl.get(MODULE, 2, {mac})/*_i18n:MAC地址：{mac}*/}</span></p>
				}
                <p>
                    <span>{intl.get(MODULE, 1)/*_i18n:©2020 上海商米科技有限公司 版权所有*/}</span>|<a href="https://sunmi.com/" target='_blank'>{intl.get(MODULE, 3)/*_i18n:官网*/}</a>{intl.get(MODULE, 5)}<span>{intl.get(MODULE, 4)/*_i18n:服务热线：400-6666-509*/}</span>
                </p>
            </footer>
        )
    }
}
