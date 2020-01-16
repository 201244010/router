import React from 'react';
import Form from '~/components/Form';
const { FormItem, ErrorTip, Input } = Form;

const MODULE = 'wi-fi';
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
				<label>{intl.get(MODULE, 70) /*_i18n:动态变更周期*/}</label>
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
								intl.get(
									MODULE,
									71
								) /*_i18n:请输入变更周期时间(1～72)*/
							}
						/>
						<ErrorTip>{periodTip}</ErrorTip>
					</FormItem>
					<span className="guest-hour">
						{intl.get(MODULE, 72) /*_i18n:小时*/}
					</span>
				</div>
				<div className="guest-padding">
					<label>{intl.get(MODULE, 73) /*_i18n:当前密码是：*/}</label>
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
