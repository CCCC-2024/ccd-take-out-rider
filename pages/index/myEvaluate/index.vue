<template>
  <view class="page-wapper">
    <view class="scoreEver">
      <text>{{LANGUAGE_DATA['总体评分'][LANGUAGE]}}：</text>
      <u-rate active-color="#FFD437" inactive-color="#BFBFBF" gutter="20" inactive-icon="star-fill" size="38" :disabled="true" current="5" v-model="msgContent.user_star"></u-rate>
    </view>
    <view class="scoreEver">
      <text>{{LANGUAGE_DATA['礼貌评分'][LANGUAGE]}}：</text>
      <u-rate active-color="#FFD437" inactive-color="#BFBFBF" gutter="20" inactive-icon="star-fill" size="38" :disabled="true" current="5" v-model="msgContent.user_politeness_star"></u-rate>
    </view>
    <view class="scoreEver">
      <text>{{LANGUAGE_DATA['沟通评分'][LANGUAGE]}}：</text>
      <u-rate active-color="#FFD437" inactive-color="#BFBFBF" gutter="20" inactive-icon="star-fill" size="38" :disabled="true" current="5" v-model="msgContent.user_speak_star"></u-rate>
    </view>
    <view class="evalTil">{{LANGUAGE_DATA['评价说明'][LANGUAGE]}}</view>
    <view class="evalCont">{{msgContent.content}}</view>
    <view class="imgBox">
      <image :src="item" mode="aspectFill" v-for="(item,index) in msgContent.thumb" :key="index" class="images" @click="previewImg(msgContent.thumb,index)"></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderSn: '',
      type: '',
      msgContent: '',                         // 评价内容
    }
  },
  onLoad(option){
    this.orderSn = option.orderSn
    this.type = option.type
    
    this.getEval()
  },
  methods: {
    getEval(){
      this.$api.post(global.apiUrls.myEvaluat,{
        order_sn: this.orderSn,
        order_type: this.type
      }).then(res=>{
        console.log(res)
        if(res.data.code == 1){
          this.msgContent = res.data.data
        }else{
          this.$message.info(res.data.msg) 
        }
      }).catch(err => {
        
      })
    },
    
    /**
     * 预览图片
     */
    previewImg(images,index){
      uni.previewImage({
          urls: images,
          current: index
      });
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

