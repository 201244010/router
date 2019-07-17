import React from 'react';
import './system.scss';
import Form from "~/components/Form";
import {Table, Button, Popconfirm, Modal, Select, message, Switch} from 'antd';
import PanelHeader from '~/components/PanelHeader';
import {checkRange, checkIp} from '~/assets/common/check';
import SubLayout from '~/components/SubLayout';

const MODULE = 'portforwarding';

const {FormItem, Input, ErrorTip, InputGroup} = Form;
const {Option} = Select;
const protoType = {
	0: 'ALL',
	1: 'TCP',
	2: 'UDP'
}
export default class PortForwarding extends React.Component {
	constructor(props){
		super(props);
		this.err = {
			'1022': intl.get(MODULE, 0)/*_i18n:端口转发内外端口号相同*/,
			'1023': intl.get(MODULE, 1)/*_i18n:保存异常*/,
			'1024': intl.get(MODULE, 2)/*_i18n:外部端口已被占用*/
		}
		this.columns = [{
            title: intl.get(MODULE, 3)/*_i18n:编号*/,
			dataIndex: 'number',
            width:180			
        }, {
            title: intl.get(MODULE, 4)/*_i18n:名称描述*/,
            dataIndex: 'name',
            width:170
        }, {
            title: intl.get(MODULE, 5)/*_i18n:内部IP*/,
            dataIndex: 'destip',
            width:160
        }, {
            title: intl.get(MODULE, 6)/*_i18n:内部端口*/,
            dataIndex: 'desport',
            width:140
        }, {
			title: intl.get(MODULE, 7)/*_i18n:外部端口*/,
			dataIndex: 'srcport',
            width:140
        },{
			title: intl.get(MODULE, 8)/*_i18n:端口协议*/,
			dataIndex: 'proto',
			width:140,
			render: (record) => protoType[record]
		},{
			title: intl.get(MODULE, 9)/*_i18n:状态开关*/,
			dataIndex: 'enable',
			width:120,
			render: (_, record) => {
				return <Switch checked={parseInt(record.enabled)} onChange={(e) => this.changeSwitch(e, record)}/>
			}
		},{
            title: intl.get(MODULE, 10)/*_i18n:操作*/,
			width:166,
			render: (_, record) => {
				return <div>
					<span className="port-edit" onClick={() => this.editRule(record)}>{intl.get(MODULE, 11)/*_i18n:编辑*/}</span>
					<Popconfirm
						title={intl.get(MODULE, 12)/*_i18n:确认删除本条端口转发规则么*/}
						okText={intl.get(MODULE, 13)/*_i18n:确定*/}
						cancelText={intl.get(MODULE, 14)/*_i18n:取消*/}
						placement="topRight"
						onConfirm={() => this.deleteRule(record)}>
						<span style={{fontSize: 14, color: '#D0021B', cursor: 'pointer'}}>{intl.get(MODULE, 15)/*_i18n:删除*/}</span>
					</Popconfirm>
				</div>
			}
        }];
	}

	state = {
		visible: false,
		name: '',
		nameTip: '',
		desport: '',
		desportTip: '',
		srcport: '',
		srcportTip: '',
		proto: 0,
		portList: [],
		type: '',
		tag: '',
		pagination: {
			pageSize: 5,
			current: 1,
			total: 0
		},
		destip: ["","","",""],
		destipTip: '',
		disabled: false
	}

	deleteRule = async (record) => {
		const resp = await common.fetchApi([{
			opcode: 'PORTFORWARDING_DELETE',
			data: {
				rule_list: [record.tag]
			}
		}]);
        const { errcode } = resp;
		if (0 === errcode) {
			message.success(intl.get(MODULE, 16)/*_i18n:删除成功*/);
			this.fetchPortforwarding({});
		} else {
			message.error(this.err[errcode]);
		}
	}

	changeSwitch = async (value, record) => {
		const resp = await common.fetchApi([{
			opcode: 'PORTFORWARDING_SWITCH',
			data: {
				rule_list: record.tag,
				enabled: Number(value)
			}
		}]);
        const { errcode } = resp;
		if (0 === errcode) {
			message.success(Number(value) ?  intl.get(MODULE, 17)/*_i18n:打开成功*/ : intl.get(MODULE, 24)/*_i18n:关闭成功*/);
			this.fetchPortforwarding({});
		} else {
			message.error(this.err[errcode]);
		}
	}

	initIp = (destip) => {  // 'x.x.x.x' / ''
		if (destip.length === 0) {
			return ['', '', '', '']
		} else {
			return Object.assign(['', '', '', ''], destip.split('.'));
		}
	};

	editRule = (record) => {
		this.setState({
			visible: true,
			name: record.name,
			desport: record.desport,
			srcport: record.srcport,
			proto: record.proto,
			type: 'update',
			tag: record.tag,
			destip: this.initIp(record.destip)
		}, () => this.disAddBtn());
	}

	createRule = () => {
		this.setState({
			visible: true,
			name: '',
			desport: '',
			srcport: '',
			proto: 0,
			type: 'create',
			tag: '',
			destip: this.initIp('')
		}, () => this.disAddBtn());
	}

	submit = async () => {
		const {name, desport, srcport, proto, type, tag, destip} = this.state;
		const resp = await common.fetchApi([{
			opcode: type === 'create' ? 'PORTFORWARDING_CREATE' : 'PORTFORWARDING_UPDATE',
			data: {
				rule_list:type === 'create' ? [{
					name,
					desport,
					srcport,
					proto,
					destip: destip.join('.')
				}] : {
					name,
					desport,
					srcport,
					proto,
					destip: destip.join('.'),
					tag
				}
			}
		}]);
        const { errcode } = resp;
		if (errcode === 0) {
			this.fetchPortforwarding({});
			this.setState({
				visible: false
			});
			message.success(type === 'create' ? intl.get(MODULE, 18)/*_i18n:创建成功*/ : intl.get(MODULE, 19)/*_i18n:修改成功*/);
		} else {
			message.error(this.err[errcode]);
		}
	}

	checkSrcPort = (val) => {
		let tip = '';
		var regValid = /[^\d-,]/g;
		var regNum = /^[1-9]\d*$/;
		const portArray = val.split(',');
		let max = 0, min = 65535, value = [];
		if (val === '') {
			tip = intl.get(MODULE, 20)/*_i18n:端口号不能为空*/;
			return tip;
		}
		if (regValid.test(val)) {
			tip = intl.get(MODULE, 21)/*_i18n:端口输入非法*/;
			return tip;
		}
		if (portArray.length > 5) {
			return tip = intl.get(MODULE, 22)/*_i18n:端口组合不超过五组*/;
		}

		portArray.map(item => {
			const portContent = item.split('-');
			const portStart = portContent[0];
			const length = portContent.length;
			if (length > 1) {
				const portEnd = portContent[1];
				max = Math.max(max, portStart);
				min = Math.min(min, portEnd);
				if (min >= max && portArray.filter(item => item.split('-').length > 1).length > 1) {
					return tip = intl.get(MODULE, 23)/*_i18n:端口组合不能有交叉*/;
				} else {
					return tip = '';
				}
			} else {
				if (max !== 0 && min !== 65535 && max < portStart && portStart < min) {
					return tip = intl.get(MODULE, 23)/*_i18n:端口组合不能有交叉*/;
				}
				value.push(portStart);
			}
		});
		portArray.map(item => {
			const portContent = item.split('-');
			const portStart = portContent[0];
			const portEnd = portContent[1];
			const length = portContent.length;
			if (this.checkSame(value)) {
				return tip = intl.get(MODULE, 25)/*_i18n:端口组合不能相同*/;
			}

			if (portStart === '' || ( length > 1 && portEnd === '') ) {
				return tip = intl.get(MODULE, 26)/*_i18n:端口格式不合法*/
			}

			if (!regNum.test(portStart) || (length > 1 && !regNum.test(portEnd))) {
				return tip = intl.get(MODULE, 27)/*_i18n:端口不能从0开始*/;
			}

			if (length > 1 && parseInt(portEnd) <= parseInt(portStart)) {
				return tip = intl.get(MODULE, 28)/*_i18n:端口范围不正确*/;				
			}

			if (portStart < 1 || portStart > 65535 || (length > 1 && portEnd < 1 || portEnd > 65535)) {
				return tip = intl.get(MODULE, 29)/*_i18n:端口范围应在1-65535*/;
			}
		});

		return tip;
	}

	checkSame = (list) => {
		const tmpList = list.sort();
		let result = false;
		tmpList.map((_, index) => {
			if (tmpList[index] === tmpList[index + 1]) {
				result = true
			}
		})
		
		return result;
	}

	onSrcChange = (val) => {
		val = val.trim();
		this.setState({
			srcport: val,
			srcportTip: this.checkSrcPort(val)
		}, () => this.disAddBtn())
	}

	onInputChange = (val, key) => {
        let valid = {
            desport: {
                func: checkRange,
                args: {
                    min: 1,
                    max: 65535,
                    who: intl.get(MODULE, 30)/*_i18n:端口范围*/,
                }
            },
			destip:{
                func: checkIp,
                who: intl.get(MODULE, 31)/*_i18n:IP地址*/,
			},
			name: {
				func: (val) => val === '' ? intl.get(MODULE, 32)/*_i18n:应用名称不能为空*/ : ''
			}
		};
		let tip = valid[key].func(val, valid[key].args);
		this.setState({
            [key]: val,
			[key + 'Tip']: tip,
		}, () => this.disAddBtn());
	}

	fetchPortforwarding = async ({page = 1, pageSize = 5}) => {
		const resp = await common.fetchApi([
			{ 
				opcode:'PORTFORWARDING_GET', 
				data: {
					page,
					pageSize
				}
		 	},
		], { ignoreErr: true });
		const {errcode, data} = resp;
		let number = (data[0].page - 1) * 5  + 1;
		if (0 === errcode) {
			const tmpList = data[0].result.map(item => {
				item.number = number++;
				return item
			})
			this.setState({
				portList: tmpList,
				pagination: {...this.state.pagination, total: data[0].sum, current: data[0].page}
			})
		} else {
			message.error(intl.get(MODULE, 33)/*_i18n:信息获取失败*/)
		}
	}

	onTableChange = async pagination => {
		this.fetchPortforwarding({
			page: pagination.current,
			pageSize: 5
		})
	}

	onChange = (value) => {
		this.setState({
			proto: value
		})
	} 

	onCancel = () => {
		this.setState({
			visible: false
		})
	}

	disAddBtn = () => {
		const {name, nameTip, destipTip, destip, desport, srcport, desportTip, srcportTip} = this.state;
		const disabled = [name, srcport, desport].some(item => item === '') || [nameTip, destipTip, desportTip, srcportTip].some(item => item !== '') || destip.every(item => item === '');
		this.setState({
			disabled
		})
	}

	componentDidMount() {
		this.fetchPortforwarding({});
	}

	render() {
		const {
			visible, nameTip, portList, name, srcport, desport, proto, desportTip, srcportTip, pagination, destip,
			type, destipTip, disabled
		} = this.state;
		const ruleNum = portList.length;
		return <SubLayout className="settings">
			<div style={{ margin: "0 60px" }}>
				<PanelHeader title={intl.get(MODULE, 34)/*_i18n:规则列表*/}/>
			</div>
			<div className="system-reboot">
					<label className="reboot-title">{intl.get(MODULE, 35, {ruleNum})/*_i18n:已建立{ruleNum}条规则*/}</label>
					<Button style={{height: 32}} type="primary" onClick={this.createRule}>{intl.get(MODULE, 36)/*_i18n:新建*/}</Button>
				</div>
			<div className="static-table">
				<Table 
					rowKey='tag'
					columns={this.columns} 
					dataSource={portList} 
					rowKey={record=>record.index} 
					bordered={false}
					pagination={pagination}
					rowClassName={(record, index) => {
						let className = 'editable-row';
						if (index % 2 === 1) {
							className = 'editable-row-light';
						}
						return className;
					}}
					size="middle" locale={{ emptyText: intl.get(MODULE, 37)/*_i18n:暂无设备*/}} 
					onChange={this.onTableChange}
				/>
			</div>
			<Modal 
				visible={visible}
				onCancel={this.onCancel}
				onOk={this.submit}
				width={360}
				title={type === 'create' ? intl.get(MODULE, 38)/*_i18n:新建规则*/ : intl.get(MODULE, 50)/*_i18n:修改规则*/}
				footer={
					[
						<Button key="back" onClick={this.onCancel}>{intl.get(MODULE, 39)/*_i18n:取消*/}</Button>,
						<Button key="submit" type="primary" disabled={disabled} onClick={this.submit}>
							{type === 'create' ? intl.get(MODULE, 40)/*_i18n:新建*/ : intl.get(MODULE, 51)/*_i18n:保存*/}
						</Button>,
					]
				}
			>
				<label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 41)/*_i18n:应用名称*/}</label>
				<FormItem showErrorTip={nameTip} type="small" >
					<Input type="text" value={name} onChange={value => this.onInputChange(value, 'name')} maxLength={40} placeholder={intl.get(MODULE, 42)/*_i18n:请输入应用名称*/} />
					<ErrorTip>{nameTip}</ErrorTip>
				</FormItem>
				<label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 43)/*_i18n:内部IP*/}</label>
				<FormItem key='ipv4' showErrorTip={destipTip} style={{ width : 320}}>
                <InputGroup 
                    inputs={[{value : destip[0], maxLength : 3}, {value : destip[1], maxLength : 3}, {value : destip[2], maxLength : 3}, {value : destip[3], maxLength : 3}]} 
                    onChange={value => this.onInputChange(value, 'destip')} />
                <ErrorTip>{destipTip}</ErrorTip>
                </FormItem>
				<label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 44)/*_i18n:内部端口*/}</label>
				<FormItem showErrorTip={desportTip} type="small" >
					<Input type="text" value={desport} onChange={value => this.onInputChange(value, 'desport')} spellcheck={false} placeholder={intl.get(MODULE, 45)/*_i18n:例如：X、1-65535*/} />
					<ErrorTip>{desportTip}</ErrorTip>
				</FormItem>
				<label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 46)/*_i18n:外部端口*/}</label>
				<FormItem showErrorTip={srcportTip} type="small" >
					<Input type="text" value={srcport} onChange={value => this.onSrcChange(value)} spellcheck={false} placeholder={intl.get(MODULE, 47)/*_i18n:例如：X、XX、1-65535*/} />
					<ErrorTip>{srcportTip}</ErrorTip>
				</FormItem>
				<label style={{ display:'block',marginBottom: 6 }}>{intl.get(MODULE, 48)/*_i18n:端口协议*/}</label>
				<FormItem type="small" >
					<Select onChange={value => this.onChange(value, 'proto')} value={proto} style={{width:'100%', height:36}}>
						<Option value={0}>ALL</Option>
						<Option value={1}>TCP</Option>
						<Option value={2}>UDP</Option>
					</Select>
				</FormItem>
			</Modal>
		</SubLayout>
	}
}