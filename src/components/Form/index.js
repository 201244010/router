import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './form.scss';

const ErrorTip = props => <div style={props.style} className="ui-form-explain">{props.children}</div>;

const FormItem = props => {
    const showErrorTip = props.showErrorTip || props.errorTip;
    const suffix = props.suffix;
    const labelStyle = props.labelStyle || {width: 0};
    const inputStyle = props.inputStyle || {};
    const klass = classnames([
        'ui-form-item',
        { 
            'ui-form-item-with-help' :  showErrorTip, 
            "has-error" : showErrorTip,
            "ui-form-item-small" : props.type === 'small',
        },
        props.className,
    ]);
    return (
        <div className={klass} style={props.style} >
            { 
                (props.label || props.label == '#') ? [
                <div key={'label'} className="ui-form-item-label ui-ib" style={labelStyle} >{props.label === '#' ? '' : props.label}</div>,
                <div key={'input'} className="ui-form-item-field ui-ib" style={inputStyle}>
                    {props.children}
                    { suffix ? <div className="ui-form-item-suffix">{suffix}</div> : "" }
                </div>] :
                <div className="ui-form-item-field">{props.children}</div> 
            }
        </div>
    )
};


const Form = props => {
    const blockSubmit = (e) => {e.preventDefault()};
    return (
        <form className={`ui-form ${props.className}`} style={props.style} onSubmit={blockSubmit} >
            {props.children}
        </form>
    );
};


class Input extends React.Component {
    constructor(props){
        super(props);
    }

    static defaultProps = {
        type : 'password',
    };

    state = {
        hidden : true,
        type : this.props.type
    };

    static propTypes = {
        size : PropTypes.string,
        maxLength : PropTypes.number,
        type : PropTypes.string,
        onChange : PropTypes.func.isRequired,
        name : PropTypes.string,
        value : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onBlur : PropTypes.func,
        onEnter : PropTypes.func,
        disabled : PropTypes.bool,
        width : PropTypes.oneOfType([PropTypes.string, PropTypes.number ]),
        visibilityChange : PropTypes.func,
        placeholder : PropTypes.string,
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

    handleChange = e => {
        this.props.onChange(e.target.value);
    };

    handleKeyPress  = e => {
        if(e.which === 13 && this.props.onEnter){
            this.props.onEnter();
        }
    }

    handleBlur = e => {
        if(this.props.onBlur){
            this.props.onBlur(e.target.value);
        }
    }
    
    render(){
        let hidden = this.state.hidden;
        let classes = this.props.size ? [{[this.props.size] : true}, "ui-input"] : ["ui-input"];
        let checkDisabled = this.props.disabled ? 'ui-input-disabled':''; //disabled 为true 时，字体颜色透明度为30%
        return (
            <div className={`ui-input-outline ${checkDisabled}`} style={{ width : this.props.width }}>
                {
                    this.props.type === 'password' ? [
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
                    className={classnames(classes)}
                    onBlur={this.handleBlur}
                    maxLength={this.props.maxLength}
                    onKeyPress={this.handleKeyPress}
                    onChange={this.handleChange} 
                    value={this.props.value}
                    disabled={this.props.disabled}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    autoComplete="new-password" // 修复chrome上密码自动填充问题
                    type={this.state.type}
                />
            </div>
        );
    }
};


class InputGroup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputs : this.props.inputs,
            focus : false
        };
    }

    static getDerivedStateFromProps(props){
        return {
            inputs : props.inputs
        }
    }

    static propTypes = {
        size : PropTypes.string,
        type : PropTypes.string,
        inputs : PropTypes.array.isRequired,
        onChange : PropTypes.func.isRequired,
        disabled : PropTypes.bool
    };

    static defaultProps = {
        type : 'ip'
    }

    onInputChange = (e, i, it) => {
        const target = e.target;
        const inputs = this.state.inputs;
        const item = inputs.find(item => item === it);

        let val = target.value, goNext = false;
        if ('ip' === this.props.type) {
            let len = val.length;
            goNext = (len >= 2 && '.' === val[len - 1]);
            val = val.replace(/\D*/g, '');
        } else {
            val = val.replace(/[^0-9a-f]*/gi, '').toUpperCase();
        }

        item.value = val;
        this.setState({ inputs });
        if(this.props.onChange){
            const values = inputs.map(input => input.value);
            this.props.onChange(values, this.state.inputs);
        }

        // 自动focus到下一个Input
        const maxLen = target.getAttribute('maxLength');
        if (goNext || (maxLen && val.length >= maxLen)) {
            let next = target.nextElementSibling;
            if (next) {
                next = next.nextElementSibling.focus();
            }
        }
    }

    onInputFocus = (e, i , it) => {
        const inputs = this.state.inputs;
        const item = inputs.find(input => input === it);
        item.focus = true;
        this.setState({ inputs }, function(){
            // console.log('focus', this.formItemFocus(), this.state.inputs);
            if(this.formItemFocus()){
                this.setState({
                    focus : true
                });
            }
        });
        // console.log('focus');
    }

    onInputBlur = (e, i, it) => {
        const inputs = this.state.inputs;
        const item = inputs.find(input => input === it);
        item.focus = false;
        this.setState({ inputs }, () => {
            // console.log('blur', this.formItemBlur(), this.state.inputs);
            if(this.formItemBlur()){
                this.setState({
                    focus : false
                });
            }
        });
        // console.log('blur');
    }

    // 限制只能输入数字 退格，删除，tab
    handleKeyPress  = e => {
        let which = e.which;
        let allow = (which >= 48 && which <= 57 ) || (which <= 96 && which >= 105) || which == 8 || which == 9 || which == 46;
        let isWord = (which >= 65 && which <= 70) || which == 20; // 字母 Cape Lock
        let move = which == 37 || which == 39;
        if(allow || (isWord && this.props.type == 'mac') || move ){
            return true;
        }
        e.preventDefault();
    }

    handleKeyDown = e => {
        // BackSpace
        if ('' === e.target.value && 8 === e.which) {
            let previous = e.target.previousElementSibling;
            if (previous) {
                previous = previous.previousElementSibling.focus();
            }
        }
    }


    formItemFocus(){
        return this.state.inputs.some(item => item.focus);
    }

    formItemBlur(){
        let ret = true;
        this.state.inputs.forEach(input => {
            if(input.focus){
                ret = false;
            }
        })
        return ret;
    }

    render(){
        let { inputs, focus } = this.state;
        let size = this.props.size;
        let type = this.props.type;
        let classes = ['ui-input-outline ui-input-group', { focus }, { disabled: this.props.disabled}];
        if(this.props.size){
            classes.push({[size] : true});
        }
        if (this.props.disabled){              //disabled 为true 时，字体颜色透明度为30%
            classes.push('ui-input-disabled');
        }
        return (
            <div className={classnames(classes)}>
                {
                    inputs.map( (item, i) => {
                        const It = <input key={'input-' + i}
                                        maxLength={item.maxLength}
                                        // defaultValue={item.value} 
                                        value={item.value}
                                        className="ui-input-group-item"
                                        onBlur={ e => this.onInputBlur(e, i, item) }
                                        onFocus={ e => this.onInputFocus(e, i, item)}
                                        onChange={ e => this.onInputChange(e, i, item)} 
                                        //onKeyPress={ this.handleKeyPress }
                                        onKeyDown={ this.handleKeyDown }
                                        type='text'
                                        disabled={this.props.disabled}
                                    />;
                        if(i !== inputs.length - 1){
                            return [It, <span className="dot" key={'span-' + i}>{type === 'mac' ? ":" : '.'}</span>];
                        }
                        return It;
                    })
                }
            </div>
        )
    }
};



Form.FormItem = FormItem;
Form.ErrorTip = ErrorTip;
Form.Input = Input;
Form.InputGroup = InputGroup;



export default Form;




