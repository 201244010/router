import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './form.scss';

const ErrorTip = props => <div style={props.style} className="ui-form-explain">{props.children}</div>;

const FormItem = props => {
    const showErrorTip = props.showErrorTip || props.errorTip;
    const suffix = props.suffix;
    const labelStyle = props.labelStyle || {};
    const klass = classnames([
        'ui-form-item', 
        { 
            'ui-form-item-with-help' :  showErrorTip, 
            "has-error" : showErrorTip,
            "ui-form-item-small" : props.type === 'small'
        }
    ]);
    return (
        <div className={klass} style={props.style} >
            { 
                (props.label || props.label == '#') ? [
                <div key={'label'} className="ui-form-item-label ui-ib" style={labelStyle} >{props.label === '#' ? '' : props.label}</div>, 
                <div key={'input'} className="ui-form-item-field ui-ib">
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
        <form className="ui-form" autoComplete="off" style={props.style} onSubmit={blockSubmit} >
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
        type : PropTypes.string,
        onChange : PropTypes.func.isRequired,
        name : PropTypes.string,
        value : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onBlur : PropTypes.func,
        onEnter : PropTypes.func,
        disabled : PropTypes.bool,
        width : PropTypes.oneOfType([PropTypes.string, PropTypes.number ]),
        visibilityChange : PropTypes.func,
        placeholder : PropTypes.string

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
        return (
            <div className="ui-input-outline" style={{ width : this.props.width }}>
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
                <input  className={classnames(classes)}
                        onBlur={this.handleBlur}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleChange} 
                        value={this.props.value}
                        disabled={this.props.disabled}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        type={this.state.type}/>
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
    static propTypes = {
        size : PropTypes.string,
        inputs : PropTypes.array.isRequired,
        onChange : PropTypes.func.isRequired,
        disabled : PropTypes.bool
    };

    onInputChange = (e, i, it) => {
        const inputs = this.state.inputs;
        const item = inputs.find(item => item === it);
        item.value = e.target.value;
        this.setState({ inputs });
        if(this.props.onChange){
            const values = inputs.map(input => input.value);
            this.props.onChange(values, this.state.inputs);
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
        const which = e.which;
        const allow = (which >= 48 && which <= 57 ) || (which <= 96 && which >= 105) || which == 8 || which == 9 || which == 46;
        if(allow){
            return true;
        }
        e.preventDefault();
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
        let classes = ['ui-input-outline ui-input-group', {focus}];
        if(this.props.size){
            classes.push({[size] : true});
        }
        return (
            <div className={classnames(classes)}>
                {
                    inputs.map( (item, i) => {
                        const It = <input key={'input-' + i} 
                                        maxLength={item.maxLength}
                                        defaultValue={item.value} 
                                        className="ui-input-group-item"
                                        onBlur={ e => this.onInputBlur(e, i, item) }
                                        onFocus={ e => this.onInputFocus(e, i, item)}
                                        onChange={ e => this.onInputChange(e, i, item)} 
                                        onKeyPress={ this.handleKeyPress }
                                        type='text'
                                    />;
                        if(i !== inputs.length - 1){
                            return [It, <span className="dot" key={'span-' + i}></span>];
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




