import React from 'react';
import { Select, Button } from 'antd';
import timeZones from '~/assets/common/timezone';

import './timezone.scss';

const Option = Select.Option;
const children = timeZones.map(item => {
    return <Option value={item[0]}>{item[1]}</Option>
});

export default class TimeZone extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        timezone: 'GMT',
        loading: false,
    };

    onChange = value => {
        this.setState({timezone: value});
    }

    nextStep = async() => {
        let data = {
            time: {
                enable: '1',
                timezone: this.state.timezone,
            }
        };

        this.setState({loading: true});
        let response = await common.fetchApi(
            {
                opcode: 'TIME_SET',
                data: data,
            },
        );
        this.setState({loading: false});
        
        const {errcode} = response;
        if (0 === errcode) {
            const {match} = this.props;
            this.props.history.push("/guide/setwan");
        }
    }

    render() {
        const { timezone, loading } = this.state;

        return (
            <div className='guide-timezone'>
                <h2>时区</h2>
                <p className="ui-tips guide-tip">这个是时区</p>
                <div className='content'>
                    <span>时区</span>
                    <Select defaultActiveFirstOption={false} style={{width: 400, marginLeft: 12}} value={timezone} onChange={this.onChange}>
                        {children}
                    </Select>
                    <div>
                        <Button type='primary' className='btn' loading={loading} onClick={this.nextStep} >下一步</Button>
                    </div>   
                </div>
            </div>
        );
    }
}