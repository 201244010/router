/**
 * 语言文件转excel，excel转语言文件的脚本，用于提供给产品进行多语言翻译。用于批量处理翻译语言
 * 使用方法：
 * node language.js -r / -w、-w用于生成excel，-r用于读取excel，生成语言文件。
 * 生成的en-us.json文件仅用来和locales.json文件对比，不上传到git仓库。
 **/

var {funcMap, listMap} = require("./funcMap");
var Excel = require("exceljs");
var fs = require("fs");
var program = require("commander");

var locales = require('./locales.json');

var workbook = new Excel.Workbook();
var worksheet = workbook.addWorksheet("W1");

var columns  = [
    { header: "功能", key: 'func', width: 30 },
    { header: "键值", key: 'id', width: 6 },
    { header: "中文", key: 'zh', width: 50 },
    { header: "英文", key: 'en', width: 50 },
    { header: "备注", key: 'comments', width: 30}
];

worksheet.columns = columns;

columns.forEach(column => {
    worksheet.getColumn(column.key).alignment = { vertical: 'middle', wrapText: true };
})

function writeExcel () {
    const zhDoc = locales['zh-cn'];
    const enDoc = locales['en-us'];

    var data = {};

    for (var k in zhDoc) {
        var match = k.match(/\.file|\d+$/gi);
        if (match) {
            match = match.toString();
            var func = k.substr(0, k.length - match.length);
            // console.log(func);
            if (!data[func]) {
                data[func] = {
                    file: '',
                    i18n: []
                };
            }

            if ((-1 === match.indexOf('.file'))) {
                data[func]['i18n'].push({
                    id: match,
                    zh: zhDoc[k],
                    en: enDoc[k],
                    comments: ''
                });
            } else {
                // match == '.file'
                data[func]['file'] = zhDoc[k];
            }
        } else {
            console.error('invalid key:', k);
        }
    }

    // console.log(data);
    var start = 2;
    for (var func in data) {
        var file = data[func]['file'];
        var i18n = data[func]['i18n'];
        var len = i18n.length;

        for (var i = 0; i < len; i++) {
            var item = i18n[i];
            worksheet.addRow({
                func: funcMap[file] || file,
                id: item['id'],
                zh: item['zh'],
                en: item['en'],
                comments: item['comments']
            });
        }

        // merge cells
        var merge = `A${start}:A${start + len - 1}`;
        worksheet.mergeCells(merge);
        start += len;
    }

    const date = new Date();
    workbook.xlsx.writeFile(`i18n-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`).then(function() {
        console.log("xls file is written.");
    });
}

function readExcel () {
    var workbook = new Excel.Workbook();
    const date = new Date();
    var result = {
        "zh-cn": {},
        "en-us": {}
    };
    workbook.xlsx.readFile(`i18n-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}1.xlsx`).then(function(data) {
        var worksheet = workbook.getWorksheet('W1');
        worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            //第1行 为功能菜单页
            if (rowNumber !== 1) {
                const rowValue = row.values;
                var reg = /\..*/g;
                const funcPath = listMap[rowValue[1]].replace(reg, '').split('\/');
                let funcKey;
                const pageStyle = funcPath[1].toLowerCase();
                if ( pageStyle === 'h5') {
                    if (funcPath[funcPath.length - 1] === 'index') {
                        funcKey = pageStyle + funcPath[funcPath.length - 2].toLowerCase();
                    } else {
                        funcKey = pageStyle + funcPath[funcPath.length - 1].toLowerCase()
                    }
                } else {
                    if (funcPath[funcPath.length - 1] === 'index') {
                        funcKey = funcPath[funcPath.length - 2].toLowerCase();
                    } else if (funcPath[funcPath.length - 1] === 'timezone') {
                        funcKey = 'tz';
                    } else {
                        funcKey = funcPath[funcPath.length - 1].toLowerCase()
                    }
                }

                result['zh-cn'][funcKey + rowValue[2]] = rowValue[3];
                result['en-us'][funcKey + rowValue[2]] = rowValue[4];
            }
        });
        fs.writeFileSync(`en-us.json`, JSON.stringify(result));
    });
}

function commander() {
    program
        .version('1.0.0')
        .option("-w,--writeExcel", "to create excelFile!")
        .option("-r,--readExcel", "to create translate file!")
        .parse(process.argv);

    if (program.writeExcel) {
        writeExcel();
    }

    if (program.readExcel) {
        readExcel();
    }
}

commander();

