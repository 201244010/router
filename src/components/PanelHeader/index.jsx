
import React from 'react';
import { Switch ,Tooltip, Icon } from 'antd';
import classnames from 'classnames';
import PropTypes from "prop-types";

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
        const id = `__panel-${new Date().getTime()}`;
        const { title, checkable, checked, className, tip} = this.props;
        return (
            <ul className={classnames(['panel-hd ui-tiled', className])} id={id}>
                <li>
                    <span>{title}</span>
                    {tip &&
                    <Tooltip
                        trigger='click'
                        placement="right"
                        title={tip}
                        overlayStyle={{maxWidth:360}}
                        getPopupContainer={() => {
                            return document.getElementById(id);
                        }}
                    >
                        <Icon style={{ fontSize: 16, marginLeft : 10 }} type="question-circle" />
                    </Tooltip>
                    }
                </li>
                {
                    checkable ? <li><Switch checked={checked} onChange={this.onChange} /></li> : ''
                }
            </ul>
        );
    }
};

PanelHeader.propTypes = {
    tip: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ])
};
