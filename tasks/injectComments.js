
/**
 * 给前端所有的i18n代码添加注释
 * 使用方法：
 * 成功后，会将注释后的代码写入源文件
 * 源代码：
 * dhcp: intl.get(MODULE, 16)
 * 输出格式：
 * dhcp: intl.get(MODULE, 16)/*_i18n:自动获取IP（DHCP））*/
 /**/

// 要提取的中午字符的文件类型，如有需要，请更改
const file_type = ['html', 'htm', 'js', 'jsx', 'json'];
const exclude_files = ['/i18n', 'Wechat'];

// 引入需要的模块
var program = require("commander");
var fs = require("fs");
var path = require('path');
var local = require('../src/i18n/locales.json')


Array.prototype.inarray = function (elem) {
    "use strict";
    var l = this.length;
    while (l--) {
        if (this[l] === elem) {
            return true;
        }
    }
    return false;
};

function readFileContent(filePath) {
    var data = fs.readFileSync(filePath, { encoding: 'utf-8'});

    //匹配文件内容中的 MODULE = "xxx" 并抽取 "xxx"
    var reg1 = /MODULE *= *[\\\'](.*)[\\\']/;
    var key = '';
    if (!reg1.test(data)) {
        return;
    } else {
        key = RegExp.$1;

        // remove i18n inject commonts
        data = data.replace(/\/\*_i18n:[\s\S]*?\*\//g, '');
    };

    // 将文件内容分行处理，分行添加注释
    var colomn = data.split("\n");
    var tmpColomn = colomn;

    // 匹配intl.get(MODULE, n),并且replace掉，添加/* */备注
    var reg2 = /intl\.get\(MODULE *, *(\d+).*?\)/g;

    colomn.forEach(function (item, index) {
        var match = item.match(reg2);
        match && match.forEach(items => {
            if (reg2.test(tmpColomn[index])) {
                tmpColomn[index] = tmpColomn[index].replace(items, `${items}/*_i18n:${local['zh-cn'][key + RegExp.$1]}*/`);
            }
        });
    });

    // 合成新的文件内容，覆盖源文件
    tmpColomn = tmpColomn.join('\n');
    fs.writeFileSync(filePath, tmpColomn);
    return {}
}

function fileWrite(filePath, result) {
    if(exclude_files.some(file => {
        return filePath.indexOf(file) !== -1;
    })){
        return;
    }

    //根据文件路径读取文件，返回文件列表
    var files = fs.readdirSync(filePath);
    var len = files.length;

    for (var i = 0; i < len; i++) {
        var filename = files[i];

        // 排除文件
        if (exclude_files.some(file => {
            return filename.indexOf(file) !== -1;
        })) {
            continue;
        };

        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        var stats = fs.statSync(filedir);
        var isFile = stats.isFile();//是文件
        var isDir = stats.isDirectory();//是文件夹
        var isFileType = file_type.inarray(filedir.substring(filedir.lastIndexOf('.') + 1));
        if (isFile && isFileType) {
            if (filedir.indexOf(".DS_Store") == -1) {
                readFileContent("./" + filedir);
            }
        }
        if (isDir) {
            fileWrite(filedir, result);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    };
}

module.exports = fileWrite;

