<template>
  <view class="warp">
    <!-- <view class="title">{{LANGUAGE_DATA['请选择语言'][LANGUAGE]}}</view> -->
    <view class="choice">
      <view class="chose_all" @click="check_cli(1)">
        <view class="choice_sty">{{LANGUAGE_DATA['英语'][LANGUAGE]}}</view>
        <image src="/pagecenter/static/img/check_xy.png" mode="" v-if="is_check == 1"></image>
        <image src="/pagecenter/static/img/checkNo.png" mode="" v-else></image>
      </view>
      <view class="chose_all" @click="check_cli(2)"> 
        <view class="choice_sty">{{LANGUAGE_DATA['中文'][LANGUAGE]}}</view>
        <image src="/pagecenter/static/img/check_xy.png" mode="" v-if="is_check == 2"></image>
        <image src="/pagecenter/static/img/checkNo.png" mode="" v-else></image>
      </view>
      <view class="chose_all" @click="check_cli(3)">
        <view class="choice_sty">{{LANGUAGE_DATA['法语'][LANGUAGE]}}</view>
        <image src="/pagecenter/static/img/check_xy.png" mode="" v-if="is_check == 3"></image>
        <image src="/pagecenter/static/img/checkNo.png" mode="" v-else></image>
      </view>
    </view>
    <view class="sure_btn" @click="sureCli">{{LANGUAGE_DATA['确定'][LANGUAGE]}}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      is_check: 1
    }
  },
  onLoad(){
    console.log(global.LANGUAGE)
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['语言切换'][this.LANGUAGE]}`
    });
    
    if(global.LANGUAGE == 'zh-cn'){
      this.is_check = 2
    }else{
      this.is_check = 1
    }
  },
  methods: {
    check_cli(type){
      this.is_check = type
      console.log('46=====================',this.is_check)
    },
    
    sureCli(){
      let that = this
      let langStatus = this.is_check == 1 ? `${that.LANGUAGE_DATA['您确定要切换为英文吗?'][that.LANGUAGE]}` : `${that.LANGUAGE_DATA['您确定要切换为中文吗?'][that.LANGUAGE]}`;
      uni.showModal({
        title: `${langStatus}`,
        cancelText:`${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
        confirmText:`${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
        success(res) {
          console.log('-----------',res)
          if (res.confirm) {
            uni.setStorageSync('LANGUAGE', that.is_check == 2 ? 'zh-cn' : 'en-us')
            global.LANGUAGE = that.is_check == 2 ? 'zh-cn' : 'en-us'
            uni.$emit('LANGUAGE_SETTING_SUCCESS')
            setTimeout(function(){
              uni.reLaunch({
                url: '/pages/tab/tab01/index'
              })
            },1000)
          }
        }
      });
    }
  },
}

</script>

<style lang="scss">
@import './index.scss';
</style>
