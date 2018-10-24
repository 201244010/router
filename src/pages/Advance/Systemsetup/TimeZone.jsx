import React, {Component} from 'react';
import {Radio, Select, DatePicker, TimePicker, Button} from 'antd';
import {getNowTimeStr} from '../../../utils';
import timeZones from '../../../assets/common/timezone';
import {NO_ERROR} from '../../../assets/common/constants';
import './TimeZone.scss';

const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class TimeZone extends Component {
    state = {
        nowTime: getNowTimeStr(),
        enable: '',
        timezone: '',
        time: ''
    };

    componentDidMount() {
        this._initTimeCounter();
        this._fetchTimeConfig();
    }

    componentWillUnmount() {
        clearInterval(this.timeCounter);
    }

    render() {
        const {nowTime, enable, timezone} = this.state;

        return (
            <div className="time-zone-wrapper">
                <p className="item-wrapper">当前系统时间：{nowTime}</p>
                <div className="item-wrapper">
                    <p className="title">系统时间获取方式</p>
                    <RadioGroup onChange={this.onTypeChange} value={enable}>
                        <Radio value="1">通过网络获取（推荐）</Radio>
                        <Radio value="0">手动设置</Radio>
                    </RadioGroup>
                </div>
                {
                    enable === '1' ?
                        <div className="item-wrapper">
                            <p className="title">选择时区</p>
                            <Select style={{width: '60%'}} value={timezone}>
                                {
                                    timeZones.map(item => (
                                        <Option key={item[0]}>{item[1]}</Option>
                                    ))
                                }
                            </Select>
                        </div> :
                        <div className="item-wrapper">
                            <p className="title">选择时间</p>
                            <DatePicker style={{marginRight: 16}}/>
                            <TimePicker/>
                        </div>
                }
                <div className="btn-wrapper">
                    <Button onClick={this.onSave}>保存</Button>
                </div>
            </div>
        );
    }

    onTypeChange = (e) => {
        this.setState({
            enable: e.target.value
        });
    };

    onSave = () => {

    };

    _initTimeCounter = () => {
        clearInterval(this.timeCounter);
        this.timeCounter = setInterval(() => {
            this.setState({
                nowTime: getNowTimeStr()
            });
        }, 1000);
    };

    _fetchTimeConfig = () => {
        common.fetchApi({ opcode: 'TIME_SET'}).then((response) => {
            const {errcode, time} = response;
            if (errcode === NO_ERROR) {
                this.setState({
                    enable: time.enable || '1',
                    timezone: time.timezone || 'CST-8$1',
                    time: time.time
                });
            }
        });
    };
}