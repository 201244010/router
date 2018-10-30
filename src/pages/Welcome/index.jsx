
import React from 'react';
import { Button ,Checkbox, Modal} from 'antd';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
 
    state ={

        loading:false,
        checkBox : true,
        disabled : false
    }

    post = async () => {
        this.props.history.push('/guide');
    }

    onCheckBoxChange = e =>{
        this.setState({
            checkBox : e.target.checked,
            disabled : !e.target.checked
        })
    }

    render() {
        const {loading,checkBox,disabled} = this.state;
        return (
            <div key='welcome-content' className="ui-center ui-fullscreen">
                <div className="form-box" style={{ textAlign : 'center' }}>
                    <h1 style={{fontSize :46,fontFamily: 'PingFangSC-Semibold',color: '#FFFFFF',textAlign: 'center',lineHeight: '46px',marginBottom:15}}>欢迎使用商米路由器</h1>
                    <div>
                        <span style={{fontFamily: 'PingFangSC-Regular',fontSize: 18,color: '#FFFFFF'}}>简单几步设置，路由器就可以上网啦</span>
                    </div>
                    <Button type="primary" size='large' disabled={disabled} onClick={this.post} style={{ margin: "39px 0 12px", width: 320 }} loading={loading}>
                        开始设置
                    </Button>
                    <div>
                        <Checkbox style={{color:'#FFFFFF',fontFamily: 'PingFangSC-Regular',fontSize: 14}} checked={checkBox} onChange={this.onCheckBoxChange}>同意《<a href='/agreement/user.html' target='_blank' style={{textDecoration:'underline'}}>商米用户协议</a>》和《<a href='/agreement/secret.html' target='_blank' style={{textDecoration:'underline'}}>隐私政策</a>》</Checkbox>
                    </div>
                </div>
            </div>        
        );
    }
}


