import React from 'react';
import Icon from '~/components/Icon';
import MODEL from './model.js';
import OUI from './oui.js';

export default function Logo(props) {
  const { model = '', mac = '',size = 32, logoColor = '' } = props;  //logoColor字段是 将Logo的颜色设置为指定的颜色

  // 如果存在机型（model），直接根据机型来显示对应Logo
  if (model.length > 0) {
    const { brand = 'unknow', color = logoColor || '#333C4F' } = MODEL[model.replace(/ /g, '').toLowerCase()] || {};
    return <Icon type={brand} size={size} color={color} />;
  }

  // 根据MAC地址来显示Logo
  let color = logoColor || '#C1C4CA', brand = 'unknow';
  if (/^([0-9a-f]{2}[:-]){5}([0-9a-f]{2})$/gi.test(mac)) {
    const mac6 = mac.replace(/[:-]/g, "").substring(0, 6).toUpperCase();
    const total = OUI.length;

    for (let i = 0; i < total; i++) {
      const vendor = OUI[i];
      if (vendor.mac.indexOf(mac6) >= 0) {
        brand = vendor.brand;
        color = vendor.color;
        break;
      }
    }
  }

  return <Icon type={brand} size={size} color={color} />;
}

/**

let total = OUI.length;
for (let i = 0; i < total; i++) {
	OUI[i].mac = OUI[i].mac.join(',').replace(/:/g, '');
}
console.log(OUI);

 */