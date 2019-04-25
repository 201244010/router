import React from 'react';
import CustomIcon from '~/components/Icon';
import Loading from '~/components/Loading';
import { Popover, Button, Input} from 'antd';

import './topology.scss';

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
           return (
                <li key={item.mac}>
                    <Item reList={item} />
                </li>
            )
        })
        return (
            <div className="wrapper">
                <div className="internet">
                    <ul className="router">
                        <li>
                            <CustomIcon size={100} color='#fff' type="network" />
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
                                    <CustomIcon size={15} color='#fff' style={{marginBottom: 8}} type="break" />
                                    <div className="dashpart">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                    <Button onClick={this.startDiagnose} className="diagnose"><span>诊断故障</span></Button>
                                </div>
                            }
                            
                            <div className="circle"></div>
                        </li>
                        <li>
                            <CustomIcon size={100} color='#fff' type="link" />
                        </li>
                        <li className='line'>
                            <div className="circle"></div>
                            <div className="horizenline"></div>
                            <div className="circle"></div>
                        </li>
                        <li>
                            <CustomIcon size={100} color='#fff' type="equipment" />
                        </li>
                    </ul>
                    <ul className="func-label">
                        <label>互联网</label>
                        <label>网络连接</label>
                        <label>上网设备</label>  
                    </ul>
                    <div className="strateline">
                        <div className="line"></div>
                    </div>
                    <div className="satelite">
                        <ul>
                            {listItems}
                            <li style={{display: reList.length > 4 ? 'none' : 'inline-block'}}>
                                <div className='add-router' onClick={this.addRouter}>
                                    <CustomIcon size={40} color='#fff' type="add" />
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
                                <label className="up-speed">上传速度</label>
                                <CustomIcon color="#fff" type="upload" style={{marginBottom: 1, marginLeft: 3, opacity: 0.6}} size={12}/>
                            </div>
                            <div className="speed-content">
                                <label>{upSpeed}</label>
                                <span>{upUnit}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <label className="up-speed">下载速度</label>
                                <CustomIcon color="#fff" type="download" style={{marginBottom: 1, marginLeft: 3, opacity: 0.6}} size={12}/>
                            </div>
                            <div className="speed-content">
                                <label>{downSpeed}</label>
                                <span>{downUnit}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    addRouter = () => {
        this.props.history.push('/guide/addsubrouter')
    }
}


class Item extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        editing: false
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({
            editing: editing
        });
    }

    save = async (e, defaultValue, mac, devid) => {
        const editName = e.target.value;
        console.log(devid);
        if (editName === defaultValue) {
            this.setState({
                editing: false
            });
        } else {
            Loading.show({ duration: 2 });
            let resp = await common.fetchApi({
                opcode: 'ROUTENAME_SET',
                data: { 
                    sonconnect: [{ 
                        mac, 
                        location: editName,
                        devid
                    }] 
                },
            });
            let { errcode } = resp;
            if (0 !== errcode) {
                message.error(intl.get(MODULE, 22)/*_i18n:保存失败，设备名称过长*/);
                return;
            }
            if (0 === errcode) {
                this.setState({
                    editing: false
                });
            }
            // setTimeout(() => {
            //     // this.props.startRefresh(true);
            //     setTimeout(toggleEdit, 500);
            // }, 1500);
        }
    }

    render() {
        const reList = this.props.reList;
        const type = parseInt(reList.online);
        const role = parseInt(reList.role);
        const color = reList.rssi > 20 ? '#60CC13' : '#DD726D';
        const rssi = reList.rssi > 20 ? '信号较好' : '信号较差';
        const online = type === 0 ? '异常' : '正常';
        const Title = (editing, value, mac, devid) => {
            if (!editing) {
                return (
                    <p>
                        <label title={value}>
                            {value}
                        </label>
                        <label style={{marginTop: -30}} onClick={this.toggleEdit}>
                            <CustomIcon size={8}  type="rename" />
                        </label>
                    </p>
                )
            } else {
                return (
                    <Input
                        defaultValue={value}
                        placeholder="请输入设备位置"
                        autoFocus={true}
                        onPressEnter={e => this.save(e, value, mac, devid)}
                        onBlur={e => this.save(e, value, mac, devid)}
                    />
                )
            }
        }
        const Info = (type, role) => {
            if (role) {
                return (
                    <div className='satelite-info'>
                        {Title(this.state.editing, reList.name, reList.mac, reList.devid)}
                        <ul>
                            <li><label>联网状态：</label><span style={{color: type === 0 ? '#DD726D' : '#60CC13'}}>{online}</span></li>
                            <li><label>IP：</label><span>{reList.ip}</span></li>
                            <li><label>MAC：</label><span>{reList.mac}</span></li>
                        </ul>
                    </div>
                )
            } else {
                switch(type) {
                    case 1://较差较好的情况
                        return (
                            <div className='satelite-info'>
                                {Title(this.state.editing, reList.name, reList.mac, reList.devid)}
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
                                {Title(this.state.editing, reList.name, reList.mac, reList.devid)}
                                <ul>
                                    <li><label>离线</label></li>
                                    <li><label>IP：</label><span>--</span></li>
                                    <li><label>MAC：</label><span>{reList.mac}</span></li>
                                    <li><label>上级路由：</label><span>--</span></li>
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
                                    <li><label>信号强度：</label><span style={{color: color}}>较差</span></li>
                                    <li><label>IP：</label><span>192.168.2.1</span></li>
                                    <li><label>MAC：</label><span>00.00.00.00.00.00</span></li>
                                    <li><label>上级路由：</label><span>SUNIM_XX(位置)</span></li>
                                </ul>
                            </div>
                        );
                }
            }
        }

        const contentType = (type, role) => {
            if (role) {
                return (
                    <div className='sate-router'>
                        <CustomIcon size={60} color='#fff' type="router" />
                        <label>
                            <CustomIcon size={14} color='#fff' style={{display: 'inline', marginRight: 4}} type="main" />
                            <span title={reList.name}>{reList.name}</span>
                        </label>
                    </div>
                )
            } else {
                switch(type) {
                    case 1://较差较好的情况
                        return (
                            <div className='sate-router'>
                                <div>
                                    <CustomIcon size={60} color='#fff' type="router" />                                
                                </div>
                                <label title={reList.name}>{reList.name}</label>
                                <p><span style={{color: color}}>{rssi}</span></p>
                            </div>
                        );
                    case 0://设备离线情况
                        return  (
                            <div className='sate-router'>
                                <div>
                                    <CustomIcon size={60} color='#fff' type="router" />
                                </div>
                                <label title={reList.name}>{reList.name}</label>
                                <p className="sate-offline">已离线</p>
                            </div>
                        )   
                }
            } 
        }
        return (
            <Popover placement="bottomLeft"  arrowPointAtCenter trigger='click' content={Info(type, role)}>
                {contentType(type, role)}
            </Popover>
        )
    }
}