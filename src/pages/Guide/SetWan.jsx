import React from 'react';
import { Progress } from 'antd';
import classnames from 'classnames';
import Form from '~/components/Form';
import { Select } from "antd";

const { FormItem, ErrorTip, Input : FormInput  } = Form;
const Option = Select.Option;


export default class SetWan extends React.PureComponent {
    constructor(props){
        super(props);
    }

    state = {
        percent : 0,
        tip : "正在检测是否联网，请稍后...",
        test : true,
        wan : 'pppoe'
    };

    increase = (step = 10) => {
        this.setState(prevState => ({
            percent : prevState.percent + step
        }), function(){
            if(this.state.percent >= 100 && this.timer){
                this.setState({
                    tip : '已连接网络，正在跳转到带宽设置…',
                });
                setTimeout(()=>{
                    this.setState({
                        test : false
                    });
                }, 300)
                clearInterval(this.timer);
            }
        });
    }

    handleChange = value => {
        this.setState({
            wan : value
        });
    };

    componentDidMount(){
       this.timer = setInterval(()=>{
           this.increase();
       }, 300) 
    }

    render(){
        const {tip, test} = this.state;
        return (
            <div className="set-wan">
                <h2>设置管理员密码</h2> 
                <p className="ui-tips guide-tip">管理员密码是进入路由器管理页面的凭证 </p>
                {/* <div className={classnames(["ui-center speed-test", {'none' : !test}])}>
                    <Progress type="circle" gapPosition="bottom" 
                              strokeColor="red"
                              width={100}
                              style={{ marginBottom : 30 }}
                            //   format={percent => `${percent}%`} 
                              percent={this.state.percent} />
                    <h3>{tip}</h3>
                </div> */}
                <div className={classnames(['wan', {'block' : !test}])}>
                    <Form style={{ margin : '0 auto' }}>
                        <FormItem label="上网方式">
                            <Select defaultValue="pppoe" style={{ width: "100%" }} onChange={this.handleChange}>
                                <Option value="pppoe">宽带账号上网（PPPoE）</Option>
                                <Option value="dhcp">自动获取IP（DHCP）</Option>
                                <Option value="ip">手动输入IP（静态IP）</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
};






