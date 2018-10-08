let checkNum = (num) => {
    return /^-?\d+$/.test(num);
}

let checkRange = (num, min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY) => {
    if (checkNum(num)){
        num = (typeof num === 'string') ? parseInt(num, 10) : num;
        return (num >= min && num <= max);
    }

    return false;
}

let checkIpFormat = (ip) => {
    // ip format ['xxx', 'xxx', 'xxx', 'xxx']
    let valid = ip.every((val) => {
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

    return valid;
}

let checkIp = (ip, opt = { loop: true, zero: true, broadcast: true, multicast: true, reserve: true }) => {
    let valid = checkIpFormat(ip);

    if (!valid) {
        // 格式非法
        return -1;
    }

    let ipStr = ip.join('.');
    if (opt.zero && '0.0.0.0' === ipStr) {
        // 全0地址
        return -2;
    }

    if (opt.broadcast && '255.255.255.255' === ipStr) {
        // 全1地址
        return -3;
    }

    let ip0 = parseInt(ip[0], 10);
    if (opt.multicast && (ip0 >= 0xE0 && ip0 <= 0xEF)) {
        // 组播IP地址 D类
        return -4;
    }

    if (opt.reserve && 127 === ip0) {
        // 回环IP地址
        return -5;
    }

    if (opt.reserve && (ip0 >= 0xF0 && ip0 <= 0xFF)) {
        // 保留地址 E类
        return -6;
    }

    return 0;
}

let checkMask = (mask, opt = { zero:true, broadcast:true}) => {
    let valid = checkIpFormat(mask);
    if (valid) {
        var maskVal = transIp(mask),
            maskTmp = 0x00000001;

        if (opt.zero && 0x0 === maskVal) {
            return false;
        }

        if (opt.broadcast && 0xFFFFFFFF === maskVal) {
            return false;
        }

        for (var index = 0; index < 32; index++ , maskTmp <<= 1) {
            if (0x00 != (maskTmp & maskVal)) {
                if (0 == (maskVal ^ (0xFFFFFFFF << index))) {
                    return true;
                }

                return false;
            }
        }
    }

    return false;
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
let validMacFormat = function (value) {
    let result = /^([0-9a-f]{2}:){5}([0-9a-f]{2})$/gi.test(value);

    return (result == true ? 0 : -2);
};

/* 检查MAC地址范围是否合法 */
let validMacAddr = function (value, opt) {
    let charSet = "0123456789abcdef";
    let macAddr = value.toLowerCase();

    if (opt.zero && macAddr == "00:00:00:00:00:00") {
        return -3;
    }

    if (opt.broadcast && macAddr == "ff:ff:ff:ff:ff:ff") {
        return -4;
    }

    if (opt.multicast && 1 == charSet.indexOf(macAddr.charAt(1)) % 2) {
        return -5;
    }

    return 0;
};

let checkMac = function (mac, opt = { zero: true, broadcast: true, multicast: true }) {
    let value = mac.join(':');
    let result = 0;

    if (0 == value.length) {
        return -1;
    }

    if (0 != (result = validMacFormat(value))) {
        return result;
    }

    if (0 != (result = validMacAddr(value, opt))) {
        return result;
    }

    return 0;
};

export { checkNum, checkRange, checkIpFormat, checkIp, transIp, checkMask, checkSameNet, checkMac};
