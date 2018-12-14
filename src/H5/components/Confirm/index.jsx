import React from 'react';
import ReactDOM from 'react-dom';

import './confirm.scss';

const MOUNT = 'body';

class Confirm extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    close = () => {
        let mounter = document.querySelector(MOUNT);
        let confirm = mounter.querySelector('div>.sm-confirm-wrap');

        if (confirm) {
            mounter.removeChild(confirm.parentNode);
        }
    }

    onOk = () => {
        this.close();
        const onClick = this.props.okButtonProps.onClick;
        onClick && onClick();
    }

    onCancel = () => {
        this.close();
        const onClick = this.props.cancelButtonProps.onClick;
        onClick && onClick();
    }

    render() {
        const props = this.props;
        const { title, content, okText = '确定', cancelText = '取消' } = props;

        return (
            [
                <div key='mask' className='sm-modal-mask'></div>,
                <div key='wrap' className='sm-confirm-wrap'>
                    <div className='sm-modal'>
                        <h3 className='title'>{title}</h3>
                        <p className='content'>{content}</p>
                        <div className='footer'>
                            <button onClick={this.onOk} className='btn cancel-btn'>{cancelText}</button>
                            <button onClick={this.onCancel} className='btn ok-btn'>{okText}</button>
                        </div>
                    </div>
                </div>
            ]
        );
    }
}

export default function confirm(props) {
    const { ...args } = props;

    let div = document.createElement('div');
    ReactDOM.render(<Confirm {...args} />, div);

    let mounter = document.querySelector(MOUNT);
    mounter && mounter.appendChild(div);
}