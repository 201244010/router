import intl from '~/i18n/intl';

const MODULE = 'check';
const { assign } = Object;

let checkNum = (num) => {
    if (false == /^-?\d+$/.test(num) || /^0\d/.test(num)){
        return intl.get(MODULE, 0);
    };

    return '';
}

let checkRange = (num, opt = {}) => {
    opt = assign({ min: -Math.pow(2, 32), max: Math.pow(2, 32), who: intl.get(MODULE, 1) }, opt);
    let {min, max, who} = opt;

    let errStr = checkNum(num, opt);
    if (errStr.length > 0) {
        return errStr;
    }

    num = (typeof num === 'string') ? parseInt(num, 10) : num;
    if (!(num >= min && num <= max)) {
        return intl.get(MODULE, 2, {who, min, max});
    }

    return '';
}   

let checkIpFormat = (ip, opt = {}) => {
    opt = assign({ who: intl.get(MODULE, 3)}, opt);

    // ip format ['xxx', 'xxx', 'xxx', 'xxx']
    let valid = ip.every((val) => {
        if (/^0\d/.test(val)) {
            return false;
        }

        let len = val.length;
        if (len == 0 || len > 3) {
            return false;
        }

        let v = parseInt(val, 10);
        if (v < 0 || v > 255) {
            return false;
        }
        
        return true;
    });

    valid = valid && (4 === ip.length);

    return valid ? '' : intl.get(MODULE, 4, {who});
}

let checkIp = (ip, opt = {}) => {
    opt = assign({ who: intl.get(MODULE, 3), loop: true, zero: true, broadcast: true, multicast: true, reserve: true }, opt);
    const who = opt.who;
    let valid = checkIpFormat(ip, opt);

    if (valid.length > 0) {
        // 格式非法
        return valid;
    }

    let ipStr = ip.join('.');
    if (opt.zero && '0.0.0.0' === ipStr) {
        // 全0地址
        return intl.get(MODULE, 6, {who});
    }

    if (opt.broadcast && '255.255.255.255' === ipStr) {
        // 全1地址
        return intl.get(MODULE, 7, {who});
    }

    let ip0 = parseInt(ip[0], 10);
    if (opt.multicast && (ip0 >= 0xE0 && ip0 <= 0xEF)) {
        // 组播IP地址 D类
        return intl.get(MODULE, 8, {who});
    }

    if (opt.reserve && 127 === ip0) {
        // 回环IP地址
        return intl.get(MODULE, 9, {who});
    }

    if (opt.reserve && (ip0 >= 0xF0 && ip0 <= 0xFF)) {
        // 保留地址 E类
        return intl.get(MODULE, 10, {who});
    }

    return '';
}

let checkMask = (mask, opt = {}) => {
    opt = assign({ who: intl.get(MODULE, 11), zero: true, broadcast: true}, opt);

    const who = opt.who;
    let valid = checkIpFormat(mask, opt);
    if (valid.length > 0) {
        // 格式非法
        return valid;
    }

    var maskVal = transIp(mask),
        maskTmp = 0x00000001;

    if (opt.zero && 0x0 === maskVal) {
        return intl.get(MODULE, 12, {who});
    }

    if (opt.broadcast && 0xFFFFFFFF === maskVal) {
        return intl.get(MODULE, 13, {who});
    }

    for (var index = 0; index < 32; index++ , maskTmp <<= 1) {
        if (0x00 != (maskTmp & maskVal)) {
            if (0 == (maskVal ^ (0xFFFFFFFF << index))) {
                return '';
            }

            return intl.get(MODULE, 14, {who});
        }
    }

    return '';
}

let transIp = (ip) => {
    return (0x1000000 * ip[0] + 0x10000 * ip[1] + 0x100 * ip[2] + 1 * ip[3]);
}

let checkSameNet = (ip1, ip2, netmask) => {
    let host1 = transIp(ip1);
    let host2 = transIp(ip2);
    let mask = transIp(netmask);

    return ((host1 &= mask) == (host2 &= mask));
}

/* 检查MAC地址格式是否合法 */
let validMacFormat = function (value, who = intl.get(MODULE, 15)) {
    let result = /^([0-9a-f]{2}:){5}([0-9a-f]{2})$/gi.test(value);

    return (result == true ? '' : intl.get(MODULE, 16, {who}));
};

/* 检查MAC地址范围是否合法 */
let validMacAddr = function (value, opt) {
    const who = opt.who;
    let charSet = "0123456789ABCDEF";
    let macAddr = value.toUpperCase();

    const zero = "00:00:00:00:00:00";
    if (opt.zero && macAddr == zero) {
        return intl.get(MODULE, 17, {who});
    }

    const broadcast = "FF:FF:FF:FF:FF:FF";
    if (opt.broadcast && macAddr == broadcast) {
        return intl.get(MODULE, 18, {who});
    }

    if (opt.multicast && 1 == charSet.indexOf(macAddr.charAt(1)) % 2) {
        return intl.get(MODULE, 19, {who});
    }

    return '';
};

let checkMac = function (mac, opt = {}) {
    opt = assign({ who:intl.get(MODULE, 20), zero: true, broadcast: true, multicast: true }, opt);
    const who = opt.who;
    let value = mac.join(':');
    let result = 0;

    if (0 == value.length) {
        return intl.get(MODULE, 21, {who});
    }

    let format = validMacFormat(value, who);
    if (format.length > 0) {
        return format;
    }

    let valid = validMacAddr(value, opt);
    if (valid.length > 0) {
        return valid;
    }

    return '';
};

let checkStr = function(val, opt = {}){
    opt = assign({
        who: intl.get(MODULE, 22),
        min: 0, 
        max: Number.POSITIVE_INFINITY,
        type: 'all',
        byte: false,  //判断是否按字节计算长度
    }, opt);

    const { who, min, max, type, byte } = opt;

    const checkMap = {
        hex: {
            reg: /^[0-9a-f]*$/gi,
            tip: intl.get(MODULE, 23, {who})
        },
        english: {
            reg: /^[\x20-\x7E]*$/g,
            tip: intl.get(MODULE, 24, {who})
        },
        all: {
            reg: /[\s\S]*/g,
        }
    };
    
    
    if (!checkMap[type].reg.test(val)) {
        return checkMap[type].tip;
    }

    let lens = 0;
    if (byte) {
        let str = val.split('');
        let arr = str.map(item => {return item.charCodeAt(0);});  //使用utf-8编码，获得字符串的编码值
        for( var i = 0; i < arr.length; i++){
            let len = 0;
            if (arr[i] <= 0x7F) {       //判定字符串中每个字符的字节长度
                len = 1;
            } else if ( arr[i] <= 0x7FF) {
                len = 2;
            } else if (arr[i] <= 0xFFFF) {
                len = 3;
            } else {
                len = 4;
            }

            lens += len;          //每个字符字节长度累加，得到字符串的长度
        }
    } else {
        lens = val.length;
    }

    if(lens === 0){
        return intl.get(MODULE, 25, {who});
    }else if(lens < min){
        if (byte) {
            return intl.get(MODULE, 26, {who});
        }
        return intl.get(MODULE, 27, {who, min});
    }else if(lens > max){
        if (byte) {
            return intl.get(MODULE, 28, {who});
        }
        return intl.get(MODULE, 29, {who, max});
    }

    return '';
}

export { checkNum, checkRange, checkIpFormat, checkIp, transIp, checkMask, checkSameNet, checkMac, checkStr };
