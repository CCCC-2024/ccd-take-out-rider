/**
 *打开微信小程序
 * @param {Object}
 *  {appId:小程序appid,gid:微信小程序原始id}*/
export default function	toMpWeixin(param){
	// #ifdef MP-WEIXIN
	uni.navigateToMiniProgram({appId:param.appId})
	// #endif
	
	// #ifdef APP-PLUS
	plus.share.getServices(shareList=>{
	let shareWx = shareList.find(val=> val.id == 'weixin')
	if(shareWx){
	shareWx.launchMiniProgram({id:param.gid})
	}else{
	uni.showToast({icon: 'none', title: "未安装微信,无法打开对应小程序"})
	}
	}, e=>{
	uni.showToast({icon: 'none', title: "获取分享服务列表失败:"+JSON.stringify(e)})
	})
	// #endif
}