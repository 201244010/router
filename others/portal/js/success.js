window.onload = function () {
    ajax({
        type: 'POST',
        url: '/api/AUTH_PORTAL',
        //url: '/portal/data.json',
        params: JSON.stringify({params: [{param: {}, opcode: "0x2088"}], count: "1"}),
        callback: function (response) {
            if (response.errcode === 0) {
                var weixin = response.data[0].result.portal.weixin;
                var sms = response.data[0].result.portal.sms;
                if (Number(weixin.enable) === 1) {
                    commonDataToPage(weixin);
                } else if (Number(sms.enable)) {
                    commonDataToPage(sms);
                }
            }
        }
    });
};

function commonDataToPage(data) {
    document.body.style.background = "url('" + data.background + "')";
    logoElement.src = data.logo;
    descElement.innerText = data.welcome || '欢迎';
    serviceElement.innerText = data.statement || '欢迎';
    nameElement.innerText = data.logo_info || '欢迎';
}