<template>
  <view class="page-wapper">
    <view class="title_sty">
      <view class="status_bar"></view>
      <view class="titles">
        <u-icon name="arrow-left" color="#333333" size="36" @click="back_cli"></u-icon>
        <text>{{LANGUAGE_DATA['查看明细'][LANGUAGE]}}</text>
        <!-- <u-icon name="calendar" color="#cccccc" size="28" ></u-icon> -->
        <view class="riliImg" @click="show = true">
          <image src="/pagecenter/static/img/rili.png" mode=""  ></image>
        </view>
      </view>
    </view>
    <view class="tab" v-if="isTimeShow">
      <text>{{LANGUAGE_DATA['筛选区间'][LANGUAGE]}}:</text>
      <text>{{starTime}}</text>
      <text>至</text>
      <text>{{endTime}}</text>
      <u-icon name="close-circle-fill" color="#999999" size="34" @click="cleanCheck"></u-icon>
    </view>
    
    <view class="list-wrapper">
      <view class="item" v-for="(item, index) in listData" :key="index">
        <view class="lside">
          <view class="title">{{LANGUAGE_DATA['订单编号'][LANGUAGE]}}: {{item.order_sn}}</view>
          <view class="rside">{{item.is_settlement == 0 ? LANGUAGE_DATA['待结算'][LANGUAGE] : LANGUAGE_DATA['已结算'][LANGUAGE]}}</view>
        </view>
        <view class="desc">
          <view class="">{{item.create_time}}</view>
          <view class="prices">{{LANGUAGE_DATA['￥'][LANGUAGE]}}{{item.rider_profits}}</view>
        </view>
        <view class="desc" v-if="item.check_status == 2">{{LANGUAGE_DATA['失败原因'][LANGUAGE]}}：{{item.check_reason}}</view>
        <image src="/pagecenter/static/img/type1.png" mode="" class="status1" v-if="item.check_status == 0"></image>
        <image src="/pagecenter/static/img/type2.png" mode="" class="status1" v-if="item.check_status == 2"></image>
        <image src="/pagecenter/static/img/type3.png" mode="" class="status1" v-if="item.check_status == 1"></image>
      </view>
    </view>
    
    <fu-empty
      :paging-list-loaded-all="pagingListLoadedAll"
      :paging-list-no-list-data="pagingListNoListData"
      :list-data-length="listDataLength"
    ></fu-empty>
    
    <!-- 日历 -->
    <u-calendar v-model="show" :mode="mode" @change="change" active-bg-color="#F64722" btn-type="error">
      <view slot="tooltip"></view>
    </u-calendar>
  </view>
</template>

<script>
import pagingList from '@/common/minix/paging_list.js'
export default {
  mixins: [pagingList],
  data() {
    return {
      minixPagingListsApi: global.apiUrls.censusDel,                      // 接口
      // allowOnloadGetList: false,
      is_check: 1,                                                        // 1全部，2收益，3提现记录
      show: false,                                                        // 日历展示隐藏
      mode: 'range',                                                      // 日历类型
      starTime: '',                                                       // 开始时间
      endTime: '',                                                        // 结束时间
      
      isTimeShow: false,                                                  // 筛选时间
      
      timeType: '',                                                       // all 全部 today 今日 week 本周  month 本月
    }
  },
  onLoad(option) {
    console.log(option)
    this.timeType = option.type
    this.starTime = option.star ? option.star : ''
    this.endTime = option.end ? option.end : ''
    
    // this.getTime()
  },
  methods: {
    pagingListPostData(){
      return { start_time: this.starTime, end_time: this.endTime }
    },
    
    /**
     * 获取年月日
     */
    getTime(){
      var myDate = new Date();
      let year = myDate.getFullYear()
      let month = myDate.getMonth()
      let date = myDate.getDate()
      
      let day = myDate.getDate();
      let week = myDate.getDay()
      
      console.log(year,month,date)
    },
    
    cleanCheck(){
      this.isTimeShow = false
      this.starTime = ''
      this.endTime = ''
      this.pagingListToggle()
    },
    
    // 选择时间
    change(e) {
      console.log(e);
      this.starTime = e.startDate
      this.endTime = e.endDate
      this.isTimeShow = true
      this.pagingListToggle()
    },
    // 切换类型
    chenge_cli(id){
      this.is_check = id
      this.pagingListToggle()
    },
    // 返回上一页
    back_cli(){
      uni.navigateBack({})
    }
  },
};

</script>

<style lang="scss">
@import './index.scss';
</style>
