import React from 'react';


export default function Tips(props){
  let { size = 12, top = 0, bottom = 0 } = props; 
  return <div className="ui-tips" style={{ fontSize : +size, marginTop : +top, marginBottom : +bottom }}>{props.children}</div>;
}