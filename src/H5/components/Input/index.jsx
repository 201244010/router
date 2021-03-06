import React from 'react';
import PropTypes from 'prop-types';

import './input.scss';

const ErrorTip = props => <div style={props.style} className="sm-form-tip">{props.value}</div>;

class Input extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        hidden : true,
        type: this.props.type,
    };

    HandleVisibilityChange = ()=>{
        this.setState((prevState, prop)=>({
            hidden : !prevState.hidden,
            type : !prevState.hidden ? 'password' : 'text'
        }));
        if(this.props.visibilitychange){
            this.props.visibilitychange(this.state.hidden);
        }
    };

    onChange = e => {
        this.props.onChange(e.target.value);
    };

    render() {
        let {hidden} = this.state;
        const { className, value, maxLength, disabled, name, placeholder, style, inputName, tip } = this.props;
        const classes = this.props.tip !== ''? "has-error" : '';

        return (
            <div style={style} className='sm-form'>
                {inputName && <label className='input-name'>{inputName}</label>}
                <div className='sm-input-outline'>
                    {
                        this.props.type === 'password'? [
                            <i key="eye-open" className="ui-icon ui-icon-eye-open" 
                                style={{ display :  hidden ? 'block' : 'none'}} 
                                onClick={this.HandleVisibilityChange}>
                            </i>,
                            <i key="eye-close" className="ui-icon ui-icon-eye-close" 
                                style={{ display :  !hidden ? 'block' : 'none'}} 
                                onClick={this.HandleVisibilityChange}>
                            </i>
                        ] : ""
                    }
                    <input
                        className={ `sm-input-content ${className} ${classes}`}
                        type={this.state.type}
                        value={value}
                        maxLength={maxLength}
                        onChange={this.onChange}
                        disabled={disabled}
                        name={name}
                        placeholder={placeholder}
                        autoComplete="new-password" // 修复chrome上密码自动填充问题
                    />
                </div>
                <ErrorTip value={tip} />
            </div>
        );
    }   
}

export default Input;