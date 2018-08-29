import React from 'react';
import "./QRcode.scss";


class QRcode extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="qr">
                <img src="QRcode.png"></img>
                <p>扫描二维码下载APP</p>
            </div>
        );
    }
};

export default QRcode;