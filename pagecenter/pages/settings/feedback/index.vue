<template>
	<view class="page-wapper">
		<view class="warp">
			<view class="feedback">
				<view class="feedback-title">
          <!-- <view class="line"></view> -->
          <view class="">{{LANGUAGE_DATA['反馈类型'][LANGUAGE]}}</view>
        </view>
				<view class="feedback-reason">
					<view v-for="(item, index) in reasonList" :key="index" class="reason-item" :class="reasonListIndex == index ? 'active' : ''" @click="handleChooseFeedbackType(index)">
						{{ item.content || '其他' }}
					</view>
				</view>
			</view>
			<view class="feedback-content">
				<view class="feedback-title">
          <!-- <view class="line"></view> -->
          <view class="">{{LANGUAGE_DATA['反馈内容'][LANGUAGE]}}</view>
        </view>
        <view class="content">
          <textarea v-model="content" class="row-textarea" value="" :placeholder="LANGUAGE_DATA['问题描述的越详细.有助于我们更快的解决问题'][LANGUAGE]" placeholder-style="color:#bfbfbf;"></textarea>
          <view class="files-pic">
          	<view class="img-item" v-for="(item,index) in images" :key="index">
              <u-icon name="close-circle-fill" color="#e33b2d" size="36" class="tb_" @click="handleDeleteImageItem(index)"></u-icon>
              <image :src="item.path|assembleImgSrc" mode="aspectFill"></image>  
            </view>
            <view class="img-item" v-if="images.length < 6">
              <image @tap="handleUploadImage" src="/pagecenter/static/img/add_img.png" mode="aspectFill"></image>
            </view>
          </view>
          <view class="uploadText">{{LANGUAGE_DATA['请上传应用截图，最多上传6张'][LANGUAGE]}}</view>
        </view>
			</view>
		</view>
		<view class="feedback-contact">
			<view class="feedback-title">
        <!-- <view class="line"></view> -->
        <view>{{LANGUAGE_DATA['请留下您的联系方式'][LANGUAGE]}}</view>
      </view>
			<view class="feedback-form-row">
				<view class="feedback-form-item">
					<input type="text" value="" v-model="contact" :placeholder="LANGUAGE_DATA['手机号/邮箱/QQ号'][LANGUAGE]" style="width: 600rpx;" maxlength="35" />
				</view>
			</view>
		</view>
    <button type="primary" class="sub" :loading="submitBtnLoading" @click="handleSubmit">{{LANGUAGE_DATA['提交'][LANGUAGE]}}</button>
	</view>
</template>

<script>
const reasonList = [
	{ id: 1, content: '下载/加载问题' },
	{ id: 2, content: '会员付费问题' },
	{ id: 3, content: '图片问题' },
	{ id: 4, content: 'APP体验问题' }
];

import { UploadImg } from '@/common/utils/index'
import { validate } from '@/common/utils/index'

export default {
	data() {
		return {
			reasonListIndex: 0, //选中类型的下标
			reasonList: [
        { id: 1, content: '下载/加载问题' },
        { id: 2, content: '会员付费问题' },
        { id: 3, content: '图片问题' },
        { id: 4, content: 'APP体验问题' }
      ], //反馈类型列表
      content: '',
      contact: '',
			count: 6,	//最多可以选择的图片张数
      images: [],
      submitBtnLoading: false
		};
	},
	onLoad() {
    uni.setNavigationBarTitle({
      title: `${this.LANGUAGE_DATA['我要反馈'][this.LANGUAGE]}`
    });
    
    // #ifdef APP-PLUS
    this.$mp.page.$getAppWebview().setTitleNViewButtonStyle(0, {
      text: `${this.LANGUAGE_DATA['反馈记录'][this.LANGUAGE]}`,
    });
    // #endif
    
    this.gettype()
  },
	methods: {
    gettype(){
      this.$api.get(global.apiUrls.feedbackType).then(res=>{
        if(res.data.code == 1){
          this.reasonList = res.data.data.map(item=>({
            id: item.id,
            content: item.title
          }))
        }else{
          this.$message.info(res.data.msg);
        }
      })
    },
    
    // 删除反馈图片
    handleDeleteImageItem(index){
      this.images.splice(index,1)
    },

    // 上传反馈图片
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

    // 选择反馈类型
    handleChooseFeedbackType(index){
      this.reasonListIndex = index;
    },

    // 提交
    handleSubmit(){
      if(this.submitBtnLoading) return false;
      let { content, contact, images } = this;
      if(!validate(content,'require')) return this.$message.info(`${this.LANGUAGE_DATA['请输入反馈内容'][this.LANGUAGE]}`);
      if(!validate(contact,'require')) return this.$message.info(`${this.LANGUAGE_DATA['请输入手机号/邮箱/QQ号'][this.LANGUAGE]}`); 

      this.submitBtnLoading = true;
      this.$api.post(global.apiUrls.tickling,{
        type: this.reasonList[this.reasonListIndex].content,
        thumb: images.length == 0 ? '' : images.map(item=>item.path).join(','),
        body: content,
        contact: contact
      }).then(res=>{
        this.$message.info(res.data.msg);
        if(res.data.code == 1){
          setTimeout(()=>{
            this.submitBtnLoading = false;
            uni.navigateBack();
          }, 300)
        }
      }).catch(err => {
        this.submitBtnLoading = false;
        this.$message.info('提交失败');
      })
    }
	},
  onNavigationBarButtonTap() {
    uni.navigateTo({
      url: '/pagecenter/pages/settings/my-feedback/index'
    })
  }
};
</script>

<style lang="scss">
@import './index.scss';
</style>
