import React from 'react';
import { findDOMNode } from 'react-dom';

import Icon from 'h5/components/Icon';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './select.scss';

export default class Select extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        findDOMNode(this.refs.select).addEventListener('click', this.onclick);
    }

    onclick = (e) => {
        let target = e.target;
        let nodeName = target.nodeName.toLowerCase();
        while ('ul' !== nodeName) { // loop: find li.option
            if ('li' === nodeName) {
                let val = target.getAttribute('value');
                if (val !== this.props.value) {
                    let onChange = this.props.onChange;
                    onChange && onChange(val);
                }
                break;
            } else {
                target = target.parentNode;
                nodeName = target.nodeName.toLowerCase();
            }
        }
    }

    render() {
        const props = this.props;
        const { options, value } = props;
        return (
            <ul className='sm-select-list' ref='select'>
                {
                    options.map((opt, i) => {
                        let clss = classnames(['option', { 'option-checked': value === opt.value}]);
                        return (
                            <li className={clss} key={opt.value} value={opt.value}>
                                <label className='item'>{opt.label}</label>
                                <Icon type='select' size='0.4267rem' color='#FF6000' />
                            </li>
                        );
                    })
                }
            </ul>
        )
    }
}