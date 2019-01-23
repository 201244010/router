/**
 * 抽取前端代码中的所有中文字符的工具，用于提供给产品，进行多语言翻译
 * 使用方法：
 * node i18n.js -- -s -i -g ${directory}
 * -i指令，注入注释。-g指令索引所有代码，生成语言文件。-s指令识别输入路径是否是目录。
 **/

// 引入需要的模块
var program = require("commander");
var fs = require("fs");
var fileDisplay = require("./getDoc");
var fileWrite = require("./injectComments")

function commander() {
    program
        .version('1.0.0')
        .option("-s,--search <string>", "search path to find Chinese character!")
        .option("-g,--getDoc", "to get i18n.json file!")
        .option("-i,--inject", "to add comments to srcfile!")
        .parse(process.argv);

    if (program.search) {
        var pathName = program.search.toString();
        fs.access(pathName, function (err) {
            if (err) {
                console.log("目录不存在");
                return;
            } else {
                return;
            }
        })
    }

    if (program.getDoc) {
        var pathName = program.search.toString();
        fs.access(pathName, function (err) {
            var result = {};
            fileDisplay(pathName, result);
            const resultStr = JSON.stringify(result);
            const output = pathName.replace(/[^0-9a-z]/gi, '');
            fs.writeFileSync(`i18n-zh-${output}.json`, resultStr);
        })
    }

    if (program.inject) {
        var pathName = program.search.toString();
        fs.access(pathName, function (err) {
            var result = {};
            fileWrite(pathName, result);
        })
    }
}

commander();

