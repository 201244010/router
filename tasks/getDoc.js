#! /usr/bin/env node

/**
 * 抽取前端代码中的所有中文字符的工具，用于提供给产品，进行多语言翻译
 * 使用方法：
 * node GetSVGDocument.js ${directory}
 * 成功后，会在当前目录下生产 i18n-zh-${directory}.json 的文件
 * 然后再通过 https://www.bejson.com/ 在线格式化
 * 
 * 输出格式：
 {
     'filename':[
         {
             'colomn': xx,  // 行号
             'line': '包含中文字符串的行内容',
             'translate': '包含中文字符串的行内容',
         },
         ...
     ],
     ...
 }
 */

// 要提取的中午字符的文件类型，如有需要，请更改
const file_type = ['html', 'htm', 'js', 'jsx', 'json'];
const exclude_files = ['/i18n', 'Wechat'];

// 引入需要的模块
var program = require("commander");
var fs = require("fs");
var path = require('path');


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

    // 去除多行注释
    data = data.replace(/\/\*[\s\S]+?\*\//g, '');

    // 去除单行注释
    data = data.replace(/\/\/.*/g, '');

    var colomn = data.split("\n");
    var resultArray = [];


    // 匹配中午和中午标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥
    var reg = /([\u4E00-\u9FA5\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u201c\u201d\u2018\u2019\uff08\uff09\u300a\u300b\u3008\u3009\u3010\u3011\u300e\u300f\u300c\u300d\ufe43\ufe44\u3014\u3015\u2026\u2014\uff5e\ufe4f\uffe5])+/g; // 判断是否有汉字、中文标点符号的正则表达式

    for (var item = 0; item < colomn.length; item++) {
        var match = colomn[item].match(reg);
        if (match) {
            match = match.join('x');
            resultArray.push({
                zh: match,
                translate: '',
            });
        }
    }

    return resultArray;
}


function fileDisplay(filePath, result) {
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
                var ret = readFileContent("./" + filedir);
                if (ret.length > 0) {
                    result[filedir.replace(/\\/g, '/')] = ret;
                }
            }
        }
        if (isDir) {
            fileDisplay(filedir, result);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    };
}

module.exports = fileDisplay;