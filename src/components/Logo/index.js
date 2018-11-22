import React from 'react';
import Icon from '~/components/Icon';
import OUI from './oui.js';

export default function Logo(props) {
  const { mac = '', size = 32 } = props;

  let color = '#333c4f', brand = 'unknown';

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