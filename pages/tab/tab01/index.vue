<template>
  <view class="page-wrapper">
    <view class="tab_title" :style="{'backgroundColor': backgroundColor}">
      <view class="status_bar"></view>
      <view class="title" @tap="handleLocation">
        <view class="title_left">
          <u-icon name="map" color="#ffffff" size="48"></u-icon>
          <text style="font-weight: 600;margin-left: 20rpx;">{{city}}</text>
        </view>
        <view class="title_right">
          <view class="messageBox" :data-url="`/pagecenter/pages/my/messagelist/index`">
            <image src="/static/img/messageIcon.png" mode="" class="messageImg"></image>
            <u-badge type="error" :count="countBum" :is-dot="true" :absolute="true" :offset="site"></u-badge>
          </view>
        </view>
      </view>
      <view class="locationOpen" v-if="isLocation">
        <image class="upward" src="../../../static/img/upward.png"></image>
        开启定位权限，获取当前位置
        <button class="is-open" @click="handleLocation">
          开启
        </button>
        <span @click="handleLocationClose">X</span>
      </view>
    </view>
    <view class="contents">
      <view class="bgImg"></view>
      <!-- <image src="/static/img/indexBg.png" mode="" class="bgImg"></image> -->
      <view class="contentsCon">
        <view class="orderMold">
          <!--  <view class="grabOrders">
            <view class="grabs mar-style" @click="changeOrder(0)">
              <view :class="isCheck == 0 ? 'active' : ''">{{LANGUAGE_DATA['外卖抢单'][LANGUAGE]}}</view>
              <image src="/static/img/lineImg.png" mode="" class="line" v-if="isCheck == 0"></image>
            </view>
            <view class="grabs" @click="changeOrder(1)">
              <view :class="isCheck == 1 ? 'active' : ''">{{LANGUAGE_DATA['跑腿抢单'][LANGUAGE]}}</view>
              <image src="/static/img/lineImg.png" mode="" class="line" v-if="isCheck == 1"></image>
            </view>
          </view>-->
        </view>

        <view class="listBox">
          <block v-for="(item,index) in listData" :key="index">
            <view class="list" v-if="item.is_waimai==1">
              <view class="list_row" @click="jumpPages(item)">
                <view class="lefts">
                  <!-- <text style="color: #999999;">{{LANGUAGE_DATA['订单'][LANGUAGE]}}
                    {{item.order_sn}}</text> -->
                </view>
                <text class="orderCode">#{{item.store_code}}</text>
              </view>
              <view class="list_row hourStyle" @click="jumpPages(item)">
                <view class="gap">
                  <view class="">
                    <text>期望送达时间：</text>
                    <text style="color: #FF4444;">{{item.expect_time}}</text>
                  </view>
                  <!-- <view class="" v-if="item.is_once != 0">{{LANGUAGE_DATA['立即配送'][LANGUAGE]}}</view> -->
                  <!-- <view class="advanc" v-if="item.is_advance == 1">{{LANGUAGE_DATA['需垫付商品费预计'][LANGUAGE]}}{{LANGUAGE_DATA['￥'][LANGUAGE]}}{{item.advance_money}}</view> -->
                </view>
                <view class="list_receipts">
                  <text>{{LANGUAGE_DATA['预计收入'][LANGUAGE]}}</text>
                  <text style="font-size: 32rpx;color: #FF4444;">￥{{item.estimated_income}}</text>
                </view>
              </view>
              <view class="list_con">
                <view class="con_part" @click="jumpPages(item)">
                  <view class="charact">
                    <!-- <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="item.type == 3"></image>
                    <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="item.type == 1"></image> -->
                    <image src="/static/img/take-img.png" mode="" class="icon_img"></image>
                    <view class="disRang">{{item.start_distance}}km</view>
                  </view>
                  <view class="part_right lineStyle">
                    <view class="part_right_address">
                      <view class="addr_dis">{{item.store_info.name}}</view>
                      <view class="addr">
                        {{item.store_info.address}}{{item.store_info.address_desc}}
                      </view>
                    </view>
                    <!-- <image src="/static/img/adres.png" mode=""></image> -->
                  </view>
                </view>
                <view class="con_part" @click="jumpPages(item)">
                  <view class="charact">
                    <image src="/static/img/locaEnd.png" mode="" class="icon_img"></image>
                    <view class="disRang">{{item.end_distance}}km</view>
                  </view>
                  <view class="part_right">
                    <view class="part_right_address">
                      <view class="addr_dis" style="font-size: 26rpx;">
                        {{item.order_info.receiver_name}}({{item.order_info.receiver_mobile}})
                      </view>
                      <view class="addr" style="font-size: 34rpx; color: #333;">
                        {{item.order_info.province}}{{item.order_info.city}}{{item.order_info.district}}{{item.order_info.receiver_address}}
                      </view>
                    </view>
                    <!-- <image src="/static/img/adres.png" mode=""></image> -->
                  </view>
                </view>
              </view>
              <view class="remark">备注：<span style="color:#FD710F" v-if="item.remark">{{item.remark}}</span></view>
              <view class="remark">订单类别：<span style="color:#FD710F" v-if="item.type_name">{{item.type_name}}</span>
              </view>
              <view class="btns" @click="grab(item.order_sn,item.is_waimai)">
                {{LANGUAGE_DATA['立即抢单'][LANGUAGE]}}
              </view>
            </view>
            <view class="list" v-else>
              <view class="list_row" @click="jumpPages(item)">
                <view class="lefts">
                  <view class="">
                    <image src="/static/img/take1.png" mode="" class="takeTip" v-if="item.type == 2"></image>
                    <image src="/static/img/take2.png" mode="" class="takeTip" v-if="item.type == 3"></image>
                    <image src="/static/img/take3.png" mode="" class="takeTip" v-if="item.type == 1"></image>
                  </view>
                  <text style="color: #999999;">{{LANGUAGE_DATA['订单'][LANGUAGE]}}
                    {{item.order_sn}}</text>
                </view>
                <text class="orderCode">#{{item.pick_code}}</text>
              </view>
              <view class="list_row hourStyle" @click="jumpPages(item)">
                <view class="gap">
                  <view class="">
                    <text v-if="item.type == 3">期望送达时间：</text>
                    <text style="color: #FF4444;">{{item.pickup_time}}</text>
                  </view>
                </view>
                <view class="list_receipts">
                  <text>{{LANGUAGE_DATA['预计收入'][LANGUAGE]}}</text>
                  <text style="font-size: 28rpx;color: #FF4444;">{{item.estimated_income}}</text>
                </view>
              </view>
              <view class="list_con">
                <view class="con_part" @click="jumpPages(item)" v-if="item.is_nearby == 0">
                  <view class="charact">
                    <!-- <image src="/static/img/locaEnd.png" mode="" class="icon_img" v-if=" "></image> -->
                    <image src="/static/img/take-img.png" mode="" class="icon_img"
                      v-if="item.type == 1 || item.type == 2"></image>
                    <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="item.type == 3"></image>
                    <view class="disRang">{{item.start_address_info.distance}}km</view>
                  </view>
                  <view class="part_right lineStyle">
                    <view class="part_right_address">
                      <view class="addr_dis">{{item.start_address_info.name}}</view>
                      <view class="addr">
                        {{item.start_address_info.province}}{{item.start_address_info.city}}{{item.start_address_info.district}}{{item.start_address_info.address}}
                      </view>
                    </view>
                    <!-- <image src="/static/img/adres.png" mode="" class="addr_img"></image> -->
                  </view>
                </view>
                <view class="con_part" @click="jumpPages(item)" v-if="item.mode != 2">
                  <view class="charact">
                    <!-- <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="item.type == 1"></image> -->
                    <image src="/static/img/locaEnd.png" mode="" class="icon_img"></image>
                    <!-- <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="item.type == 3 item.type == 1 || item.type == 2"></image> -->
                    <view class="disRang">{{item.end_address_info.distance}}km</view>
                  </view>
                  <view class="part_right">
                    <view class="part_right_address">
                      <view class="addr_dis" style="font-size: 26rpx;">
                        {{item.end_address_info.name}}
                      </view>
                      <view class="addr" style="font-size: 34rpx; color: #333;">
                        {{item.end_address_info.province}}{{item.end_address_info.city}}{{item.end_address_info.district}}{{item.end_address_info.address}}
                      </view>
                    </view>
                    <!-- <image src="/static/img/adres.png" mode="" class="addr_img"></image> -->
                  </view>
                </view>
                <view class="con_part" @click="jumpPages(item)" v-if="item.mode == 2">
                  <view class="charact"></view>
                  <view class="part_right">
                    <image :src="item.end_address" mode="aspectFill" class="addressPhoto"></image>
                  </view>
                </view>
              </view>
              <view class="btns" @click="grab(item.order_sn,item.is_waimai)">
                {{LANGUAGE_DATA['立即抢单'][LANGUAGE]}}
              </view>
            </view>
          </block>
        </view>

        <!-- <fu-empty
          :paging-list-loaded-all="pagingListLoadedAll"
          :paging-list-no-list-data="pagingListNoListData"
          :list-data-length="listDataLength"
        ></fu-empty> -->

        <view class="loading-wapper" v-if="!loadedAll && !noListData">
          <view class="loading-icon"></view>
          <text class="loading-txt">加载中</text>
        </view>
        <view class="loading-wapper" v-if="loadedAll && !noListData && listData.length != 0">
          <text class="loading-txt">已加载全部数据~</text>
        </view>


        <view class="public-page-empty" v-if="listData.length==0">
          <!-- <view class="public-page-empty" v-if="(loadedAll && noListData) || (loadedAll && listData.length == 0)"> -->
          <image src="/static/empty/empty111.png" style="width: 400upx; height: 294upx"></image>
          <view class="txt">暂无数据</view>
        </view>
      </view>
    </view>

    <!-- 接单成功提醒 -->
    <view class="remind_prop" v-if="is_remind">
      <view class="prop_box">
        <view class="tx">{{LANGUAGE_DATA['提示'][LANGUAGE]}}</view>
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
  import {
    checkOpenGPSServiceByAndroid,
    androidPermision,
    iosPermision
  } from '@/common/function/device.js';
  import {
    getUpdateCoor
  } from '@/common/function/common.js';
  // import pagingList from '@/common/minix/paging_list.js'
  export default {
    // mixins: [pagingList],
    data() {
      return {
        // minixPagingListsApi: global.apiUrls.orderList,                     // 接口
        // allowOnloadGetList: false,                                         // 禁止一进入页面就加载接口
        city: global.userInfo ? global.userInfo.province + '-' + global.userInfo.city : '',
        lng: '121.45417', // 经度
        lat: '37.491969', // 维度

        showCkeck: false,
        is_remind: false,
        checked: true, // 0 休息  1工作
        isCheck: 0, // 0 跑腿 1 外卖
        orderType: '全部订单', //  全部订单  即时订单 预约订单
        orderTypeNum: '-1', // -1全部订单  0即时订单  1预约订单
        isOpenType: false, // 是否选择打开选择订单的弹窗
        surplusTime: 0, // 剩余时间
        surplusNum: 0,
        isLocation: false,
        orderSn: '', // 当前选择的订单的订单编号
        countBum: 0, // 消息角标
        site: [20, 30], // 消息角标自定义位置
        isOk: 1, // 1 抢单成功 0抢单失败
        backgroundColor: 'rgba(28, 181, 248, 0)',

        InterfaceApi: global.apiUrls.orderList, // 接口
        listData: [], // 订单列表数据
        page: 1, // 分页
        allowLoadMore: true, // 允许加载更多
        loadedAll: false, // 已加载全部数据
        noListData: false, // 没有列表数据
      }
    },
    onPageScroll(e) {
      // 监听页面滚动距离
      this.backgroundColor = 'rgba(28, 181, 248,' + e.scrollTop / 300 + ')';
    },
    computed: {
      memberData() {
        console.log(12121)
        console.log(this.$store.state.getData)
        return this.$store.state.getData;
      },
    },
    watch: {
      async memberData() {
        await this.getListData() //这是我监听数据变化调用接口更新页面数据
        this.$refs.uToast.show({
          title: '更新数据了',
          // 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
          type: 'success',
          position: 'top ',
          // 如果不需要图标，请设置为false
          icon: true
        })
      }
    },
    onLoad() {
      if (!global.userInfo) {
        uni.reLaunch({
          url: '/pagecenter/pages/login/login/index'
        });
      }
      // let that = this
      // // #ifdef H5
      // this.allowOnloadGetList = true
      // this.pagingListToggle()
      // // #endif

      this.getListData()

      if (global.token) {
        this.getUser()
        this.getTidings()
      }

      uni.$on('notice', res => {
        // this.pagingListToggle()
        this.page = 1;
        this.allowLoadMore = true;
        this.loadedAll = false;
        this.noListData = false;
        this.listData = [];
        this.getListData(() => {
          uni.stopPullDownRefresh();
        });
      })
      uni.$on('messagreNotice', res => {
        this.getTidings()
      })
      // uni.$on('NEW_ORDERCE',res=>{
      // 	console.log(res.msg)
      // 	this.$message.info(res.msg)
      // })
    },
    onShow() {
      // if (global.token) {
      // 	this.getlocat()
      // 	// this.getTidings()
      // }
      if (global.LANGUAGE == 'zh-cn') {
        this.switchShow = true
        uni.setTabBarItem({
          index: 0,
          text: '抢单大厅',
        })
        uni.setTabBarItem({
          index: 1,
          text: '订单',
        })
        uni.setTabBarItem({
          index: 2,
          text: '我的',
        })
      } else {
        this.switchShow = false;
        uni.setTabBarItem({
          index: 0,
          text: 'Order receiving',
        })
        uni.setTabBarItem({
          index: 1,
          text: 'Order received',
        })
        uni.setTabBarItem({
          index: 2,
          text: 'Personal Center',
        })
      }
      var that = this;
      console.log(uni.getStorageSync('isLocation'))
      if (that.isLocation) {
        checkOpenGPSServiceByAndroid()
      }
      if (uni.getSystemInfoSync().platform === 'android') {
        if (!uni.getStorageSync('isLocation')) {
          that.isLocation = true;
        } else {
          setTimeout(function() {
            androidPermision('android.permission.ACCESS_FINE_LOCATION').then(res => {
              if (res === 1) {
                that.getlocat();
              } else if (!res) {
                that.isLocation = true;
              }
            })
          }, 1000)
        }
      } else if (uni.getSystemInfoSync().platform === 'ios') {
        //检测ios是否开启定位/
        iosPermision('location').then(res => {
          if (res) {
            that.getlocat()
          } else {
            that.isLocation = true;
          }
        })

      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      uni.showLoading({})
      console.log(this.tabAc)
      this.page = 1;
      this.allowLoadMore = true;
      this.loadedAll = false;
      this.noListData = false;
      this.listData = [];
      uni.hideLoading({})
      this.getListData(() => {
        console.log("下拉刷新成功")
        uni.stopPullDownRefresh()
      });
    },
    onUnload() {
      uni.$off('NEW_ORDERCE')
    },
    //上拉加载更多
    onReachBottom(e) {
      this.getListData();
    },
    methods: {
      // pagingListPostData(){
      //   return { lng: this.lng, lat: this.lat, city: this.city, type: this.isCheck, is_once: this.orderTypeNum }
      // },

      /**
       * 获取未读消息标识
       */
      getTidings() {
        this.$api.post(global.apiUrls.informats).then(res => {
          if (res.data.code == 1) {
            this.countBum = res.data.data
          } else {

          }
        }).catch(err => {

        })
      },

      /**
       * 获取个人信息(是否是工作状态)（获取骑手的认证信息）
       */
      getUser() {
        // 请求路径为：601f3acd328dc
        // 根据url中的注释，这个方法是用来获取骑手的认证信息
        this.$api.post(global.apiUrls.getRiderMsg).then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.checked = res.data.data == 1 ? true : false
          } else {
            this.$message.info(res.data.msg)
          }
        }).catch(err => {

        })
      },

      /**
       * 获取订单列表数据
       */
      getListData() {
        if (!this.allowLoadMore || this.loadedAll || this.noListData) return;
        this.allowLoadMore = false;
        this.$api.post(this.InterfaceApi, {
          lng: this.lng,
          lat: this.lat,
          city: this.city,
          type: this.isCheck,
          is_once: this.orderTypeNum
        }).then(res => {
          // console.log(res)
          uni.stopPullDownRefresh()
          if (res.data.code == 1) {
            console.log(res.data)
            if (res.data.data.length > 0) {
              let tempLists = res.data.data,
                totalPage = res.data.data.last_page,
                listData = this.listData;
              this.listData.push(...tempLists);
              console.log('订单数据', this.listData);
              this.allowLoadMore = true;
              this.loadedAll = true;
              if (this.page >= totalPage) this.loadedAll = true;
              if (this.page == 1 && this.listData.length == 0) this.noListData = true;
              this.page += 1;

            } else {
              this.noListData = true
            }
          } else {
            this.allowLoadMore = true;
          }
          if (fn) fn();
        }).catch(err => {
          uni.stopPullDownRefresh()
          this.allowLoadMore = true;
        })
      },

      /**
       * 设置骑手状态
       */
      setWork() {
        this.$api.post(global.apiUrls.setStatus, {
          is_open: this.checked ? 1 : 0
        }).then(res => {
          console.log(res)
          this.$message.info(res.data.msg)
          if (res.data.code == 1) {

          } else {

          }
        }).catch(err => {

        })
      },

      /**
       * 切换订单类型
       */
      changeOrder(type) {
        this.isCheck = type
        if (type == 0) {
          this.InterfaceApi = global.apiUrls.orderList
        } else {
          this.InterfaceApi = global.apiUrls.runList
        }
        // this.pagingListToggle()
        this.page = 1;
        this.allowLoadMore = true;
        this.loadedAll = false;
        this.noListData = false;
        this.listData = [];
        this.getListData(() => {
          uni.stopPullDownRefresh();
        });
      },

      /**
       * 切换订单类型 全部订单，及时订单，预约订单
       */
      changeOrderType() {
        this.isOpenType = !this.isOpenType
      },
      choseStatus(type, name) {
        this.orderType = name
        this.orderTypeNum = type
        this.isOpenType = false
        this.pagingListToggle()
      },

      // 获取经纬度
      getlocat() {
        let that = this
        uni.getLocation({
          type: 'gcj02', //返回可以用于uni.openLocation的经纬度
          success: function(res) {
            console.log(res)
            uni.setStorageSync('isLocation', true)
            that.lat = res.latitude;
            that.lng = res.longitude;
            that.$nextTick(function() {
              that.isLocation = false;
            })
            // that.allowOnloadGetList = true
            // that.pagingListToggle()
            // #ifdef APP-PLUS
            that.page = 1;
            that.allowLoadMore = true;
            that.loadedAll = false;
            that.noListData = false;
            that.listData = [];
            that.getListData(() => {
              uni.stopPullDownRefresh();
            });
            getUpdateCoor(res.latitude,res.longitude)
            // #endif
          },
          fail: err => {
            checkOpenGPSServiceByAndroid();
            console.log(err)
            uni.setStorageSync('isLocation', false);
          }
        });
      },

      /**
       * 跳转页面
       */
      jumpPages(item) {
        uni.navigateTo({
          url: '/pages/index/no-take-detail/index?type=' + item.is_waimai,
          success: function(res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              data: item
            })
          }
        })
      },

      // 抢单
      grab(orderSn, type) {
        let that = this
        that.orderSn = orderSn
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: `${that.LANGUAGE_DATA['是否立即抢单'][that.LANGUAGE]}`,
          cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          success(res) {
            console.log('-----------', res)
            if (res.confirm) {
              if (type == 1) {
                that.takeOutErrands()
              } else {
                that.runErrands()
              }
            }
          }
        });
      },

      /**
       * 跑腿抢单
       */
      runErrands() {
        let that = this
        that.$api.post(global.apiUrls.operat, {
          order_sn: that.orderSn,
          lng: that.lng,
          lat: that.lat
        }).then(res => {
          console.log(res)
          if (res.data.code == 1) {
            that.is_remind = true
            // that.pagingListToggle()
            that.page = 1;
            that.allowLoadMore = true;
            that.loadedAll = false;
            that.noListData = false;
            that.listData = [];
            that.getListData(() => {
              uni.stopPullDownRefresh();
            });
          } else {
            that.$message.info(res.data.msg)
          }
        }).catch(err => {

        })
      },

      /**
       * 外卖抢单
       */
      takeOutErrands() {
        let that = this
        that.$api.post(global.apiUrls.foodOperat, {
          order_sn: that.orderSn,
          lng: that.lng,
          lat: that.lat
        }).then(res => {
          console.log(res)
          if (res.data.code == 1) {
            that.is_remind = true
            // that.pagingListToggle()
            that.page = 1;
            that.allowLoadMore = true;
            that.loadedAll = false;
            that.noListData = false;
            that.listData = [];
            that.getListData(() => {
              uni.stopPullDownRefresh();
            });
          } else {
            that.$message.info(res.data.msg)
          }
        }).catch(err => {

        })
      },
      handleLocation() {
        this.getlocat();
        uni.$emit('getIntervalAddress');
      },
      handleLocationClose() {
        this.isLocation = false;
      },
      // 关闭提醒弹窗
      close() {
        this.is_remind = false
        setTimeout(function() {
          uni.switchTab({
            url: '/pages/tab/tab02/index'
          })
        }, 1000)
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
      }
    }
  }
</script>

<style lang="scss">
  @import './index.scss';
</style>
