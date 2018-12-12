
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Table, Checkbox, Popconfirm, message } from 'antd';

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
        loading : false,
        blockList: [],
    };

    submit = async () => {
        let { enable, icmp, udp, tcp_syn } = this.state;
        this.setState({
            loading: true,
        });

        let response = await common.fetchApi({
            opcode: 'DOSD_SET',
            data: { dosd: { enable, icmp, udp, tcp_syn } }
        });

        this.setState({
            loading: false,
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            message.success(`配置生效`);
            return;
        }
        message.error(`配置失败![${errcode}]`);
    }

    fetchDosInfo = async () => {
        let response = await common.fetchApi([
            { opcode: 'DOSD_GET' },
            { opcode: 'DOSD_BLOCKLIST_GET' }
        ]);

        let { errcode, data, message } = response;
        if (0 !== errcode) {
            message.error(`DoS指令异常[${errcode}]`);
            return;
        }

        let dosd = data[0].result.dosd,
            blocklist = data[1].result.block_list;
        let { enable, udp, icmp, tcp_syn } = dosd;

        this.setState({
            enable,
            udp,
            icmp,
            tcp_syn,
            blockList: blocklist.map(item => Object.assign({}, item)),
        });
    }

    handleDelete = async (record) => {
        let response = await common.fetchApi({
            opcode: 'DOSD_BLOCKLIST_DELETE',
            data: {
                block_list: [record]
            }
        }, {
            loading: true
        });

        let { errcode, message } = response;
        if (errcode == 0) {
            this.fetchDosInfo();
            return;
        }

        message.error(`删除失败[${errcode}]`);
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
        const { enable, udp, icmp, tcp_syn, loading, blockList } = this.state;

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
                        <Checkbox checked={icmp} disabled={!enable} onChange={() => this.onChange('icmp')}>ICMP-FLOOD攻击防护</Checkbox>
                    </FormItem>
                    <FormItem style={{ marginBottom: 0 }}>
                        <Checkbox checked={udp} disabled={!enable} onChange={() => this.onChange('udp')}>UDP-FLOOD攻击防护</Checkbox>
                    </FormItem>
                    <FormItem style={{ marginBottom: 0 }}>
                        <Checkbox checked={tcp_syn} disabled={!enable} onChange={() => this.onChange('tcp_syn')}>TCP-SYN-FLOOD攻击防护</Checkbox>
                    </FormItem>
                    <Button loading={loading} onClick={this.submit} type='primary' style={{ width: 117, marginTop: 20, marginBottom:40 }}>保存</Button>
                </Form>
            </section>
            <section>
                <Form>
                    <PanelHeader title="已阻止的DoS主机列表" />
                    <Table style={{marginTop:16}} columns={columns} dataSource={blockList} rowKey={record => record.mac}
                    bordered size="middle" pagination={pagination} locale={{ emptyText: "暂无设备" }} />
                </Form>
            </section>
        </div>
        );
    }
};







