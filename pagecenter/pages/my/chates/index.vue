<template>
  <view class="cu-chat">
    <!-- header start -->
    <!-- <cu-custom bgColor="bg-white fixed" :isBack="true" :hasBorder="false">
      <block slot="content" class="text-black text-bold">{{
        group_name || "群聊"
      }}</block>
      <block slot="right" class="text-black text-bold">
        <view class="margin-right">
          <image
            src="./static/image/dots.png"
            mode=""
            class="dots-img"
            @tap="chatGroupManage"
          ></image>
        </view>
      </block>
    </cu-custom> -->
    <!-- <view class="cu-custom" :style="[{ height: CustomBar + 'px' }]">
      <view
        class="cu-bar bg-white"
        :style="[
          {
            height: CustomBar + 'px',
            paddingTop: StatusBar + 'px',
            borderBottom: '1rpx solid #eee',
          },
        ]"
      >
        <view class="action" @tap="back()">
          <text class="cuIcon-back"></text>
        </view>
        <view
          class="content"
          :style="[
            {
              top: StatusBar + 'px',
              fontSize: '36rpx',
              fontFamily: 'PingFang SC',
              fontWeight: '500',
            },
          ]"
          >{{ group_name }}</view
        >
      </view>
    </view> -->
    <!-- header end -->
    <view class="content" @touchstart="hideAll">
      <scroll-view class="msg-list" scroll-y="true" :scroll-top="scrollTop" @scrollToView="scrollToView"
        refresher-enabled refresher-background="#e5e5e5" :refresher-triggered="triggered"
        @refresherrefresh="getHistoryMsg">
        <view class=""> 
          <image src="static/image/loading.gif" mode="" class="loading-img"></image>
        </view>
        <view class="row" v-for="(row, index) in msgList" :key="index" :id="'msg' + row.id">
          <!-- 系统消息 -->
          <view v-if="row.type == 'system'">
            <view class="system">
              <!-- 文字消息 -->
              <view class="text">{{ row.content }}</view>
            </view>
          </view>
          <block v-else>
            <!-- 自己发出的消息 -->
            <view class="my" v-if="row.uid == myuid">
              <view class="left">
                <view v-if="row.type == 0" class="bubble">
                  <rich-text :nodes="row.content"></rich-text>
                </view>
                <view v-if="row.type == 1" class="bubble img" style="width: 150rpx; height: 150rpx" @tap="showPic(row)">
                  <image :src="row.content" style="width: 100% !important; height: 100%" mode="aspectFill"></image>
                </view>
              </view>
              <view class="right">
                <image :src="row.avatar || '../user/info/static/logo.png'" class="bg-gray" mode="aspectFill"></image>
              </view>
            </view>
            <!-- 别人发出的消息 -->
            <view class="other" v-if="row.uid != myuid">
              <view class="left" @tap="handleJump"
                :data-url="`/pages/index/homepage/index?name=${row.user_nickname}&id=${row.user_id}`">
                <image :src="row.avatar || '../user/info/static/logo.png'" class="bg-gray"></image>
              </view>
              <view class="right">
                <view v-if="row.type == 0" class="bubble">
                  <!-- <rich-text :nodes="row.msg.content"></rich-text> -->
                  <rich-text :nodes="row.content"></rich-text>
                </view>
                <view v-if="row.type == 1" class="bubble img" style="width: 150rpx; height: 150rpx" @tap="showPic(row)">
                  <image :src="row.content" style="width: 100% !important; height: 100%"></image>
                </view>
              </view>
            </view>
          </block>
        </view>
      </scroll-view>
    </view>

    <!-- 表情栏 -->
    <view class="emoji-box" :class="showEmji" @touchmove.stop.prevent="discard">
      <swiper class="swiper" indicator-dots="true" duration="150">
        <swiper-item v-for="(page, pid) in emojiList" :key="pid">
          <view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)">
            <image mode="widthFix" :src=" 'https://app.binyingfu.com/static/images/emoji/' + em.url "></image>
          </view>
        </swiper-item>
      </swiper>
    </view>


    <!-- 底部输入栏 -->
    <view class="input-box" :class="(showEmji, showHandle)" @touchmove.stop.prevent="discard">
      <!-- <view class="more" @tap="chooseImage"><view class="icon tupian"></view></view> -->
      <view class="flex align-center justify-between padding-lr top-box">
        <view class="textbox">
          <view class="text-mode">
            <view class="box">
              <textarea @focus="inputFocus" placeholder="请输入..." placeholder-style="font-size: 24rpx" auto-height="true" cursor-spacing="100"
                v-model="textMsg" id="textMsg" />
            </view>
          </view> 
        </view>
        <view class="flex align-center">
          <view class="em margin-right-sm" @tap.stop="chooseEmoji">
            <image src="/static/img/chatIcon4.png" mode="" class="icon-46"></image>
          </view>
          <label for="textMsg" v-if="textMsg">
            <view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText">
              <view class="btn">发送</view>
            </view>
          </label>
          <!-- <view class="" v-else @tap.stop="chooseHandle">  @tap.stop="chooseImage" -->
          <view class="" v-else @tap.stop="chooseHandle">
            <image src="/static/img/chatIcon3.png" mode="" class="icon-46"></image>
          </view>
        </view>
      </view>
    </view>
    <!-- 操作栏 -->
    <view class="handle-box flex align-center padding" :class="showHandle" @touchmove.stop.prevent="discard">
      <view class="flex align-center flex-direction margin-right padding-lr">
        <view class="" @tap="chooseImage('photo')">
          <image src="/static/img/chatIcon1.png" mode="" class="img-92"></image>
        </view>
        <view class="" style="margin-top: 24rpx;">
          <text class="text-sm text-gray">照片</text>
        </view>
      </view>
      <view class="flex align-center flex-direction margin-right padding-lr">
        <view class="" @tap="chooseImage('take')">
          <image src="/static/img/chatIcon2.png" mode="" class="img-92"></image>
        </view>
        <view class="" style="margin-top: 24rpx;">
          <text class="text-sm text-gray">拍摄</text>
        </view>
      </view>
    </view>

    <!-- 全屏遮罩层，解决ios无法关闭软键盘 -->
    <view v-if="onKeyboard" class="prop_ios" @tap="hideKeyboard"></view>
  </view>
</template>

<script>
  import { UPLOAD_IMAGE_URL } from "@/common/config.js";
  var that;
  var socketOpen = false;
  var socketMsgQueue = [];
  var kf_id = 0;
  var kf_name = "";
  // 是否点击显示表情的标志
  var flag = 1;
  var commChat = 1;
  export default {
    data() {
      return {
        triggered: false,
        msg_id: "", //最后一条消息id
        group_name: "", //群名称
        group_id: "", //群组id
        company_group_id: "", //公司结构内小组id
        friend_id: "",
        handleList: [{
            img: "/static/image/takephoto.png",
            name: "拍照",
          },
          {
            img: "/static/image/photos.png",
            name: "相册",
          },
        ],
        onKeyboard: false, //是否打开了软键盘
        kf_id: 0, //客服id
        imgUrl: this.$apiurl, //远程图片地址
        user: {}, //会员信息
        customer: {}, //客服信息
        //文字消息
        textMsg: "",
        //消息列表
        scrollAnimation: true, //是否开启滑动动画
        scrollTop: 0,
        scrollToView: "",
        msgList: [], //聊天列表
        msgImgList: [], //聊天图片列表
        myuid: 0, //我的uid
        //录音相关参数
        // #ifndef H5
        //H5不能录音
        RECORDER: uni.getRecorderManager(),
        // #endif
        isVoice: false,
        voiceTis: "按住 说话",
        recordTis: "手指上滑 取消发送",
        recording: false,
        willStop: false,
        initPoint: {
          identifier: 0,
          Y: 0
        },
        recordTimer: null,
        recordLength: 0,
        //播放语音相关参数
        AUDIO: uni.createInnerAudioContext(),
        playMsgid: null,
        VoiceTimer: null,
        //表情定义
        showEmji: false,
        showHandle: false,
        emojiList: [
          [{
              url: "100.gif",
              alt: "[微笑]"
            },
            {
              url: "101.gif",
              alt: "[伤心]"
            },
            {
              url: "102.gif",
              alt: "[美女]"
            },
            {
              url: "103.gif",
              alt: "[发呆]"
            },
            {
              url: "104.gif",
              alt: "[墨镜]"
            },
            {
              url: "105.gif",
              alt: "[哭]"
            },
            {
              url: "106.gif",
              alt: "[羞]"
            },
            {
              url: "107.gif",
              alt: "[哑]"
            },
            {
              url: "108.gif",
              alt: "[睡]"
            },
            {
              url: "109.gif",
              alt: "[哭]"
            },
            {
              url: "110.gif",
              alt: "[囧]"
            },
            {
              url: "111.gif",
              alt: "[怒]"
            },
            {
              url: "112.gif",
              alt: "[调皮]"
            },
            {
              url: "113.gif",
              alt: "[笑]"
            },
            {
              url: "114.gif",
              alt: "[惊讶]"
            },
            {
              url: "115.gif",
              alt: "[难过]"
            },
            {
              url: "116.gif",
              alt: "[酷]"
            },
            {
              url: "117.gif",
              alt: "[汗]"
            },
            {
              url: "118.gif",
              alt: "[抓狂]"
            },
            {
              url: "119.gif",
              alt: "[吐]"
            },
            {
              url: "120.gif",
              alt: "[笑]"
            },
            {
              url: "121.gif",
              alt: "[快乐]"
            },
            {
              url: "122.gif",
              alt: "[奇]"
            },
            {
              url: "123.gif",
              alt: "[傲]"
            },
          ],
          [{
              url: "124.gif",
              alt: "[饿]"
            },
            {
              url: "125.gif",
              alt: "[累]"
            },
            {
              url: "126.gif",
              alt: "[吓]"
            },
            {
              url: "127.gif",
              alt: "[汗]"
            },
            {
              url: "128.gif",
              alt: "[高兴]"
            },
            {
              url: "129.gif",
              alt: "[闲]"
            },
            {
              url: "130.gif",
              alt: "[努力]"
            },
            {
              url: "131.gif",
              alt: "[骂]"
            },
            {
              url: "132.gif",
              alt: "[疑问]"
            },
            {
              url: "133.gif",
              alt: "[秘密]"
            },
            {
              url: "134.gif",
              alt: "[乱]"
            },
            {
              url: "135.gif",
              alt: "[疯]"
            },
            {
              url: "136.gif",
              alt: "[哀]"
            },
            {
              url: "137.gif",
              alt: "[鬼]"
            },
            {
              url: "138.gif",
              alt: "[打击]"
            },
            {
              url: "139.gif",
              alt: "[bye]"
            },
            {
              url: "140.gif",
              alt: "[汗]"
            },
            {
              url: "141.gif",
              alt: "[抠]"
            },
            {
              url: "142.gif",
              alt: "[鼓掌]"
            },
            {
              url: "143.gif",
              alt: "[糟糕]"
            },
            {
              url: "144.gif",
              alt: "[恶搞]"
            },
            {
              url: "145.gif",
              alt: "[什么]"
            },
            {
              url: "146.gif",
              alt: "[什么]"
            },
            {
              url: "147.gif",
              alt: "[累]"
            },
          ],
          [{
              url: "148.gif",
              alt: "[看]"
            },
            {
              url: "149.gif",
              alt: "[难过]"
            },
            {
              url: "150.gif",
              alt: "[难过]"
            },
            {
              url: "151.gif",
              alt: "[坏]"
            },
            {
              url: "152.gif",
              alt: "[亲]"
            },
            {
              url: "153.gif",
              alt: "[吓]"
            },
            {
              url: "154.gif",
              alt: "[可怜]"
            },
            {
              url: "155.gif",
              alt: "[刀]"
            },
            {
              url: "156.gif",
              alt: "[水果]"
            },
            {
              url: "157.gif",
              alt: "[酒]"
            },
            {
              url: "158.gif",
              alt: "[篮球]"
            },
            {
              url: "159.gif",
              alt: "[乒乓]"
            },
            {
              url: "160.gif",
              alt: "[咖啡]"
            },
            {
              url: "161.gif",
              alt: "[美食]"
            },
            {
              url: "162.gif",
              alt: "[动物]"
            },
            {
              url: "163.gif",
              alt: "[鲜花]"
            },
            {
              url: "164.gif",
              alt: "[枯]"
            },
            {
              url: "165.gif",
              alt: "[唇]"
            },
            {
              url: "166.gif",
              alt: "[爱]"
            },
            {
              url: "167.gif",
              alt: "[分手]"
            },
            {
              url: "168.gif",
              alt: "[生日]"
            },
            {
              url: "169.gif",
              alt: "[电]"
            },
            {
              url: "170.gif",
              alt: "[炸弹]"
            },
            {
              url: "171.gif",
              alt: "[刀子]"
            },
          ],
          [{
              url: "172.gif",
              alt: "[足球]"
            },
            {
              url: "173.gif",
              alt: "[瓢虫]"
            },
            {
              url: "174.gif",
              alt: "[翔]"
            },
            {
              url: "175.gif",
              alt: "[月亮]"
            },
            {
              url: "176.gif",
              alt: "[太阳]"
            },
            {
              url: "177.gif",
              alt: "[礼物]"
            },
            {
              url: "178.gif",
              alt: "[抱抱]"
            },
            {
              url: "179.gif",
              alt: "[拇指]"
            },
            {
              url: "180.gif",
              alt: "[贬低]"
            },
            {
              url: "181.gif",
              alt: "[握手]"
            },
            {
              url: "182.gif",
              alt: "[剪刀手]"
            },
            {
              url: "183.gif",
              alt: "[抱拳]"
            },
            {
              url: "184.gif",
              alt: "[勾引]"
            },
            {
              url: "185.gif",
              alt: "[拳头]"
            },
            {
              url: "186.gif",
              alt: "[小拇指]"
            },
            {
              url: "187.gif",
              alt: "[拇指八]"
            },
            {
              url: "188.gif",
              alt: "[食指]"
            },
            {
              url: "189.gif",
              alt: "[ok]"
            },
            {
              url: "190.gif",
              alt: "[情侣]"
            },
            {
              url: "191.gif",
              alt: "[爱心]"
            },
            {
              url: "192.gif",
              alt: "[蹦哒]"
            },
            {
              url: "193.gif",
              alt: "[颤抖]"
            },
            {
              url: "194.gif",
              alt: "[怄气]"
            },
            {
              url: "195.gif",
              alt: "[跳舞]"
            },
          ],
          [{
              url: "196.gif",
              alt: "[发呆]"
            },
            {
              url: "197.gif",
              alt: "[背着]"
            },
            {
              url: "198.gif",
              alt: "[伸手]"
            },
            {
              url: "199.gif",
              alt: "[耍帅]"
            },
            {
              url: "200.png",
              alt: "[微笑1]"
            },
            {
              url: "201.png",
              alt: "[生病]"
            },
            {
              url: "202.png",
              alt: "[哭泣]"
            },
            {
              url: "203.png",
              alt: "[吐舌]"
            },
            {
              url: "204.png",
              alt: "[迷糊]"
            },
            {
              url: "205.png",
              alt: "[瞪眼]"
            },
            {
              url: "206.png",
              alt: "[恐怖]"
            },
            {
              url: "207.png",
              alt: "[忧愁]"
            },
            {
              url: "208.png",
              alt: "[眨眉]"
            },
            {
              url: "209.png",
              alt: "[闭眼]"
            },
            {
              url: "210.png",
              alt: "[鄙视]"
            },
            {
              url: "211.png",
              alt: "[阴暗]"
            },
            {
              url: "212.png",
              alt: "[小鬼]"
            },
            {
              url: "213.png",
              alt: "[礼物]"
            },
            {
              url: "214.png",
              alt: "[拜佛]"
            },
            {
              url: "215.png",
              alt: "[力量]"
            },
            {
              url: "216.png",
              alt: "[金钱]"
            },
            {
              url: "217.png",
              alt: "[蛋糕]"
            },
            {
              url: "218.png",
              alt: "[彩带]"
            },
            {
              url: "219.png",
              alt: "[礼物]"
            },
          ],
        ],
        designerId: '', // 平台设计师， 返回0不能发起平台介入
        projectId: '', // 项目id
        otherUserId: '', // 聊天对象的userId
        userInforMsg: '', // 用户信息获取
        
        show: false,    // 申请平台介入的弹窗
        isSever: '',     // 0否1是
        myUserId: '',              // 自己的id
        isShowBlacklist: 0,                 // 1 展示 0隐藏
        blockShow: false,
      };
    },
    onReady() {},
    onLoad(option) {
      this.group_id = option.group_id;
      // this.otherUserId = option.userId;
      // this.company_group_id = option.company_group_id;
      this.group_name = option.group_name;
      
      uni.setNavigationBarTitle({
        title: this.group_name
      });
      
      // this.getGroupDetail(); //获取群组信息
      that = this;
      // 获取用户自己的信息
      let user_data = uni.getStorageSync("USER_INFO");
      if (user_data) {
        this.myuid = "user-" + user_data.id;
        this.user.id = user_data.id;
        this.user.name = user_data.user_nickname;
        this.user.avatar = user_data.head_img;
        this.user.group = 1;
      } else {
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
      /* 获取聊天记录 */
      this.getChatHistory(this.group_id);

      uni.$on("receiveMsg", (data) => {
        if (data.user_id == this.myuid) return;
        if (data.type != 1) {
          let msgContent = that.replaceEmoji(data.content);
          data.content = msgContent;
          data.uid = data.user_id;
          data.avatar = data.head_img;
          that.msgList.push(data);
        } else {
          data.uid = data.user_id;
          data.avatar = data.head_img;
          that.msgList.push(data);
        }
        that.$nextTick(function() {
          that.scrollTop = this.scrollTop += 999;
          that.scrollAnimation = true;
        });
      });
      
      // this.getUserMsg()
    },
    onShow() {
      // this.getGroupDetail();
    },
    onNavigationBarButtonTap() {
      
    },
    onUnload() {
      uni.$off("chatChange");
      // uni.$off('receiveMsg')
    },
    /**
     * @function
     * @description 监听页面返回
     * @param {Object} e - {from:backbutton、 navigateBack}
     *  backbutton 表示来源是左上角返回按钮或 android 返回键；
     *  navigateBack表示来源是 uni.navigateBack
     */
    onBackPress(e) {
      uni.$off("receiveMsg");
      uni.$emit("backEmit");
    },
    methods: {
      back(delta) {
        uni.navigateBack({
          delta: delta || 1,
        });
      },

      /**
       * 获取用户信息
       */
      getUserMsg() {
        this.$api.post(global.apiUrls.postGetUserInfo).then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.userInforMsg = res.data.data
            this.myUserId = res.data.user.id
          } else {

          }
        })
      },

      // 获取群组信息  getGroupDetail
      getGroupDetail() {
        return false;
        this.$api.post(global.apiUrls.getGroupDetail, {
          group_id: this.group_id,
        }).then((res) => {
          if (res.data.code == 1) {
            this.group_name = res.data.data.name;
            uni.setNavigationBarTitle({
              title: res.data.data.name || "群聊",
            });
          }
        });
      },
      inputFocus() {
        this.onKeyboard = true;
        this.showEmji = false;
      },
      // 群管理跳转
      chatGroupManage() {
        this.$urouter.navigateTo({
          url: "/pages/company/message/group-chat/group-manage",
          params: {
            group_id: this.group_id,
            group_name: this.group_name,
            company_group_id: this.company_group_id,
          },
        });
      },
      hideKeyboard(e) {
        uni.hideKeyboard();
        this.onKeyboard = false;
      },

      /**
       * 跳转到创建订单  @tap="handleJump" :data-url="`/pages/message/launchOrder/index?id=${projectId}&userId=${otherUserId}`"
       */
      jumpOrder() {
        if (this.userInforMsg.user_level != 0) {
          uni.navigateTo({
            url: '/pages/message/launchOrder/index?id=' + this.projectId + '&userId=' + this.otherUserId
          })
        } else {
          this.$message.info('您还未认证成为设计师，请先认证')
        }
      },
      
      /**
       * 退出群聊 ，(刚开始沟通的只有设计师才有此功能，现在更改为所有人都可以退出群聊)
       */
      signOutChat(){
        let that = this
        uni.showModal({
          title: '提示',
          content: '是否确认退出群聊?',
          success: res => {
            if (res.confirm) {
              that.$api.post(global.apiUrls.outChat,{
                group_id: that.group_id,
                user_id: that.myUserId
              }).then(res=>{
                console.log(res)
                that.$message.info(res.data.msg) 
                if(res.data.code == 1){
                  uni.$emit('noteMsg',that.group_id)
                  setTimeout(function(){
                    uni.navigateBack({})
                  },600)
                }else{
                  
                }
              }).catch(err => {
                
              })
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      },

      /* 加载下一页  "group-" */
      getHistoryMsg() {
        console.log("加载下一页");
        if (this.triggered) return;
        this.triggered = true;
        this.$api.post(global.apiUrls.getChatHistory, {
          toid: "user-" + this.group_id,
          msg_id: this.msg_id,
          size: 15,
        }).then((res) => {
          console.log(res, "聊天记录列表");
          if (res.data.code == 1) {
            let newlist = res.data.data.reverse();
            if (newlist.length) this.msg_id = newlist[0].msgid;
            this.msgList = [...newlist, ...this.msgList];
          }
        });
        uni.stopPullDownRefresh();
        setTimeout(() => {
          this.triggered = false;
        }, 500);
      },
      // 获取聊天记录
      getChatHistory(id) {
        this.$api.post(global.apiUrls.getChatHistory, {
          toid: "user-" + id,
          size: 15,
        }).then((res) => {
          console.log(res, "聊天记录列表");
          this.group_name = res.data.data.title
          uni.setNavigationBarTitle({
            title: this.group_name,
          });
          this.isSever = res.data.data.is_service
          if (res.data.code == 1 && res.data.data.length > 0) {
            
            this.msgList = res.data.data.reverse();
            this.msg_id = this.msgList[0].msgid;
            // 滚动到底部
            this.$nextTick(function() {
              this.scrollTop = 99999;
              this.scrollAnimation = true;
            });
          }
        });
      },
      
      /**
       * 获取聊天记录
       */
      updateRecord(){
        this.$api.post(global.apiUrls.getChatHistory, {
          toid: "user-" + this.group_id,
          size: 15,
        }).then((res) => {
          
        });
      },
      
      // 发送消息
      sendMsg(content, type) {
        // if (content.length > 250) {
        //   this.$message.info("您输入的内容的太多啦");
        //   return;
        // }
        this.$api.post(global.apiUrls.sendContent, {
          toid: "user-" + this.group_id,
          // toid: "user-" + this.group_id,
          content: content,
          type: type,
        }).then((res) => {
          if (res.data.code == 1) {
            let data = res.data.data.message;
            console.log("发送消息", data);
            let msg = {
              magid: data.msgid, //消息id
              user_id: data.uid, //我的ID
              type: type,
              content: data.content,
              nickname: data.nickname,
              head_img: this.user.avatar,
            };
            console.log('984-----------',this.$socket)
            this.$socket.emit("sendmsg", {
              uid: data.toid, // 消息体
              msg: msg,
            });
            this.showMsg(msg, type);
            this.hideKeyboard(); // 隐藏软键盘
            this.showHandle = false;
            this.showEmji = false;
          } else {
            this.$message.info(res.data.msg);
          }
        });
      },
      showMsg(data, type) {
        var nowDate = new Date();
        let lastid = 0,
          content = "";
        if (this.msgList.length > 0) {
          lastid = this.msgList[this.msgList.length - 1].msgid;
        }
        lastid++;
        if (type != 1) {
          content = this.replaceEmoji(data.content);
        } else {
          content = data.content;
        }
        let msg = {
          id: lastid,
          uid: data.user_id,
          username: data.nickname,
          avatar: data.head_img,
          time: nowDate.getHours() + ":" + nowDate.getMinutes(),
          type: type ? type : "0",
          msg: content,
          content: content,
        };
        this.screenMsg(msg);
      },
      getMsgList() {
        // 读取本地聊天记录
        // let kf_id = this.kf_id == 0 ? uni.getStorageSync('kf_id') : this.kf_id;
        // var key = kf_id + '-' + this.user.id;
        // // 消息列表
        // let list = this.getCacheChat(key) ? this.getCacheChat(key) : [];
        // var msg_code = this.msg_code;
        // console.log(list, '缓存聊天记录', key);

        // // 获取消息中的图片,并处理显示尺寸
        // for (let i = 0; i < list.length; i++) {
        //   if (list[i].type == 'img') {
        //     list[i] = this.setPicSize(list[i]);
        //     console.log('list[i]: ' + JSON.stringify(list[i]));
        //     this.msgImgList.push(list[i].msg.url);
        //   }
        // }
        // if (list.length > 0) {
        //   this.msgList = list;
        // } else {
        //   this.msgList = msg_code;
        // }

        // 滚动到底部
        this.$nextTick(function() {
          this.scrollTop = 9999;
          this.scrollAnimation = true;
        });
      },
      //处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
      setPicSize(row) {
        if (typeof row.msg == "object") {
          return row;
        }
        let url = row.msg;
        let pa = /.*\[(.*)\]/;
        let path = url.match(pa) ? url.match(pa)[1] : "";
        row.msg = path || row.msg;
        return row;
        /* 下方为原始逻辑，已废弃 */
        let maxW = uni.upx2px(350);
        let maxH = uni.upx2px(350);
        if (row.msg.w > maxW || row.msg.h > maxH) {
          let scale = row.msg.w / row.msg.h;
          if (row.msg.w > row.msg.h) {
            row.msg.w = maxW;
            row.msg.h = row.msg.w / scale;
          } else {
            row.msg.h = maxH;
            row.msg.w = row.msg.h * scale;
          }
        }
        return row;
      },
      // 接受消息(筛选处理)
      screenMsg(msg) {
        console.log("处理消息", msg);
        //从长连接处转发给这个方法，进行筛选处理
        if (msg.uid != this.myuid) {
          uni.vibrateLong();
        }
        switch (msg.type) {
          case "0":
            this.addTextMsg(msg);
            break;
          case 1:
            this.addImgMsg(msg);
            break;
        }
        this.$nextTick(function() {
          this.scrollTop += 9999;
          this.scrollAnimation = true;
          // this.scrollToView = 'msg' + msg.id;
        });
        // 储存聊天记录
        var key = this.kf_id + "-" + this.user.id;
        var localMsg = this.getCacheChat(key);
        if (localMsg == null || localMsg.length == 0) {
          localMsg = [];
        }
        localMsg.push(msg);
        this.setCacheChat({
          key: key,
          data: localMsg
        });
      },
      // 选择表情
      chooseEmoji() {
        this.hideKeyboard(); //隐藏软键盘
        this.showEmji = this.showEmji == "showEmoji" ? "hideEmoji" : "showEmoji";
        //    this.showEmji = !this.showEmji;
        // this.showHandle = false
      },
      hideAll() {
        this.showEmji = this.showEmji == "showEmoji" ? "hideEmoji" : "";
        this.showHandle = this.showHandle == "showhandle" ? "hidehandle" : "";
        // this.showHandle = false
        // this.showEmji = false
      },
      // 选择操作
      chooseHandle() {
        this.hideKeyboard(); //隐藏软键盘
        // this.showHandle = ! this.showHandle;
        this.showHandle = this.showHandle == "showhandle" ? "hidehandle" : "showhandle";
        this.showEmji = false;
      },
      //添加表情
      addEmoji(em) {
        this.textMsg += em.alt;
      },
      // 发送文字消息
      sendText() {
        if (!this.textMsg) {
          return;
        }
        let content = this.replaceEmoji(this.textMsg);
        this.sendMsg(content, 0);
        this.textMsg = "";
        this.showHandle = false;
        this.updateRecord()
      },
      //替换表情符号为图片
      replaceEmoji(str) {
        // str = str.replace(/emoji/g, ' '); // 去除 emoji 这个字符串
        let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
          console.log(item, "表情");
          for (let i = 0; i < this.emojiList.length; i++) {
            let row = this.emojiList[i];
            for (let j = 0; j < row.length; j++) {
              let EM = row[j];
              if (EM.alt == item) {
                //在线表情路径，图文混排必须使用网络路径
                let onlinePath =
                  "https://app.binyingfu.com/statis/images/emoji/";
                let imgstr = '<img src="' + onlinePath + EM.url + '">';
                return imgstr;
              }
            }
          }
        });
        return replacedStr;
      },

      // 添加系统文字消息到列表
      addSystemTextMsg(msg) {
        this.msgList.push(msg);
      },
      // 处理文字消息
      addTextMsg(msg) {
        console.log("处理文字消息", msg);
        this.msgList.push(msg);
      },
      // 处理语音消息
      addVoiceMsg(msg) {
        this.msgList.push(msg);
      },
      // 处理图片消息
      addImgMsg(msg) {
        msg = this.setPicSize(msg);
        this.msgImgList.push(msg.msg);
        this.msgList.push(msg);
      },
      // 预览图片
      showPic(row) {
        console.log(row);
        let imgs = new Array();
        imgs.push(row.content);
        uni.previewImage({
          indicator: "none",
          current: 1,
          urls: imgs,
        });
      },
      discard() {
        return;
      },
      getCacheChat(key) {
        return uni.getStorageSync(key);
      },
      setCacheChat(obj) {
        uni.setStorageSync(obj.key, obj.data);
      },

      // 选择图片发送
      chooseImage(type) {
        // this.hideEmoji();
        if (type == 'photo') {
          this.uploadImg((res) => {
            console.log(res, "上传图片");
            // let msg = 'img[' + res.data[0].path + ']';
            let msg = res.data[0].path;
            this.sendMsg(msg, 1);
          });
        } else if (type == 'take') {
          this.shoot((res) => {
            console.log(res, "上传图片");
            // let msg = 'img[' + res.data[0].path + ']';
            let msg = res.data[0].path;
            this.sendMsg(msg, 1);
          });
        } else {
          this.shoot((res) => {
            let msg = res.data[0].path;
            this.sendMsg(msg, 1);
          })
        }
        return false;
      },
      /*
       *   上传图片
       * 		successFn  //回调
       * 		num		  	//选择图片的数量
       * 		data		//上传的参数
       * 		progressFn	//进度的回调
       */
      uploadImg(successFn, num = 1, data = {}, progressFn) {
        //上传图片
        // let url = UPLOAD_IMAGE_URL;
        uni.chooseImage({
          count: num, //默认1
          sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album"], //从相册选择
          success: function(res) {
            //选择后
            const tempFilePaths = res.tempFilePaths;
            let fileList = {}; //储存上传实例；
            for (var i in tempFilePaths) {
              fileList["uploadTask" + i] = uni.uploadFile({
                //上传后台
                url: UPLOAD_IMAGE_URL,
                filePath: tempFilePaths[i],
                name: "file[]",
                formData: data,
                success: function(upRes) {
                  //上传成功
                  //uni.hideLoading();
                  //console.log(upRes, '上传图片');
                  if (upRes.statusCode == 200) {
                    let data = JSON.parse(upRes.data);
                    if (typeof successFn == "function") {
                      successFn(data);
                    }
                  } else {
                    uni.showToast({
                      title: upRes.errMsg,
                      icon: "none",
                    });
                  }
                },
                fail: function(err) {
                  //console.log('上传失败',err);
                  uni.showToast({
                    title: "图片上传失败，请稍后再试." + err.errMsg,
                    icon: "none",
                  });
                },
              });
              //监听进度
              fileList["uploadTask" + i].onProgressUpdate(function(res) {
                if (typeof progressFn == "function") {
                  progressFn(res);
                }
                if (res.progress < 99.99) {
                  uni.showLoading({
                    title: res.progress + "%",
                  });
                } else {
                  uni.hideLoading();
                }
                //console.log('上传进度' + res.progress);
                //console.log('已经上传的数据长度' + res.totalBytesSent);
                //console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
              });
            }
          }, //选择成功——end
        });
      },


      /**
       * 拍摄照片
       */
      shoot(successFn, num = 1, data = {}, progressFn) {
        uni.chooseImage({
          count: num, //默认1
          sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["camera"], //从相册选择
          success: function(res) {
            //选择后
            const tempFilePaths = res.tempFilePaths;
            let fileList = {}; //储存上传实例；
            for (var i in tempFilePaths) {
              fileList["uploadTask" + i] = uni.uploadFile({
                //上传后台
                url: UPLOAD_IMAGE_URL,
                filePath: tempFilePaths[i],
                name: "file[]",
                formData: data,
                success: function(upRes) {
                  //上传成功
                  //uni.hideLoading();
                  console.log(upRes, '上传图片');
                  if (upRes.statusCode == 200) {
                    let data = JSON.parse(upRes.data);
                    console.log('994------------', successFn)
                    if (typeof successFn == "function") {
                      console.log('995-----------', data)
                      successFn(data);
                    } else {

                    }
                  } else {
                    uni.showToast({
                      title: upRes.errMsg,
                      icon: "none",
                    });
                  }
                },
                fail: function(err) {
                  //console.log('上传失败',err);
                  uni.showToast({
                    title: "图片上传失败，请稍后再试." + err.errMsg,
                    icon: "none",
                  });
                },
              });
              //监听进度
              fileList["uploadTask" + i].onProgressUpdate(function(res) {
                if (typeof progressFn == "function") {
                  progressFn(res);
                }
                if (res.progress < 99.99) {
                  uni.showLoading({
                    title: res.progress + "%",
                  });
                } else {
                  uni.hideLoading();
                }
                //console.log('上传进度' + res.progress);
                //console.log('已经上传的数据长度' + res.totalBytesSent);
                //console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
              });
            }
          }, //选择成功——end
        });
      }
    },
  };
</script>

<style lang="scss">
  .loading-img {
    width: 80rpx;
    height: 80rpx;
  }

  .dots-img {
    width: 32rpx;
    height: 32rpx;
  }

  .img-92 {
    width: 92rpx;
    height: 92rpx;
    display: block;
  }

  .icon-46 {
    width: 46rpx;
    height: 46rpx;
    display: block;
  }

  page {
    background-color: #fff;
  }

  .prop_ios {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: calc(100% - 100upx);
    background: rgba(0, 0, 0, 0);
  }

  @font-face {
    font-family: "HMfont-home";
    src: url("data:application/x-font-woff2;charset=utf-8;base64,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") format("woff2");
  }

  .icon {
    font-family: "HMfont-home" !important;
    font-size: 56upx;
    font-style: normal;
    color: #333;

    &.biaoqing:before {
      content: "\e797";
    }

    &.jianpan:before {
      content: "\e7b2";
    }

    &.yuyin:before {
      content: "\e805";
    }

    &.tupian:before {
      content: "\e639";
    }

    &.chehui:before {
      content: "\e904";
    }

    &.luyin:before {
      content: "\e905";
    }

    &.luyin2:before {
      content: "\e677";
    }

    &.other-voice:before {
      content: "\e667";
    }

    &.my-voice:before {
      content: "\e906";
    }
  }

  .hidden {
    display: none !important;
  }

  @keyframes showEM {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-42vw);
    }
  }

  @keyframes hideEM {
    0% {
      transform: translateY(-42vw);
    }

    100% {
      transform: translateY(0);
    }
  }

  .emoji-box {
    &.hideEmoji {
      animation: hideEM 0.15s linear both;
    }

    &.showEmoji {
      animation: showEM 0.15s linear both;
    }

    width: 100%;
    height: 42vw;
    // padding: 20upx 2%;
    background-color: #fff;
    border-top: solid 1upx #ddd;
    position: fixed;
    z-index: 20;
    top: 100%;

    .swiper {
      swiper-item {
        display: flex;
        flex-wrap: wrap;

        view {
          width: 12vw;
          height: 12vw;
          display: flex;
          justify-content: center;

          image {
            width: 60%;
          }
        }
      }
    }
  }

  .handle-box {
    flex-wrap: wrap;
    &.hidehandle {
      animation: hideEM 0.15s linear both;
    }

    &.showhandle {
      animation: showEM 0.15s linear both;
    }

    width: 100%;
    height: 42vw;
    padding: 20upx 2%;
    padding-bottom: env(safe-area-inset-bottom);
    background: #FFFFFF;
    border-top: solid 1upx #ddd;
    position: fixed;
    z-index: 20;
    top: 100%;
    // bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
  }

  .input-box {
    &.hideEmoji {
      animation: hideEM 0.15s linear both;
    }

    &.showEmoji {
      animation: showEM 0.15s linear both;
    }

    &.hidehandle {
      animation: hideEM 0.15s linear both;
    }

    &.showhandle {
      animation: showEM 0.15s linear both;
    }

    .top-box {
      min-height: 100rpx;
    }

    background: #FFFFFF;
    width: 100%;
    // display: flex;
    position: fixed;
    z-index: 20;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
    // bottom: env(safe-area-inset-bottom);
    // box-sizing: content-box;

    .voice,
    .more {
      flex-shrink: 0;
      width: 90upx;
      height: 100upx;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .send {
      //H5发送按钮左边距
      /* #ifdef H5 */
      margin-left: 20upx;
      /* #endif */
      flex-shrink: 0;
      width: 100upx;
      height: 100upx;
      display: flex;
      align-items: center;

      .btn {
        width: 90upx;
        height: 56upx;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #AD74FF;
        color: #fff;
        border-radius: 6upx;
        font-size: 24upx;
      }
    }

    .textbox {
      width: 600rpx;
      min-height: 70upx;

      .voice-mode {
        width: calc(100% - 2upx);
        height: 68upx;
        border-radius: 70upx;
        border: solid 1upx #cdcdcd;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28upx;
        background-color: #fff;
        color: #555;

        &.recording {
          background-color: #e5e5e5;
        }
      }

      .text-mode {
        width: 96%;
        min-height: 70upx;
        display: flex;
        background-color: #F6F7F9;
        border-radius: 5px;

        .box {
          width: 100%;
          padding-left: 30upx;
          min-height: 70upx;
          display: flex;
          align-items: center;

          textarea {
            width: 100%;
            font-size: 28rpx;
          }
        }

        .em {
          flex-shrink: 0;
          width: 80upx;
          height: 70upx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
  
  .severTips{
    color: #111111;
    font-weight: 600;
    width: 600rpx;
    height: 442rpx;
    box-sizing: border-box;
    padding: 48rpx 32rpx;
    display: flex;
    flex-direction: column;   
    align-items: center;
    justify-content: space-between;
    .acknow{
      text-align: center;
      font-size: 32rpx;
      padding: 85rpx 0 0;
    }
    .tipsCon{
      text-align: center;
      .surTip{
        font-size: 34rpx;
        margin-bottom: 24rpx;
      }
    }
    .btns{
      display: flex;
      flex-direction: row;   
      align-items: center;
      justify-content: space-between;
      margin-top: 64rpx;
      width: 100%;
      .surBtn{
        width: 240rpx;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        border-radius: 5px;
        font-size: 32rpx;
      }
      .letMeSee{
        border: 1px solid #AD74FF;
        color: #AD74FF;
      }
      .isOk{
        background-color: #AD74FF;
        color: #fff;
      }
    }
    
  }

  .record {
    width: 40vw;
    height: 40vw;
    position: fixed;
    top: 55%;
    left: 30%;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 20upx;

    .ing {
      width: 100%;
      height: 30vw;
      display: flex;
      justify-content: center;
      align-items: center;

      @keyframes volatility {
        0% {
          background-position: 0% 130%;
        }

        20% {
          background-position: 0% 150%;
        }

        30% {
          background-position: 0% 155%;
        }

        40% {
          background-position: 0% 150%;
        }

        50% {
          background-position: 0% 145%;
        }

        70% {
          background-position: 0% 150%;
        }

        80% {
          background-position: 0% 155%;
        }

        90% {
          background-position: 0% 140%;
        }

        100% {
          background-position: 0% 135%;
        }
      }

      .icon {
        background-image: linear-gradient(to bottom, #f09b37, #fff 50%);
        background-size: 100% 200%;
        animation: volatility 1.5s ease-in-out -1.5s infinite alternate;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 150upx;
        color: #f09b37;
      }
    }

    .cancel {
      width: 100%;
      height: 30vw;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        color: #fff;
        font-size: 150upx;
      }
    }

    .tis {
      width: 100%;
      height: 10vw;
      display: flex;
      justify-content: center;
      font-size: 28upx;
      color: #fff;

      &.change {
        color: #f09b37;
      }
    }
  }

  .content {
    width: 100%;

    .msg-list {
      width: 100%;
      padding: 0 2%;
      position: absolute;
      top: 0;
      bottom: 100upx;
      background-color: #F5F5F5;

      .row {
        .system {
          display: flex;
          justify-content: center;

          view {
            padding: 12rpx 30upx;
            // height: 50upx;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #c9c9c9;
            color: #fff;
            font-size: 24upx;
            border-radius: 40upx;
          }

          .red-envelope {
            image {
              margin-right: 5upx;
              width: 30upx;
              height: 30upx;
            }
          }
        }

        &:first-child {
          margin-top: 20upx;
        }

        padding: 20upx 0;

        .my .left,
        .other .right {
          width: 100%;
          display: flex;

          .bubble {
            max-width: 85%;
            min-height: 50upx;
            border-radius: 10upx;
            padding: 15upx 20upx;
            display: flex;
            align-items: center;
            font-size: 32upx;
            word-break: break-word;

            &.img {
              background-color: transparent;
              padding: 0;
              overflow: hidden;

              image {
                max-width: 350upx;
                max-height: 350upx;
              }
            }

            &.voice {
              .icon {
                font-size: 40upx;
                display: flex;
                align-items: center;
              }

              .icon:after {
                content: " ";
                width: 53upx;
                height: 53upx;
                border-radius: 100%;
                position: absolute;
                box-sizing: border-box;
              }

              .length {
                font-size: 28upx;
              }
            }
          }
        }

        .my .right,
        .other .left {
          flex-shrink: 0;
          width: 80upx;
          height: 80upx;

          image {
            width: 80upx;
            height: 80upx;
            border-radius: 10upx;
          }
        }

        .my {
          width: 100%;
          display: flex;
          justify-content: flex-end;

          .left {
            min-height: 80upx;

            align-items: center;
            justify-content: flex-end;

            .bubble {
              background-color: #fff;
              color: #333;

              &.voice {
                .icon {
                  color: #fff;
                }

                .length {
                  margin-right: 20upx;
                }
              }

              &.play {
                @keyframes my-play {
                  0% {
                    transform: translateX(80%);
                  }

                  100% {
                    transform: translateX(0%);
                  }
                }

                .icon:after {
                  border-left: solid 10upx rgba(240, 108, 122, 0.5);
                  animation: my-play 1s linear infinite;
                }
              }
            }
          }

          .right {
            margin-left: 15upx;
          }
        }

        .other {
          width: 100%;
          display: flex;

          .left {
            margin-right: 15upx;
          }

          .right {
            flex-wrap: wrap;

            .username {
              width: 100%;
              height: 45upx;
              font-size: 24upx;
              color: #999;
              display: flex;

              .name {
                margin-right: 50upx;
              }
            }

            .bubble {
              background-color: #fff;
              color: #333;

              &.voice {
                .icon {
                  color: #333;
                }

                .length {
                  margin-left: 20upx;
                }
              }

              &.play {
                @keyframes other-play {
                  0% {
                    transform: translateX(-80%);
                  }

                  100% {
                    transform: translateX(0%);
                  }
                }

                .icon:after {
                  border-right: solid 10upx rgba(255, 255, 255, 0.8);

                  animation: other-play 1s linear infinite;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
