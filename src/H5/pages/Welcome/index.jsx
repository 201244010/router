
import React from 'react';
import { Button, Checkbox } from 'antd';
import Icon from '~/components/Icon';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
 
    state ={
        checked : true,
    }

    post = async () => {
        this.props.history.push('/guide');
    }

    onCheckBoxChange = e =>{
        this.setState({
            checked : e.target.checked,
        })
    }

    render() {
        const { checked } = this.state;
        return (
            <div className="ui-center ui-fullscreen">
                <div style={{
                    position: 'absolute',
                    left: '2.5%',
                    top: '3.6%',
                }}>
                    <Icon type="logo" size={40} color="#fff" />
                </div>
                <div className="form-box" style={{ textAlign : 'center' }}>
                    <h1 style={{
                        fontSize :46,
                        color: '#FFF',
                        textAlign: 'center',
                        lineHeight: '46px',
                        marginBottom:12
                    }}>欢迎使用商米路由器</h1>
                    <p style={{ fontSize: 18, color: '#FFF' }}>简单几步设置，路由器就可以上网啦</p>
                    <Button
                        type="primary"
                        size='large'
                        disabled={!checked}
                        onClick={this.post}
                        style={{ margin: "40px 0 12px", width: 320, height:42 }}>
                        开始设置
                    </Button>
                    <div>
                        <Checkbox
                            style={{ color: '#FFF' }}
                            checked={checked}
                            onChange={this.onCheckBoxChange}>
                            <span style={{opacity:'0.6'}}>
                            同意《<a href='/agreement/user.html' target='_blank' style={{textDecoration:'underline'}}>商米用户协议</a>》
                            和
                            《<a href='/agreement/secret.html' target='_blank' style={{textDecoration:'underline'}}>隐私政策</a>》
                            </span>
                        </Checkbox>
                    </div>
                </div>
            </div>        
        );
    }
}


