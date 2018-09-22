
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";
import { Button, Table } from 'antd'

import CustomIcon from '~/components/Icon';
const {FormItem, Input,InputGroup} = Form;
import '../../Settings/settings.scss'
import '../advance.scss'

export default class Bandwidth extends React.PureComponent {
    state = {
        bandvalue : '12.44',
        bandenable : false
    }
    

    OnBandEnable = value => {
        this.setState({
            bandenable : value
        })
    }
    
    render(){
        const {bandvalue, bandenable} = this.state;
        const columns = [{
            title : '设备类型',
            dataIndex : 'type'
        },{
            title : '带宽分配优先级',
            dataIndex : 'priority'
        },{
            title : '最低保证比例',
            dataIndex : 'percent'
        }]
    
        const data = [{
            key : '1',
            type : '商米设备',
            priority : '高',
            percent : '20'
        },{
            key : '2',
            type : '优先设备',
            priority : '中',
            percent : '20'
        },{
            key : '3',
            type : '普通设备',
            priority : '低',
            percent : '20'
        }]  

        return (
            <div style={{paddingLeft : 60}}>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="总带宽" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
                <section className="band-value">
                    <label className="band-size">{bandvalue}
                        <span className="band-unit">Mbps</span>
                        <span className="band-bottom">上行带宽<span className="icon-band"><CustomIcon size={12} color="blue" type="kbyte"/></span></span>
                    </label>
                    <label className="band-line">|</label> 
                    <label className="band-size">{bandvalue}
                        <span className="band-unit">Mbps</span>
                        <span className="band-bottom">下行带宽<span className="icon-band"><CustomIcon size={12} color="green" type="downloadtraffic"/></span></span>
                    </label>
                </section>
                <section style={{margin:"20px 20px 20px 0"}}>
                        <Button style={{marginRight:20,width : 116}}>自动设置</Button>
                        <Button style={{width : 116}}>手动设置</Button>
                </section>
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="网速智能分配" checkable={true} onChange={this.OnBandEnable}/>
                    </section>
                    {
                        bandenable ?  <Bandon columns={columns} data={data}/> : <Bandclose />
                    }
                </Form>
            </div>
        );
    }
};

const Bandclose = props => {
    return (
        <p>"网速智能分配"启用后，路由器会根据设备优先级调配带宽，当网络繁忙时，最低保证比例的设置可以保证最低优先级设备也可以上网。</p>
     )
}

const Bandon = props => {
     return (<Table columns={props.columns} dataSource={props.data} />)
}