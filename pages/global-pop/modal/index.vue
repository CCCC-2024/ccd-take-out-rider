<template>
  <view>
    <custom-pop-modal ref="customPopModal"></custom-pop-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      msgData: "",                          // 带过来的参数
    } 
  },
  onLoad() {
    let that = this
    // #ifdef APP-NVUE
    const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
    // #endif
    // #ifndef APP-NVUE
    const eventChannel = this.getOpenerEventChannel();
    // #endif
    
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptPage', function(data) {
      console.log('178-----',data)
      that.msgData = data.data
    })
  },
  onReady(){
    this.$refs.customPopModal.handleShow(this.msgData)
    //  global.customShowModelPopupOptions
  }
}

</script>

<style lang="scss">
@import './index.scss';
</style>
<!-- {
      "path": "pages/global_pop/modal/index",
      "style": {
        "navigationStyle": "custom",
        "app-plus": {
          "animationType": "none",
          "background": "transparent",
          "backgroundColor": "rgba(0,0,0,0)",
          "popGesture": "none"
        }
      }
    }, -->
<!-- global.customShowModalPopup(this)
<custom-pop-modal ref="customPopmodal"></custom-pop-modal>
 -->
