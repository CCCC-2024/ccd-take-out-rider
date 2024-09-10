<template>
  <view class="warp">
    <view class="top">
      <!-- 邮箱验证 -->
      <view class="login-phone form-wapper" v-if="is_type == 1">
        <view class="title">{{LANGUAGE_DATA['当前邮箱'][LANGUAGE]}}：{{mailbox}}</view>
        <view class="code input-wapper">
          <view class="rside">
            <input placeholder-class="input-placeholder" type="number" maxlength="6" v-model="vercode_yx" :placeholder="LANGUAGE_DATA['请输入验证码'][LANGUAGE]" />
          </view>
          <button class="get-code-btn" type="default" :loading="verCodeBtnLoading" @click="handleSendVerCode" >{{beginning_yx ? `${LANGUAGE_DATA['倒计时'][LANGUAGE]}` + time_yx + 's' : `${LANGUAGE_DATA['获取验证码'][LANGUAGE]}`}}</button>
        </view>
      </view>
      
      <!-- 手机号验证 -->
      <view class="login-phone form-wapper" v-if="is_type == 2">
        <view class="title">{{LANGUAGE_DATA['当前手机'][LANGUAGE]}}：{{mobile.substring(0, 3)+"****"+mobile.substr(mobile.length-4)}}</view>
        <view class="code input-wapper">
          <view class="rside">
            <input placeholder-class="input-placeholder" type="number" maxlength="6" v-model="vercode" :placeholder="LANGUAGE_DATA['请输入验证码'][LANGUAGE]" />
          </view>
          <button class="get-code-btn" type="default" :loading="verCodeBtnLoading" @click="handleSendVerCode" >{{beginning ? `${LANGUAGE_DATA['倒计时'][LANGUAGE]}` + time + 's' : `${LANGUAGE_DATA['获取验证码'][LANGUAGE]}`}}</button>
        </view>
      </view>
      
      <button :loading="loginBtnLoading" @tap="handleSubmit" class="login-btn">{{LANGUAGE_DATA['下一步'][LANGUAGE]}}</button>
    </view>
  </view>
</template>
<script>
import { validate } from '@/common/utils/index'

export default {
  data() {
    return {
      is_type: 1,                          // 1:邮箱  2：手机
      // 手机信息------------------------------------------------
      mobile: '',
      vercode: '',
      time: 60,
      beginning: false,
      // 邮箱信息--------------------------------------------------
      mailbox: 'cxnsdjbfjkasbcj@163.com',
      vercode_yx: '',
      beginning_yx: false,
      time_yx: 60,
      
      loginBtnLoading: false,              // 登录按钮加载动画
      verCodeBtnLoading: false,
    }
  },
  onLoad(option){
    console.log(option)
    this.is_type = option.type
    this.mailbox = option.inforEm
    this.mobile = option.infor
    let title = ''
    if(option.type == 1){
      title = `${this.LANGUAGE_DATA['验证绑定邮箱'][this.LANGUAGE]}`
    }else{
      title = `${this.LANGUAGE_DATA['验证绑定手机'][this.LANGUAGE]}`
    }
    uni.setNavigationBarTitle({
      title: title
    });
  },
  methods: {
    // 提交
    handleSubmit() {
      let { vercode, vercode_yx, mobile, mailbox } = this;
      if(this.loginBtnLoading) return false;
      if(this.is_type == 1){
        if (!validate(vercode_yx, 'require')) return this.$message.info('请正确输入验证码');
        this.loginBtnLoading = true;
        this.bindEamle()
      }else{
        if (!validate(vercode, 'require')) return this.$message.info('请正确输入验证码');
        this.loginBtnLoading = true;
        this.bindPhone()
      }
      
    },
    
    // 绑定手机号
    bindPhone(){
      this.$api.post(global.apiUrls.nextBangding, {
        mobile: this.mobile,
        code: this.vercode,
        step: 1
      }).then(res => {
        this.loginBtnLoading = false;
        this.$message.info(res.data.msg);
        if (res.data.code == 1) {
          setTimeout(()=>{
            this.$urouter.redirectTo('/pagecenter/pages/settings/modify_mobile_step02/index?type=' + this.is_type)
          }, 1000)
        }
      }).catch(err => {
        this.loginBtnLoading = false;
        this.$message.info(res.data.msg);
      })
    },
    
    // 绑定邮箱
    bindEamle(){
      this.$api.post(global.apiUrls.bindEamil, {
        user_email: this.mailbox,
        code: this.vercode_yx,
        step: 1
      }).then(res => {
        this.loginBtnLoading = false;
        this.$message.info(res.data.msg);
        if (res.data.code == 1) {
          setTimeout(()=>{
            this.$urouter.redirectTo('/pagecenter/pages/settings/modify_mobile_step02/index?type=' + this.is_type)
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
      let { mobile, mailbox } = this;
      if (this.beginning || this.verCodeBtnLoading) return false;

      this.verCodeBtnLoading = true;
      this.$api.post(global.apiUrls.aliSend, {
        mobile: this.is_type == 2 ? mobile : '',
        type: 4,
        user_id: global.userInfo.id,
        is_test: 1,
        user_email: this.is_type == 1 ? mailbox : ''
      }).then(res => {
        this.verCodeBtnLoading = false;
        if (res.data.code == 1) {
          if(this.is_type == 1){
            this.$message.info('验证码已发送至邮箱' + mailbox + '请注意查收');
            
            //显示倒计时
            this.beginning_yx = true;
            //开始倒计时
            this.timer = setInterval(() => {
              let tempTime = this.time_yx;
              if (tempTime == 0) {
                //倒计时结束
                clearInterval(this.timer);
                this.beginning_yx = false;
                this.time_yx = 60;
                return;
              }
              this.time_yx--;
            }, 1000);
            
          }else{
            this.$message.info('验证码已发送至手机' + mobile + '请注意查收');
            
            //显示倒计时
            this.beginning = true;
            //开始倒计时
            this.timer = setInterval(() => {
              let tempTime = this.time;
              if (tempTime == 0) {
                //倒计时结束
                clearInterval(this.timer);
                this.beginning = false;
                this.time = 60;
                return;
              }
              this.time--;
            }, 1000);
          }
          
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
