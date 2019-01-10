var funcList = require("./funcList");
var Excel = require("exceljs");
var fs = require("fs");

var workbook = new Excel.Workbook();
var worksheet = workbook.addWorksheet("Sheet1");
const date = new Date();

var zhCol = worksheet.getColumn('B');
zhCol.width = 50;
zhCol.alignment = {wrapText: true};//自动换行

var funcCol = worksheet.getColumn('A');
funcCol.alignment = { vertical: 'middle', horizontal: 'center'};//垂直居中
funcCol.width = 30;

var begin = 2, end = 1, data = ['中文'];
worksheet.getCell('A1').value = '功能';
worksheet.getCell('C1').value = '英文';
worksheet.getCell('D1').value = '备注';

function writeExcel (filename) {
    //同步读取文件
    var dataString = JSON.parse(fs.readFileSync(filename).toString());
    for (k in dataString) {
        const tmpData = [];
        dataString[k].map(item => {
            if (tmpData.indexOf(item.zh) === -1) {
                tmpData.push(item.zh)
            } //数组去重
        });
        const tmpLength = tmpData.length;
        data = data.concat(tmpData);
        end += tmpLength;
        worksheet.mergeCells(`A${begin}:A${end}`);
        worksheet.getCell('A'+ begin).value = funcList[k];
        zhCol.values = data;
        begin = end + 1;
    }
    workbook.xlsx.writeFile(`language-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.xlsx`).then(function() {
        console.log("xls file is written.");
    });
}

module.exports = writeExcel;