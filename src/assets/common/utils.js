const MODULE = 'utils';

let formatTime = (total) => {
    let seconds = parseInt(total, 10);
    let day = parseInt(seconds / 86400);
    let hour = parseInt((seconds % 86400) / 3600);
    let minute = parseInt((seconds % 3600) / 60);
    let second = parseInt(seconds % 60);

    let timeStr = "";
    if (day > 0) {
        timeStr += day + intl.get(MODULE, 0)/*_i18n:天*/;
    }

    if (hour > 0) {
        timeStr += hour + intl.get(MODULE, 1)/*_i18n:时*/;
    }

    if (minute > 0) {
        timeStr += minute + intl.get(MODULE, 2)/*_i18n:分*/;
    }

    if (second >= 0) {
        timeStr += second + intl.get(MODULE, 3)/*_i18n:秒*/;
    }

    return timeStr;
}

let transformTime = (timestamp = +new Date()) => {
    if (timestamp) {
        var time = new Date(timestamp);
        var y = time.getFullYear();
        var M = time.getMonth() + 1;
        var d = time.getDate();
        // var h = time.getHours();
        // var m = time.getMinutes();
        // var s = time.getSeconds();
        return y + '-' + addZero(M) + '-' + addZero(d);
      } else {
          return '';
      }
}

function addZero(m) {
    return m < 10 ? '0' + m : m;
}

// 格式化网络速率，最多保留4位数字+单位
let formatSpeed = (speed) => {
    let kSpeed = 1024;
    let mSpeed = kSpeed * 1024;
    let gSpeed = mSpeed * 1024;
    // 'xx.xx'

    speed = parseInt(speed, 10);
    if (speed >= gSpeed) {
        let val = speed / gSpeed;
        speed = (val).toFixed(val > 99 ? 0 : 2) + "GB/s";
    }
    else if (speed >= mSpeed) {
        let val = speed / mSpeed;
        speed = (val).toFixed(val > 99 ? 0 : 2) + "MB/s";
    }
    else {
        speed = (speed / kSpeed).toFixed(0) + "KB/s";
    }

    return speed + '';
}

export { formatTime, formatSpeed , transformTime};
