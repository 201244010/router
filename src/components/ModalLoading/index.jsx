import React from 'react';
import { Modal } from 'antd';
import CustomIcon from "~/components/Icon";
import Tips from '~/components/Tips';

import './modalLoading.scss';

class ModalLoading extends React.Component {
	render() {
		const { visible, tip } = this.props;
		return (
			<Modal
				visible={visible}
				closable={false}
				centered={true}
				footer={null}
			>
				<div className='modalLoading-body'>
					<CustomIcon color="#6174f1" type="loading" size={80} spin/>
					<Tips size="16" top={19}>{tip}</Tips>
				</div>
			</Modal>
		);
	}
};
export default ModalLoading;