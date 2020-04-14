// var nameElement = document.getElementById('name');
//var descElement = document.getElementById('desc');
var serviceElement = document.getElementById('service');
var logoElement = document.getElementById('logo');
var logoIcon = document.getElementById('logoIcon');
var timeDownElement = document.getElementById('timeDown');
// var moreInfoBtnElement = document.getElementById('moreInfoBtn');
// var moreInfoElement = document.getElementById('moreInfo');

window.onload = function () {
    ajax({
        type: 'POST',
        url: '/api/AUTH_PORTAL_CONFIG_GET',
        params: JSON.stringify({params: [{param: {}, opcode: "0x2063"}], count: "1"}),
        callback: function (response) {
            if (response.errcode === 0) {
                var portal = response.data[0].result.portal;
                if(Number(portal.enable) === 1) {
                    commonDataToPage(portal.auth_config);
                    countDown(Number(portal.auth_config.online_limit) * 60);    
                }
            }
        }
    });
};

function commonDataToPage(data) {
    document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),'+"url('" + (data.background_url || "../common/imgs/bg.png") + "')";
    logoElement.style.backgroundImage = 'url('+ (data.logo_url || '../common/imgs/logo.png') +'?r=' + Math.random()+')';
    // if (Number(data.link_enable) === 1) {
    //     moreInfoBtnElement.style.display = 'block';
    //     moreInfoElement.style.display = 'block';
    //     moreInfoBtnElement.innerText = data.link_label;
    //     moreInfoElement.href = data.link_addr;
    // } else {
    //     moreInfoBtnElement.style.display = 'none';
    //     moreInfoElement.style.display = 'none';
    // }
    serviceElement.innerText = data.statement || '欢迎';
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