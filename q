[1mdiff --git a/src/assets/common/index.js b/src/assets/common/index.js[m
[1mindex 0c0e66a..780bee6 100644[m
[1m--- a/src/assets/common/index.js[m
[1m+++ b/src/assets/common/index.js[m
[36m@@ -60,7 +60,7 @@[m [mexport const getTimeZone = () => {[m
  */[m
 export function fetchApi(data, options = {}, loopOption = {}) {[m
     data = Object.prototype.toString.call(data) === "[object Array]" ? data : [data];[m
[31m-    options = assign({ withCredentials: true, timeout: 10000, method: 'POST', loading: false, ignoreErr: false }, options);[m
[32m+[m[32m    options = assign({ timeout: 10000, method: 'POST', loading: false, ignoreErr: false }, options);[m
 [m
     let url = __BASEAPI__ + '/';[m
     let {loop, interval} = assign({loop: false, interval: 1000, pending: noop}, loopOption);[m
[1mdiff --git a/src/pages/Advance/Auth/NonAuth.jsx b/src/pages/Advance/Auth/NonAuth.jsx[m
[1mindex 021a370..15e4bee 100644[m
[1m--- a/src/pages/Advance/Auth/NonAuth.jsx[m
[1m+++ b/src/pages/Advance/Auth/NonAuth.jsx[m
[36m@@ -404,7 +404,7 @@[m [mexport default class NonAuth extends React.Component{[m
                     <FormItem showErrorTip={nameTip} type="small" >[m
                         <Input type="text" value={name} onChange={value => this.onChange(value, 'name')} placeholder="请输入备注名称" maxLength={32} />[m
                         <ErrorTip>{nameTip}</ErrorTip>[m
[31m-                        </FormItem>[m
[32m+[m[32m                    </FormItem>[m
                     <label style={{ display:'block',marginBottom: 6 }}>MAC地址</label>[m
                     <FormItem showErrorTip={macTip} style={{ marginBottom: 6 }}>[m
                         <InputGroup size="small" type="mac"[m
[1mdiff --git a/src/pages/Guide/SetWifi.jsx b/src/pages/Guide/SetWifi.jsx[m
[1mindex cbf9751..e6ab4be 100644[m
[1m--- a/src/pages/Guide/SetWifi.jsx[m
[1m+++ b/src/pages/Guide/SetWifi.jsx[m
[36m@@ -11,9 +11,9 @@[m [mconst { FormItem, Input, ErrorTip } = Form;[m
 const confirm = Modal.confirm;[m
 const errorMessage = {[m
     '-1001': '参数格式错误',[m
[31m-    '-1002': '参数取值不合法',[m
[31m-    '-1100': '设置WIFI:参数SSID不合法',[m
[31m-    '-1101': '设置WIFI:参数PASSWORD不合法'[m
[32m+[m[32m    '-1002': '参数非法',[m
[32m+[m[32m    '-1100': 'Wi-Fi名称非法',[m
[32m+[m[32m    '-1101': 'Wi-Fi密码非法'[m
 };[m
 [m
 export default class SetWifi extends React.Component {[m
[1mdiff --git a/src/pages/UpgradeDetect/Upgrade.jsx b/src/pages/UpgradeDetect/Upgrade.jsx[m
[1mindex a3a061d..f1378a6 100644[m
[1m--- a/src/pages/UpgradeDetect/Upgrade.jsx[m
[1m+++ b/src/pages/UpgradeDetect/Upgrade.jsx[m
[36m@@ -78,7 +78,7 @@[m [mexport default class Upgrade extends React.Component{[m
                         break;[m
                 }[m
             }) [m
[31m-        }else{   [m
[32m+[m[32m        }else{[m
             Modal.error({title : '启动升级失败', centered: true});[m
         }});[m
     }[m
