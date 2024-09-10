<template>
  <view class="page-wapper">
    <view class="content-wapper">
      <view class="warp-info">
        <view class="titles">{{detail.title}}</view>
        <view class="time">{{detail.create_time}}</view>
        <view class="content">
          <rich-text :nodes="detail.content"></rich-text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      detail: null,
      id: ''
    }
  },
  onLoad(options) {
    this.id = options.id
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['消息详情'][this.LANGUAGE]}`
    });
    this.getMsg()
  },
  methods: {
    getMsg(){
      uni.showLoading();
      this.$api.get(global.apiUrls.systemMessageDetail, {
        message_id: this.id
      }).then(res => {
        uni.hideLoading();
        if(res.data.code == 1){
          this.detail = res.data.data;
        }else{
          
        }
      })
    }
  },
};

</script>

<style lang="scss">
@import './index.scss';
</style>
