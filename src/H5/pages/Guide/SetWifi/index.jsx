import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';

export default class SetWifi extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        loading: true,
    }

    nextStep = () => {
        this.props.history.push('/home');
    };

    render() {
        const { loading, wanType } = this.state;

        return (
            <div>
                <GuideHeader title='设置商户Wi-Fi' tips='这是说明文字这是说明文字这是说明文字' />
                <form>
                    <Button type='primary' loading={loading} onClick={this.nextStep}>下一步</Button>
                </form>
            </div>
        )
    }
}