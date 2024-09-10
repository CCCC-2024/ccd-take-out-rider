<template>
  <view class="page-wapper">
    <view class="top">
      <image class="icon" src="/pagecenter/static/img/exam.png"></image>
      <view class="title">您的申请已提交</view>
      <view class="desc">申请提交成功，平台将在7个工作日之内将提现金额支付到您的账户请注意查收</view>
    </view>
    <view class="bottom">
      <u-button class="btn" @click="handleJump" shape="circle">返回个人中心</u-button>
    </view>
  </view>
</template>

<script>
import { validate } from '@/common/utils/index'

export default {
  data() {
    return {
      onlineImgBaseUrl: '',
      payOptions: ''
    }
  },

  onLoad(options) {
    this.onlineImgBaseUrl = global.onlineImgBaseUrl
    this.payOptions = options
  },
  methods: {
    handleJump(){
      uni.switchTab({ url: '/pages/tab/tab03/index' })
    }
  }
}

</script>

<style lang="scss">
@import "./index.scss";
</style>
