<template>
	<view class="login">
		<view class="title">
			<u-icon name="arrow-left" color="#333333" size="36" @click="backNext"></u-icon>
			<view class="">{{LANGUAGE_DATA['忘记密码'][LANGUAGE]}}</view>
			<text></text>
		</view>
		<image class="loginBack" src="/pagecenter/static/login/login_bg.png" mode="aspectFill"></image>
		<view class="logo">
			<view class="headTitie">{{LANGUAGE_DATA['欢迎来到星橙送外卖'][LANGUAGE]}}</view>
		</view>
		<view class="login_input">
			<view class="item">
				<view class="">{{LANGUAGE_DATA['账号'][LANGUAGE]}}</view>
				<view class="item_left">
					<view class="entry">
						<input type="number" :placeholder="LANGUAGE_DATA['请输入手机号'][LANGUAGE]" v-model="phone"
							style="width: 450rpx;" />
					</view>
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
					<view class="entry">
						<input placeholder-class="input-placeholder" type="password"
							v-if="passwordInputType == 'password'" v-model="passwords"
							:placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]" style="width: 500rpx;" />
						<input placeholder-class="input-placeholder" v-if="passwordInputType == 'text'" type="text"
							v-model="passwords" :placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]"
							style="ime-mode:disabled;width: 500rpx;" />
					</view>
					<text style="font-size: 36rpx;" class="iconfont" v-if="passwordInputType == 'text'"
						@tap="handleTogglePasswordInputType">&#xe60f;</text>
					<text style="font-size: 36rpx;" class="iconfont" v-if="passwordInputType == 'password'"
						@tap="handleTogglePasswordInputType">&#xe668;</text>
				</view>
			</view>
		</view>
		<button class="button" type="default" @click="forgetPsd">{{LANGUAGE_DATA['确定'][LANGUAGE]}}</button>
		<view class="pt-images-verification" v-if="identifCode">
			<pt-Images-Verification :left="codeObj.left" :bgImg="codeObj.bgImg" :maskImg="codeObj.maskImg"
				@refresh="refresh" @dragEnd="dragEnd" @success="success"></pt-Images-Verification>
			<view class="pt-close" @click="handleClose">X</view>
		</view>

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
				phone: '', // 手机号
				mailbox: '', // 邮箱账号
				verifCode: '', // 验证码
				passwords: '', // 密码

				show: false,
				selector: ['86', '1'],
				choseArea: '86', // 选择的区号
				isacount: true,
				identifCode: false,
				isTick: false,
				codeObj: {
					bgImg: '',
					maskImg: '',
					left: 0,
					rand: null,
					confirm_code: null
				} // 是否是账号登录
			}
		},
		onLoad() {

		},
		methods: {
			backNext() {
				uni.navigateBack({})
			},
			// 切换密码状态
			handleTogglePasswordInputType() {
				this.passwordInputType = this.passwordInputType == 'password' ? 'text' : 'password'
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
				if (!this.isacount) {
					this.phone = ''
				} else {
					this.mailbox = ''
				}
			},

			// 获取验证码
			handleSendVerCode() {
				if (this.verCodeBtnLoading) return false;
				let {
					phone,
					mailbox,
					isacount
				} = this;

				if (isacount) {
					if (phone == '') return this.$message.info('请输入手机号');
					if (!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
				} else {
					if (mailbox == '') return this.$message.info('请输入邮箱账号');
					if (!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确');
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
					isacount
				} = this;

				if (isacount) {
					if (phone == '') return this.$message.info('请输入手机号');
					if (!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
				} else {
					if (mailbox == '') return this.$message.info('请输入邮箱账号');
					if (!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确');
				}

				if (this.beginning) return false;

				this.verCodeBtnLoading = true;
				this.$api.post(global.apiUrls.aliSend, {
					mobile: phone,
					type: 2,
					user_id: '',
					is_test: global.IS_DEV,
					user_email: mailbox,
					rand: this.codeObj.rand,
					confirm_code: this.codeObj.confirm_code,
				}).then(res => {
					this.verCodeBtnLoading = false;
					if (res.data.code == 1) {
						this.$message.info('验证码已发送至手机' + res.data.data.code + '请注意查收');
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
			// 忘记密码
			forgetPsd() {
				let {
					phone,
					verifCode,
					passwords,
					isacount,
					choseArea,
					isTick
				} = this;
				let type = ''
				if (isacount) {
					if (phone == '') return this.$message.info('请输入手机号');
					if (choseArea == '86') {
						if (!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
					}
					type = 1
				} else {
					if (mailbox == '') return this.$message.info('请输入邮箱账号');
					if (!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确');
					type = 2
				}

				if (verifCode == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入验证码'][this.LANGUAGE]}`);
				if (passwords == '') return this.$message.info(
					`${this.LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][this.LANGUAGE]}`);
				if (!validate(passwords, 'password')) return this.$message.info(
					`${this.LANGUAGE_DATA['密码格式错误(6-12位数字及字母)'][this.LANGUAGE]}`);
				if (!isTick) return this.$message.info(`${this.LANGUAGE_DATA['请阅读并勾选协议'][this.LANGUAGE]}`);
				this.$api.post(global.apiUrls.forgetPsd, {
					user_account: phone,
					code: verifCode,
					password: passwords,
					cate: type,
					area_code: choseArea
				}).then(res => {
					console.log(res.data)
					this.$message.info(res.data.msg);
					if (res.data.code == 1) {
						setTimeout(function() {
							uni.navigateBack({})
						}, 1000)
					} else {
						// this.$message.info(res.data.msg);
					}
				})
			},
			/**
			 * 切换协议
			 */
			changeTick() {
				this.isTick = !this.isTick
			},
		},
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