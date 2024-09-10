let system = uni.getSystemInfoSync(); // 获取系统信息
import permision from "@/js_sdk/wa-permission/permission.js"
/**检查是否打开GPS功能（android）**/
export const checkOpenGPSServiceByAndroid = () => {
  if (system.platform === 'android') { // 判断平台
    openGps();
  } else if (system.platform === 'ios') { // 判断平台
    var UIApplication = plus.ios.import("UIApplication");
    var application2 = UIApplication.sharedApplication();
    var NSURL2 = plus.ios.import("NSURL");
    var setting2 = NSURL2.URLWithString("App-Prefs:root=Privacy&path=LOCATION");
    application2.openURL(setting2);
    plus.ios.deleteObject(setting2);
    plus.ios.deleteObject(NSURL2);
    plus.ios.deleteObject(application2);
  }
}
// 检测 安卓是否开启定位
export const androidPermision = async (permisionStr) => {
	console.log(permisionStr)
  // 1	已获取授权
  // 0	未获取授权
  // -1	被永久拒绝授权
  return new Promise((resolve, reject) => {
    let result = permision.requestAndroidPermission(permisionStr);
    // if (result == -1) mShowModel("您已拒绝获取位置信息授权，是否授权", "授权");
    // if (result == 0) mShowModel("应用未获取位置信息授权，是否授权", "授权");
   console.log(result)
	resolve(result);
  })
}
// 检测ios是否开启定位
export const iosPermision  = (permisionStr) => {
  let result = permision.judgeIosPermission(permisionStr);
  if (!result) mShowModel("应用未获取位置信息授权，请到权限管理进行授权", "授权");
  return result
}
/**
 * 定位权限及弹出权限弹框 监听用户点击按钮
 * **/
let num = 0;
export const openGps = () => {
  plus.android.requestPermissions(
    ['android.permission.ACCESS_FINE_LOCATION'],
    function(resultObj) {
      console.log('resultObj---', resultObj);
      var result = 0;
      for (var i = 0; i < resultObj.granted.length; i++) {
        var grantedPermission = resultObj.granted[i];
        // console.log(6, '已获取的权限：' + grantedPermission);
        result = 1
      }
      for (var i = 0; i < resultObj.deniedPresent.length; i++) {
        var deniedPresentPermission = resultObj.deniedPresent[i];
        // console.log(5, '拒绝本次申请的权限：' + deniedPresentPermission);
        num += 1
        result = 0
      }
      for (var i = 0; i < resultObj.deniedAlways.length; i++) {
        var deniedAlwaysPermission = resultObj.deniedAlways[i];
        // console.log(4, '永久拒绝申请的权限：' + deniedAlwaysPermission);
        num += 1
        result = -1
      }
      // 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
      if (result != 1) {
        //如果用户第2次拒绝后，跳转到**应用**的权限页面
        if (num > 1) {
          uni.showToast({
            title: "请到系统设置打开定位服务功能！",
            icon: "none",
            duration: 1500
          })
          setTimeout(() => {
            var Intent = plus.android.importClass("android.content.Intent");
            var Settings = plus.android.importClass("android.provider.Settings");
            var Uri = plus.android.importClass("android.net.Uri");
            var mainActivity = plus.android.runtimeMainActivity();
            var intent = new Intent();
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
            intent.setData(uri);
            mainActivity.startActivity(intent);
          }, 2000)
        }


      }
    },
    function(error) {
      console.log('申请权限错误：' + error.code + " = " + error.message);
      resolve({
        code: error.code,
        message: error.message
      });
    }
  );
}