import React from 'react';
import {Modal} from 'antd';

export default class PrimaryFooter extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        version : '',
        mac : ''
    }

    fetchFooterInfo = async () => {
        let fetchVersion = await common.fetchWithCode('FIRMWARE_GET',{method : 'POST'});
        let fetchMac = await common.fetchWithCode('NETWORK_WAN_IPV4_GET',{method : 'POST'});

        Promise.all(fetchVersion,fetchMac).then(result => {
            if(result[0].errcode == 0){
                this.setState({
                    version : result[0].data[0].result.upgrade.current_version
                })
            }else{
                Modal.error({title : '版本信息获取失败'});
            }

            if(result[1].errcode == 0){
                this.setState({
                    mac : result[1].data[0].result.wan.info.mac
                })
            }else{
                Modal.error({title : 'MAC地址获取失败'});
            }
        })
    }

    componentDidMount(){
        //this.fetchFooterInfo();
    }

    render() {
        const {version, mac} = this.state;
        return (
            <footer className={this.props.className}>
                <p> <span>系统版本：{version}</span> <span>MAC地址：{mac}</span></p>
                <p>
                    @2016 上海商米科技有限公司
                <a href="https://sunmi.com/" target='_blank'>官网</a>|
                <a href="javascript:;">常见问题</a>|
                    服务热线：400-902-1168
            </p>
            </footer>
        )
    }
}
