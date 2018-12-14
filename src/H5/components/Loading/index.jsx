import React from 'react';
import Modal from 'h5/components/Modal';

import './loading.scss';

export default function Loading(props) {
	const { visible=true, content} = props;

	if (visible) {
		return (
			<Modal
				footer={null}
				visible={visible}
				wrapClassName='sm-loading-wrap'
			>
				<div className='icon'>
					<i className='img spin'></i>
				</div>
				<p className='content'>{content}</p>
			</Modal>
		);
	} else {
		return null;
	}
}
