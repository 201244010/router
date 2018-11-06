
/* 指令集 */
export const DIRECTIVE = {
    // 账号相关
    ACCOUNT_LOGIN : "0x2000",
    ACCOUNT_LOGOUT : "0x2001",
    ACCOUNT_MODIFY : "0x2002",
    ACCOUNT_INITIAL_PASSWORD : "0x2062",
    
    // DHCPS 配置
    DHCPS_GET : "0x2003",
    DHCPS_RESERVEDIP_LIST_GET : "0x2004",
    DHCPS_RESERVEDIP_ADD : "0x2005",
    DHCPS_RESERVEDIP_DELETE : "0x2006",
    DHCPS_RESERVEDIP_MODIFY : "0x2007",
    DHCPS_SET : '0x2008',

    // LAN/WAN 接口配置
    NETWORK_WAN_IPV4_GET : "0x2009",
    NETWORK_LAN_IPV4_GET : "0x200a",
    NETWORK_LAN_IPV4_SET : "0x200b",
    NETWORK_WAN_IPV4_SET : "0x200c",

    // WAN 小工具
    WANWIDGET_DIALDETECT_START : '0x200d',
    WANWIDGET_DIALDETECT_GET : '0x200e',
    WANWIDGET_SPEEDTEST_START : '0x2023',
    WANWIDGET_SPEEDTEST_INFO_GET : '0x2024',
    WANWIDGET_ONLINETEST_START : '0x2011',
    WANWIDGET_ONLINETEST_GET : '0x2012',
    WANWIDGET_WAN_LINKSTATE_GET : '0x2045',

    // 无线功能
    WIRELESS_GET : '0x2013',
    WIRELESS_SET : '0x2014',
    WIRELESS_CHANNEL_LIST_GET:'0x3001',
    WIRELESS_LIST_GET: '0x3002',

    // sunmi mesh 按键
    SUNMIMESH_START: '0x2090',
    SUNMIMESH_INFO_GET: '0x2092',
    SUNMIMESH_STOP: '0x2091',

    // QOS
    QOS_AC_WHITELIST_GET : '0x2019',
    QOS_AC_WHITELIST_ADD : '0x201a',
    QOS_AC_WHITELIST_DELETE : '0x201b',
    QOS_AC_WHITELIST_MODIFY : '0x201c',
    QOS_AC_BLACKLIST_GET : '0x201d',
    QOS_AC_BLACKLIST_ADD : '0x201e',
    QOS_AC_BLACKLIST_DELETE : '0x201f',
    QOS_AC_BLACKLIST_MODIFY : '0x2020',
    QOS_GET : '0x2021',
    QOS_SET : '0x2022',

    // SYSTEM
    SYSTEM_GET: '0x2034',

    // 安全防护
    DOSD_GET: '0x2047',
    DOSD_SET: '0x2048',
    DOSD_BLOCKLIST_GET: '0x2049',
    DOSD_BLOCKLIST_DELETE: '0x204a',

    // 客户端设备信息获取
    CLIENT_LIST_GET: '0x2025',
    CLIENT_ITEM_GET: '0x2026',
    WHOAMI_GET: '0x2027',

    // 流量统计
    TRAFFIC_STATS_GET: '0x2040',
    TRAFFIC_STATS_RESET: '0x2041',

    // 问题诊断 
    DIAGNOSIS_START : '',
    DIAGNOSIS_INFO_GET : '',

    //认证管理
    AUTH_WEIXIN_CONFIG_GET: '0x2063',
    AUTH_WEIXIN_CONFIG_SET: '0x2064',
    AUTH_WHITELIST_GET: '0x2065',
    AUTH_WHITELIST_SET: '0x2066',
    AUTH_WHITELIST_DELETE: '0x2067',
    AUTH_USER_OFFLINE: '0x2068',
    AUTH_CLIENT_LIST: '0x2084',
    AUTH_SHORTMESSAGE_CONFIG_GET: '0x2082',
    AUTH_SHORTMESSAGE_CONFIG_SET: '0x2083',
    AUTH_SHORTMESSAGE_CODE_REQUEST: '0x2080',
    AUTH_SHORTMESSAGE_CODE_VERIFY: '0x2081',
    AUTH_SHORTMESSAGE_LOGO: '0x2089',
    AUTH_SHORTMESSAGE_BACKGROUND: '0x2085',
    AUTH_WEIXIN_LOGO: '0x2086',
    AUTH_WEIXIN_BACKGROUND: '0x2087',
    AUTH_PORTAL: '0x2088',
    AUTH_ENABLE_MSG: '0x208a',
    
    //系统升级
    FIRMWARE_GET : '0x2071',
    FIRMWARE_SET : '0x2072',
    UPGRADE_START :'0x2074',
    UPGRADE_STATE : '0x2075',

    //系统工具
    SYSTEMTOOLS_RESTART : '0x2015',
    SYSTEMTOOLS_RESET : '0x2016',
    SYSTEMTOOLS_BACKUP : '0x2017',
    SYSTEMTOOLS_RESTORE : '0x2018',
    SYSTEMTOOLS_CLOUD_BACKUP : '0x2094',
    SYSTEMTOOLS_CLOUD_RESTORE : '0x2095',
    SYSTEMTOOLS_CLOUD_LIST : '0x2096',
    SYSTEMTOOLS_CLOUD_DELETE : '0x2097',
    SYSTEMTOOLS_CLOUD_BACKUP_URL : '0x209a',
    SYSTEMTOOLS_CLOUD_LIST_URL : '0x209b',
    SYSTEMTOOLS_CLOUD_DELETE_URL : '0x209c',
    SYSTEMTOOLS_CLOUD_BACKUP_PROGRESS : '0x209d',
    SYSTEMTOOLS_CLOUD_RESTORE_PROGRESS : '0x209e',
};



/**
 * 请求响应错误码
 */
export const ERROR_MESSAGE = {
    "-1000" : 'ERRCODE_PERMISSION',
    "-1001" : "ERRCODE_PARAMS_INVALID",
    "-1002" : "ERRCODE_PARAM_VALUE_INVALID",
    "-1003" : "ERRCODE_MAXIMUM_EXCEED",
    "-1004" : "ERRCODE_UCI_COMMIT_FAILED",
    "-1005" : "ERRCODE_CLIENTLIST_NOTFOUND",
    "-1050" : "ERRCODE_DHCPS_RESERVEDIP_INSERT_FAILED", 
    "-1051" : "ERRCODE_DHCPS_RESERVEDIP_MODIFY_FAILED", 
    "-1052" : "ERRCODE_DHCPS_RESERVEDIP_DELETE_FAILED",
    "-1061" : "ERRCODE_NETWORK_WAN_LAN_IP_CONFILCT",
    "-1100" : "ERRCODE_WLAN_ERROR_SSID", 
    "-1101" : "ERRCODE_WLAN_ERROR_PASSWORD",
    "-1102" : "ERRCODE_WLAN_HOST_VAP_NOT_ENABLE",
    "-1600" : "ERRCODE_ACCOUNT_USERNAME_INVALID",                   //账户登录缺少用户名  
    "-1601" : "ERRCODE_ACCOUNT_PASSWORD_INVALID",                   //账户登录缺少密码
    "-1602" : "ERRCODE_ACCOUNT_IP_UNRESOLVED",                      //账户登录的终端ip无法解析
    "-1603" : "ERRCODE_ACCOUNT_PASSWORD_DECODE_FAILED",             //账户密码解析失败
    "-1604" : "ERRCODE_ACCOUNT_PASSWORD_NOT_SET",                   //账户密码未设置
    "-1605" : "ERRCODE_ACCOUNT_PASSWORD_ERROR",                     //账户密码错误
    "-1606" : "ERRCODE_ACCOUNT_PASSWORD_ERROR_OVER_THREE_TIMES",    //账户密码错误次数过多
    "-1607" : "ERRCODE_ACCOUNT_USER_UNKNOWN",                       //账户未识别
    "-1608" : "ERRCODE_ACCOUNT_PASSWORD_ALREADY_INITIALIZED",       //账户密码已初始化
    "-1609" : "ERRCODE_ACCOUNT_NEWPASSWORD_INVALID",                //修改密码时缺少新密码 
    "-1610" : "ERRCODE_ACCOUNT_NEWPASSWORD_DECODE_FAILED"           //修改密码时新密码解析失败
};

/**
 * 后台接口正确返回标志
 * @type {number}
 */
export const NO_ERROR = 0;



