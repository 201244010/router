import JSEncrypt from 'jsencrypt'; // 引入模块

const fetchPublicKey = async () => {
	const response = await common.fetchApi([{ opcode: 'RSA_ENCRYPTION' }]);
	const { data } = response;
	const { result: { public_key: publicKey, random } = {} } = data[0] || {};
	window.sessionStorage.setItem('_PUBLIC_KEY', publicKey);
	window.sessionStorage.setItem('_RANDOM', random);
};

const encryption = password => {
	const encrypt = new JSEncrypt(); // 实例化加密对象
	const publicKey = window.sessionStorage.getItem('_PUBLIC_KEY');
	const random = window.sessionStorage.getItem('_RANDOM');
	encrypt.setPublicKey(publicKey); // 设置公钥
	const encryptoPasswd = encrypt.encrypt(`${password}${random}`); // 加密明文
	return encryptoPasswd;
};

export { fetchPublicKey, encryption };
