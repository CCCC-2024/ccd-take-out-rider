<template>
  <view class="page-wapper">
    <view class="page-header">
      <view :class="{item: true, active: navsIndex == index}" @tap="handleToggle(index)" v-for="(item, index) in navs" :key="index">{{item.name}}</view>
    </view>
    <view class="page-header-placeholder"></view>

    <view class="notice" v-if="startDate">
      <view class="notice-content">筛选区间：{{startDate}} 至 {{endDate}}</view>
      <view class="notice-rside" @tap="handleClearScreen"><text class="iconfont">&#xe7be;</text></view>
    </view>

    <view class="list-wrapper">
      <view :class="{item: true, active: item.change_money * 1 > 0}" v-for="(item, index) in listData" :key="index">
        <view class="lside">
          <view class="title">{{item.remark}}</view>
          <view class="desc">{{item.create_time}}</view>
        </view>
        <view class="rside">{{item.change_money * 1 > 0 ? '+' : ''}}{{item.change_money}}</view>
      </view>
    </view>

    <mj-empty
      :paging-list-loaded-all="pagingListLoadedAll"
      :paging-list-no-list-data="pagingListNoListData"
      :list-data-length="listDataLength"
    ></mj-empty>

    <w-picker
      mode="range"
      startYear="2017"
      endYear="2050"
      :value="rangeVal"
      :current="true"
      @confirm="handleConfirmChooseRange"
      ref="range"
    ></w-picker>
  </view>
</template>

<script>
const { handleJump } = global
import { moment } from '@/common/utils/index'
import pagingList from '@/common/minix/paging_list.js'

export default {
  mixins: [pagingList],
  data() {
    let rangeVal = ['2020-01-01',moment().format('YYYY-MM-DD')]
    return {
      minixPagingListsApi: global.apiUrls.userBalanceList,

      rangeVal,                                       // 区间筛选默认值
      startDate: '',                                  // 日期筛选开始日期
      endDate: '',                                    // 日期筛选结束日期

      navsIndex: 0,
      navs: [
        { name: '全部', status: 999 },
        { name: '消费记录', status: 1 },
        { name: '充值记录', status: 2 },
      ]
    }
  },

  onNavigationBarButtonTap(options) {
    if (options.index == 0) {
      const items = ['本周', '本月', '自定义日期'];
      uni.showActionSheet({
        itemList: items,
        success: (res) => {
          const startDayDate = moment().format('YYYY-MM-DD');
          var weekOfday = moment().format('E');
          const startWeekDate = moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD');
          const startMonthDate = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD');
          const startYearDate = moment().year(moment().year()).startOf('year').format('YYYY-MM-DD');
          console.log(startDayDate, startWeekDate, startMonthDate)
          if(res.tapIndex == 0 || res.tapIndex == 1){
            this.startDate = res.tapIndex == 0 ? startWeekDate : startMonthDate
            this.endDate = startDayDate
            this.pagingListToggle();
          }
          if(res.tapIndex == 2) this.$refs.range.show();
        }
      });
    }
  },

  methods: {
    handleJump,

    handleToggle(index) {
      this.navsIndex = index
      this.pagingListToggle()
    },

    pagingListPostData(){
      let { navs, navsIndex, startDate, endDate } = this
      return {
        date: startDate,
        end_time: endDate,
        type: navs[navsIndex]['status']
      }
    },

    handleConfirmChooseRange(e){
      let result = e.result.split('至')
      this.startDate = result[0]
      this.endDate = result[1]
      this.pagingListToggle()
    },

    handleClearScreen(){
      this.startDate = ''
      this.endDate = ''
      this.pagingListToggle()
    }
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
