import React, { Component } from 'react';
import { Modal, Progress } from 'antd';
import PropTypes from "prop-types";

import './style.scss';

export default class CustomProgress extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        percent: 0,
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            const max = this.props.max || 99;
            let percent = this.state.percent + 1;
            if (percent <= max) {
                this.setState({
                    percent: percent,
                });
            } else {
                clearInterval(this.timer);
                this.props.onDone && this.props.onDone();
            }
        }, this.props.duration * 10);
    }

    render() {
        const percent = this.state.percent;
        const { title, showPercent, tips } = this.props;

        return (
            <Modal className='sm-progress-modal' closable={false} footer={null} visible={true} centered={true}>
                <h4>{title}</h4>
                <Progress percent={percent} strokeColor='linear-gradient(to right, #FAD961, #FB8632)' showInfo={false} />
                { showPercent && 
                    <p>{`${percent}%`}</p>
                }
                { tips &&
                    <p>{tips}</p>
                }
            </Modal>
        )
    }
}

CustomProgress.propTypes = {
    duration: PropTypes.number.isRequired,
    max: PropTypes.number,
    title: PropTypes.string,
    tips: PropTypes.string,
    showPercent: PropTypes.bool,
    onDone: PropTypes.func,
};