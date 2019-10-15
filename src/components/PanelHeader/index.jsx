import React from 'react';
import { Switch, Tooltip } from 'antd';
import Icon from '~/components/Icon';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './panelHeader.scss';

const MODULE = 'panelheader';

export default class PanelHeader extends React.PureComponent {
	constructor(props) {
		super(props);
	}

	onChange = checked => {
		if (typeof this.props.onChange === 'function') {
			this.props.onChange(checked);
		}
	};

	render() {
		const id = `__panel-${new Date().getTime()}`;
		const {
			title,
			checkable,
			checked,
			className,
			tip,
			disabled,
			tiled = true
		} = this.props;
		return (
			<ul
				className={classnames([
					`panel-hd ${tiled ? '' : 'ui-tiled'}`,
					className
				])}
				id={id}
			>
				<li>
					<span>{title}</span>
					{tip && (
						<Tooltip
							trigger="click"
							placement="right"
							title={tip}
							overlayStyle={{ maxWidth: 340 }}
							getPopupContainer={() => {
								return document.getElementById(id);
							}}
						>
							<span>
								<Icon
									size={16}
									type="help"
									color="#ADB1B9"
									className='tooltip-icon'
								/>
							</span>
						</Tooltip>
					)}
				</li>
				{checkable ? (
					<li className={tiled ? 'panel-switch' : ''}>
						<Switch
							checked={checked}
							checkedChildren={intl.get(MODULE, 0)}
							unCheckedChildren={intl.get(MODULE, 1)}
							disabled={disabled}
							onChange={this.onChange}
						/>
					</li>
				) : (
					''
				)}
			</ul>
		);
	}
}

PanelHeader.propTypes = {
	tip: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
};
