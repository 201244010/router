// var nameElement = document.getElementById('name');
//var descElement = document.getElementById('desc');
var serviceElement = document.getElementById('service');
var logoElement = document.getElementById('logo');
var logoIcon = document.getElementById('logoIcon');
var timeDownElement = document.getElementById('timeDown');

window.onload = function () {
    ajax({
        type: 'POST',
        url: '/api/AUTH_PORTAL',
        //url: '/web-w1/others/portal/data.json',
        params: JSON.stringify({params: [{param: {}, opcode: "0x2088"}], count: "1"}),
        callback: function (response) {
            if (response.errcode === 0) {
                var weixin = response.data[0].result.portal.weixin;
                var sms = response.data[0].result.portal.sms;
                if (Number(weixin.enable) === 1) {
                    commonDataToPage(weixin);
                    countDown(Number(weixin.online_limit) * 60);
                } else if (Number(sms.enable)) {
                    commonDataToPage(sms);
                    countDown(Number(sms.online_limit) * 60);
                }
            }
        }
    });
};

function commonDataToPage(data) {
    document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),'+"url('" + (data.background || "../common/imgs/bg.png") + "')";
    if (data.logo) {
        logoIcon.style.display = 'none';
        logoElement.style.display = 'block';
        logoElement.style.backgroundImage = 'url('+ data.logo +')';
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