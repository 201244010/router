import React from 'react';
import { Button, Upload, Icon, message } from 'antd';

import Form from '~/components/Form';
const { FormItem, Input, ErrorTip } = Form;

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        logoImg: '',
        bgImg: '',
        logo: '',
        logoTip: '',
        welcome: '',
        welcomeTip: '',
        btnStr: '',
        btnStrTip: '',
        statement: '',
        statementTip: '',
        logoImgList: [],
        bgImgList: [],
        loading: false,
    }

    updateImg = async (key) => {
        let response = await common.fetchApi({ opcode: 'AUTH_WEIXIN_CONFIG_GET' });
        let { errcode, data } = response;
        if (errcode == 0) {
            const img = data[0].result.weixin[key];
            this.setState({
                [key]: `${img}?${Math.random()}`
            })
        }
    }

    handleUploadChange = (info, fileKey, imgKey) => {
        let fileList = info.fileList;

        // 1. Limit the number of uploaded files
        fileList = fileList.slice(-1);

        //2.Filter successfully uploaded files according to response from server
        fileList = fileList.filter((file) => {
            const type = file.type;
            return (type === 'image/png' || type === 'image/jpeg');
        });

        this.setState({ [fileKey]: fileList });

        const file = info.file;
        switch (file.status) {
            case 'done':
                if (0 === file.response.errcode) {
                    message.success('上传成功');
                    this.updateImg(imgKey);
                } else {
                    message.error('上传失败，请检查图片格式、大小是否符合要求');
                }
                break;
            case 'error':
                message.error('上传失败，请检查图片格式、大小是否符合要求');
                break;
        }
    }

    beforeUpload = (file) => {
        let type = file.type;
        if (type === "image/png" || type === "image/jpeg") {
            return true;
        }

        message.error('只支持.jpg、.png后缀的图片');
        return false;
    }

    render() {
        const {
            logoImg, bgImg,
            logo, welcome, btnStr, statement, 
            logoImgList, bgImgList, loading
        } = this.state;

        const { logoTip, welcomeTip, btnStrTip, statementTip } = this.state;

        let disabled = [logoTip, welcomeTip, btnStrTip, statementTip].some(tip => tip.length > 0);

        return (
            <React.Fragment>
                <div className='setup-content'>
                    <p className='help'>欢迎页是顾客手动选择Wi-Fi之后，自动弹出的页面，此页可展示您的品牌</p>
                    <Form style={{ margin: 0, padding: 0 }}>
                        <div className='file-upload'>
                            <Upload
                                onChange={(file) => {
                                    this.handleUploadChange(file, 'logoImgList', 'logoImg');
                                }}
                                name='file'
                                fileList={this.state.logoImgList}
                                data={{ opcode: '0x2086' }}
                                action={__BASEAPI__}
                                uploadTitle={'上传Logo图'}
                                multiple={false}
                                beforeUpload={this.beforeUpload}
                            >
                                <Button><Icon type="upload" />上传Logo图</Button>
                            </Upload>
                            <p>支持扩展名：.jpg .png；最大上传大小：128KB</p>
                            <Upload
                                onChange={(file) => {
                                    this.handleUploadChange(file, 'bgImgList', 'bgImg');
                                }}
                                name='file'
                                fileList={this.state.bgImgList}
                                data={{ opcode: '0x2087' }}
                                action={__BASEAPI__}
                                multiple={false}
                                uploadTitle={'上传背景图'}
                                beforeUpload={this.beforeUpload}
                            >
                                <Button><Icon type="upload" />上传背景图</Button>
                            </Upload>
                            <p>支持扩展名：.jpg .png；最大上传大小：512KB</p>
                        </div>

                        <label>Logo信息</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={logoTip}>
                                <Input type="text" maxLength={15} placeholder={'请输入Logo信息'} value={logo} onChange={(value) => this.onChange('logo', value)} />
                                <ErrorTip>{logoTip}</ErrorTip>
                            </FormItem>
                            <Help>1~15个字符</Help>
                        </div>

                        <label>欢迎信息</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={welcomeTip}>
                                <Input
                                    type="text"
                                    placeholder={'请输入欢迎信息'} 
                                    value={welcome}
                                    onChange={(value) => this.onChange('welcome', value)}
                                    />
                                <ErrorTip>{welcomeTip}</ErrorTip>
                            </FormItem>
                            <Help>1~30个字符</Help>
                        </div>

                        <label>登录按钮提示文字</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={btnStrTip}>
                                <Input
                                    type="text"
                                    maxLength={15}
                                    placeholder={'请输入登陆按钮提示文字'}
                                    value={btnStr}
                                    onChange={(value) => this.onChange('btnStr', value)}
                                    />
                                <ErrorTip>{btnStrTip}</ErrorTip>
                            </FormItem>
                            <Help>1~15个字符</Help>
                        </div>

                        <label>版权声明</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={statementTip}>
                                <Input
                                    type="text"
                                    maxLength={30}
                                    placeholder={'请输入版权声明'}
                                    value={statement}
                                    onChange={(value) => this.onChange('statement', value)}
                                    />
                                <ErrorTip>{statementTip}</ErrorTip>
                            </FormItem>
                            <Help>1~30个字符</Help>
                        </div>
                    </Form>
                </div>
                <section className="save-area">
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        disabled={disabled}
                        onClick={this.submit}
                    >下一步</Button>
                </section>
            </React.Fragment>
        );
    }
}

const Help = function(props) {
    return (
        <span className='input-help'>{props.children}</span>
    );
}
