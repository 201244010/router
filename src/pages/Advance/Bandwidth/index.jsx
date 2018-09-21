
import React from 'react';
import PanelHeader from '~/components/PanelHeader';
import Form from "~/components/Form";

const {FormItem, Input,InputGroup} = Form;
import '../../Settings/settings.scss'

export default class Bandwidth extends React.PureComponent {
    state = {

    }
    
    
    render(){
        return (
            <div className="wifi-settings">
                <Form style={{width : '100%',marginTop : 0, paddingLeft : 0}}>
                    <section className="wifi-setting-item">
                        <PanelHeader title="总带宽" checkable={false} onChange={(value)=>this.onChange('channelType',value)}/>
                    </section>
                </Form>
            </div>
        );
    }
};

