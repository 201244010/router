import intl from 'react-intl-universal';

export const init = (lang, locales) => intl.init({
  currentLocale: lang,
  locales
});

export const get = (module='', key='', variables) => intl.get(`${module}${key}`, variables);

export const getHTML = (module='', key='', variables) => intl.get(`${module}${key}`, variables);

export const determineLocale = (options) => intl.determineLocale(options);

export default {
  init,
  get,
  getHTML,
  determineLocale
};
