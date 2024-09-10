<template>
  <view class="page-wrapper">
    <view class="tips">
      <image src="/pagecenter/static/login/riderBanner.png" mode=""></image>
    </view>
    <view class="conts">
      <view class="conts_item">
        <text>{{LANGUAGE_DATA['姓名'][LANGUAGE]}}</text>
        <input type="text" value="" :placeholder="LANGUAGE_DATA['请输入姓名'][LANGUAGE]" maxlength="10" v-model="nickName" style="width: 600rpx;" />
      </view>
      <view class="conts_item">
        <text>{{LANGUAGE_DATA['手机号'][LANGUAGE]}}</text>
        <input type="number" value="" :placeholder="LANGUAGE_DATA['请输入手机号'][LANGUAGE]" v-model="mobile" style="width: 500rpx;" maxlength="11" />
      </view>
      <view class="conts_item" @click="carShow = true">
        <text>{{LANGUAGE_DATA['职位类型'][LANGUAGE]}}</text>
        <view class="conts_item_right">
          <input type="text" value="" disabled="disabled" :placeholder="LANGUAGE_DATA['请选择'][LANGUAGE]" v-model="postName" style="width: 500rpx;" />
          <u-icon name="arrow-right" color="#999999" size="28" class="iconRight"></u-icon>
        </view>
      </view>
      <view class="conts_item" @click="sexShow = true">
        <text>{{LANGUAGE_DATA['性别'][LANGUAGE]}}</text>
        <view class="conts_item_right">
          <input type="text" value="" :placeholder="LANGUAGE_DATA['请选择'][LANGUAGE]" maxlength="10" v-model="sexName" disabled="disabled" />
          <u-icon name="arrow-right" color="#999999" size="28" class="iconRight"></u-icon>
        </view>
      </view>
      <view class="conts_item" @click="timeShow = true">
        <text>生日</text>
        <view class="conts_item_right">
          <input type="text" value="" :placeholder="LANGUAGE_DATA['请选择'][LANGUAGE]" maxlength="10" v-model="birth" style="width: 500rpx;" disabled="disabled" />
          <u-icon name="arrow-right" color="#999999" size="28" class="iconRight"></u-icon>
        </view>
      </view>
      <view class="conts_item" @click="choseAddr">
        <text>{{LANGUAGE_DATA['地区'][LANGUAGE]}}</text>
        <view class="conts_item_right">
          <input type="text" value="" disabled="disabled" :placeholder="LANGUAGE_DATA['请选择'][LANGUAGE]" v-model="region" style="width: 550rpx;" />
          <u-icon name="arrow-right" color="#999999" size="28" class="iconRight"></u-icon>
        </view>
      </view>
      <view class="conts_addr">
        <text>{{LANGUAGE_DATA['详细地址'][LANGUAGE]}}</text>
        <textarea value="" placeholder="请输入" v-model="addrDel" />
      </view>
      <view class="conts_item">
        <text>{{LANGUAGE_DATA['身份证'][LANGUAGE]}}</text>
        <input type="idcard" value="" :placeholder="LANGUAGE_DATA['请输入身份证号'][LANGUAGE]" v-model="userId" style="width: 500rpx;" maxlength="20" />
      </view>
    </view>
    <view class="up_content">
      <view class="up_tip">{{LANGUAGE_DATA['请上传身份证正反面'][LANGUAGE]}}</view>
      <view class="up_imgs">
        <view class="imgs_left imgs_box">
          <image src="/pagecenter/static/login/uplod-img.png" mode="" v-if="frontImg == ''" @click="uplodeImg(1)"></image>
          <view class="paperBox" v-else>
            <image :src="frontImg | assembleImgSrc" mode="aspectFill" class="paperImg"></image>
            <image src="/static/empty/close.png" mode="" class="close_img" @click="deltelImg(1)"></image>
          </view>
          <view class="">{{LANGUAGE_DATA['身份证人像面'][LANGUAGE]}}</view>
        </view>
        <view class="imgs_right imgs_box">
          <image src="/pagecenter/static/login/id_z.png" mode=""></image>
          <view class="">({{LANGUAGE_DATA['示例'][LANGUAGE]}})</view>
        </view>
      </view>
      <view class="up_imgs">
        <view class="imgs_left imgs_box">
          <image src="/pagecenter/static/login/uplod-img.png" mode="" v-if="backImg == ''" @click="uplodeImg(2)"></image>
          <view class="paperBox" v-else>
            <image :src="backImg | assembleImgSrc" mode="aspectFill" class="paperImg"></image>
            <image src="/static/empty/close.png" mode="" class="close_img" @click="deltelImg(2)"></image>
          </view>
          <view class="">{{LANGUAGE_DATA['身份证国徽面'][LANGUAGE]}}</view>
        </view>
        <view class="imgs_right imgs_box">
          <image src="/pagecenter/static/login/id_f.png" mode=""></image>
          <view class="">({{LANGUAGE_DATA['示例'][LANGUAGE]}})</view>
        </view>
      </view>
      <view class="up_imgs">
        <view class="imgs_left imgs_box">
          <image src="/pagecenter/static/login/uplod-img.png" mode="" v-if="insureImg == ''" @click="uplodeImg(3)"></image>
          <view class="paperBox" v-else>
            <image :src="insureImg | assembleImgSrc" mode="aspectFill" class="paperImg"></image>
            <image src="/static/empty/close.png" mode="" class="close_img" @click="deltelImg(3)"></image>
          </view>
          <view class="">{{LANGUAGE_DATA['手持身份证'][LANGUAGE]}}</view>
        </view>
        <view class="imgs_right imgs_box">
          <image src="/pagecenter/static/login/bx_img.png" mode=""></image>
          <view class="">({{LANGUAGE_DATA['示例'][LANGUAGE]}})</view>
        </view>
      </view>
      <view class="notes">
        <view class="">{{LANGUAGE_DATA['注'][LANGUAGE]}}：</view>
        <view class="">为保证平台用户安全性，需要您进行实名认证，实名认证通过之后即可登录并在平台进行接单</view>
      </view>
      
      <view class="fotter">
        <view class="sub_mit" @click="submit_msg">{{LANGUAGE_DATA['提交'][LANGUAGE]}}</view>
        <view class="treaty">
          <view class="treatyLeft" @click="changeAgree">
            <image src="/pagecenter/static/img/checkNo.png" mode="" v-if="!isCheckAgree"></image>
            <image src="/pagecenter/static/img/check_xy.png" mode="" v-else></image>
            <text>我已阅读并同意</text>
          </view>
          <text style="color: #1CB5FD;" @tap="handleJump" data-url="/pagecenter/pages/login/agreement/index?id=11">《{{LANGUAGE_DATA['骑手认证协议'][LANGUAGE]}}》</text>
        </view>
      </view>
    </view>
    
    
    <!-- 选择性别 -->
    <u-picker mode="selector" v-model="sexShow"  :default-selector="[0]" :range="selector" @confirm="choseSex"></u-picker>
    <!-- 选择时间 -->
    <u-picker mode="time" v-model="timeShow" :params="params" @confirm="choseTime" end-year="2021"></u-picker>
    <!-- 职位类型 -->
    <u-picker mode="selector" v-model="carShow"  :default-selector="[0]" :range="carSelector" range-key="car_name" @confirm="choseType"></u-picker>
  </view>
</template>
<script>
import { validate, UploadImg } from '@/common/utils/index'
import { URL } from '@/common/config.js'
const amapFile = require('@/common/libs/amap-wx.js'); 
export default {
  data() {
    return {
      token: '',
      type: '',                                    // type==1 认证未通过 ；                                    
      nickName: '',                                // 姓名
      userId: '',                                  // 身份证号码
      mobile: '',                                  // 手机号
      postName: '',                                // 职位名称
      sex: '',                                     // 性别
      sexName: '',                                 // 性别名称
      birth: '',                                   // 出生日期
      addrDel: '',                                 // 详细地址
      region: '',                                  // 区域
      province: '',                                
      city: '',                                    
      area:'',
      frontImg: '',                                // 身份证证正面
      backImg: '',                                 // 身份证反面照
      insureImg: '',                               // 手持身份证照
      
      sexShow: false,
      selector: ['保密', '男', '女'],               // 性别
      timeShow: false,
      params: {
        year: true,
        month: true,
        day: false,
        hour: false,
        minute: false,
        second: false
      },
      carShow: false,                               // 职位类型
      carSelector: [
        {
          car_name: '全职'
        },
        {
          car_name: '兼职'
        },
      ],                                            // 职位类型列表
      is_afresh: 0,                                 // 0 否 1 是 （是否第一次认证）
      isCheckAgree: false,                          // 是否勾选 
      
      nowYear: '',
      nowMonth: '',
      choseYear: '',
      choseMonth: '',
      longitude: '',
      latitude: '',
      
    }
  },
  onLoad(option) {
    this.token = option.token
    this.type = option.type ? option.type : ''
    
    uni.setNavigationBarTitle({
      title: `${this.LANGUAGE_DATA['骑手认证'][this.LANGUAGE]}`
    });
    
    if(option.type == 1){
      this.getMsg()
      this.is_afresh = 1
    }
    this.getTime()
  },
  methods: {
    /**
     * 切换选择协议
     */
    changeAgree(){
      this.isCheckAgree = !this.isCheckAgree
    },
    
    /**
     * 获取年月日
     */
    getTime(){
      var myDate = new Date();
      this.nowYear = myDate.getFullYear()
      this.nowMonth = myDate.getMonth() + 1
    },
    
    // 获取认证信息
    getMsg(){
      uni.request({
        url: URL + global.apiUrls.getRiderMsg, //仅为示例，并非真实接口地址。
        method: 'GET',
        data: {},
        header: {
          'user-token': this.token
        },
        success: (res) => {
          console.log(res.data);
          if (res.data.code == 1) {
            let msg = res.data.data
            this.nickName = msg.real_name
            this.userId = msg.id_number
            this.frontImg = msg.id_front
            this.backImg = msg.id_back
            this.insureImg = msg.id_hold
            this.postName = msg.type == 1 ? '全职' : '兼职'
            
            this.mobile = msg.mobile
            this.sex = msg.sex 
            this.sexName = msg.sex == 1 ? '男' : msg.sex == 2 ? '女' : '保密'
            this.birth = msg.birthday 
            
            this.region = msg.province + '-' + msg.city + '-' + msg.area 
            this.province = msg.province
            this.city = msg.city
            this.area = msg.area
            this.addrDel = msg.address
          } else {
            this.$message.info(res.data.msg);
          }
        }
      });
    },
    
    /**
     * 选择车辆类型
     */
    choseType(e){
      console.log(e)
      this.postName = this.carSelector[e].car_name
    },
    
    uplodeImg(type){
      let self = this
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        success: function(res) {
          console.log(res.tempFilePaths)
          const tempFilePaths = res.tempFilePaths;
          new UploadImg(tempFilePaths, {
            complete: function(res) {
              console.log(res)
              if(type == 1){
                self.frontImg = res[0].path;
              }else if(type == 2){
                self.backImg = res[0].path;
              }else if(type == 3){
                self.insureImg = res[0].path;
              }
            }
          })
        }
      });
    },
    
    // 删除图片
    deltelImg(type){
      console.log(type)
      if(type == 1){
        this.frontImg = '';
      }else if(type == 2){
        this.backImg = '';
      }else if(type == 3){
        this.insureImg = '';
      }
    },
    
    /**
     * 选择性别
     */
    choseSex(e){
      console.log(e)
      this.sexName = this.selector[e]
      if(this.sexName == '男'){
        this.sex = 1
      }else if(this.sexName == '女'){
        this.sex = 2
      }else{
        this.sex = 0
      }
    },
    
    /**
     * 选择出生年月
     */
    choseTime(e){
      console.log(e)
      this.birth = e.year + '-' + e.month
      this.choseYear = e.year
      this.choseMonth = e.month
    },
    
    /**
     * 选择地区
     */
    choseAddr(){
      let that = this
      // #ifdef H5
      this.province = '河南省'
      this.city = '郑州市'
      this.area = '二七区'
      this.region = this.province + '-' + this.city + '-' + this.area
      // #endif
      
      // #ifdef APP-PLUS
      uni.chooseLocation({
        success: function (res) {
          console.log(res)
          var myAmapFun = new amapFile.AMapWX({
            key: 'd4dce5c712c4de47bed8f6c2afc4e517'
          });
          myAmapFun.getRegeo({
            location: res.longitude + ',' + res.latitude,
            success: function(data) {
              //成功回调
              console.log('320----',data)
              that.longitude = res.longitude
              that.latitude = res.latitude
              that.province = data[0].regeocodeData.addressComponent.province
              that.city = data[0].regeocodeData.addressComponent.city
              that.area = data[0].regeocodeData.addressComponent.district
              that.region = that.province + '-' + that.city + '-' + that.area
              that.addrDel = data[0].regeocodeData.roads[0].name + data[0].desc
            },
            fail: function(info) {
              //失败回调
              console.log(info)
            }
          })
        }
      });
      // #endif
    },
    
    
    // 选择城市
    confirm(e){
      console.log(e)
      this.city = e[0].label + '-' + e[1].label
      this.province_id = e[0].value
      this.city_id = e[1].value
    },
    
    // 提交认证信息
    submit_msg(){
      let { nickName, userId, frontImg, backImg, insureImg, province, area, city} = this;
      
      if((this.nowYear == Number(this.choseYear)) && (this.nowMonth < Number(this.choseMonth))) return this.$message.info('请选择正确的出生日期')
      if(nickName == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入姓名'][this.LANGUAGE]}`);
      if(this.mobile == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入手机号'][this.LANGUAGE]}`);
      if(!validate(this.mobile, 'phone')) return this.$message.info(`${this.LANGUAGE_DATA['手机号格式不正确'][this.LANGUAGE]}`)
      if(this.postName == '') return this.$message.info('请选择职业类型')
      if(this.sex.length == 0) return this.$message.info(`${this.LANGUAGE_DATA['请选择性别'][this.LANGUAGE]}`)
      if(this.birth == '') return this.$message.info(`${this.LANGUAGE_DATA['请选择出生年月'][this.LANGUAGE]}`)
      if(city == '') return this.$message.info(`${this.LANGUAGE_DATA['请选择城市'][this.LANGUAGE]}`);
      if(this.addrDel == '') return this.$message.info('请输入详细地址');
      if(userId == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入身份证号'][this.LANGUAGE]}`);
      if(!validate(userId, 'idcard')) return this.$message.info('请输入正确的身份证号');
      if(frontImg == '') return this.$message.info('请上传身份证人像面');
      if(backImg == '') return this.$message.info('请上传身份证国徽面');
      if(insureImg == '') return this.$message.info(`${this.LANGUAGE_DATA['请上传手持身份证图片'][this.LANGUAGE]}`);
      
      if(!this.isCheckAgree) return this.$message.info(`${this.LANGUAGE_DATA['请阅读并勾选协议'][this.LANGUAGE]}`);
      uni.request({
        url: URL + global.apiUrls.attest, //仅为示例，并非真实接口地址。
        method: 'post',
        data: {
          real_name: nickName,
          id_number: userId,
          province: province,
          city: city,
          area: area,
          address: this.addrDel,
          phone: this.mobile,
          type: this.postName == '全职' ? 1 : 2,
          sex: this.sex,
          birthday: this.birth,
          id_front: frontImg,
          id_back: backImg,
          id_hold: insureImg,
          is_afresh: this.is_afresh,
          lng: this.longitude,
          lat: this.latitude,
        },
        header: {
          'user-token': this.token,
          'group-id' : '3',
        },
        success: (res) => {
          console.log(res.data);
          this.$message.info(res.data.msg);
          if (res.data.code == 1) {
            setTimeout(function(){
              uni.reLaunch({
                url: '/pagecenter/pages/login/auth_wait/index?type=2'
              })
            },1000)
          } else {
            
          }
        }
      });
    }
  }
}

</script>
<style lang="scss">
@import './index.scss';
</style>
