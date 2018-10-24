var nameElement = document.getElementById('name');
var descElement = document.getElementById('desc');
var serviceElement = document.getElementById('service');
var logoElement = document.getElementById('logo');
var timeDownElement = document.getElementById('timeDown');

window.onload = function () {
    ajax({
        type: 'POST',
        url: '/api/AUTH_PORTAL',
        //url: '../portal/data.json',
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
                    console.log(sms);
                    countDown(Number(sms.online_limit) * 60);
                }
            }
        }
    });
};

function commonDataToPage(data) {
    document.body.style.background = "url('" + (data.background || "./imgs/bg.jpeg") + "')";
    logoElement.src = data.logo || "./imgs/logo.jpg";
    descElement.innerText = data.welcome || '欢迎';
    serviceElement.innerText = data.statement || '欢迎';
    nameElement.innerText = data.logo_info || '欢迎';
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