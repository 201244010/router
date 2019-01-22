var funcMap = require("./funcMap");
var Excel = require("exceljs");

var locales = require('./locales.json');

const MODULE = 'language';

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
        var match = k.match(/\.file|\d+/gi);
        if (match) {
            match = match.toString();
            var func = k.substr(0, k.length - match.length);
            
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

    //console.log(data);
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
    workbook.xlsx.writeFile(`language-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.xlsx`).then(function() {
        console.log("xls file is written.");
    });
}

writeExcel();
