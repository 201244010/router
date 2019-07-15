import React from 'react';
import CustomIcon from '~/components/Icon';
import Loading from '~/components/Loading';
import { Popover, Button, Input} from 'antd';
import './topology.scss';

const MODULE = 'topology';

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
                                    <Button onClick={this.startDiagnose} className="diagnose"><span>{intl.get(MODULE, 0)}</span></Button>
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
                        <label>{intl.get(MODULE, 1)}</label>
                        <label>{intl.get(MODULE, 2)}</label>
                        <label>{intl.get(MODULE, 3)}</label>  
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
                                <label>{intl.get(MODULE, 4)}</label>
                            </li>
                        </ul> 
                    </div>
                </div>
                <div className="speed">
                    <ul>
                        <li>
                            <div>
                                <label className="up-speed">{intl.get(MODULE, 5)}</label>
                                <CustomIcon color="#fff" type="upload" style={{marginBottom: 1, marginLeft: 3, opacity: 0.6}} size={12}/>
                            </div>
                            <div className="speed-content">
                                <label>{upSpeed}</label>
                                <span>{upUnit}</span>
                            </div>
                        </li>
                        <li>
                            <div>
                                <label className="up-speed">{intl.get(MODULE, 6)}</label>
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
        }
    }

    render() {
        const reList = this.props.reList;
        const type = parseInt(reList.online);
        const role = parseInt(reList.role);
        const color = reList.rssi >= 20 ? '#97E063' : '#FFCEBD';
        const colorDetail = reList.rssi >= 20 ? '#60CC13' : '#D0021B';
        const rssi = reList.rssi >= 20 ? intl.get(MODULE, 7) : intl.get(MODULE, 18);
        const online = type === 0 ? intl.get(MODULE, 8) : intl.get(MODULE, 21);
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
                        placeholder={intl.get(MODULE, 9)}
                        autoFocus={true}
                        onPressEnter={e => this.save(e, value, mac, devid)}
                        onBlur={e => this.save(e, value, mac, devid)}
                        maxLength={32}
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
                            <li><label>{intl.get(MODULE, 10)}</label><span style={{color: type === 0 ? '#DD726D' : '#60CC13'}}>{online}</span></li>
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
                                    <li><label>{intl.get(MODULE, 11)}</label><span style={{color: colorDetail}}>{rssi}</span></li>
                                    <li><label>IP：</label><span>{reList.ip}</span></li>
                                    <li><label>MAC：</label><span>{reList.mac}</span></li>
                                    <li><label>{intl.get(MODULE, 12)}</label><span>{reList.parent}</span></li>
                                </ul>
                            </div>
                        );
                    case 0://设备离线情况
                        return  (
                            <div className='satelite-info'>
                                {Title(this.state.editing, reList.name, reList.mac, reList.devid)}
                                <ul>
                                    <li><label>{intl.get(MODULE, 13)}</label></li>
                                    <li><label>IP：</label><span>--</span></li>
                                    <li><label>MAC：</label><span>{reList.mac}</span></li>
                                    <li><label>{intl.get(MODULE, 14)}</label><span>--</span></li>
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
                                    <li><label>{intl.get(MODULE, 15)}</label><span style={{color: colorDetail}}>{intl.get(MODULE, 19)}</span></li>
                                    <li><label>IP：</label><span>192.168.2.1</span></li>
                                    <li><label>MAC：</label><span>00.00.00.00.00.00</span></li>
                                    <li><label>{intl.get(MODULE, 16)}</label><span>SUNIM_XX({intl.get(MODULE, 20)}})</span></li>
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
                            <CustomIcon size={14} color='#fff' style={{display: 'inline', marginRight: 4, verticalAlign: 'unset'}} type="main" />
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
                                <p className="sate-offline">{intl.get(MODULE, 17)}</p>
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