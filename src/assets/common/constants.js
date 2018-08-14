
/* 指令集 */
export const DIRECTIVE = {
    // 账号相关
    ACCOUNT_LOGIN : "0x2000",
    ACCOUNT_LOGOUT : "0x2001",
    ACCOUNT_MODIFY : "0x2002",
    
    // DHCPS 配置
    DHCPS_GET : "0x2003",
    DHCPS_RESERVEDIP_LIST_GET : "0x2004",
    DHCPS_RESERVEDIP_ADD : "0x2005",
    DHCPS_RESERVEDIP_DELETE : "0x2006",
    DHCPS_RESERVEDIP_MODIFY : "0x2007",
    DHCPS_SET : '0x2008',

    // LAN/WAN 接口配置
    NETWORK_WAN_IPV4_GET : "Ox2009",
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
    QOS_GET : '0X2021',
    QOS_SET : '0X2022',

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






