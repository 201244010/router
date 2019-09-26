import React from 'react';
import { Button, message } from 'antd';
import Upload from 'rc-upload';
import SubLayout from '~/components/SubLayout';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
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

	submit = async() => {
		if (!this.file) {
			message.warning(intl.get(MODULE, 6)/*_i18n:请选择升级版本的文件*/);
			return;
		}
		const response = await common.fetchApi(
			{
				opcode : 'LOCAL_UPGRADE',
				data: {
					filename: this.filename,
					file: this.file,
				},
			},
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		);

		const { errcode } = response;
		if (errcode === -1012) {
			message.error(intl.get(MODULE, 5)/*_i18n:其他升级流程正在进行中*/);
		}
	}

	render() {
		const { filename } = this.state;
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
			</SubLayout>
		);
	}
}
export default LocalUpgrade;