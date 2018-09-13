
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
    WANWIDGET_SPEEDTEST_START : '0x200f',
    WANWIDGET_SPEEDTEST_INFO_GET : '0x2010',
    WANWIDGET_ONLINETEST_START : '0x2011',
    WANWIDGET_ONLINETEST_GET : '0x2012',

    // 无线功能
    WIRELESS_GET : '0x2013',
    WIRELESS_SET : '0x2014',
    WIRELESS_ACL_SET : '0x2015',

    // sunmi mesh 按键
    SUNMIMESH_START : '0x2016',
    SUNMIMESH_INFO_GET : '0x2017',
    SUNMIMESH_STOP : '0x2018',

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

    // 安全防护
    SECURITY_SET : '',
    SECURITY_GET : '',

    // 客户端设备信息获取
    CLIENT_LIST_GET : '',
    CLIENT_ITEM_GET : '',
    CLIENT_ITEM_GET : '',

    // 问题诊断 
    DIAGNOSIS_START : '',
    DIAGNOSIS_INFO_GET : ''
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
    "-1102" : "ERRCODE_WLAN_HOST_VAP_NOT_ENABLE" 
};




