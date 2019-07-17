const MODULE = 'title';
let funcTitle = {};

export const getTitle = () => {
    funcTitle = {
        'wechat': { 
            "title" : intl.get(MODULE, 0)/*_i18n:微信连Wi-Fi*/,
            "titleTip": intl.get(MODULE, 1)/*_i18n:为你稳定吸粉引流，让顾客快速连接Wi-Fi*/
        },
        'blacklist': { 
            "title" : intl.get(MODULE, 2)/*_i18n:防蹭网*/,
            "titleTip": intl.get(MODULE, 3)/*_i18n:将蹭网设备一键加入黑名单，快速安全*/
            },
        'bandwidth': { 
            "title" : intl.get(MODULE, 4)/*_i18n:网速智能分配*/,
            "titleTip": intl.get(MODULE, 5)/*_i18n:设置合理的网速分配比例，可以有效保障重要业务网速*/
            },
        'bootdevice': { 
            "title" : intl.get(MODULE, 6)/*_i18n:优先设备*/,
            "titleTip": intl.get(MODULE, 7)/*_i18n:优先设备具有更高的带宽使用优先级，你可以将重要设备加入到优先设备列表*/
            },
        'wifiset': { 
            "title" : intl.get(MODULE, 8)/*_i18n:Wi-Fi设置*/,
            "titleTip": intl.get(MODULE, 9)/*_i18n:快速设置或修改商户Wi-Fi和客用Wi-Fi的相关配置*/
            },
        'network': { 
            "title" : intl.get(MODULE, 10)/*_i18n:上网设置*/,
            "titleTip": intl.get(MODULE, 11)/*_i18n:查看当前网络状态或重新设置上网方式*/
            },
        'lan': { 
            "title" : intl.get(MODULE, 12)/*_i18n:局域网设置*/,
            "titleTip": intl.get(MODULE, 13)/*_i18n:修改局域网网段，设置DHCP相关服务*/
            },        
        'routermanage': { 
            "title" : intl.get(MODULE, 14)/*_i18n:子路由设置*/,
            "titleTip": intl.get(MODULE, 15)/*_i18n:查看当前子路由状态，并管理子路由*/
            },
        'dosd': { 
            "title" : intl.get(MODULE, 16)/*_i18n:攻击防护*/,
            "titleTip": intl.get(MODULE, 17)/*_i18n:当网络遭受大流量攻击时，可以开启攻击防护，保障路由器正常运行*/
            },
        'changepassword': { 
            "title" : intl.get(MODULE, 18)/*_i18n:修改管理密码*/,
            "titleTip": intl.get(MODULE, 19)/*_i18n:定期修改管理密码，让路由更加安全*/
            },
        'upgrade': { 
            "title" : intl.get(MODULE, 20)/*_i18n:系统升级*/,
            "titleTip": intl.get(MODULE, 21)/*_i18n:建议定期升级路由器系统，享受更稳定的网络，体验更丰富的功能*/
            },
        'backup': { 
            "title" : intl.get(MODULE, 22)/*_i18n:备份与恢复*/,
            "titleTip": intl.get(MODULE, 23)/*_i18n:备份路由器的配置，重置路由器后可以快速恢复*/
            },
        'reboot': { 
            "title" : intl.get(MODULE, 24)/*_i18n:重启路由器*/,
            "titleTip": intl.get(MODULE, 25)/*_i18n:定期重启路由器，有效提升路由器上网体验*/
            },
        'recovery': { 
            "title" : intl.get(MODULE, 26)/*_i18n:恢复出厂设置*/,
            "titleTip": intl.get(MODULE, 27)/*_i18n:忘记管理密码无法管理路由器时，可以尝试恢复出厂设置*/
            },
        'timeset': { 
            "title" : intl.get(MODULE, 28)/*_i18n:时间设置*/,
            "titleTip": intl.get(MODULE, 29)/*_i18n:路由器系统时间可以从网络自动获取，也可以从本机获取*/
			},
		'upnp': { 
			"title" : intl.get(MODULE, 30)/*_i18n:UPnP*/,
			"titleTip": intl.get(MODULE, 31)/*_i18n:服务通过端口转发，可以实现任意两个x设备之间的智能互联。x设备可以自动获得x地址，并动态接入因特网。*/
			},
		'customupgrade': { 
			"title" : intl.get(MODULE, 32)/*_i18n:自定义时间升级*/,
			"titleTip": intl.get(MODULE, 33)/*_i18n:路由器可以在指定空闲时间点自动升级最新固件*/
			},
		'portforwarding': { 
			"title" : intl.get(MODULE, 34)/*_i18n:端口转发*/,
			"titleTip": intl.get(MODULE, 35)/*_i18n:端口转发可以转发一个网络端口从一个网络节点到另一个网络节点*/
			},
    };
    return funcTitle;
};
