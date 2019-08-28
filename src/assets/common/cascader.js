const MODULE = 'cascader';
const OPTIONSDAY = [
	{
		value: '0',
		label: '00:00',
	},
	{
		value: '1',
		label: '01:00',
	},
	{
		value: '2',
		label: '02:00',
	},
	{
		value: '3',
		label: '03:00',
	},
	{
		value: '4',
		label: '04:00',
	},
	{
		value: '5',
		label: '05:00',
	},
	{
		value: '6',
		label: '06:00',
	},
	{
		value: '7',
		label: '07:00',
	},
	{
		value: '8',
		label: '08:00',
	},
	{
		value: '9',
		label: '09:00',
	},
	{
		value: '10',
		label: '10:00',
	},
	{
		value: '11',
		label: '11:00',
	},
	{
		value: '12',
		label: '12:00',
	},
	{
		value: '13',
		label: '13:00',
	},
	{
		value: '14',
		label: '14:00',
	},
	{
		value: '15',
		label: '15:00',
	},
	{
		value: '16',
		label: '16:00',
	},
	{
		value: '17',
		label: '17:00',
	},
	{
		value: '18',
		label: '18:00',
	},
	{
		value: '19',
		label: '19:00',
	},
	{
		value: '20',
		label: '20:00',
	},
	{
		value: '21',
		label: '21:00',
	},
	{
		value: '22',
		label: '22:00',
	},
	{
		value: '23',
		label: '23:00',
	},
];

export const getOptions = () => [
	{
	  value: 'month',
	  label: intl.get(MODULE, 8)/*_i18n:每月*/,
	  children: [
		{
		  value: '1',
		  label: intl.get(MODULE, 11)/*_i18n:1号*/,
		  children: OPTIONSDAY,
		},
		{
			value: '2',
			label: intl.get(MODULE, 12)/*_i18n:2号*/,
			children: OPTIONSDAY,
		},
		{
			value: '3',
			label: intl.get(MODULE, 13)/*_i18n:3号*/,
			children: OPTIONSDAY,
		},
		{
			value: '4',
			label: intl.get(MODULE, 14)/*_i18n:4号*/,
			children: OPTIONSDAY,
		},
		{
			value: '5',
			label: intl.get(MODULE, 15)/*_i18n:5号*/,
			children: OPTIONSDAY,
		},
		{
			value: '6',
			label: intl.get(MODULE, 16)/*_i18n:6号*/,
			children: OPTIONSDAY,
		},
		{
			value: '7',
			label: intl.get(MODULE, 17)/*_i18n:7号*/,
			children: OPTIONSDAY,
		},
		{
			value: '8',
			label: intl.get(MODULE, 18)/*_i18n:8号*/,
			children: OPTIONSDAY,
		},
		{
			value: '9',
			label: intl.get(MODULE, 19)/*_i18n:9号*/,
			children: OPTIONSDAY,
		},
		{
			value: '10',
			label: intl.get(MODULE, 20)/*_i18n:10号*/,
			children: OPTIONSDAY,
		},
		{
			value: '11',
			label: intl.get(MODULE, 21)/*_i18n:11号*/,
			children: OPTIONSDAY,
		},
		{
			value: '12',
			label: intl.get(MODULE, 22)/*_i18n:12号*/,
			children: OPTIONSDAY,
		},
		{
			value: '13',
			label: intl.get(MODULE, 23)/*_i18n:13号*/,
			children: OPTIONSDAY,
		},
		{
			value: '14',
			label: intl.get(MODULE, 24)/*_i18n:14号*/,
			children: OPTIONSDAY,
		},
		{
			value: '15',
			label: intl.get(MODULE, 25)/*_i18n:15号*/,
			children: OPTIONSDAY,
		},
		{
			value: '16',
			label: intl.get(MODULE, 26)/*_i18n:16号*/,
			children: OPTIONSDAY,
		},
		{
			value: '17',
			label: intl.get(MODULE, 27)/*_i18n:17号*/,
			children: OPTIONSDAY,
		},
		{
			value: '18',
			label: intl.get(MODULE, 28)/*_i18n:18号*/,
			children: OPTIONSDAY,
		},
		{
			value: '19',
			label: intl.get(MODULE, 29)/*_i18n:19号*/,
			children: OPTIONSDAY,
		},
		{
			value: '20',
			label: intl.get(MODULE, 30)/*_i18n:20号*/,
			children: OPTIONSDAY,
		},
		{
			value: '21',
			label: intl.get(MODULE, 31)/*_i18n:21号*/,
			children: OPTIONSDAY,
		},
		{
			value: '22',
			label: intl.get(MODULE, 32)/*_i18n:22号*/,
			children: OPTIONSDAY,
		},
		{
			value: '23',
			label: intl.get(MODULE, 33)/*_i18n:23号*/,
			children: OPTIONSDAY,
		},
		{
			value: '24',
			label: intl.get(MODULE, 34)/*_i18n:24号*/,
			children: OPTIONSDAY,
		},
		{
			value: '25',
			label: intl.get(MODULE, 35)/*_i18n:25号*/,
			children: OPTIONSDAY,
		},
		{
			value: '26',
			label: intl.get(MODULE, 36)/*_i18n:26号*/,
			children: OPTIONSDAY,
		},
		{
			value: '27',
			label: intl.get(MODULE, 37)/*_i18n:27号*/,
			children: OPTIONSDAY,
		},
		{
			value: '28',
			label: intl.get(MODULE, 38)/*_i18n:28号*/,
			children: OPTIONSDAY,
		},
		{
			value: '29',
			label: intl.get(MODULE, 39)/*_i18n:29号*/,
			children: OPTIONSDAY,
		},
		{
			value: '30',
			label: intl.get(MODULE, 40)/*_i18n:30号*/,
			children: OPTIONSDAY,
		},
		{
			value: '31',
			label: intl.get(MODULE, 41)/*_i18n:31号*/,
			children: OPTIONSDAY,
		},
	  ],
	},
	{
	  value: 'week',
	  label: intl.get(MODULE, 9)/*_i18n:每周*/,
	  children: [
		{
		  value: '1',
		  label: intl.get(MODULE, 42)/*_i18n:周一*/,
		  children: OPTIONSDAY,
		},
		{
			value: '2',
			label: intl.get(MODULE, 43)/*_i18n:周二*/,
			children: OPTIONSDAY,
		},
		{
			value: '3',
			label: intl.get(MODULE, 44)/*_i18n:周三*/,
			children: OPTIONSDAY,
		},
		{
			value: '4',
			label: intl.get(MODULE, 45)/*_i18n:周四*/,
			children: OPTIONSDAY,
		},
		{
			value: '5',
			label: intl.get(MODULE, 46)/*_i18n:周五*/,
			children: OPTIONSDAY,
		},
		{
			value: '6',
			label: intl.get(MODULE, 47)/*_i18n:周六*/,
			children: OPTIONSDAY,
		},
		{
			value: '0',
			label: intl.get(MODULE, 48)/*_i18n:周日*/,
			children: OPTIONSDAY,
		},
	  ],
	},
	{
		value: 'day',
		label: intl.get(MODULE, 10)/*_i18n:每日*/,
		children: OPTIONSDAY,
	},
];