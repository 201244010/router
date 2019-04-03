import React from 'react';
import CustomIcon from "~/components/Icon";
import { withRouter } from "react-router-dom";

import './title.scss';
const MODULE = 'primarytitle';

class PrimaryTitle extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
        const {title, titleTip} = this.props;

		return (
			<div className="primarytitle">
                <div className="icon" onClick={this.goBackPage}>
                    <CustomIcon color="#FFFFFF" type="back" size={28} />
                </div>
                <div className="title">
                    <label>{title}</label>
                    <p>{titleTip}</p>
                </div>
			</div>
		);
	}

    goBackPage = () => {
        this.props.history.push('/routersetting');
    }
};

export default withRouter(PrimaryTitle);


