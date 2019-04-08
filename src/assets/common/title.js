const MODULE = 'title';
let funcTitle = {};

export const getTitle = () => {
    funcTitle = {
        'wechat': { 
            "title" : '微信连Wi-Fi',
            "titleTip": '为你稳定吸粉引流，让顾客快速连接Wi-Fi'
        },
        'blacklist': { 
            "title" : '防蹭网',
            "titleTip": '将蹭网设备一键加入黑名单，快速安全'
            },
        'bandwidth': { 
            "title" : '网速智能分配',
            "titleTip": '设置合理的网速分配比例，可以有效保障重要业务网速'
            },
        'bootdevice': { 
            "title" : '优先设备',
            "titleTip": '优先设备具有更高的带宽使用优先级，你可以将重要设备加入到优先设备列表'
            },
        'wifiset': { 
            "title" : 'Wi-FI设置',
            "titleTip": '优先设备具有更高的带宽使用优先级，你可以将重要设备加入到优先设备列表'
            },
        'network': { 
            "title" : '上网设置',
            "titleTip": '查看当前网络状态或重新设置上网方式'
            },
        'lan': { 
            "title" : '局域网设置',
            "titleTip": '修改局域网网段，设置DHCP相关服务'
            },        
        'routermanage': { 
            "title" : '子路由设置',
            "titleTip": '查看当前子路由状态，并管理子路由'
            },
        'dosd': { 
            "title" : '攻击防护',
            "titleTip": '当网络遭受大流量攻击时，可以开启攻击防护，保障路由器正常运行'
            },
        'changepassword': { 
            "title" : '修改管理密码',
            "titleTip": '定期修改管理密码，让路由更加安全'
            },
        'upgrade': { 
            "title" : '系统升级',
            "titleTip": '建议定期升级路由器系统，享受更稳定的网络，体验更丰富的功能'
            },
        'backup': { 
            "title" : '备份与恢复',
            "titleTip": '备份路由器的配置，重置路由器后可以快速恢复'
            },
        'reboot': { 
            "title" : '重启路由器',
            "titleTip": '定期重启路由器，有效提升路由器上网体验'
            },
        'recovery': { 
            "title" : '恢复出厂设置',
            "titleTip": '忘记管理密码无法管理路由器时，可以尝试恢复出厂设置'
            },
        'timeset': { 
            "title" : '时间设置',
            "titleTip": '路由器系统时间可以从网络自动获取，也可以从本机获取'
            },
    };
    return funcTitle;
};
