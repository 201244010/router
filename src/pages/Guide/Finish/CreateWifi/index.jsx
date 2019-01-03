import React from 'react';
import { Icon } from 'antd';
import CustomIcon from '~/components/Icon';

import './createWifi.scss';

export default class CreateWifi extends React.Component {
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
        this.props.history.push("/guide/finish/userexperience");
    }

    componentDidMount(){
        const val = window.sessionStorage.getItem('guide.setwifi');
        const { hostWifiName,  hostWifiPsw, guestWifiName, guestWifiPsw } = JSON.parse(val);

        this.setState({
            hostWifiName: hostWifiName,
            hostWifiPsw: hostWifiPsw,
            guestWifiName: guestWifiName,
            guestWifiPsw: guestWifiPsw,
        })
        let timeout = 10;
        // let timeout = time;

        // function refreshCount(){
            
        //     console.log(timeout);
        //     if (timeout < 0) {   //倒计时小于时，去掉定时器
        //         window.clearInterval(count);
        //         this.getWireless();
        //         return;
        //     }
        //     timeout = timeout - 1;
        //     this.setState({
        //         time: timeout,
        //     });
        // }

        let count = window.setInterval(() => {
            this.setState({ time: timeout});
            timeout = timeout - 1;
            console.log(timeout);
            if(timeout < 0){   
                window.clearInterval(count);
                this.getWireless();
            } 
        }, 1000);
        
        // if (0 > timeout) {
        //     window.clearInterval(count);
            
        //     
        // }    
    }
    render() {
        const { time, hostWifiName,  hostWifiPsw, guestWifiName, guestWifiPsw } = this.state;

        return (
            <div className='create-wifi'>
                <div className='head'>
                    { (time - 1) > -1?
                    [<Icon type='loading' style={{fontSize: 32, color: '#FB8632'}} spin></Icon>,<p>正在为您创建Wi-Fi，请稍候({time}s)...</p>]
                    // [<CustomIcon type='correct' color='#FB8632' size={32}></CustomIcon>,<p>正在为您创建Wi-Fi，请稍候({time}s)...</p>]
                    :
                    [<CustomIcon type='correct' color='#FB8632' size={32}></CustomIcon>,<p>由于Wi-Fi配置变更，请重新连接“{hostWifiName}”，体验更多功能</p>]
                    }  
                </div>
                {/* <div className='head'>
                    <CustomIcon type='correct' color='#FB8632' size={32}></CustomIcon><p>正在为您创建Wi-Fi，请稍候(10s)...</p>
                </div> */}
                <ul className='body'>
                    <li>
                        <div className='title'> 
                            <CustomIcon size={24} color='#FB8632' type="business"></CustomIcon>
                            <label>商户Wi-Fi</label>
                        </div>
                        <p>名称：{hostWifiName}</p>
                        <p>{'' === hostWifiPsw ? '无密码' : `密码：${hostWifiPsw}`}</p>
                    </li>
                    <li>
                        <div className='title'>
                            <CustomIcon size={24} color='#4EC53F' type="customer"></CustomIcon>
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