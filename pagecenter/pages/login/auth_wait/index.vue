<template>
  <view class="page-wapper">
    <view class="top" v-if="payOptions == 1 || payOptions == 2">
      <image class="icon" src="/static/img/icon1.png"></image>
      <view class="title">您的资质认证已提交，</view>
      <view class="desc">我们会在<text style="color: #FD0D1B;">1–3</text>个工作日对您提交的资料进行审核，审核通过您即可正常使用APP</view>
    </view>
    <view class="top" v-if="payOptions == 3">
      <image class="icon" src="/static/img/icon2.png"></image>
      <view class="title">{{LANGUAGE_DATA['您的资质认证已提交，平台审核失败'][LANGUAGE]}}</view>
      <view class="desc">
        <text>{{LANGUAGE_DATA['失败原因'][LANGUAGE]}}：{{reason}}</text>
      </view>
    </view> 

    <view class="bottom">
      <view class="btn btnOut" @click="signOut" v-if="payOptions == 1 || payOptions == 2">{{LANGUAGE_DATA['退出'][LANGUAGE]}}</view>
      <view class="btn btnAgain" @click="afresh" v-if="payOptions == 3">{{LANGUAGE_DATA['重新提交'][LANGUAGE]}}</view>
    </view>
  </view>
</template>

<script>
import { validate } from '@/common/utils/index'

export default {
  data() {
    return {
      onlineImgBaseUrl: '',
      payOptions: '',                      // 1 提交认证 2 登录审核中 3 登录认证被拒
      token: '',
      reason: '',                         // 失败原因
    }
  },

  onLoad(options) {
    this.onlineImgBaseUrl = global.onlineImgBaseUrl
    this.payOptions = options.type
    this.token = options.token ? options.token : ''
    this.reason = options.reason ? options.reason : ''
  },
  methods: {
    handleJump(){
      uni.navigateBack()
    },
    
    /**
     * 退出
     */
    signOut(){
      if(this.payOptions == 1){
        uni.navigateBack({})
      }else{
        uni.reLaunch({
          url: '/pagecenter/pages/login/login/index'
        })
      }
    },
    
    /**
     * 重新提交
     */
    afresh(){
      uni.redirectTo({
        url: '/pagecenter/pages/login/auth/index?token=' + this.token + '&type=1'
      })
    }
  }
}

</script>

<style lang="scss">
@import "./index.scss";
</style>
