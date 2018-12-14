import React from 'react';
import PropTypes from 'prop-types';

import './form.scss';

const ErrorTip = props => <div style={props.style} className="sm-form-tip">{props.value}</div>;

class Input extends React.Component{
    
    onChange = e => {
        this.props.onChange(e.target.value);
    };

    render(){
        const { className, type, value, maxLength, disabled, name, placeholder } = this.props;

        return(
            <div className='sm-input-outline'>
                <input
                    className={ `sm-input-content ${className}`}
                    type={type}
                    value={value}
                    maxLength={maxLength}
                    onChange={this.onChange}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                    autocomplete="new-password" // 修复chrome上密码自动填充问题
                /> 
            </div>
        );
    }   
}

class Form extends React.Component{
    constructor(props){
        super(props);
    }

    static propTypes = {
        type: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxLength: PropTypes.number,
        onChange: PropTypes.func,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        tip: PropTypes.string,
    };

    onChange = e => {
        this.props.onChange(e.target.value);
    };

    render(){
        const { style, type, value, maxLength, disabled, name, placeholder, tip } = this.props;
        const classes = this.props.tip !== ''? "has-error" : '';
        return (
            <div style={style} className='sm-form'>
                <Input
                    className={classes}
                    type={type}
                    value={value}
                    maxLength={maxLength}
                    onChange={this.onChange}
                    disabled={disabled}
                    name={name}
                    placeholder={placeholder}
                />
                <ErrorTip value={tip} />
            </div> 
        );
    }
    
};

export default Form;