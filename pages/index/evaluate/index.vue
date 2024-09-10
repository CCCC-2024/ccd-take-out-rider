<template>
  <view class="page-wapper">
    <view class="topMsg">
      <view class="rates">
        <view class="ratesTop">{{rateNum}}%</view>
        <view class="ratesBom">{{LANGUAGE_DATA['好评率'][LANGUAGE]}} </view>
      </view>
      <view class="lines"></view>
      <view class="">
        <text>{{LANGUAGE_DATA['评价星级'][LANGUAGE]}}：</text>
        <u-rate active-color="#FF9300" :count="count" v-model="star" inactive-color="#EEEEEE" inactive-icon="star-fill" :disabled="true" size="34"></u-rate>
      </view>
    </view>
    <view class="evaluat-box">
      <view class="evaluatList" v-for="(item,index) in listData" :key="index">
        <image :src="item.head_img" mode="aspectFill"></image>
        <view class="evaluatUserMsg">
          <view class="msgTop">
            <view class="">{{item.user_nickname}}</view>
            <view class="">
              <!-- <text>{{item.statics}}</text> -->
              <u-rate active-color="#FF9300" :count="count" v-model="item.rider_star" inactive-color="#EEEEEE" inactive-icon="star-fill" :disabled="true"></u-rate>
            </view>
          </view>
          <view class="msgTime">{{item.create_time}}</view>
        </view>
      </view>
    </view>
    
    <fu-empty
      :paging-list-loaded-all="pagingListLoadedAll"
      :paging-list-no-list-data="pagingListNoListData"
      :list-data-length="listDataLength"
    ></fu-empty>
  </view>
</template>

<script>
import pagingList from '@/common/minix/paging_list.js'
export default {
  mixins: [pagingList],
  data() {
    return {
      minixPagingListsApi: global.apiUrls.evaluate,
      star: 5,
      count: 5,
      rateNum: 0,                          // 好评率
    }
  },
  onLoad(option){
    this.star = option.score
    this.rateNum = option.rate
  },
  methods: {
    
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

