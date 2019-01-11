const { assign } = Object;

let checkNum = (num) => {
    if (false == /^-?\d+$/.test(num) || /^0\d/.test(num)){
        return '请输入正确的数字';
    };

    return '';
}

let checkRange = (num, opt = {}) => {
    opt = assign({ min: -Math.pow(2, 32), max: Math.pow(2, 32), who: '数字' }, opt);
    let {min, max, who} = opt;

    let errStr = checkNum(num, opt);
    if (errStr.length > 0) {
        return errStr;
    }

    num = (typeof num === 'string') ? parseInt(num, 10) : num;
    if (!(num >= min && num <= max)) {
        return `${who}范围必须在${min}-${max}之间`;
    }

    return '';
}   

let checkIpFormat = (ip, opt = {}) => {
    opt = assign({ who: 'IP地址'}, opt);

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

    return valid ? '' : `${opt.who}非法（形如X.X.X.X，其中X为0-255之间的数字）`;
}

let checkIp = (ip, opt = {}) => {
    opt = assign({ who: 'IP地址', loop: true, zero: true, broadcast: true, multicast: true, reserve: true }, opt);
    const who = opt.who;
    let valid = checkIpFormat(ip, opt);

    if (valid.length > 0) {
        // 格式非法
        return valid;
    }

    let ipStr = ip.join('.');
    if (opt.zero && '0.0.0.0' === ipStr) {
        // 全0地址
        return `${who}不能为0.0.0.0`;
    }

    if (opt.broadcast && '255.255.255.255' === ipStr) {
        // 全1地址
        return `${who}不能为255.255.255.255`;
    }

    let ip0 = parseInt(ip[0], 10);
    if (opt.multicast && (ip0 >= 0xE0 && ip0 <= 0xEF)) {
        // 组播IP地址 D类
        return `${who}不能为D类地址`;
    }

    if (opt.reserve && 127 === ip0) {
        // 回环IP地址
        return `${who}不能为回环地址`;
    }

    if (opt.reserve && (ip0 >= 0xF0 && ip0 <= 0xFF)) {
        // 保留地址 E类
        return `${who}不能为E类地址`;
    }

    return '';
}

let checkMask = (mask, opt = {}) => {
    opt = assign({ who: '子网掩码', zero: true, broadcast: true}, opt);

    const who = opt.who;
    let valid = checkIpFormat(mask, opt);
    if (valid.length > 0) {
        // 格式非法
        return valid;
    }

    var maskVal = transIp(mask),
        maskTmp = 0x00000001;

    if (opt.zero && 0x0 === maskVal) {
        return `${who}不能为0.0.0.0`;
    }

    if (opt.broadcast && 0xFFFFFFFF === maskVal) {
        return `${who}不能为255.255.255.255`;
    }

    for (var index = 0; index < 32; index++ , maskTmp <<= 1) {
        if (0x00 != (maskTmp & maskVal)) {
            if (0 == (maskVal ^ (0xFFFFFFFF << index))) {
                return '';
            }

            return `${who}非法`;
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
let validMacFormat = function (value, who = 'MAC地址') {
    let result = /^([0-9a-f]{2}:){5}([0-9a-f]{2})$/gi.test(value);

    return (result == true ? '' : `${who}非法（形如XX:XX:XX:XX:XX:XX，X为[0-9,A-F]）`);
};

/* 检查MAC地址范围是否合法 */
let validMacAddr = function (value, opt) {
    const who = opt.who;
    let charSet = "0123456789ABCDEF";
    let macAddr = value.toUpperCase();

    const zero = "00:00:00:00:00:00";
    if (opt.zero && macAddr == zero) {
        return `${who}不能为${zero}`;
    }

    const broadcast = "FF:FF:FF:FF:FF:FF";
    if (opt.broadcast && macAddr == broadcast) {
        return `${who}不能为广播地址（${broadcast}）`;
    }

    if (opt.multicast && 1 == charSet.indexOf(macAddr.charAt(1)) % 2) {
        return `${who}不能为组播地址`;
    }

    return '';
};

let checkMac = function (mac, opt = {}) {
    opt = assign({ who:'MAC地址', zero: true, broadcast: true, multicast: true }, opt);
    const who = opt.who;
    let value = mac.join(':');
    let result = 0;

    if (0 == value.length) {
        return `请输入${who}`;
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
        who: '字符串',
        min: 0, 
        max: Number.POSITIVE_INFINITY,
        type: 'all',
        byte: false,  //判断是否按字节计算长度
    }, opt);

    const { who, min, max, type } = opt;

    const checkMap = {
        hex: {
            reg: /^[0-9a-f]*$/gi,
            tip: `${who}非法，请输入0-9、A-F、a-f之间的字符`
        },
        english: {
            reg: /^[\x20-\x7E]*$/g,
            tip: `${who}非法，请输入英文字符`
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
        let arr = str.map(item => {return item.charCodeAt(0);});
        for(i=0; i < arr.length; i++){
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

            lens = lens + len;          //每个字符字节长度累加，得到字符串的长度
        }
    } else {
        lens = val.length;
    }

    if(lens === 0){
        return `请输入${who}`;
    }else if(lens < min){
        if (byte) {
            return `${who}长度不足`;
        }
        return `${who}长度不能小于${min}位`;
    }else if(lens > max){
        if (byte) {
            return `${who}长度过长`;
        }
        return `${who}长度不能超过${max}位`;
    }

    return '';
}

export { checkNum, checkRange, checkIpFormat, checkIp, transIp, checkMask, checkSameNet, checkMac, checkStr };
