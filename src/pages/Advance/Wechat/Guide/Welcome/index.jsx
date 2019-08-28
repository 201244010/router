import React from 'react';
import { Button, Upload, Icon, message } from 'antd';

import Preview from './Preview';
import Form from '~/components/Form';
import { checkStr, checkRange } from '~/assets/common/check';
import { get } from '~/assets/common/auth';

const MODULE = 'wechatWelcome';
const { FormItem, Input, ErrorTip } = Form;

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        logo_img: '',
        bg_img: '',
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
                if (403 == file.error.status) {
                    this.props.history.push('/login');
                    return;
                }

                message.error('上传失败，请检查图片格式、大小是否符合要求');
                break;
        }
    }

    beforeUpload = (file) => {
        let name = file.name;
        if (/\.png$|\.jpe?g$/i.test(name)) {
            return true;
        }

        message.error('只支持.jpg .jpeg .png格式的图片');
        return false;
    }

    onChange = (name, value) => {
        let check = {
            logo: {
                func: checkStr(value, { who: 'logo信息', min: 1, max: 15 })
            },
            welcome: {
                func: checkStr(value, { who: '欢迎信息', min: 1, max: 30 })
            },
            btnStr: {
                func: checkStr(value, { who: '提示文字', min: 1, max: 15 })
            },
            statement: {
                func: checkStr(value, { who: '版权声明', min: 1, max: 30 })
            },
        };

        let tip = check[name].func;
        this.setState({
            [name]: value,
            [name + 'Tip']: tip,
        });
    }

    async fetchConf() {
        let response = await common.fetchApi({ opcode: 'AUTH_WEIXIN_CONFIG_GET' });
        let { errcode, data } = response;

        if (errcode == 0) {
            const { logo_info, logo_img, bg_img, welcome, login_hint, statement } = data[0].result.weixin;
            this.setState({
                logo: logo_info,
                logo_img: `${logo_img}?${Math.random()}`,
                bg_img: `${bg_img}?${Math.random()}`,
                welcome: welcome,
                btnStr: login_hint,
                statement: statement,
            });
        }
    }

    nextStep = () => {
        const { logo, welcome, btnStr, statement, logo_img, bg_img } = this.state;
        let data = { logo, welcome, btnStr, statement, logo_img, bg_img };
        let param = JSON.stringify(data);
        let path = this.props.match.path;
        let parent = path.substr(0, path.lastIndexOf('/'));

        window.sessionStorage.setItem('wechat.welcome', param);

        this.props.history.push(`${parent}/account/` + encodeURIComponent(param));
    }

    componentDidMount() {
        const val = window.sessionStorage.getItem('wechat.welcome');

        if (val) {  //sessionStorage.getItem('wechat.welcome') 存在时
            const { logo, welcome, btnStr, statement, logo_img, bg_img } = JSON.parse(val);
            this.setState({
                logo: logo,
                welcome: welcome,
                btnStr: btnStr,
                statement: statement,
                logo_img: logo_img,
                bg_img: bg_img
            });
            return;
        }
 
        this.fetchConf();
    }

    render() {
        const {
            logo_img, bg_img,
            logo, welcome, btnStr, statement, 
            logoImgList, bgImgList
        } = this.state;

        const { logoTip, welcomeTip, btnStrTip, statementTip } = this.state;

        let disabled = [logoTip, welcomeTip, btnStrTip, statementTip].some(tip => tip.length > 0)
                        || [logo, welcome, btnStr, statement].some(item => '' === item);

        return (
            <React.Fragment>
                <div className='setup-content'>
                    <p className='help'>{intl.get(MODULE, 0)/*_i18n:顾客在连接客用Wi-Fi时可以看到此欢迎页，您可以在此页展示自己的品牌*/}</p>
                    <Form style={{ margin: 0, padding: 0 }}>
                        <div className='file-upload'>
                            <Upload
                                onChange={(file) => {
                                    this.handleUploadChange(file, 'logoImgList', 'logo_img');
                                }}
                                accept='.jpg,.jpeg,.png'
                                name='file'
                                fileList={this.state.logoImgList}
                                data={{ opcode: '0x2086' }}
                                action={__BASEAPI__}
                                uploadTitle={'上传Logo图'}
                                multiple={false}
                                headers={{
                                    'XSRF-TOKEN': get(),
                                }}
                                beforeUpload={this.beforeUpload}
                            >
                                <Button><Icon type="upload" />{intl.get(MODULE, 1)/*_i18n:上传Logo图*/}</Button>
                            </Upload>
                            <p>{intl.get(MODULE, 2)/*_i18n:图片格式：.jpg .jpeg .png；最大上传大小：128KB*/}</p>
                            <Upload
                                onChange={(file) => {
                                    this.handleUploadChange(file, 'bgImgList', 'bg_img');
                                }}
                                accept='.jpg,.jpeg,.png'
                                name='file'
                                fileList={this.state.bgImgList}
                                data={{ opcode: '0x2087' }}
                                action={__BASEAPI__}
                                multiple={false}
                                headers={{
                                    'XSRF-TOKEN': get(),
                                }}
                                uploadTitle={'上传背景图'}
                                beforeUpload={this.beforeUpload}
                            >
                                <Button><Icon type="upload" />{intl.get(MODULE, 3)/*_i18n:上传背景图*/}</Button>
                            </Upload>
                            <p>{intl.get(MODULE, 4)/*_i18n:图片格式：.jpg .jpeg .png；最大上传大小：512KB*/}</p>
                        </div>

                        <label>Logo信息</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={logoTip}>
                                <Input type="text" maxLength={15} placeholder={intl.get(MODULE, 5)/*_i18n:图片格式：请输入Logo信息*/} value={logo} onChange={(value) => this.onChange('logo', value)} />
                                <ErrorTip>{logoTip}</ErrorTip>
                            </FormItem>
                            <Help>{intl.get(MODULE, 6)/*_i18n:1~15个字符*/}</Help>
                        </div>

                        <label>{intl.get(MODULE, 7)/*_i18n:欢迎信息*/}</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={welcomeTip}>
                                <Input
                                    type="text"
                                    placeholder={intl.get(MODULE, 8)/*_i18n:请输入欢迎信息*/} 
                                    value={welcome}
                                    onChange={(value) => this.onChange('welcome', value)}
                                    />
                                <ErrorTip>{welcomeTip}</ErrorTip>
                            </FormItem>
                            <Help>{intl.get(MODULE, 9)/*_i18n:1~30个字符*/}</Help>
                        </div>

                        <label>{intl.get(MODULE, 10)/*_i18n:登录按钮提示文字*/}</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={btnStrTip}>
                                <Input
                                    type="text"
                                    maxLength={15}
                                    placeholder={intl.get(MODULE, 11)/*_i18n:请输入登陆按钮提示文字*/}
                                    value={btnStr}
                                    onChange={(value) => this.onChange('btnStr', value)}
                                    />
                                <ErrorTip>{btnStrTip}</ErrorTip>
                            </FormItem>
                            <Help>{intl.get(MODULE, 12)/*_i18n:1~15个字符*/}</Help>
                        </div>

                        <label>{intl.get(MODULE, 13)/*_i18n:版权声明*/}</label>
                        <div className='form-item'>
                            <FormItem type="small" showErrorTip={statementTip} style={{marginBottom: 0}}>
                                <Input
                                    type="text"
                                    maxLength={30}
                                    placeholder={intl.get(MODULE, 14)/*_i18n:请输入版权声明*/}
                                    value={statement}
                                    onChange={(value) => this.onChange('statement', value)}
                                    />
                                <ErrorTip>{statementTip}</ErrorTip>
                            </FormItem>
                            <Help>{intl.get(MODULE, 15)/*_i18n:1~30个字符*/}</Help>
                        </div>
                        <div className='separate-line'></div>
                        <Preview
                            bgImg={bg_img}
                            logoImg={logo_img}
                            logo={logo}
                            welcome={welcome}
                            btnStr={btnStr}
                            statement={statement}
                        />
                    </Form>
                </div>
                <section className="save-area">
                    <Button
                        type="primary"
                        size="large"
                        disabled={disabled}
                        onClick={this.nextStep}
                    >{intl.get(MODULE, 16)/*_i18n:下一步*/}</Button>
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
