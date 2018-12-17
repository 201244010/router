import React from 'react';
import './link.scss';

export default function Link(props) {
    const { children, onClick, href='javascript:void(0);', ...rest } = props;
    return (
        <a
            className='sm-link'
            onClick={props.onClick}
            href={href}
            {...rest}
        >
            {children}
        </a>
    )
}