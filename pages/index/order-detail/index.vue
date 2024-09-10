<template>
  <view class="page-wrapper">
    <view class="map">
      <view style="width: 100%;height: 250px;">
        <map style="width: 100%; height: 250px;" :latitude="latitude" :longitude="longitude" :markers="covers" :scale="13"></map>
      </view>
    </view>
    <view class="contents" v-if="isShow">
      <view class="list listStatus">
        <view class="list_row_style">
          <view class="list_row_left" v-if="contents.status == 2">{{LANGUAGE_DATA['待取货'][LANGUAGE]}}</view>
          <view class="list_row_left" v-if="contents.status == 3">{{LANGUAGE_DATA['进行中'][LANGUAGE]}}</view>
          <view class="list_row_left" v-if="contents.status == 4">{{LANGUAGE_DATA['已完成'][LANGUAGE]}}</view>
          <view class="status_txt">
            <image src="/static/img/take3.png" mode="" v-if="contents.type == 1"></image>
            <image src="/static/img/take1.png" mode="" v-if="contents.type == 2"></image>
            <image src="/static/img/take2.png" mode="" v-if="contents.type == 3"></image>
          </view>
        </view>
      </view>
      <view class="list">
        <view class="list_row">
          <view class="expect">
            <view class="" v-if="contents.status == 2 || contents.status == 3">
              <text>{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}} </text>
              <text style="color: #FF4444;">{{contents.forecast_time}}</text>
            </view>
            <view class="" v-else>
              <text>{{LANGUAGE_DATA['送达时间'][LANGUAGE]}} </text>
              <text style="color: #FF4444;">{{contents.finish_time}}</text>
            </view>
          </view>
          <view class="gain">
            <text v-if="contents.status == 6">{{LANGUAGE_DATA['收入'][LANGUAGE]}}</text>
            <text v-else>{{LANGUAGE_DATA['预计收入'][LANGUAGE]}}</text>
            <text class="money">{{contents.estimated_income}}</text>
          </view>
          <view class="timing" v-if="contents.is_once == 1 || contents.is_once == 0">
            <text class="orderNum" v-if="contents.is_once == 1">耗时：{{times}}</text>
            <text class="orderNum" v-if="contents.is_once == 0">配送剩余：{{surplusTime}}</text>
          </view>
        </view>
        <view class="list_con">
          <view class="con_part" v-if="contents.is_nearby == 0">
            <view class="charact">
              <!-- <image src="/static/img/locaEnd.png" mode="" class="icon_img" v-if="contents.type == 1"></image> -->
              <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="contents.type == 1 || contents.type == 2"></image>
              <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="contents.type == 3"></image>
              <view class="">{{contents.start_address_info.distance}}km</view>
            </view>
            <view class="part_right" >
              <view class="addr_dis">
                <text>{{contents.start_address_info.name}}</text>
              </view>
              <view class="address-style">
                <view class="addr">{{contents.start_address_info.province}}{{contents.start_address_info.city}}{{contents.start_address_info.district}}{{contents.start_address_info.address}}</view>
                <image src="/static/img/adres.png" mode="" class="addr-img1" v-if="contents.status != 4" @click="look_local(contents.start_address_info,'start')"></image>
                <image src="/static/img/mobile.png" mode="" class="addr-img2" v-if="contents.status != 4" @click="call(contents.start_address_info.mobile)"></image>
              </view>
            </view>
          </view>
          <view class="con_part two_part" v-if="contents.mode != 2">
            <view class="charact">
              <!-- <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="contents.type == 1"v-if="contents.type == 1 || contents.type == 2"></image> -->
              <image src="/static/img/locaEnd.png" mode="" class="icon_img" ></image>
              <view class="">{{contents.end_address_info.distance}}km</view>
            </view>
            <view class="part_right">
              <view class="addr_dis">
                <text>{{contents.end_address_info.name}}</text>
              </view>
              <view class="address-style">
                <view class="addr">{{contents.end_address_info.province}}{{contents.end_address_info.city}}{{contents.end_address_info.district}}{{contents.end_address_info.address}}</view>
                <image src="/static/img/adres.png" mode="" class="addr-img1" v-if="contents.status != 4" @click="look_local(contents.end_address_info,'end')"></image>
                <image src="/static/img/mobile.png" mode="" class="addr-img2" v-if="contents.status != 4" @click="call(contents.end_address_info.receiver_mobile)"></image>
              </view>
            </view>
          </view>
          <view class="con_part two_part" v-if="contents.mode == 2">
            <view class="charact"></view>
            <view class="part_right">
              <image :src="contents.end_address" mode="aspectFill" class="photo" @click="previewImg2(contents.end_address,0)"></image>
            </view>
          </view>
        </view>
        <view class="btnBox">
          <view class="btns hollow" v-if="contents.status == 2" @click="reass(contents.order_sn)">{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}</view>
          <!-- <view class="" v-if="contents.status == 3"></view> -->
          <view class="btns hollow" v-if="contents.status == 3"  @tap="handleJump" :data-url="`/pages/index/delayed/index?order=${contents.order_sn}`">{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}</view>
          <view class="btns solid" v-if="contents.status == 2" @click="pickup(contents.order_sn)">{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}</view>
          <view class="btns solid" v-if="contents.status == 3" @click="ImmedService(contents.is_pickup)">{{LANGUAGE_DATA['确认送达'][LANGUAGE]}}</view>
        </view>
      </view>

      <view class="order_msg" v-if="contents.type == 1">
        <view class="msg_bt">物品信息</view>
        <view class="msg_type">
          <text class="msgLeft">{{LANGUAGE_DATA['物品类型'][LANGUAGE]}}</text>
          <text class="msgRight">{{contents.item_goods_name}}</text>
        </view>
        <view class="msg_type">
          <text class="msgLeft">{{LANGUAGE_DATA['物品重量'][LANGUAGE]}}</text>
          <text>{{contents.item_weight}}kg</text>
        </view>
        <view class="msg_type">
          <text class="msgLeft">{{LANGUAGE_DATA['取件时间'][LANGUAGE]}}</text>
          <text>{{contents.pickup_time}}</text>
        </view>
      </view>
      <view class="order_msg" v-if="contents.type == 3">
        <view class="msg_type">
          <text class="msgLeft">代购商品</text>
          <text class="msgRight">{{contents.item_goods_name}}</text>
        </view>
        <view class="msg_type">
          <text class="msgLeft">预估商品费用</text>
          <text>￥{{contents.item_predict_money}}</text>
        </view>
        <view class="msg_type" v-if="contents.status == 4">
          <text class="msgLeft">送达时间</text>
          <text>{{contents.pickup_time}}</text>
        </view>
        <view class="msg_type">
          <text class="msgLeft">物品重量</text>
          <text>{{contents.item_weight}}kg</text>
        </view>
        <view class="msg_type">
          <text class="msgLeft">是否需要保温箱</text>
          <text>{{contents.is_box == 0 ? '不需要' : '需要'}}</text>
        </view>
        <view class="msg_img" v-if="contents.item_goods_images.length > 0">
          <text class="msgLeft">图片</text>
          <view class="msg_img_box">
            <image :src="item" mode="aspectFill" v-for="(item,index) in contents.item_goods_images" :key="index" @click="previewImg(contents.item_goods_images,index)"></image>
          </view>
        </view>
      </view>
      <view class="goods_del" v-if="contents.is_nearby == 1">
        <view class="remarks">
          <view class="remarks_til">是否就近购买</view>
          <view class="">就近购买</view>
        </view>
      </view>
      <view class="goods_del">
        <view class="remarks">
          <view class="remarks_til">{{LANGUAGE_DATA['订单备注'][LANGUAGE]}}</view>
          <view class="remarks_con" v-if="contents.order_remark != ''">{{contents.order_remark}}</view>
          <view class="remarks_con" v-else>{{LANGUAGE_DATA['暂无备注信息'][LANGUAGE]}}</view>
        </view>
      </view>
      <view class="order_msg">
        <view class="msg_bt">{{LANGUAGE_DATA['订单信息'][LANGUAGE]}}</view>
        <view class="msg_item">
          <text class="msgLeft">{{LANGUAGE_DATA['订单号码'][LANGUAGE]}}</text>
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
          <text class="msgLeft">{{LANGUAGE_DATA['小费'][LANGUAGE]}}</text>
          <text>￥{{contents.tip_money}}</text>
        </view>
        <view class="msg_item">
          <text class="msgLeft">{{LANGUAGE_DATA['跑腿费'][LANGUAGE]}}</text>
          <text>￥{{contents.run_money}}</text>
        </view>
      </view>
    </view>

    <view class="footerBtn" v-if="contents.status == 6">
      <view class="btns" v-if="contents.status == 6 && contents.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${contents.order_sn}&type=0`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view>
      <view class="btns" v-if="contents.status == 6 && contents.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${contents.order_sn}&type=0`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
    </view>

    <!-- 取货码 -->
    <u-popup v-model="show" mode="center" border-radius="10" :mask-close-able="false">
      <view class="propSend">
        <view class="sendTil">{{LANGUAGE_DATA['收货码'][LANGUAGE]}}</view>
        <input type="number" value="" :placeholder="LANGUAGE_DATA['请输入收货码'][LANGUAGE]" v-model="receivCode" />
        <view class="btnBox">
          <view class="btnLeft btns" @click="show = false">{{LANGUAGE_DATA['取消'][LANGUAGE]}}</view>
          <view class="btnRight btns" @click="sureSend">{{LANGUAGE_DATA['确定'][LANGUAGE]}}</view>
        </view>
      </view>
    </u-popup>

  </view>
</template>

<script>
  let wv,topHeight = 0;
  export default {
    data() {
      return {
        type: 1,
        orderSn: '',
        contents: {
          store_info: {
            address: ''
          },
          order_info: {
            receiver_address: ''
          }
        }, // 订单详情数据信息
        names: "订单详情",
        covers: [{
          latitude: '',
          longitude: '',
          iconPath: '',
          width: '120',
          height: '120',
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
          width: '120',
          height: '120',
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
          width: '120',
          height: '120',
          callout: {
            content: '骑手位置',
            fontSize: '16',
            borderRadius: '10',
            bgColor: '#fff'
          }
        }], // 地图展示信息

        show: false,                             // 取货码弹窗
        receivCode: '',                          // 取货码

        padding: '20',

        latitude: '',
        longitude: '',

        isShow: false,                           // 未加载数据的时候不展示内容，避免出现nudefined
        times: 0,                                //  耗时  正计时
        surplusTime: 0,                          // 配送剩余时间 倒计时

				isGrounding: 0,                          // 0 隐藏  =1 展示
      }
    },
    onLoad(option) {
      this.orderSn = option.orderSn
      this.Getaddress()
			this.getIsShelf()

      // #ifdef H5
      // this.latitude = '34.738115'
      // this.longitude = '113.642936'
      // this.getMsg()
      // #endif

      uni.$on('succ', res =>{
        this.getMsg()
      })
    },
    methods: {
      // 获取订单详情信息
      getMsg() {
        this.$api.post(global.apiUrls.orderDel, {
          order_sn: this.orderSn,
          lat: this.latitude,
          lng: this.longitude
        }).then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.isShow = true
            this.contents = res.data.data
            console.log('270------',this.contents)
            // covers[0]: 用户位置, covers[1]: 商家位置, covers[2]：骑手位置
            this.covers[0].latitude = res.data.data.start_address_info.lat;
            this.covers[0].longitude = res.data.data.start_address_info.lng;

            this.covers[1].latitude = res.data.data.end_address_info.lat;
            this.covers[1].longitude = res.data.data.end_address_info.lng;

            // this.covers[0].iconPath = '/static/img/take-img.png'
            // this.covers[1].iconPath = '/static/img/locaEnd.png'
            if(res.data.data.type == 1 || res.data.data.type == 2){
              // 取 => 送
              this.covers[0].iconPath = '/static/img/take-img.png'
              this.covers[1].iconPath = '/static/img/locaEnd.png'
            }else{
              this.covers[0].iconPath = '/static/img/locaStar.png'
            }

            if(res.data.data.status == 2 || res.data.data.status == 3){
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
              that.$api.post(global.apiUrls.runPickOrder, {
                order_sn: orderSn,
                order_type: 0
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
      ImmedService(pink) {
        if(pink == 1){
          this.show = true
        }else{
          this.serviceEnd()
        }
      },

      sureSend(){
        this.severOver()
      },
      severOver(){
        this.show = false
        this.$api.post(global.apiUrls.Service, {
          order_sn: this.orderSn,
          order_type: 0,
          pick_code: this.receivCode
        }).then(res => {
          console.log(res)
          this.$message.info(res.data.msg)
          if (res.data.code == 1) {
            uni.$emit('notice');
            this.getMsg()
          } else {

          }
        }).catch(err => {

        })
      },

      serviceEnd(){
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
          content: `${that.LANGUAGE_DATA['立即送达此单'][that.LANGUAGE]}`,
          cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
          success(res) {
            console.log(res)
            if (res.confirm) {
              that.$api.post(global.apiUrls.runSever, {
                order_sn: that.orderSn,
                order_type: 0
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

      // 获取经纬度
      Getaddress() {
        let that = this
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
              that.getMsg()
              // #endif
            }
          }
        });
      },

      // 复制订单号
      copy_cli(num) {
        uni.setClipboardData({
          data: num,
          success: function(res) {
            console.log(res);
          }
        });
      },

      // 路线导航
      look_local(item,name) {
        console.log(item)
        let latitude = item.lat
        let longitude = item.lng
        let address = item.address

        uni.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          address: address,
          success: function () {
            console.log('success');
          }
        });
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

      /**
       * 预览图片
       */
      previewImg(image,index){
        console.log('544-----------',image,index)
        uni.previewImage({
          current: index,
          urls: image,
          indicator: 'number'
        });
      },
			previewImg2(image,index){
				let imgs = []
				imgs.push(image)
				console.log(imgs)
				uni.previewImage({
				  current: index,
				  urls: imgs,
				  indicator: 'number'
				});
			},

      reass(order_sn){
        let that = this
        uni.showModal({
          title: `${that.LANGUAGE_DATA['提示'][that.LANGUAGE]}`,
          content: `${that.LANGUAGE_DATA['是否转单到抢单大厅，5分钟内无人接单，订单由您再次派送?'][that.LANGUAGE]}`,
          cancelText:`${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
          confirmText:`${that.LANGUAGE_DATA['确认转单'][that.LANGUAGE]}`,
          confirmColor: '#1CB5FD',
          cancelColor: '#999999',
          success(res) {
            console.log(res)
            if (res.confirm) {
              that.$api.post(global.apiUrls.reassOrder2,{
                order_sn: order_sn,
              }).then(res=>{
                console.log(res)
                that.$message.info(res.data.msg)
                if(res.data.code == 1){
                  that.getMsg()
                }else{

                }
              }).catch(err => {

              })
            }
          }
        });
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
