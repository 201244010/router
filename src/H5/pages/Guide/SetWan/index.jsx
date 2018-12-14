import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';
import Loading from 'h5/components/Loading';
import confirm from 'h5/components/confirm';

export default class SetWan extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        visible: true,
        loading: true,
    }

    onOk = () => {
        console.log('onOk');
        this.props.history.push('/guide/setwifi');
    }

    onCancel = () => {
        console.log('onCancel');
        this.setState({
            visible: true,
        }, this.timingClose);
    }

    nextStep = () => {
        // 实力代码：confirm
        confirm({
            title: '无法连接网络',
            content: '请检查您的网线是否插好',
            cancelText: '继续设置',
            okText: '重新检测',
            okButtonProps: {
                onClick: this.onOk,
            },
            cancelButtonProps: {
                onClick: this.onCancel,
            }
        });

        //this.props.history.push('/guide/setwifi');
    };

    timingClose = () => {
        // 实力代码：Loading
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, 3000);
    }

    componentDidMount() {
        this.timingClose();
    }

    render() {
        const { loading, visible } = this.state;

        return (
            <div>
                <GuideHeader title='宽带拨号上网（PPPOE）' tips='这是说明文字这是说明文字这是说明文字' />
                <Loading visible={visible} content='正在检测上网方式，请稍候...' />
                <div><Button type='primary' loading={loading} onClick={this.nextStep}>下一步</Button></div>
            </div>
        )
    }
}