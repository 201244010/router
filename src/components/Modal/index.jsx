
import React from 'react';
import "./modal.scss";

export default function Modal(props){
  let { style, active } = props;
  return active ? 
    <div className="ui-modal-wrap">
      <div className="ui-modal" style={style}>
        {props.children}
      </div>
    </div> : ""
}




