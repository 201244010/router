

const timezones = [
  ['CST+12', '(UTC-12)国际日期变更线西'],
  ['CST+11', '(UTC-11)萨摩亚群岛'],
  ['CST+11', '(UTC-11)协调世界时'],
  ['CST+10', '(UTC-10)夏威夷'],
  ['CST+9.5', '(UTC-9:30)马克萨斯群岛标准时间'],
  ['CST+9', '(UTC-9)阿拉斯加'],
  ['CST+8', '(UTC-8)太平洋时间(美国和加拿大)'],
  ['CST+8', '(UTC-8)下加利福尼亚州'],
  ['CST+7', '(UTC-7)奇瓦瓦,拉巴斯,马萨特兰'],
  ['CST+7', '(UTC-7)山地时间(美国和加拿大)'],
  ['CST+7', '(UTC-7)亚利桑那'],
  ['CST+6', '(UTC-6)瓜达拉哈拉,墨西哥城,蒙特雷'],
  ['CST+6', '(UTC-6)萨斯克彻温'],
  ['CST+6', '(UTC-6)中部时间(美国和加拿大)'],
  ['CST+6', '(UTC-6)中美洲'],
  ['CST+5', '(UTC-5)波哥大,利马,基多'],
  ['CST+5', '(UTC-5)东部时间(美国和加拿大)'],
  ['CST+5', '(UTC-5)印第安纳州(东部)'],
  ['CST+4.5', '(UTC-4:30)加拉加斯'],
  ['CST+4', '(UTC-4)大西洋时间(加拿大)'],
  ['CST+4', '(UTC-4)库亚巴'],
  ['CST+4', '(UTC-4)乔治敦,拉巴斯,马瑙斯,圣湖安'],
  ['CST+4', '(UTC-4)圣地亚哥'],
  ['CST+4', '(UTC-4)亚松森'],
  ['CST+3.5', '(UTC-3:30)纽芬兰'],
  ['CST+3', '(UTC-3)巴西利亚'],
  ['CST+3', '(UTC-3)布宜诺斯艾利斯'],
  ['CST+3', '(UTC-3)格陵兰'],
  ['CST+3', '(UTC-3)卡宴,福塔雷萨'],
  ['CST+3', '(UTC-3)蒙得维的亚'],
  ['CST+2', '(UTC-2)协调世界时-02'],
  ['CST+2', '(UTC-2)中大西洋'],
  ['CST+1', '(UTC-1)佛得角群岛'],
  ['CST+1', '(UTC-1)亚速尔群岛'],
  ['CST+0', '(UTC)都柏林,爱丁堡,里斯本,伦敦'],
  ['CST+0', '(UTC)卡萨布兰卡'],
  ['CST+0', '(UTC)蒙罗维亚,雷克雅未克'],
  ['CST+0', '(UTC)协调世界时'],
  ['CST-1', '(UTC+1)阿姆斯特丹,柏林,伯尔尼,罗马,斯德歌尔摩,维也纳'],
  ['CST-1', '(UTC+1)贝尔格莱德,布拉迪斯拉发,布达佩斯,卢布尔雅那'],
  ['CST-1', '(UTC+1)布鲁塞尔,哥本哈根,马德里,巴黎'],
  ['CST-1', '(UTC+1)萨拉热窝,斯科普里,华沙,萨格勒布'],
  ['CST-1', '(UTC+1)温得和克'],
  ['CST-1', '(UTC+1)中非西部'],
  ['CST-2', '(UTC+2)安曼'],
  ['CST-2', '(UTC+2)贝鲁特'],
  ['CST-2', '(UTC+2)大马士革'],
  ['CST-2', '(UTC+2)哈拉雷,比勒陀利亚'],
  ['CST-2', '(UTC+2)赫尔辛基,基辅,里加,索非亚,塔林,维尔纽斯'],
  ['CST-2', '(UTC+2)开罗'],
  ['CST-2', '(UTC+2)明斯克'],
  ['CST-2', '(UTC+2)雅典,布加勒斯特'],
  ['CST-2', '(UTC+2)耶路撒冷'],
  ['CST-2', '(UTC+2)伊斯坦布尔'],
  ['CST-3', '(UTC+3)巴格达'],
  ['CST-3', '(UTC+3)加里宁格勒'],
  ['CST-3', '(UTC+3)科威特,利雅得'],
  ['CST-3', '(UTC+3)内罗毕'],
  ['CST-3.5', '(UTC+3:30)德黑兰'],
  ['CST-4', '(UTC+4)阿布扎比,马斯喀特'],
  ['CST-4', '(UTC+4)埃里温'],
  ['CST-4', '(UTC+4)巴库'],
  ['CST-4', '(UTC+4)第比利斯'],
  ['CST-4', '(UTC+4)路易港'],
  ['CST-4', '(UTC+4)莫斯科,圣彼得堡,伏尔加格勒'],
  ['CST-4.5', '(UTC+4:30)喀布尔'],
  ['CST-5', '(UTC+5)塔什干'],
  ['CST-5', '(UTC+5)伊斯兰堡,卡拉奇'],
  ['CST-5.5', '(UTC+5:30)钦奈,加尔各答,孟买,新德里'],
  ['CST-5.5', '(UTC+5:30)斯里加亚渥登普拉'],
  ['CST-5.75', '(UTC+5:45)加德满都'],
  ['CST-6', '(UTC+6)阿斯塔纳'],
  ['CST-6', '(UTC+6)达卡'],
  ['CST-6', '(UTC+6)叶卡捷琳堡'],
  ['CST-6.5', '(UTC+6:30)仰光'],
  ['CST-7', '(UTC+7)曼谷,河内,雅加达'],
  ['CST-7', '(UTC+7)新西伯利亚'],
  ['CST-8', '(UTC+8)北京,重庆,香港特别行政区,乌鲁木齐'],
  ['CST-8', '(UTC+8)吉隆坡,新加坡'],
  ['CST-8', '(UTC+8)克拉斯诺亚尔斯克'],
  ['CST-8', '(UTC+8)珀斯'],
  ['CST-8', '(UTC+8)台北'],
  ['CST-8', '(UTC+8)乌兰巴托'],
  ['CST-8.5', '(UTC+8:30)朝鲜标准时间'],
  ['CST-9', '(UTC+9)大阪,札幌,东京'],
  ['CST-9', '(UTC+9)首尔'],
  ['CST-9', '(UTC+9)伊尔库茨克'],
  ['CST-9.5', '(UTC+9:30)阿德莱德'],
  ['CST-9.5', '(UTC+9:30)达尔文'],
  ['CST-10', '(UTC+10)布里斯班'],
  ['CST-10', '(UTC+10)关岛,莫尔兹比港'],
  ['CST-10', '(UTC+10)霍巴特'],
  ['CST-10', '(UTC+10)堪培拉,墨尔本,悉尼'],
  ['CST-10', '(UTC+10)雅库茨克'],
  ['CST-10.5', '(UTC+10:30)澳大利亚远东标准时间'],
  ['CST-11', '(UTC+11)符拉迪沃斯托克'],
  ['CST-11', '(UTC+11)所罗门群岛,新喀里多尼亚'],
  ['CST-11.5', '(UTC+11:30)诺福克岛标准时间'],
  ['CST-12', '(UTC+12)奥克兰,惠灵顿'],
  ['CST-12', '(UTC+12)斐济'],
  ['CST-12', '(UTC+12)马加丹'],
  ['CST-12', '(UTC+12)协调世界时+12'],
  ['CST-12.5', '(UTC+12:45)查塔姆群岛标准时间'],
  ['CST-13', '(UTC+13)努库阿洛法'],
  ['CST-14', '(UTC+14)基里巴斯']
];

// 生成关系表
let MAP = {};
timezones.map( item => MAP[item[0]] = 0);

// 使时区值唯一，解决Antd中select要求value值唯一的问题
timezones.map( item => {
  MAP[item[0]]++;
  item[0] = item[0] + ('$' + MAP[item[0]]);
})

export default timezones;
