import React from 'react';
import { Modal } from 'antd';

import style from './modal.useable.scss';

export default class CustomModal extends React.PureComponent {
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
        const { children, closable = false, ...others } = this.props;
        return (
            <Modal
                centered
                closable={closable}
                maskClosable={false}
                {...others}
            >
                {children}
            </Modal>
        );
    }
};

