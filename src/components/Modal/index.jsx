
import React from 'react';
import "./modal.scss";

export default function Modal(props){
  let { style, active } = props;
  return active ? 
    <div className="ui-modal-wrap" style={style}>
      <div className="ui-modal">
        {props.children}
      </div>
    </div> : ""
}
