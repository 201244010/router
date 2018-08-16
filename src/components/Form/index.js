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
                props.label ? [
                <div key={'label'} className="ui-form-item-label ui-ib">{props.label}</div>, 
                <div key={'input'} className="ui-ib">{props.children}</div>] : props.children 
            }
        </div>
    )
};


const Form = props => {
    return (
        <form className="ui-form" style={props.style}>
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
        onBlur : PropTypes.func.isRequired,
        width : PropTypes.oneOfType([PropTypes.string, PropTypes.number ]),
        visibilityChange : PropTypes.func

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
        console.log('change', e.target.value);
        this.props.onChange(e.target.value);
    };

    handleBlur = e => {
        console.log('blur');
        this.props.onBlur(e.target.value);
    }
    
    render(){
        let {type, width, onChange, onBlur, visibilitychange, ...rest} = this.props;
        let hidden = this.state.hidden;
        return (
            <div className="ui-input-outline" style={{ width : this.props.width }}>
                <i className="ui-icon ui-icon-eye-open" style={{ display :  hidden ? 'block' : 'none'}} onClick={this.HandleVisibilityChange}></i>
                <i className="ui-icon ui-icon-eye-close" style={{ display :  !hidden ? 'block' : 'none'}} onClick={this.HandleVisibilityChange}></i>
                <input  className="ui-input" 
                        onBlur={this.handleBlur}
                        onChange={this.handleChange} 
                        {...rest} 
                        type={this.state.type}/>
            </div>
        );
    }
};



Form.FormItem = FormItem;
Form.ErrorTip = ErrorTip;
Form.Input = Input;

export default Form;




