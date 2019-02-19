import { get, set } from '~/assets/common/cookie';
import {LANGUAGE_LIST} from '~/assets/common/constants';

const LANG_KEY = '_AP_LANGUAGE';

export function getLang() {
  const SUPPORTED_LANGUAGE = JSON.parse(window.sessionStorage.getItem('_LANGUAGE_LIST')) || LANGUAGE_LIST;

  let supportLangs = SUPPORTED_LANGUAGE.map(lang => {
    return lang.key;
  });

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
  window.location.reload();
}