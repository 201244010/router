
import React from 'react';
import { Switch } from 'antd';
import './panelHeader.scss';

export default class PanelHeader extends React.PureComponent {
    constructor(props){
        super(props);
    }

    onChange =  checked => {
        if(typeof this.props.onChange === 'function'){
            this.props.onChange(checked);
        }
    }

    render(){
        const { title, checkable, checked } = this.props;
        return (
            <ul className="panel-hd ui-tiled">
                <li><span>{title}</span></li>
                {
                    checkable ? <li><Switch checked={checked} onChange={this.onChange} /></li> : ''
                }
            </ul>
        );
    }
};

