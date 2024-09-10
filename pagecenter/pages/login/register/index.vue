<template>
	<view class="login">
		<!-- 头部 -->
		<view class="page_header">
			<image src="/pagecenter/static/login/login_bg.png" mode="" class="bg_img"></image>
			<view class="heade_con">
				<view class="nav_barH"></view>
				<u-icon name="arrow-left" color="#333333" size="36" @click="back_next"></u-icon>
				<view class="headTitie">{{LANGUAGE_DATA['欢迎来到星橙送外卖'][LANGUAGE]}}</view>
			</view>
		</view>
		<view class="login_input">
			<view class="item">
				<view class="">{{LANGUAGE_DATA['账号'][LANGUAGE]}}</view>
				<view class="item_left">
					<input type="number" :placeholder="LANGUAGE_DATA['请输入手机号'][LANGUAGE]" v-model="phone"
						style="width: 550rpx;" placeholder-style="color='#BFBFBF'" />
				</view>
			</view>
			<view class="item">
				<view class="">{{LANGUAGE_DATA['验证码'][LANGUAGE]}}</view>
				<view class="item_left">
					<input class="code" type="number" :placeholder="LANGUAGE_DATA['请输入验证码'][LANGUAGE]"
						v-model="verifCode" placeholder-style="color='#BFBFBF'" />
					<button class="get-code-btn" type="default" :loading="verCodeBtnLoading"
						@tap="handleSendVerCode">{{beginning ? `${LANGUAGE_DATA['倒计时'][LANGUAGE]}` + time + 's' : `${LANGUAGE_DATA['获取验证码'][LANGUAGE]}`}}</button>
				</view>
			</view>
			<view class="item">
				<view class="">{{LANGUAGE_DATA['密码'][LANGUAGE]}}</view>
				<view class="item_left">
					<input placeholder-class="input-placeholder" style="width: 500rpx;" type="password"
						v-if="passwordInputType == 'password'"
						:placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]" v-model="passwords"
						placeholder-style="color='#BFBFBF'" />
					<input placeholder-class="input-placeholder" v-if="passwordInputType == 'text'" type="text"
						:placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]"
						style="ime-mode:disabled;width: 500rpx;" v-model="passwords"
						placeholder-style="color='#BFBFBF'" />
					<text style="font-size: 36rpx;" class="iconfont" v-if="passwordInputType == 'text'"
						@tap="handleTogglePasswordInputType">&#xe60f;</text>
					<text style="font-size: 36rpx;" class="iconfont" v-if="passwordInputType == 'password'"
						@tap="handleTogglePasswordInputType">&#xe668;</text>
				</view>
			</view>
		</view>
		<button class="button" type="default" @click="pointRight">{{LANGUAGE_DATA['注册'][LANGUAGE]}}</button>

		<view class="agreen">
			<view class="agreen-style" @click="changeTick">
				<image src="/pagecenter/static/img/check_xy.png" mode="" class="chose-img" v-if="isTick"></image>
				<image src="/pagecenter/static/img/checkNo.png" mode="" class="chose-img" v-else></image>
				<text>已阅读并同意</text>
			</view>
			<text class="agrees" @tap="handleJump"
				data-url="/pagecenter/pages/login/agreement/index?id=2">《{{LANGUAGE_DATA['用户注册协议'][LANGUAGE]}}》</text>
			<text>{{LANGUAGE_DATA['与'][LANGUAGE]}}</text>
			<text class="agrees" @tap="handleJump"
				data-url="/pagecenter/pages/login/agreement/index?id=5">《{{LANGUAGE_DATA['隐私协议'][LANGUAGE]}}》</text>
		</view>

		<!-- 区号 -->
		<u-picker v-model="show" mode="selector" :range="selector" :mask-close-able="false"
			@confirm="choseOver"></u-picker>

		<view class="pt-images-verification" v-if="identifCode">
			<pt-Images-Verification :left="codeObj.left" :bgImg="codeObj.bgImg" :maskImg="codeObj.maskImg"
				@refresh="refresh" @dragEnd="dragEnd" @success="success"></pt-Images-Verification>
			<view class="pt-close" @click="handleClose">X</view>
		</view>

	</view>
</template>

<script>
	import {
		validate
	} from '@/common/utils/index'
	import {
		BASE_URL
	} from "@/common/config.js";
	import ptImagesVerification from '../../../../components/pt-images-verification/pt-images-verification.vue';
	export default {
		components: {
			ptImagesVerification
		},
		data() {
			return {
				verCodeBtnLoading: false, // 获取验证码按钮动画
				beginning: false,
				time: 60,
				passwordInputType: 'password',
				phone: '', // 手机账号
				verifCode: '', // 验证码
				passwords: '', // 密码
				invite: '', // 邀请码
				mailbox: '', // 邮箱账号

				show: false,
				selector: ['86', '1'],
				choseArea: '86', // 选择的区号
				isacount: true, // 是否是账号登录
				isTick: false, // 是否勾选协议
				identifCode: false,
				codeObj: {
					bgImg: '',
					maskImg: '',
					left: 0,
					rand: null,
					confirm_code: null
				}
			}
		},
		methods: {
			// 返回上一页
			back_next() {
				uni.navigateBack({})
			},

			/**
			 * 切换协议
			 */
			changeTick() {
				this.isTick = !this.isTick
			},

			/**
			 * 选择区号
			 */
			choseOver(e) {
				console.log(this.selector[e])
				this.choseArea = this.selector[e]
			},

			/**
			 * 切换登录方式
			 */
			changeCut() {
				this.isacount = !this.isacount
				this.time = 60
				if (!this.isacount) {
					this.phone = ''
				} else {
					this.mailbox = ''
				}
			},

			// 切换密码状态
			handleTogglePasswordInputType() {
				this.passwordInputType = this.passwordInputType == 'password' ? 'text' : 'password'
			},
			// 获取短信
			handleSendVerCode() {
				if (this.verCodeBtnLoading) return false;
				let {
					phone,
					mailbox,
					isacount,
					choseArea
				} = this;
				if (isacount) {
					if (phone == '') return this.$message.info('请输入手机号');
					if (choseArea == '86') {
						if (!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
					}
				} else {
					if (mailbox == '') return this.$message.info('请输入邮箱账号');
					if (!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确')
				}

				if (this.beginning) return false;
				this.identifCode = true;
				this.initCode()
			},
			getVerificationCode() {
				if (this.verCodeBtnLoading) return false;
				let {
					phone,
					mailbox,
					isacount,
					choseArea
				} = this;
				if (isacount) {
					if (phone == '') return this.$message.info('请输入手机号');
					if (choseArea == '86') {
						if (!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
					}
				} else {
					if (mailbox == '') return this.$message.info('请输入邮箱账号');
					if (!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确')
				}

				if (this.beginning) return false;

				this.verCodeBtnLoading = true;
				this.$api.post(global.apiUrls.aliSend, {
					mobile: phone,
					type: 1,
					user_id: '',
					is_test: global.IS_DEV,
					user_email: mailbox,
					rand: this.codeObj.rand,
					confirm_code: this.codeObj.confirm_code,
				}).then(res => {
					this.verCodeBtnLoading = false;
					if (res.data.code == 1) {
						this.$message.info('验证码已发送,请注意查收');
						// 显示倒计时
						this.beginning = true;

						// 开始倒计时
						this.timer = setInterval(() => {
							let tempTime = this.time;
							if (tempTime == 0) {
								// 倒计时结束
								clearInterval(this.timer);
								this.beginning = false;
								this.time = 60;
								return;
							}
							this.time--;
						}, 1000);
					} else {
						this.$message.info(res.data.msg)
					}
				}).catch(err => {
					this.verCodeBtnLoading = false;
				})
			},
			// 获取验证码
			initCode() {
				// getIdentifyingCode: '/v1/65ee78c49f67c',//获取登录图形验证码
				// postVerificationCode: '/v1/65ee79dd93075',//验证登录图形验证码
				this.$api
					.get(global.apiUrls.getIdentifyingCode, {})
					.then(res => {
						console.log(res.data.data)
						if (res.data.code == 1 && res.data.data) {
							this.codeObj.bgImg = BASE_URL + res.data.data.bg;
							this.codeObj.maskImg = BASE_URL + res.data.data.icon;
							// this.codeObj.left = Number(res.data.data.left);
							this.codeObj.rand = res.data.data.rand;
						}
					})
				// let index = this.random(0, this.codeArray.length - 1)
				// this.codeObj = this.codeArray[index]
			},
			// 刷新验证码
			refresh() {
				this.initCode()
			},
			dragEnd(e) {
				this.$api
					.post(global.apiUrls.postVerificationCode, {
						left: Math.floor(e),
						rand: this.codeObj.rand
					})
					.then(res => {
						if (res.data.code == 1) {
							this.identifCode = false;
							this.codeObj.confirm_code = res.data.data.confirm_code;
							this.getVerificationCode();
							uni.showToast({
								icon: 'none',
								title: '验证成功'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '验证失败，再来一次吧',
								duration: 1500
							})
						}
					})
			},
			// 验证成功
			success() {
				uni.showToast({
					icon: 'none',
					title: '验证成功'
				})
				this.identifCode = false;
				this.getVerificationCode();
			},
			handleClose() {
				this.identifCode = false;
			},
			// 注册
			pointRight() {
				let {
					phone,
					verifCode,
					passwords,
					mailbox,
					choseArea,
					isacount,
					isTick
				} = this;

				if (isacount) {
					if (phone == '') return this.$message.info('请输入手机号');
					if (!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
				} else {
					if (mailbox == '') return this.$message.info('请输入邮箱账号');
					if (!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确')
				}

				if (verifCode == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入验证码'][this.LANGUAGE]}`);
				if (passwords == '') return this.$message.info(
					`${this.LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][this.LANGUAGE]}`);

				if (!isTick) return this.$message.info(`${this.LANGUAGE_DATA['请阅读并勾选协议'][this.LANGUAGE]}`);

				this.$api.post(global.apiUrls.loginByMobile, {
					mobile: phone,
					code: verifCode,
					type: 1,
					password: passwords,
					client_id: '',
					user_email: mailbox,
				}).then(res => {
					console.log(res.data)
					this.$message.info(res.data.msg);
					if (res.data.code == 1) {
						setTimeout(function() {
							uni.navigateTo({
								url: '/pagecenter/pages/login/auth/index?token=' + res.data.data
									.userinfo.user_token
							})
						}, 1000)
					} else {
						// this.$message.info(res.data.msg);
					}
				})

			}
		}
	}
</script>

<style lang="scss">
	@import './index.scss';
	.pt-images-verification {
		top: 0;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
		background-color: rgba(7, 7, 7, 0.3);
		height: 100%;
		width: 100%;
	}
	
	.pt-close {
		height: 80upx;
		width: 80upx;
		background-color: #fff;
		bottom: 60upx;
		font-size: 40upx;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		position: fixed;
		border-radius: 360upx;
	}
	
	/deep/.pt-dragbar {
		margin-top: 0;
	}
</style>