import React from 'react';
import CustomIcon from '~/components/Icon';
import './topology.scss';
import { Popover, Button } from 'antd';
export default class Topology extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        edit: false
    }

    handleEdit = () => {
        this.setState({
            edit: true
        });
    }

    startDiagnose = () => {
        this.props.history.push('/diagnose');
    }

    setTheme = () => {
        const {online} = this.props;
        const ui = 'ui-fullscreen';
        const doc = document.getElementsByClassName(ui)[0];
        doc.className = `${ui} ${online ? 'home-bg' : 'home-bg-offline'}`;
    }

    componentDidMount() {
        this.setTheme();
    }

    componentDidUpdate (){
        this.setTheme();
    }

    render() {
        const {upSpeed, upUnit, downSpeed, downUnit, reList, online} = this.props;
        const {edit} = this.state;
        const listItems = reList.map(item => {
            if (item.role === '0') {
                return (
                    <li key={item.mac}>
                        <Item reList={item} />
                    </li>
                )
            }else {
                return <noscript></noscript>
            }
        })
        const mainRouter = reList.map(item => {
            if (item.role === '1') {
                const color = item.rssi > 20 ? '#60CC13' : '#DD726D';
                const rssi = item.rssi > 20 ? '信号较好' : '信号较差';
                return (
                    <div className='satelite-info'>
                        <p>
                            <label>
                                {item.name}
                            </label>
                            <CustomIcon onClick={this.handleEdit} size={8} style={{marginTop: -30, display: edit ? 'none' : 'inline-block' }} type="Rename" />
                        </p>
                        <ul>
                            <li><label>联网状态：</label><span style={{color: color}}>{rssi}</span></li>
                            <li><label>IP：</label><span>{item.ip}</span></li>
                            <li><label>MAC：</label><span>{item.mac}</span></li>
                        </ul>
                    </div>
                )
            } else {
                return <noscript></noscript>
            }
        });
        return (
            <div className="wrapper">
                <div className="internet">
                    <ul className="router">
                        <li>
                            <CustomIcon size={100} color='#fff' type="Network" />
                        </li>
                        <li className='line'>
                            <div className="circle"></div>
                            {
                                online ? 
                                <div className="horizenline"></div>:
                                <div className="dashline">
                                    <div className="dashpart">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <CustomIcon size={15} color='#fff' style={{marginBottom: 8}} type="Break" />
                                    <div className="dashpart">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <Button onClick={this.startDiagnose} className="diagnose">诊断故障</Button>
                                </div>
                            }
                            
                            <div className="circle"></div>
                        </li>
                        <li>
                            <CustomIcon size={100} color='#fff' type="Link" />
                        </li>
                        <li className='line'>
                            <div className="circle"></div>
                            <div className="horizenline"></div>
                            <div className="circle"></div>
                        </li>
                        <li>
                            <CustomIcon size={100} color='#fff' type="Equipment" />
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
                        <ul>
                            <li>
                                <Popover placement="bottomLeft"  arrowPointAtCenter trigger='click' content={mainRouter}>
                                    <div className='sate-router'>
                                        <CustomIcon size={60} color='#fff' type="Router" />
                                        <label>
                                            <CustomIcon size={8} color='#fff' style={{marginRight: 4}} type="Main" />大厅
                                        </label>
                                    </div>
                                </Popover>
                            </li>
                            {
                                listItems
                            }
                            <li>
                                <div className='add-router' onClick={this.addRouter}>
                                    <CustomIcon size={40} color='#fff' type="Add" />
                                </div>
                                <label>添加子路由</label>
                            </li>
                        </ul> 
                    </div>
                </div>
                <div className="speed">
                    <ul>
                        <li>
                            <div>
                                <label>上传速度</label>
                                <CustomIcon color="#fff" type="Upload" style={{marginBottom: 1, marginLeft: 3}} size={12}/>
                            </div>
                            <div>
                                <label className="speed-value">{upSpeed}</label>
                                <span>{upUnit}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <label>下载速度</label>
                                <CustomIcon color="#fff" type="Download" style={{marginBottom: 1, marginLeft: 3}} size={12}/>
                            </div>
                            <div>
                                <label className="speed-value">{downSpeed}</label>
                                <span>{downUnit}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    addRouter = () => {
        console.log('aaa');
    }
}

class Item extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const type = parseInt(this.props.reList.online);
        const reList = this.props.reList;
        const color = reList.rssi > 20 ? '#60CC13' : '#DD726D';
        const rssi = reList.rssi > 20 ? '信号较好' : '信号较差';
        const Info = (type) => {
            switch(type) {
                case 1://较差较好的情况
                    return (
                        <div className='satelite-info'>
                            <p>
                                <label>
                                    {reList.name}
                                </label>
                                <CustomIcon size={8} style={{marginTop: -30}} type="Rename" />
                            </p>
                            <ul>
                                <li><label>信号强度：</label><span style={{color: color}}>{rssi}</span></li>
                                <li><label>IP：</label><span>{reList.ip}</span></li>
                                <li><label>MAC：</label><span>{reList.mac}</span></li>
                                <li><label>上级路由：</label><span>{reList.parent}</span></li>
                            </ul>
                        </div>
                    );
                case 0://设备离线情况
                    return  (
                        <div className='satelite-info'>
                            <p>
                                <label>
                                    {reList.name}                                    
                                </label>
                                <CustomIcon size={8} style={{marginTop: -30}} type="Rename" />
                            </p>
                            <ul>
                                <li><label>离线</label></li>
                                <li><label>IP：</label><span>{reList.ip}</span></li>
                                <li><label>MAC：</label><span>{reList.mac}</span></li>
                                <li><label>上级路由：</label><span>{reList.parent}</span></li>
                            </ul>
                        </div>
                    )   
                default: 
                    return (
                        <div className='satelite-info'>
                            <p>
                                <label>
                                    {name}
                                </label>
                                <CustomIcon size={8} style={{marginTop: -30}} type="Rename" />
                            </p>
                            <ul>
                                <li><label>信号强度：</label><span style={{}}>较差</span></li>
                                <li><label>IP：</label><span>192.168.2.1</span></li>
                                <li><label>MAC：</label><span>00.00.00.00.00.00</span></li>
                                <li><label>上级路由：</label><span>SUNIM_XX(位置)</span></li>
                            </ul>
                        </div>
                    );
            }
        }

        const contentType = (type) => {
            switch(type) {
                case 1://较差较好的情况
                    return (
                        <div className='sate-router'>
                            <div>
                                <CustomIcon size={60} color='#fff' type="Router" />                                
                            </div>
                            <label>{reList.name}</label>
                            <p><span style={{color: color}}>{rssi}</span></p>
                        </div>
                    );
                case 0://设备离线情况
                    return  (
                        <div className='sate-router'>
                            <div>
                                <CustomIcon size={60} color='#fff' type="Router" />
                            </div>
                            <label>{reList.name}</label>
                            <p className="sate-offline">已离线</p>
                        </div>
                    )   
            }
        }
        return (
            <Popover placement="bottomLeft"  arrowPointAtCenter trigger='click' content={Info(type)}>
                {contentType(type)}
            </Popover>
        )
    }
}