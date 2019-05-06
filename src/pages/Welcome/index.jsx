import React from 'react';
import {Link} from "react-router-dom";
import { Button, Checkbox } from 'antd';
import Icon from '~/components/Icon';
import SwitchLang from '~/components/SwitchLang';
import './welcome.scss';

const MODULE = 'welcome';

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
        const {match} = this.props;
        console.log(match);
        return (
            <div className="ui-center ui-fullscreen web-welcome" style={{height: window.innerHeight - 76}}>
                <SwitchLang className='welcome-lang'/>
                <div className='sunmi-logo'>
                    <Icon type="logo" size={40} color="#fff" />
                </div>
                <div className="form-box" style={{ textAlign : 'center' }}>
                    <h1>{intl.get(MODULE, 0)/*_i18n:欢迎使用商米路由器*/}</h1>
                    <p>{intl.get(MODULE, 1)/*_i18n:简单几步设置，路由器就可以上网啦*/}</p>
                    <Button
                        type="primary"
                        size='large'
                        disabled={!checked}
                        onClick={this.post}
                        className='btn'
                    >
                        {intl.get(MODULE, 2)/*_i18n:开始设置*/}
                    </Button>
                    <div>
                        <Checkbox
                            checked={checked}
                            onChange={this.onCheckBoxChange}>
                            <span className='checkbox' >{intl.get(MODULE, 3)/*_i18n:同意*/}《<Link to={`/agreement/user`} target='_blank'>{intl.get(MODULE, 4)/*_i18n:《商米用户协议》*/}</Link>》{intl.get(MODULE, 5)/*_i18n:和*/}《<Link to={`/agreement/secret`} target='_blank'>{intl.get(MODULE, 6)/*_i18n:《隐私政策》*/}</Link>》</span>
                        </Checkbox>
                    </div>
                </div>
            </div>        
        );
    }
}


