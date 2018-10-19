const { assign } = Object;

let checkNum = (num) => {
    if(false == /^-?\d+$/.test(num)){
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

    return (result == true ? '' : `${who}非法（形如XX:XX:XX:XX:XX:XX，X为[0-9A-F]）`);
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

let checkStr = function( val, opt = {}){
    opt = assign({
        who: '字符串',
        min: 0, 
        max: Number.POSITIVE_INFINITY,
        characterSetType: '',
    },opt);

    const who = opt.who;
    const min = opt.min;
    const max = opt.max;
    const characterSetType=opt.characterSetType;
    var tip = '';
    var flag = true;

    switch (characterSetType){
        case 'decimal': //十进制数字字符集
            flag = /^[0-9]*$/g.test(val);
            break;
        case 'hex': //十六进制数字字符集
            flag = /^[0-9a-fA-F]*$/g.test(val);
            break;
        case 'english': //英文字符集	
            flag = /^[\x20-\x7E]*$/g.test(val);
            break;
        case 'number': //数字字母字符集
            flag = /^[0-9a-zA-Z]*$/g.test(val);
            break;
        default:
            flag = true;
    }
    
    if(val.length === 0){
        tip = `请输入${who}`;
    }else if(val.length < min){
        tip = `${who}的位数不能小于${min}位`;
    }else if(val.length >= max){
        tip = `${who}的位数不可以超过${max}位`;
    }

    if(flag === false && tip === ''){
        tip= '存在不合法字符';
    }else if(flag === true && tip !== ''){
        flag = false;
    }

    //因为页面input设置了maxLenght,所以判断一下val.length === max的情况
    if(flag === false && tip === `${who}的位数不可以超过${max}位`){
        flag = true;
    }

    console.log(characterSetType,val,tip,flag);
    return {tip,flag};
    
}

export { checkNum, checkRange, checkIpFormat, checkIp, transIp, checkMask, checkSameNet, checkMac,checkStr};
