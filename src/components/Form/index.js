import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';


const ErrorTip = props => <div style={props.style} className="ui-form-explain">{props.children}</div>;

const FormItem = props => {
    const showErrorTip = props.showErrorTip;
    const klass = classnames(['ui-form-item', { 'ui-form-item-with-help' :  showErrorTip, "has-error" : showErrorTip}]);
    return (
        <div className={klass} style={props.style} >
            { 
                (props.label || props.label == '#') ? [
                <div key={'label'} className="ui-form-item-label ui-ib">{props.label === '#' ? '' : props.label}</div>, 
                <div key={'input'} className="ui-form-item-field ui-ib">{props.children}</div>] : 
                <div className="ui-form-item-field">{props.children}</div> 
            }
        </div>
    )
};


const Form = props => {
    const blockSubmit = (e) => {e.preventDefault()};
    
    return (
        <form className="ui-form" style={props.style} onSubmit={blockSubmit} >
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
        type : PropTypes.string,
        onChange : PropTypes.func.isRequired,
        name : PropTypes.string,
        value : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onBlur : PropTypes.func,
        onEnter : PropTypes.func,
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
                <input  className="ui-input" 
                        onBlur={this.handleBlur}
                        onKeyPress={this.handleKeyPress}
                        onChange={this.handleChange} 
                        value={this.props.value}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        type={this.state.type}/>
            </div>
        );
    }
};



Form.FormItem = FormItem;
Form.ErrorTip = ErrorTip;
Form.Input = Input;

export default Form;




