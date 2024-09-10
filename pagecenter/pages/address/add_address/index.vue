<template>
  <view class="addAddr">
    <view class="cell">
      <view class="input-wrapper">
        <text class="title">收货人</text>
        <input type="text" value="" v-model="name" placeholder="请填写收货人姓名" placeholder-class="holder" />
      </view>
      <!-- <text class="iconfont">&#xe839;</text> -->
    </view>
    <view class="cell">
      <view class="input-wrapper">
        <text class="title">手机号码</text>
        <input type="number" value="" v-model="phone" placeholder="请填写联系方式" placeholder-class="holder" />
      </view>
      <view class="arrow">
        <!-- <text>+86</text>
        <text class="iconfont">&#xe839;</text> -->
      </view>
    </view>
    <view class="cell" type="default" @tap="handleChooseAddress">
      <view class="input-wrapper">
        <text class="title">所在地区</text>
        <input type="text" :value="pickerText" disabled placeholder="请选择" placeholder-class="holder" />
      </view>
      <text class="iconfont">&#xe839;</text>
    </view>
    <view class="address">
      <text class="title">详细地址</text>
      <textarea value="" placeholder="请填写详细地址" v-model="detail" placeholder-class="holder" />
      </view>

    <view class="uni-list-cell uni-list-cell-pd">
      <label class="radio">设为默认地址</label>
      <switch :checked="show" @change="switch1Change"  color="#2877F8" />
    </view>
    <view class="btns">
      <button :loading="isSubmitClick" class="btns_tijiao" @tap="handleTapAddAddress">保存</button>
    </view>
  </view>
</template>

<script>
  const { handleJump } = global;
  import { validate } from '@/common/utils/index.js';

  export default {
    data() {
      return {
        show: false,
        isDefault:0,                                // 是否默认 0否   1是
        cityPickerValueDefault: [0, 0, 0],          // picker 默认
        themeColor: '#00DC79',                      // picker 颜色
        pickerText: '',                             // picker  结果
        detail:'',                                  // 详细地址
        phone:'',                                   // 手机号
        name:'',                                    // 姓名
        isSubmitClick: false,                       // 防止重复提交
        lat:'',                                     // 经度
        lng:'',                                     // 纬度

        addressId: '',                              // 编辑地址时存在
      }
    },
    onLoad(options) {
      if(options.id){
        uni.setNavigationBarTitle({
          title: '编辑地址'
        });
        this.addressId = options.id
        this.addressDetail();
      }else{
        uni.setNavigationBarTitle({
          title: '添加地址'
        });
      }
    },
    methods:{
      handleJump,

      handleChooseAddress(){
        uni.chooseLocation({
          success: (res) => {
            console.log(res)
            this.pickerText = res.address;
            this.detail = res.name == '我的位置' ? '' : res.name;
            this.lat = res.latitude;
            this.lng = res.longitude;
          }
        });
      },

      //获取地址详情
      addressDetail(){
        this.$api.post(global.apiUrls.userAddressGetInfo,{
          address_id:this.addressId
        }).then(res=>{
          console.log(res.data.data.detail)
          if(res.data.code == 1){
            this.pickerText = res.data.data.district
            this.detail = res.data.data.address;
            this.name = res.data.data.name;
            this.phone = res.data.data.mobile;
            this.lng = res.data.data.lng;
            this.lat = res.data.data.lat;
            this.isDefault = res.data.data.is_default
            this.show = res.data.data.is_default == 1
          }
        })
      },

      //设置默认
      switch1Change(e){
        this.isDefault = e.target.value ? 1 : 0;
      },

      // 添加地址
      handleTapAddAddress() {
        let { name, phone, pickerText, detail, show, addressId } = this
        if (this.isSubmitClick) return false;

        if (!validate(name, 'require')) return this.$message.info('请输入收货人姓名~');
        if (name.length > 6) return this.$message.info('收货人姓名长度不能大于6~');
        if (!validate(phone, 'require')) return this.$message.info('请输入收货人手机号~');
        if (!validate(phone, 'phone')) return this.$message.info('收货人手机号格式不正确~');
        if (!validate(pickerText, 'require')) return this.$message.info('请选择省市区~');
        if (!validate(detail, 'require')) return this.$message.info('请输入详细地址~');

        this.isSubmitClick = true;
        let postData = {
          name,
          province: 0,
          city: 0,
          postal_code: 0,
          mobile: phone,
          is_default: this.isDefault,
          address: detail,
          district: pickerText,
          lng: this.lng,
          lat: this.lat
        }

        if(this.addressId) postData.address_id = this.addressId;

        this.$api.post(this.addressId ? global.apiUrls.userAddressUpdate : global.apiUrls.addAddress, postData).then(res => {
          this.isSubmitClick = false
          let data = res.data
          this.$message.info(res.data.msg)
          if(res.data.code == 1){
            setTimeout(() =>{
              uni.navigateBack()
            }, 1200)
          }
        })

      }
    }
  }
</script>
<style lang="scss">
  @import "./index.scss";
</style>
