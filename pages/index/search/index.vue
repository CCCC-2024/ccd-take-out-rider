<template>
  <view class="page-wapper">
    <view class="hearder">
      <view class="status_bar"></view>
      <view class="searchTab">
        <u-icon name="arrow-left" color="#333333" size="34" @click="backCli"></u-icon>
        <input type="text" value="" :placeholder="LANGUAGE_DATA['请输入关键词进行搜索'][LANGUAGE]" @confirm="searchOver" v-model="keyword" />
        <u-icon name="search" color="#333333" size="34" @click="searchCli"></u-icon>
      </view>
    </view>
    <view class="recordBox" v-if="recordArry != ''">
      <view class="recordTitle">
        <text class="lately">{{LANGUAGE_DATA['最近搜索'][LANGUAGE]}}</text>
        <u-icon name="trash-fill" color="#666666" size="34" @click="cleanAll"></u-icon>
      </view>
      <view class="record-content">
        <view class="everOne" v-for="(item,index) in recordArry" :key="index" @click="searchKey(item.keyword)">{{item.keyword}}</view>
      </view>
    </view>
    
    <image src="/static/empty/empty05.png" mode="" v-if="recordArry == ''" class="emptyImg"></image>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordArry: [],                                  // 历史结果
      keyword: '',                                     // 关键词
    }
  },
  onLoad(option){
    this.getRecord()
    uni.$on('serchOver', res=>{
      this.getRecord()
    })
  },
  methods: {
    /**
     * 返回上一页
     */
    backCli(){
      uni.navigateBack({})
    },
    
    /**
     * 获取搜索记录
     */
    getRecord(){
      this.$api.post(global.apiUrls.searchHistory).then(res=>{
        console.log(res)
        if(res.data.code == 1){
          this.recordArry = res.data.data.search_log
        }else{
          
        }
      }).catch(err => {
        
      })
    },
    
    /**
     * 清除历史记录
     */
    cleanAll(){
      let that = this
      uni.showModal({
        title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
        content: `${that.LANGUAGE_DATA['清空最近搜索?'][that.LANGUAGE]}`,
        cancelText:`${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
        confirmText:`${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
        success(res) {
          console.log('-----------',res)
          if (res.confirm) {
            that.$api.post(global.apiUrls.cleanHistory).then(res=>{
              console.log(res)
              if(res.data.code == 1){
                that.getRecord()
              }else{
                that.$message.info(res.data.msg) 
              }
            }).catch(err => {
              
            })
          }
        }
      });
    },
    
    /**
     * 搜索
     */
    searchOver(e){
      console.log(e)
      this.keyword = e.detail.value
      if(this.keyword == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入关键词进行搜索'][this.LANGUAGE]}`)
      uni.navigateTo({
        url: '/pages/index/searchOut/index?key=' + this.keyword
      })
      this.keyword = ''
    },
    searchCli(){
      if(this.keyword == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入关键词进行搜索'][this.LANGUAGE]}`)
      uni.navigateTo({
        url: '/pages/index/searchOut/index?key=' + this.keyword
      })
      this.keyword = ''
    },
    searchKey(key){
      uni.navigateTo({
        url: '/pages/index/searchOut/index?key=' + key
      })
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>

