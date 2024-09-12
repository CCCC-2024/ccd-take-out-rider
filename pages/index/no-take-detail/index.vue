<template>
  <view class="page-wrapper">
    <view class="map">
      <view style="width: 100%;height: 260px;">
        <map style="width: 100%; height: 260px;" :latitude="latitude" :longitude="longitude" :markers="covers" :scale="13"></map>
      </view>
    </view>
    <view class="contents" v-if="isShow">
      <view class="list">
        <view class="list_row orderType">
          <view class="list_row_left">
            <text>{{LANGUAGE_DATA['待接单'][LANGUAGE]}}</text>
            <view class="" v-if="type == 0">
              <image src="/static/img/take1.png" mode="" class="takeTip" v-if="orderContent.type == 2"></image>
              <image src="/static/img/take2.png" mode=""  class="takeTip" v-if="orderContent.type == 3"></image>
            </view>
          </view>
          <view class="status_txt" v-if="type == 1">#{{orderContent.store_code}}</view>
        </view>
        <view class="contentBox">
          <view class="list_row lineType">
            <view class="expect">
              <text v-if="orderContent.type == 3">{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}}</text>
              <text class="times" v-if="type == 1">{{orderContent.expect_time}}</text>
              <text class="times" v-if="type == 0">{{orderContent.pickup_time}}</text>
            </view>
            <view class="gain">
              <text>{{LANGUAGE_DATA['预计收入'][LANGUAGE]}}</text>
              <text class="money">{{orderContent.estimated_income}}</text>
            </view>
          </view>
          <view class="list_con" v-if="type == 1">
            <view class="con_part">
              <view class="charact">
                <!-- <image src="/static/img/locaStar.png" mode="" class="icon_img"></image> -->
                <image src="/static/img/take-img.png" mode="" class="icon_img"></image>
                <view class="disRang">{{orderContent.start_distance}}km</view>
              </view>
              <view class="part_right" >
                <view class="addr_dis">
                  <text>{{orderContent.store_info.name}}</text>
                </view>
                <view class="address-style">
                  <view class="addr">{{orderContent.store_info.address}}{{orderContent.store_info.address_desc}}</view>
                  <!-- <image src="/static/img/adres.png" mode="" class="addr-img"></image> -->
                </view>
              </view>
            </view>
            <view class="con_part two_part">
              <view class="charact">
                <image src="/static/img/locaEnd.png" mode="" class="icon_img"></image>
                <view class="disRang">{{orderContent.end_distance}}km</view>
              </view>
              <view class="part_right">
                <view class="addr_dis" style="font-size: 28rpx;">
                  <text>{{orderContent.order_info.receiver_name}}({{orderContent.order_info.receiver_mobile}})</text>
                </view>
                <view class="address-style">
                  <view class="addr" style="font-size: 36rpx; color: #333333;">{{orderContent.order_info.province}}{{orderContent.order_info.city}}{{orderContent.order_info.district}}{{orderContent.order_info.receiver_address}}</view>
                  <!-- <image src="/static/img/adres.png" mode="" class="addr-img"></image> -->
                </view>
              </view>
            </view>
          </view>

          <view class="list_con" v-if="type == 0">
            <view class="con_part" v-if="orderContent.is_nearby == 0">
              <view class="charact">
                <!-- <image src="/static/img/locaEnd.png" mode="" class="icon_img" v-if="orderContent.type == 1"></image> -->
                <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="orderContent.type == 1 || orderContent.type == 2"></image>
                <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="orderContent.type == 3"></image>
                <view class="">{{orderContent.start_address_info.distance}}km</view>
              </view>
              <view class="part_right" >
                <view class="addr_dis" style="font-size: 28rpx;">
                  <text>{{orderContent.start_address_info.name}}</text>
                </view>
                <view class="address-style">
                  <view class="addr">{{orderContent.start_address_info.province}}{{orderContent.start_address_info.city}}{{orderContent.start_address_info.district}}{{orderContent.start_address_info.address}}</view>
                  <!-- <image src="/static/img/adres.png" mode="" class="addr-img"></image> -->
                </view>
              </view>
            </view>
            <view class="con_part two_part" v-if="orderContent.mode != 2">
              <view class="charact">
                <!-- <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="orderContent.type == 1 || orderContent.type == 2"></image> -->
                <image src="/static/img/locaEnd.png" mode="" class="icon_img" v-if="orderContent.type == 1 || orderContent.type == 2 || orderContent.type == 3"></image>
                <view class="">{{orderContent.end_address_info.distance}}km</view>
              </view>
              <view class="part_right">
                <view class="addr_dis">
                  <text style="font-size: 26rpx;">{{orderContent.end_address_info.name}}{{orderContent.end_address_info.receiver_mobile}}</text>
                </view>
                <view class="address-style">
                  <view class="addr" style="font-size: 36rpx; color: #333333;">{{orderContent.end_address_info.province}}{{orderContent.end_address_info.city}}{{orderContent.end_address_info.district}}{{orderContent.end_address_info.address}}</view>
                  <!-- <image src="/static/img/adres.png" mode="" class="addr-img"></image> -->
                </view>
              </view>
            </view>
            <view class="con_part two_part" v-if="orderContent.mode == 2">
              <view class="charact"></view>
              <view class="part_right">
                <image :src="orderContent.end_address" mode="aspectFill" class="addressPhoto"></image>
              </view>
            </view>
          </view>
          <view class="btns" @click="robOrder">{{LANGUAGE_DATA['立即抢单'][LANGUAGE]}}</view>
        </view>
      </view>
    </view>

    <!-- 接单成功提醒 -->
    <view class="remind_prop" v-if="is_remind">
      <view class="prop_box">
        <view class="tx">{{LANGUAGE_DATA['接单提醒'][LANGUAGE]}}</view>
        <view class="tx_text">
          <view class="" v-if="isOk == 1">{{LANGUAGE_DATA['您已成功抢单'][LANGUAGE]}}</view>
          <view class="" v-else>{{LANGUAGE_DATA['手慢了，继续加油'][LANGUAGE]}}</view>
        </view>
        <view class="qd_btn" v-if="isOk == 1" @click="close">{{LANGUAGE_DATA['查看订单'][LANGUAGE]}}</view>
        <view class="qd_btn" v-else @click="close">{{LANGUAGE_DATA['继续抢单'][LANGUAGE]}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  let wv,topHeight = 0;
  export default {
    data() {
      return {
        type: 1,                                  // 0外卖， 1跑腿
        orderSn: '',
        orderContent: "",                         // 从上个页面带过来的订单数据
        names: "订单详情",
        covers: [{
          latitude: '',
          longitude: '',
          iconPath: '',
          width: '35',
          height: '35',
          callout: {
            content: '发货地址',
            fontSize: '16',
            borderRadius: '10',
            bgColor: '#fff'
          }
        }, {
          latitude: '',
          longitude: '',
          iconPath: '',
          width: '35',
          height: '35',
          callout: {
            content: '收货地址',
            fontSize: '16',
            borderRadius: '10',
            bgColor: '#fff'
          }
        }, {
          latitude: '',
          longitude: '',
          iconPath: '',
          width: '35',
          height: '35',
          callout: {
            content: '骑手位置',
            fontSize: '16',
            borderRadius: '10',
            bgColor: '#fff'
          }
        }], // 地图展示信息
        latitude: '39.916527',
        longitude: '116.397128',

        is_remind: false,                         // 接单成功提示
        isOk: 1,                                 // 1 抢单成功 0抢单失败
        isShow: false,                           // 是否展示数据
      }
    },
    onLoad(option) {
      let that = this
      this.type = option.type

      uni.setNavigationBarTitle({
        title: `${this.LANGUAGE_DATA['订单详情'][this.LANGUAGE]}`
      });

      // #ifdef APP-NVUE
      const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
      // #endif
      // #ifndef APP-NVUE
      const eventChannel = this.getOpenerEventChannel();
      // #endif

      // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
      eventChannel.on('acceptDataFromOpenerPage', function(data) {
        console.log('178-----',data)
        let mages = data.data
        that.isShow = true
        if(option.type == 1){
          // 外卖
          that.orderContent = data.data

          that.latitude = mages.receiver_lat
          that.longitude = mages.receiver_lng

          that.covers[0].latitude = mages.store_info.lat;
          that.covers[0].longitude = mages.store_info.lng;
          that.covers[0].iconPath='/static/img/take-img.png'

          that.covers[1].latitude = mages.order_info.lat;
          that.covers[1].longitude = mages.order_info.lng;
          that.covers[1].iconPath='/static/img/locaEnd.png'

          that.covers[2].iconPath='/static/img/rider.png'
        }else{
          that.orderContent = data.data
          // 起手位置
          that.latitude = mages.start_lat
          that.longitude = mages.start_lng
          that.covers[2].iconPath='/static/img/rider.png'
          // 1=帮我送,2=帮我取 3=帮我买
          if(mages.type == 1){
            console.log('送送送送送送送送送')
            that.covers[0].latitude = mages.start_address_info.lat;
            that.covers[0].longitude = mages.start_address_info.lng;

            that.covers[1].latitude = mages.end_address_info.lat;
            that.covers[1].longitude = mages.end_address_info.lng;

            that.covers[0].iconPath='/static/img/take-img.png'
            that.covers[1].iconPath='/static/img/locaEnd.png'
          }else if(mages.type == 2){
            that.covers[0].latitude = mages.start_address_info.lat;
            that.covers[0].longitude = mages.start_address_info.lng;
            that.covers[0].iconPath='/static/img/take-img.png'

            that.covers[1].latitude = mages.end_address_info.lat;
            that.covers[1].longitude = mages.end_address_info.lng;
            that.covers[1].iconPath='/static/img/locaEnd.png'
          }else{
            that.covers[0].latitude = mages.start_address_info.lat;
            that.covers[0].longitude = mages.start_address_info.lng;
            that.covers[0].iconPath='/static/img/locaStar.png'
          }
        }
        console.log(that.covers)
      })
    },
    methods: {
      /**
       * 抢单
       */
      robOrder(){
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: `${that.LANGUAGE_DATA['是否立即抢单'][that.LANGUAGE]}`,
          cancelText:`${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText:`${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          success(res) {
            console.log('-----------',res)
            if (res.confirm) {
              that.takeOutErrands()
            }
          }
        });
      },

      /**
       * 跑腿抢单
       */
      runErrands(){
        let that = this
        console.log(global.apiUrls.operat)
        that.$api.post(global.apiUrls.operat,{
          order_sn: that.orderContent.order_sn,
          lng: that.longitude,
          lat: that.latitude
        }).then(res=>{
          console.log(res)
          if(res.data.code == 1){
            that.is_remind = true
          }else{
            that.$message.info(res.data.msg)
          }
        }).catch(err => {

        })
      },

      /**
       * 外卖抢单
       */
      takeOutErrands(){
        let that = this
        that.$api.post(global.apiUrls.foodOperat,{
          order_sn: that.orderContent.order_sn,
          lng: that.longitude,
          lat: that.latitude
        }).then(res=>{
          console.log(res)
          if(res.data.code == 1){
            that.is_remind = true
          }else{
            that.$message.info(res.data.msg)
          }
        }).catch(err => {

        })
      },

      // 关闭提醒弹窗
      close(){
        this.is_remind = false
        setTimeout(function(){
          uni.switchTab({
            url: '/pages/tab/tab02/index'
          })
        },1000)
      },

      // 拨打电话
      call(mobile) {
        let _this = this
        if (mobile == '' || mobile == null) {
          _this.$message.info(`${this.LANGUAGE_DATA['暂无联系方式'][this.LANGUAGE]}`);
        } else {
          uni.makePhoneCall({
            phoneNumber: mobile
          });
        }
      },
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
