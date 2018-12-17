import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Select from 'h5/components/Select';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/confirm';
import { detect } from './detect';
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
        wanType: 'pppoe',
        loading: false,
        visible: true,
    }

    onTypeChange = (value) => {
        console.log('changed: ', value);
        this.setState({
            wanType: value
        });
    }

    onOk = () => {
        console.log('onOk');
        this.props.history.push('/guide/setwifi');
    }

    onCancel = () => {
        console.log('onCancel');
        this.setState({
            visible: true,
        }, this.timingClose);
    }

    nextStep = () => {
        this.setState({loading: true});
        const wanType = this.state.wanType;
        if ('dhcp' === wanType) {
            let online = detect ('dhcp', this.state);
            if(online) {
                setTimeout(() => { this.props.history.push("/guide/speed") }, 3000);
            }else {
                this.setState({loading: false});
                // 实力代码：confirm
                confirm({
                    title: '无法连接网络',
                    content: '请检查您的网线是否插好',
                    cancelText: '重新检测',
                    okText: '继续设置',
                    onOk: this.onOk,
                    onCancel: this.onCancel,
                });
            }
        }
        window.location.href = '/guide/setwan/' + wanType;
        //this.props.history.push('/guide/setwifi');
    };

    timingClose = () => {
        // 实力代码：Loading
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, 3000);
    }

    componentDidMount() {
        this.timingClose();
    }

    render() {
        const { wanType, loading, visible } = this.state;

        return (
            <div>
                <GuideHeader title='确认上网方式' tips='这是说明文字这是说明文字这是说明文字' />
                <Loading visible={visible} content='正在检测上网方式，请稍后...' />
                <form style={{marginTop:'0.6267rem'}}>
                    <Select options={options} value={wanType} onChange={this.onTypeChange} />
                    <Button type='primary' loading={loading} onClick={this.nextStep}>下一步</Button>
                </form>
            </div>
        );
    }
}
