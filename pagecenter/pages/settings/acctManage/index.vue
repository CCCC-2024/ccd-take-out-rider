<template>
  <view class="warp">
    <view class="item">
      <text class="item_left">{{LANGUAGE_DATA['邮箱'][LANGUAGE]}}</text>
      <view class="item_right" v-if="userInfor.user_email" @tap="handleJump" :data-url="`/pagecenter/pages/settings/modify_mobile_step01/index?type=1&inforEm=${userInfor.user_email}`">
        <text>{{userInfor.user_email}}</text>
        <text class="iconfont" style="font-size: 36rpx;">&#xe666;</text>
      </view>
      <view class="item_right" v-else  @tap="handleJump" :data-url="`/pagecenter/pages/settings/modify_mobile_step02/index?type=1`">
        <text>{{LANGUAGE_DATA['未绑定邮箱'][LANGUAGE]}}</text>
        <text class="iconfont" style="font-size: 36rpx;">&#xe666;</text>
      </view>
    </view>
    <view class="item">
      <text class="item_left">{{LANGUAGE_DATA['手机号'][LANGUAGE]}}</text>
      <view class="item_right" v-if="userInfor.mobile"  @tap="handleJump" :data-url="`/pagecenter/pages/settings/modify_mobile_step01/index?type=2&infor=${userInfor.mobile}`">
        <text>{{userInfor.mobile}}</text>
        <text class="iconfont" style="font-size: 36rpx;">&#xe666;</text>
      </view>
      <view class="item_right" v-else  @tap="handleJump" :data-url="`/pagecenter/pages/settings/modify_mobile_step02/index?type=2`">
        <text>{{LANGUAGE_DATA['未绑定手机号'][LANGUAGE]}}</text>
        <text class="iconfont" style="font-size: 36rpx;">&#xe666;</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfor: {
        mobile: '',
        user_email: ''
      }
    }
  },
  onLoad(){
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['账号管理'][this.LANGUAGE]}`
    });
    
    uni.$on('userPhone', res => {
      this.getUsers()
    })
    this.getUsers()
  },
  methods: {
    getUsers(){
      this.$api.get(global.apiUrls.getRiderMsg, {
      }).then(res => {
        if(res.data.code == 1){
          console.log(res.data.data.is_open)
          this.userInfor = res.data.data
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
