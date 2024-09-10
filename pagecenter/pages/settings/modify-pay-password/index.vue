<template>
  <view class="page">
    <!-- <fu-custom :isBack="true" :isBottom="true" bgColor="bg-white">
			<view slot="content">{{i18n["修改支付密码"]}}</view>
		</fu-custom> -->
    <view class="per ">
      <!-- 旧密码验证修改 start -->
      <view  v-if="isHavePassword"  @tap="handleJump"  data-url="/pagecenter/pages/settings/change-pay-password/index">
        <view class="per_row">
          <text class="text-lg text-black">{{LANGUAGE_DATA['旧提现密码验证修改'][LANGUAGE]}}</text>
          <text class="fu-iconfont text-bf" style="color: #BFBFBF;">&#xe839;</text>
        </view>
      </view>
      <!-- 旧密码验证修改 end -->
      <!-- 手机号码验证修改 start -->
      <view @click="handleRoute">
        <view class="per_row">
          <text class="text-lg text-black">{{LANGUAGE_DATA['手机号验证修改'][LANGUAGE]}}</text>
          <text class="fu-iconfont text-bf" style="color: #BFBFBF;">&#xe839;</text>
        </view>
      </view>
      <!-- 手机号码验证修改 end -->
    </view>

    <!-- 断网监测 start -->
    <fu-notwork></fu-notwork>
    <!-- 断网监测 end -->
  </view>
</template>

<script>
  export default {
    data() {
      return {
        isHavePassword:true,

      };
    },
    computed: {

    },
    onShow() {
     // this.is_have_password()
    },
    onLoad() {
    },
    methods: {
      // 0 没有设置过密码 1 有设置密码
      is_have_password() {
        let that = this;
        this.$api.post(global.apiUrls.postloginIsHavePassword).then(res => {
          if(res.data.code == 1){
            that.isHavePassword =  res.data.data.is_pay_password
          }
        }).catch(err => {
          console.log(err);
        });
      },
      handleRoute(){
        this.$urouter.navigateTo({
          url: '/pagecenter/pages/settings/modify-password-verify-phone/index',
          params: {
            type: 1,
          }
        });
      },

    }
  };
</script>

<style lang="scss">
  page{
    width: 100%;
    // padding: 0 32rpx;
    background-color: #fff;
  }
  .page{
    padding: 0 32rpx;
  }
  // 列表样式 start
  .per {
    padding-bottom: 160rpx;
    font-size: 28upx;
    .per_row {
      padding: 32upx 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      // border-bottom: 1px solid #ededed;
      background-color: #fff;
      position: relative;
      &:after {
        @include bottom-line(#eee)
      }
      .row_right {
        text-align: right;
        .aa {
          color: #999999;
          display: inline-block;
          margin-right: 10upx;
        }
      }
    }
  }
  // 列表样式 end

</style>
