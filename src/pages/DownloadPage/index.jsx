import React, {PureComponent} from 'react';

import './downloadPage.scss';

const MODULE = 'downloadpage';

export default function DownloadPage() {
    return (
        <div className='app-download ui-container'>
            <div className='app-header'>
                <div className='title'>
                    <h1>{intl.get(MODULE, 0)}</h1>
                    <p>{intl.get(MODULE, 1)}</p>
                </div>
                <div className='QRcode'>
                    <img className='QRcode-img' src={require('~/assets/images/qr.png')} />
                    <p>{intl.get(MODULE, 2)}</p>
                </div>
            </div>
            <ul className='app-body'>
                {
                    [
                        { img: require('~/assets/images/remotecontrol.png'), h2: intl.get(MODULE, 3), desc: intl.get(MODULE, 4)},
                        { img: require('~/assets/images/grouping.png'), h2: intl.get(MODULE, 5), desc: intl.get(MODULE, 6) },
                        { img: require('~/assets/images/terminal.png'), h2: intl.get(MODULE, 7), desc: intl.get(MODULE, 8) },
                        { img: require('~/assets/images/route.png'), h2: intl.get(MODULE, 9), desc: intl.get(MODULE, 10) }
                    ].map((item, index) => {
                        return (
                            <li key={index}>
                                <div className='image' style={{ backgroundImage: `url(${item.img})` }}></div>
                                <div className='summary'>
                                    <h2>{item.h2}</h2>
                                    <p>{item.desc}</p>
                                </div>
                            </li>
                        );
                    })
                }
            </ul>
        </div>);  
}
