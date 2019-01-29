import React from 'react';
import {Button} from 'antd';
import {NavLink} from "react-router-dom";
import {getLang} from '~/i18n/index.js';
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
        return (
            <React.Fragment>
                { 'zh-cn' === getLang() ?
                [<div className='user-experience-cn'>
                    <div className='head-cn'>
                        <CustomIcon size={40} color='#87D068' type='succeed' style={{marginRight: 16, display: 'inline-block'}} /><h4>{intl.get(MODULE, 11)}</h4>
                    </div>
                    <div className='body-cn'>
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
                        <div className='QR_img-cn'>
                            <img src={require('~/assets/images/qr.png')} />
                            <p>{intl.get(MODULE, 10)}</p>
                        </div>
                    </div>
                </div>
                ]
                :
                [<div className='user-experience-us'>
                    <div className='head-us'>
                        <CustomIcon size={40} color='#87D068' type='succeed' style={{marginRight: 16, display: 'inline-block'}} /><h4>{intl.get(MODULE, 11)}</h4>
                    </div>
                    <div className='body-us'>
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
                                        </div>
                                        <p>{intl.get(MODULE, 3)}</p>
                                        <div className='background'>
                                            <CustomIcon size={128} color='#92ABF6' type="bg_speed" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={'/home'}>
                                    <div className='func-item'>
                                        <div className='img'>
                                            <CustomIcon style={{ margin: 7 }} size={66} color='#F79D5C' type="search" />
                                        </div>
                                        <div className='description'>
                                            <h4>{intl.get(MODULE, 8)}</h4>
                                        </div>
                                        <p>{intl.get(MODULE, 9)}</p>
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
                                            <h4>{intl.get(MODULE, 6)}</h4>
                                        </div>
                                        <p>{intl.get(MODULE, 7)}</p>
                                        <div className='background'>
                                            <CustomIcon size={128} color='#F9AFDD' type="bg_equipment" />
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                        </ul>
                        <div className='QR_img-us'>
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