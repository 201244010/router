import intl from 'react-intl-universal';
import {getLang} from './index';
import locales from './locales';

/**
 * 设置语言
 * 注意：这个模块被预加载到浏览器中（通过webpack.ProvidePlugin(conf.provide)），不需要通过import导入
 */
const lang = getLang();
intl.init({
  currentLocale: lang,
  locales
})

export const get = (module='', key='', variables) => intl.get(`${module}${key}`, variables);

export const getHTML = (module='', key='', variables) => intl.get(`${module}${key}`, variables);

export default {
  get,
  getHTML,
};
