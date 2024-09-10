<template>
  <view>
    <!-- 步骤条 start -->
    <view class="change-pay-password">
      <view class="circle" :class="current >= 0 ? 'active' : ''">1</view>
      <view class="line"></view>
      <view class="circle" :class="current >= 1 ? 'active' : ''">2</view>
      <view class="line" v-if='check_pay_password' ></view>
      <view class="circle" :class="current >= 2 ? 'active' : ''" v-if='check_pay_password' >3</view>
    </view>
    <!-- 步骤条 end -->
    <!-- 验证支付密码 start -->
    <fu-payment-password
      ref="paymentPassword"
      :isPhone="isPhone"
      :mode="mode"
      @submit="submitHandle"
      @cancel="togglePayment"
      :text="LANGUAGE_DATA['支付密码为6位数字，用户提现、设置密保、添加银行卡等操作，可保障资金安全'][LANGUAGE]"
    />
    <!-- 验证支付密码 end -->

    <!-- 断网检测 start -->
    <fu-notwork></fu-notwork>
    <!-- 断网检测 end -->
  </view>
</template>

<script>
// @see - 引入支付密码组件 
import fuPaymentPassword from "../../../../components/sanshui-payment-password/index.vue";
import debounce from '@/common/function/debounce.js';
export default {
  components: {
    fuPaymentPassword,
  },
  data() {
    return {
      mode: 0, // {Number} 支付密码组件的类型
      check_pay_password: true, // {Boolean} 是否有支付密码
      pay_password: "", // {String} 原支付密码
      current: 0, // {Number} 步骤条当前步骤
      isCheck: true,
      isPhone:false, //是否手机辅助修改密码
      code:'',  //验证码号
      mobile:'',  //手机号码
    };
  },
  
  onLoad(options) {
    console.log(options)
    this.mode = 3;
    // this.showModal();
    // if(options.modle){
    //   this.check_pay_password = false
    //   this.mode = 3;
    //   this.showModal();
    // }

    // 检测是否设置支付密码
    // this.checkIfPayPwd();
    let _this = this;
    // 监听updateCurrent事件,用户当前输入完之后更新步骤条
    uni.$on("updateCurrent", function (val) {
      console.log('65-----------',val)
      if(_this.isPhone){
          _this.current = val+1;
      }else{
         _this.current = val;
      }
      
      if(val == 2){
        console.log(_this.isPhone)
      }
    });
		uni.$emit('setPass')
  },
  onUnload() {
    uni.$off("updateCurrent");
  },
  onReady() {
    this.showModal(); //唤起弹窗
  },
  methods: {
    /**
     * @description 检测是否设置支付密码
     */
    checkIfPayPwd() {
      this.mode = 3;
      this.showModal(); //唤起弹窗
      return;
      this.$api.get(global.apiUrls.postUserCheck_pay_password).then((res) => {
        if (res.data.code == 1) {
          //有密码-去修改
          this.mode = 3;
          if(this.isPhone){
            this.mode = 2;
          }
          this.showModal(); //唤起弹窗
        }else if(res.data.code == -1){
          //没有密码 - 去设置
          this.mode = 2;
          this.showModal();
        }else{
          // this.showModal(); //唤起弹窗
        }
      });
    },
    /**
     * @description 显示密码输入组件
     */
    showModal() {
      console.log(this.$refs.paymentPassword)
      this.$refs.paymentPassword.modalFun("show");
    },
    /**
     * @description 重新输入
     */
    hideModal() {
      this.$refs.paymentPassword.clearAll();
    },
    /**
     * @description 关闭密码框
     */
    togglePayment(e) {
      uni.navigateBack();
    },
    /**
     * @description 输入完成
     */
    submitHandle(e) {
      console.log(e)
      if (e.type == "reset") {
        // 设置新密码
        this.setPayPwd(e);
      } else if (e.type == "verify") {
        // 旧密码 -- 验证
        // this.checkPayPwd(e.value);
        this.pay_password = e.value;
      } else if (e.type == "modify") {
        // 新密码 -- 提交
        this.changePayPwd(e);
      }
    },

    /**
     * @description 设置新密码
     */
    setPayPwd(e) {
      debounce(() => {
        this.$api.post(global.apiUrls.postUserSet_pay_password, {
          password: e.value,
        }).then((res) => {
          uni.hideLoading();
          this.$message.info(res.data.msg);
          if (res.data.code == 1) {
            uni.$emit('setPass')
            setTimeout(() => {
              uni.navigateBack();
              return;
            }, 1200);
          } else {
            this.hideModal();
          }
        });
      })
    },
    /**
     * @description 校验旧密码
     * @param {String} pay_password - 用户输入的旧密码
     */
    async checkPayPwd(pay_password) {
      return this.$api.post(global.apiUrls.postUserUpdate_old_password, {
        pay_password: pay_password,
      })
    },

    /**
     * @description 修改密码-执行接口
     * @param {Object} e - 用户输入的信息
     */
    changePayPwd(e) {
      let data ={
          pwd_paypass: e.value, // 确认密码
          new_paypass: e.value, // 新密码
          type: 2
        }
      if(this.isPhone){
       data.type = 2
       data.code = this.code
       data.mobile = this.mobile
      }
      this.$api.get(global.apiUrls.postUserUpdate_pay_password, data).then((res) => {
        uni.hideLoading();
        this.$message.info(res.data.msg);
        if (res.data.code == 1) {
          setTimeout(() => {
            uni.navigateBack();
            return;
          }, 1200);
        } else {
          this.hideModal();
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.change-pay-password {
  position: fixed;
  top: calc(var(--status-bar-height) + 230rpx);
  z-index: 99999;
  width: 100%;
  height: 64rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .circle {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    background: #dcdcdc;
    font-size: 32rpx;
    color: #ffffff;
    text-align: center;
    line-height: 56rpx;
    &.active {
      background: #3994D8;
    }
  }
  .line {
    width: 118rpx;
    height: 4rpx;
    background: #dcdcdc;
  }
}

.types {
  width: 686upx;
  height: 88upx;
  color: #fff;
  line-height: 88upx;
  background: linear-gradient(
    90deg,
    rgba(73, 170, 52, 1) 0%,
    rgba(33, 154, 60, 1) 100%
  );
  opacity: 1;
  border-radius: 40px;
  margin: 0 auto;
}

.per {
  padding: 0 20upx;
  font-size: 28upx;
  background-color: #fff;

  .per_row {
    padding: 30upx 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ededed;

    .row_right {
      text-align: right;

      .aa {
        color: #999999;
        display: inline-block;
        margin-right: 10upx;
      }
    }
  }
}

.out_login {
  margin-top: 30%;
  line-height: 88upx;
  background-color: rgb(0, 129, 255);
  color: #fff;
  text-align: center;
  border-radius: 45px;
  margin-left: 25upx;
  margin-right: 25upx;
}

.btn_cloce {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
}
</style>
