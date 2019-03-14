import React from 'react';

import './topology.scss';
export default class Topology extends React.Component{

    render() {
        return (
            <div className="wrapper">
                <div className="internet">
                    <ul className="router">
                        <li>
                            <img className='image' src={require('~/assets/images/position.png')} />
                        </li>
                        <li className='line'>
                            <div className="circle"></div>
                            <div className="horizenline"></div>
                            <div className="circle"></div>
                        </li>
                        <li>
                            <img className='image' src={require('~/assets/images/position.png')} />
                        </li>
                        <li className='line'>
                            <div className="circle"></div>
                            <div className="horizenline"></div>
                            <div className="circle"></div>
                        </li>
                        <li>
                            <img className='image' src={require('~/assets/images/position.png')} /> 
                        </li>
                    </ul>
                    <ul className="func-label">
                        <label>互联网</label>
                        <label>网络连接</label>
                        <label>上网设置 </label>  
                    </ul>
                    <div className="strateline">
                        <div className="line"></div>
                    </div>
                    <div className="satelite">

                    </div>
                </div>
                <div className="speed">

                </div>
            </div>
        )
    }
}