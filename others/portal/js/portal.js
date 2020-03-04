/**
 * Fix classList not avaliable in IE
 */
if (!("classList" in document.documentElement)) {
    Object.defineProperty(HTMLElement.prototype, 'classList', {
        get: function () {
            var self = this;
            function update(fn) {
                return function (value) {
                    var classes = self.className.split(/\s+/g),
                        index = classes.indexOf(value);

                    fn(classes, index, value);
                    self.className = classes.join(" ");
                }
            }

            return {
                add: update(function (classes, index, value) {
                    if (!~index) classes.push(value);
                }),

                remove: update(function (classes, index) {
                    if (~index) classes.splice(index, 1);
                }),

                toggle: update(function (classes, index, value) {
                    if (~index)
                        classes.splice(index, 1);
                    else
                        classes.push(value);
                }),

                contains: function (value) {
                    return !!~self.className.split(/\s+/g).indexOf(value);
                },

                item: function (i) {
                    return self.className.split(/\s+/g)[i] || null;
                }
            };
        }
    });
}

var passwordInput = document.getElementById('passwordInput');
var mobileInput = document.getElementById('mobileInput');
var mobileError = document.getElementById('mobileError');
var codeInput = document.getElementById('codeInput');
var codeGetter = document.getElementById('codeGetter');
//var codeError = document.getElementById('codeError');
var countDown = document.getElementById('countDown');
var cleanIcon = document.getElementById('cleanIcon');
var connectBtn = document.getElementById('connectBtn');
var connectText = document.getElementById('connectText');
// var protocol = document.getElementById('protocol');
var toast = document.getElementById('toast');
// var nameElement = document.getElementById('name');
var descElement = document.getElementById('desc');
var serviceElement = document.getElementById('service');
var passwordInputsElement = document.getElementById('password-inputs');
var smsInputsElement = document.getElementById('sms-inputs');
var logoElement = document.getElementById('logo');
var agreementElement = document.getElementById('agreement');
// var lawMaskElement = document.getElementById('lawMask');
var lawContentElement = document.getElementById('lawContent');
var iKnowElement = document.getElementById('iKnow');
var agreeProtocol = true;
var enable = null;
var btnDisabled = true;

window.onload = function () {
    ajax({
        type: 'POST',
        url: '/api/AUTH_PORTAL_CONFIG_GET',
        params: JSON.stringify({params: [{param: {}, opcode: "0x2063"}], count: "1"}),
        callback: function (response) {
            if (response.errcode === 0) {
                var portal = response.data[0].result.portal;
                if (Number(portal.enable) === 1) {
                    if (portal.auth_config.auth_type === 'none') {
                        smsInputsElement.style.display = 'none';
                        passwordInputsElement.style.display = 'none';
                        connectBtn.classList.remove('btn-disabled');
                        btnDisabled = false;
                        enable = {
                            type: 'none',
                            data: portal.auth_config
                        };
                    } else if (portal.auth_config.auth_type === 'pwd_auth') {
                        smsInputsElement.style.display = 'none';
                        passwordInputsElement.style.display = 'block';
                        enable = {
                            type: 'pwd_auth',
                            data: portal.auth_config
                        };
                    } else {
                        smsInputsElement.style.display = 'block';
                        passwordInputsElement.style.display = 'none';
                        enable = {
                            type: 'sms',
                            data: portal.auth_config
                        };
                    }
                    commonDataToPage(portal.auth_config);
                } else {
                    showToast('请开启portal功能', 0);
                }
            }
        }
    });
};

function parseUrl(name) {
    var url = location.search.slice(0);
    var reg = new RegExp(name + '\=([^&]+)'), ret = reg.exec(url);
    return ret ? ret[1] : null;
}

passwordInput.addEventListener('input', function () {
    passwordInput.value = passwordInput.value.replace(/[^\d]/g, '');
    canConnect();
}, false);

passwordInput.addEventListener('focus', function () {
    passwordInput.classList.remove('error');
}, false);

passwordInput.addEventListener('blur', function () {
    if (passwordInput.value === '') {
        passwordInput.classList.add('error');
        showToast('请输入密码');
    }
}, false);

mobileInput.addEventListener('input', function () {
    mobileInput.value = mobileInput.value.replace(/[^\d]/g, '');
    canConnect();
}, false);

mobileInput.addEventListener('focus', function () {
    mobileInput.classList.remove('error');
}, false);

mobileInput.addEventListener('blur', function () {
    var mobile = mobileInput.value;
    if (!checkMobile(mobile)) {
        mobileInput.classList.add('error');
        showToast('请输入正确的手机号');
    }
}, false);

cleanIcon.addEventListener('click', function () {
    mobileInput.value = '';
    mobileInput.focus();
    mobileInput.classList.remove('error');
    mobileError.classList.remove('show');
    mobileError.classList.add('not-show');
}, false);

codeInput.addEventListener('input', function () {
    codeInput.value = codeInput.value.replace(/[^\d]/g, '');
    canConnect();
}, false);

codeInput.addEventListener('focus', function () {
    codeInput.classList.remove('error');
}, false);

codeInput.addEventListener('blur', function () {
    var code = codeInput.value;
    if (!checkCode(code)) {
        codeInput.classList.add('error');
        showToast('请输入正确的验证码');
    }
}, false);

codeGetter.addEventListener('click', function () {
    var phone = mobileInput.value;
    var waitTime = 59;
    if (checkMobileWithBlank(phone)) {
        var params = {
            params: [{
                param: {
                    sms: {
                        phone: phone
                    }
                },
                opcode: "0x2080"
            }],
            count: "1"
        };

        codeGetter.classList.remove('show');
        codeGetter.classList.add('not-show');
        countDown.classList.add('show');
        countDown.classList.remove('not-show');
        countDown.innerText = waitTime + 's';
        codeGetter.timer = setInterval(function () {
            countDown.innerText = waitTime + 's';
            if (waitTime === 0) {
                clearInterval(codeGetter.timer);
                countDown.classList.remove('show');
                countDown.classList.add('not-show');
                codeGetter.innerText = '重新获取';
                codeGetter.classList.add('show');
                codeGetter.classList.remove('not-show');
            }
            waitTime--;
        }, 1000);

        ajax({
            url: '/api/AUTH_SHORTMESSAGE_CODE_REQUEST',
            type: 'POST',
            params: JSON.stringify(params),
            callback: function (response) {
                if (response.errcode === 0) {
                    showToast('短信验证码发送成功');
                } else if (response.errcode === -1) {
                    showToast('请求失败，请稍后再试');
                } else {
                    showToast('短信验证码发送失败');
                }
            }
        });
    } else {
        showToast('请输入手机号');
    }
}, false);

connectBtn.addEventListener('click', function () {
    if (btnDisabled) {
        return;
    }

    if (!validate()) {
        return;
    }

    if (enable.type === 'pwd_auth') {
        var password = passwordInput.value;
        var params = {
            params: [{
                param: {
                    password: password,
                    gw_address: parseUrl("gw_address"),
                    gw_port: parseUrl("gw_port"),
                },
                opcode: "0x2083"
            }],
            count: "1"
        };
        ajax({
            url: '/api/AUTH_PASSWORD_VERIFY',
            type: 'POST',
            params: JSON.stringify(params),
            callback: function (response) {
                if (response.errcode === 0) {
                    window.location.href = response.data[0].result.redirect_url;
                } else if (response.errcode === -1) {
                    showToast('请求失败，请稍后再试');
                } else {
                    showToast('连接Wi-Fi失败');
                }
            }
        });
    } else if (enable.type === 'sms') {
        var phone = mobileInput.value;
        var code = codeInput.value;
        var params = {
            params: [{
                param: {
                    sms: {
                        phone: phone,
                        code: code,
                        gw_address: parseUrl("gw_address"),
                        gw_port: parseUrl("gw_port")
                    }
                },
                opcode: "0x2081"
            }],
            count: "1"
        };
        ajax({
            url: '/api/AUTH_SHORTMESSAGE_CODE_VERIFY',
            type: 'POST',
            params: JSON.stringify(params),
            callback: function (response) {
                if (response.errcode === 0) {
                    window.location.href = response.data[0].result.redirect_url;
                } else if (response.errcode === -1) {
                    showToast('请求失败，请稍后再试');
                } else {
                    showToast('连接Wi-Fi失败');
                }
            }
        });
    } else {
        var params = {
            params: [{
                param: {
                    password: '',
                    gw_address: parseUrl("gw_address"),
                    gw_port: parseUrl("gw_port"),
                },
                opcode: "0x2083"
            }],
            count: "1"
        };
        ajax({
            url: '/api/AUTH_PASSWORD_VERIFY',
            type: 'POST',
            params: JSON.stringify(params),
            callback: function (response) {
                if (response.errcode === 0) {
                    window.location.href = response.data[0].result.redirect_url;
                } else if (response.errcode === -1) {
                    showToast('请求失败，请稍后再试');
                } else {
                    showToast('连接Wi-Fi失败');
                }
            }
        });
    }
}, false);

function showToast(msg, duration) {
    if (undefined === duration) {
        duration = 3000;
    }

    toast.innerText = msg;
    toast.classList.remove('not-show');
    toast.classList.add('show');
    clearTimeout(toast.timer);
    if (0 !== duration) {
        toast.timer = setTimeout(function () {
            toast.classList.remove('show');
            toast.classList.add('not-show');
        }, duration);
    }
}

function validate() {
    if (enable.type === 'sms') {
        if (!checkMobileWithBlank()) {
            showToast('请填写正确的手机号');
            return false;
        }
        if (!checkCodeWithBlank()) {
            showToast('请填写正确的验证码');
            return false;
        }
    }

    return true;
}

function commonDataToPage(data) {
    connectText.innerText = data.connect_label || '连接Wi-Fi';
    document.body.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, .5)),'+"url(" + ((data.background_url ||
         "../common/imgs/bg.png") + "?r=") + Math.random() + ")";
    logoElement.style.backgroundImage = 'url('+ (data.logo_url || '../common/imgs/logo.png') +'?r=' + Math.random()+')';
    descElement.innerText = data.welcome || '欢迎';
    serviceElement.innerText = data.statement || '欢迎';
}

function checkMobile(mobile) {
    if (!mobile) {
        return true;
    }
    return /^1\d{10}$/.test(mobile);
}

function checkMobileWithBlank() {
    var mobile = mobileInput.value;
    return /^1\d{10}$/.test(mobile);
}

function checkCode(code) {
    if (!code) {
        return true;
    }
    return /^\d{4}$/.test(code);
}

function checkCodeWithBlank() {
    var code = codeInput.value;
    return /^\d{4}$/.test(code);
}

function canConnect() {
    if (enable.type === 'pwd_auth') {
        if (passwordInput.value !== '') {
            connectBtn.classList.remove('btn-disabled');
            btnDisabled = false;
        } else {
            connectBtn.classList.add('btn-disabled');
            btnDisabled = true;
        }
    } else if (enable.type === 'sms') {
        if (checkMobileWithBlank() && checkCodeWithBlank()) {
            connectBtn.classList.remove('btn-disabled');
            btnDisabled = false;
        } else {
            connectBtn.classList.add('btn-disabled');
            btnDisabled = true;
        }
    }
}
