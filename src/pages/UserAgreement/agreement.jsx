
import React from "react";
import './agreement.scss';

const MODULE = 'h5agreement';
export default class Agreement extends React.Component{
    constructor(props){
        super(props)
    }
    
    render(){

        return (
            <div className="totalStyle">           
                <p style={{textAlign: 'center'}} className="titleWrap"><span className="title">商米用户协议</span></p>
                <p  className='content'>
                    {intl.get(MODULE, 0)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 1)}</ie>
                    1.{intl.get(MODULE, 2)}
                    <br/>2.{intl.get(MODULE, 3)}
                    <br/>3.{intl.get(MODULE, 4)}
                    <br/> 4.{intl.get(MODULE, 5)}
                    <br/>5.{intl.get(MODULE, 6)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 7)}</ie> 1.{intl.get(MODULE, 8)}
                    <br/>{intl.get(MODULE, 9)}
                    <br/> {intl.get(MODULE, 10)}
                    <br/> {intl.get(MODULE, 11)}
                    <br/> 2.{intl.get(MODULE, 12)}
                    <br/> {intl.get(MODULE, 13)}
                    <br/> {intl.get(MODULE, 14)}
                    <br/> {intl.get(MODULE, 15)}
                    <br/> {intl.get(MODULE, 16)}
                    <br/> {intl.get(MODULE, 17)}
                    <br/> 3.{intl.get(MODULE, 18)}
                    <br/>{intl.get(MODULE, 19)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 24)}</ie>{intl.get(MODULE, 25)}
                    <br/> 1.{intl.get(MODULE, 26)}
                    <br/>2.{intl.get(MODULE, 27)}
                    <br/> 3.{intl.get(MODULE, 28)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 29)}</ie> 1.{intl.get(MODULE, 30)}
                    <br/> 2.{intl.get(MODULE, 31)}
                    <br/> 3.{intl.get(MODULE, 32)}
                    <br/> 4.{intl.get(MODULE, 33)}
                    <br/> 5.{intl.get(MODULE, 34)}
                    <br/> 6.{intl.get(MODULE, 35)}
                    <br/> 7.{intl.get(MODULE, 36)}
                    <br/> 8.{intl.get(MODULE, 37)}
                    <br/> 9.{intl.get(MODULE, 38)}
                    <br/> {intl.get(MODULE, 39)}
                    <br/> {intl.get(MODULE, 40)}
                    <br/> {intl.get(MODULE, 41)}
                    <br/> {intl.get(MODULE, 42)}
                    <br/> {intl.get(MODULE, 43)}
                    <br/> {intl.get(MODULE, 44)}
                    <br/> {intl.get(MODULE, 45)}
                    <br/> {intl.get(MODULE, 46)}
                    <br/> {intl.get(MODULE, 47)}
                    <br/> {intl.get(MODULE, 48)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 49)}</ie> 1.{intl.get(MODULE, 50)}
                    <br/> 2.{intl.get(MODULE, 51)}
                    <br/> 3.{intl.get(MODULE, 52)}
                    <br/> {intl.get(MODULE, 53)}
                    <br/> {intl.get(MODULE, 54)}
                    <br/> {intl.get(MODULE, 55)}
                    <br/> {intl.get(MODULE, 56)}
                    <br/> {intl.get(MODULE, 57)}
                    <br/> {intl.get(MODULE, 58)}
                    <br/> {intl.get(MODULE, 59)}
                    <br/> {intl.get(MODULE, 60)}
                    <br/> 4.{intl.get(MODULE, 61)}
                    <br/>
                    <ie className="ieStyle"> {intl.get(MODULE, 62)} {intl.get(MODULE, 63)}</ie> 1.{intl.get(MODULE, 64)}
                    <br/>{intl.get(MODULE, 65)}
                    <br/> 2.{intl.get(MODULE, 66)}
                    <br/>{intl.get(MODULE, 67)}
                    <br/> 3.{intl.get(MODULE, 68)}
                    <br/> {intl.get(MODULE, 69)}
                    <br/> 4.{intl.get(MODULE, 70)}
                    <br/> {intl.get(MODULE, 71)}
                    <br/> 5.{intl.get(MODULE, 72)}
                    <br/> {intl.get(MODULE, 73)}
                    <br/> 6.{intl.get(MODULE, 74)}
                    <br/>{intl.get(MODULE, 75)}
                    <br/> 7.{intl.get(MODULE, 76)}
                    <br/> {intl.get(MODULE, 77)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 78)} {intl.get(MODULE, 79)}</ie> 1.{intl.get(MODULE, 80)}
                    <br/> 2.{intl.get(MODULE, 81)}
                    <br/> 3.{intl.get(MODULE, 82)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 83)}</ie> 1.{intl.get(MODULE, 84)}
                    <br/> 2.{intl.get(MODULE, 85)}
                    <br/> 3.{intl.get(MODULE, 86)}
                    <br/> 4.{intl.get(MODULE, 87)}
                    <br/> 5.{intl.get(MODULE, 88)}
                    <br/> 6.{intl.get(MODULE, 89)}
                    <br/> 7.{intl.get(MODULE, 90)}
                    <br/> 8.{intl.get(MODULE, 91)}
                    <br/> 9.{intl.get(MODULE, 92)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 93)}</ie> {intl.get(MODULE, 94)}
                    <br/> {intl.get(MODULE, 95)}
                    <br/> {intl.get(MODULE, 96)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 97)}</ie> 1.{intl.get(MODULE, 98)}
                    <br/> 2.{intl.get(MODULE, 99)}
                    <br/> 3.{intl.get(MODULE, 100)}
                    <br/>
                    <ie className="ieStyle"> {intl.get(MODULE, 101)}</ie> 1.{intl.get(MODULE, 102)}
                    <br/> 2.{intl.get(MODULE, 103)}
                    <br/> 3.{intl.get(MODULE, 104)}
                    <br/>{intl.get(MODULE, 105)}
                </p>
            </div>
        )
    }
}