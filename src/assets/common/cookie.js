/** 返回cookie中指定key的值
 *  如果参数key未传参，返回所有的cookie: {key1: val1, ... keyx: valx}
 */
let get = (key) => {
    let cookie = {};

    document.cookie.split(';').forEach(item => {
        if (item.length > 0) {
            let kv = item.trim().split('=');
            cookie[kv[0]] = kv[1];
        }
    });

    if ('string' === typeof key) {
        return cookie[key] || '';
    } else {
        return cookie;
    }
}

/** 删除指定key的值的cookie
 *  如果参数key未传参，删除所有的cookie
 */
let clear = (del) => {
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (let i = keys.length; i--;) {
            const key = keys[i];
            if (undefined === del || del.indexOf(key) > -1) {
                document.cookie = `${key}=0;expires=${new Date(0).toUTCString()};path=/`;
            }
        }
    }
}

export { get, clear };
