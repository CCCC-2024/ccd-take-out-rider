<template>
  <view class="page-wrapper">
    <view class="item" v-for="(items,index) in massages" :key="index" @click="jumpDel(items)" >
      <view class="msg_img_left">
        <image src="/static/img/msg1.png" v-if="items.msg_type == 1" mode="aspectFill"></image>
        <image src="/static/img/msg2.png" v-if="items.msg_type == 2" mode="aspectFill"></image>
        <u-badge type="error" :count="items.unread_num" :absolute="true" :offset="site"></u-badge>
      </view>
      <view class="item_content">
        <view class="top">
          <text class="bt_title">{{items.name}}</text>
          <text v-if="items.new_msg != ''">{{items.new_msg.create_time}}</text>
        </view>
        <view class="con">
          <text v-if="items.new_msg == ''">{{LANGUAGE_DATA['暂无数据'][LANGUAGE]}}</text>
          <rich-text :nodes="items.new_msg.content" v-else></rich-text>  
        </view>
      </view>
    </view>
    
    <view class="item" v-for="(ac_item,ch_index) in chatArry" :key="ch_index" v-if="chatArry != '' && isGrounding == 1" @click="jumpChat(ac_item)">
      <view class="msg_img_left">
        <image :src="ac_item.head_img" mode="aspectFill"></image>
        <!-- <u-badge type="error" :count="ac_item.unread_num" :absolute="true" :offset="site"></u-badge> -->
      </view>
      <view class="item_content">
        <view class="top">
          <text class="bt_title">{{ac_item.nickname}}</text>
          <text >{{ac_item.create_time}}</text>
        </view>
        <view class="con">
          <text v-if="ac_item.type == 1" v-html="ac_item.content"></text>
          <text v-else>{{ac_item.content}}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>

export default {
  data() {
    return {
      massages: [],                         // 消息内容
      site: [5,5],
      chatArry: [],                         // 聊天列表
			isGrounding: 0,                                 // 0 隐藏  =1 展示
    }
  },
  onLoad(){
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['消息'][this.LANGUAGE]}`
    });
    
    this.getMessageType()
    this.getInforMsg()
		this.getIsShelf()
		
    uni.$on('messagreNotice', res =>{
      this.getMessageType()
    })
  },
  
  methods: {
    /**
     * 获取系统 and 平台消息
     */
    getMessageType(){
      this.$api.post(global.apiUrls.msgType,{
        
      }).then(res=>{
        console.log('44---------',res)
        if(res.data.code == 1){
          this.massages = res.data.data
        }else{
          // this.$message.info(res.data.msg) 
        }
      }).catch(err => {
        
      })
    },
    
    /**
     * 获取聊天消息列表
     */
    getInforMsg(){
      this.$api.post(global.apiUrls.converList,{
        
      }).then(res=>{
        console.log('44---------',res)
        if(res.data.code == 1){
          res.data.data.forEach(item =>{
            if(item.content.indexOf('<img src=') != -1){
              item.type = 1
            }else{
              item.type = ''
            }
          })
          this.chatArry = res.data.data
        }else{
          // this.$message.info(res.data.msg) 
        }
      }).catch(err => {
        
      })
    },
    
    /**
     * 跳转详情
     */
    jumpDel(type){
      let url = ''
      if(type.new_msg == ""){
        this.$message.info(`${this.LANGUAGE_DATA['暂无数据'][this.LANGUAGE]}`)
      }else{
        if(type.msg_type == 1){
          url = '/pagecenter/pages/my/message/index?type=' + type.msg_type
        }else if(type.msg_type == 2){
          url = '/pagecenter/pages/my/orderMessage/index?type=' + type.msg_type
        }else{
          url = '/pagecenter/pages/my/platMessage/index?type=' + type.msg_type
        }
        uni.navigateTo({
          url: url
        })
      }
    },
    
    /**
     * 跳转聊天
     */
    jumpChat(item){
      uni.navigateTo({
        url: '/pagecenter/pages/my/chates/index?group_id=' + item.to_user_id + '&group_name=' + item.nickname
      })
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
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
