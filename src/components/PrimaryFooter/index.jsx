import React from 'react';

export default class PrimaryFooter extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer className={this.props.className}>
                <p> <span>系统版本：1.0.0稳定版</span> <span>MAC地址：34:36:3B:78:48:F7</span></p>
                <p>
                    @2016 上海商米科技有限公司
                <a href="https://sunmi.com/" target='_blank'>官网</a>|
                <a href="javascript:;">常见问题</a>|
                    服务热线：400-902-1168
            </p>
            </footer>
        )
    }
}
