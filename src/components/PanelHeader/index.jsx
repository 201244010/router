
import React from 'react';
import { Switch ,Tooltip, Icon } from 'antd';
import classnames from 'classnames';
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
        const { title, checkable, checked, className, tip} = this.props;
        return (
            <ul className={classnames(['panel-hd ui-tiled', className])}>
                <li>
                    <span>{title}</span>
                    {
                        (typeof tip === 'string' && tip.length !== 0) && <Tooltip placement="right" title={tip}><Icon style={{ fontSize: 16, marginLeft : 10 }} type="question-circle" /></Tooltip>
                    }
                </li>
                {
                    checkable ? <li><Switch checked={checked} onChange={this.onChange} /></li> : ''
                }
            </ul>
        );
    }
};

