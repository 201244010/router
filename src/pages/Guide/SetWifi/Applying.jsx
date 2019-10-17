import React from 'react';
import CustomIcon from '~/components/Icon';

const MODULE = 'applying';

export default class Applying extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        time: 10,
        hostWifiName: '',
        hostWifiPsw: '',
        guestWifiName: '',
        guestWifiPsw: '',
        setTip: false,
    }
    
    getWireless = async()=>{
        await common.fetchApi(
            [{
                opcode: 'WIRELESS_GET',
            }], 
            {},
            {
                loop: true,
                interval: 1000,
                stop: resp => {resp !== 0},
            }
        )
        this.props.history.push("/guide/success");
    }

    componentDidMount() {
        const params = this.props.match.params;
        const data = JSON.parse(decodeURIComponent(params.param));
        const { hostWifiName,  hostWifiPsw, guestWifiName, guestWifiPsw, setTip } = data;

        this.setState({
            hostWifiName: hostWifiName,
            hostWifiPsw: hostWifiPsw,
            guestWifiName: guestWifiName,
            guestWifiPsw: guestWifiPsw,
            setTip: setTip,
        });

        let timeout = 10;
        let count = window.setInterval(() => {
            if (timeout <= 0) {
                this.getWireless();
                window.clearInterval(count);
			}
            this.setState({ time: timeout--});			
        }, 1000);
    }

    render() {
        const { time, hostWifiName,  hostWifiPsw, guestWifiName, guestWifiPsw, setTip } = this.state;
        const list = [
            {
                className: 'list-icon-business',
                type: 'business',
                label: intl.get(MODULE, 3)/*_i18n:商户Wi-Fi*/,
                wifiName: intl.get(MODULE, 4, {hostWifiName})/*_i18n:名称：{hostWifiName}*/,
                password: '' === hostWifiPsw ? intl.get(MODULE, 5)/*_i18n:无密码*/ : intl.get(MODULE, 6, {hostWifiPsw})/*_i18n:密码：{hostWifiPsw}*/,
                exist: true,
            },
            {
                className: 'list-icon-customer',
                type: 'customer',
                label: intl.get(MODULE, 7)/*_i18n:客用Wi-Fi*/,
                wifiName: intl.get(MODULE, 8, {guestWifiName})/*_i18n:名称：{guestWifiName}*/,
                password: '' === guestWifiPsw ? intl.get(MODULE, 9)/*_i18n:无密码*/ : intl.get(MODULE, 10, {guestWifiPsw})/*_i18n:密码：{guestWifiPsw}*/,
                exist: setTip,
            }
        ];

        return (
            <div className='create-wifi'>
                <div className='head'>
                    { time >= 1 ?
                    [<CustomIcon className='head-icon-loading' type='loading' size={32} spin />,<p>{intl.get(MODULE, 0,{time})/*_i18n:正在为您创建Wi-Fi，请稍候({time}s)...*/}</p>]
                    :
                    [<CustomIcon className='head-icon-hint' type='hint' size={32} />,<p>{intl.get(MODULE, 1, {hostWifiName})/*_i18n:由于Wi-Fi配置变更，请重新连接'{hostWifiName}',体验更多功能*/}</p>]
                    }
                </div>
                <ul className='body'>
                    {
                        list.map(item => (item.exist&&[
                            <li className='line'>
                                <span className='line-style'></span>
                            </li>,
                            <li className='item'>
                                <div className='title'>
                                    <CustomIcon size={24} className={item.className} type={item.type} />
                                    <label>{item.label}</label>
                                </div>
                                <p>{item.wifiName}</p>
                                <p>{item.password}</p>
                            </li>]
                        ))
                    }
                </ul>
            </div>
        );
    }
}