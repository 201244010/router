
import React from 'react';
import classNames from 'classnames';

export default function Container(props){
    const {children, className, ...rest} = props;
    const names = classNames([className, 'ui-container']);
    return (
        <div className={names} {...rest}> {props.children} </div>
    )
}



