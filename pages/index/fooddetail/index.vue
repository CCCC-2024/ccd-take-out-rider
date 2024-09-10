<template>
  <view class="page-wrapper">
    <view class="map">
      <view style="width: 100%;height: 250px;overflow: hidden;">
        <map style="width: 100%; height: 250px;" :latitude="latitude" :longitude="longitude" :markers="covers" :scale="13"></map>
      </view>
    </view>
    <view class="contents" :style="{'padding-bottom': padding + 'rpx'}" v-if="isShow">
      <view class="list listStatus">
        <view class="list_row ">
          <view class="" v-if="contents.after_sale == 0">
            <view class="list_row_left" v-if="contents.status == 4">待骑手取货</view>
            <view class="list_row_left" v-if="contents.status == 5">配送中</view>
            <view class="list_row_left" v-if="contents.status == 6">已送达</view>
            <view class="list_row_left" v-if="contents.status == 7">前往商家</view>
          </view>
          <view class="" v-if="contents.after_sale != 0">
            <view class="list_row_left" v-if="contents.after_sale == -2">售后-用户取消</view>
            <view class="list_row_left" v-if="contents.after_sale == -1">售后-驳回</view>
            <view class="list_row_left" v-if="contents.after_sale == 1">售后-审核中</view>
            <view class="list_row_left" v-if="contents.after_sale == 2">售后-审核通过</view>
          </view>
          
          <view class="list_row_left">#{{contents.store_code}}</view>
        </view>
      </view>
      <view class="list">
        <view class="linType">
          <view class="list_row">
            <view class="expect">
              <text v-if="contents.status == 6">{{LANGUAGE_DATA['送达时间'][LANGUAGE]}}: </text>
              <text v-else>{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}}: </text>
              <text style="color: #FD710F;font-size:36rpx;font-weight: 700;">{{contents.forecast_time}}</text>
            </view>
            <view class="gain">
              <text v-if="contents.status == 6">本次收入</text>
              <text v-else>{{LANGUAGE_DATA['预计收入'][LANGUAGE]}}</text>
              <text class="money">￥{{contents.rider_profits}}</text>
            </view>
          </view>
          <view class="timing" v-if="contents.is_once == 1 || contents.is_once == 0">
            <text class="orderNum" v-if="contents.is_once == 1 && times != 0">耗时：{{times}}</text>
            <text class="orderNum" v-if="contents.is_once == 0 && surplusTime != 0">配送剩余：{{surplusTime}}</text>
          </view>
        </view>
        <view class="list_con">
          <view class="con_part">
            <view class="charact">
              <image src="/static/img/take-img.png" mode="" class="icon_img"></image>
              <view class="disRang">{{contents.store_distance}}km</view>
            </view>
            <view class="part_right" >
              <view class="addr_dis">
                <text>{{contents.store_info.name}}</text>
              </view>
              <view class="address-style">
                <view class="addr">{{contents.store_info.address}}{{contents.store_info.address_desc}}</view>
                <image src="/static/img/adres.png" mode="" class="addr-img1" v-if="contents.status != 6" @click="look_local(contents.store_info,'start')"></image>
                <image src="/static/img/mobile.png" mode="" class="addr-img2" v-if="contents.status != 6" @click="call(contents.store_info.mobile)"></image>  
              </view>
            </view>
          </view>
          <view class="con_part two_part">
            <view class="charact">
              <image src="/static/img/locaEnd.png" mode="aspectFill" class="icon_img"></image>
              <view class="disRang">{{contents.store_user_distance}}km</view>
            </view>
            <view class="part_right">
              <view class="addr_dis">
                <text>{{contents.order_info.receiver_name}}({{contents.order_info.receiver_mobile.substring(0, 3) +"****"+ contents.order_info.receiver_mobile.substr(contents.order_info.receiver_mobile.length-4)}})</text>
              </view>
              <view class="address-style">
                <view class="addr">{{contents.order_info.province}}{{contents.order_info.city}}{{contents.order_info.district}}{{contents.order_info.receiver_address}}</view>
                <image src="/static/img/adres.png" mode="aspectFill" class="addr-img1" v-if="contents.status != 6" @click="look_local(contents.order_info,'end')"></image>
                <image src="/static/img/mobile.png" mode="" class="addr-img2" v-if="contents.status != 6" @click="call(contents.order_info.receiver_mobile)"></image>
              </view>
            </view>
          </view>
        </view>
        <view class="btnsBox">
          <!-- 讲状态= 4的取消订单隐藏，变成状态=4展示转派订单 -->
          <!-- <view class="pickBtns cleanBtn" v-if="contents.status == 4" @click="cancelOperat(contents.order_sn)">{{LANGUAGE_DATA['取消接单'][LANGUAGE]}}</view> -->
          <view class="pickBtns cleanBtn" v-if="contents.status == 7 || contents.status == 4" @click="transOrder(contents.order_sn)">{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}</view>
          <view class="pickBtns pickStyle" v-if="contents.status == 4" @click="pickup(contents.order_sn)">{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}</view>
          <view class="pickBtns pickStyle" v-if="contents.status == 7" @click="arriveOrder(contents.order_sn)">{{LANGUAGE_DATA['到达商家'][LANGUAGE]}}</view>
          <view class="pickBtns cleanBtn" v-if="contents.status == 5"  @tap="handleJump" :data-url="`/pages/index/delayed/index?order=${contents.order_sn}`">{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}</view>
          <view class="pickBtns pickStyle" v-if="contents.status == 5" @click="ImmedService(contents.order_sn)">确认到店</view>
        </view>
        <!-- <view class="btns" v-if="contents.status == 5" @click="ImmedService(contents.no_contact)">{{LANGUAGE_DATA['确认送达'][LANGUAGE]}}</view> -->
      </view>
      <view class="goods_del">
        <view class="del_title">
          <view class="shop_name">{{contents.store_info.name}}</view>
        </view>
        <view class="del_con">
          <view class="item" v-for="(item,index) in contents.order_goods">
            <image :src="item.goods_thumb" mode="aspectFill"></image>
            <view class="item_right">
              <view class="rit rit_top">
                <view class="limit goods_name">{{item.goods_name}}</view>
                <view class="">
                  <text style="font-size: 28rpx;">￥</text>
                  <text style="font-size: 36rpx; font-weight: 600;">{{item.shop_price}}</text>
                </view>
              </view>
              <view class="rit_btm" v-if="item.sku_name != ''">{{item.sku_name}}</view>
              <view class="rit rit_btm">
                <!-- <view class="limit goods_tip">{{item.sku_name}}</view> -->
                <view class="">x {{item.num}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="goods_del">
        <view class="remarks">
          <view class="remarks_til">{{LANGUAGE_DATA['备注'][LANGUAGE]}}</view>
          <view class="remarks_con" v-if="contents.remark != ''">{{contents.remark}}</view>
          <view class="remarks_con" v-else>{{LANGUAGE_DATA['暂无备注信息'][LANGUAGE]}}</view>
        </view>
      </view>
      <view class="order_msg">
        <view class="msg_bt">{{LANGUAGE_DATA['订单信息'][LANGUAGE]}}</view>
        <view class="msg_item">
          <text class="msgLeft">{{LANGUAGE_DATA['订单编号'][LANGUAGE]}}</text>
          <view class="order_sn">
            <text>{{contents.order_sn}}</text>
            <text class="copy" @click="copy_cli(contents.order_sn)">{{LANGUAGE_DATA['复制'][LANGUAGE]}}</text>
          </view>
        </view>
        <view class="msg_item">
          <text class="msgLeft">{{LANGUAGE_DATA['下单时间'][LANGUAGE]}}</text>
          <text>{{contents.create_time}}</text>
        </view>
        <view class="msg_item">
          <text class="msgLeft">{{LANGUAGE_DATA['配送费'][LANGUAGE]}}</text>
          <text>￥{{contents.rider_profits}}</text>
        </view>
      </view>
      <!-- <view class="order_msg">
        <view class="msg_bt">{{LANGUAGE_DATA['商家取餐说明'][LANGUAGE]}}</view>
      </view> -->
    </view>
    
    <!-- <view class="footerBtn" v-if="contents.status == 6">
      <view class="btns" v-if="contents.status == 6 && contents.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${contents.order_sn}&type=1`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
      <view class="btns" v-if="contents.status == 6 && contents.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${contents.order_sn}&type=1`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view>
    </view> -->
  </view>
</template>

<script>
  import { validate, UploadImg } from '@/common/utils/index';
  let wv,topHeight = 0;
  export default {
    data() {
      return {
        type: 1,
        orderSn: '',
        contents: {},                                    //    订单详情数据信息
        covers: [{
          latitude: '',
          longitude: '',
          iconPath: '',
          width: '120',
          height: '120',
          callout: {
            content: '发货地址',
            fontSize: '32',
            borderRadius: '10',
            bgColor: '#fff'
          }
        }, {
          latitude: '',
          longitude: '',
          iconPath: '',
          width: '120',
          height: '120',
          callout: {
            content: '收货地址',
            fontSize: '32',
            borderRadius: '10',
            bgColor: '#fff'
          }
        }, {
          latitude: '',
          longitude: '',
          iconPath: '',
          width: '90',
          height: '90',
          callout: {
            content: '骑手位置',
            fontSize: '32',
            borderRadius: '10',
            bgColor: '#fff'
          }
        }], // 地图展示信息
        longitude: '',
        latitude: '',
        padding: '20',                                   // 动态改变 padding值
        isShow: false,                                   // 是否展示内容
        
        times: 0,                                        //  耗时  正计时
        surplusTime: 0,                                  // 配送剩余时间 倒计时
				
				isGrounding: 0,                                 // 0 隐藏  =1 展示
      }
    },
    onLoad(option) {
      this.orderSn = option.orderSn
      this.getMsg()
      this.Getaddress()
      
      uni.$on('succ', res =>{
        this.getMsg()
      })
    },
    methods: {
      // 获取订单详情信息
      getMsg() {
        this.$api.post(global.apiUrls.takeOrderDel, {
          order_sn: this.orderSn
        }).then(res => {
          console.log(res)
          this.isShow = true
          if (res.data.code == 1) {
            this.contents = res.data.data
            // covers[0]: 用户位置, covers[1]: 商家位置, covers[2]：骑手位置
            this.covers[0].latitude = res.data.data.order_info.lat;
            this.covers[0].longitude = res.data.data.order_info.lng;
            
            this.covers[1].latitude = res.data.data.store_info.lat;
            this.covers[1].longitude = res.data.data.store_info.lng;
            
            this.covers[1].iconPath = '/static/img/take-img.png'
            this.covers[0].iconPath = '/static/img/locaEnd.png' 
            
            if(res.data.data.status == 7 || res.data.data.status == 5){
              if(res.data.data.is_once == 1){
                this.takeTime(res.data.data.take_time_rider)
              }else if(res.data.data.is_once == 0){
                this.residue(res.data.data.surplus_time)
              }
            }
            
            if(res.data.data.status == 6){
              this.padding = 160
            }
          } else {

          }
        })
      },
      
      /**
       * 时间正计时
       */
      takeTime(time){
        // console.log('123')
        var self = this;
        let count = 0;
        let nowTime = 0
        // time : 下单时间
        var myDate = new Date();
        var timestamp =Date.parse(new Date());
        var vartimestamp = new Date().getTime()
        let surplus = (timestamp - (Number(time * 1000))) / 1000
        let timer = setTimeout(() => {
          var hour = 0, minute = 0, second = 0;
          hour = parseInt(surplus/60/60);
          minute = parseInt(surplus/60%60);
          second = parseInt(surplus%60);
          // console.log(hour,minute,second)
          nowTime = self.toDouble(hour)+":"+self.toDouble(minute)+":"+self.toDouble(second);
          surplus++;
          self.takeTime(time)
          self.times = nowTime
        }, 1000)
        return;
      }, 
      toDouble(num){
        if(num < 10){
          return '0'+ num;
        }else{
          return '' + num;
        }
      },
      
      /**
       * 配送剩余时间  倒计时
       */
      residue(time){
        let timer = setTimeout(() => {
          let leftd = Math.floor(time/(60*60*24))  //计算天数
          let lefth = Math.floor(time/(60*60)%24)  //计算小时数
          let leftm = Math.floor(time/(60)%60)   //计算分钟数
          let lefts = Math.floor(time%60)         //计算秒数
          
          if(lefth == 0){
            this.surplusTime = leftm + "：" + lefts
          }else{
            this.surplusTime = lefth + "：" + leftm + "：" + lefts
          }
          time--
          if (time > 0) {
            this.residue(time)
          } else {
            clearTimeout(timer)
          }
        }, 1000)
      },
      
      
      /**
       * 获取经纬度
       */ 
      Getaddress() {
        let that = this
        // #ifdef H5
        // that.covers[2].latitude = '34.738115';
        // that.covers[2].longitude = '113.642936';
        // that.covers[2].iconPath = '/static/img/rider.png'
        // #endif
        uni.getLocation({
          type: 'gcj02',
          success: function(res) {
            console.log('当前位置的经度：' + res.longitude);
            console.log('当前位置的纬度：' + res.latitude);
            if (global.userInfo) {
              // #ifdef APP-PLUS
							that.latitude = res.latitude
							that.longitude = res.longitude
              that.covers[2].latitude = res.latitude;
              that.covers[2].longitude = res.longitude;
              that.covers[2].iconPath = '/static/img/rider.png'
              // #endif
            }
          }
        });
      },

      /**
       * 取货
       */ 
      pickup(orderSn) {
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: `${that.LANGUAGE_DATA['确认取货'][that.LANGUAGE]}`,
          cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          success(res) {
            console.log('-----------', res)
            if (res.confirm) {
              that.$api.post(global.apiUrls.pickOrder, {
                order_sn: orderSn,
                order_type: 1,
              }).then(res => {
                console.log(res)
                that.$message.info(res.data.msg)
                if (res.data.code == 1) {
                  uni.$emit('notice');
                  that.getMsg()
                } else {

                }
              }).catch(err => {

              })
            }
          }
        });
      },
      
      /**
       * 转派订单
       */
      transOrder(orderSn){
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: '是否转单到抢单大厅，5分钟内无人接单，订单由您再次派送?',
          cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          confirmColor: '#1CB5FD',
          cancelColor: '#999999',
          success(res) {
            console.log('-----------', res)
            if (res.confirm) {
              that.$api.post(global.apiUrls.reassOrder1, {
                order_sn: orderSn,
              }).then(res => {
                console.log(res)
                that.$message.info(res.data.msg)
                if (res.data.code == 1) {
                  uni.$emit('notice');
                  that.getMsg()
                } else {
              
                }
              }).catch(err => {
              
              })
            }
          }
        });
      },
      
      /**
       * 到达商家
       */
      arriveOrder(orderSn){
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: '是否到达商家?',
          cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          confirmColor: '#1CB5FD',
          cancelColor: '#999999',
          success(res) {
            console.log('-----------', res)
            if (res.confirm) {
              that.$api.post(global.apiUrls.reachStore, {
                order_sn: orderSn,
              }).then(res => {
                console.log(res)
                that.$message.info(res.data.msg)
                if (res.data.code == 1) {
                  uni.$emit('notice');
                  that.getMsg()
                } else {
                      
                }
              }).catch(err => {
                      
              })
            }
          }
        });
      },
      
      /**
       * 取消订单
       */
      cancelOperat(orderSn){
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: `${that.LANGUAGE_DATA['确认取消当前已接订单?'][that.LANGUAGE]}`,
          cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          success(res) {
            console.log('-----------', res)
            if (res.confirm) {
              that.$api.post(global.apiUrls.abolishOrder, {
                order_sn: orderSn,
                order_type: 1,
              }).then(res => {
                console.log(res)
                that.$message.info(res.data.msg)
                if (res.data.code == 1) {
                  uni.$emit('notice');
                  that.getMsg()
                } else {
        
                }
              }).catch(err => {
        
              })
            }
          }
        });
      },
      
      /**
       * 立即送达
       */ 
      ImmedService(orderSn) {
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: `${that.LANGUAGE_DATA['立即送达此单'][that.LANGUAGE]}`,
          cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          success(res) {
            console.log('-----------', res)
            if (res.confirm) {
              that.$api.post(global.apiUrls.Service, {
                order_sn: orderSn,
                order_type: 1,
              }).then(res => {
                console.log(res)
                that.$message.info(res.data.msg)
                if (res.data.code == 1) {
                  uni.$emit('notice');
                  that.getMsg()
                } else {
        
                }
              }).catch(err => {
        
              })
            }
          }
        });
      },
      
      /**
       * 路线导航
       */ 
      look_local(item, name) {
        console.log(item)
        let latitude = item.lat
        let longitude = item.lng
        let address = ''
        if(name == 'start'){
          address = item.address_desc
        }else{
          address = item.receiver_address
        }
        
        uni.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          address: address,
          success: function () {
            console.log('success');
          }
        });
      },
      
      /**
       * 复制订单号
       */ 
      copy_cli(num) {
        uni.setClipboardData({
          data: num,
          success: function(res) {
            console.log(res);
          }
        });
      },
      
      /**
       * 拨打电话
       */ 
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
			
			/**
			 * 获取是否上架状态
			 */
			getIsShelf(){
				let that = this
				let appSystem = uni.getSystemInfoSync().platform == 'android' ? 2 : 1
				// console.log(appSystem)
				// return;
				// this.version = global.VERSION_CODE
				plus.runtime.getProperty(plus.runtime.appid, (inf) => {
					that.$api.post(global.apiUrls.isShelf,{
						version_number: inf.version, 
						edition: appSystem,
						type: 3
					}).then(res => {
					  if(res.data.code == 1){
					    that.isGrounding = res.data.data.is_show
					  }else{
					  }
					}).catch(err => {
					})
				});
			},
    },
    onNavigationBarButtonTap() {
			if(this.isGrounding == 0){
				this.call(this.contents.order_info.receiver_mobile) 
			}else{
				uni.navigateTo({
				  url: '/pagecenter/pages/my/chates/index?group_id=' + this.contents.user_id + '&group_name=' + this.contents.order_info.receiver_name
				})
			}
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
