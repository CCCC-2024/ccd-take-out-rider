<template>
  <view class="page-wapper">
    <view class="orderList" v-for="(item,index) in listData" :key="index" >
      <view class="ident">
        <view class="">订单编号：{{item.order_sn}}</view>
        <view class="copyStyle" @click="copy(item.order_sn)">复制</view>
      </view>
      <view class="rowLineorder">
        <view class="" style="color: #FD0D1B;">超时{{item.apply_time}}分钟</view>
        <view :class="item.status == 0 ? 'ending' : item.status == 1 ? 'succes' : 'fail'">{{item.status == 0 ? '审核中' : item.status == 1 ? '审核成功' : '审核失败'}}</view>
      </view>
      <view class="rowLineTime">订单时间：{{item.add_time}}</view>
      <view class="rowLineTime" v-if="item.reason != ''">超时原因：{{item.reason}}</view>
      <view class="rowLineImg">
        <image :src="imgItem" mode="aspectFill" v-for="(imgItem,imgIndex) in item.images" :key="imgIndex" @click="previewImg(item.images,imgIndex)"></image>
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
      minixPagingListsApi: global.apiUrls.overtimeLine,
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
    /**
     * 预览图片
     */
    previewImg(images,index){
      console.log(index)
      uni.previewImage({
        urls: images,
        index: index,
        longPressActions: {
          success: function(data) {
            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
          },
          fail: function(err) {
            console.log(err.errMsg);
          }
        }
      });
    },
    
    /**
     * 复制
     */
    copy(number){
      uni.setClipboardData({
        data: number,
        success: function(res) {
          console.log(res);
        }
      });
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

