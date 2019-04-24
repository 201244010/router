import { Modal } from 'antd';
import CustomIcon from '~/components/Icon';
import { withRouter } from "react-router-dom";
import React from "react";
import Upgrade from './Upgrade';

const MODULE = 'upgradedetect';

const UPGRADE_SHOW = 'UPGRADE_SHOW';

class UpdateDetect extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        update: false,
        releaseLog: '',
    }

    static getDerivedStateFromProps() {
        const path = location.pathname;
        const guide = ['/welcome', '/guide'].some(url => {
            return path.indexOf(url) > -1;
        });

        return { guide };
    }

    cancle = () => {
        this.setState({
            update: false
        }, () => {
            try {
                window.sessionStorage.setItem(UPGRADE_SHOW, '0');
            } catch (e) { };
        });
    }

    post = () => {
        this.setState({
            update: false
        });
        this.props.history.push('/upgrade');
    }

    componentDidMount() {
        let show;
        try {
            show = ('0' !== window.sessionStorage.getItem(UPGRADE_SHOW));
        } catch (e) {
            show = true;
        };

        if (show && !this.state.guide) {
            this.getInfo();
        }
    }

    getInfo = async () => {
        let response = await common.fetchApi(
            [
                {opcode: 'MESH_FIRMWARE_GET'},
                {opcode: 'ROUTE_GET'},
            ]
        );

        // 防止 Default组件重定向到 guide 显示升级弹窗提示
        if (this.state.guide) {
            return;
        }
        console.log(response);
        let { data, errcode } = response;
        if (0 === errcode) {
            let devId = '';
            data[1].result.sonconnect.devices.map(item => {
                if (item.role === '1') {
                    devId = item.devid;
                }
            });

            let version = '', releaseLog = '';
            data[0].result.upgrade.map(item => {
                if (item.devid === devId) {
                    version = item.current_version;
                    releaseLog = item.release_log
                }
            })

            this.setState({
                update: version !== '',
                releaseLog: releaseLog,
            });
        }
    }

    render() {
        let { update, releaseLog } = this.state;
        let Title = [
            <span style={{ fontSize: 14, color: '#333C4F' }}><CustomIcon style={{ marginRight: 5 }} color="#333C4F" type="hint" size={14} />{intl.get(MODULE, 0)/*_i18n:软件升级提醒*/}</span>
        ];
        return (
            <div>
                <Modal visible={update} maskClosable={false} title={Title} centered={true} closable={false} okText={intl.get(MODULE, 1)/*_i18n:立即升级*/} cancelText={intl.get(MODULE, 2)/*_i18n:暂不升级*/} onCancel={this.cancle} onOk={this.post}>
                    <pre style={{ color: '#333C4F' }}>{releaseLog}</pre>
                </Modal>
                <Upgrade ref='Upgrade' />
            </div>
        )
    }
}

export default withRouter(UpdateDetect);