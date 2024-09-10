<template>
  <view class="zhi_binding">
    <view class="content">
      <view class="updata ident">
        <view class="updata_text">第一步：先获取手机验证码</view>
        <view class="bindTip">绑定的用户手机{{mobiles.substring(0, 3)+"****"+mobiles.substr(mobiles.length-4)}}</view>
        <view class="verific">
          <view class="verific-left">
            <text>验证码</text>
            <input type="text" value="" placeholder="请输入验证码" v-model="vercode" @blur="verificationCode" />
          </view>
          <view class="verific-right" @click="handleSendVerCode">{{ beginning ? time + "s后重新获取" : "获取验证码"}}</view>
        </view>
        <view class="failTips" v-if="isFill">验证码错误</view>
      </view>
      <view class="updata ident">
        <view class="updata_text">第二步：上传微信收款二维码</view>
        <view class="files-pic">
          <view class="img-item">
            <image v-if="images.path != ''" :src="images.path" mode="aspectFill" @tap="handleUploadImage"></image>
            <image v-if="images.path == ''" src="/static/img/payUplod.png" mode="aspectFill" @tap="handleUploadImage">
            </image>
          </view>
        </view>
        <view class="tip">上传二维码</view>
      </view>
      
      <view class="inp_ ident">
        <view class="updata_text">第三步：填写微信真实姓名</view>
        <view class="nameMsg">
          <view>真实姓名</view>
          <input type="text" placeholder="请输入真实姓名" v-model="nickname">
        </view>
      </view>
    </view>
    <view class="sure" @click="addWx()">提交</view>
  </view>
</template>
<script>
  const { handleJump } = global
  import { UploadImg } from '@/common/utils/index'
  import { validate } from '@/common/utils/index'
  export default {
    data() {
      return {
        images: { //上传图片
          id: '',
          path: ''
        },
        submitBtnLoading: false,
        title: '', //绑定或者修改微信账号
        account_num: '', //微信账号
        nickname: '', //微信昵称
        accountId: '',
        mobiles: '',                    // 联系方式
        vercode: "",
        
        beginning: false,
        timer: null,                    // 计时器,@Function
        verCodeBtnLoading: false,
        is_click: false,
        time: 60,
        isFill: false
      }
    },
    onLoad(options) {
      if (options.id) {
        this.accountId = options.id;
        this.title = '修改微信';
        
      } else {
        this.title = '绑定微信';
      }
      uni.setNavigationBarTitle({
        title: this.title
      });
      // console.log(options.id)
      this.mobiles = options.mobile
      this.getZhiInfor();
    },
    onShow() {},
    methods: {
      // 删除反馈图片
      // handleDeleteImageItem(index){
      //     this.images.splice(index,1)
      // },

      // 上传反馈图片
      handleUploadImage() {
        let self = this
        uni.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          success: function(res) {
            const tempFilePaths = res.tempFilePaths;
            new UploadImg (tempFilePaths, {
              complete: function(res) {
                console.log(res[0]);
                self.images = res[0];
              }
            })
          }
        });
      },
      
      /**
       * 校验验证码 
       */
      verificationCode(){
        if(this.vercode == '') return this.$message.info('请输入验证码');
        
        if(this.vercode != ''){
          this.$api.post(global.apiUrls.checkCode, {
            mobile: this.mobiles,
            code: this.vercode,
            type: 3
          }).then(res => {
            console.log(res.data)
            if (res.data.code == 1) {
              this.isFill = false
            } else {
              this.isFill = true
              // this.$message.info(res.data.msg);
            }
          })
        }
      },

      //绑定，修改微信
      addWx() {
        let that = this
        if(this.vercode == '') return this.$message.info('请输入验证码');
        setTimeout(function(){
          if(that.isFill) return that.$message.info('请输入正确的验证码');
          if (that.nickname == '' || that.images.path == '') {
            that.$message.info('请输入完整信息');
            return;
          }
          that.$api.post(global.apiUrls.bindAccount, {
            account_type: '1',
            true_name: that.nickname,
            is_default: 0,
            qrcode: that.images.path,
          }).then(res => {
            console.log(res.data)
            that.$message.info(res.data.msg);
            if (res.data.code == 1) {
              uni.$emit('bindSucces')
              setTimeout(() => {
                uni.navigateBack();
              }, 500)
            } else {
            }
          })
        },800)
      },

      
      /**
       * 获取验证码
       */
      handleSendVerCode(){
        let _this = this
        let { mobiles } = this;
        
        // 验证手机号strat
        if (!mobiles) {
          this.$message.info("请输入手机号");
          return false;
        }
        if (!validate(mobiles, "phone")) {
          this.$message.info("请正确输入手机号");
          return false;
        }
        // 验证手机号 end
        
        // 如果有倒计时，return false
        if (this.beginning) return false;
        
        this.verCodeBtnLoading = true; // 显示加载状态
        this.beginning = true; // 显示倒计时
        
        this.$api.post(global.apiUrls.aliSend, {
          is_test: global.IS_DEV,
          mobile: mobiles,
          type: "3",
        }).then((res) => {
          // 改加载状态为false
          _this.verCodeBtnLoading = false;
          // 如果后台返回的code码为1
          if (res.data.code == 1) {
            console.log(res.data.data)
            // 清除倒计时,防抖作用
            clearInterval(_this.timer);
            _this.timer = setInterval(() => {
              if (_this.time == 1) {
                //倒计时结束就清楚这个倒计时
                clearInterval(_this.timer);
                _this.time = 60; // 倒计时60s
                _this.beginning = false; // 是否显示倒计时改为false
                return;
              }
              _this.time--;
            }, 1000);
            // 向用户发送提示
            if(global.IS_DEV ==1){
              _this.$message.info('验证码为' + res.data.data.code + '请注意查收');
            }else{
              _this.$message.info('验证码已发送，请注意接收')
            }
          } else {
            // 如果报错，向用户提示
            _this.$message.info(res.data.msg);
          }
        }).catch(function(err) {
          // 接口错误打印错误
          console.log(err);
        });
      },
      
      /**
       * 获取微信账号信息
       */
      getZhiInfor() {
        this.$api.get(global.apiUrls.storeWithdrawCheck, {
          account_type: 1
        }).then(res => {
          if (res.data.code == 1) {
            if(res.data.data != ''){
              this.nickname = res.data.data.true_name;
              this.images.path = res.data.data.qrcode;
            }
          } else {
            // this.$message.info(res.data.msg);
          }
          console.log(res.data)
        })
      },
    }
  }
</script>
<style lang="scss">
  page {
    background-color: #FFFFFF;
  }

  .zhi_binding {
    .content {
      padding: 0 32upx;
      background-color: #fff;
      .ident{
        .updata_text {
          padding: 32upx 0;
          color: #333333;
          font-size: 28rpx;
          font-weight: 600;
        }
        .bindTip{
          font-size: 28rpx;
          color: #666666;
          // margin-top: 32rpx;
        }
        .verific{
          display: flex;
          flex-direction: row;   
          align-items: center;
          justify-content: space-between;
          color: #666666;
          margin-top: 32rpx;
          .verific-left{
            display: flex;
            flex-direction: row;   
            align-items: center;
            input{
              font-size: 28rpx;
              margin-left: 24rpx;
            }
          }
          .verific-right{
            font-size: 28rpx;
            color: #3B7AD5;
          }
        }
        .failTips{
          font-size: 22rpx;
          color: #3B7AD5;
          margin-top: 15rpx;
        }
      }
      .inp_ {
        padding: 32upx 0;
        position: relative;
        &:after {
          @include bottom-line(#eee)
        }
        .nameMsg{
          display: flex;
          flex-direction: row;   
          align-items: center;
          justify-content: space-between;
          text {
            font-size: 28upx;
            color: #333;
          }
          
          input {
            font-size: 28upx;
            color: #333;
            // text-align: right;
            width: 550upx;
          }
          
          input::-webkit-input-placeholder {
            font-size: 28upx;
            color: #BFBFBF;
          }
        }
      }

      .updata {
        padding-bottom: 32upx;
        border-bottom: 1upx solid #eee;

        .updata_text {
          padding: 32upx 0;
        }

        .files-pic {
          // padding: 30upx;
          display: flex;
          flex-wrap: wrap;

          .img-item {
            margin-right: 20upx;
            position: relative;

            text {
              display: block;
              position: absolute;
              right: -10upx;
              top: -10upx;
              width: 34upx;
              height: 34upx;
              border-radius: 50%;
              background: rgba(227, 59, 45, 1);
              font-size: 24upx;
              text-align: center;
              line-height: 34upx;
              color: #fff;
              z-index: 10;
            }
          }

          image {
            width: 156upx;
            height: 156upx;
            border-radius: 10upx;
          }
        }

        .tip {
          font-size: 20upx;
          margin-top: 16upx;
        }
      }
    }
  }

  .sure {
    position: fixed;
    left: 50%;
    margin-left: -343rpx;
    bottom: 40rpx;
    width: 686upx;
    height: 88upx;
    font-size: 32upx;
    color: #FEFEFE;
    text-align: center;
    line-height: 88upx;
    border-radius: 44upx;
    background: linear-gradient(to right, #29CAFD, #1CABF5);
  }
</style>
