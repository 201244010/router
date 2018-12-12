function paddingLeftZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

export const getNowTimeStr = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = paddingLeftZero(now.getMonth() + 1);
    const date = paddingLeftZero(now.getDate());
    const hour = paddingLeftZero(now.getHours());
    const minute = paddingLeftZero(now.getMinutes());
    const second = paddingLeftZero(now.getSeconds());

    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};

export const UA = (function () {
    let windows = false;
    let windowsPhone = false;
    let unixPC = false;
    let iPad = false;
    let iPhone = false;
    let iMacPC = false;
    let iPod = false;
    let android = false;
    let nokia = false;
    let player = false;
    let portable = false;
    let mobile = false;

    const pl = navigator.platform;
    const ua = navigator.userAgent;

    if (pl) {
        if (pl.indexOf("Win") >= 0) {
            if (ua.indexOf("Windows Phone") >= 0) {
                windowsPhone = true;
                windows = true;
                portable = true;
                mobile = true;
            } else {
                windows = true;
                portable = false;
            }
        }
        if (ua.indexOf("NOKIA") >= 0) {
            nokia = true;
            portable = true;
            mobile = true;
        }
        if (ua.indexOf("Android") >= 0) {
            android = true;
            portable = true;
            mobile = true;
        }
        if (pl.indexOf("iPad") >= 0) {
            iPad = true;
            portable = true;
            mobile = false;
        }
        if (pl.indexOf("iPhone") >= 0) {
            iPhone = true;
            portable = true;
            mobile = true;
        }
        if (pl.indexOf("iPod") >= 0) {
            iPod = true;
            portable = true;
            mobile = true;
        }
        if ((ua.indexOf("Wii") >= 0) || (ua.indexOf("PLASTATION") >= 0)) {
            player = true;
            portable = true;
            mobile = true;
        }
        if (pl.indexOf("Mac") >= 0) {
            iMacPC = true;
            portable = false;
            mobile = false;
        }
        if ((pl.indexOf("X11") >= 0) || ((pl.indexOf("Linux") >= 0) && (pl.indexOf("arm") < 0))) {
            unixPC = true;
            portable = false;
            mobile = false;
        }
    } else if (ua.indexOf("Android") >= 0) {
        android = true;
        portable = true;
        mobile = true;
    } else {
        if (document.body.clientWidth >= 1024 || document.body.clientHeight >= 1024) {
            portable = false;
            mobile = false;
        } else {
            portable = true;
            mobile = true;
        }
    }

    return {
        windows,
        windowsPhone,
        unixPC,
        iPad,
        iPhone,
        iMacPC,
        iPod,
        android,
        nokia,
        player,
        portable,
        mobile
    }
})();

// 控制访问H5页面还是PC Web页面
export const PAGE_STYLE_KEY = '__PAGE_STYLE__';
export const PAGE_STYLE_H5 = 'H5';
export const PAGE_STYLE_WEB = 'WEB';
