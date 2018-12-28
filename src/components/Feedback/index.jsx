import React from 'react';
import { Modal, Button } from 'antd';
import CustomIcon from "~/components/Icon";

import './feedback.scss';

export default class Feedback extends React.Component {
    constructor(props) { 
        super(props);
    }

    render() {
        return (
            <Modal
            width={560}
            closable={false}
            visible={props.visible}
            maskClosable={false}
            centered={true}
            footer={
                <div style={{textAlign: 'center',padding: 10}}>
                    <Button type='primary' size="large" style={{width: 150}} onClick={props.close}>确定</Button>
                </div>
            }>
                <div className="backup-icon">
                    <CustomIcon color="#87D068" type="succeed" size={64} />
                    <div className="backup-result">微信连Wi-Fi设置完成!</div>
                </div>
            </Modal>
        );
    }
}