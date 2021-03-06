const MODULE = 'tz';
let timezones;

export const getTimezones = () => {
	if (timezones) {
		return timezones;
	} else {
		timezones = [
			["GMT-12:00", intl.get(MODULE, 0)/*_i18n:(GMT-12:00)埃尼威托克，夸贾林岛*/],
			  ["GMT-11:00", intl.get(MODULE, 1)/*_i18n:(GMT-11:00)中途岛，萨摩亚群岛*/],
			  ["GMT-10:00", intl.get(MODULE, 2)/*_i18n:(GMT-10:00)夏威夷*/],
			  ["GMT-09:00", intl.get(MODULE, 3)/*_i18n:(GMT-09:00)阿拉斯加*/],
			  ["GMT-08:00", intl.get(MODULE, 4)/*_i18n:(GMT-08:00)太平洋时间*/],
			  ["GMT-07:00", intl.get(MODULE, 5)/*_i18n:(GMT-07:00)山地时间(美国和加拿大)*/],
			  ["GMT-06:00", intl.get(MODULE, 6)/*_i18n:(GMT-06:00)中部时间(美国和加拿大)*/],
			  ["GMT-05:00", intl.get(MODULE, 7)/*_i18n:(GMT-05:00)东部时间(美国和加拿大)*/],
			  ["GMT-04:30", intl.get(MODULE, 8)/*_i18n:(GMT-04:30)加拉加斯*/],
			  ["GMT-04:00", intl.get(MODULE, 9)/*_i18n:(GMT-04:00)大西洋时间(加拿大)*/],
			  ["GMT-03:30", intl.get(MODULE, 10)/*_i18n:(GMT-03:30)纽芬兰*/],
			  ["GMT-03:00", intl.get(MODULE, 11)/*_i18n:(GMT-03:00)巴西利亚，布宜诺斯艾利斯*/],
			  ["GMT-02:00", intl.get(MODULE, 12)/*_i18n:(GMT-02:00)大西洋中部*/],
			  ["GMT-01:00", intl.get(MODULE, 13)/*_i18n:(GMT-01:00)亚速尔群岛，维德角群岛*/],
			  ["GMT",       intl.get(MODULE, 14)/*_i18n:(GMT)格林威治标准时间，都柏林，伦敦*/],
			  ["GMT+01:00", intl.get(MODULE, 15)/*_i18n:(GMT+01:00)柏林，斯德哥尔摩，罗马，伯恩，布鲁塞尔*/],
			  ["GMT+02:00", intl.get(MODULE, 16)/*_i18n:(GMT+02:00)雅典，赫尔辛基，东欧，以色列*/],
			  ["GMT+03:00", intl.get(MODULE, 17)/*_i18n:(GMT+03:00)巴格达，科威特，奈洛比，利雅得，莫斯科*/],
			  ["GMT+03:30", intl.get(MODULE, 18)/*_i18n:(GMT+03:30)德黑兰*/],
			  ["GMT+04:00", intl.get(MODULE, 19)/*_i18n:(GMT+04:00)阿布扎比，马斯喀特，喀山，伏尔加格勒*/],
			  ["GMT+04:30", intl.get(MODULE, 20)/*_i18n:(GMT+04:30)喀布尔*/],
			  ["GMT+05:00", intl.get(MODULE, 21)/*_i18n:(GMT+05:00)伊斯兰堡，卡拉奇，叶卡捷林堡*/],
			  ["GMT+05:30", intl.get(MODULE, 22)/*_i18n:(GMT+05:30)马德拉斯，加尔各答，孟买，新德里*/],
			  ["GMT+05:45", intl.get(MODULE, 23)/*_i18n:(GMT+05:45)加德满都*/],
			  ["GMT+06:00", intl.get(MODULE, 24)/*_i18n:(GMT+06:00)阿拉木图，达卡*/],
			  ["GMT+06:30", intl.get(MODULE, 25)/*_i18n:(GMT+06:30)仰光*/],
			  ["GMT+07:00", intl.get(MODULE, 26)/*_i18n:(GMT+07:00)曼谷，雅加达，河内*/],
			  ["GMT+08:00", intl.get(MODULE, 27)/*_i18n:(GMT+08:00)北京，台北，香港，珀斯，新加坡*/],
			  ["GMT+09:00", intl.get(MODULE, 28)/*_i18n:(GMT+09:00)东京，大坂，札幌，汉城，雅库茨克*/],
			  ["GMT+09:30", intl.get(MODULE, 29)/*_i18n:(GMT+09:30)阿德莱德*/],
			  ["GMT+10:00", intl.get(MODULE, 30)/*_i18n:(GMT+10:00)布里斯班，堪培拉，墨尔本，悉尼*/],
			  ["GMT+11:00", intl.get(MODULE, 31)/*_i18n:(GMT+11:00)马加丹，索罗门群岛，新喀里多尼亚*/],
			  ["GMT+12:00", intl.get(MODULE, 32)/*_i18n:(GMT+12:00)斐济，勘察加半岛，奥克兰*/],
			  ["GMT+13:00", intl.get(MODULE, 33)/*_i18n:(GMT+13:00)努库阿洛法*/]
		  ];
		return timezones;  
	}
};
