<template>
	<view class="login">
		<view class="login_input">
			<view class="item">
        <view class="item_left">
          <input type="number" :placeholder="LANGUAGE_DATA['请输入手机号'][LANGUAGE]" v-model="phone" style="width: 550rpx;"  placeholder-style="color='#BFBFBF'" />
        </view>
			</view>
			<view class="item">
        <view class="item_left">
          <input class="code" type="number" :placeholder="LANGUAGE_DATA['请输入验证码'][LANGUAGE]" v-model="verifCode"  placeholder-style="color='#BFBFBF'"/>
          <button class="get-code-btn" type="default" :loading="verCodeBtnLoading" @tap="handleSendVerCode">{{beginning ? `${LANGUAGE_DATA['倒计时'][LANGUAGE]}` + time + 's' : `${LANGUAGE_DATA['获取验证码'][LANGUAGE]}`}}</button>
        </view>
			</view>
			<view class="item">
        <view class="item_left">
          <input placeholder-class="input-placeholder" style="width: 500rpx;" type="password" v-if="passwordInputType == 'password'" :placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]" v-model="passwords"  placeholder-style="color='#BFBFBF'" />
          <input placeholder-class="input-placeholder" v-if="passwordInputType == 'text'" type="text" :placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]" style="ime-mode:disabled;width: 500rpx;" v-model="passwords"  placeholder-style="color='#BFBFBF'" />
          <text style="font-size: 36rpx;" class="iconfont" v-if="passwordInputType == 'text'" @tap="handleTogglePasswordInputType">&#xe60f;</text>
          <text style="font-size: 36rpx;" class="iconfont" v-if="passwordInputType == 'password'" @tap="handleTogglePasswordInputType">&#xe668;</text>
        </view>
			</view>
		</view>
		<button class="button" type="default" @click="pointRight">{{LANGUAGE_DATA['注册'][LANGUAGE]}}</button>
    
	</view>
</template>

<script>
  import { validate } from '@/common/utils/index'
	export default{
		data() {
			return {
				verCodeBtnLoading: false,                       // 获取验证码按钮动画
        beginning: false,
        time: 60,
        passwordInputType: 'password',
        phone: '',                                     // 手机账号
        verifCode: '',                                 // 验证码
        passwords: '',                                 // 密码
        invite: '',                                    // 邀请码
        mailbox: '',                                   // 邮箱账号
        
        show: false,
        selector: ['86', '1'],
        choseArea: '86',                                // 选择的区号
        isacount: true,                                 // 是否是账号登录
        isTick: false,                                  // 是否勾选协议
        
        options: '',                                    // 微信登录带过来的数据
			}
		},
    onLoad(option) {
      console.log('52------------',option)
      this.options = option
    },
		methods:{
      // 返回上一页
      back_next(){
        uni.navigateBack({})
      },
      
      /**
       * 切换协议
       */
      changeTick(){
        this.isTick = !this.isTick
      },
      
      /**
       * 选择区号
       */
      choseOver(e){
        console.log(this.selector[e])
        this.choseArea = this.selector[e]
      },
      
      /**
       * 切换登录方式
       */
      changeCut(){
        this.isacount = !this.isacount
        this.time = 60
        if(!this.isacount){
          this.phone = ''
        }else{
          this.mailbox = ''
        }
      },
      
      // 切换密码状态
      handleTogglePasswordInputType(){
        this.passwordInputType = this.passwordInputType == 'password' ? 'text' : 'password'
      },
      // 获取短信
      handleSendVerCode(){
        if(this.verCodeBtnLoading) return false;
        let { phone, mailbox, isacount, choseArea } = this;
        
        if(phone == '') return this.$message.info('请输入手机号');
        if(!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
        // if(isacount){
          
        // }else{
        //   if(mailbox == '') return this.$message.info('请输入邮箱账号');
        //   if(!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确')
        // }
        
        if(this.beginning) return false;
        this.verCodeBtnLoading = true;
        this.$api.post(global.apiUrls.aliSend,{
          mobile: phone,
          type: 5,
          user_id: '',
          is_test: global.IS_DEV,
          auth_type: 'wx_unionid'
        }).then(res => {
          this.verCodeBtnLoading = false;
          if(res.data.code == 1){
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
          }else{
            this.$message.info(res.data.msg)
          }
        }).catch(err => {
          this.verCodeBtnLoading = false;
        })
      },
      // 注册
      pointRight(){
        let { phone, verifCode, passwords, mailbox, choseArea, isacount, isTick} = this;
        if(phone == '') return this.$message.info('请输入手机号');
        if(!validate(phone, 'phone')) return this.$message.info('手机号格式不正确')
        // if(isacount){
          
        // }else{
        //   if(mailbox == '') return this.$message.info('请输入邮箱账号');
        //   if(!validate(mailbox, 'email')) return this.$message.info('邮箱账号格式不正确')
        // }
        
        if(verifCode == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入验证码'][this.LANGUAGE]}`);
        if(passwords == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][this.LANGUAGE]}`);
        
        // #ifdef APP-PLUS
        let clientId = plus.push.getClientInfo().clientid || "";
        console.log("clientId", clientId);
        //  @const {Number} appSystem - 判断设备类型 1：ios；2：安卓；
        let appSystem = uni.getSystemInfoSync().platform == "ios" ? 1 : 2;
        // #endif
        
        this.$api.post(global.apiUrls.wxloginByMobile, {
          mobile: phone,
          code: verifCode,
          password: passwords,
          type: 5,
          client_id: clientId,
          unionId: this.options.un,
          openId: this.options.open,
          nickName: this.options.name,
          avatarUrl: this.options.head
        }).then(res => {
          console.log(res.data)
          this.$message.info(res.data.msg);
          if (res.data.code == 1) {
            this.loginData = res.data.data.userinfo
            if(res.data.data.userinfo.approve_status == -1){
              // 已注册,未填写认证信息
              uni.navigateTo({
                url: '/pagecenter/pages/login/auth/index?token=' + res.data.data.userinfo.user_token
              })
            }else if(res.data.data.userinfo.approve_status == 0){
              // 待审核
              // this.$message.info(`${this.LANGUAGE_DATA['认证信息正在审核'][this.LANGUAGE]}`)
              uni.navigateTo({
                url: '/pagecenter/pages/login/auth_wait/index?type=1'
              })
            }else if(res.data.data.userinfo.approve_status == 2){
              // 审核未通过
              // this.$message.info(`${this.LANGUAGE_DATA['认证信息审核未通过，请重新填写信息'][this.LANGUAGE]}`)
              uni.navigateTo({
                url: '/pagecenter/pages/login/auth_wait/index?type=3' + '&token=' + that.loginData.user_token + '&reason=' + that.loginData.reason
              })
              
            }else{
              // 审核通过
              this.$message.info(`${this.LANGUAGE_DATA['登录成功'][this.LANGUAGE]}`)
              global.token = res.data.data.userinfo.user_token;
              global.userInfo = res.data.data.userinfo; 
              uni.setStorageSync('USER_TOKEN', global.token)
              uni.setStorageSync('USER_INFO', global.userInfo)
              setTimeout(() => {
                uni.switchTab({ url: '/pages/tab/tab01/index' })
              }, 1000)
              uni.$emit('loginSuccess')
            }
            
            
            // setTimeout(function(){
            //   uni.navigateTo({
            //     url: '/pagecenter/pages/login/auth/index?token=' + res.data.data.userinfo.user_token
            //   })
            // },1000)
          } else {
            // this.$message.info(res.data.msg);
          }
        })
        
      }
		}
	}
</script>

<style lang="scss">
	@import './index.scss'
</style>
