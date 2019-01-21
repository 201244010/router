import { get, set } from '~/assets/common/cookie';

const LANG_KEY = '_AP_LANGUAGE';

export function getLang() {
  //系统支持的语言包
  const supportLangs = ['zh-cn', 'en-us'];

  //浏览器语言
  let browserLang = (navigator.language || navigator.browserLanguage);

  //路由器语言，存储在前端
  let sdLang = get(LANG_KEY);

  let lang = (sdLang || browserLang || 'en-us').toLowerCase();
  console.log('lang=', lang);

  return supportLangs.indexOf(lang)!==-1 ? lang : 'en-us';
}

export function setLang(lang) {
  set(LANG_KEY, lang);
}