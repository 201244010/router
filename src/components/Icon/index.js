import React from 'react';
import classnames from 'classnames';
import PropTypes from "prop-types";


export default function CustomIcon(props){
  let klass = classnames(['ui-icon', 'ui-icon-' + props.type]), size;

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
  
  const styles = { color : props.color, fontSize : size, lineHeight : 1 };

  return <div className={klass} style={styles} ></div>;
}


CustomIcon.propTypes = {
  color : PropTypes.string,
  type : PropTypes.string.isRequired,
  size : PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['large', 'small'])
  ])
};



