<template>
  <view class="warp">
    <view class="warpRow" @tap="handleJump" :data-url="`/pagecenter/pages/wallet/zhi_binding/zhi_binding?mobile=${mobile}`">
      <view class="warpRow_left">
        <image src="/pagecenter/static/img/payIcon1.png" mode=""></image>
        <text>绑定支付宝</text>
      </view>
      <u-icon name="arrow-right" color="#BFBFBF" size="28"></u-icon>
    </view>
		 <!-- @tap="handleJump" :data-url="`/pagecenter/pages/wallet/wx_binding/wx_binding?mobile=${mobile}`" -->
    <!-- <view class="warpRow" @click="wxBind">
      <view class="warpRow_left">
        <image src="/pagecenter/static/img/payIcon2.png" mode=""></image>
        <text>绑定微信</text>
      </view>
      <u-icon name="arrow-right" color="#BFBFBF" size="28"></u-icon>
    </view> -->
    <view class="warpRow" @tap="handleJump" data-url="/pagecenter/pages/wallet/bind_account_car/index">
      <view class="warpRow_left">
        <image src="/pagecenter/static/img/payIcon3.png" mode=""></image>
        <text>绑定银行卡</text>
      </view>
      <u-icon name="arrow-right" color="#BFBFBF" size="28"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mobile: '',                               // 注册手机号
    };
  },
  onLoad(options) {
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['账号绑定'][this.LANGUAGE]}`
    });
    
    this.getUsers()
    // this.getMsg()
    
    uni.$on('bindSucces', res =>{
      this.getMsg()
    })
  },
  methods: {
    /**
     * 获取手机号
     */
    getUsers(){
      this.$api.get(global.apiUrls.getRiderMsg, {
      }).then(res => {
        if(res.data.code == 1){
          console.log(res)
          this.mobile = res.data.data.mobile
        }else{
          
        }
      })
    },
    
    /**
     * 获取账号信息
     */ 
    getMsg(){
      this.$api.get(global.apiUrls.storeWithdrawCheck).then(res => {
        if(res.data.code == 1){
          this.list = res.data.data
        }else{
          // this.$message.info(res.data.msg) 
        }
      })
    },
    
    /**
     * 删除账号
     */
    delAccount(id){
      this.$api.post(global.apiUrls.cutAccount,{
        bank_id: id
      }).then(res => {
        this.$message.info(res.data.msg) 
        if(res.data.code == 1){
          this.getMsg()
        }else{
          // this.$message.info(res.data.msg) 
        }
      })
    },
		
		/**
		 * 微信绑定
		 */
		wxBind(){
			let _this = this;
			uni.login({
			  provider: "weixin",
			  success: function(loginRes) {
			    uni.getUserInfo({
			      provider: "weixin",
			      success: function(infoRes) {
			        console.log('103----',infoRes.userInfo)
			        
			      },
			    });
			  },
			  error: function(err) {
			    uni.hideLoading();
			    console.log(err);
			  },
			});
		}
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
