<template>
  <view class="address-list">
    <template>
      <radio-group class="address-list" @change="radioChange">
        <view class="addr-list" v-for="(item, index) in lists" :key="index">
          <view class="list-con" @tap="handleChooseAddress(item)">
            <view class="tops flex-row">
              <text class="name">{{item.name}}</text>
              <text class="phone">{{item.mobile}}</text>
              <view class="moren-defalut" v-if="item.is_default == 1"><text>默认</text></view>
            </view>
            <view class="address">{{item.district}} {{item.address}}</view>
          </view>
          <view class="list-btm flex-row-between">
            <view class="moren">
              <label class="radio">
                <radio :value="index + 1 + ''" :checked="item.is_default == 1" style="transform: scale(0.8);" color="#2877F8" />{{item.is_default == 1 ? '默认地址' : '设为默认地址'}}</label>
            </view>
            <view class="caozuo">
              <view @tap.stop="handleJump" :data-url="'/pagecenter/pages/address/add_address/index?id='+item.address_id">
                <text class="iconfont" style="font-size: 28upx;">&#xe624;</text>
                <text class="bianji">编辑</text>
              </view>
              <view @tap.stop="handleDeleteAddress(item.address_id, index)">
                <text class="iconfont" style="font-size: 36upx;">&#xe622;</text>
                <text class="shanchu">删除</text>
              </view>
            </view>
          </view>
        </view>
      </radio-group>
      <view class="empty-page" v-if="loaded && lists.length < 1">
        <image src="/static/empty/empty03.png" style="width: 462upx; height: 327upx;"></image>
        <view>您还没有收货地址，赶快添加吧</view>
      </view>

      <view class="add-wrapper">
        <view class="add" @tap="handleJump" data-url="/pagecenter/pages/address/add_address/index">+ 添加收货地址</view>
      </view>
    </template>

  </view>
</template>

<script>
const { handleJump } = global;
export default {
  data() {
    return {
      type: '',
      lists: [],
      loaded: false
    }
  },
  onLoad(options) {
    if (options.type) this.type = options.type;
  },
  onShow() {
    this.getAddressList()
  },
  methods: {
    handleJump,
    handleDeleteAddress(id, index) {
      global.customShowModalPopup({
        content: '确认删除收货地址？',
        success: res => {
          if (res.confirm) {
            this.$api.post(global.apiUrls.userAddressDelete, { address_ids: id }).then(res => {
              this.$message.info(res.data.msg)
              if (res.data.code == 1) {
                this.lists.splice(index, 1)
              }
            })
          }
        }
      })
    },
    radioChange(e) {
      console.log(e);
      let index = e.detail.value * 1 - 1;
      this.$api.post(global.apiUrls.userAddressSetDefault, {
        address_id: this.lists[index].address_id
      }).then(res => {
        this.lists = this.lists.map(item => {
          item.is_default = 0
          return item;
        })
        this.lists[index].is_default = 1
      })
    },
    getAddressList() {
      this.$api.get(global.apiUrls.userAddressList).then(res => {
        this.loaded = true
        if (res.data.code == 1) {
          console.log(res.data)
          this.lists = res.data.data
        }
      })
    },

    handleChooseAddress(item) {
      if (this.type == 'choose') {
        uni.$emit('CHOOSED_ADDRESS', item)
        uni.navigateBack()
      }
    }
  }
}

</script>

<style lang="scss">
@import "./index.scss";
</style>
