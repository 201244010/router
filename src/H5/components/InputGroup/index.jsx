import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './inputgroup.scss';

const ErrorTip = props => <div style={props.style} className="sm-form-tip">{props.value}</div>;

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
        let { size, type, inputGroupName, tip } = this.props;
        let classes = ['ui-input-outline ui-input-group', { focus }, { disabled: this.props.disabled}];
        if(size){
            classes.push({[size] : true});
        }
        if (this.props.disabled){              //disabled 为true 时，字体颜色透明度为30%
            classes.push('ui-input-disabled');
        }
        if (tip) {
            classes.push('ui-input-haveTip');
        }
        return (
            <React.Fragment>
                <div className='sm-inputgroup'>
                    {inputGroupName && <label className='inputGroup-name'>{inputGroupName}</label>}
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
                    <ErrorTip value={tip} />
                </div>
            </React.Fragment>
        );
    }
};

export default InputGroup;
