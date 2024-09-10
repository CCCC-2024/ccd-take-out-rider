<template>
  <view class="warp">
    <view class="pay">
      <view class="money">{{LANGUAGE_DATA['输入提现金额'][LANGUAGE]}}</view>
      <view class="get-money-wapper">
        <view class="get-money">
          <view class="get-money-left">
            <text>￥</text>
            <input type="number" v-model="cashMoney" placeholder-style="color: #BFBFBF;" :maxlength="maxlength" @input="moneychange" :placeholder="LANGUAGE_DATA['账户余额'][LANGUAGE] + money" />
          </view>
          <view class="allCash" @tap="handleCashAll">全部</view>
        </view>
      </view>
      <view class="remark">
        <view>
          <text>{{LANGUAGE_DATA['提现收取1%的手续费'][LANGUAGE]}}</text>
          <u-icon name="question-circle" color="#3B7AD5" size="24" @click="show = true"></u-icon>
        </view>
        <!-- <view class="illustrStyle">说明：{{illustr}}</view> -->
      </view>
    </view>
    <view class="lineBg"></view>
    <view class="public-pay-way">
      <view class="title">{{LANGUAGE_DATA['请选择提现方式'][LANGUAGE]}}</view>
      <view class="item-wapper">  <!-- @tap="handleRadioChange(index)" -->
        <view class="item" v-if="bankWx != ''">
          <view class="item_right">
            <image src="/pagecenter/static/img/payIcon2.png" mode=""></image>
            <view class="center">微信</view>
          </view>
          <image src="/pagecenter/static/img/check_xy.png" mode="" class="check_imgs" v-if="wxCheck" @click="choseCard(1)"></image>
          <image src="/pagecenter/static/img/checkNo.png" mode="" class="check_imgs" v-else @click="choseCard(1)"></image>
        </view>
        <view class="item" v-if="bankZhi != ''">
          <view class="item_right">
            <image src="/pagecenter/static/img/payIcon1.png" mode=""></image>
            <view class="center">支付宝</view>
          </view>
          <image src="/pagecenter/static/img/check_xy.png" mode="" class="check_imgs" v-if="zhiCheck" @click="choseCard(2)"></image>
          <image src="/pagecenter/static/img/checkNo.png" mode="" class="check_imgs" v-else @click="choseCard(2)"></image>
        </view>
        <view class="item" v-if="bankCard != ''">
          <view class="item_right">
            <image src="/pagecenter/static/img/payIcon3.png" mode=""></image>
            <view class="center">银行卡</view>
          </view>
          <image src="/pagecenter/static/img/check_xy.png" mode="" class="check_imgs" v-if="cardCheck" @click="choseCard(3)"></image>
          <image src="/pagecenter/static/img/checkNo.png" mode="" class="check_imgs" v-else @click="choseCard(3)"></image>
        </view>
      </view>
    </view>

    <view class="page-footer">
      <button type="primary" class="sub" :loading="submitBtnLoading" @click="cliSubmit">提现</button>
    </view>
    
    <!-- 提现规则 -->
    <u-popup v-model="show" mode="center" :mask-close-able="false">
      <view class="explainCon">
        <view class="explainCon_box">
          <view class="explainCon_til">{{treatyCon.name}}</view>
          <rich-text :nodes="treatyCon.content"></rich-text>
        </view>
        <u-icon name="close-circle" color="#ffffff" size="48" class="iconSty" @click="show=false"></u-icon>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { validate } from '@/common/utils/index'

export default {
  data() {
    const modes = {
      index: 0,
      list: [
        { icon: '/pagecenter/static/wallet/cash01.png', name: '微信', type: 1 },
        { icon: '/pagecenter/static/wallet/cash02.png', name: '支付宝', type: 2 }
      ]
    }

    return {
      money: 0,                                            // 当前余额
      minMoney: 0,                                         // 最低提现金额
      walletInfo: null,
      passwordChecked: false,
      modes,
      isBindWechat: false,
      isBindAlipay: false,
      userInfo: null,
      submitBtnLoading: false,
      cashMoney: '',                                       // 提现的金额
      isSet: 1,                                            // 是否设置过密码   1设置过，2没设置过
      illustr: '预计周三到账',                                         // 提现说明
      
      bankWx: '',                                          // 已绑定的微信账号
      wxCheck: false,
      bankZhi: '',                                         // 已绑定的支付吧账号
      zhiCheck: false,
      bankCard: '',                                        // 已绑定的银行卡列表
      cardCheck: false,
      countType: '',                                       // 支付方式
      show: false,                                         // 提现规则
      treatyCon: ''
    };
  },
  computed:{
    maxlength(){
      if(this.cashMoney){
        if(this.cashMoney.split('.')[1]){
          return this.cashMoney.split('.')[0].length+3
        }
        return 12;
      }
    }
  },
  onLoad(option) {
    this.userInfo = global.userInfo
    this.money = option.money
    this.minMoney = option.minMoney
    
    this.getCashContent()
    this.getPsd()
    this.getBandCard()
  },
  onShow(){
    
  },

  methods: {
    // 切换支付账号(暂未使用)
    handleRadioChange(index) {
      this.modes.index = index
    },
    
    /**
     * 获取提现规则内容
     */
    getCashContent(){
      this.$api.post(global.apiUrls.xieyi, {
        article_id: 8
      }).then(res => {
        if(res.data.code == 1){
          this.treatyCon = res.data.data
        }else{
          
        }
      })
    },
    
    // 全部提现
    handleCashAll(){
      this.cashMoney = this.money;
    },
    
    // 判断小数点
    moneychange(e){
      if(!validate(e.target.value, 'ismoney')){
         console.log(12)
       }else{
         console.log(11)
       }
       let val = e.target.value
       this.cashMoney = val
    },
    
    // 获取是否设置过支付密码
    getPsd(){
      this.$api.get(global.apiUrls.getRiderMsg, {
      }).then(res => {
        if(res.data.code == 1){
          console.log(res.data.data.pay_password)
          if(res.data.data.pay_password == ''){
            this.isSet = 1
          }else{
            this.isSet = 2
          }
        }else{
          
        }
      })
    },
    
    /**
     * 获取已绑定的银行卡列表
     */
    getBandCard(){
      this.$api.get(global.apiUrls.storeWithdrawCheck,{
        account_type: 1
      }).then(res => {
        if(res.data.code == 1){
          this.bankWx = res.data.data
        }else{
          // this.$message.info(res.data.msg) 
        }
      })
      this.$api.get(global.apiUrls.storeWithdrawCheck,{
        account_type: 2
      }).then(res => {
        if(res.data.code == 1){
          this.bankZhi = res.data.data
        }else{
          // this.$message.info(res.data.msg) 
        }
      })
      this.$api.get(global.apiUrls.storeWithdrawCheck,{
        account_type: 3
      }).then(res => {
        if(res.data.code == 1){
          this.bankCard = res.data.data
        }else{
          // this.$message.info(res.data.msg) 
        }
      })
    },
    
    /**
     * 切换选择的银行卡
     */
    choseCard(index){
      this.countType = index
      if(index == 1){
        this.zhiCheck = false
        this.cardCheck = false
        this.wxCheck = !this.wxCheck
      }else if(index == 2){
        this.wxCheck = false
        this.cardCheck = false
        this.zhiCheck = !this.zhiCheck
      }else{
        this.zhiCheck = false
        this.wxCheck = false
        this.cardCheck = !this.cardCheck
      }
    },
    
    // 点击提现按钮
    cliSubmit(){
      let { cashMoney, submitBtnLoading, modes, walletInfo, money, bankCard, countType } = this
      
      if (cashMoney == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入提现金额'][this.LANGUAGE]}`);
      if (!validate(cashMoney, 'ismoney')) return this.$message.info(`${this.LANGUAGE_DATA['请正确输入提现金额'][this.LANGUAGE]}`);
      // if(cashMoney * 1 < this.minMoney * 1) return this.$message.info(`${this.LANGUAGE_DATA['不满足最小提现金额'][this.LANGUAGE]}`);
      if (cashMoney * 1 > money * 1) return this.$message.info(`${this.LANGUAGE_DATA['可提现金额不足'][this.LANGUAGE]}`);
      if(!this.zhiCheck && !this.wxCheck && !this.cardCheck) return this.$message.info(`${this.LANGUAGE_DATA['请选择提现方式'][this.LANGUAGE]}`);
      
      if(this.isSet == 1){
        uni.navigateTo({
          url: '/pagecenter/pages/settings/cypher/index?type=1' + '&money=' + this.cashMoney + '&id=' + countType
        })
      }else{
        uni.navigateTo({
          url: '/pagecenter/pages/settings/cypher/index?type=2' + '&money=' + this.cashMoney + '&id=' + countType
        })
      }
    },
  },
  onNavigationBarButtonTap() {
    uni.navigateTo({
      url: '/pagecenter/pages/wallet/cashDel/index'
    })
  }
}

</script>

<style lang="scss">
@import "./index.scss";
</style>
