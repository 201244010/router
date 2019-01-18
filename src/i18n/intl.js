import intl from 'react-intl-universal';

export const init = (lang, locales) => intl.init({
  currentLocale: lang,
  locales
});

export const get = (key, variables) => intl.get(key, variables);

export const getHTML = (key, variables) => intl.getHTML(key, variables);

export const determineLocale = (options) => intl.determineLocale(options);

export default {
  init,
  get,
  getHTML,
  determineLocale
};
