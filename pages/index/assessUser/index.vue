<template>
  <view class="page-wapper">
    <view class="scoreEver">
      <text>{{LANGUAGE_DATA['总体评分'][LANGUAGE]}}：</text>
      <u-rate active-color="#FFD437" inactive-color="#BFBFBF" gutter="20" inactive-icon="star-fill" size="38" current="5" v-model="totalStar"></u-rate>
    </view>
    <view class="scoreEver">
      <text>{{LANGUAGE_DATA['礼貌评分'][LANGUAGE]}}：</text>
      <u-rate active-color="#FFD437" inactive-color="#BFBFBF" gutter="20" inactive-icon="star-fill" size="38" current="5" v-model="courtStar"></u-rate>
    </view>
    <view class="scoreEver">
      <text>{{LANGUAGE_DATA['沟通评分'][LANGUAGE]}}：</text>
      <u-rate active-color="#FFD437" inactive-color="#BFBFBF" gutter="20" inactive-icon="star-fill" size="38" current="5" v-model="linkStar"></u-rate>
    </view>
    <textarea value="" :placeholder="LANGUAGE_DATA['描述您的送餐感受，或其他情况说明'][LANGUAGE]" class="illustrate" v-model="illustration" />
    <view class="uplodBox">
      <view class="exhibImg" v-for="(item,index) in commtArry" :key="index" >
        <image :src="item.path" mode="aspectFill" class="photo"></image>
        <u-icon name="close-circle-fill" color="#FF3434" size="44" class="closeIcon" @click="handleDeleteImageItem(index)"></u-icon>
      </view>
      <image src="/static/img/uplodImg.png" mode="" class="upImg" @tap="handleUploadImage" v-if="commtArry.length < 6"></image>
    </view>
  </view>
</template>

<script>
import { UploadImg } from '@/common/utils/index'
export default {
  data() {
    return {
      count: 6,                              // 最多上传图片的数量
      commtArry: [],                         // 图片
      
      totalStar: 5,                          // 总体评分
      courtStar: 5,                          // 礼貌评分
      linkStar: 5,                           // 沟通评分
      illustration: '',                      // 说明
      orderSn: '',                           // 订单号
      type: '',                              // 0 跑腿订单 1 外卖订单
    }
  },
  onLoad(option){
    this.orderSn = option.orderSn
    this.type = option.type
  },
  methods: {
    // 删除反馈图片
    handleDeleteImageItem(index){
      this.commtArry.splice(index,1)
    },
    
    // 上传反馈图片
    handleUploadImage(){
      let self = this
      uni.chooseImage({
        count: this.count - this.commtArry.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: function(res) {
          const tempFilePaths = res.tempFilePaths;
          new UploadImg(tempFilePaths, {
            complete: function(res) {
              console.log(res)
              self.commtArry.push(...res);
            }
          })
        }
      });
    },
  },
  
  /**
   * 提交  
   */
  onNavigationBarButtonTap(){
    console.log(this.totalStar,this.courtStar,this.linkStar)
    let photos = []
    this.commtArry.map(item =>{
      photos.push(item.path)
    })
    
    if(this.illustration == '') return this.$message.info(`${this.LANGUAGE_DATA['描述您的送餐感受，或其他情况说明'][this.LANGUAGE]}`)
    
    this.$api.post(global.apiUrls.appraise,{
      order_sn: this.orderSn,
      thumb: photos.toString(),
      content: this.illustration,
      user_star: this.totalStar,
      user_politeness_star: this.courtStar,
      user_speak_star: this.linkStar,
      order_type: this.type
    }).then(res=>{
      console.log(res)
      this.$message.info(res.data.msg)
      if(res.data.code == 1){
        uni.$emit('notice')
        uni.$emit('succ')
        setTimeout(function(){
          uni.navigateBack({})
        },500)
      }else{
         
      }
    }).catch(err => {
      
    })
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

