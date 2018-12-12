import React from 'react';
import classnames from 'classnames';

import './button.scss';

export default function Button(props) {
    const { className, style, type, children } = props;
    let clss = classnames(['sm-btn', className, { ['btn-' + type]: type }]);

    return (
        <button
            type="button"
            className={clss}
            style={style}
            onClick={(e) => props.onClick(e)}>
            {children}
        </button>
    );
}