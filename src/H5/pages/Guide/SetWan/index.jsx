import React from 'react';
import toast from 'h5/components/toast';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Select from 'h5/components/Select';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/confirm';
import { detect } from './wan';
import Icon from 'h5/components/Icon';

import './h5setwan.scss';

const MODULE = 'h5setwan';

export default class SetWan extends React.Component {
    constructor(props) {
        super(props);
        this.options = [
            { value: 'dhcp', label: intl.get(MODULE, 0)/*_i18n:自动获取IP（DHCP）*/ },
            { value: 'pppoe', label: intl.get(MODULE, 1)/*_i18n:宽带拨号上网（PPPoE）*/ },
            { value: 'static', label: intl.get(MODULE, 2)/*_i18n:手动输入IP（静态IP）*/ },
        ]
    }

    state = {
        wanType: 'dhcp',
        checkType: true,
        loading: false,
        visible: false,
        content: intl.get(MODULE, 3)/*_i18n:正在联网，请稍候...*/,
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

    defaultSet = () => {
        this.props.history.push('/guide/setwan/dhcp');
    }

    setDHCP = async() => {
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
            toast({tip: intl.get(MODULE, 4, {error: errcode})/*_i18n:参数非法[{error}]*/});
            return;
        }

        // 检测是否能联网
        this.setState({
            visible: true,
        });

        let online = await detect(this.props);
        this.setState({
            visible: false,
        });

        if(!online) {   // 不能上网，提示用户
            confirm({
                title: intl.get(MODULE, 6)/*_i18n:无法连接网络*/,
                content: intl.get(MODULE, 7)/*_i18n:检查您的上网方式是否正确*/,
                cancelText: intl.get(MODULE, 8)/*_i18n:继续设置*/,
                okText: intl.get(MODULE, 9)/*_i18n:重新设置*/,
                onCancel: this.setWifi
            });
        } else {    // 可以上网，跳到下一步
            this.setWifi();
        }
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
            this.setDHCP();
        }
    };

    dialDetect = async () => {
        this.setState({
            checkType: true,
            content: intl.get(MODULE, 10)/*_i18n:正在检测上网方式，请稍候...*/,
        });

        let resp = await common.fetchApi({ opcode: 'WANWIDGET_WAN_LINKSTATE_GET' });
        if (0 !== resp.errcode) {    // 未知错误，直接跳转到DHCP
            this.setState({checkType: false});
            this.props.history.push('/guide/setwan/dhcp');
            return;
        }

        const linkstate = resp.data[0].result.wan_linkstate.linkstate;
        if (!linkstate) {   // 没插网线，提示用户
            confirm({
                title: intl.get(MODULE, 11)/*_i18n:无法连接网络*/,
                content: intl.get(MODULE, 12)/*_i18n:请检查您的网线是否插好*/,
                cancelText: intl.get(MODULE, 13)/*_i18n:继续设置*/,
                okText: intl.get(MODULE, 14)/*_i18n:重新检测*/,
                onCancel: this.defaultSet,
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

        const { errcode, data } = response;
        if (0 !== errcode) {    // 未知错误，直接跳转到DHCP
            this.setState({checkType: false});
            this.props.history.push('/guide/setwan/dhcp');
            return;
        }

        // 根据检测结果显示对应方式
        let { dial_type } = data[0].result.dialdetect;
        dial_type = dial_type === 'none' ? 'dhcp' : dial_type;

        if ('dhcp' === dial_type) {
            this.setState({content: '自动获取IP...'});
            this.setDHCP();
        } else {
            this.setState({checkType: false});
            this.props.history.push('/guide/setwan/' + dial_type);
        }   
    }

    componentDidMount() {
        if ('detect' === this.state.wanType) {  // 检测上网方式
            this.dialDetect();
        }
    }

    render() {
        const { wanType, checkType, loading, visible, content } = this.state;

        return (
            <div>
                <GuideHeader title={intl.get(MODULE, 15)/*_i18n:确认上网方式*/} tips={intl.get(MODULE, 16)/*_i18n:请选择正确的上网方式*/} />
                <Loading visible={visible} content='正在联网...' />
                {checkType?
                    !visible&&<div className='h5setwan-icon'>
                        <div className='icon'>
                            <i className='img spin'></i>
                        </div>
                        <p className='content'>{content}</p>
                    </div>
                    :
                    <form style={{marginTop:'0.6267rem'}}>
                        <Select options={this.options} value={wanType} onChange={this.onTypeChange} />
                        <Button type='primary' loading={loading} onClick={this.nextStep}>{intl.get(MODULE, 17)/*_i18n:下一步*/}</Button>
                    </form>
                }
                
            </div>
        );
    }
}
