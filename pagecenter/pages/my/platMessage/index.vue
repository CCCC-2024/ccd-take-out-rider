<template>
  <view class="page-wrapper">
    <view class="list" v-for="(item,index) in listData" :key="index" @tap="handleJump" :data-url="`/pagecenter/pages/my/message_detail/index?id=${item.id}`">
      <view class="time">{{item.create_time}}</view>
      <view class="contBox">
        <image :src="item.img_url" mode="aspectFill"></image>
        <view class="list-title">{{item.title}}</view>
        <view class="content">
          <rich-text :nodes="item.content"></rich-text>
        </view>
      </view>
    </view>
    
    <mj-empty
      :paging-list-loaded-all="pagingListLoadedAll"
      :paging-list-no-list-data="pagingListNoListData"
      :list-data-length="listDataLength"
    ></mj-empty>

  </view>
</template>
<script>
import pagingList from '@/common/minix/paging_list.js'
export default {
  mixins: [pagingList],
  data() {
    return {
      minixPagingListsApi: global.apiUrls.systemMessageList,
      allowOnloadGetList: false,    
      type: '',                                                          // 消息类型
    }
  },
  onLoad(option){
    this.type = option.type
    uni.setNavigationBarTitle({
      title:`${this.LANGUAGE_DATA['平台消息'][this.LANGUAGE]}`
    });
    this.pagingListToggle()
    
    uni.$emit('messagreNotice')
  },
  methods: {
    pagingListPostData(){
      return { msgtype: this.type }
    },
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
