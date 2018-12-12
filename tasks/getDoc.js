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

// 引入需要的模块
var program = require("commander");
var fs = require("fs");
var path = require('path');

var re = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/; // 判断是否有汉字、中文标点符号的正则表达式


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
    var colomn = data.split("\n");
    var resultArray = [];

    for (var item = 0; item < colomn.length; item++) {
        var strs = colomn[item].match(/[\u4E00-\u9FA5\uFE30-\uFFA0]+/g);
        //if (strs) {
        if (re.test(colomn[item])) {
            var result = {
                colomn: item + 1,
                //string: strs,
                line: colomn[item].trim(),
                translate: colomn[item].trim(),
            }

            resultArray.push(result);
        }
    }

    return resultArray;
}


function fileDisplay(filePath, result) {
    //根据文件路径读取文件，返回文件列表
    var files = fs.readdirSync(filePath);

    files.forEach(function (filename) {
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
    });
}


function commander() {
    program
        .version('1.0.0')
        .option("-s,--search <string>", "search path to find Chinese character!")
        .parse(process.argv)

    if (program.search) {
        var pathName = program.search.toString();
        fs.access(pathName, function (err) {
            if (err) {
                console.log("目录不存在")
            } else {
                var result = {};
                fileDisplay(pathName, result);
                const resultStr = JSON.stringify(result);
                const output = pathName.replace(/[^0-9a-z]/gi, '');
                fs.writeFileSync(`i18n-zh-${output}.json`, resultStr);
                //console.log(resultStr);
            }
        })
    }
}

commander();

