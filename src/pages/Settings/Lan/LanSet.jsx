
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { checkIp, checkRange, checkMask, checkSameNet, transIp} from '~/assets/common/check';
import { Button, Modal, message} from 'antd';
import Loading from '~/components/Loading';

const MODULE = 'lanset';

const { FormItem, ErrorTip, InputGroup, Input } = Form;
const error = {
    '-1061' : intl.get(MODULE, 0) ,
    '-1001' : intl.get(MODULE, 1),
};

export default class Lan extends React.Component {
    state = {
        ipv4 : ['', '', '', ''],
        mask : ['', '', '', ''],
        enable: true,
        startip : ['', '', '', ''],
        endip : ['', '', '', ''],
        leasetime : '',
        ipv4Tip : "",
        maskTip :"",
        startipTip :"",
        endipTip :"",
        leasetimeTip :"",
        disabled : false,
        loading : false
    };

    onChange = (val, key) => {
        let tip = '',
            startipTip = '',
            endipTip = '';

        let valid = {
            enable: {
                func: () => {
                    return '';
                },
            },
            ipv4 : {
                func : checkIp,
                args : {who: intl.get(MODULE, 2)},
            },
            mask : {
                func : checkMask,
                args : {who : intl.get(MODULE, 3)},
            },
            startip : {
                func : checkIp,
                args : {who : intl.get(MODULE, 4)},
            },
            endip : {
                func : checkIp,
                args : {who : intl.get(MODULE, 5)},
            },
            leasetime : {
                func : checkRange,
                args : {
                    min : 2,
                    max : 1440,
                    who : intl.get(MODULE, 6),
                }
            }
        };

        tip = valid[key].func(val, valid[key].args);

        if ('startip' !== key){
            startipTip = checkIp(this.state.startip, {who : intl.get(MODULE, 4)});
        } else {
            startipTip = tip;
        }

        if ('endip' !== key) {
            endipTip = checkIp(this.state.endip, {who : intl.get(MODULE, 5)})
        } else {
            endipTip = tip;
        }

        this.setState({
            [key]: (typeof val == 'object' ? [...val] : val),
            [key + 'Tip']: tip,
            startipTip: startipTip,
            endipTip: endipTip
        }, () => {  // 这里用户输入合法后我们才检查是否同一个网段
            let st = this.state;
            let tip = ['ipv4Tip', 'maskTip', 'startipTip', 'endipTip', 'leasetimeTip'];
            let ok = tip.every((tip) => { return '' === st[tip]});

            if (ok) {
                let num2ip = (num) => {
                    let ip3 = (num << 0) >>> 24;
                    let ip2 = (num << 8) >>> 24;
                    let ip1 = (num << 16) >>> 24;
                    let ip0 = (num << 24) >>> 24

                    return `${ip3}.${ip2}.${ip1}.${ip0}`;
                }

                let netId = (transIp(st.ipv4) & transIp(st.mask)) >>> 0;
                let netMax = ~transIp(st.mask);
                let minStr = num2ip((netId + 1));
                let maxStr = num2ip((netId + netMax - 1));
                let range = `(${minStr} - ${maxStr})`;
                if (!checkSameNet(st.ipv4, st.startip, st.mask)) {
                    this.setState({ 
                        startipTip: intl.get(MODULE, 7) + range,
                        disabled: true 
                    });
                    return;
                }

                if (!checkSameNet(st.ipv4, st.endip, st.mask)) {
                    this.setState({ 
                        endipTip: intl.get(MODULE, 7) + range,
                        disabled: true
                    });
                    return;
                }

                if (transIp(st.startip) >= transIp(st.endip)) {
                    this.setState({ 
                        endipTip: intl.get(MODULE, 8),
                        disabled: true
                    });
                    return;
                }
                this.setState({ disabled: false });
            } else {
                this.setState({ disabled: true });
            }
        });
    }

    submit = async () => {
        await Modal.warning({
            title: intl.get(MODULE, 9),
            content: <p>{intl.get(MODULE, 10)}<br/>{intl.get(MODULE, 11)}</p>,
            okText: intl.get(MODULE, 12),
            centered: true,
            onOk: this.submitAll
        });
    }

    async fetchBasic () {
        let response = await common.fetchApi([
            { opcode: 'NETWORK_LAN_IPV4_GET' },
            { opcode: 'DHCPS_GET' }
        ]);

        let { errcode, data } = response;
        if (errcode == 0) {
            let { lan } = data[0].result, { dhcps } = data[1].result;
            this.lanInfo = lan.info, this.dhcps = dhcps;
            this.setState({
                ipv4: [...this.lanInfo.ipv4.split('.')],
                mask: [...this.lanInfo.mask.split('.')],
                enable: this.dhcps.enable,
                startip: [...this.dhcps.startip.split('.')],
                endip: [...this.dhcps.endip.split('.')],
                leasetime: this.dhcps.leasetime
            });
            return;
        }

        //message.error(`获取局域网配置指令异常[${error[errcode] || errcode}]`);
        message.error(intl.get(MODULE, 13, {error, errcode}));
    }

    submitAll = async () => {
        let lan = this.lanInfo, state = this.state;
        let ipv4 = state.ipv4.join('.'), mask = state.mask.join('.');
        let changed = ((lan.ipv4 !== ipv4) || (lan.mask !== mask));
        this.lanInfo.ipv4 = ipv4;
        this.lanInfo.mask = mask;

        this.dhcps.enable = state.enable;
        this.dhcps.startip = state.startip.join('.');
        this.dhcps.endip = state.endip.join('.');
        this.dhcps.leasetime = state.leasetime;

        this.setState({ loading: true });
        let response = await common.fetchApi(
            [{
                opcode: 'NETWORK_LAN_IPV4_SET',
                data: { lan: { info: this.lanInfo } }
            }, {
                opcode: 'DHCPS_SET',
                data: { dhcps: this.dhcps }
            }]);

        this.setState({ loading: false });

        let { errcode, message } = response;
        if (errcode == 0) {
            if (changed) {
                setTimeout(() => {
                    const reg = /\d+\.\d+\.\d+\.\d+/g;
                    if (reg.test(location.hostname)){
                        // user login by ip
                        location.href = location.href.replace(reg, ipv4);
                    } else {
                        // user login by sunmi.link
                        location.reload();
                    }
                    Loading.close();
                }, 15000);
            }
            Loading.show({duration : 20});
            // message.success('配置生效,15秒后跳转',4);
            message.success(intl.get(MODULE, 14),4);
            return;
        }else{
            Loading.close();
            message.error(intl.get(MODULE, 15, {error, errcode}));
        }
    }

    componentDidMount() {
        this.fetchBasic();
    }

    render(){
        const { ipv4, mask, enable, startip, endip, leasetime, ipv4Tip, maskTip,startipTip,endipTip, leasetimeTip, disabled, loading } = this.state;
        return (
        <div className="lan-settting">
                <Form>
                    <section className="content-item" style={{marginTop: 9}}>
                        <PanelHeader title={intl.get(MODULE, 16)} />
                        <label style={{ marginTop: 24 }}>{intl.get(MODULE, 17)}</label>
                        <FormItem showErrorTip={ipv4Tip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: ipv4[0], maxLength: 3 }, { value: ipv4[1], maxLength: 3 }, { value: ipv4[2], maxLength: 3 }, { value: ipv4[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'ipv4')} />
                            <ErrorTip>{ipv4Tip}</ErrorTip>
                        </FormItem>
                        <label>{intl.get(MODULE, 18)}</label>
                        <FormItem showErrorTip={maskTip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                inputs={[{ value: mask[0], maxLength: 3 }, { value: mask[1], maxLength: 3 }, { value: mask[2], maxLength: 3 }, { value: mask[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'mask')} />
                            <ErrorTip>{maskTip}</ErrorTip>
                        </FormItem>
                    </section>
                    <section className="content-item">
                        <PanelHeader title={intl.get(MODULE, 19)} checkable={true} checked={enable} onChange={value => this.onChange(value, 'enable')} />
                        <label style={{ marginTop: 24 }}>{intl.get(MODULE, 4)}</label>
                        <FormItem showErrorTip={startipTip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                disabled={!enable}
                                inputs={[{ value: startip[0], maxLength: 3 }, { value: startip[1], maxLength: 3 }, { value: startip[2], maxLength: 3 }, { value: startip[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'startip')} />
                            <ErrorTip>{startipTip}</ErrorTip>
                        </FormItem>
                        <label>{intl.get(MODULE, 5)}</label>
                        <FormItem showErrorTip={endipTip} style={{ width: 320 }}>
                            <InputGroup size="small"
                                disabled={!enable}
                                inputs={[{ value: endip[0], maxLength: 3 }, { value: endip[1], maxLength: 3 }, { value: endip[2], maxLength: 3 }, { value: endip[3], maxLength: 3 }]}
                                onChange={value => this.onChange(value, 'endip')} />
                            <ErrorTip>{endipTip}</ErrorTip>
                        </FormItem>
                        <label>{intl.get(MODULE, 20)}</label>
                        <FormItem showErrorTip={leasetimeTip} type="small" style={{ width: 320, marginBottom: 0 }}>
                            <label style={{ position: 'absolute', right: 10, top: 0, zIndex: 1 , opacity: 0.65 }}>{intl.get(MODULE, 21)}</label>
                            <Input
                                type='text'
                                disabled={!enable}
                                value={leasetime}
                                onChange={value => this.onChange(value, 'leasetime')}
                                placeholder={intl.get(MODULE, 22)}
                                maxLength={4} />
                            <ErrorTip>{leasetimeTip}</ErrorTip>
                        </FormItem>
                    </section>
                </Form>
                <div className="save">
                    <Button disabled={disabled} loading={loading} style={{ width: 320 }} onClick={this.submit} size="large" type="primary">{intl.get(MODULE, 23)}</Button>
                </div>
        </div>
        );
    }
};







