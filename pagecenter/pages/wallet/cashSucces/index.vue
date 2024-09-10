<template>
  <view class="page-wapper">
    <image src="/pagecenter/static/img/succImg.png" mode="" class="succesImg"></image>
    <view class="tips">{{LANGUAGE_DATA['提交申请成功'][LANGUAGE]}}</view>
    <view class="cashTip">{{LANGUAGE_DATA['提现到账'][LANGUAGE]}}: {{carName}}</view>
    <view class="cashTip">{{LANGUAGE_DATA['提现金额'][LANGUAGE]}}: {{money}}{{LANGUAGE_DATA['元'][LANGUAGE]}}</view>
    
    <view class="btns" @click="iKnow">{{LANGUAGE_DATA['我知道了'][LANGUAGE]}}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      carName: '',                      // 提现到账银行
      money: '',                        // 提现金额
    };
  },
  onLoad(option) {
    console.log(option)
    this.carName = option.name
    this.money = option.money
  },
  onShow(){
    
  },
  methods: {
    iKnow(){
      uni.redirectTo({
        url: '/pagecenter/pages/wallet/wallet/index'
      })
    }
  },
};

</script>

<style lang="scss">
@import './index.scss';
</style>
