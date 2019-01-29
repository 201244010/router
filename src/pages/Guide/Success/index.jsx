import React from 'react';
import {Button} from 'antd';
import {NavLink} from "react-router-dom";
import {getLang} from '~/i18n/index';
import CustomIcon from '~/components/Icon';

import './success.scss';

const MODULE = 'success';

export default class Success extends React.Component {
    constructor(props) {
        super(props);
    }

    goHome = () => {
        this.props.history.push('/home');
    }

    render() {
        let version = 'zh-cn' === getLang()? 'func-item-cn' : 'func-item-us';  //海外版分中文版、英文版
        let format = 'zh-cn' === getLang();    //海外版 className = 'decription' 中英文的排版不同

        return (
            <React.Fragment>
                {false ? //默认海外版，不显示国内版
                [<div className='user-experience-domestic'>
                    <div className='head-domestic'>
                        <CustomIcon size={40} color='#87D068' type='succeed' style={{marginRight: 16, display: 'inline-block'}} /><h4>{intl.get(MODULE, 11)}</h4>
                    </div>
                    <div className='body-domestic'>
                        <div className='title'>
                            <h4>{intl.get(MODULE, 0)}</h4>
                            <Button onClick={this.goHome} className='go-home'>{intl.get(MODULE, 1)}</Button>
                        </div>
                        <ul>
                            <li>
                                <NavLink to={'/advance/bandwidth'}>
                                    <div className='func-item'>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 13 }} size={54} color='#92ABF6' type="networkspeeddistribution" />
                                        </div>
                                        <div className='description'>
                                            <h4>{intl.get(MODULE, 2)}</h4>
                                            <p>{intl.get(MODULE, 3)}</p>
                                        </div>
                                        <div className='background'>
                                            <CustomIcon size={128} color='#92ABF6' type="bg_speed" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/advance/wechat'}>
                                    <div className='func-item'>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 13 }} size={54} color='#99DD8B' type="auth" />
                                        </div>
                                        <div className='description'>
                                            <h4>{intl.get(MODULE, 4)}</h4>
                                            <p>{intl.get(MODULE, 5)}</p>
                                        </div>
                                        <div className='background'>
                                            <CustomIcon size={128} color='#99DD8B' type="bg_wechat" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <NavLink to={'/home'}>
                                    <div className='func-item'>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 7 }} size={66} color='#F79D5C' type="search" />
                                        </div>
                                        <div className='description'>
                                            <h4>{intl.get(MODULE, 6)}</h4>
                                            <p>{intl.get(MODULE, 7)}</p>
                                        </div>
                                        <div className='background'>
                                            <CustomIcon size={128} color='#F79D5C' type="bg_search" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/home'}>
                                    <div className='func-item'>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 13 }} size={54} color='#F9AFDD' type="blacklis" />
                                        </div>
                                        <div className='description'>
                                            <h4>{intl.get(MODULE, 8)}</h4>
                                            <p>{intl.get(MODULE, 9)}</p>
                                        </div>
                                        <div className='background'>
                                            <CustomIcon size={128} color='#F9AFDD' type="bg_equipment" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                        <div className='QR_img-domestic'>
                            <img src={require('~/assets/images/qr.png')} />
                            <p>{intl.get(MODULE, 10)}</p>
                        </div>
                    </div>
                </div>
                ]
                :
                [<div className='user-experience-abroad'>
                    <div className='head-abroad'>
                        <CustomIcon size={40} color='#87D068' type='succeed' style={{marginRight: 16, display: 'inline-block'}} /><h4>{intl.get(MODULE, 11)}</h4>
                    </div>
                    <div className='body-abroad'>
                        <div className='title'>
                            <h4 className={format&&'font-bold'}>{intl.get(MODULE, 0)}</h4>{/* 海外版中文版，字体为bold;英文版为normal */}
                            <Button onClick={this.goHome} className='go-home'>{intl.get(MODULE, 1)}</Button>
                        </div>
                        <ul>
                            <li>
                                <NavLink to={'/advance/bandwidth'}>
                                    <div className={version}>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 13 }} size={54} color='#92ABF6' type="networkspeeddistribution" />
                                        </div>
                                        {format ?   //海外版-中英文的排版不同
                                            <div className='description'>
                                                <h4>{intl.get(MODULE, 2)}</h4>
                                                <p>{intl.get(MODULE, 3)}</p>
                                            </div>
                                            :
                                            [<div className='description'>
                                                <h4>{intl.get(MODULE, 2)}</h4>
                                            </div>,
                                            <p>{intl.get(MODULE, 3)}</p>]
                                        }
                                        <div className='background'>
                                            <CustomIcon size={128} color='#92ABF6' type="bg_speed" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/home'}>
                                    <div className={version}>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 7 }} size={66} color='#F79D5C' type="search" />
                                        </div>
                                        {format ?   //海外版-中英文的排版不同
                                            <div className='description'>
                                                <h4>{intl.get(MODULE, 8)}</h4>
                                                <p>{intl.get(MODULE, 9)}</p>
                                            </div>
                                            :
                                            [<div className='description'>
                                                <h4>{intl.get(MODULE, 8)}</h4>
                                            </div>,
                                            <p>{intl.get(MODULE, 9)}</p>]
                                        }
                                        <div className='background'>
                                            <CustomIcon size={128} color='#F79D5C' type="bg_search" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/home'}>
                                    <div className={version}>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 13 }} size={54} color='#F9AFDD' type="blacklis" />
                                        </div>
                                        {format ?   //海外版-中英文的排版不同
                                            <div className='description'>
                                                <h4>{intl.get(MODULE, 6)}</h4>
                                                <p>{intl.get(MODULE, 7)}</p>
                                            </div>
                                            :
                                            [<div className='description'>
                                                <h4>{intl.get(MODULE, 6)}</h4>
                                            </div>,
                                            <p>{intl.get(MODULE, 7)}</p>]
                                        }
                                        <div className='background'>
                                            <CustomIcon size={128} color='#F9AFDD' type="bg_equipment" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                        <div className='QR_img-abroad'>
                            <img src={require('~/assets/images/qr.png')} />
                            <p>{intl.get(MODULE, 10)}</p>
                        </div>
                    </div>
                </div>
                ]
                }   
            </React.Fragment>
        );
    }
}