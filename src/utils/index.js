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

export const brower = (function () {
    const u = window.navigator.userAgent;
    return {
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
    };
})();
