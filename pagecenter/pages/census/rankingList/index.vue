<template>
  <view class="warp">
    <view class="hearTab" :style="{'backgroundColor': backgroundColor}">
      <view class="status_bar"></view>
      <view class="hearTabTil">
        <u-icon name="arrow-left" color="#fff" size="36" @click="backCli"></u-icon>
        <view class="rank">排行榜</view>
        <view class=""></view>
      </view>
    </view>
    <view class="hearder">
      <image src="/pagecenter/static/img/rankImg.png" mode="" class="bgImg"></image>
      <view class="senior">
        <view class="tabSwitch">
          <view class="tab-ever" @click="switchCut(1)">
            <view :class="isChose == 1 ? 'tabCont' : 'countNone'">今日单量榜</view>
            <image src="/pagecenter/static/img/line.png" mode="" class="lineImg" v-if="isChose == 1"></image>
          </view>
          <view class="tab-ever" @click="switchCut(2)">
            <view :class="isChose == 2 ? 'tabCont' : 'countNone'">{{LANGUAGE_DATA['本月单量榜'][LANGUAGE]}}</view>
            <image src="/pagecenter/static/img/line.png" mode="" class="lineImg" v-if="isChose == 2"></image>
          </view>
          <view class="tab-ever" @click="switchCut(3)">
            <view :class="isChose == 3 ? 'tabCont' : 'countNone'">配送距离</view>
            <image src="/pagecenter/static/img/line.png" mode="" class="lineImg" v-if="isChose == 3"></image>
          </view>
          <view class="tab-ever" @click="switchCut(4)">
            <view :class="isChose == 4 ? 'tabCont' : 'countNone'">准时率</view>
            <image src="/pagecenter/static/img/line.png" mode="" class="lineImg" v-if="isChose == 4"></image>
          </view>
        </view>
        <view class="topThree">
          <image src="/pagecenter/static/img/rankImg2.png" mode="" class="rankBtnImg"></image>
          <view class="numStyle num1">
            <text>{{(isChose == 1 || isChose == 2) ? userOneRank.number : isChose == 3 ? userOneRank.distance : userOneRank.time_rate}}</text>
            <text style="font-size: 28rpx;">{{(isChose == 1 || isChose == 2) ? '单' : isChose == 3 ? '公里' : '%' }}</text>
          </view>
          <view class="numStyle num2">
            <text>{{(isChose == 1 || isChose == 2) ? userTwoRank.number : isChose == 3 ? userTwoRank.distance : userTwoRank.time_rate}}</text>
            <text style="font-size: 28rpx;">{{(isChose == 1 || isChose == 2) ? '单' : isChose == 3 ? '公里' : '%' }}</text>
          </view>
          <view class="numStyle num3">
            <text>{{(isChose == 1 || isChose == 2) ? userThreeRank.number : isChose == 3 ? userThreeRank.distance : userThreeRank.time_rate}}</text>
            <text style="font-size: 28rpx;">{{(isChose == 1 || isChose == 2) ? '单' : isChose == 3 ? '公里' : '%' }}</text>
          </view>
          <view class="userStyle user1">
            <view class="userBg">
              <image src="/pagecenter/static/img/headBg.png" mode="" class="bgImgStyle"></image>
              <view class="headBgCircle headBgCirclea_active"> 
                <image v-if="userOneRank" :src="userOneRank.head_img" mode="aspectFill" class="headPhoto1"></image>
              </view>
            </view>
            <view class="userName">{{userOneRank.user_nickname}}</view>
          </view>
          <view class="userStyle user2">
            <view class="headBgCircle">
              <image v-if="userTwoRank" :src="userTwoRank.head_img" mode="aspectFill" class="headPhoto"></image>
            </view>
            <view class="userName">{{userTwoRank.user_nickname}}</view>
          </view>
          <view class="userStyle user3">
            <view class="headBgCircle">
              <image v-if="userThreeRank" :src="userThreeRank.head_img" mode="aspectFill" class="headPhoto"></image>
            </view>
            <view class="userName">{{userThreeRank.user_nickname}}</view>
          </view>
        </view>
        <view class="seniority">
          <view class="seniorityList" v-for="(item,index) in rainkList" :key="index">
            <view class="rowLeft">
              <text>{{item.ranking}}</text>
              <image :src="item.head_img" mode="aspectFill" class="headImg"></image>
              <text>{{item.user_nickname}}</text>
            </view>
            <view class="rowRight">
              <text style="font-size: 40rpx;">{{(isChose == 1 || isChose == 2) ? item.number : isChose == 3 ? item.distance : item.time_rate}}</text>
              <text class="" v-if="isChose == 1 || isChose == 2">单</text>
              <text v-if="isChose == 3">公里</text>
              <text v-if="isChose == 4">%</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isChose: 1,                                    // 1 本周单量榜 2 本月单量榜 3 本年单量榜 4 总共单量榜
      rankArry:[],                                   // 排行列表
      userOneRank: '',                               // 第一名数据
      userTwoRank: '',
      userThreeRank: '',
      rainkList: [],                                 // 排行列表
      backgroundColor: 'rgba(28, 181, 248, 0)'
    }
  },
  onPageScroll(e) {
    // 监听页面滚动距离
  	this.backgroundColor = 'rgba(73, 221, 254,' + e.scrollTop / 300+')'; 
  },
  onLoad(){
    this.getRink()
  },
  methods: {
    /**
     * 返回上一页
     */
    backCli(){
      uni.navigateBack({})
    },
    
    /**
     * 切换排行榜
     */
    switchCut(type){
      console.log(type)
      this.isChose = type
      this.getRink()
    },
    
    /**
     * 获取榜单
     */
    getRink(){
      let url = ''
      let type = ''
      if(this.isChose == 1 || this.isChose == 2){
        url = global.apiUrls.ranking
        type = this.isChose
      }else if(this.isChose == 3){
        url = global.apiUrls.distancRank
        type = ''
      }else{
        url = global.apiUrls.onTimeRank
        type = ''
      }
			
			this.rainkList = []
			this.userOneRank = ""
			this.userTwoRank = ""
			this.userThreeRank = ""
      
      this.$api.post(url,{
        type: type
      }).then(res=>{
        console.log(res)
        if(res.data.code == 1){
          if(res.data.data.list != ''){
            this.userOneRank = res.data.data.list[0]
						// this.userTwoRank = res.data.data.list[1] 
						// this.userThreeRank = res.data.data.list[2] 
						if(res.data.data.list.length == 2 ){
							this.userTwoRank = res.data.data.list[1]
						}else if(res.data.data.list.length >= 3){   
							this.userTwoRank = res.data.data.list[1]  
							this.userThreeRank = res.data.data.list[2]
						}
						
						// if(res.data.data.list[1] == 'undefined'){
							
						// }else{
						// 	this.userTwoRank = res.data.data.list[1] 
						// }   
            
						// if(res.data.data.list[2] == 'undefined'){
							
						// }else{
						// 	this.userThreeRank = res.data.data.list[2] 
						// }
            res.data.data.list.map((item,index) =>{
              if(index > 2){
                this.rainkList.push(item)
              }
            }) 
          }else{
            this.rainkList = []
            this.userOneRank = ""
            this.userTwoRank = ""
            this.userThreeRank = ""
          }
        }else{
          this.rainkList = []
          this.userOneRank = ''
          this.userTwoRank = ''
          this.userThreeRank = ''
          this.$message.info(res.data.msg) 
        }
      }).catch(err => {
        
      })
    }
  },
}

</script>

<style lang="scss">
@import './index.scss';
</style>
