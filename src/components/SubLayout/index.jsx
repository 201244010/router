
import React from 'react';
import classNames from 'classnames';

export default function SubLayout(props){
    const pathname = location.pathname;
    const conf = {
        'guide': 'none',
        'login': 'none',
        'agreement': 'none',
        'home':'none'
    };
    let style = '';
    for (let url in conf) {
        if (pathname.indexOf(url) > -1){
            style = conf[url];
            break;
        }
    }
    const {children, className, ...rest} = props;
    const names = classNames([className, 'ui-container']);
    return (
        <div className={names} style={{maxHeight: style === 'none' ? style : window.innerHeight - 224}} {...rest}> {props.children} </div>
    )
}



