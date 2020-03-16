import React from 'react';
import Form from '~/components/Form';
const { FormItem, ErrorTip, Input } = Form;

const MODULE = 'dynamicpassword';
export default class DynamicPassword extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {
			period,
			periodTip,
			onChange,
			guestDynamicPassword
		} = this.props;
		return (
			<div>
				<label>{intl.get(MODULE, 0)}</label>
				<div className="guest-weekly">
					<FormItem
						type="small"
						showErrorTip={periodTip}
						style={{ width: 320 }}
					>
						<Input
							type="text"
							value={period}
							maxLength={2}
							onChange={e => onChange('period', e)}
							placeholder={
								intl.get(MODULE, 1)
							}
						/>
						<ErrorTip>{periodTip}</ErrorTip>
					</FormItem>
					<span className="guest-hour">
						{intl.get(MODULE, 2)}
					</span>
				</div>
				<div className="guest-padding">
					<label>{intl.get(MODULE, 3)}</label>
					<span
						className="guest-password"
						value={guestDynamicPassword}
					>
						{guestDynamicPassword}
					</span>
				</div>
			</div>
		);
	}
}
