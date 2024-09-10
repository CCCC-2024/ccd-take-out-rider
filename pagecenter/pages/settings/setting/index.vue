<template>
  <view class="page-wapper">
    <view class="lists">
      <view class="item" @tap="handleJump" data-url="/pagecenter/pages/settings/modify-password-verify-phone/index?type=2">
        <view class="content">
          <view class="title">{{LANGUAGE_DATA['修改密码'][LANGUAGE]}}</view>
          <text class="iconfont">&#xe666;</text>
        </view>
      </view>
      <view class="item" v-if="userInfor.pay_password != ''" @tap="handleJump" data-url="/pagecenter/pages/settings/modify-password-verify-phone/index?type=1">
        <view class="content">
          <view class="title">{{LANGUAGE_DATA['修改提现密码'][LANGUAGE]}}</view>
          <text class="iconfont">&#xe666;</text>
        </view>
      </view>
      <view class="item" @tap="handleJump" :data-url="`/pagecenter/pages/settings/modify-password-verify-phone/index?type=3`">
        
        <view class="content">
          <view class="title">{{LANGUAGE_DATA['修改绑定手机号'][LANGUAGE]}}</view>
          <text class="iconfont">&#xe666;</text>
        </view>
      </view>
      <!-- #ifndef MP-WEIXIN -->
      <view class="item" @tap="handleJump" data-url="/pagecenter/pages/login/agreement/index?id=5">
        <view class="content">
          <view class="title">{{LANGUAGE_DATA['隐私政策'][LANGUAGE]}}</view>
          <text class="iconfont">&#xe666;</text>
        </view>
      </view>
      <!-- #endif -->
      <view class="item" @tap="handleJump" data-url="/pagecenter/pages/login/agreement/index?id=2">
        <view class="content">
          <view class="title">{{LANGUAGE_DATA['用户注册协议'][LANGUAGE]}}</view>
          <text class="iconfont">&#xe666;</text>
        </view>
      </view>
      
      <view style="height: 20upx; background-color: #f6f6f6"></view>
      <view class="item">
        <view class="content no-bottom-line" @tap="handleClearCache">
          <view class="title">{{LANGUAGE_DATA['清除缓存'][LANGUAGE]}}</view>
          <text class="txt">{{storageSize}}M</text>
        </view>
      </view>
      <view class="item">
        <view class="content" @tap="handleUpdateAPP">
          <view class="title">{{LANGUAGE_DATA['当前版本'][LANGUAGE]}}</view>
          <text class="txt">V{{version}}</text>
        </view>
      </view>
      <view class="item" >
        <view class="content" @tap="canceAccount">
          <view class="title">注销账号</view>
        </view>
      </view>
    </view>
    
    <view class="login-out-btn"  @tap="handleLoginOut">{{LANGUAGE_DATA['退出登录'][LANGUAGE]}}</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfor: {
        pay_password: ''
      },
      storageSize: '',
      version: ''          ,// 手机版本
      
    };
  },
  onLoad() {
    let storageSize = uni.getStorageSync('STORAGE_SIZE') || 1.2;
    this.storageSize = (storageSize * 1 > 30 ? storageSize * 1 : storageSize * 1 + Math.random() * 2).toFixed(2)
    uni.setStorageSync('STORAGE_SIZE', this.storageSize)
  
    this.version = global.VERSION_CODE
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, (inf) => {
      this.version = inf.version;
    });
    // #endif
    
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['设置'][this.LANGUAGE]}` 
    });
    
    this.getUsers()
  },
  onShow(){
    
  },
  methods: {
    handleUpdateAPP(){
      let _this = this;
      plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
        this.$api.post(global.apiUrls.publicUpdateAPP, { version: widgetInfo.version, type: 1 }).then(res => {
          console.log('----------------',res)
          if(res.data.code == 1 && res.data.data.is_new == 1){
            plus.nativeUI.toast('检测到新版本'+res.data.data.version_name+'，后台更新中...');
            let wgtUrl = res.data.data.version_url;
            let apkUrl = res.data.data.version_apk_url || '';
            uni.downloadFile({
              url: wgtUrl,
              success: (downloadResult) => {
                if (downloadResult.statusCode === 200) {
                  plus.runtime.install(downloadResult.tempFilePath, { force: false }, function() {
                    plus.runtime.restart();
                  }, function(e) {
                    if (plus.os.name == 'Android' && apkUrl) {
                      uni.downloadFile({
                        url: apkUrl,
                        success: (downloadResult) => {
                          if (downloadResult.statusCode === 200) {
                            plus.runtime.install(downloadResult.tempFilePath);
                          }
                        }
                      });
                    }
                  });
                } else if (downloadResult.statusCode === 400) {
                  if (plus.os.name == 'Android' && apkUrl) {
                    uni.downloadFile({
                      url: apkUrl,
                      success: (downloadResult) => {
                        if (downloadResult.statusCode === 200) {
                          plus.runtime.install(downloadResult.tempFilePath);
                        }
                      }
                    });
                  }
                }
              }
            });
          }else{
            this.$message.info('已经是最新版本')
          }
        })
      });
    },
    
    // 获取数据
    getUsers(){
      this.$api.get(global.apiUrls.getRiderMsg, {
      }).then(res => {
        console.log('143-----',res)
        if(res.data.code == 1){
          this.userInfor = res.data.data
        }else{
          
        }
      })
    },
    
    // 退出登录
    handleLoginOut() {
      let that = this
      uni.showModal({
        title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
        content: `${that.LANGUAGE_DATA['您确定要退出登录吗?'][that.LANGUAGE]}`,
        cancelText:`${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
        confirmText:`${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
        success(res) {
          if (res.confirm) {
            uni.$emit('appLoginOut', { msg: `${that.LANGUAGE_DATA['用户退出登录了'][that.LANGUAGE]}` })
            global.token = '';
            global.userInfo = null;
            uni.removeStorageSync('USER_TOKEN') 
            uni.removeStorageSync('USER_INFO')
            setTimeout(()=>{
              uni.reLaunch({
                url: '/pagecenter/pages/login/login/index'
              });
            }, 300)
          }
        }
      });
    },

    handleClearCache() { //清除缓存
      let that = this
      uni.showModal({
        title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
        content: `${that.LANGUAGE_DATA['您确定要清除缓存吗?'][that.LANGUAGE]}`,
        cancelText:`${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
        confirmText:`${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
        success(res) {
          console.log('-----------',res)
          if (res.confirm) {
            that.storageSize = 0
            uni.setStorageSync('STORAGE_SIZE', 0)
          }
        }
      });
    },
    
    /**
     * 注销账号
     */
    canceAccount(){
      let that = this
      uni.showModal({
        title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
        content: '您确定要注销当前账号吗?',
        cancelText:`${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
        confirmText:`${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
        success(res) {
          if (res.confirm) {
            this.$api.get(global.apiUrls.cancellation).then(res => {
              console.log(res)
              this.$message.info(res.data.msg)
              if(res.data.code == 1){
                setTimeout(()=>{
                  uni.reLaunch({
                    url: '/pagecenter/pages/login/login/index'
                  });
                }, 300)
              }else{
                
              }
            })
          }
        }
      });
    }
  },
};

</script>

<style lang="scss">
@import './index.scss';
</style>
