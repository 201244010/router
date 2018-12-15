import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Select from 'h5/components/Select';

const options = [
    { value: 'dhcp', label: '自动获取IP（DHCP）' },
    { value: 'pppoe', label: '宽带拨号上网（PPPoE）' },
    { value: 'static', label: '手动输入IP（静态IP）' },
];

export default class SetWifi extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        wanType: 'pppoe',
        loading: true,
    }

    onTypeChange = (value) => {
        console.log('changed: ', value);
        this.setState({
            wanType: value
        });
    }

    nextStep = () => {
        this.props.history.push('/home');
    };

    render() {
        const { loading, wanType } = this.state;

        return (
            <div>
                <GuideHeader title='设置商户Wi-Fi' tips='这是说明文字这是说明文字这是说明文字' />
                <Select options={options} value={wanType} onChange={this.onTypeChange} />
                <div><Button type='primary' loading={loading} onClick={this.nextStep}>下一步</Button></div>
            </div>
        )
    }
}