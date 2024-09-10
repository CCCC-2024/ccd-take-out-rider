<template>
	<view class="page-wapper">
    <view v-if="content">
      <rich-text :nodes="content"></rich-text>
      <!-- <fu-parse :content="content" @preview="preview" @navigate="navigate" /> -->
    </view>
    <button type="primary" v-if="id == 6" class="login-btn" @tap="handleDestroyUser">注销</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        id: '',
        content: ''
			};
		},
		onLoad(options) {
      this.id = options.id
      let title = ''
      if(options.id == 2){
        title = `${this.LANGUAGE_DATA['用户注册协议'][this.LANGUAGE]}`
      }else if(options.id == 5){
        title = `${this.LANGUAGE_DATA['隐私政策'][this.LANGUAGE]}`
      }else if(options.id == 8){
        title = `${this.LANGUAGE_DATA['提现协议'][this.LANGUAGE]}`
      }else if(options.id == 11){
        title = `${this.LANGUAGE_DATA['入驻协议'][this.LANGUAGE]}`
      }
      
      uni.setNavigationBarTitle({
        title: title
      });
      this.getMsg()
		},
    methods: {
      getMsg(){
        if(this.id == 2){
          this.$api.get(global.apiUrls.xieyi, {
            article_id: 3
          }).then(res=>{
            if(res.data.code == 1){
              this.content = res.data.data.content
            }
          })
        }else if(this.id == 5){
          this.$api.get(global.apiUrls.policy, {
            article_id: 6
          }).then(res=>{
            if(res.data.code == 1){
              this.content = res.data.data.content
            }
          })
        }else if(this.id == 8){
          this.$api.get(global.apiUrls.xieyi, {
            article_id: 8
          }).then(res=>{
            if(res.data.code == 1){
              this.content = res.data.data.content
            }
          })
        }else if(this.id == 11){
          this.$api.get(global.apiUrls.xieyi, {
            article_id: 11
          }).then(res=>{
            if(res.data.code == 1){
              this.content = res.data.data.content
            }
          })
        }
      },
      
      
      // handleDestroyUser(){
      //   global.customShowModalPopup({
      //     content: '您确定要注销用户吗？',
      //     success: res => {
      //       console.log(res);
      //       if(res.confirm){
      //         this.$api.post(global.apiUrls.destroyUserAccount).then(res=>{
      //           this.$message.info(res.data.msg)
      //           if(res.data.code == 1){
      //             uni.$emit('appLoginOut', { msg: '用户退出登录了' })
      //             global.token = '';
      //             global.userInfo = null;
      //             uni.removeStorageSync('USER_TOKEN')
      //             uni.removeStorageSync('USER_INFO')
      //             setTimeout(() => {
      //               uni.redirectTo({ url: '/pages/business/index/index' });
      //             }, 500)
      //           }
      //         }).catch(res => {
      //         })
      //       }
      //     }
      //   })
      // }
    }
	}
</script>

<style lang="scss">
  @import './index.scss';
</style>
