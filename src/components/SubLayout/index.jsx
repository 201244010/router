
import React from 'react';
import classNames from 'classnames';

export default function SubLayout(props){
    const pathname = location.pathname;
    const conf = {
        'guide': 'none',
        'login': 'none',
        'agreement': 'none',
        'home':'none',
        // 'routersetting': 'none'
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
    const height = style === 'none' ? '100%' : window.innerHeight - 224;
    return (
        <div className={names} style={{maxHeight: height, height: height, overflow: 'auto'}} {...rest}> {props.children} </div>
    )
}



