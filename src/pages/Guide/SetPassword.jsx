
import React from 'react';
import Form from '~/components/Form';

const { FormItem, ErrorTip, Input }  = Form;


export default class Steps extends React.Component {
    constructor(props){
        super(props);
    }

    onPassportChange = () => {

    };
    
    render(){
        const { match } = this.props;
        console.log(this.props);
        return (
            <div> 
                <h2>设置管理员密码</h2> 
                <p className="ui-tips">管理员密码是进入路由器管理页面的凭证 {match.params.id} </p>
                <Form style={{width : 340, margin : ' 24px auto'}}>
                    <FormItem label="设置密码">
                        <Input placeholder="请设置密码" onChange = {this.onPassportChange} />
                    </FormItem>
                </Form>
            </div>
        )
    }
};




