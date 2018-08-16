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
        type : 'text',
        width : 260
    };

    static propTypes = {
        type : PropTypes.string,
        onChange : PropTypes.func.isRequired,
        width : PropTypes.oneOfType([PropTypes.string, PropTypes.number ])
    };
    
    render(){
        const {type, width, onChange, ...rest} = this.props;
        return (
            <div className="ui-input-outline" style={{ width : this.props.width }}>
                <i className="ui-icon-eye w1 eye-open"></i>
                <input className="ui-input" {...rest} type={this.props.type}/>
            </div>
        );
    }
};



Form.FormItem = FormItem;
Form.ErrorTip = ErrorTip;
Form.Input = Input;

export default Form;




