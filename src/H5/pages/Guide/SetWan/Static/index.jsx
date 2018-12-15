import React from 'react';
import Form from 'h5/Components/Form';
import Button from 'h5/components/Button';
import GuideHeader from 'h5/components/GuideHeader';

export default class Static extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        ip: '',
        ipTip: '',
        subnetmask: '',
        subnetmaskTip: '',
        gateway: '',
        gatewayTip: '', 
        dns: '',
        dnsTip: '',
        dnsbackup: '',
        dnsbackupTip: ''
    }

    render() {
        const { ip, ipTip, subnetmask, subnetmaskTip, gateway, gatewayTip, dns, dnsTip, dnsbackup,
            dnsbackupTip } = this.state;
        return (
            <div>
                <GuideHeader title='手动输入IP（静态IP）' tips='这是说明文字这是说明文字这是说明文字' />
                <Form 
                    value={ip}
                    onChange={value => this.onChange('ip', value)}
                    tip={ipTip}
                    placeholder='请输入密码'
                    maxLength={15} />
                <Form 
                    value={subnetmask}
                    onChange={value => this.onChange('subnetmask', value)}
                    tip={subnetmaskTip}
                    placeholder='请输入密码'
                    maxLength={15} />
                <Form 
                    value={gateway}
                    onChange={value => this.onChange('gateway', value)}
                    tip={gatewayTip}
                    placeholder='请输入密码'
                    maxLength={15} />
                <Form 
                    value={dns}
                    onChange={value => this.onChange('dns', value)}
                    tip={dnsTip}
                    placeholder='请输入密码'
                    maxLength={15} />
                <Form 
                    value={dnsbackup}
                    onChange={value => this.onChange('dnsbackup', value)}
                    tip={dnsbackupTip}
                    placeholder='请输入密码'
                    maxLength={15} />
                <div style={{ textAlign: "center"}}>
                    <Button type='primary' loading={loading} onClick={this.submit} disabled={disabled}>下一步</Button>
                    <a href='javascript:;' onClick={this.changeType}>切换上网方式</a>
                </div>
            </div>
        );
    }
}