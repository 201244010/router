
import React from "react";
import './agreement.scss';

const MODULE = 'h5privacy';
export default class Privacy extends React.Component{
    constructor(props){
        super(props)
    }

    render(){

        return (
            <div className="totalStyle">
                <p style={{textAlign: 'center'}} className="titleWrap"><span className="title">商米隐私政策</span></p>
                <p onScroll={this.onScroll} className='content'>
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 0)}</ie>
                    {intl.get(MODULE, 1)}
                    <br/>{intl.get(MODULE, 2)}
                    <br/>{intl.get(MODULE, 3)}
                    <br/>{intl.get(MODULE, 4)}
                    <br/>{intl.get(MODULE, 5)}
                    <ie className="ieStyle">{intl.get(MODULE, 6)}
                        <br/>{intl.get(MODULE, 7)}
                    </ie>
                    {intl.get(MODULE, 8)}
                    <br/>{intl.get(MODULE, 9)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 10)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 11)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 12)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 13)}

                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 14)}
                    <ie className="ieStyle">{intl.get(MODULE, 15)}</ie> 
                    {intl.get(MODULE, 16)}
                    <br/>{intl.get(MODULE, 17)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 18)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 19)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 20)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 21)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 22)}
                    <ie className="ieStyle">{intl.get(MODULE, 23)} </ie>
                    {intl.get(MODULE, 24)}
                    <br/>{intl.get(MODULE, 25)}
                    <br/>{intl.get(MODULE, 26)}
                    <ie className="ieStyle">{intl.get(MODULE, 27)}</ie>
                    {intl.get(MODULE, 28)}
                    <ie className="ieStyle">{intl.get(MODULE, 29)}</ie>
                    &nbsp;• &nbsp;{intl.get(MODULE, 30)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 31)}
                    <ie className="ieStyle">{intl.get(MODULE, 32)}
                    <br/>{intl.get(MODULE, 33)}</ie>
                    {intl.get(MODULE, 34)}
                    <br/>{intl.get(MODULE, 35)}
                    <br/>{intl.get(MODULE, 36)}
                    <br/>{intl.get(MODULE, 37)}
                    <br/>{intl.get(MODULE, 38)}
                    <ie className="ieStyle">{intl.get(MODULE, 39)}
                    <br/>{intl.get(MODULE, 40)}</ie>
                    {intl.get(MODULE, 41)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 42)}
                    <br/>{intl.get(MODULE, 43)}
                    <ie className="ieStyle">{intl.get(MODULE, 44)}</ie>
                    &nbsp;• &nbsp;{intl.get(MODULE, 45)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 46)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 47)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 48)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 49)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 50)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 51)}
                    <ie className="ieStyle">{intl.get(MODULE, 52)} </ie>
                    &nbsp;• &nbsp;{intl.get(MODULE, 53)}
                    <br/>&nbsp;• &nbsp;{intl.get(MODULE, 54)}
                    <ie className="ieStyle">{intl.get(MODULE, 55)}</ie> 
                    {intl.get(MODULE, 56)}
                    <br/>
                    <ie className="ieStyle">{intl.get(MODULE, 57)}</ie>
                    {intl.get(MODULE, 58)}
                    <br/>    
                    <ie className="ieStyle">{intl.get(MODULE, 59)}</ie>
                    {intl.get(MODULE, 60)}
                    <br/>{intl.get(MODULE, 61)}
                    <br/>{intl.get(MODULE, 62)}
                    <br/>{intl.get(MODULE, 63)}
                    <br/>{intl.get(MODULE, 64)}
                    <br/>
                    <br/>{intl.get(MODULE, 65)}
                </p>
            </div>
        )
    }
}