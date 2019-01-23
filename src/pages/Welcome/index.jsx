import React from 'react';
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
        return (
            <div className="ui-center ui-fullscreen web-welcome">
                <SwitchLang className='welcome-lang'/>
                <div className='sunmi-logo'>
                    <Icon type="logo" size={40} color="#fff" />
                </div>
                <div className="form-box" style={{ textAlign : 'center' }}>
                    <h1>{intl.get(MODULE, 0)}</h1>
                    <p>{intl.get(MODULE, 1)}</p>
                    <Button
                        type="primary"
                        size='large'
                        disabled={!checked}
                        onClick={this.post}
                        className='btn'
                    >
                        {intl.get(MODULE, 2)}
                    </Button>
                    <div>
                        <Checkbox
                            className='checkbox'
                            checked={checked}
                            onChange={this.onCheckBoxChange}>
                            <span>
                            {intl.getHTML(MODULE, 3)}
                            </span>
                        </Checkbox>
                    </div>
                </div>
            </div>        
        );
    }
}


