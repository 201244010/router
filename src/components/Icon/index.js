import React from 'react';
import classnames from 'classnames';
import PropTypes from "prop-types";

import './icon.scss';

export default function CustomIcon(props){
  let klass = classnames(['ui-icon', 'ui-icon-' + props.type, { 'ui-icon-spin': props.spin }, props.className]), size;

  switch(props.size){
    case 'large' :
      size =  80;
      break;
    case "small" :
      size = 40
      break;
    default :
      size = props.size;
  }
  
  const styles = Object.assign({ color : props.color, fontSize : size, lineHeight : 1 }, props.style);

  return <div className={klass} style={styles} ></div>;
}


CustomIcon.propTypes = {
  color : PropTypes.string,
  type : PropTypes.string.isRequired,
  size : PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.oneOf(['large', 'small'])
  ])
};



