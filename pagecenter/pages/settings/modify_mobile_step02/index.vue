<template>
  <view class="warp">
    <!-- 邮箱绑定 -->
    <view class="login-phone form-wapper" v-if="is_type == 1">
      <view class="phone input-wapper">
        <text class="iconfont" style="font-size: 34rpx;margin-right: 16rpx;color: #999999;">&#xe64d;</text>
        <input placeholder-class="input-placeholder" style="width: 600rpx;" type="text" v-model="emailMsg" :placeholder="LANGUAGE_DATA['请输入新邮箱'][LANGUAGE]" />
      </view>
      <view class="code input-wapper">
        <view class="code_left">
          <text class="iconfont" style="font-size: 34rpx;margin-right: 16rpx;color: #999999; display: block;">&#xe623;</text>
          <input placeholder-class="input-placeholder" style="width: 165rpx;" type="number" maxlength="6" v-model="vercode" :placeholder="LANGUAGE_DATA['验证码'][LANGUAGE]" />
        </view>
        <button class="get-code-btn" type="default" :loading="verCodeBtnLoading" @click="handleSendVerCode" >{{beginning ? `${LANGUAGE_DATA['倒计时'][LANGUAGE]}` + time + 's' : `${LANGUAGE_DATA['获取验证码'][LANGUAGE]}`}}</button>
      </view>
    </view>
    
    <!-- 手机号绑定 -->
    <view class="login-phone form-wapper" v-if="is_type == 2">
      <view class="phone input-wapper">
        <text class="iconfont" style="font-size: 34rpx;margin-right: 16rpx;color: #999999;">&#xe61c;</text>
        <input placeholder-class="input-placeholder" type="number" style="width: 600rpx;" maxlength="11" v-model="phone" :placeholder="LANGUAGE_DATA['请输入新手机号'][LANGUAGE]" />
      </view>
      <view class="code input-wapper">
        <view class="code_left">
          <text class="iconfont" style="font-size: 34rpx;margin-right: 16rpx;color: #999999;display: block;">&#xe623;</text>
          <input placeholder-class="input-placeholder" style="width: 165rpx;" type="number" maxlength="6" v-model="vercode" :placeholder="LANGUAGE_DATA['验证码'][LANGUAGE]"/>
        </view>
        <button class="get-code-btn" type="default" :loading="verCodeBtnLoading" @click="handleSendVerCode" >{{beginning ? `${LANGUAGE_DATA['倒计时'][LANGUAGE]}` + time + 's' : `${LANGUAGE_DATA['获取验证码'][LANGUAGE]}`}}</button>
      </view>
    </view>
    <button :loading="loginBtnLoading" @tap="handleSubmit" type="primary" class="login-btn">{{LANGUAGE_DATA['提交'][LANGUAGE]}}</button>
  </view>
</template>
<script>
import { validate } from '@/common/utils/index'

export default {
  data() {
    return {
      is_type: 1,
      
      phone: '',
      vercode: '',
      time: 60,
      beginning: false,
      
      loginBtnLoading: false,                          // 登录按钮加载动画
      verCodeBtnLoading: false,
      
      emailMsg: '',                                    // 邮箱
    }
  },

  onLoad(option) {
    this.is_type = option.type
    let title = ''
    if(option.type == 1){
      title = `${this.LANGUAGE_DATA['绑定邮箱'][this.LANGUAGE]}`
    }else{
      title = `${this.LANGUAGE_DATA['绑定手机号'][this.LANGUAGE]}`
    }
    uni.setNavigationBarTitle({
      title: title
    });
  },

  methods: {
    // 提交
    handleSubmit() {
      if(this.is_type == 1){
        this.bindEmail()
      }else{
        this.bindPhone()
      }
    },
    
    // 绑定手机号
    bindPhone(){
      let { vercode, phone } = this;
      if (this.loginBtnLoading) return false;
      if (!validate(phone, 'phone')) return this.$message.info('请正确输入手机号');
      if (!validate(vercode, 'require')) return this.$message.info('请正确输入验证码');
      
      this.loginBtnLoading = true;
      this.$api.post(global.apiUrls.nextBangding, {
        step: 2,
        mobile: phone,
        code: vercode
      }).then(res => {
        this.loginBtnLoading = false;
        this.$message.info(res.data.msg);
        if (res.data.code == 1) {
          global.userInfo.mobile = phone;
          uni.setStorageSync('USER_INFO', global.userInfo)
          setTimeout(()=>{
            uni.$emit('userPhoneChanged', { phone: phone })
            uni.navigateBack()
          }, 1000)
        }
      }).catch(err => {
        this.loginBtnLoading = false;
        this.$message.info(res.data.msg);
      })
    },
    
    bindEmail(){
      let { vercode, emailMsg } = this;
      if (this.loginBtnLoading) return false;
      if(emailMsg == '') return this.$message.info('请输入新邮箱');
      if(emailMsg.indexOf("@") == -1) return this.$message.info('请正确输入邮箱号');
      // if (!validate(emailMsg, 'email')) return this.$message.info('请正确输入邮箱号');
      if (vercode == '') return this.$message.info('请输入验证码');
      
      this.loginBtnLoading = true;
      this.$api.post(global.apiUrls.bindEamil, {
        step: 2,
        user_email: emailMsg,
        code: vercode
      }).then(res => {
        this.loginBtnLoading = false;
        this.$message.info(res.data.msg);
        if (res.data.code == 1) { 
          uni.$emit('userPhone')
          setTimeout(()=>{
            uni.navigateBack()
          }, 1000)
        }
      }).catch(err => {
        this.loginBtnLoading = false;
        this.$message.info(res.data.msg);
      })
    },

    // 发送验证码
    handleSendVerCode() {
      if(this.verCodeBtnLoading) return false;
      let { phone, emailMsg } = this;
      if (this.beginning || this.verCodeBtnLoading) return false;
      if(this.is_type == 1){
        if (!validate(emailMsg, 'email')) return this.$message.info('请正确输入邮箱号');
      }else{
        if (!validate(phone, 'phone')) return this.$message.info('请正确输入手机号');
      }

      this.verCodeBtnLoading = true;
      this.$api.post(global.apiUrls.aliSend, {
        mobile: this.is_type == 2 ? phone : '',
        type: 5,
        user_id: global.userInfo.id,
        is_test: 1,
        user_email: this.is_type == 1 ? emailMsg : ''
      }).then(res => {
        this.verCodeBtnLoading = false;
        if (res.data.code == 1) {
          this.$message.info('验证码已发送至手机' + phone + '请注意查收');
          //显示倒计时
          this.beginning = true;

          //开始倒计时
          this.timer = setInterval(() => {
            if (this.time == 0) {
              //倒计时结束
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
    }
  }
}

</script>
<style lang="scss">
@import "./index.scss";
</style>
