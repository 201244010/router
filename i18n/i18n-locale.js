import locales from './i18n.js';

var ret = {'zh-CN': {}, 'en-US': {}};
for (let k in locales) {
    let key;
    let tmp = {};


    key = k.replace(/\/index\.jsx?/, '');  // remove '/index.jsx'
    key = key.substr(key.lastIndexOf('/') + 1).replace(/\.jsx?/, '').toLowerCase();
    //console.log(key);

    if (tmp[key]) {
        console.warn(key);
        key = k;
    } else {
        tmp[key] =  true;
    }

    ret['zh-CN'][key + '.file'] = k;

    let arr = locales[k];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let {zh, translate} = arr[i];

        ret['zh-CN'][key + i] = zh;
        ret['en-US'][key + i] = translate;
    }
}

console.log(ret);