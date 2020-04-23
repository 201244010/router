const OPTION_THIRD = [
	{
		value: 'modp768',
		label: 'Group1(768 bit)',
	},
	{
		value: 'modp1024',
		label: 'Group2(1024 bit)',
	},
	{
		value: 'modp1536',
		label: 'Group3(1536 bit)',
	},
	{
		value: 'modp2048',
		label: 'Group4(2048 bit)',
	},
];

const OPTION_SECOND = [
	{
		value: 'sha1',
		label: 'SHA-1',
		children: OPTION_THIRD,
	},
	{
		value: 'md5',
		label: 'MD5',
		children: OPTION_THIRD,
	},
	//暂时不支持
	// {
	// 	value: 'sha2256',
	// 	label: 'SHA2-256',
	// 	children: OPTION_THIRD,
	// },
];

const OPTION_FIRST = [
	{
		value: 'des',
		label: 'DES-CBC',
		children: OPTION_SECOND,
	},
	{
	  value: '3des',
	  label: '3DES-CBC',
	  children: OPTION_SECOND,
	},
	{
		value: 'aes128',
		label: 'AES-128',
		children: OPTION_SECOND,
	},
	{
		value: 'aes192',
		label: 'AES-192',
		children: OPTION_SECOND,
	},
	{
		value: 'aes256',
		label: 'AES-256',
		children: OPTION_SECOND,
	},
];

export { OPTION_FIRST };