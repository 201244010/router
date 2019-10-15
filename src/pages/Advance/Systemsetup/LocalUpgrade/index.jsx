import React from 'react';
import { Button, message, Modal } from 'antd';
import Upload from 'rc-upload';
import CustomIcon from '~/components/Icon';
import CustomProgress from '~/components/Progress';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import ModalLoading from '~/components/ModalLoading';
import './index.scss';

const MODULE = 'localUpgrade';
const {FormItem, Input} = Form;

class LocalUpgrade extends React.PureComponent {
	constructor(props) {
		super(props);
		this.file;
		this.filename;
		this.state = {
			filename: '',
			progressActive: false,
			duration: 0,
			loadingVisible: false,
			loadingTip: '',
			succeedActive: true,
		}
	}

	customRequest = (detail) => {
		this.file = detail.file;
		this.filename = detail.file.name;
		this.setState({ filename: detail.file.name });
	}

	onChange = (value) => {
		this.setState({filename: value});
	}

	login = () =>{
		this.setState({
			succeedActive: false,
		});
        location.href = '/login';
	}

	pendingState = resp => {
		const {errcode, data} = resp;
		const { result: { state, restart_duration: duration = 0 } = {} } = data[0];
		if(errcode === 0) {
			let errorInfo = '';
			let progressActive = false;
			switch (state) {
				case '3':
					errorInfo = intl.get(MODULE, 5)/*_i18n:文件上传失败，请检查网络后重试*/;
					break;
				case '4':
					errorInfo = intl.get(MODULE, 7)/*_i18n:文件校验失败，请检查文件格式后重试*/;
					break;
				case '5':
					errorInfo = intl.get(MODULE, 8)/*_i18n:已有其他升级流程正在进行中*/;
					break;
				default:
					progressActive = true;
			}
			this.setState({
				loadingVisible: false,
				loadingTip: '',
				duration,
				progressActive,
			});

			if(progressActive) {
				setTimeout(()=>{
					this.setState({
						progressActive: false,
						succeedActive: true,
					});
				}, duration * 1000);
			} else {
				message.error(errorInfo);
			}
		} else {
			let loadingTip = '';
			switch (state) {
				case '1':
					loadingTip = intl.get(MODULE, 11)/*_i18n:正在进行文件上传*/;	
					break;
				default:
					loadingTip = intl.get(MODULE, 12)/*_i18n:正在进行文件校验*/;
			}
			this.setState({
				loadingTip,
			});	
		}
		return errcode !== 0;
	}

	submit = async() => {
		if (!this.file) {
			message.warning(intl.get(MODULE, 6)/*_i18n:请选择升级版本的文件*/);
			return;
		}
		this.setState({
			loadingVisible: true,
			loadingTip: intl.get(MODULE, 11)/*_i18n:正在进行文件上传*/,
		});
		common.fetchApi(
			{
				opcode : 'LOCAL_UPGRADE_UPLOAD',
				data: {
					filename: this.filename,
					file: this.file,
				},
			},
			{
				timeout: 120000,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		);
		await common.fetchApi(
			{
				opcode : 'LOCAL_UPGRADE_STATE',
				data: {
					file_name: this.filename,
				},
			},
			{ method: 'POST' },
			{
				loop: true,
				interval: 3000,
				stop: resp => {},
				pending: resp => this.pendingState(resp),
			},
		);
	}

	render() {
		const { filename, progressActive, duration, loadingVisible, loadingTip, succeedActive } = this.state;
		return (
			<SubLayout className="settings">
				<Form className='localUpgrade-body '>
					<PanelHeader
						title={intl.get(MODULE, 0)/*_i18n:本地升级*/}
						checkable={false}
					/>
					<label className='localUpgrade-label'>{intl.get(MODULE, 1)/*_i18n:选择升级文件*/}</label>
					<div className='localUpgrade-flex'>
						<FormItem className='localUpgrade-formItem' type="small">
							<Input
								type="text"
								value={filename}
								placeholder={intl.get(MODULE, 2)/*_i18n:请选择升级文件*/}
								onChange={this.onChange}
							/>
						</FormItem>
						<Upload
							customRequest={this.customRequest}
						>
							<Button className='upload-button'>{intl.get(MODULE, 3)}</Button>
						</Upload>
					</div>
				</Form>
				<section className="localUpgrade-save">
					<Button
						size="large"
						type="primary"
						disabled={false}
						onClick={this.submit}
						className='save-button'
					>{intl.get(MODULE, 4)/*_i18n:保存*/}</Button>
				</section>
				{progressActive&&<CustomProgress
					duration={duration}
					title={intl.get(MODULE, 10)/*_i18n:正在升级路由器，请耐心等待...*/}
					tips={intl.get(MODULE, 13)/*_i18n:升级过程中请勿断电！*/}
				/>}
				<ModalLoading 
                    visible={loadingVisible}
                    tip={loadingTip}
                />
				<Modal
					visible={succeedActive}
					className='modal-center'
					closable={false}
					centered={true}
					footer={[<Button type="primary" onClick={this.login}>{intl.get(MODULE, 14)/*_i18n:确定*/}</Button>]}
				>
					<CustomIcon type="succeed" size={64} className='succeed-icon'/>
					<h3 className='succeed-tip'>{intl.get(MODULE, 9)/*_i18n:升级成功，请重新连接无线网络*/}</h3>
				</Modal>
			</SubLayout>
		);
	}
}
export default LocalUpgrade;