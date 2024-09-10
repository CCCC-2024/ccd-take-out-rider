<template>
  <view class="page-wapper">
    <view class="" v-if="pType == 1">
      <view class="title">{{LANGUAGE_DATA['设置新密码'][LANGUAGE]}}</view>
      <view class="set_text">{{LANGUAGE_DATA['请设置新密码'][LANGUAGE]}}</view>
      <u-message-input @change="change" @finish="finish" :disabled-keyboard="false" :focus="false" :maxlength="6" :value="value" ></u-message-input>
    </view>
    <view class="" v-if="pType == 2">
      <view class="title">{{LANGUAGE_DATA['输入提现密码'][LANGUAGE]}}</view>
      <view class="set_text">{{LANGUAGE_DATA['输入提现密码'][LANGUAGE]}}</view>
      <u-message-input @change="change" @finish="finish" :disabled-keyboard="false" :focus="false" :maxlength="6" :value="value" ></u-message-input>
    </view>
    <view class="" v-if="pType == 3">
      <view class="title">{{LANGUAGE_DATA['确认提现密码'][LANGUAGE]}}</view>
      <view class="set_text">{{LANGUAGE_DATA['确认提现密码'][LANGUAGE]}}</view>
      <u-message-input @change="change" @finish="finish" :disabled-keyboard="false" :focus="false" :maxlength="6" :value="value" ></u-message-input>
    </view>
    <view class="" v-if="pType == 4">
      <view class="title">{{LANGUAGE_DATA['修改提现密码'][LANGUAGE]}}</view>
      <view class="set_text">{{LANGUAGE_DATA['请输入提现密码，以验证身份'][LANGUAGE]}}</view>
      <u-message-input @change="change" @finish="finish" :disabled-keyboard="false" :focus="false" :maxlength="6" :value="value" ></u-message-input>
    </view>
    <view class="" v-if="pType == 5">
      <view class="title">{{LANGUAGE_DATA['设置新提现密码'][LANGUAGE]}}</view>
      <view class="set_text">{{LANGUAGE_DATA['设置新提现密码'][LANGUAGE]}}</view>
      <u-message-input @change="change" @finish="finish" :disabled-keyboard="false" :focus="false" :maxlength="6" :value="value" ></u-message-input>
    </view>
    <view class="" v-if="pType == 6">
      <view class="title">{{LANGUAGE_DATA['确认新支付密码'][LANGUAGE]}}</view>
      <view class="set_text">{{LANGUAGE_DATA['确认新支付密码'][LANGUAGE]}}</view>
      <u-message-input @change="change" @finish="finish" :disabled-keyboard="false" :focus="false" :maxlength="6" :value="value" ></u-message-input>
    </view>
    <view class="" v-if="pType == 7">
      <view class="title">{{LANGUAGE_DATA['设置新提现密码'][LANGUAGE]}}</view>
      <view class="set_text">{{LANGUAGE_DATA['设置新提现密码'][LANGUAGE]}}</view>
      <u-message-input @change="change" @finish="finish" :disabled-keyboard="false" :focus="false" :maxlength="6" :value="value" ></u-message-input>
    </view>
    <view class="setTips">提现密码为6位数字，用户提现、设置密保、添加银行卡等操作，可保障资金安全</view>
    <u-keyboard z-index="99" :mask-close-able="false" ref="uKeyboard" @change="valChange" @backspace="backspace" mode="number" v-model="show" :mask="false" :show-tips="false" :cancel-btn="false" :confirm-btn="false"></u-keyboard>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      value: '',
      money: '',                   // 支付金额
      pType: '',                   // 是否首次设置支付密码 1位设置过，2设置过，3确认密码
      firstPsd: '',                // 首次支付密码
      lastPsd: '',                 // 再次的支付密码
      oldPsd: '',                  // 旧密码
      changeOnePsd: '',            // 首次的修改密码
      changeTwoPsd: '',            // 再次的修改密码
      id: '',                      // 银行卡id
      carName: '',                 // 银行卡名称
    }
  },

  onLoad(options) {
    console.log(options)
    this.money = options.money
    this.pType = options.type
    this.id = options.id ? options.id : ''
    this.carName = options.name ? options.name : ''
  },
  methods: {
    change(e) {
      console.log('内容改变，当前值为：' + e);
    },
    finish(e) {
      console.log('输入结束，当前值为：' + e);
    },
    // 按键被点击(点击退格键不会触发此事件)
    valChange(val) {
      // 将每次按键的值拼接到value变量中，注意+=写法
      if(this.value.length <= 5){
        this.value += val;
      }
      
      if(this.value.length == 6){
        if(this.pType == 1){
          this.firstPsd = this.value
          this.value = ''
          this.pType = 3
        }else if(this.pType == 2){
          this.walletCli()
        }else if(this.pType == 3){
          this.lastPsd = this.value
          if(this.firstPsd == this.lastPsd){
            this.setPassword()
          }else{
            this.$message.info(`${this.LANGUAGE_DATA['两次密码不一致，请重新输入'][this.LANGUAGE]}`)
            this.value = ''
            this.lastPsd = ''
          }
        }else if(this.pType == 4){
          this.oldPsd = this.value
          this.value = ''
          this.pType = 5
        }else if(this.pType == 5){
          this.changeOnePsd = this.value
          this.value = ''
          this.pType = 6
        }else if(this.pType == 6){
          this.changeTwoPsd = this.value
          if(this.changeOnePsd == this.changeTwoPsd){
            this.changePassword()
          }else{
            this.$message.info(`${this.LANGUAGE_DATA['两次密码不一致，请重新输入'][this.LANGUAGE]}`)
            this.value = ''
            this.changeTwoPsd = ''
          }
        }else if(this.pType == 7){
          this.setPassword()
        }
      }
    },
    
    // 设置支付密码 setZfPsd
    setPassword(){
      this.$api.post(global.apiUrls.setZfPsd,{
        pwd_paypass: this.value,
        new_paypass: this.value,
        type: 1
      }).then(res=>{
        console.log(res)
        this.$message.info(res.data.msg);
        if(res.data.code == 1){
          if(this.pType == 3){
            this.walletCli()
          }else{
            uni.navigateBack({})
          }
        }else{
          
        }
      }).catch(err => {
        
      })
    },
    
    // 修改支付密码
    changePassword(){
      this.$api.post(global.apiUrls.changePassward,{
        pay_password: this.oldPsd,
        new_pay_password: this.changeTwoPsd
      }).then(res=>{
        console.log(res)
        this.$message.info(res.data.msg);
        if(res.data.code == 1){
          setTimeout(function(){
            uni.navigateBack({})
          },1000)
        }else{
          
        }
      }).catch(err => {
        
      })
    },
       
       
    // 提现
    walletCli(){
      this.$api.post(global.apiUrls.cashAdvance,{
        pay_password: this.value,
        money: this.money,
        type: this.id 
      }).then(res=>{
        console.log(res)
        if(res.data.code == 1){
          uni.$emit('wall_note'); 
          // setTimeout(() => {
          //   uni.navigateBack({
          //     delta: 2
          //   })
          // }, 1000)
          uni.reLaunch({
            url: '/pagecenter/pages/wallet/cashSucces/index?money=' + this.money + '&name=' + this.carName
          })
        }else{
          this.$message.info(res.data.msg);
        }
      }).catch(err => {
        
      })
    },
    
    // 退格键被点击
    backspace() {
      // 删除value的最后一个字符
      if(this.value.length) this.value = this.value.substr(0, this.value.length - 1);
      console.log(this.value);
    }
  },
}

</script>

<style lang="scss">
@import "./index.scss";
</style>
