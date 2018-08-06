import React from 'react';
import classnames from 'classnames';


const ErrorTip = props => <div style={props.style} className="ui-form-explain">{props.children}</div>;

class FormItem extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        const showErrorTip = this.props.showErrorTip;
        const klass = classnames(['ui-form-item', { 'ui-form-item-with-help' :  showErrorTip, "has-error" : showErrorTip}]);
        return (
            <div className={klass} style={this.props.style} >
                {this.props.children}
            </div>
        )
    }
};

class Form extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <form className="ui-form" style={this.props.style}>
                {this.props.children}
            </form>
        );
    }
};



Form.FormItem = FormItem;
Form.ErrorTip = ErrorTip;

export default Form;




