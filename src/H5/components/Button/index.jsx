import React from 'react';
import classnames from 'classnames';

import './button.scss';

export default function Button(props) {
    const { className, style, type, children, disabled } = props;
    let clss = classnames(['sm-btn', className, { ['btn-' + type]: type }], {disabled: disabled});

    return (
        <button
            type="button"
            disabled={disabled}
            className={clss}
            style={style}
            onClick={(e) => props.onClick(e)}>
            {children}
        </button>
    );
}