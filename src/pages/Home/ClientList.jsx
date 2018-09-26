import React from 'react';
import classnames from 'classnames';
import PropTypes from "prop-types";
import { Button, Divider, Popover } from 'antd';

import CustomIcon from '~/components/Icon';

import './clients.scss'

class Item extends React.Component {
    constructor(props) {
        super(props);
    }

    priorityAdd = (mac) => {
        console.log('priority clicked: ' + mac)
    }

    priorityDel = (mac) => {
        console.log('priority delete clicked: ' + mac)
    }

    forbidAdd = (mac) => {
        console.log('forbid clicked: ' + mac)
    }

    render() {
        let client = this.props.client;
        let type = client.type;
        let signal = '强';
        let access = '2.4G';
        let time = '42分钟前';
        let flux = '1024MB';
        let up = '42MB/s';
        let down = '42MB/s';
        let ip = client.ip;
        let mac = client.mac;
        let info = (
            <ul>
                <li><label>信号强度：</label><span>{signal}</span></li><li><label>接入信号：</label><span>{access}</span></li>
                <li><label>接入时间：</label><span>{time}</span></li><li><label>流量消耗：</label><span>{flux}</span></li>
                <li><label>上传速度：</label><span>{up}</span></li><li><label>下载速度：</label><span>{down}</span></li>
                <li><label>IP：</label><span>{ip}</span></li><li><label>MAC：</label><span>{mac}</span></li>
            </ul>
        );

        switch (type) {
            case 'sunmi':
                return (
                <div className='client-info'>
                        <p>{client.name}</p>
                        {info}
                    </div>
                );
            case 'priority':
                return (
                <div className='client-info'>
                    <p>{client.name}</p>
                    {info}
                    <div>
                        <Button onClick={() => this.priorityDel(mac)}>解除优先</Button>
                        <Button onClick={() => this.forbidAdd(mac)}>禁止上网</Button>
                    </div>
                </div>);
            case 'normal':
            default:
                return (
                <div className='client-info'>
                    <p>{client.name}</p>
                    {info}
                    <div>
                        <Button onClick={() => this.priorityAdd(mac)}>优先上网</Button>
                        <Button onClick={() => this.forbidAdd(mac)}>禁止上网</Button>
                    </div>
                </div>);
        }
    }
}

export default function ClientList(props) {
    const clients = props.data;
    const total = clients.length;
    const placement = props.placement || 'top';
    let maxConf = {
        'sunmi': 6,
        'normal': 12,
        'priority': 12
    };
    let deviceTypeMap = {
        'sunmi': '商米设备',
        'normal': '普通设备',
        'priority': '优先设备'
    };
    const deviceType = deviceTypeMap[props.type];
    const max = parseInt(maxConf[props.type], 10);
    const current = (total < max) ? total : max;

    const listItems = clients.map((client, index) => {
        if (index < max) {
            return (
                <li key={client.mac} className='client-item'>
                    <Popover placement={placement} content={<Item client={client} />} trigger='click'>
                        <div className='icon'><CustomIcon type={client.icon} size={24} /></div>
                    </Popover>
                    <div className='dot'></div><p title={client.name}>{client.name}</p>
                </li>
            );
        }
    });

    return (
        <div className={classnames(['list-content', props.type + '-list'])}>
            <div className='list-header'>
                <Divider type="vertical" className='divider' /><span>{deviceType}</span><span className='statistics'>（{current}/{total}）</span>
                <Button className='more'>查看全部</Button>
            </div>
            <ul>{listItems}</ul>
        </div>);
}

ClientList.propTypes = {
    type: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.oneOf(['sunmi', 'normal', 'priority'])
    ]),
    data: PropTypes.array
};
