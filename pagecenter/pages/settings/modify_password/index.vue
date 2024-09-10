<template>
  <view class="warp">
    <view class="login-phone form-wapper">
      <!-- <view class="code input-wapper">
        <view class="code_left">
          <text  class="leftText">{{LANGUAGE_DATA['旧密码'][LANGUAGE]}}</text>
          <input placeholder-class="input-placeholder" type="password" v-model="oldPassword" maxlength="12" :placeholder="LANGUAGE_DATA['请输入旧密码'][LANGUAGE]" style="width: 540rpx;" />
        </view>
      </view> -->
      <view class="code input-wapper">
        <view class="code_left">
          <text class="leftText" >{{LANGUAGE_DATA['新密码'][LANGUAGE]}}</text>
          <input placeholder-class="input-placeholder" type="password" v-if="passwordInputType == 'password'" v-model="password"
            :placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]" style="width: 460rpx;" />
          <input placeholder-class="input-placeholder" v-if="passwordInputType == 'text'" type="text"  v-model="password"
            :placeholder="LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]"  style="ime-mode:disabled;width: 460rpx;"/>
        </view>
        <text class="iconfont" v-if="passwordInputType == 'text'" @tap="handleTogglePasswordInputType">&#xe60f;</text>
        <text class="iconfont" v-if="passwordInputType == 'password'" @tap="handleTogglePasswordInputType">&#xe668;</text>
      </view>
      <view class="code input-wapper">
        <view class="code_left">
          <text class="leftText">{{LANGUAGE_DATA['确认新密码'][LANGUAGE]}}</text>
          <input placeholder-class="input-placeholder" type="password" v-if="confirmInputType == 'password'" v-model="passwordConfirm"
            placeholder="请再次输入新密码(6-12位数字+字母)" style="width: 460rpx;" />
          <input placeholder-class="input-placeholder" v-if="confirmInputType == 'text'" type="text"  v-model="passwordConfirm"
            placeholder="请再次输入新密码(6-12位数字+字母)"  style="ime-mode:disabled;width: 460rpx;"/>
        </view>
        <text class="iconfont" v-if="confirmInputType == 'text'" @tap="handlecomfirInputType">&#xe60f;</text>
        <text class="iconfont" v-if="confirmInputType == 'password'" @tap="handlecomfirInputType">&#xe668;</text>
      </view>
    </view>
    <button :loading="submitBtnLoading" @tap="handleSubmit" class="login-btn">{{LANGUAGE_DATA['完成'][LANGUAGE]}}</button>
  </view>
</template>
<script>
import { validate } from '@/common/utils/index'
export default {
  data() {
    return {
      oldPassword: '',                          // 旧密码
      password: '',                             // 新密码                    
      passwordConfirm: '',                      // 确认密码
      passwordInputType: 'password',            // 新密码的 密码框的状态
      confirmInputType: 'password',             // 确认密码的 密码框的状态
      submitBtnLoading: false,                  // 提交按钮的加载状态
    }
  },
  onLoad() {
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['修改密码'][this.LANGUAGE]}`
    });
  },
  methods: {
    // 切换密码输入框类型
    handleTogglePasswordInputType() {
      this.passwordInputType = (this.passwordInputType == 'password' ? 'text' : 'password')
    },
    
    handlecomfirInputType(){
      this.confirmInputType = (this.confirmInputType == 'password' ? 'text' : 'password')
    },
    
    // 提交
    handleSubmit() {
      let { oldPassword, password, passwordConfirm } = this;
      if(this.submitBtnLoading) return false;
      // if(oldPassword == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入当前密码'][this.LANGUAGE]}`);
      // if (!validate(oldPassword, 'password')) return this.$message.info(`${this.LANGUAGE_DATA['请正确输入当前密码'][this.LANGUAGE]}`);
      if(!validate(password, 'require')) return this.$message.info(`${this.LANGUAGE_DATA['请输入新密码'][this.LANGUAGE]}`);
      if(!validate(password, 'password')) return this.$message.info(`${this.LANGUAGE_DATA['请输入正确格式的密码（6-12位数字加字母）'][this.LANGUAGE]}`);
      if(passwordConfirm == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入确认密码'][this.LANGUAGE]}`); 
      if(password != passwordConfirm) return this.$message.info(`${this.LANGUAGE_DATA['新密码与确认密码不同步，请检查后重试'][this.LANGUAGE]}`);

      this.submitBtnLoading = true;

      this.$api.post(global.apiUrls.changePsd, {
        security_code: oldPassword,
        password_code: passwordConfirm,
        password: password,
      }).then(res => {
        this.submitBtnLoading = false;
        this.$message.info(res.data.msg);
        if (res.data.code == 1) {
          global.token = '';
          global.userInfo = null;
          uni.removeStorageSync('USER_TOKEN') 
          uni.removeStorageSync('USER_INFO')
          setTimeout(()=>{
            uni.reLaunch({
              url: '/pagecenter/pages/login/login/index'
            });
          }, 300)
        }
      }).catch(err => {
        this.submitBtnLoading = false;
        this.$message.info('修改失败');
      })
    }
  }
}

</script>
<style lang="scss">
@import "./index.scss";
</style>
