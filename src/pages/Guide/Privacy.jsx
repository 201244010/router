
import React from 'react';


export default class Steps extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const { match } = this.props;
        console.log(this.props);
        return (
            <div> 
                <h2>设置管理员密码</h2> 
                <p className="ui-tips">管理员密码是进入路由器管理页面的凭证 {match.params.id} </p>
            </div>
        )
    }
};




