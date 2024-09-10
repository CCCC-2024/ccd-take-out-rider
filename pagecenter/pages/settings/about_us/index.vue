<template>
  <view class="warp">
    <view class="logo">
       <image :src="message.logo" mode="aspectFill"></image>
    </view>
    <!-- <view class="version">{{LANGUAGE_DATA['当前版本'][LANGUAGE]}}{{version}}</view> -->
    <view class="compen_name">{{message.site_title}}</view>
    <!-- <view class="ver_msg">
      <view class="">{{LANGUAGE_DATA['官网'][LANGUAGE]}}：{{message.web_site_url}}</view>
      <view class="">{{LANGUAGE_DATA['公司邮箱'][LANGUAGE]}}：{{message.web_site_email}}</view>
      <view class="">{{LANGUAGE_DATA['公司地址'][LANGUAGE]}}：{{message.web_site_address}}</view>
    </view> -->
    <view class="company">
      <view>{{message.web_site_copyright}}</view>
      <view>All Ringhts Reserved</view>
    </view>
  </view>
</template>

<script>
import { SYSTEM_CONFIG } from '@/common/config.js'
export default {
  data() {
    return {
      SYSTEM_CONFIG,
      version: '',
      systemLogo:'',
      message: ''
    }
  },
  onLoad(){
    this.version = global.VERSION_CODE
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, (inf) => {
      this.version = inf.version;
    });
    // #endif
    
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['关于我们'][this.LANGUAGE]}`
    });
    
    this.getMsg()
  },
  methods: {
    getMsg(){
      this.$api.get(global.apiUrls.aboutUs, {
        
      }).then(res => {
        if(res.data.code == 1){
          this.message = res.data.data
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
