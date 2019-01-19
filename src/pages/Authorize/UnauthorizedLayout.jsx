
import React from 'react';
import intl from '~/i18n/intl';

const MODULE = 'unauthorizedlayout';

export default function (props){
    return <div>{intl.get(MODULE, 0)}</div>
};

