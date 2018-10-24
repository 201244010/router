function dynamicLoadCss() {
    var isMobilePhone = isMobile();
    var style  = document.createElement('link');
    style.setAttribute('type', 'text/css');
    style.setAttribute('rel', 'stylesheet');
    if (isMobilePhone) {
        style.setAttribute('id', 'mobileCss');
        style.setAttribute('href', './css/mobile.css');
        if(document.getElementById('pcCss')) {
            removeCss('pc.css');
        }
        if(!document.getElementById('mobileCss')) {
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    } else {
        style.setAttribute('id', 'pcCss');
        style.setAttribute('href', './css/pc.css');
        if(document.getElementById('mobileCss')) {
            removeCss('mobile.css');
        }
        if(!document.getElementById('pcCss')) {
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }
    style.onload = function() {
        style.disabled = true;
        style.disabled = false;
    };
}
dynamicLoadCss();
(function (doc, win, undefined) {
    var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
    if (doc.addEventListener === undefined) return;
    win.addEventListener(resizeEvt, dynamicLoadCss, false);
    doc.addEventListener('DOMContentLoaded', dynamicLoadCss, false)
})(document, window);