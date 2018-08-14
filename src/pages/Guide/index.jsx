
import React from 'react';
import { Select, Button, Checkbox } from "antd";
import Grid from '~/components/Grid';
import Steps from './Steps';

import './guide.scss';

const Option = Select.Option;

// console.log(common.getTimeZone());

export default class Guide extends React.Component {
    constructor(props){
        super(props);
        this.timezones = common.TIMEZONES;
        this.localeZone = common.getTimeZone();
        this.reg = /CST([-+][\w|\.]+(?=\$))/;
        // this.zone = this.timezones.find(item => item[0].match(this.reg)[1] == this.localeZone);
    }

    state = {
        checked : true
    };

    handleChange  = value => {
        const zone = value.match(this.reg);
        return zone[1];
    };

    join = (e)=>{
        this.setState({
            checked: e.target.checked,
        });
    }

    // render(){
    //     // const timezones = this.timezones;
    //     return (
    //         <div className="ui-center ui-fullscreen guide">
    //             <h1 className="ui-title">欢迎使用商米路由器</h1>
    //             <h2>简单几步设置，路由器就可以上网啦</h2>
    //             {/* <Select defaultValue={this.zone} style={{ width: 420, margin : "20px 0" }} onChange={this.handleChange}>
    //             { timezones.map( (item, i) => <Option key={item[0]}>{item[1]}</Option> ) }
    //             </Select> */}
    //             <Button style={{margin : "20px 0 10px", padding : "0 50px"}} type="primary">开始设置</Button>
    //             <Checkbox checked={this.state.checked} onChange={this.join}>加入用户体验计划</Checkbox>
    //         </div>
    //     );
    // }

    render(){
        return (
            <Grid className="steps">
                <ul className="guide-header">
                    <li className="now">
                        <i className="ui-ib">1</i>
                        <span className="ui-ib">设置密码</span>
                    </li>
                    <li className="line"></li>
                    <li>
                        <i className="ui-ib">2</i>
                        <span className="ui-ib">设置上网参数</span>
                    </li>
                    <li className="line"></li>
                    <li>
                        <i className="ui-ib">3</i>
                        <span className="ui-ib">设置上下行宽带</span>
                    </li>
                    <li className="line"></li>
                    <li>
                        <i className="ui-ib">4</i>
                        <span className="ui-ib">设置无线网络</span>
                    </li>
                </ul>
                <div className="guide-body">
                    fdafsd
                </div>
            </Grid>
        );
    }

}







