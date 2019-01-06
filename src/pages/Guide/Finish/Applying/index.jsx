import React from 'react';
import CustomIcon from '~/components/Icon';

import './applying.scss';

export default class Applying extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        time: 10,
        hostWifiName: '',
        hostWifiPsw: '',
        guestWifiName: '',
        guestWifiPsw: ''
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
        );
        this.props.history.push("/guide/finish/success");
    }

    componentDidMount() {
        const params = this.props.match.params;
        const data = JSON.parse(decodeURIComponent(params.param));
        const { hostWifiName,  hostWifiPsw, guestWifiName, guestWifiPsw } = data;

        this.setState({
            hostWifiName: hostWifiName,
            hostWifiPsw: hostWifiPsw,
            guestWifiName: guestWifiName,
            guestWifiPsw: guestWifiPsw,
        });

        let timeout = 10;
        let count = window.setInterval(() => {
            this.setState({ time: timeout});
            timeout = timeout - 1;

            if(timeout < -1){
                window.clearInterval(count);
                this.getWireless();
            } 
        }, 1000);
    }

    render() {
        const { time, hostWifiName,  hostWifiPsw, guestWifiName, guestWifiPsw } = this.state;

        return (
            <div className='create-wifi'>
                <div className='head'>
                    { time >= 0 ?
                    [<CustomIcon type='loading' color='#FB8632' size={32} spin />,<p>正在为您创建Wi-Fi，请稍候({time}s)...</p>]
                    :
                    [<CustomIcon type='correct' color='#FB8632' size={32} />,<p>由于Wi-Fi配置变更，请重新连接“{hostWifiName}”，体验更多功能</p>]
                    }  
                </div>
                <ul className='body'>
                    <li>
                        <div className='title'> 
                            <CustomIcon size={24} color='#FB8632' type="business" />
                            <label>商户Wi-Fi</label>
                        </div>
                        <p>名称：{hostWifiName}</p>
                        <p>{'' === hostWifiPsw ? '无密码' : `密码：${hostWifiPsw}`}</p>
                    </li>
                    <li>
                        <div className='title'>
                            <CustomIcon size={24} color='#4EC53F' type="customer" />
                            <label>客用Wi-Fi</label>
                        </div>
                        <p>名称：{guestWifiName}</p>
                        <p>{'' === guestWifiPsw ? '无密码' : `密码：${guestWifiPsw}`}</p>
                    </li>
                </ul>
            </div>
        );
    }
}