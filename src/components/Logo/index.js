import React from 'react';
import Icon from '~/components/Icon';
import OUI from './oui.js';

export default function Logo(props) {
  const { mac = '', color, size = 32 } = props;

  let vendor, result = 'unknown';

  if (/^([0-9a-f]{2}[:-]){5}([0-9a-f]{2})$/gi.test(mac)) {
    const mac6 = mac.replace(/[:-]/g, "").substring(0, 6).toUpperCase();

    for (vendor in OUI) {
      if (OUI[vendor].indexOf(mac6) >= 0) {
        result = vendor;
        break;
      }
    }
  }

  return <Icon type={vendor} size={size} color={color} />;
}
