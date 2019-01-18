export function getLang() {
    //系统支持的语言包
    const supportLangs = ['zh-CN', 'en-US'];
    const lang = 'zh-CN';
  
    return supportLangs.indexOf(lang)!==-1 ? lang : 'en-US'
}