<template>
  <view class="page-wapper">
    <view class="title_sty">
      <view class="status_bar"></view>
      <view class="titles">
        <u-icon name="arrow-left" color="#333333" size="36" @click="back_cli"></u-icon>
        <text>提现明细</text>
        <!-- <u-icon name="calendar" color="#cccccc" size="28" ></u-icon> -->
        <view class="riliImg" @click="show = true">
          <image src="/pagecenter/static/img/rili.png" mode=""  ></image>
        </view>
      </view>
    </view>
    <view class="list-wrapper">
      <view class="item" v-for="(item, index) in listData" :key="index">
        <view class="lside">
          <view class="title">{{item.remark}}</view>
          <view class="rside" style="color: #FF4444;" v-if="item.status == 1">+{{item.change_money}}</view>
          <view class="rside" v-else>-{{item.change_money}}</view>
        </view>
        <view class="desc">
          <text>{{item.create_time}}</text>
          <text v-if="item.check_status == 0 ? 'checking' : item.check_status == 1 ? 'checkOver' : 'checkFail'">{{item.check_status == 0 ? '审核中' : item.check_status == 1 ? '已到账' : '审核驳回'}}</text>
        </view>
        <view class="desc" v-if="item.check_status == 2">{{LANGUAGE_DATA['失败原因'][LANGUAGE]}}：{{item.check_reason}}</view>
      </view>
    </view>
    
    <fu-empty
      :paging-list-loaded-all="pagingListLoadedAll"
      :paging-list-no-list-data="pagingListNoListData"
      :list-data-length="listDataLength"
    ></fu-empty>
    
    <!-- 日历 -->
    <u-calendar v-model="show" :mode="mode" @change="change" active-bg-color="#3994D8" btn-type="error">
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
      minixPagingListsApi: global.apiUrls.balanceDel,                     // 接口
      // allowOnloadGetList: false,
      is_check: 0,                                                        // 1全部，2收益，3提现记录
      show: false,                                                        // 日历展示隐藏
      mode: 'range',                                                      // 日历类型
      starTime: '',                                                       // 开始时间
      endTime: '',                                                        // 结束时间
    }
  },
  onLoad() {
    
  },
  methods: {
    pagingListPostData(){
      return { type: 2, start_time: this.starTime, end_time: this.endTime }
    },
    // 选择时间
    change(e) {
      console.log(e);
      this.starTime = e.startDate
      this.endTime = e.endDate
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
