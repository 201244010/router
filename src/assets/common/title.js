const MODULE = 'title';
let funcTitle = {};

export const getTitle = () => {
    funcTitle = {
        'wechat': { 
            "title" : '微信连Wi-Fi',
            "titleTip": '这是功能说明'
        },
        'blacklist': { 
            "title" : '防蹭网',
            "titleTip": '这是功能说明'
            },
        'bandwidth': { 
            "title" : '网速智能分配',
            "titleTip": '这是功能说明'
            },
        'bootdevice': { 
            "title" : '优先设备',
            "titleTip": '这是功能说明'
            },
        'wifi': { 
            "title" : 'Wi-FI设置',
            "titleTip": '这是功能说明'
            },
        'network': { 
            "title" : '上网设置',
            "titleTip": '这是功能说明'
            },
        'lan': { 
            "title" : '局域网设置',
            "titleTip": '这是功能说明'
            },        
        'router': { 
            "title" : '子路由设置',
            "titleTip": '这是功能说明'
            },
        'dosd': { 
            "title" : '攻击防护',
            "titleTip": '这是功能说明'
            },
        'changepassword': { 
            "title" : '修改管理密码',
            "titleTip": '这是功能说明'
            },
        'upgrade': { 
            "title" : '系统升级',
            "titleTip": '这是功能说明'
            },
        'backup': { 
            "title" : '备份与恢复',
            "titleTip": '这是功能说明'
            },
        'reboot': { 
            "title" : '重启路由器',
            "titleTip": '这是功能说明'
            },
        'recovery': { 
            "title" : '恢复出厂设置',
            "titleTip": '这是功能说明'
            },
        'timeset': { 
            "title" : '时间设置',
            "titleTip": '这是功能说明'
            },
    };
    return funcTitle;
};
