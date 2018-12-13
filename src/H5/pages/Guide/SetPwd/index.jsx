import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';

export default class SetPwd extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        loading: true,
    }

    nextStep = () => {
        this.props.history.push('/guide/setwan');
    };

    render() {
        const {loading}  = this.state;

        return (
            <div>
                <GuideHeader title='设置管理密码' tips='管理员密码是进入路由器管理页面的凭证' />
                <div><Button type='primary' loading={loading} onClick={this.nextStep}>下一步</Button></div>
            </div>
        )
    }
}