<template>
  <view @touchmove.stop.prevent :class="{'modal-box': true, 'modal-box-show': showModal, 'modal-box-show1': showModal1}">
    <view class="mask" @tap="handleClick('cancel')"></view> 
    <view class="modal">
      <view class="title">接单提醒</view>
      <view class="titleTips">
        <view class="">系统分配订单</view>
        <view class="">
          <text style="color: #999999;">确认时间</text>
          <text style="color: #FF4444;">60s</text>
        </view>
      </view>
      <view class="orderMsgBox">
        <view class="list_row lineStyle">
          <view class="gap">
            <view class="" v-if="msgContent.is_once == 0">
              <text>预计送达时间：</text>
              <text>{{msgContent.expect_time}}</text>
            </view>
            <view class="" v-if="msgContent.is_advance == 1">需垫付商品费预计</view>
            <view class="" v-if="msgContent.is_once != 0">立即配送</view>
          </view>
          <view class="list_receipts">
            <text>预计收入</text>
            <text style="font-size: 32rpx; font-weight: 600;color: #FF4444;">{{msgContent.estimated_income}}</text>
          </view>
        </view>
        <view class="list_con lineStyle">
          <view class="con_part">
            <view class="charact">
              <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="msgContent.order_type == 0"></image>
              <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="msgContent.order_type == 1"></image>
              <view class="">{{msgContent.start_distance}}km</view>
            </view>
            <view class="part_right">
              <view class="part_right_address">
                <view class="addr_dis">{{msgContent.start_address_info.name}}</view>
                <view class="addr">{{msgContent.start_address_info.address}}{{msgContent.start_address_info.address_detail}}</view>
              </view>
              <image src="/static/img/mobile.png" mode="" @click="call(msgContent.start_address_info.mobile)"></image>
            </view>
          </view>
          <view class="con_part two_part">
            <view class="charact">
              <image src="/static/img/locaEnd.png" mode="" class="icon_img"></image>
              <view class="">{{msgContent.end_distance}}km</view>
            </view>
            <view class="part_right">
              <view class="part_right_address">
                <view class="addr_dis">{{msgContent.end_address_info.name}}</view>
                <view class="addr">{{msgContent.end_address_info.address}}{{msgContent.end_address_info.address_detail}}</view> 
              </view>
              <image src="/static/img/mobile.png" mode="" @click="call(msgContent.end_address_info.receiver_mobile)"></image>
            </view>
          </view>
        </view>
        <view class="lookDel" @click="lookDetails(msgContent)">查看详情</view>
      </view>
      <view class="allBtn">
        <view class="btns refuse" @click="rejectOrder">拒绝接单</view>
        <view class="btns taking" @click="grab(msgContent.order_sn)">确认接单</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'custom-pop-modal',
  data() {
    return {
      showCancel: true,
      showModal: false,
      showModal1: true,
      content: '',
      title: '',
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#333333',
      cancelColor: '#333333',
      contentColor: '#999999',
      
      msgContent:'',
    }
  },
  methods: {
    handleShow(options){
      this.msgContent = options
      for(let key in options) if(key != 'success') this[key] = options[key]
      this.showModal = true;
      this.showModal1 = false;
    },
    handleClick(type){
      this.showModal = false;
      global.customShowModelPopupSucess({[type]: true})
      // setTimeout(()=>{
      // #ifdef APP-PLUS
      uni.navigateBack()
      // #endif
      this.showModal1 = true;
      global.customShowModelPopupOptions = null;
      global.customShowModelPopupSucess = null;
      // }, 10)
    },
    
    /**
     * 跳转页面
     */
    lookDetails(item){
      uni.navigateTo({
        url: '/pages/index/no-take-detail/index?type=' + this.isCheck,
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
        }
      })
    },
    
    /**
     * 返回上一页
     */
    rejectOrder(){
      uni.reLaunch({
        url: '/pages/tab/tab01/index'
      })
    }
  }
};

</script>

<style lang="scss">
.modal-box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: block;
  box-sizing: border-box;
  z-index: 999999;
  transition: all ease .3s;
  // transition: opacity .6s ease-in-out;
  opacity: 0;

  .mask {
    position: fixed;
    z-index: 1300;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    // transition: all ease .3s;
  }

  .modal {
    // transition: all ease .3s;
    position: fixed;
    z-index: 1300;
    width: 100%;
    // max-width: 300px;
    bottom: 0;
    left: 0;
    // -webkit-transform: translate(-50%, -50%);
    // transform: translate(-50%, -50%);
    background-color: #fff;
    text-align: center;
    overflow: hidden;
    border-radius: 8px 8px 0 0;
    padding: 40rpx 24rpx;
    .title{
      font-size: 32rpx;
    }
    .titleTips{
      display: flex;
      flex-direction: row;   
      align-items: center;
      justify-content: space-around; 
      margin-top: 32rpx;
      font-size: 28rpx;
      padding: 0 140rpx;
    }
    .orderMsgBox{
      background-color: #F8F8F8;
      margin-top: 24rpx;
      .lineStyle{
        position: relative;
        &:after {
          @include bottom-line(#eee)
        }
      }
      .list_row{
        display: flex;
        flex-direction: row;   
        align-items: flex-start;
        justify-content: space-between;
        padding: 27rpx 24rpx;
        .status_txt{
          font-size: 24rpx;
          color: #666666;
          display: block;
          margin-top: 20rpx;
        }
        .gap{
          font-size: 28rpx;
        }
        .list_receipts{
          margin-left: -32rpx;
          font-size: 24rpx;
          padding: 0 20rpx 0 32rpx;
          display: inline-block;
        }
      }
      .list_con{
        padding: 40rpx 24rpx 32rpx;
        position: relative;
        .con_part{
          display: flex;
          flex-direction: row;   
          align-items: center;
          .charact{
            font-size: 18rpx;
            margin-right: 15rpx;
            text-align: center;
            .icon_img{
              width: 33rpx;
              height: 36rpx;
            }
          }
          .part_right{
            flex: 1;
            display: flex;
            flex-direction: row;   
            align-items: center;
            justify-content: space-between;
            .part_right_address{
              text-align: left;
              flex: 1;
              .addr_til{
                font-size: 24rpx;
                color: #999999;
              }
              .addr{
                // margin-top: 8rpx;
                font-weight: 600;
                margin-top: 16rpx;
              }
              .addr_dis{
                font-size: 24rpx;
                color: #999999;
              }
            }
            image{
              width: 57rpx;
              height: 57rpx;
            }
          }
        }
        .two_part{
          margin-top: 40rpx;
        }
        .punct{
          width: 6rpx;
          height: 60rpx; 
          position: absolute;
          left: 8rpx;
          top: 40rpx;
        }
      }
      .lookDel{
        padding: 24rpx 0;
        text-align: center;
        font-size: 24rpx;
        color: #289EEB;
      }
    }
    .allBtn{
      display: flex;
      flex-direction: row;   
      align-items: center;
      justify-content: space-between;
      margin-top: 32rpx;
      .btns{
        width: 342rpx;
        height: 88rpx;
        line-height: 88rpx;
        border-radius: 45px;
        text-align: center;
        font-size: 24rpx;
        // margin: 32rpx auto 0;
      }
      .refuse{
        border: 1px solid #BFBFBF;
      }
      .taking{
        background-color: #3994D8;
        color: #fff;
      }
    }
  }
}

.modal-box.modal-box-show {
  opacity: 1;
}

.modal-box.modal-box-show1 {
  z-index: -1;
}
</style>
