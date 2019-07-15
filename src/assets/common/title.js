const MODULE = 'title';
let funcTitle = {};

export const getTitle = () => {
    funcTitle = {
        'wechat': { 
            "title" : intl.get(MODULE, 0),
            "titleTip": intl.get(MODULE, 1)
        },
        'blacklist': { 
            "title" : intl.get(MODULE, 2),
            "titleTip": intl.get(MODULE, 3)
            },
        'bandwidth': { 
            "title" : intl.get(MODULE, 4),
            "titleTip": intl.get(MODULE, 5)
            },
        'bootdevice': { 
            "title" : intl.get(MODULE, 6),
            "titleTip": intl.get(MODULE, 7)
            },
        'wifiset': { 
            "title" : intl.get(MODULE, 8),
            "titleTip": intl.get(MODULE, 9)
            },
        'network': { 
            "title" : intl.get(MODULE, 10),
            "titleTip": intl.get(MODULE, 11)
            },
        'lan': { 
            "title" : intl.get(MODULE, 12),
            "titleTip": intl.get(MODULE, 13)
            },        
        'routermanage': { 
            "title" : intl.get(MODULE, 14),
            "titleTip": intl.get(MODULE, 15)
            },
        'dosd': { 
            "title" : intl.get(MODULE, 16),
            "titleTip": intl.get(MODULE, 17)
            },
        'changepassword': { 
            "title" : intl.get(MODULE, 18),
            "titleTip": intl.get(MODULE, 19)
            },
        'upgrade': { 
            "title" : intl.get(MODULE, 20),
            "titleTip": intl.get(MODULE, 21)
            },
        'backup': { 
            "title" : intl.get(MODULE, 22),
            "titleTip": intl.get(MODULE, 23)
            },
        'reboot': { 
            "title" : intl.get(MODULE, 24),
            "titleTip": intl.get(MODULE, 25)
            },
        'recovery': { 
            "title" : intl.get(MODULE, 26),
            "titleTip": intl.get(MODULE, 27)
            },
        'timeset': { 
            "title" : intl.get(MODULE, 28),
            "titleTip": intl.get(MODULE, 29)
			},
		'upnp': { 
			"title" : 'UPnP',
			"titleTip": 'UPnP服务通过端口转发，可以实现任意两个UPnP设备之间的智能互联。UPnP设备可以自动获得IP地址，并动态接入因特网。'
			},
		'customupgrade': { 
			"title" : '自定义时间升级',
			"titleTip": '路由器可以在指定空闲时间点自动升级最新固件'
			},
		'portforwarding': { 
			"title" : '端口转发',
			"titleTip": '端口转发可以转发一个网络端口从一个网络节点到另一个网络节点'
			},
    };
    return funcTitle;
};
