let detect = async (props) => {
    // 触发检测联网状态
    await common.fetchApi(
        {
            opcode: 'WANWIDGET_ONLINETEST_START'
        }
    );

    // 获取联网状态
    let connectStatus = await common.fetchApi(
        {
            opcode: 'WANWIDGET_ONLINETEST_GET'
        },
        {},
        {
            loop : true,
            interval : 3000,
            stop : ()=> this.stop,
            pending : resp => resp.data[0].result.onlinetest.status !== 'ok'
        }
    );

    let { errcode, data } = connectStatus;
    if(0 === errcode) {
        return data[0].result.onlinetest.online;
    }

    return false;
}

export { detect };