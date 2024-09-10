import Vue from 'vue';
import App from './App';
import store from './store/index';
import uView from "uview-ui";
Vue.use(uView);

/*===============================================================
=                           global user info                    =
===============================================================*/

global.token = '';
global.userInfo = null; // 用户信息

// en-us
// zh-cn
global.LANGUAGE = 'zh-cn';

// 获取账户信息
try {
	const USER_TOKEN = uni.getStorageSync('USER_TOKEN');
	const USER_INFO = uni.getStorageSync('USER_INFO');
	const LANGUAGE = uni.getStorageSync('LANGUAGE');
	if (LANGUAGE == 'en') {
		LANGUAGE = 'en-us'
		uni.setStorageSync('LANGUAGE', LANGUAGE);
	}

	global.token = USER_TOKEN || '';
	if (USER_INFO) global.userInfo = USER_INFO;

	if (LANGUAGE) global.LANGUAGE = LANGUAGE;
	else {
		let language = uni.getStorageInfoSync().language.toLowerCase().replace('-', '_');
	}
} catch (e) {}

/*======================================================================
=                    global attributes and methods                     =
======================================================================*/

import apiUrls from '@/common/api/url.js'
import {
	http
} from '@/common/api/index.js';
import {
	message,
	Router,
	Dayjs
} from '@/common/utils/index.js';
import {
	IMG_BASE_URL,
	SYSTEM_CONFIG,
	PAGE_SIZE,
	VERSION_CODE,
	IS_DEV
} from '@/common/config.js';


const router = new Router({
	needLoginPages: [
		'/pages/center/fans/index',

	]
});

Vue.config.productionTip = false;
Vue.prototype.$urouter = router;
Vue.prototype.$api = http;
Vue.prototype.$message = message;
Vue.prototype.$store = store;

global.apiUrls = apiUrls;
global.imgBaseUrl = IMG_BASE_URL;
global.IS_DEV = IS_DEV;
global.PAGE_SIZE = PAGE_SIZE;
global.VERSION_CODE = VERSION_CODE;
global.SYSTEM_CONFIG = SYSTEM_CONFIG;

// import customPopModal from '@/pages/global_pop/modal/index_component.vue';
import LANGUAGE_DATA from '@/common/language/language.js'


// 弹出自定义Modal
global.customShowModalPopup = (options) => {
	global.customShowModelPopupOptions = options
	if (options.success) global.customShowModelPopupSucess = options.success
	// #ifdef APP-PLUS
	uni.navigateTo({
		url: '/pages/global-pop/modal/index'
	})
	// #endif

	// #ifndef APP-PLUS
	uni.showModal(options)
	// #endif
}

/*=================================================================
=                          global components                      =
=================================================================*/

import customPopModal from '@/pages/global-pop/modal/index-component.vue';

Vue.component('custom-pop-modal', customPopModal);

/*=================================================================
=                          global filters                         =
=================================================================*/


// 识别图片路径是否为全路径 若不是则进行拼接
Vue.filter('assembleImgSrc', src => {
	src = src || ''
	return src.indexOf('http://') != -1 || src.indexOf('https://') != -1 ?
		src :
		IMG_BASE_URL + src;
});

// 日期格式转换
Vue.filter('formatDate', (date, format = 'YYYY-MM-DD') => {
	return Dayjs(date).format(format)
});


/*==================================================================
=                           global mixins                          =
==================================================================*/

const systemInfo = uni.getSystemInfoSync()
console.log(systemInfo)
let mixinTopBarHeight = 44
let mixinBarTrueHeight = 0
let mixinMenuButtonWidth = 0
// #ifdef MP-WEIXIN
const menu = wx.getMenuButtonBoundingClientRect();
const temp = menu.bottom - systemInfo.statusBarHeight
mixinTopBarHeight = temp + (temp - menu.height);
mixinBarTrueHeight = menu.height;
mixinMenuButtonWidth = menu.width + (systemInfo.windowWidth - menu.right) * 2;
// #endif

Vue.mixin({
	data() {
		return {
			mixinStatusHeight: systemInfo.statusBarHeight, // 状态栏高度
			mixinTopBarHeight: mixinTopBarHeight, // 顶部导航栏高度
			mixinBarTrueHeight: mixinBarTrueHeight, // 胶囊按钮高度
			mixinMenuButtonWidth: mixinMenuButtonWidth, // 如果向胶囊左边放内容应留出的距离
			LANGUAGE: '',
			LANGUAGE_DATA: null
		}
	},
	onLoad() {
		this.LANGUAGE = global.LANGUAGE
		this.LANGUAGE_DATA = LANGUAGE_DATA;
	},
	onShow() {
		this.LANGUAGE = global.LANGUAGE
	},
	methods: {
		// 页面跳转
		handleJump(e) {
			let target = e.currentTarget || e.target,
				url = target.dataset.url || 'back',
				type = target.dataset.type;
			if (url == '' || url == '#') return;
			switch (type) {
				case 'SWITCH':
					router.switchTab(url);
					break;
				case 'REDIRECT':
					router.redirectTo(url);
					break;
				case 'RELAUNCH':
					router.reLaunch(url);
					break;
				case 'BACK':
					router.navigateBack();
					break;
				default:
					router.navigateTo(url);
					break;
			}
		}
	}
})

/*==================  End of global mixins  =====================*/

App.mpType = 'app';

const app = new Vue({
	store,
	...App
});

app.$mount();