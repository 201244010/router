import React from 'react';
import { message } from 'antd';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Select from 'h5/components/Select';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/Confirm';
import { detect } from './wan';
import Icon from 'h5/components/Icon';

const options = [
    { value: 'dhcp', label: '自动获取IP（DHCP）' },
    { value: 'pppoe', label: '宽带拨号上网（PPPoE）' },
    { value: 'static', label: '手动输入IP（静态IP）' },
];

export default class SetWan extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        wanType: 'dhcp',
        loading: false,
        visible: false,
        content: '正在联网，请稍候...',
    }

    static getDerivedStateFromProps(props, prevState) {
        const DETECT = 'detect';
        const type = props.match.params.type;

        return {
            wanType: type,
        };
    }

    onTypeChange = (type) => {
        this.props.history.push('/guide/setwan/' + type);
    }

    setWifi = () => {
        this.props.history.push('/guide/setwifi');
    }

    nextStep = async () => {   
        const wanType = this.state.wanType;

        // PPPoE/静态IP，跳转到对应页面
        if ('pppoe' === wanType || 'static' === wanType) {
            this.props.history.push('/guide/' + wanType);
            return;
        }

        // DHCP方式，直接保存数据
        if ('dhcp' === wanType) {
            this.setState({
                loading: true,
            });
            let response = await common.fetchApi(
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
            this.setState({
                loading: false,
            });

            let { errcode } = response;
            if (0 !== errcode) {
                message.error(`参数非法[${errcode}]`);
                return;
            }

            // 检测是否能联网
            this.setState({
                loading: false,
                visible: true,
                content: '正在联网，请稍候...'
            });

            let online = await detect(this.props);
            this.setState({
                visible: false,
            });

            if(!online) {   // 不能上网，提示用户
                confirm({
                    title: '无法连接网络',
                    content: '检查您的上网方式是否正确',
                    cancelText: '继续设置',
                    okText: '重新设置',
                    onCancel: this.setWifi
                });
            } else {    // 可以上网，跳到下一步
                this.setWifi();
            }
        }
    };

    dialDetect = async () => {
        this.setState({
            visible: true,
            content: '正在检测上网方式，请稍候...',
        });

        let resp = await common.fetchApi({ opcode: 'WANWIDGET_WAN_LINKSTATE_GET' });
        if (0 !== resp.errcode) {    // 未知错误，直接跳转到DHCP
            this.setState({
                visible: false,
            });
            this.props.history.push('/guide/setwan/dhcp');
            return;
        }

        const linkstate = resp.data[0].result.wan_linkstate.linkstate;
        if (!linkstate) {   // 没插网线，提示用户
            this.setState({
                visible: false,
            });

            confirm({
                title: '无法连接网络',
                content: '请检查您的网线是否插好',
                cancelText: '继续设置',
                okText: '重新检测',
                onCancel: this.nextStep,
                onOk: this.dialDetect,
            });
            return;
        }

        // 网线已连接，检测上网方式
        await common.fetchApi({ opcode: 'WANWIDGET_DIALDETECT_START' });
        let response = await common.fetchApi(
            {
                opcode: 'WANWIDGET_DIALDETECT_GET'
            },
            {},
            {
                loop : true,
                interval : 2000,
                pending : res => res.data[0].result.dialdetect.status === 'detecting',
                stop : () => this.stop
            }
        );
        this.setState({
            visible: false,
        });

        const { errcode, data } = response;
        if (0 !== errcode) {    // 未知错误，直接跳转到DHCP
            this.props.history.push('/guide/setwan/dhcp');
            return;
        }

        // 根据检测结果显示对应方式
        let { dial_type } = data[0].result.dialdetect;
        dial_type = dial_type === 'none' ? 'dhcp' : dial_type;
        this.props.history.push('/guide/setwan/' + dial_type);
    }

    componentDidMount() {
        if ('detect' === this.state.wanType) {  // 检测上网方式
            this.dialDetect();
        }
    }

    render() {
        const { wanType, loading, visible, content } = this.state;

        return (
            <div>
                <GuideHeader title='确认上网方式' tips='请选择正确的上网方式' />
                <Loading visible={visible} content={content} />
                <form style={{marginTop:'0.6267rem'}}>
                    <Select options={options} value={wanType} onChange={this.onTypeChange} />
                    <Button type='primary' loading={loading} onClick={this.nextStep}>下一步</Button>
                </form>
            </div>
        );
    }
}
