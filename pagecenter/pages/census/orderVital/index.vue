<template>
  <view class="page-wapper">
    <view class="title_sty">
      <view class="status_bar"></view>
      <view class="titles">
        <u-icon name="arrow-left" color="#333333" size="36" @click="back_cli"></u-icon>
        <text>{{LANGUAGE_DATA['订单统计'][LANGUAGE]}}</text>
        <view class="riliImg" @click="show = true">
          <image src="/pagecenter/static/img/rili.png" mode="" v-if="is_check == 'all'"></image>
        </view>
      </view>
    </view>
    <view class="exhibit" v-if="starTime != '' && endTime != ''">
      <view class="exhibit-left">
        <text>{{starTime}}</text>
        <text>{{LANGUAGE_DATA['至'][LANGUAGE]}}</text>
        <text>{{endTime}}</text>
      </view>
      <u-icon name="close-circle-fill" color="#999999" size="36" @click="closeTime"></u-icon>
    </view>
    
    <view class="list-wrapper">
      <view class="orderBox">
        <image src="/pagecenter/static/img/census.png" mode="" class="bgImg"></image>
        <view class="allOrder">
          <view class="">
            <view class="nums">{{orderData.money.today_order_num}}</view>
            <view class="">今日订单</view>
          </view>
          <view class="">
            <view class="nums">{{orderData.money.month_order_num}}</view>
            <view class="">本月订单</view>
          </view>
          <view class="">
            <view class="nums">{{orderData.money.total_order_num}}</view>
            <view class="">累计订单</view>
          </view>
        </view>
      </view>
      <view class="orderList" v-for="(item,index) in orderData.list">
        <view class="times">{{item.date}}</view>
        <view class="orderCont">
          <view class="">
            <view class="nums">{{item.order_num}}</view>
            <view class="">订单数</view>
          </view>
          <view class="">
            <view class="nums">{{item.mileage}}</view>
            <view class="">配送里程(km)</view>
          </view>
          <view class="">
            <view class="nums">{{item.bad}}</view>
            <view class="">差评数</view>
          </view>
          <view class="">
            <view class="nums">{{item.money}}</view>
            <view class="">收入(元)</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 日历 -->
    <u-calendar v-model="show" :mode="mode" @change="change" active-bg-color="#3994D8" btn-type="error">
      <view slot="tooltip"></view>
    </u-calendar>
  </view>
</template>

<script>
export default {
  data() {
    return {
      is_check: 'all',                                                    // 1全部，2收益，3提现记录
      show: false,                                                        // 日历展示隐藏
      mode: 'range',                                                      // 日历类型
      starTime: '',                                                       // 开始时间
      endTime: '',                                                        // 结束时间
      
      orderData: {
        money: {
          month_order_num: 0,
          today_order_num: 0,
          total_order_num: 0
        }
      },                                                                  // 订单统计数据
    }
  },
  onLoad() {
    this.getOrderRecord()
  },
  methods: {
    // 选择时间
    change(e) {
      console.log(e);
      this.starTime = e.startDate
      this.endTime = e.endDate
      this.getOrderRecord()
    },
    // 切换类型
    chenge_cli(id){
      this.is_check = id
      if(id != 'all'){
        this.starTime = ''
        this.endTime = ''
      }
      this.getOrderRecord()
    },
    // 返回上一页
    back_cli(){
      uni.navigateBack({})
    },
    
    /**
     * 关闭选择时间
     */
    closeTime(){
      this.starTime = ''
      this.endTime = ''
      this.getOrderRecord()
    },
    
    /**
     * 获取订单数据
     */
    getOrderRecord(){
      uni.showLoading({
        mask: true
      });
      this.$api.post(global.apiUrls.Statistics,{
        start_time: this.starTime,
        end_time: this.endTime,
        date: this.is_check
      }).then(res=>{
        console.log(res)
        uni.hideLoading();
        if(res.data.code == 1){
          this.orderData = res.data.data
          console.log('133-----------',this.orderData)
        }else{
          this.$message.info(res.data.msg) 
        }
      }).catch(err => {
        
      })
    }
  },
};

</script>

<style lang="scss">
@import './index.scss';
</style>
