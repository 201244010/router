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

export { checkNum, checkRange, checkIpFormat, checkIp, transIp, checkMask, checkSameNet};