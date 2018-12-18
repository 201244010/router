import React from 'react';
import Icon from 'h5/components/Icon';
import classnames from 'classnames';

import './button.scss';

export default function Button(props) {
    const { className, style, type, children, loading, disabled } = props;
    let clss = classnames(['sm-btn', className, { ['btn-' + type]: type }], {disabled: disabled});

    return (
        <button
            type="button"
            disabled={disabled || loading}
            className={clss}
            style={style}
            onClick={props.onClick}>
            {loading && <Icon type='loading' size={'0.48rem'} color="#FFF" spin />}
            {children}
        </button>
    );
}