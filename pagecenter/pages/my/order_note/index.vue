<template>
  <view class="page-wrapper">
    <view class="list" v-for="(item,index) in listData" :key="index" >
      <!-- @tap="handleJump" data-url="/pagecenter/pages/my/message_detail/index" -->
      <view class="list-title">{{item.title}}</view>
      <view class="time">{{item.create_time}}</view>
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
      listData: []
    }
  },

  onLoad(){
    // uni.$on('SYSTEM_MESSAGE_READ', res => {
    //   let index = this.listData.findIndex(item => item.aid == res.id)
    //   if(index != -1) this.listData[index].is_read = 1;
    // })
  },

  onUnload(){
    uni.$off('SYSTEM_MESSAGE_READ')
  },

  methods: {
    handleRefuseOrAgree(type, id, index){
      global.customShowModalPopup({
        title: type == 2 ? '确定拒绝门店绑定？' : '确定同意门店绑定？',
        success: res => {
          if(res.confirm){
            this.$api.post(global.apiUrls.refuseOrAgreeBind, { id, type }).then(res => {
              this.$message.info(res.data.msg)
              if(res.data.code == 1){
                this.listData[index].is_read = 1;
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import './index.scss';
</style>
