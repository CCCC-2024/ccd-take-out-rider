<script>
	import Vue from 'vue';
	// import io from "@hyoga/uni-socket.io";
	import {
		WS_HOST
	} from '@/common/config.js'
	import {
		mapActions
	} from 'vuex';
	import {
		checkOpenGPSServiceByAndroid
	} from '@/common/function/device.js';
	let timer = null;
	let num = 0 //用于记录当前走了多久时间
	export default {
		onLaunch: function() {
			uni.$on('getIntervalAddress', this.getIntervalAddress);
			uni.onTabBarMidButtonTap(() => {
				this.$urouter.navigateTo('/pages/global_pop/publish/index')
			})
      // #ifdef APP-PLUS

			this.updateApp()
            // #endif
			// uni.$on('appLoginSuccess', () => {
			//   uni.closeSocket()
			//   this.initializeSocket()
			// })

			// #ifdef APP-PLUS
			// this.checkPermissions()
			// uni.$on('NEW_MESSAGE_NOTIFY', () => {
			//   const innerAudioContext = uni.createInnerAudioContext();
			//   innerAudioContext.volume = 1;
			//   innerAudioContext.src = '/static/wangwang.mp3';
			//   innerAudioContext.play()
			//   innerAudioContext.onEnded(() => {
			//     innerAudioContext.destroy();
			//   });
			// })

			// plus.push.addEventListener( 'click', (e) => {
			//   if(e.payload && e.payload.class){
			//     let pages = getCurrentPages(),
			//       currentPage = pages[pages.length - 1]['route'] || '';
			//     this.$store.commit('setChatUser', {
			//       nickname: e.payload.from_nickname,
			//       id: e.payload.from_id,
			//       avatar: e.payload.from_avatar
			//     })
			//     this.$urouter[currentPage.startsWith('pagechat/pages/chat/index') ? 'redirectTo' : 'navigateTo']('/pagechat/pages/chat/index')
			//     plus.push.clear()
			//   }
			// });
			// #endif

			// this.initializeSocket()

			// 推送消息通知
			// plus.push.addEventListener( 'click', function(e){
			//   console.log('推送e---------',e)
			//   this.pushCallback(message);
			//   uni.navigateTo({ url: e.payload })
			// });
			var this_ = this;
			plus.push.addEventListener(
				'receive',
				function(message) {
					console.log('推送------------', message)
					// uni.$emit('NEW_ORDERCE', { msg: message.content })
					if (message.content == '您有新订单请及时处理') {
						uni.$emit('NEW_ORDER', {
							msg: '您有新订单请及时处理'
						})
						this_.$store.commit('changeValue', message.content)
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.volume = 1;
						innerAudioContext.src = '/static/orderTip/newOrder.mp3';
						innerAudioContext.play()
						innerAudioContext.onEnded(() => {
							innerAudioContext.destroy();
						});
					} else if (message.content == '抢单大厅有新订单请您及时查看') {
						uni.$emit('NEW_ORDER', {
							msg: '抢单大厅有新订单请您及时查看'
						})
						this_.$store.commit('changehallValue', message.content)
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.volume = 1;
						innerAudioContext.src = '/static/orderTip/robOrder.mp3';
						innerAudioContext.play()
						innerAudioContext.onEnded(() => {
							innerAudioContext.destroy();
						});
					} else if (message.content == '跑腿订单请注意查收') {
						uni.$emit('NEW_ORDER', {
							msg: '跑腿订单请注意查收'
						})
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.volume = 1;
						innerAudioContext.src = '/static/orderTip/runOrder.Mp3';
						innerAudioContext.play()
						innerAudioContext.onEnded(() => {
							innerAudioContext.destroy();
						});
					} else if (message.content == '转单求助') {
						uni.$emit('NEW_ORDER', {
							msg: '转单求助'
						})
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.volume = 1;
						innerAudioContext.src = '/static/orderTip/helpOrder.Mp3';
						innerAudioContext.play()
						innerAudioContext.onEnded(() => {
							innerAudioContext.destroy();
						});
					} else {
						const innerAudioContext = uni.createInnerAudioContext();
						innerAudioContext.volume = 1;
						innerAudioContext.src = '/static/orderTip/news.Mp3';
						innerAudioContext.play()
						innerAudioContext.onEnded(() => {
							innerAudioContext.destroy();
						});
					}
				},
				false
			);

			/**
			 * ! 验证码登录 密码登录的时候通知了一下
			 */
			// global.token && this.$store.dispatch('getCartList');
			if (uni.getStorageSync('USER_INFO').user_token) {
				// 获取聊天票据
				this.getSign();
			}

			uni.$on("loginSuccess", res => {
				this.$api.post(global.apiUrls.IMAuthenticate, {}).then((res) => {
					if (res.data.code == 1) {
						global.WEBSOCKET = res.data.data.socket_url;
						Vue.prototype.$socket = new io(res.data.data.socket_url, {
							transports: ["websocket"],
						});

						// 断线重连
						this.$socket.on("reconnect", function() {
							console.log("重连成功");
						});

						this.$socket.on("connect", () => {
							// 将自己注册到SOCKET
							this.$socket.emit("conn", {
								uid: res.data.data.uid,
								userSig: res.data.data.userSig,
							});
						});
						this.$socket.on("conn", function(data) {
							if (data[0] == "ok") {
								console.log("注册成功");
							} else {
								console.log("注册失败");
							}
						});
						// 监听接收消息
						this.$socket.on("broadcastingListen", function(data) {
							console.log("接收消息----------------", data);
							// myAudio.play();
							for (var i = 0; i < data.length; i++) {
								console.log(data[i]); // 与你发送的msg 一致
								uni.$emit("receiveMsg", data[i]);
							}
						});
					}
				});
			});
			this.getIsShelf()
		},

		onShow: function() {
			console.log('App Show')
			if (uni.getStorageSync('USER_INFO').user_token) {
				// 获取聊天票据
				this.getSign();
			}
		},

		onHide: function() {
			uni.$emit('APP_HIDE', {
				msg: 'app hide'
			})
			clearInterval(timer)
		},

		methods: {
			...mapActions(['messageReceived']),
			getIntervalAddress() {
				// 获取经纬度轮循 ===================================================
				let that = this
				// that.Getaddress()
				timer = setInterval(function() {
					num++;
					if (num >= 20) {
						that.Getaddress()
						num = 0
					}
				}, 1000)
			},
			updateApp() {
				let _this = this;
				plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
					this.$api.post(global.apiUrls.publicUpdateAPP, {
						version: widgetInfo.version,
						type: 1
					}).then(res => {
						if (res.data.code == 1 && res.data.data.is_new == 1) {
							plus.nativeUI.toast('检测到新版本' + res.data.data.version_name + '，后台更新中...');
							let wgtUrl = res.data.data.version_url;
							let apkUrl = res.data.data.version_apk_url || '';
							console.log('79===========', wgtUrl)
							uni.downloadFile({
								url: wgtUrl,
								success: (downloadResult) => {
									console.log('82----------------', downloadResult)
									if (downloadResult.statusCode === 200) {
										plus.runtime.install(downloadResult.tempFilePath, {
											force: false
										}, function() {
											plus.runtime.restart();
										}, function(e) {
											if (plus.os.name == 'Android' && apkUrl) {
												uni.downloadFile({
													url: apkUrl,
													success: (
														downloadResult
													) => {
														if (downloadResult
															.statusCode ===
															200) {
															plus.runtime
																.install(
																	downloadResult
																	.tempFilePath
																);
														}
													}
												});
											}
										});
									} else if (downloadResult.statusCode === 400) {
										if (plus.os.name == 'Android' && apkUrl) {
											uni.downloadFile({
												url: apkUrl,
												success: (downloadResult) => {
													if (downloadResult
														.statusCode === 200) {
														plus.runtime.install(
															downloadResult
															.tempFilePath);
													}
												}
											});
										}
									}
								}
							});
						}
					})
				});
			},

			initializeSocket() {
				if (global.token) {
					// 链接socket
					uni.connectSocket({
						url: WS_HOST
					});

					// 接收socket消息
					uni.onSocketOpen(res => {
						console.log(res)
						uni.onSocketMessage(onMessage => {
							console.log(onMessage)
							let onMessageJson = JSON.parse(onMessage.data)
							// console.log(onMessageJson)
							switch (onMessageJson.class) {
								case 'say':
									this.$store.commit('messageReceived', onMessageJson)
									break;
								case 'init':
									// 发送握手消息
									uni.sendSocketMessage({
										data: JSON.stringify({
											class: 'init',
											from_id: global.userInfo.id
										})
									})
									break;
								default:
									// statements_def
									break;
							}
						})

						// uni.sendSocketMessage({
						//   data: JSON.stringify({ c: 'Message', a: 'ping' })
						// });



						// 定时发送心跳消息避免断开
						setInterval(() => {
							uni.sendSocketMessage({
								data: JSON.stringify({
									class: 'ping'
								})
							});
						}, 25000)

						// socket 断开链接后尝试重新链接
						// uni.onSocketError(err => {
						//   console.log(err)
						// })
					})
				}
			},

			/**
			 * websocket 初始化
			 */
			getSign() {
				this.$api.post(global.apiUrls.IMAuthenticate, {}).then((res) => {
					console.log(res.data.data.socket_url)
					if (res.data.code == 1) {
						global.WEBSOCKET = res.data.data.socket_url;
						Vue.prototype.$socket = new io(res.data.data.socket_url, {
							transports: ["websocket"],
						});

						// 断线重连
						this.$socket.on("reconnect", function() {
							console.log("重连成功");
						});

						this.$socket.on("connect", () => {
							// 将自己注册到SOCKET
							this.$socket.emit("conn", {
								uid: res.data.data.uid,
								userSig: res.data.data.userSig,
							});
						});
						this.$socket.on("conn", function(data) {
							if (data[0] == "ok") {
								console.log("注册成功");
							} else {
								console.log("注册失败");
							}
						});
						// 监听接收消息
						this.$socket.on("broadcastingListen", function(data) {
							console.log("接收消息----------------", data);
							// myAudio.play();
							for (var i = 0; i < data.length; i++) {
								console.log(data[i]); // 与你发送的msg 一致
								uni.$emit("receiveMsg", data[i]);
							}
						});
					}
				});
			},

			// 推送回调
			pushCallback(message) {
				console.log('to do list', message);
				this.$urouter.navigateTo('/pages/service-message/message/message-type/index');
			},

			checkPermissions() {
				// #ifdef APP-PLUS
				if (plus.os.name == 'Android') { // 判断是Android
					var main = plus.android.runtimeMainActivity();
					var pkName = main.getPackageName();
					var uid = main.getApplicationInfo().plusGetAttribute("uid");
					var NotificationManagerCompat = plus.android.importClass(
						"android.support.v4.app.NotificationManagerCompat");
					var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();
					// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置
					if (!areNotificationsEnabled) {
						uni.showModal({
							title: '通知权限开启提醒',
							content: '您还没有开启通知权限，无法接受到消息通知，是否前往设置？',
							success: function(res) {
								if (res.confirm) {
									var Intent = plus.android.importClass('android.content.Intent');
									var Build = plus.android.importClass("android.os.Build");
									//android 8.0引导
									if (Build.VERSION.SDK_INT >= 26) {
										var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
										intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
									} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0
										var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
										intent.putExtra("app_package", pkName);
										intent.putExtra("app_uid", uid);
									} else { //(<21)其他--跳转到该应用管理的详情页
										intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
										var uri = Uri.fromParts("package", mainActivity.getPackageName(),
											null);
										intent.setData(uri);
									}
									// 跳转到该应用的系统通知设置页
									main.startActivity(intent);
								}
							}
						});
					}
				} else if (plus.os.name == 'iOS') { // 判断是ISO
					var isOn = undefined;
					var types = 0;
					var app = plus.ios.invoke('UIApplication', 'sharedApplication');
					var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
					if (settings) {
						types = settings.plusGetAttribute('types');
						plus.ios.deleteObject(settings);
					} else {
						types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
					}
					plus.ios.deleteObject(app);
					isOn = (0 != types);
					if (isOn == false) {
						uni.showModal({
							title: '通知权限开启提醒',
							content: '您还没有开启通知权限，无法接受到消息通知，是否前往设置？',
							success: function(res) {
								if (res.confirm) {
									var app = plus.ios.invoke('UIApplication', 'sharedApplication');
									var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
									plus.ios.invoke(app, 'openURL:', setting);
									plus.ios.deleteObject(setting);
									plus.ios.deleteObject(app);
								}
							}
						});
					}
				}
				// #endif
			},
			// 定时获取经纬度
			Getaddress() {
				let that = this
				// that.$message.info('获取经纬度---')
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						if (global.userInfo) {
							that.$api.post(global.apiUrls.updateCoor, {
								lat: res.latitude,
								lng: res.longitude
							}).then(res => {
								console.log(JSON.stringify(res))
								if (res.data.code == 1) {
									// that.$message.info('成功了')
									console.log(res.data.data)
									// uni.setStorageSync('isLocation', false)
								} else {
									// that.$message.info(res.data.msg);
								}
							})
						}
					},
					fail: err => {
						checkOpenGPSServiceByAndroid()
						uni.setStorageSync('isLocation', false);
					}
				});
			},

			/**
			 * 获取是否上架状态
			 */
			getIsShelf() {
				let that = this
				let appSystem = uni.getSystemInfoSync().platform == 'android' ? 2 : 1
				// console.log(appSystem)
				// return;
				// this.version = global.VERSION_CODE
				plus.runtime.getProperty(plus.runtime.appid, (inf) => {
					that.$api.post(global.apiUrls.isShelf, {
						version_number: inf.version,
						edition: appSystem,
						type: 3
					}).then(res => {
						console.log('438-----------', res)
						// that.$message.info('获取上架状态',res.data.data.is_show)
						if (res.data.code == 1) {
							// that.isGrounding = res.data.data.is_show
							// that.Getaddress()
							// return;
							if (res.data.data.is_show == 1) {
								that.Getaddress()
							}

						} else {}
					}).catch(err => {})
				});
			},
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	@import "./common/css/base.css";
	@import "./common/css/icon.css";
	@import "./common/css/main.css";
	@import "./common/css/animation.css";
	@import "./common/css/font/iconfont.css";
	/* #endif */

	@font-face {
		font-family: 'iconfont';
		/* project id 1687640 */
		src: url('https://at.alicdn.com/t/font_2314414_jhu1bizov3m.woff2') format('woff2');
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 28upx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* #ifdef H5 */
	uni-toast {
		z-index: 999999999;
	}

	uni-toast .uni-sample-toast {
		z-index: 999999999;
	}

	checkbox .uni-checkbox-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border: 1px solid #FE922B;
		background: #FE922B;
		color: #fff !important;
		border-color: #FFFFFF !important;
	}

	uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: #CCCCCC !important;
	}

	checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		font-size: 18px;
	}

	radio .uni-radio-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	radio .uni-radio-input.uni-radio-input-checked {
		border: 1px solid #FE922B;
		background: #FE922B;
		color: #fff !important;
	}

	radio .uni-radio-input.uni-radio-input-checked:before {
		font-size: 18px;
	}

	/* #endif */
	/* #ifndef APP-PLUS-NVUE */
	checkbox .wx-checkbox-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		border: 1px solid #FE922B;
		background: #FE922B;
		color: #fff !important;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		font-size: 18px;
	}

	radio .wx-radio-input {
		width: 38upx;
		height: 38upx;
		border-radius: 50%;
	}

	.uni-input-input {
		color: #333;
	}

	radio .wx-radio-input.wx-radio-input-checked {
		border: 1px solid #477bff;
		background: #477bff;
		color: #fff !important;
	}

	radio .wx-radio-input.wx-radio-input-checked::before {
		font-size: 18px;
	}

	/* #endif */
</style>
