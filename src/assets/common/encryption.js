import JSEncrypt from 'jsencrypt'; // 引入模块

const encryption = (password) => {
	const encrypt = new JSEncrypt(); // 实例化加密对象
	const publicKey = window.sessionStorage.getItem('_PUBLIC_KEY');
	const random = window.sessionStorage.getItem('_RANDOM');
	console.log(publicKey, password, random);
	encrypt.setPublicKey(publicKey); // 设置公钥
	const encryptoPasswd = encrypt.encrypt(`${password}${random}`); // 加密明文
	return encryptoPasswd;
};


export { encryption };
