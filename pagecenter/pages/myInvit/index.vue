<template>
  <view>
    <view class="totalNum">{{LANGUAGE_DATA['总人数'][LANGUAGE]}}：{{numberPerson}}{{LANGUAGE_DATA['人'][LANGUAGE]}}</view>
    <view class="listContent">
      <view class="everList"  v-for="(item,index) in listData" :key="index">
        <view class="listLeft">
          <image :src="item.head_img" mode="aspectFill" class="head-img"></image>
          <view class="">
            <view class="">{{item.user_nickname}}</view>
            <view class="delMsg">
              <text>{{item.sex == 0 ? '男' : '女'}}</text>/<text>{{item.age}}</text>/<text>{{item.province_info}}</text>
            </view>
          </view>
        </view>
        <view class="listRight">
          <view class="">{{item.order_number}}{{LANGUAGE_DATA['单'][LANGUAGE]}}</view>
          <view class="time">{{item.time}}</view>
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
        minixPagingListsApi: global.apiUrls.qrcode, 
        numberPerson: 0,                                // 总人数
      };
    },
    onShow() {
      this.qrcodeMsg()
    },
    onShareAppMessage(res) {
      
    },
    methods: {
      qrcodeMsg() {
        this.$api.get(global.apiUrls.qrcode, {}).then(res => {
          if (res.data.code == 1) {
            this.numberPerson = res.data.data.total
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
