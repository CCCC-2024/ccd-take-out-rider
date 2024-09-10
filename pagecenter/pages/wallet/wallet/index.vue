<template>
  <view class="page-wapper">
    <view class="title_box">
      <image src="/pagecenter/static/img/walletImg.png" mode="aspectFill" class="walletBg"></image> 
      <view class="headTitle">
        <view class="status_bar"></view>
        <view class="title">
          <u-icon name="arrow-left" color="#ffffff" size="36" @click="back"></u-icon>
          <text class="purse">{{LANGUAGE_DATA['我的钱包'][LANGUAGE]}}</text>
          <text class="bindCount"  @tap="handleJump" data-url="/pagecenter/pages/wallet/accountList/index">{{LANGUAGE_DATA['绑定账户'][LANGUAGE]}}</text>
        </view>
        <view class="amount">
          <view class="amount_con">
            <view class="money">
              <text class="sign">￥</text>
              <text class="sign_price">{{message.user_money}}</text>
            </view>
            <view class="amount_con_til">
              <text class="amount_con_til_head">{{LANGUAGE_DATA['当前余额'][LANGUAGE]}}({{LANGUAGE_DATA['可提现'][LANGUAGE]}})</text>
              <!-- <u-icon name="question-circle" color="#fff" size="22" @click="pointOver('15')"></u-icon> -->
            </view>
          </view>
          <view class="amount_con">
            <view class="money">
              <text class="sign">￥</text>
              <text class="sign_price">{{message.freeze_money}}</text>
            </view>
            <view class="amount_con_til">
              <text class="amount_con_til_head">{{LANGUAGE_DATA['待结算金额'][LANGUAGE]}}</text>
              <u-icon name="question-circle" color="#fff" size="22" @click="pointOver('16')"></u-icon>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="content_bg">
      <view class="contents">
        <view class="income">
          <view class="everIncome">
            <view class="reven">{{LANGUAGE_DATA['本月收入'][LANGUAGE]}}:</view>
            <view class="revenPrice">￥{{message.month_money}}</view>
          </view>
          <view class="everIncome">
            <view class="reven">{{LANGUAGE_DATA['累计收入'][LANGUAGE]}}: </view>
            <view class="revenPrice">￥{{message.total_revenue_money}}</view>
          </view>
        </view>
        <view class="cash" @click="jumpCash">
          <image src="/pagecenter/static/img/cash.png" mode="" ></image>
          <text>{{LANGUAGE_DATA['提现'][LANGUAGE]}}</text>
        </view>
      </view>
      <view class="record">
        <view class="record_title"  @tap="handleJump" data-url="/pagecenter/pages/wallet/integral/index">
          <view class="til_title">
            <view class="lines"></view>
            <text class="til_left">{{LANGUAGE_DATA['近'][LANGUAGE]}}30{{LANGUAGE_DATA['天记录'][LANGUAGE]}}</text>
          </view>
          <view v-if="listData != ''">
            <text class="lookAll">{{LANGUAGE_DATA['查看全部'][LANGUAGE]}}</text>
          </view>
        </view>
        <view class="list">
          <view class="list_item" v-for="(item,index) in listData" :key="index">
            <view class="item_left">
              <view class="remarkCon">{{item.remark}}</view>
              <view class="">
                <text class="item_right" style="color: #FF4444;" v-if="item.status == 1">{{item.change_money}}</text>
                <text class="item_right" v-else>{{item.change_money}}</text>
              </view>
            </view>
            <view class="time">
              <text>{{item.create_time}}</text>
              <text v-if="item.txt == '审核通过'">已到账</text>
            </view>
          </view>
          
          <fu-empty
            :paging-list-loaded-all="pagingListLoadedAll"
            :paging-list-no-list-data="pagingListNoListData"
            :list-data-length="listDataLength"
          ></fu-empty>
        </view>
      </view>
    </view>
    
    <u-popup v-model="show" mode="center" border-radius="8" :z-index="9999999">
      <view class="explainCon">
        <view class="explainCon_til">规则</view>
        <rich-text :nodes="message.freeze_money_txt"></rich-text>
      </view>
    </u-popup>
  </view>
</template>

<script>
import pagingList from '@/common/minix/paging_list.js'
export default {
  mixins: [pagingList],
  data() {
    return {
      minixPagingListsApi: global.apiUrls.balanceDel,                     // 接口
      allowOnloadGetList: false,
      message: '',
      starTime: '',
      endTime: '',
      treatyId: '',                                                       // 15=骑手端押金说明，16=骑手端待结算金额说明
      treatyCon: '',                                                      // 说明内容
      show: false
    }
  },
  onLoad() {
    let that = this
    // 获取当前时间
    var myDate = new Date();
    var day2 = new Date();
    day2.setTime(day2.getTime());
    var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();
    this.endTime = s2
    
    // 获取30天之前的日期
    var lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
    var lastY = lw.getFullYear();
    var lastM = lw.getMonth()+1;
    var lastD = lw.getDate();
    var startdate = lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);//三十天之前日期
    this.starTime = startdate
    
    this.pagingListToggle()
    
    uni.$on('wall_note', res => {
      that.pagingListToggle() 
    })
  },
  onShow() {
    this.getBalance()
  },
  methods: {
    pagingListPostData(){
      return { type: 0, begin_time: this.starTime, end_time: this.endTime }
    },
    
    back(){
      uni.navigateBack({})
    },
    
    /**
     * 点击出现说明内容
     */
    pointOver(type){
      this.treatyId = type
      // this.getTreaty()
      this.show = true
    },
    
    // 获取余额
    getBalance(){
      this.$api.get(global.apiUrls.surplus, {
        
      }).then(res => {
        if(res.data.code == 1){
          this.message = res.data.data
        }else{
          
        }
      })
    },
    
    /**
     * 获取协议
     */
    getTreaty(){
      this.$api.post(global.apiUrls.xieyi, {
        article_id: 8
      }).then(res => {
        if(res.data.code == 1){
          this.treatyCon = res.data.data
        }else{
          
        }
      })
    },
    
    // 提现
    jumpCash(){
      if(this.message.is_account == 1){
        uni.navigateTo({
          url: '/pagecenter/pages/wallet/cash/index?money=' + this.message.user_money + '&minMoney=' + this.message.min_withdraw_money
        })
      }else{
        this.$message.info(`${this.LANGUAGE_DATA['请先绑定提现账号'][this.LANGUAGE]}`);
      }
    }
  },

  
}

</script>

<style lang="scss">
@import './index.scss';
</style>
