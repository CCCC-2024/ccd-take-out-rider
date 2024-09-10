<template>
  <view>
    <image src="/pagecenter/static/img/invit.png" mode="" class="entir-img"></image>
    <view class="contents">
      <view class="invite-title">
        <view class="invitat">{{LANGUAGE_DATA['邀请好友'][LANGUAGE]}}</view>
        <view class="my-invitat" @tap="handleJump" data-url="/pagecenter/pages/myInvit/index">{{LANGUAGE_DATA['我的邀请'][LANGUAGE]}}</view>
      </view>
      <view class="invite-code">{{LANGUAGE_DATA['每邀请成功'][LANGUAGE]}}60{{LANGUAGE_DATA['人司机可获得现金红包'][LANGUAGE]}}</view>
      <view class="invite-box">
        <image src="/pagecenter/static/img/share-box.png" mode="" class="box-img"></image>
        <view class="conts-box">
          <view class="content-top">
            <image :src="invitImg" mode="aspectFill" class="invite-logo"></image>
            <view class="">{{LANGUAGE_DATA['我的邀请码'][LANGUAGE]}}: {{code}}</view>
          </view>
          <view class="content-btm">
            <button type="default" class="tns shareBtn" @click="shareShow = true">{{LANGUAGE_DATA['立即分享'][LANGUAGE]}}</button>
            <button type="default" class="tns saveBtn" @click="savePhoto(invitImg)">{{LANGUAGE_DATA['保存图片到相册'][LANGUAGE]}}</button>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 分享 -->
    <u-popup v-model="shareShow" mode="bottom" :mask-close-able="false" >
      <view class="shareProp">
        <view class="shareTop">
          <view class="everOne">
            <image src="/pagecenter/static/img/wxFirst.png" mode=""></image>
            <view class="">{{LANGUAGE_DATA['微信好友'][LANGUAGE]}}</view>
          </view>
          <view class="everOne">
            <image src="/pagecenter/static/img/wxQuan.png" mode=""></image>
            <view class="">{{LANGUAGE_DATA['朋友圈'][LANGUAGE]}}</view>
          </view>
        </view>
        <view class="cleanBtn" @click="shareShow = false">{{LANGUAGE_DATA['取消'][LANGUAGE]}}</view>
      </view>
    </u-popup>
  </view>
</template> 

<script>
  export default {
    data() {
      return {
        code: '',                                    // 邀请码
        invitImg: '',                                // 邀请二维码
        shareShow: false,                            // 分享弹窗
      };
    },
    onShow() {
      this.qrcodeMsg()
    },
    onShareAppMessage(res) {
      
    },
    methods: {
      qrcodeMsg() {
        this.$api.get(global.apiUrls.getRiderMsg, {}).then(res => {
          if (res.data.code == 1) {
            this.code = res.data.data.invite_code
            this.invitImg = res.data.data.register_url
          }
        })
      },
      
      /**
       * 保存图片到相册
       */
      savePhoto(images){
        let that = this
        uni.saveImageToPhotosAlbum({
          filePath: images,
          success: function() {
            console.log('保存图片成功');  
            uni.showToast({
                title: `${that.LANGUAGE_DATA['保存图片成功'][that.LANGUAGE]}`,
                duration: 2000
            });
          }
        });
      }
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
