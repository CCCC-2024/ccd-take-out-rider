<template>
  <view class="warp">
    <view class="item">
      <text>{{LANGUAGE_DATA['持卡人姓名'][LANGUAGE]}}</text>
      <input type="text" value="" :placeholder="LANGUAGE_DATA['请输入真实姓名'][LANGUAGE]" v-model="userName" />
    </view>
    <view class="item" @click="show = true">
      <text>{{LANGUAGE_DATA['银行名称'][LANGUAGE]}}</text>
      <input type="text" value="" :placeholder="LANGUAGE_DATA['请输入银行名称'][LANGUAGE]" v-model="branchNum" disabled="disabled" />
    </view>
    <view class="item">
      <text>{{LANGUAGE_DATA['银行卡号'][LANGUAGE]}}</text>
      <input type="number" value="" :placeholder="LANGUAGE_DATA['请输入银行卡号'][LANGUAGE]" v-model="cardNum" />
    </view>
    <view class="item">
      <text>{{LANGUAGE_DATA['开户行'][LANGUAGE]}}</text>
      <input type="text" value="" :placeholder="LANGUAGE_DATA['请输入开户行'][LANGUAGE]" v-model="openBank" />
    </view>
    
    <view class="submit" @click="bankCard">{{LANGUAGE_DATA['提交'][LANGUAGE]}}</view>
    
    <u-picker mode="selector" :range="selector" range-key="name" v-model="show" @confirm="choseBank"></u-picker>
  </view>
</template>

<script>
export default {
  data() {
    return {
      openBank: '',                       // 开户行
      cardNum: '',                        // 银行卡号
      branchNum: '',                      // 银行名称
      userName: '',                       // 姓名
      bankId: '',                         // 银行id
      
      id: '',                             // 选择的银行卡id
      show: false,
      selector: []
    };
  },
  onLoad(options) {
    this.bankId = options.id ? options.id : ''
    
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['银行卡信息'][this.LANGUAGE]}`
    });
    
    this.getMsg()
    this.getBank()
  },
  methods: {
    // 获取账号信息
    getMsg(){
      this.$api.post(global.apiUrls.storeWithdrawCheck, {
        account_type: 3
      }).then(res => {
        if(res.data.code == 1){
          this.userName = res.data.data.true_name
          this.branchNum = res.data.data.bank
          this.cardNum = res.data.data.account_id
          this.openBank = res.data.data.bank_name
        }else{
          // this.$message.info(res.data.msg) 
        }
      })
    },
    
    /**
     * 选择银行卡
     */
    choseBank(e){
      console.log(this.selector[e])
      this.branchNum = this.selector[e].name
      this.id = this.selector[e].id
    },
    
    /**
     * 获取银行卡列表
     */
    getBank(){
      this.$api.get(global.apiUrls.cardList).then(res => {
        if(res.data.code == 1){
          this.selector = res.data.data
        }else{
          // this.$message.info(res.data.msg) 
        }
      })
    },
    
    // 提交绑定信息
    bankCard(){
      if(this.openBank == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入开户行代码'][this.LANGUAGE]}`)
      if(this.cardNum == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入银行卡号'][this.LANGUAGE]}`)
      if(!validate(this.cardNum, 'card')) return this.$message.info(`${this.LANGUAGE_DATA['请输入正确的银行卡号'][this.LANGUAGE]}`);
      if(this.branchNum == '') return this.$message.info('请输入银行名称')
      if(this.userName == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入姓名'][this.LANGUAGE]}`)
      
      this.$api.post(global.apiUrls.bindAccount, {
        true_name: this.userName,
        account_id: this.cardNum,
        bank_name: this.openBank,
        bank: this.branchNum,
        account_type: 3
      }).then(res => {
        this.$message.info(res.data.msg) 
        if(res.data.code == 1){
          uni.$emit('bindSucces')
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
