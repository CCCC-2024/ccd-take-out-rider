<template>
  <view class="page">
    <view class="nav_barH"></view>
    <!-- 头部 -->

    <view class="page_header">
      <image
        src="/pagecenter/static/login/login_bg.png"
        mode=""
        class="bg_img"
      ></image>
      <view class="heade_con">
        <view class="headTitie">{{
          LANGUAGE_DATA["欢迎来到星橙送外卖"][LANGUAGE]
        }}</view>
      </view>
    </view>
    <view class="login">
      <view class="">
        <view class="item">
          <view class="">{{ LANGUAGE_DATA["账号"][LANGUAGE] }}</view>
          <view class="item_left">
            <view class="entry">
              <input
                type="number"
                :placeholder="LANGUAGE_DATA['请输入手机号'][LANGUAGE]"
                v-model="m_phone"
                style="width: 500rpx"
              />
            </view>
          </view>
        </view>
        <view class="item" v-if="isacount">
          <view class="">{{ LANGUAGE_DATA["密码"][LANGUAGE] }}</view>
          <view class="item_left">
            <view class="entry">
              <input
                placeholder-class="input-placeholder"
                type="password"
                v-if="passwordInputType == 'password'"
                v-model="m_password"
                :placeholder="
                  LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]
                "
                style="width: 500rpx"
              />
              <input
                placeholder-class="input-placeholder"
                v-if="passwordInputType == 'text'"
                type="text"
                v-model="m_password"
                :placeholder="
                  LANGUAGE_DATA['请输入密码(6-12位数字+字母)'][LANGUAGE]
                "
                style="ime-mode: disabled; width: 500rpx"
              />
            </view>
            <text
              style="font-size: 36rpx"
              class="iconfont"
              v-if="passwordInputType == 'text'"
              @tap="handleTogglePasswordInputType"
              >&#xe60f;</text
            >
            <text
              style="font-size: 36rpx"
              class="iconfont"
              v-if="passwordInputType == 'password'"
              @tap="handleTogglePasswordInputType"
              >&#xe668;</text
            >
          </view>
        </view>
        <view class="item" v-else>
          <view class="">{{ LANGUAGE_DATA["验证码"][LANGUAGE] }}</view>
          <view class="item_left">
            <input
              class="code"
              type="number"
              :placeholder="LANGUAGE_DATA['请输入验证码'][LANGUAGE]"
              v-model="verifCode"
              placeholder-style="color='#BFBFBF'"
            />
            <button
              class="get-code-btn"
              type="default"
              :loading="verCodeBtnLoading"
              @tap="handleSendVerCode"
            >
              {{
                beginning
                  ? `${LANGUAGE_DATA["倒计时"][LANGUAGE]}` + time + "s"
                  : `${LANGUAGE_DATA["获取验证码"][LANGUAGE]}`
              }}
            </button>
          </view>
        </view>

        <view class="switchLogin">
          <text v-if="isacount" @click="changeCut">{{
            LANGUAGE_DATA["验证码登录"][LANGUAGE]
          }}</text>
          <text v-else @click="changeCut">{{
            LANGUAGE_DATA["密码登录"][LANGUAGE]
          }}</text>
        </view>
      </view>
      <view class="login_sub" @click="login_all">{{
        LANGUAGE_DATA["立即登录"][LANGUAGE]
      }}</view>
      <view class="other_oprice">
        <view
          class="forget_pawword"
          v-if="isGrounding == 1"
          @tap="handleJump"
          data-url="/pagecenter/pages/login/register/index"
          >{{ LANGUAGE_DATA["注册账号"][LANGUAGE] }}</view
        >
        <view class="tips" v-if="isGrounding == 1"></view>
        <view
          class="forget_pawword"
          @tap="handleJump"
          data-url="/pagecenter/pages/login/forget_password/index"
        >
          {{ LANGUAGE_DATA["忘记密码"][LANGUAGE] }}
        </view>
      </view>
    </view>

    <view class="" v-if="isGrounding == 1">
      <view class="quick">
        <view class="quick-title">
          <text class="line"></text>
          <text class="txt">{{ LANGUAGE_DATA["快捷登录"][LANGUAGE] }}</text>
          <text class="line"></text>
        </view>
        <view class="sanfang">
          <image
            @click="wxLogin"
            src="/pagecenter/static/img/wxFirst.png"
            mode=""
          ></image>
        </view>
      </view>
    </view>
    <view class="pt-images-verification" v-if="identifCode">
      <pt-Images-Verification
        :left="codeObj.left"
        :bgImg="codeObj.bgImg"
        :maskImg="codeObj.maskImg"
        @refresh="refresh"
        @dragEnd="dragEnd"
        @success="success"
      ></pt-Images-Verification>
      <view class="pt-close" @click="handleClose">X</view>
    </view>

    <!-- 协议 start -->
    <view class="agreen">
      <view class="agreen-style" @click="changeTick">
        <image
          src="/pagecenter/static/img/check_xy.png"
          mode=""
          class="chose-img"
          v-if="checked"
        ></image>
        <image
          src="/pagecenter/static/img/checkNo.png"
          mode=""
          class="chose-img"
          v-else
        ></image>
        <text>已阅读并同意</text>
      </view>
      <text
        class="agrees"
        @tap="handleJump"
        data-url="/pagecenter/pages/login/agreement/index?id=2"
        >《{{ LANGUAGE_DATA["用户注册协议"][LANGUAGE] }}》</text
      >
      <text>{{ LANGUAGE_DATA["与"][LANGUAGE] }}</text>
      <text
        class="agrees"
        @tap="handleJump"
        data-url="/pagecenter/pages/login/agreement/index?id=5"
        >《{{ LANGUAGE_DATA["隐私协议"][LANGUAGE] }}》</text
      >
    </view>

    <!-- 协议 end -->
  </view>
</template>

<script>
import { validate } from "@/common/utils/index";
import { BASE_URL } from "@/common/config.js";
import ptImagesVerification from "../../../../components/pt-images-verification/pt-images-verification.vue";
export default {
  components: {
    ptImagesVerification,
  },
  data() {
    return {
      m_phone: "12341234123", // 手机账号
      m_password: "qwer1234", // 密码
      passwordInputType: "password", // 切换是否加密密码
      verifCode: "", // 验证码
      verCodeBtnLoading: false, // 获取验证码按钮动画
      beginning: false,
      time: 60,
      checked: false,
      loginData: "", // 用户信息
      isacount: true, // 是否是账号登录

      isGrounding: 0, // 0 隐藏  =1 展示
      version: "",
      identifCode: false,
      codeObj: {
        bgImg: "",
        maskImg: "",
        left: 0,
        rand: null,
        confirm_code: null,
      },
    };
  },
  onLoad() {
    let that = this;
    this.getIsShelf();
  },
  methods: {
    // 切换密码输入框类型
    handleTogglePasswordInputType() {
      this.passwordInputType =
        this.passwordInputType == "password" ? "text" : "password";
    },

    /**
     * 获取是否上架状态
     */
    getIsShelf() {
      let that = this;
      let appSystem = uni.getSystemInfoSync().platform == "android" ? 2 : 1;
      console.log("106----", appSystem);
      // return;
      // this.version = global.VERSION_CODE
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, (inf) => {
        that.$api
          .post(global.apiUrls.isShelf, {
            version_number: inf.version,
            edition: appSystem,
            type: 3,
          })
          .then((res) => {
            if (res.data.code == 1) {
              that.isGrounding = res.data.data.is_show;
            } else {
            }
          })
          .catch((err) => {});
      });
      // #endif
    },

    /**
     * 切换登录方式
     */
    changeCut() {
      this.isacount = !this.isacount;
      if (!this.isacount) {
        this.m_password = "";
      } else {
        this.verifCode = "";
      }
    },

    /**
     * 获取验证码
     */
    handleSendVerCode() {
      if (this.verCodeBtnLoading) return false;
      let { m_phone, isacount } = this;

      if (m_phone == "") return this.$message.info("请输入手机号");
      if (!validate(m_phone, "phone"))
        return this.$message.info("手机号格式不正确");

      // if(!isacount){
      //   if(verifCode == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入验证码'][this.LANGUAGE]}`);
      // }
      if (this.beginning) return false;
      this.identifCode = true;
      this.initCode();
    },
    getVerificationCode() {
      if (this.verCodeBtnLoading) return false;
      let { m_phone, isacount } = this;

      if (m_phone == "") return this.$message.info("请输入手机号");
      if (!validate(m_phone, "phone"))
        return this.$message.info("手机号格式不正确");

      // if(!isacount){
      //   if(verifCode == '') return this.$message.info(`${this.LANGUAGE_DATA['请输入验证码'][this.LANGUAGE]}`);
      // }
      if (this.beginning) return false;
      this.verCodeBtnLoading = true;
      this.$api
        .post(global.apiUrls.aliSend, {
          mobile: m_phone,
          type: 3,
          user_id: "",
          is_test: global.IS_DEV,
          rand: this.codeObj.rand,
          confirm_code: this.codeObj.confirm_code,
        })
        .then((res) => {
          this.verCodeBtnLoading = false;
          if (res.data.code == 1) {
            this.$message.info("验证码已发送,请注意查收");
            // 显示倒计时
            this.beginning = true;

            // 开始倒计时
            this.timer = setInterval(() => {
              let tempTime = this.time;
              if (tempTime == 0) {
                // 倒计时结束
                clearInterval(this.timer);
                this.beginning = false;
                this.time = 60;
                return;
              }
              this.time--;
            }, 1000);
          } else {
            this.$message.info(res.data.msg);
          }
        })
        .catch((err) => {
          this.verCodeBtnLoading = false;
        });
    },
    // 获取验证码
    initCode() {
      // getIdentifyingCode: '/v1/65ee78c49f67c',//获取登录图形验证码
      // postVerificationCode: '/v1/65ee79dd93075',//验证登录图形验证码
      this.$api.get(global.apiUrls.getIdentifyingCode, {}).then((res) => {
        console.log(res.data.data);
        if (res.data.code == 1 && res.data.data) {
          this.codeObj.bgImg = BASE_URL + res.data.data.bg;
          this.codeObj.maskImg = BASE_URL + res.data.data.icon;
          // this.codeObj.left = Number(res.data.data.left);
          this.codeObj.rand = res.data.data.rand;
        }
      });
      // let index = this.random(0, this.codeArray.length - 1)
      // this.codeObj = this.codeArray[index]
    },
    // 刷新验证码
    refresh() {
      this.initCode();
    },
    dragEnd(e) {
      this.$api
        .post(global.apiUrls.postVerificationCode, {
          left: Math.floor(e),
          rand: this.codeObj.rand,
        })
        .then((res) => {
          if (res.data.code == 1) {
            this.identifCode = false;
            this.codeObj.confirm_code = res.data.data.confirm_code;
            this.getVerificationCode();
            uni.showToast({
              icon: "none",
              title: "验证成功",
            });
          } else {
            uni.showToast({
              icon: "none",
              title: "验证失败，再来一次吧",
              duration: 1500,
            });
          }
        });
    },
    // 验证成功
    success() {
      uni.showToast({
        icon: "none",
        title: "验证成功",
      });
      this.identifCode = false;
      this.getVerificationCode();
    },
    handleClose() {
      this.identifCode = false;
    },
    /**
     * 三方登录
     */
    wxLogin() {
      // uni.navigateTo({
      //   url: '/pagecenter/pages/login/bindPhone/index'
      // })
      let _this = this;
      uni.login({
        provider: "weixin",
        success: function (loginRes) {
          uni.getUserInfo({
            provider: "weixin",
            success: function (infoRes) {
              console.log(infoRes.userInfo);
              // 显示加载状态
              uni.showLoading({
                title: "加载中...",
              });
              let { nickName, avatarUrl, gender } = infoRes.userInfo;
              // #ifdef APP-PLUS
              let clientId = plus.push.getClientInfo().clientid || "";
              console.log("clientId", clientId);
              //  @const {Number} appSystem - 判断设备类型 1：ios；2：安卓；
              let appSystem = uni.getSystemInfoSync().platform == "ios" ? 1 : 2;
              // #endif
              /**
               * @description 第三方登录请求接口
               */
              _this.$api
                .post(global.apiUrls.postUserSocialLogin, {
                  type: 1,
                  wx_unionid: infoRes.userInfo.unionId,
                  qq_unionid: "",
                  wb_unionid: "",
                  clientId: clientId || "",
                  appSystem: appSystem || "",
                  nickname: nickName,
                  avatar: avatarUrl,
                  gender: gender,
                })
                .then((res) => {
                  // 保存用户信息
                  global.tempUserLoginInfo = infoRes.userInfo;
                  // 关闭加载效果
                  uni.hideLoading();
                  if (res.data.code == 1) {
                    _this.$message.info(res.data.msg);

                    this.loginData = res.data.data.userinfo;
                    if (res.data.data.userinfo.approve_status == -1) {
                      // 已注册,未填写认证信息
                      uni.navigateTo({
                        url:
                          "/pagecenter/pages/login/auth/index?token=" +
                          res.data.data.userinfo.user_token,
                      });
                    } else if (res.data.data.userinfo.approve_status == 0) {
                      // 待审核
                      // this.$message.info(`${this.LANGUAGE_DATA['认证信息正在审核'][this.LANGUAGE]}`)
                      uni.navigateTo({
                        url: "/pagecenter/pages/login/auth_wait/index?type=1",
                      });
                    } else if (res.data.data.userinfo.approve_status == 2) {
                      // 审核未通过
                      // this.$message.info(`${this.LANGUAGE_DATA['认证信息审核未通过，请重新填写信息'][this.LANGUAGE]}`)
                      uni.navigateTo({
                        url:
                          "/pagecenter/pages/login/auth_wait/index?type=3" +
                          "&token=" +
                          that.loginData.user_token +
                          "&reason=" +
                          that.loginData.reason,
                      });
                    } else {
                      // 审核通过
                      // _this.$message.info(`${_this.LANGUAGE_DATA['登录成功'][_this.LANGUAGE]}`)
                      global.token = res.data.data.userinfo.user_token;
                      global.userInfo = res.data.data.userinfo;
                      uni.setStorageSync("USER_TOKEN", global.token);
                      uni.setStorageSync("USER_INFO", global.userInfo);
                      setTimeout(() => {
                        uni.switchTab({
                          url: "/pages/tab/tab01/index",
                        });
                      }, 300);
                      uni.$emit("loginSuccess");
                    }

                    // global.token = res.data.data.userinfo.user_token;
                    // global.userInfo = res.data.data.userinfo;
                    // uni.setStorageSync('USER_TOKEN', global.token)
                    // uni.setStorageSync('USER_INFO', global.userInfo)
                    // uni.$emit('loginSuccess')

                    // setTimeout(() => {
                    //   uni.switchTab({
                    //     url:'/pages/tab/tab01/index'
                    //   })
                    // }, 800);
                  } else if (res.data.code == -999) {
                    _this.$message.info(res.data.msg);
                    uni.navigateTo({
                      url:
                        "/pagecenter/pages/login/bindPhone/index?un=" +
                        infoRes.userInfo.unionId +
                        "&open=" +
                        infoRes.userInfo.openId +
                        "&name=" +
                        infoRes.userInfo.nickName +
                        "&head=" +
                        infoRes.userInfo.avatarUrl,
                    });
                    // _this.$urouter.navigateTo({
                    //   url: _this.PAGE_BASE_URL + "bind-phone/index",
                    //   params: {
                    //     unionId: infoRes.userInfo.unionId,
                    //     openId: infoRes.userInfo.openId,
                    //     sex: infoRes.userInfo.gender,
                    //     nickName: infoRes.userInfo.nickName,
                    //     avatarUrl: infoRes.userInfo.avatarUrl,
                    //     authType: "wx_unionid",
                    //   },
                    // });
                    // 点击手机号账号登录按钮
                  } else if (res.code == -1) {
                    _this.$message.info(res.data.msg);
                    return;
                  }
                })
                .catch((err) => {
                  uni.hideLoading();
                  console.log(err);
                });
            },
          });
        },
        error: function (err) {
          uni.hideLoading();
          console.log(err);
        },
      });
    },

    /**
     * 登录
     */
    login_all() {
      let that = this;
      let { m_phone, m_password, isacount, verifCode } = this;
      if (m_phone == "")
        return this.$message.info(
          `${this.LANGUAGE_DATA["请输入手机号"][this.LANGUAGE]}`
        );
      if (!validate(m_phone, "phone"))
        return this.$message.info("手机号格式不正确");
      if (!this.checked)
        return this.$message.info("请同意并勾选《用户协议》和《隐私协议》");
      if (isacount) {
        console.log("密码登录");
        this.psdLogin();
      } else {
        console.log("验证码登录");
        this.codeLogin();
      }
    },

    /**
     * 密码登录
     */
    psdLogin() {
      let that = this;
      let { m_phone, m_password, isacount, verifCode } = this;

      let clientId = "66666666666",
        appSystem = "";

      //#ifdef APP-PLUS
      clientId = plus.push.getClientInfo().clientid;
      appSystem = uni.getSystemInfoSync().platform;
      //#endif

      // 检查密码是否为空
      if (m_password === "")
        return this.$message.info(
          `${this.LANGUAGE_DATA["请输入密码(6-12位数字+字母)"][this.LANGUAGE]}`
        );

      // 验证密码格式
      if (!validate(m_password, "password"))
        return this.$message.info(
          `${
            this.LANGUAGE_DATA["密码格式错误(6-12位数字及字母)"][this.LANGUAGE]
          }`
        );

      console.log(clientId);

      // 发送登录请求
      this.$api
        .post(global.apiUrls.psdLogin, {
          mobile: m_phone,
          password: m_password,
          client_id: clientId,
          app_system: appSystem,
        })
        .then((res) => {
          if (res.data.code == 1) {
            // TODO 后续修复
            // 现在直接跳过部分验证

            // 审核通过
            this.$message.info(
              `${this.LANGUAGE_DATA["登录成功"][this.LANGUAGE]}`
            );

            // 保存 token 和用户信息
            console.log("---userInfo：", res.data.data);
            global.token = res.data.data.userToken;
            global.userInfo = res.data.data;
            uni.setStorageSync("USER_TOKEN", global.token);
            uni.setStorageSync("USER_INFO", global.userInfo);

            // 跳转到首页
            setTimeout(() => {
              uni.switchTab({
                url: "/pages/tab/tab01/index",
              });
            }, 1000);

            uni.$emit("loginSuccess");
            // // 确保 userinfo 存在
            // if (res.data.data && res.data.data.userinfo) {
            //     this.loginData = res.data.data.userinfo;

            //     // 处理审核状态
            //     if (this.loginData.approve_status == -1) {
            //         // 已注册但未填写认证信息
            //         uni.navigateTo({
            //             url: '/pagecenter/pages/login/auth/index?token=' + this.loginData.user_token
            //         });
            //     } else if (this.loginData.approve_status == 0) {
            //         // 待审核
            //         uni.navigateTo({
            //             url: '/pagecenter/pages/login/auth_wait/index?type=1'
            //         });
            //     } else if (this.loginData.approve_status == 2) {
            //         // 审核未通过
            //         uni.navigateTo({
            //             url: '/pagecenter/pages/login/auth_wait/index?type=3&token=' + this.loginData.user_token + '&reason=' + this.loginData.reason
            //         });
            //     } else {
            //         // 审核通过
            //         this.$message.info(`${this.LANGUAGE_DATA['登录成功'][this.LANGUAGE]}`);

            //         // 保存 token 和用户信息
            //         global.token = this.loginData.user_token;
            //         global.userInfo = this.loginData;
            //         uni.setStorageSync('USER_TOKEN', global.token);
            //         uni.setStorageSync('USER_INFO', global.userInfo);

            //         // 跳转到首页
            //         setTimeout(() => {
            //             uni.switchTab({
            //                 url: '/pages/tab/tab01/index'
            //             });
            //         }, 1000);

            //         uni.$emit('loginSuccess');
            //     }
            // }
          } else {
            // 登录失败，显示错误消息
            this.$message.info(res.data.msg || "登录失败");
          }
        })
        .catch((err) => {
          // 处理错误并显示具体错误信息
          this.$message.error("登录失败");
          console.error("请求错误详细信息:", err); // 打印错误到控制台
          if (err.response) {
            // 请求已发出，但服务器响应了状态码不在 2xx 范围内
            console.error("服务器返回错误:", err.response);
          } else if (err.request) {
            // 请求已发出，但没有收到服务器的响应
            console.error("请求未收到响应:", err.request);
          } else {
            // 在设置请求时发生了一些问题
            console.error("请求设置出错:", err.message);
          }
        });
    },

    /**
     * 验证码登录
     */
    codeLogin() {
      let that = this;
      let { m_phone, m_password, isacount, verifCode } = this;

      let clientId = "66666666666",
        appSystem = "";

      //#ifdef APP-PLUS
      clientId = plus.push.getClientInfo().clientid;
      appSystem = uni.getSystemInfoSync().platform;
      // == 'ios' ? 1 : 2;
      //#endif

      if (verifCode == "")
        return this.$message.info(
          `${this.LANGUAGE_DATA["请输入验证码"][this.LANGUAGE]}`
        );

      this.$api
        .post(global.apiUrls.codeLogin, {
          mobile: m_phone,
          client_id: clientId,
          app_system: appSystem,
          code: verifCode,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            this.loginData = res.data.data.userinfo;
            if (res.data.data.userinfo.approve_status == -1) {
              // 已注册,未填写认证信息
              uni.navigateTo({
                url:
                  "/pagecenter/pages/login/auth/index?token=" +
                  res.data.data.userinfo.user_token,
              });
            } else if (res.data.data.userinfo.approve_status == 0) {
              // 待审核
              // this.$message.info(`${this.LANGUAGE_DATA['认证信息正在审核'][this.LANGUAGE]}`)
              uni.navigateTo({
                url: "/pagecenter/pages/login/auth_wait/index?type=1",
              });
            } else if (res.data.data.userinfo.approve_status == 2) {
              // 审核未通过
              // this.$message.info(`${this.LANGUAGE_DATA['认证信息审核未通过，请重新填写信息'][this.LANGUAGE]}`)
              uni.navigateTo({
                url:
                  "/pagecenter/pages/login/auth_wait/index?type=3" +
                  "&token=" +
                  that.loginData.user_token +
                  "&reason=" +
                  that.loginData.reason,
              });
            } else {
              // 审核通过
              this.$message.info(
                `${this.LANGUAGE_DATA["登录成功"][this.LANGUAGE]}`
              );
              global.token = res.data.data.userinfo.user_token;
              global.userInfo = res.data.data.userinfo;
              uni.setStorageSync("USER_TOKEN", global.token);
              uni.setStorageSync("USER_INFO", global.userInfo);
              setTimeout(() => {
                uni.switchTab({
                  url: "/pages/tab/tab01/index",
                });
              }, 1000);
              uni.$emit("loginSuccess");
            }
          } else {
            this.$message.info(res.data.msg);
          }
        })
        .catch((err) => {});
    },
    /**
     * @param 是否选择同意协议
     */
    /**
     * 切换协议
     */
    changeTick() {
      this.checked = !this.checked;
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";

.pt-images-verification {
  top: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(7, 7, 7, 0.3);
  height: 100%;
  width: 100%;
}

.pt-close {
  height: 80upx;
  width: 80upx;
  background-color: #fff;
  bottom: 60upx;
  font-size: 40upx;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: fixed;
  border-radius: 360upx;
}

/deep/.pt-dragbar {
  margin-top: 0;
}

.agreement {
  // position: fixed;
  // bottom: 116rpx;
  // bottom: calc(116rpx + constant(safe-area-inset-bottom));
  // bottom: calc(116rpx + env(safe-area-inset-bottom));
  // left: 0;
  width: 100%;
  margin-top: 94upx;

  .fu-action {
    color: #4177dd;
    line-height: 15px;
  }

  .image {
    height: 24rpx;
    width: 24rpx;
    margin-right: 12rpx;
  }
}
</style>
