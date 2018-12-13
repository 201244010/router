import React from 'react';
import GuideHeader from 'h5/components/GuideHeader';
import Button from 'h5/components/Button';

export default class SetWan extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        loading: true,
    }

    nextStep = () => {
        this.props.history.push('/guide/setwifi');
    };

    render() {
        const { loading } = this.state;

        return (
            <div>
                <GuideHeader title='宽带拨号上网（PPPOE）' tips='这是说明文字这是说明文字这是说明文字' />
                <div><Button type='primary' loading={loading} onClick={this.nextStep}>下一步</Button></div>
            </div>
        )
    }
}