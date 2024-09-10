<template>
  <view class="page-wapper">
    <view class="pageRow lineStyle" @click="show = true">
      <view class="">延时时长</view>
      <view class="rowRight">
        <input type="text" value="" placeholder="请选择" disabled="disabled" v-model="timeShow" />
        <u-icon name="arrow-right" color="#999999" size="28"></u-icon>
      </view>
    </view>
    <view class="lapse">
      <view class="lapseTitle">延时原因</view>
      <textarea value="" placeholder="请详细描述延时原因，审核更快！" v-model="reasons" />
    </view>
    <view class="">
      <view class="upimgBox">
        <view class="showImg " v-for="(item,index) in images" :key="index">
          <image :src="item.path" mode="aspectFill" class="imgs"></image>
          <u-icon name="close-circle-fill" color="#FD0D1B" size="32" class="closeImg" @click="handleDeleteImageItem(index)"></u-icon>
        </view>
        <image src="/pagecenter/static/img/add_img.png" mode="" v-if="images.length < 6" class="upImg" @tap="handleUploadImage"></image>
      </view>
      <view class="uplodTip">请上传图片图，最多上传6张</view>
    </view>
    <view class="Submit" @click="submitCli">提交</view>
    
    <u-select v-model="show" :list="list" @confirm="choseOver"></u-select>
  </view>
</template>

<script>
import { UploadImg } from '@/common/utils/index'
export default {
  data() {
    return {
      images: [],
      count: 6,
      show: false,
      list: [
        {
          value: '10',
          label: '10分钟'
        },
        {
          value: '20',
          label: '20分钟'
        },
        {
          value: '30',
          label: '30分钟'
        },
        {
          value: '40',
          label: '40分钟'
        }
      ],
      timeShow: '',                                          // 选择的时间(页面展示的)
      timeNum: '',                                           // 选择的时间(传给后台的)
      reasons: '',                                           // 延时原因
      order_sn: '',                                          // 订单号
    }
  },
  onLoad(option){
    this.order_sn = option.order
  },
  methods: {
    /**
     * 删除反馈图片
     */ 
    handleDeleteImageItem(index){
      this.images.splice(index,1)
    },
    
    /**
     * 上传反馈图片
     */ 
    handleUploadImage(){
      let self = this
      if(this.flag){
        return false
      }
      this.flag = true
      uni.chooseImage({
        count: this.count - this.images.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: function(res) {
          const tempFilePaths = res.tempFilePaths;
          new UploadImg(tempFilePaths, {
            complete: function(res) {
              self.flag = false
              self.images.push(...res);
            }
          })
        }
      });
    },
    
    /**
     * 选择时间
     */
    choseOver(e){
      console.log(e)
      this.timeShow = e[0].label
      this.timeNum = e[0].value
    },
    
    /**
     * 提交延时
     */
    submitCli(){
      if(this.timeNum == '') return this.$message.info('请选择延时时长') 
      if(this.reasons == '') return this.$message.info('请选择延时原因') 
      
      let photo = []
      this.images.map(res =>{
        photo.push(res.path)
      })
      
      if(this.flag){
        return false
      }
      this.flag=true
      uni.showLoading();
      
      this.$api.post(global.apiUrls.delay,{
        order_sn: this.order_sn,
        apply_time: this.timeNum,
        content: this.reasons,
        images: photo.toString()
      }).then(res=>{
        console.log(res)
        uni.hideLoading();
        this.$message.info(res.data.msg) 
        if(res.data.code == 1){
          this.flag=false
          uni.$emit('notice')
          uni.$emit('succ')
          setTimeout(function(){
            uni.navigateBack({})
          },400)
        }else{
          this.flag=false
        }
      }).catch(err => {
        
      })
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

