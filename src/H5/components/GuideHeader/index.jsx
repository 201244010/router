import React from 'react';

import './index.scss';

export default function GuideHeader(props) {
    const { title, tips } = props;
    return (
        <div className='guide-header'>
            <h2 className='title'>{title}</h2>
            {tips && <p className='tips'>{tips}</p>}
        </div>
    );
}