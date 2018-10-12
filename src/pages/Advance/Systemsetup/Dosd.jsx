
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Table, Checkbox, Popconfirm, Modal } from 'antd';

const { FormItem } = Form;

const pagination = {
    pageSize: 6,
    hideOnSinglePage: false,
    showTotal: total => `已阻止${total}台设备`,
};

export default class Dosd extends React.Component {
    state = {
        enable: true,
        udp: false,
        icmp: false,
        tcp_syn: false,
        disabled : false,
        loading : false,
        blockList: [],
    };

    submit = async () => {
        let { enable, icmp, udp, tcp_syn } = this.state;
        this.setState({
            loading: true,
            disabled: true,
        });

        let response = await common.fetchWithCode(
            'DOSD_SET',
            { method: 'POST', data: { dosd: { enable, icmp, udp, tcp_syn } } }
        ).catch(ex => { });

        this.setState({
            loading: false,
            disabled: false,
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            return;
        }
        Modal.error({ title: 'DoS设置失败', content: message });
    }

    fetchDosInfo = () => {
        let dosd = common.fetchWithCode('DOSD_GET', { method: 'POST' });
        let dosdList = common.fetchWithCode('DOSD_BLOCKLIST_GET', { method: 'POST' });

        Promise.all([dosd, dosdList]).then(resp => {
            let dosd, blocklist;
            let { errcode, data } = resp[0];
            if (0 !== errcode) {
                return;
            }
            dosd = data[0].result.dosd;
            let {enable, udp, icmp, tcp_syn} = dosd;

            if (0 !== resp[1].errcode) {
                return;
            }
            blocklist = resp[1].data[0].result.block_list;

            this.setState({
                enable, 
                udp, 
                icmp, 
                tcp_syn,
                blockList: blocklist.map(item => Object.assign({}, item)),
            });
        }).catch((error) => {
            Modal.error({ title: 'DoS指令异常', error });
        })
    }

    handleDelete = async (record) => {
        let response = await common.fetchWithCode(
            'DOSD_BLOCKLIST_DELETE',
            {
                method: 'POST', 
                data: {
                    block_list: [record]
                }
            }
        ).catch(ex => { });

        let { errcode, message } = response;
        if (errcode == 0) {
            const blockList = [...this.state.blockList];
            this.setState({ blockList: blockList.filter(item => item.index !== record.index) });
            return;
        }

        Modal.error({ title: '删除失败', content: message });
    }

    onChange = (key) => {
        this.setState({
            [key]: !this.state[key],
        })
    }

    componentDidMount() {
        this.fetchDosInfo();
    }

    render(){
        const { enable, udp, icmp, tcp_syn, loading, disabled, blockList } = this.state;

        const columns = [{
            title: 'IP地址',
            dataIndex: 'ip',
            width: 390
        }, {
            title: 'MAC地址',
            dataIndex: 'mac',
            width: 340
        }, {
            title: '操作',
            width: 203,
            render: (text, record) => (
                <span>
                    <Popconfirm title="确定删除？" okText="确定" cancelText="取消" onConfirm={() => this.handleDelete(record)}>
                        <a href="javascript:;" style={{ color: "#3D76F6" }}>删除</a>
                    </Popconfirm>
                </span>
            )
        }];

        return (
        <div className="dosd-setting">
            <section>
                <Form>
                    <PanelHeader title="DoS防护" checkable={true} checked={enable} onChange={value => this.onChange('enable')} />
                    <FormItem style={{ marginBottom: 0 }}>
                        <Checkbox checked={icmp} onChange={() => this.onChange('icmp')}>ICMP-FLOOD攻击防护</Checkbox>
                    </FormItem>
                    <FormItem style={{ marginBottom: 0 }}>
                        <Checkbox checked={udp} onChange={() => this.onChange('udp')}>UDP-FLOOD攻击防护</Checkbox>
                    </FormItem>
                    <FormItem style={{ marginBottom: 0 }}>
                        <Checkbox checked={tcp_syn} onChange={() => this.onChange('tcp_syn')}>TCP-SYN-FLOOD攻击防护</Checkbox>
                    </FormItem>
                    <Button disabled={disabled} loading={loading} onClick={this.submit} type="primary" style={{ width: 117, marginTop: 20, marginBottom:40 }}>保存</Button>
                </Form>
            </section>
            <section>
                <Form>
                    <PanelHeader title="已阻止的DoS主机列表" />
                    <Table columns={columns} dataSource={blockList} rowKey={record => record.mac}
                    bordered size="middle" pagination={pagination} locale={{ emptyText: "您还未添加任何设备" }} />
                </Form>
            </section>
        </div>
        );
    }
};







