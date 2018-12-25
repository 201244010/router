import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '~/components/Icon';

import './toast.scss';

const MOUNT = 'body';

class Toast extends React.PureComponent {
    constructor(props){
        super(props);
    }

    close = () => {
        let mounter = document.querySelector(MOUNT);
        let confirm = mounter.querySelector('div>.sm-toast-wrap');

        if (confirm) {
            mounter.removeChild(confirm.parentNode);
        }
    }

    componentDidMount() {
        const {duration = 3} = this.props;
        setTimeout(this.close, duration * 1000);
    }

    render() {
        const { icon = 'm-defeated', tip, index = 1100 } = this.props;

        return (
            [
                <div className='sm-toast-mask' style={{zIndex: {index}}}></div>,
                <div className='sm-toast-wrap' style={{zIndex: {index}}}>
                    <div className='sm-toast'>
                        <Icon type={icon} size={'0.96rem'} style={{color: '#FFF'}}></Icon>,
                        <p className='content'>{tip}</p>
                    </div>
                </div>
            ]
        );
    }
}

export default function toast(props) {
    const { ...args } = props;

    let div = document.createElement('div');
    ReactDOM.render(<Toast {...args} />, div);

    let mounter = document.querySelector(MOUNT);
    mounter && mounter.appendChild(div);
}
