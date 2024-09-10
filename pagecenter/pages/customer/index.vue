<template>
  <view class="page-wapper">
    <view class="">
      <rich-text :nodes="userInfor.content"></rich-text>
    </view>
    <!-- <image src="/static/img/banner.png" mode="" class="conutImg"></image>
    <view class="conutCount"> 砥砺十年，犇犇科技逐渐壮大，相继在北京、南京、上海、杭州、苏州等地设立分公司。</view> -->
    <view class="card">
      <view class="cardPhone">
        <image src="/pagecenter/static/img/master-img1.png" mode=""></image>
        <view class="cardCount" @click="call(userInfor.zhanzhang_phone)">
          <view class="sever_num">站长电话</view>
          <view class="sever_time">{{userInfor.zhanzhang_phone}}</view>
          <!-- <view class="dial" >{{LANGUAGE_DATA['拨打电话'][LANGUAGE]}}</view> -->
        </view>
      </view>
      <view class="cardPhone">
        <image src="/pagecenter/static/img/master-img2.png" mode=""></image>
        <view class="cardCount" @click="call(userInfor.service_phone)">
          <view class="sever_num">平台电话</view>
          <view class="sever_time">{{userInfor.service_phone}}</view>
          <!-- <view class="dial" @click="call(userInfor.web_site_phone)">{{LANGUAGE_DATA['拨打电话'][LANGUAGE]}}</view> -->
        </view>
      </view>
    </view>
    <!-- <image src="/pagecenter/static/img/sever.png" mode=""></image> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfor: ''
    }
  },
  onLoad(){
    // uni.setNavigationBarTitle({
    //   title:`${this.LANGUAGE_DATA['联系客服'][this.LANGUAGE]}`
    // });
    
    this.getUsers()
  },
  methods: {
    getUsers(){
      this.$api.get(global.apiUrls.custoSever, {
      }).then(res => {
        if(res.data.code == 1){
          console.log(res.data.data.is_open)
          this.userInfor = res.data.data
        }else{
          
        }
      })
    },
    call(mobile){
      let _this = this
			let mobiles = ''
      if (mobile == '' || mobile == null) {
        _this.$message.info(`${this.LANGUAGE_DATA['暂无联系方式'][this.LANGUAGE]}`);
      } else {
        uni.makePhoneCall({
          phoneNumber: mobile   
        });
      }
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

