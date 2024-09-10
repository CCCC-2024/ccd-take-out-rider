<template>
  <view class="page-wrapper">
    <image src="/static/img/bg.png" mode="" class="bg_img"></image>
    <view class="title_con">
      <view class="status_bar"></view>
      <view class="title" >
        <text></text>
        <!-- <text>{{LANGUAGE_DATA['个人中心'][LANGUAGE]}}</text> -->
        <view class="messageBox" @tap="handleJump" :data-url="`/pagecenter/pages/my/messagelist/index`">
          <image src="/static/img/messageIcon.png" mode="" class="messageImg"></image>
          <u-badge type="error" :count="countBum" :absolute="true" :offset="site" :is-dot="true"></u-badge>
        </view>
      </view> 
      <view class="rider_msg" >
        <view class="head-img" @tap="handleJump" :data-url="`/pagecenter/pages/my/person/index?name=${userInfor.user_nickname}&head=${userInfor.head_img}`">
          <image :src="userInfor.head_img" mode="aspectFill"></image>
        </view>
        <view class="rider_msg_left" @tap="handleJump" :data-url="`/pagecenter/pages/my/person/index?name=${userInfor.user_nickname}&head=${userInfor.head_img}`">
          <view class="rider_msg_left_left" >
            <view class="left_side">
              <view class="name">{{userInfor.user_nickname}}</view>
         <!--     <view class="star">
                <u-rate active-color="#FF9300" size="22" :count="count" v-model="userInfor.rider_score" inactive-icon="star-fill" inactive-color='#2892BE' :disabled="true"></u-rate>
                <text>{{userInfor.rider_score}}</text>
              </view> -->
            </view>
			<view class="workType" @click.stop="show = true">
			  <text v-if="userInfor.is_open == 1">接单中</text>
			  <text v-if="userInfor.is_open == 0">休息中</text>
			</view>
            <u-icon name="arrow-right" color="#cccccc" size="35" style="position: relative;top:16rpx;"></u-icon>
          </view>
          <view class="praise">
            <view class="rate"><text class="applause_rate">{{userInfor.applause_rate}}%</text>{{LANGUAGE_DATA['好评率'][LANGUAGE]}}</view>
           
          </view>
        </view>
      </view>
    </view>
    <view class="contents">
      <view class="receiv ">
        <view class="census">
          <text>订单统计</text>
          <u-icon name="arrow-right" color="#999999" size="30"></u-icon>
        </view>
        <view class="order_num" @tap="handleJump" data-url="/pagecenter/pages/census/orderVital/index">
          <view class="num_item">
            <view class="num">{{userInfor.today_order_num}}</view>
            <view class="">{{LANGUAGE_DATA['今日订单'][LANGUAGE]}}</view>
          </view>
          <view class="num_item">
            <view class="num">{{userInfor.month_order_num}}</view>
            <view class="">{{LANGUAGE_DATA['本月订单'][LANGUAGE]}}</view>
          </view>
          <view class="num_item">
            <view class="num">{{userInfor.total_order_num}}</view>
            <view class="">{{LANGUAGE_DATA['累计订单'][LANGUAGE]}}</view>
          </view>
        </view>
      </view>
      <image src="/static/img/banner.png" mode="aspectFill" class="bannerImg"></image>
      <view class="category">
        <view class="option_item" @tap="handleJump" data-url="/pagecenter/pages/wallet/wallet/index">
          <view class="item_left">
            <image src="/static/img/icon9.png"  mode="aspectFill" class="iconss"></image>
            <view>{{LANGUAGE_DATA['我的钱包'][LANGUAGE]}}</view>
          </view>
        </view>
        <view class="option_item" @tap="handleJump" :data-url="`/pages/index/evaluate/index?rate=${userInfor.applause_rate}&score=${userInfor.rider_score}`">
          <view class="item_left">
            <image src="/static/img/icon10.png" mode="aspectFill" class="iconss"></image>
            <view>{{LANGUAGE_DATA['我的评价'][LANGUAGE]}}</view>
          </view>
        </view>
        <view class="option_item" @tap="handleJump" data-url="/pages/index/overtime/index">
          <view class="item_left">
            <image src="/static/img/icon3.png" mode="aspectFill"  class="iconss"></image>
            <view>{{LANGUAGE_DATA['超时记录'][LANGUAGE]}}</view>
          </view>
        </view>
				 <!-- v-if="isGrounding == 1" -->
        <view class="option_item"  @tap="handleJump" data-url="/pagecenter/pages/census/rankingList/index"> 
          <view class="item_left">
            <image src="/static/img/icon4.png" mode="aspectFill"  class="iconss"></image>
            <view>{{LANGUAGE_DATA['排行榜'][LANGUAGE]}}</view>
          </view>
        </view>
		<view class="flex_bottom">
		<view class="option_item" @tap="handleJump" data-url="/pagecenter/pages/settings/setting/index">
		  <view class="item_left">
		    <image src="/static/img/icon7.png" mode="aspectFill" class="icons"></image>
		    <view>{{LANGUAGE_DATA['设置'][LANGUAGE]}}</view>
		  </view>
		</view>
		<view class="option_item" @tap="handleJump" data-url="/pagecenter/pages/settings/about_us/index">
		  <view class="item_left">
		    <image src="/static/img/icon6.png" mode="aspectFill" class="icons"></image>
		    <view>{{LANGUAGE_DATA['关于我们'][LANGUAGE]}}</view>
		  </view>
		</view>
		
        <view class="option_item" @tap="handleJump" data-url="/pagecenter/pages/settings/feedback/index">
          <view class="item_left">
            <image src="/static/img/icon5.png" mode="aspectFill" class="icons"></image>
            <view>{{LANGUAGE_DATA['意见反馈'][LANGUAGE]}}</view>
          </view>
        </view>


        <view class="option_item" @tap="handleJump" data-url="/pagecenter/pages/customer/index">
          <view class="item_left">
            <image src="/static/img/icon8.png" mode="aspectFill" class="icons"></image>
            <view>{{LANGUAGE_DATA['联系我们'][LANGUAGE]}}</view>
          </view>
        </view>
		</view>
      </view>
    </view>
    
    <u-select v-model="show" :list="list" title="接单状态" :z-index="99999999" @confirm="switch1Change"></u-select>
  </view>
</template>

<script>
export default {
  data() {
    return {
      count: 5,
      value: 1,
      checked: true,
      userInfor: '',
      
      countBum: 0,
      site: [2,5],
      
      show: false,
      list: [
        {
          value: '1',
          label: '接单中'
        },
        {
          value: '0',
          label: '休息中'
        }
      ],
      isWork: 0,
			
			isGrounding: 0,      // 0 隐藏  =1 展示
    }
  },
  onLoad() {
    let that = this
    uni.$on('changeMsg', res => {
      that.getUsers()
    })
    uni.$on('messagreNotice', res =>{
      this.getTidings()
    })
  },
  onShow() {
    this.getUsers()
    this.getTidings()
		this.getIsShelf()
  },
  methods: {
    switch1Change(status) {
      console.log(status);
      this.userInfor.is_open = status[0].value
      this.changeStatus()
    },
    // 切换骑手工作状态
    changeStatus(){
      this.$api.get(global.apiUrls.setStatus, {
        is_open: this.userInfor.is_open
      }).then(res => {
        this.$message.info(res.data.msg) 
        if(res.data.code == 1){
          this.getUsers()
          uni.$emit('notice');
        }else{
          
        }
      })
    },
    
    /**
     * 获取未读消息标识
     */
    getTidings(){
      this.$api.post(global.apiUrls.informats).then(res=>{
        console.log(res)
        if(res.data.code == 1){
          this.countBum = res.data.data
        }else{
          
        }
      }).catch(err => {
        
      })
    },
    
    // 获取数据
    getUsers(){
      this.$api.get(global.apiUrls.getRiderMsg, {
      }).then(res => {
        if(res.data.code == 1){
          console.log(res.data.data.is_open)
          if(res.data.data.is_open == 1){
            this.checked = true
          }else{
            this.checked = false 
          }
          this.userInfor = res.data.data
        }else{
          
        }
      })
    },
		
		/**
		 * 获取是否上架
		 */
		getIsShelf(){
			let that = this
			let appSystem = uni.getSystemInfoSync().platform == 'android' ? 2 : 1;
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
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
