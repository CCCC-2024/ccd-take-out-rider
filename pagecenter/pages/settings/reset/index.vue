<template>
  <view class="warp">
    <view class="login-phone form-wapper">
      <view class="title" v-if="userInfor.mobile != ''">{{LANGUAGE_DATA['当前手机'][LANGUAGE]}}：{{userInfor.mobile.substring(0, 3) +"****"+ userInfor.mobile.substr(userInfor.mobile.length-4)}}</view>
      <view class="title" v-if="userInfor.user_email != ''">{{LANGUAGE_DATA['当前邮箱'][LANGUAGE]}}：{{userInfor.user_email.substring(0, 3) +"****"+ userInfor.user_email.substr(userInfor.user_email.length-4)}}</view>
      <view class="code input-wapper">
        <view class="rside">
          <input placeholder-class="input-placeholder" type="number" maxlength="6" v-model="vercode" :placeholder="LANGUAGE_DATA['请输入验证码'][LANGUAGE]" />
        </view>
        <button class="get-code-btn" type="default" :loading="verCodeBtnLoading" @click="handleSendVerCode" >{{beginning ? `${LANGUAGE_DATA['倒计时'][LANGUAGE]}` + time + 's' : `${LANGUAGE_DATA['获取验证码'][LANGUAGE]}`}}</button>
      </view>
    </view>
    <view class="yz_msg" @click="proving">{{LANGUAGE_DATA['验证信息'][LANGUAGE]}}</view>
  </view>
</template>

<script>
import { validate } from '@/common/utils/index'
export default {
  data() {
    return {
      phone: '',
      vercode: '',
      time: 60,
      beginning: false,
      userInfor: {
        user_email: '',
        mobile: ''
      },
      verCodeBtnLoading: false
    }
  },
  onLoad(){
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['重置支付密码'][this.LANGUAGE]}` 
    });
    
    this.getUsers()
  },
  methods: {
    // 获取账号信息
    getUsers(){
      this.$api.get(global.apiUrls.getRiderMsg, {
      }).then(res => {
        if(res.data.code == 1){
          this.userInfor = res.data.data
        }else{
          
        }
      })
    },
    
    // 发送验证码
    handleSendVerCode() {
      if(this.verCodeBtnLoading) return false;
      let { phone, emailMsg } = this;
      if (this.beginning || this.verCodeBtnLoading) return false;
      if(this.userInfor.user_email != ''){
        if (!validate(this.userInfor.user_email, 'email')) return this.$message.info('请正确输入邮箱号');
      }else{
        if (!validate(this.userInfor.mobile, 'phone')) return this.$message.info('请正确输入手机号');
      }
    
      this.verCodeBtnLoading = true;
      this.$api.post(global.apiUrls.aliSend, {
        mobile: this.userInfor.mobile,
        type: 2,
        user_id: global.userInfo.id,
        is_test: 1,
        user_email: this.userInfor.user_email
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
    },
    
    // 验证信息
    proving(){
      if(this.vercode == '') return this.$message.info('请先获取验证码')
      this.$api.post(global.apiUrls.proofPsd, {
        mobile: this.userInfor.mobile,
        code: this.vercode,
        type: 2,
        user_email: this.userInfor.user_email
      }).then(res => {
        if(res.data.code == 1){
          uni.redirectTo({
            url: '/pagecenter/pages/settings/cypher/index?type=7'
          })
        }else{ 
          
        }
      })
    }
  },
}

</script>

<style lang="scss">
@import './index.scss';
</style>
