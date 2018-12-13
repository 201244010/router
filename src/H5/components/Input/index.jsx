import React from 'react';
import PropTypes from 'prop-types';

import './input.scss';

const ErrorTip = props => <div style={props.style} className="h5-form-tip">{props.value}</div>;

class Input extends React.Component{
    
    onChange = e => {
        this.props.onChange(e.target.value);
    };

    render(){
        return(
            <div
                className = 'h5-input-outline'>
                <input
                    className = { this.props.className || 'h5-input-content'}
                    type = {this.props.type}
                    value = {this.props.value}
                    maxLength = {this.props.maxLength}
                    onChange = {this.onChange}
                    disabled={this.props.disabled}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
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

    static defaultProps = {
        tip: ''
    };

    static propTypes = {
        type: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxLength: PropTypes.number,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        tip: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        hieght: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };

    onChange = e => {
        this.props.onChange(e.target.value);
    };

    render(){
        const classes = this.props.tip !== ''? "has-error" : '';
        return (
            <div
                style = {this.props.style}
                className = 'h5-input'>
                <Input
                    className = {classes}
                    type = {this.props.type}
                    value = {this.props.value}
                    maxLength = {this.props.maxLength}
                    onChange = {this.onChange}
                    disabled={this.props.disabled}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                />
                <ErrorTip value = {this.props.tip} />
            </div> 
        );
    }
    
};

export default Form;