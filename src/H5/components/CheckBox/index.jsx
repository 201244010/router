import React from 'react';
import { Checkbox } from 'antd';

import style from './checkbox.useable.scss';

export default class CustomCheckbox extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }


    render() {
        const {children, ...others} = this.props;
        return(
            <Checkbox {...others} >{children}</Checkbox>
        );
    }
};