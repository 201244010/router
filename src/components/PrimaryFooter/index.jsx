import React from 'react';
import {Modal} from 'antd';

export default class PrimaryFooter extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    static getDerivedStateFromProps (){
        const logined = document.cookie.length > 0;
        return {logined};
    }

    state = {
        version : '',
        mac : ''
    }

    fetchFooterInfo = async () => {
        await common.fetchApi(
            [
                {opcode : 'FIRMWARE_GET'},
                {opcode :'NETWORK_WAN_IPV4_GET' }
            ]
        ).then(result => {
            if(result.data[0].errcode == 0){
                this.setState({
                    version : result.data[0].result.upgrade.current_version
                })
            }else{
                Modal.error({title : '版本信息获取失败'});
            }

            if(result.data[1].errcode == 0){
                this.setState({
                    mac : result.data[1].result.wan.info.mac
                })
            }else{
                Modal.error({title : 'MAC地址获取失败'});
            }
        })
    }

    componentDidMount(){
        if(this.state.logined === true){
            this.fetchFooterInfo();
        }
    }

    render() {
        const {version, mac, logined} = this.state;
        const visible = logined ? 'visibility' : 'hidden';
        return (
            <footer className={this.props.className}>
                <p style={{visibility : visible}}> <span>系统版本：{version}</span> <span>MAC地址：{mac}</span></p>
                <p>
                    @2016 上海商米科技有限公司
                <a href="https://sunmi.com/" target='_blank'>官网</a>| 服务热线：400-902-1168
            </p>
            </footer>
        )
    }
}
