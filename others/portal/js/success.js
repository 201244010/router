// var nameElement = document.getElementById('name');
//var descElement = document.getElementById('desc');
var serviceElement = document.getElementById('service');
var logoElement = document.getElementById('logo');
var logoIcon = document.getElementById('logoIcon');
var timeDownElement = document.getElementById('timeDown');

window.onload = function () {
    ajax({
        type: 'POST',
        // url: '/api/AUTH_PORTAL',
        url: '/api/AUTH_PORTAL_CONFIG_GET',
        //url: '/web-w1/others/portal/data.json',
        // params: JSON.stringify({params: [{param: {}, opcode: "0x2088"}], count: "1"}),
        params: JSON.stringify({params: [{param: {}, opcode: "0x2063"}], count: "1"}),
        callback: function (response) {
            if (response.errcode === 0) {
                // var weixin = response.data[0].result.portal.weixin;
                // var sms = response.data[0].result.portal.sms;
                var portal = response.data[0].result.portal.portal;
                if(Number(portal.enable) === 1) {
                    commonDataToPage(portal.auth_config);
                    countDown(Number(portal.auth_config.online_limit) * 60);    
                }
                // if (Number(weixin.enable) === 1) {
                //     commonDataToPage(weixin);
                //     countDown(Number(weixin.online_limit) * 60);
                // } else if (Number(sms.enable)) {
                //     commonDataToPage(sms);
                //     countDown(Number(sms.online_limit) * 60);
                // }
            }
        }
    });
};

function commonDataToPage(data) {
    document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),'+"url('" + (data.background_url || "../common/imgs/bg.png") + "')";
    if (data.logo_url) {
        logoIcon.style.display = 'none';
        logoElement.style.display = 'block';
        logoElement.style.backgroundImage = 'url('+ data.logo_url +')';
    } else {
        logoElement.style.display = 'none';
        logoIcon.style.display = 'block';
    }
    serviceElement.innerText = data.statement || '欢迎';
    // nameElement.innerText = data.logo_info || '欢迎';
}

function countDown(time) {
    var timer = null;
    clearInterval(timer);
    timeDownElement.innerText = format(time);
    timer = setInterval(function () {
        time--;
        timeDownElement.innerText = format(time);
        if (time === 0) {
            clearInterval(timer);
        }
    }, 1000);
}

function format(time) {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time % 3600) / 60);
    var seconds = time % 60;
    return hours + '时' + minutes + '分' + seconds + '秒';
}