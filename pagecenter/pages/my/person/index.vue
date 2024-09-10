<template>
  <view class="page-wapper">
    <view class="page-box">
      <text class="boxLeft">{{LANGUAGE_DATA['头像'][LANGUAGE]}}</text>
      <image :src="images" mode="aspectFill" @tap="handleChooseImage"></image>
    </view>
    <view class="page-box">
      <text class="boxLeft">{{LANGUAGE_DATA['姓名'][LANGUAGE]}}</text>
      <input type="text" value="" v-model="nick_name" :placeholder="LANGUAGE_DATA['姓名'][LANGUAGE]" maxlength="12" disabled="disabled"/>
    </view>
    <view class="page-box">
      <text class="boxLeft">{{LANGUAGE_DATA['性别'][LANGUAGE]}}</text>
      <input type="text" value="" v-model="sexName" :placeholder="LANGUAGE_DATA['性别'][LANGUAGE]" disabled="disabled" />
    </view>
    <view class="page-box">
      <text class="boxLeft">{{LANGUAGE_DATA['出生年月'][LANGUAGE]}}</text>
      <input type="text" value="" v-model="birthday" :placeholder="LANGUAGE_DATA['出生年月'][LANGUAGE]" disabled="disabled" />
    </view>
    <view class="page-box">
      <text class="boxLeft">{{LANGUAGE_DATA['地区'][LANGUAGE]}}</text>
      <input type="text" value="" v-model="area" :placeholder="LANGUAGE_DATA['地区'][LANGUAGE]" disabled="disabled" />
    </view>
    <!-- <view class="save_btn" @click="saveMsg">{{LANGUAGE_DATA['保存'][LANGUAGE]}}</view> -->
  </view>
</template>

<script>
import { validate, UploadImg } from '@/common/utils/index';
export default {
  data() {
    return {
      images: '',
      nick_name: '',
      sexName: '',
      birthday: '',   
      area: '',
      userInfor: '',                                   // 用户个人资料信息
    }
  },

  onLoad(option){
    // this.images = option.head
    // this.nick_name = option.name
    
    uni.setNavigationBarTitle({
      title: `${this.LANGUAGE_DATA['个人资料'][this.LANGUAGE]}`
    });
    
    this.getUserMsg()
  },
  methods: {
    /**
     * 获取个人资料
     */
    getUserMsg(){
      this.$api.get(global.apiUrls.getRiderMsg, {
      }).then(res => {
        if(res.data.code == 1){
          this.nick_name = res.data.data.user_nickname
          this.sexName = res.data.data.sex == 1 ? '男' : res.data.data.sex == 2 ? '女' : '保密'
          this.birthday = res.data.data.birthday
          this.area = res.data.data.province + '-' + res.data.data.city
          this.images = res.data.data.head_img
        }else{
          
        }
      })
    },
    
    /**
     * 上传图片
     */
    handleChooseImage(){
      let self = this
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: function(res) {
          console.log(res.tempFilePaths)
          const tempFilePaths = res.tempFilePaths;
          new UploadImg(tempFilePaths, {
            complete: function(res) {
              console.log(res)
              self.images = res[0].path;
              self.saveMsg()
            }
          })
        }
      });
    },
    // 保存信息
    saveMsg(){
      this.$api.get(global.apiUrls.saveMaterial, {
        head_img: this.images
      }).then(res => {
        this.$message.info(res.data.msg);
        if(res.data.code == 1){
          uni.$emit('changeMsg');
          setTimeout(function(){
            uni.navigateBack({})
          },1000)
        }else{
          
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

