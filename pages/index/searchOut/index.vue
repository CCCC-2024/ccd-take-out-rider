<template>
  <view class="page-wapper">
    <view class="hearder">
      <view class="status_bar"></view>
      <view class="searchTab">
        <u-icon name="arrow-left" color="#333333" size="34" @click="backCli"></u-icon>
        <input type="text" value="" :placeholder="LANGUAGE_DATA['请输入关键词进行搜索'][LANGUAGE]" v-model="search_key" />
        <u-icon name="search" color="#333333" size="34" @click="searchCli"></u-icon>
      </view>
    </view>
    <view class="recordBox">
      <view class="list" v-for="(item,index) in listData" :key="index">
        <view class="list_row lineStyle">
          <text>{{LANGUAGE_DATA['订单'][LANGUAGE]}}：{{item.order_sn}}</text>
        </view>
        <view class="list_row lineStyle">
          <view class="gap">
            <view class="" v-if="item.is_once == 0">
              <text>{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}}：</text>
              <text>{{item.forecast_time}}</text>
            </view>
            <view class="" v-if="item.is_once == 0 && item.is_advance == 1">{{LANGUAGE_DATA['需垫付商品费预计'][LANGUAGE]}}{{LANGUAGE_DATA['￥'][LANGUAGE]}}{{item.payable_money}}</view>
            <view class="" v-if="item.is_once != 0">{{LANGUAGE_DATA['立即配送'][LANGUAGE]}}</view>
          </view>
          <view class="list_receipts">
            <text>{{LANGUAGE_DATA['预计收入'][LANGUAGE]}}</text>
            <text style="font-size: 32rpx; font-weight: 600;color: #FF4444;">{{item.estimated_income}}</text>
          </view>
        </view>
        <view class="list_con lineStyle">
          <view class="con_part">
            <view class="charact">
              <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="tabId == 1"></image>
              <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="tabId == 0"></image>
              <view class="">0.1km</view>
            </view>
            <view class="part_right" >
              <view class="addr_dis">
                <text>{{item.start_address_info.name}}</text>
                <image src="/static/img/mobile.png" mode="" @click="call(item.start_address_info.mobile)"></image>
              </view>
              <view class="address-style">
                <view class="addr">{{item.start_address_info.address}}{{item.start_address_info.address_detail}}</view>
                <image src="/static/img/copys.png" mode="" class="addr-img"></image>
                <image src="/static/img/addr.png" mode="" class="addr-img" @click="look_local(item.start_address_info.lat,item.start_address_info.lng,'商家位置',item.start_address_info.address)"></image>
              </view>
            </view>
          </view>
          <view class="con_part two_part">
            <view class="charact">
              <image src="/static/img/locaEnd.png" mode="" class="icon_img"></image>
              <view class="">0.1km</view>
            </view>
            <view class="part_right">
              <view class="addr_dis">
                <text>{{item.end_address_info.name}}{{item.end_address_info.mobile}}</text>
                <image src="/static/img/mobile.png" mode="" @click="call(item.end_address_info.mobile)"></image>
              </view>
              <view class="address-style">
                <view class="addr">{{item.end_address_info.address}}{{item.end_address_info.address_detail}}</view>
                <image src="/static/img/copys.png" mode="" class="addr-img"></image>
                <image src="/static/img/addr.png" mode="" class="addr-img" @click="look_local(item.end_address_info.lat,item.end_address_info.lng,'用户位置',item.end_address_info.address)"></image>
              </view>
            </view>
          </view>
        </view>
        <view class="floor_btn"> 
          <view class="btns look" @click="JumpParticul(item.order_sn)">{{LANGUAGE_DATA['查看详情'][LANGUAGE]}}</view>
        </view>
      </view>
      
      <fu-empty
        :paging-list-loaded-all="pagingListLoadedAll"
        :paging-list-no-list-data="pagingListNoListData"
        :list-data-length="listDataLength"
      ></fu-empty>
    </view>
  </view>
</template>

<script>
import pagingList from '@/common/minix/paging_list.js'
export default {
  mixins: [pagingList],
  data() {
    return {
      minixPagingListsApi: global.apiUrls.foodsList,
      allowOnloadGetList: false,
      search_key: '',                                    // 关键词
      tabId: 0,                                          // 外卖订单
      lng: '',
      lat: '',             
      
    }
  },
  onLoad(option){
    console.log(option)
    this.search_key = option.key
    
    this.allowOnloadGetList = true
    this.pagingListToggle()
    
    uni.$emit('serchOver')
  },
  methods: {
    pagingListPostData(){
      return { lng: this.lng, lat: this.lat, status: this.tabId, keyword: this.search_key }
    },
    
    /**
     * 返回上一页
     */
    backCli(){
      uni.navigateBack({})
    },
    
    /**
     * 跳转到详情
     */
    JumpParticul(orderSn){
      uni.navigateTo({
        url: '/pages/index/fooddetail/index?orderSn=' + orderSn
      })
    },
    
    searchCli(){
      this.pagingListToggle()
      uni.$emit('serchOver')
    },
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

