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
        visible: true,
        content: '正在检测上网方式，请稍后...' // | '正在联网，请稍后...'
    }

    onTypeChange = (value) => {
        this.setState({
            wanType: value
        });
    }

    onCancel = () => {
        this.props.history.push('/guide/setwifi');
    }

    nextStep = async () => {   
        const wanType = this.state.wanType;
        this.setState({
            loading: true
        });
        if ('dhcp' === wanType) {
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
            let { errcode } = response;
            if(0 === errcode) {
                this.setState({
                    loading: false,
                    visible: true,
                    content: '正在联网，请稍后...'
                });
                let online = await detect(this.props);
                if(false === online) {
                    this.setState({
                        visible: false
                    });
                    // 实力代码：confirm
                    confirm({
                        title: '无法连接网络',
                        content: '检查您的上网方式是否正确',
                        cancelText: '继续设置',
                        okText: '重新设置',
                        onCancel: this.onCancel
                    });
                }
                return;
            }
            this.setState({loading: false});
            message.error(`参数不合法[${errcode}]`);
        }
        this.props.history.push('/guide/setwan/' + wanType);
    };

    dialDetect = async () => {
        this.setState({
            visible: true
        });
        let resp = await common.fetchApi(
            {
                opcode: 'WANWIDGET_WAN_LINKSTATE_GET'
            },
        );
        const { errcode,data } = resp;
        if(errcode == 0){
            if(data[0].result.wan_linkstate.linkstate){
                await common.fetchApi(
                    {
                        opcode: 'WANWIDGET_DIALDETECT_START'
                    },
                );
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
                if(0 === errcode){
                    let { dial_type } = data[0].result.dialdetect;
                    dial_type = dial_type === 'none' ? 'dhcp' : dial_type;
                    this.setState({
                        wanType:  dial_type,
                        visible: false
                    });
                    return;
                }else{
                    this.setState({
                        visible: false
                    });
                    confirm({
                        title: '无法连接网络',
                        content: '请检查您的网线是否插好',
                        cancelText: '继续设置',
                        okText: '重新检测',
                        onOk: this.reDetect
                    });
                }
            }else{
                this.setState({
                    visible: false
                });
                confirm({
                    title: '无法连接网络',
                    content: '请检查您的网线是否插好',
                    cancelText: '继续设置',
                    okText: '重新检测',
                    onOk: this.reDetect,
                });
            }
        }else{
            this.setState({
                visible: false
            });
            message.error('网线插拔方式获取失败');
        }
    }

    reDetect = () =>{
        this.dialDetect();
    }

    componentDidMount() {
        // 检测上网方式
        this.dialDetect();
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
