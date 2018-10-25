
import React from 'react';
import { Button, Timeline, Icon  } from 'antd';
import CustomIcon from '~/components/Icon';

import './diagnose.scss';

export default class Diagnose extends React.Component {
    constructor(props) {
        super(props);
        this.timer = null;
    }
 
    state = {
        status: 'doing',
        step: 2,
        time: 3,
        problem: '',
        reason: '',
        solution: '',
        btnStr: '重新检测',
        solutionFunc: null,
        bgIcon: 'detection',
    }

    diagnoseWanLink = async () => {
        let res = await common.fetchApi({ opcode: 'NETWORK_WAN_IPV4_GET' });
        let { data, errcode, message } = res;
        if (errcode == 0) {
            let { info } = data[0].result.wan;
            let { linkstate, dialstate, online } = info;
            //linkstate = false;

            if (!linkstate) {
                this.setTheme('warning-bg');
                this.setState({
                    status: 'warning',
                    bgIcon: 'defeated',
                    problem: '网线异常',
                    reason: 'WAN口未插入网线',
                    solution: '请检查您的网线是否插好，或重启您的宽带猫，等待约2分钟，待宽带猫正常工作后，再重新检测',
                    btnStr: '重新检测',
                    solutionFunc: this.start,
                });
                return;
            }

            this.setState({
                step: this.state.step + 1,
            }, () => {
                // 诊断速度太快，延迟2秒增加用户体验
                setTimeout(() => {
                    this.diagnoseDialState();
                }, 2000);
            });
        } else {
            Modal.error({ title: '网络诊断失败', content: message });
        }
    }

    diagnoseDialState = async () => {
        let res = await common.fetchApi({ opcode: 'NETWORK_WAN_IPV4_GET' });
        let { data, errcode, message } = res;
        if (errcode == 0) {
            let { info } = data[0].result.wan;
            let { linkstate, dialstate, online } = info;
            //dialstate = 'disconnected';

            if ('connected' !== dialstate) {
                this.setTheme('warning-bg');
                this.setState({
                    status: 'warning',
                    bgIcon: 'defeated',
                    problem: 'WAN口拨号异常',
                    reason: '上网方式设置错误，或宽带账号密码错误',
                    solution: '请重新设置上网方式，或联系您的宽带运营商处理',
                    btnStr: '设置上网方式',
                    solutionFunc: this.setWan,
                });
                return;
            }

            this.setState({
                step: this.state.step + 1,
            }, () => {
                // 诊断速度太快，延迟2秒增加用户体验
                setTimeout(() => {
                    this.diagnoseOnline();
                }, 2000);
            });
        } else {
            Modal.error({ title: '网络诊断失败', content: message });
        }
    }

    diagnoseOnline = async () => {
        let res = await common.fetchApi({ opcode: 'NETWORK_WAN_IPV4_GET' });
        let { data, errcode, message } = res;
        if (errcode == 0) {
            let { info } = data[0].result.wan;
            let { linkstate, dialstate, online } = info;
            //online = false;

            if (!online) {
                this.setTheme('warning-bg');
                this.setState({
                    status: 'warning',
                    bgIcon: 'defeated',
                    problem: '无Internet服务',
                    reason: '上网方式设置错误，或运营商服务异常',
                    solution: '请重新设置上网方式，或联系您的宽带运营商处理',
                    btnStr: '设置上网方式',
                    solutionFunc: this.setWan,
                });
                return;
            } else {
                this.setTheme('okay-bg');
                this.setState({
                    status: 'okay',
                    bgIcon: 'succeed',
                    time: 3,
                }, () => {
                    this.timer = setInterval(() => {
                        if (this.state.time <= 0) {
                            clearInterval(this.timer);
                            this.goBack();
                            return;
                        }

                        this.setState({
                            time: this.state.time - 1,
                        });
                    }, 1000);
                });
                return;
            }
        } else {
            Modal.error({ title: '网络诊断失败', content: message });
        }
    }

    start = async () => {
        this.setTheme('dbg-bg');
        this.setState({
            status: 'doing',
            step: 0,
            time: 3,
            bgIcon: 'detection',
        });

        // 诊断速度太快，延迟2秒增加用户体验
        setTimeout(() => {
            this.diagnoseWanLink();
        }, 2000);
    }

    setWan = () => {
        this.props.history.push('/settings/network');
    }

    setTheme = (theme) => {
        const ui = 'ui-fullscreen';
        const doc = document.getElementsByClassName(ui)[0];
        doc.className = `${ui} ${theme}`;
    }

    goBack = () => {
        this.props.history.push('/home');
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const { status, step, problem, reason, solution, btnStr, solutionFunc, time, bgIcon } = this.state;
        const timeTip = `网络已联通，即将返回首页（${time}秒）...`;
        const dot = [0, 1, 2].map(i => {
            if (step === i) {
                return <Icon type={'loading'} style={{ fontSize: '0.85em' }}/>;
            } else if (step > i) {
                return <Icon type={'check-circle'} style={{ fontSize: '0.75em' }} />;
            } else {
                return null;
            }
        });

        return (
            <div className='diagnose-con'>
                <div className='doing' style={{display:('doing' === status ? 'block' : 'none')}}>
                    <p className='title'>正在进行故障诊断，请稍候...</p>
                    <Timeline className='time-line'>
                        <Timeline.Item dot={dot[0]} className={0 == step ? 'now':''}>检测网线连接状态</Timeline.Item>
                        <Timeline.Item dot={dot[1]} className={1 == step ? 'now' : ''}>检测WAN口拨号</Timeline.Item>
                        <Timeline.Item dot={dot[2]} className={2 == step ? 'now' : ''}>检测Internet服务</Timeline.Item>
                    </Timeline>
                    <Button className='diagnose-btn' onClick={this.goBack}>取消检测</Button>
                </div>
                <div className='warning' style={{ display: ('warning' === status ? 'block' : 'none') }}>
                    <p className='title'>诊断完成</p>
                    <div className='result'>
                        <label>诊断问题：</label><span>{problem}</span>
                    </div>
                    <div className='reason'>
                        <label>可能原因：</label><span>{reason}</span>
                    </div>
                    <div className='solution'>
                        <label>解决办法：</label><span>{solution}</span>
                    </div>
                    <Button className='diagnose-btn' onClick={solutionFunc}>{btnStr}</Button>
                </div>
                <div className='okay' style={{ display: ('okay' === status ? 'block' : 'none') }}>
                    <p className='title'>诊断完成</p>
                    <div className='result'>
                        <label>诊断问题：</label><span>未发现问题</span>
                    </div>
                    <div className='solution'>
                        <label>{timeTip}</label>
                    </div>
                    <Button className='diagnose-btn' onClick={this.goBack}>立即返回</Button>
                </div>
                <div className='bg-icon'><CustomIcon type={bgIcon} size={720} /></div>
                <div className='bg-icon2'><CustomIcon type={bgIcon} size={720} /></div>
            </div>
        );
    }
}
