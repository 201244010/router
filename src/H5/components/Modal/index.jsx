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
                closable={closable}
                maskClosable={false}
                style={{
                    margin: '-50% 0.72rem 0',
                    top: '50%',
                    paddingBottom:0,
                }}
                maskStyle={{
                    opacity: 0.3,
                    background: '#060A16',
                }}
                {...others}
            >
                {children}
            </Modal>
        );
    }
};
