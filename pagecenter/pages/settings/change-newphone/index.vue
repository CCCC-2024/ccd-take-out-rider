<template>
  <view class="page">
    <!-- <fu-custom :isBack="true" :isBottom="true" bgColor="bg-white">
			<view slot="content">绑定新手机</view>
		</fu-custom> -->
    <!-- 表单信息 start -->
    <view class="cu-form">
      <view class="cu-form-group solid-bottom ">
        <view class="title">新手机号码</view>
        <input type="number" v-model="mobile" maxlength="11"
          placeholder-class="placeholderClass" placeholder="请输入新的手机号" name="input" />
      </view>
      <view class="cu-form-group solid-bottom">
        <view class="title">短信验证</view>
        <input
          type="number"
          v-model="code"
          maxlength="4"
          placeholder-class="placeholderClass"
          placeholder=请输入验证码
          name="input"
        />
        <text class="code" @click="getCode">{{ getCodeText }}</text>
      </view>
    </view>
    <!-- 表单信息 end -->
    <!-- 提交按钮 start -->
    <view class="btn_cloce" @click="submit">完成</view>
    <!-- 提交按钮 end -->
    <fu-notwork></fu-notwork>
  </view>
</template>

<script>
/**
 * @author 刘畅
 */
// 表单验证插件
import { validate } from "@/common/utils/index.js";
export default {
  data() {
    return {
      mobile: "", // 手机号
      code: "", // 验证码
      getCodeText: "获取短信验证", // 获取验证码按钮文字
      getCodeisWaiting: false, // 获取验证码按钮状态
      code_id: 0, // 是否
      change: 0, //
      isChange: 2, // 默认是2  1代表从完善个人信息跳转过来修改手机号
    };
  },
  computed: {
    // 是否登录状态
    isLogin() {
      return this.$store.getters.isLogin;
    },
  },
  onLoad(options) {
    // console.log(options);
    this.isChange = options.isChange;
    var user = uni.getStorageSync("USERINFO");
    if (user.id > 0) {
      this.islogin = 1;
    }
  },
  onBackPress() {
    uni.hideKeyboard();
  },
  methods: {
    /**
     * @event 点击获取验证码
     * @description 获取验证码
     * @property {Number} user_id - 用户id
     * @property {String} is_test - 是否是测试环境
     * @property {String} mobile - 手机号
     * @property {String} type - 请求类型 1=注册(未注册手机号),2=忘记密码(已经注册的手机号),3=短信登录,4修改手几号
     */
    getCode() {
      uni.hideKeyboard();
      if (this.getCodeisWaiting) return;
      if (!validate(this.mobile, "phone")) {
        this.$message.info(
          !this.mobile ? "请输入手机号" : "请填写正确手机号码"
        );
        return false;
      }
      this.getCodeisWaiting = true;
      let user_id = uni.getStorageSync("USER_INFO").id;
      this.$api.post(global.apiUrls.aliSend, {
        is_test: global.IS_DEV,
        mobile: this.mobile,
        type: "5",
        user_id: user_id,
      }).then((res) => {
        var res = res.data;
        if (res.code == 1) {
          this.code_id = 1;
          if(global.IS_DEV ==1){
            this.$message.info("验证码为" + res.data.code + "请注意查收");
          }else{
            this.$message.info('验证码已发送，请注意接收')
          }
          this.setTimer();
        } else {
          this.$message.info(res.msg);
          this.getCodeText = "获取短信验证码";
          this.getCodeisWaiting = false;
        }
      });
    },
    /**
     * @function 验证码的倒计时
     * @property {Number} holdTime - 倒计时时间
     */
    setTimer() {
      clearInterval(this.Timer);
      let holdTime = 60;
      this.getCodeText = "重新获取(60)";
      this.Timer = setInterval(() => {
        if (holdTime <= 0) {
          this.getCodeisWaiting = false;
          this.getCodeText = "获取短信验证码";
          clearInterval(this.Timer);
          return;
        }
        this.getCodeText = "重新获取" + '(' + holdTime + ")";
        holdTime--;
      }, 1000);
    },
    /**
     * @event 点击确认按钮
     * @description 提交信息
     * @property {Object} data - 请求接口时携带的信息
     */
    submit() {
      var type = this.change;
      if (!this.mobile) {
        this.$message.info("请输入新手机号");
        return false;
      }
      if (!validate(this.mobile, "phone")) {
        this.$message.info(
          !this.mobile ? "请正确输入手机号" : "请填写正确手机号码"
        );
        return false;
      }
      if (!this.code_id) {
        this.$message.info("请先获取验证码");
        return false;
      }
      if (!this.code) {
        this.$message.info("请输入验证码");
        return false;
      }

      let data = {
        mobile: this.mobile,
        code: this.code,
        step: 2
      };
      this.$api.post(global.apiUrls.nextBangding, data).then((res) => {
        var res = res.data;
        this.$message.info(res.msg);
        if (res.code == 1) {
          setTimeout(() => {
            // this.$store.commit("logout");
            // this.$store.dispatch("getCartList");
            uni.setStorageSync('USER_TOKEN','');
            // #ifdef H5 || APP-PLUS
            uni.reLaunch({
              url: '/pagecenter/pages/login/login/index'
            });
            // #endif
            
            // #ifdef MP-WEIXIN
            uni.reLaunch({
              url: '/pages/user/login/wx_login/wx_login'
            });
            // #endif
          }, 300);
        }
      });
    },
  },
};
</script>

<style lang="scss">
  .page{
    background: #fff;
    min-height: 100vh;
    box-sizing: border-box;
  }
  .cu-form{
    padding: 0 32rpx;

  }
// form标题长度 start
.cu-form-group .title {
  min-width: calc(5em + 15px);
  padding-right: 32rpx;
}
.cu-form-group{
  min-height: 110rpx;
  padding: 0;
}
.cu-form-group+.cu-form-group{
  border-top:0;
}
// form标题长度 end
// input placeholder 样式 start
.placeholderClass {
  font-size: 32rpx;
  color: #bfbfbf;
}

// 发送验证码 start
.code {
  font-size: 32rpx;
  color: #3B9DFF;
}

// 发送验证码 end
// input placeholder 样式 end
// 提交按钮 start
.btn_cloce {
  margin: 80rpx 32rpx 0;
  height: 88rpx;
  background: linear-gradient(to right,#29CAFD,#1CABF5);
  border-radius: 88rpx;
  font-size: 32rpx;
  line-height: 88rpx;
  text-align: center;
  color: #ffffff;
}

// 提交按钮 end
</style>
