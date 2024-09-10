<!-- 滑动切换选项卡+吸顶演示(上一个tab数据不保留，滚动流畅) -->
<template>
	<view class="content">
		<z-paging ref="pagePaging" refresher-only @onRefresh="onRefresh" @scrolltolower="scrolltolower">
			<!-- 自定义下拉刷新view -->
			<template #refresher="{refresherStatus}">
				<custom-refresher :status="refresherStatus" />
			</template>
			<view>
				<!-- 小程序中直接修改组件style为position: sticky;无效，需要在组件外层套一层view -->
				<view style="z-index: 9999;position: sticky;top :0;">
					<scroll-view class="top-menu-view" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
						<view class="banner-view" style="height: 180rpx;">
							<view class="headerBg">
								<view class="title">
									<view class="title_left" @click.stop="handleLocation">
										<u-icon name="map" color="#fff" size="48"></u-icon>
										<text style="font-weight: 600;margin-left: 20rpx;">{{city||'获取位置'}}</text>
									</view>
									<view class="title_right">
										<view class="messageBox" @tap="handleJump"
											:data-url="`/pagecenter/pages/my/messagelist/index`">
											<image src="/static/img/messageIcon.png" mode="" class="messageImg"></image>
											<u-badge type="error" :count="countBum" :is-dot="true" :absolute="true"
												:offset="site"></u-badge>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="locationOpen" v-if="isLocation">
							<image class="upward" src="../../../static/img/upward.png"></image>
							开启定位权限，获取当前位置
							<button class="is-open" @click="handleLocation">
								开启
							</button>
							<span @click="handleLocationClose">X</span>
						</view>
						<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
						<z-tabs ref="tabs" style="z-index: 9999;position: sticky;top :0;" :current="currentIndex"
							:list="swiperDateList" @change="tabClick" />
					</scroll-view>
				</view>
				<!-- 			<swiper class="swiper" :style="[{height:swiperHeight+'px'}]" :current="current" @transition="swiperTransition" @animationfinish="swiperAnimationfinish">
					<swiper-item class="swiper-item" v-for="(item, index) in swiperDateList" :key="index">


					</swiper-item>
				</swiper> -->
				<!-- 内容 -->
				<view class="swiper-item">
					<view class="listBox" ref="swiperList">
						<swiper class="swiper-box-list" :current="currentIndex" @change="swiperChange"
							@transition="swiperTransition" @animationfinish="swiperAnimationfinish"
							:disable-touch="!allowLoadMore">
							<swiper-item class="swiper-item" v-for="(itemp,indexp) in swiperDateList" :key="itemp.id">
								<!-- 外卖  :refresher-triggered="triggered"-->
								<scroll-view class="top-menu-content" scroll-y="true" :refresher-enabled="freshing"
									:scroll-top="scrollTop" @scroll="handleScroll">
									<view v-for="(item,index) in listData" :key="index">
										<view class="list" v-if="item.is_waimai==1">
											<!-- <view class="list_row"> -->
											<!-- <view class="lefts">
							        <text class="orderNum">{{LANGUAGE_DATA['订单'][LANGUAGE]}}{{item.order_sn}}</text>
							      </view> -->
											<!-- <text class="orderCode" v-if="tabOrder == 1">#{{item.store_code}}</text> -->
											<!-- </view> -->
											<!-- 	v-if="(item.status == 7 || item.status == 5) && (item.is_once == 0 || item.is_once == 1)" -->
											<view class="list_row">
												<view class="lefts">
													<text class="orderCode"
														style="margin-right: 15rpx;">#{{item.store_code}}</text>
													<text class="orderNum"
														v-if="item.is_once == 1&&(tabId == 4||tabId == 5)">剩余时间：<text
															style=" color: #EB1512"
															v-if="item.forecast_times">{{timeFormat(item.forecast_times,item)}}</text></text>
												</view>
											</view>
											<view class="list_row rowBg">
												<view class="gap flex_top">
													<view class="delivery">
														<view v-if="tabId == 4||tabId == 5">
															<text>{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}}：</text>
															<text style="color: #FF4444;">{{item.forecast_time}}</text>
														</view>
														<view>
															<view v-if="tabId == 6">
																<text>{{LANGUAGE_DATA['送达时间'][LANGUAGE]}}：</text>
																<text
																	style="color: #FF4444;">{{item.finish_time}}</text>
															</view>
														</view>
														<view>
															<text>{{LANGUAGE_DATA['收入'][LANGUAGE]}}</text>
															<text class="money">￥{{item.rider_profits}}</text>
														</view>
													</view>
													<view class="flex_top">
														<!-- <view v-if="tabId == 6">
                            <text>{{LANGUAGE_DATA['送达时间'][LANGUAGE]}}：</text>
                            <text style="color: #FD710F;font-size: 36rpx;font-weight: 700;">{{item.finish_time}}</text>
                          </view> -->
														<view class="delivery">
															<view v-if="item.is_once != 0">
																{{LANGUAGE_DATA['立即配送'][LANGUAGE]}}
															</view>
															<view class="deliveryTime" v-if="tabId != 6&&tabId != 7">

																<text class="orderNum"
																	v-if="item.is_once == 0">配送剩余：<text class="times"
																		style=" color: #EB1512"
																		v-if="item.surplus_time">{{surplusTime(item.surplus_time)}}</text></text>
															</view>
														</view>
													</view>
												</view>
											</view>
											<view class="list_con lineStyle" @click.stop="JumpParticul(item,1)">
												<view class="con_part">
													<view class="charact">
														<image src="/static/img/take-img.png" mode="" class="icon_img">
														</image>
														<view class="disRang">{{item.store_distance}}km</view>
													</view>
													<view class="part_right">
														<view class="addr_dis">
															<view :class="tabId == 6?'width500':'width400'">
																<text
																	style="font-size: 38rpx; font-weight: 600;">{{item.store_info.name}}</text>
															</view>
															<view @click.stop="look_local(item,'start')"
																v-if="tabId != 6">
																<image src="/static/img/adres.png" mode="aspectFill"
																	class="addr-img1">
																</image>
															</view>
															<view @click.stop="handleCall(item.store_info.mobile)"
																v-if="tabId != 6">
																<image src="/static/img/mobile.png" mode="aspectFill"
																	class="addr-img2">
																</image>
															</view>
														</view>
														<view class="address-style">
															<view class="addr">
																{{item.store_info.address}}{{item.store_info.address_desc}}
															</view>

														</view>
													</view>
												</view>
												<view class="con_part two_part">
													<view class="charact">
														<image src="/static/img/locaEnd.png" mode="aspectFill"
															class="icon_img"></image>
														<view class="disRang">{{item.send_distance}}km</view>
													</view>
													<view class="part_right">
														<view class="addr_dis">
															<view :class="tabId == 6?'width500':'width400'"
																v-if="item.order_info">
																<text>{{item.order_info.receiver_name}}({{item.order_info.receiver_mobile.substring(0, 3) +"****"+ item.order_info.receiver_mobile.substr(item.order_info.receiver_mobile.length-4)}})</text>
															</view>
															<view class="dis-flex" v-if="tabId != 6">
																<view @click.stop="look_local(item,'end')">
																	<image src="/static/img/adres.png" mode="aspectFill"
																		class="addr-img1">
																	</image>
																</view>
																<view
																	@click.stop="handleCall(item.order_info.receiver_mobile)">
																	<image src="/static/img/mobile.png"
																		mode="aspectFill" class="addr-img2"></image>
																</view>
															</view>
														</view>
														<view class="address-style">
															<view class="addr" style="font-size: 32rpx;"
																v-if="item.order_info">
																{{item.order_info.province}}{{item.order_info.city}}{{item.order_info.district}}{{item.order_info.receiver_address}}
															</view>

														</view>
													</view>

												</view>
												<view class="remark">备注：<span style="color:#FD710F"
														v-if="item.remark">{{item.remark}}</span>
												</view>
												<view class="remark">订单类别：<span style="color:#FD710F"
														v-if="item.type_name">{{item.type_name}}</span></view>
												<!-- <view class="punct">••••</view> -->
											</view>
											<view class="floor_btn">
												<view class="seeDel" v-if="item.status == 6"
													@click.stop="JumpParticul(item,1)">
													{{LANGUAGE_DATA['查看详情'][LANGUAGE]}}
												</view>
												<view class="btns look" v-if="tabId == 4"
													@click.stop="reass(item,item.is_waimai)">
													{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}
												</view>
												<view class="btns look" v-if="tabId == 5" @click.stop="handleJump"
													:data-url="`/pages/index/delayed/index?order=${item.order_sn}`">
													{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="tabId == 4 && item.status == 7"
													@click.stop="arriveShop(item.order_sn,item.is_waimai,index)">
													{{LANGUAGE_DATA['到达商家'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 4"
													@click.stop="pickup(item.order_sn,item.is_waimai)">
													{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 5"
													@click.stop="ImmedService(item,item.is_waimai)">
													确认送达
												</view>
												<!-- <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
							      <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view> -->
											</view>
										</view>
										<view class="list" v-else>
											<!-- 	<view class="list_row lineStyle">
											<view class="lefts">
												<view class="">
													<image src="/static/img/take1.png" mode="" class="takeTip"
														v-if="item.type == 2"></image>
													<image src="/static/img/take2.png" mode="" class="takeTip"
														v-if="item.type == 3"></image>
													<image src="/static/img/take3.png" mode="" class="takeTip"
														v-if="item.type == 1"></image>
												</view>
												<text
													class="orderNum">{{LANGUAGE_DATA['订单'][LANGUAGE]}}{{item.order_sn}}</text>
											</view>
										</view> -->
											<!-- v-if="(item.status == 2 || item.status == 3) && (item.is_once == 0 || item.is_once == 1)" -->
											<view class="list_row">
												<view class="lefts">
													<text class="orderNum"
														v-if="item.is_once == 1&&(tabId == 4||tabId == 5)">剩余时间：<text
															style=" color: #EB1512">{{timeFormat(item.forecast_times,item)}}</text></text>
													<text class="orderNum" v-if="item.is_once == 0">配送剩余：<text
															class="times"
															style=" color: #EB1512">{{surplusTime(item.surplus_time)}}</text></text>
												</view>
											</view>
											<view class="list_row rowBg">
												<view class="bothSides">
													<view class="gap">
														<view class="flex_wrap" v-if="tabId != 6">
															<text>{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}}：</text>
															<text style="color: #FF4444;">{{item.forecast_time}}</text>
														</view>
														<view class="flex_wrap" v-if="tabId == 6">
															<text>{{LANGUAGE_DATA['送达时间'][LANGUAGE]}}：</text>
															<text style="color: #FF4444;">{{item.send_time}}</text>
														</view>
														<!-- <view class="" v-if="item.is_once != 0">{{item.pickup_time}}</view> -->
													</view>
													<!-- <view class="list_receipts">
							          <text v-if="item.status != 4">{{LANGUAGE_DATA['预计收入'][LANGUAGE]}}</text>
							          <text v-if="item.status == 4">{{LANGUAGE_DATA['本次收入'][LANGUAGE]}}</text>
							          <text style="font-size: 28rpx;color: #FF4444;font-weight: 600;">{{item.estimated_income}}</text>
							        </view> -->
												</view>
											</view>
											<view class="list_con lineStyle" @click.stop="JumpParticul(item,2)">
												<view class="con_part" v-if="item.is_nearby == 0">
													<view class="charact">
														<!-- <image src="/static/img/locaEnd.png" mode="" class="icon_img" v-if="item.type == 1"></image> -->
														<image src="/static/img/take-img.png" mode="aspectFill"
															class="icon_img" v-if="item.type == 1 || item.type == 2">
														</image>
														<image src="/static/img/locaStar.png" mode="" class="icon_img"
															v-if="item.type == 3">
														</image>

														<view class="" v-if="item.start_address_info">
															{{item.start_address_info.distance}}km
														</view>
													</view>
													<view class="part_right" v-if="item.start_address_info">
														<view class="addr_dis">
															<text
																style="font-size: 42rpx; font-weight: 600;">{{item.start_address_info.name}}</text>
														</view>
														<view class="address-style">
															<view class="addr">
																{{item.start_address_info.province}}{{item.start_address_info.city}}{{item.start_address_info.district}}{{item.start_address_info.address}}
															</view>
															<view class="" v-if="tabId != 6">
																<view @click.stop="look_local(item,'start')"
																	v-if="item.status !=4">
																	<image src="/static/img/adres.png" mode=""
																		class="addr-img1"></image>
																</view>
																<view
																	@click.stop="handleCall(item.start_address_info.mobile)"
																	v-if="item.status !=4">
																	<image src="/static/img/mobile.png" mode=""
																		class="addr-img2">

																	</image>
																</view>
															</view>
														</view>
													</view>
												</view>
												<view class="con_part two_part" v-if="item.mode != 2">
													<view class="charact">
														<!-- <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="item.type == 1"></image> -->
														<image src="/static/img/locaEnd.png" mode="" class="icon_img">
														</image>
														<!-- <image src="/static/img/locaEnd.png" mode="" class="icon_img"  v-if="item.type == 1 || item.type == 2"></image> -->
														<view class="">{{item.end_address_info.distance}}km</view>
													</view>
													<view class="part_right">
														<view class="addr_dis">
															<text>{{item.end_address_info.name}}({{item.end_address_info.mobile.substring(0, 3) +"****"+ item.end_address_info.mobile.substr(item.end_address_info.mobile.length-4)}})</text>

															<view class="flex_wrap" v-if="tabId != 6">
																<view @click.stop="look_local(item,'end')"
																	v-if="item.status !=4">
																	<image src="/static/img/adres.png" mode="aspectFill"
																		class="addr-img1"></image>
																</view>
																<view
																	@click.stop="handleCall(item.end_address_info.mobile)"
																	v-if="item.status !=4">
																	<image src="/static/img/mobile.png"
																		mode="aspectFill" class="addr-img2">
																	</image>
																</view>
															</view>
														</view>
														<view class="address-style">
															<view class="addr" style="font-size: 32rpx;">
																{{item.end_address_info.province}}{{item.end_address_info.city}}{{item.end_address_info.district}}{{item.end_address_info.address}}
															</view>
														</view>
													</view>

												</view>
												<view class="con_part two_part" v-if="item.mode == 2">
													<view class="charact"></view>
													<view class="part_right">
														<image :src="item.end_address" mode="aspectFill" class="photo">
														</image>
													</view>
												</view>
												<view class="remark" v-if="item.remark">备注：<span
														style="color:#FD710F">{{item.remark}}</span>
												</view>
												<view class="remark">订单类别：<span style="color:#FD710F"
														v-if="item.type_name">{{item.type_name}}</span></view>
												<!-- <view class="punct">••••</view> -->
											</view>
											<view class="floor_btn">
												<view class="seeDel" v-if="item.status == 4"
													@click.stop="JumpParticul(item,2)">
													{{LANGUAGE_DATA['查看详情'][LANGUAGE]}}
												</view>
												<view class="btns look" v-if="item.status == 2"
													@click.stop="reass(item,item.is_waimai)">
													{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}
												</view>
												<!-- <view class="" v-if="item.status == 3"></view> -->
												<view class="btns look" v-if="item.status == 3" @tap="handleJump"
													:data-url="`/pages/index/delayed/index`">
													{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 2"
													@click.stop="pickup(item.order_sn,item.is_waimai)">
													{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 3"
													@click.stop="ImmedService(item,item.is_waimai)">
													确认送达
												</view>
												<!-- <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
							      <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view> -->
											</view>
										</view>
									</view>
									<view class="loading-wapper" v-if="!loadedAll && !noListData">
										<view class="loading-icon"></view>
										<text class="loading-txt">加载中...</text>
									</view>
									<view class="loading-wapper"
										v-if="loadedAll && !noListData && listData.length != 0">
										<text class="loading-txt">已加载全部数据~</text>
									</view>
									<view class="public-page-empty" v-if="listData.length==0&&noListData">
										<image src="/static/empty/empty111.png" class="page-images"
											style="width: 322upx; height: 280upx">
										</image>
										<view class="txt">暂时没有任务，快去“新任务”抢一个</view>
									</view>
									<!-- <fu-empty v-if="listData.length == 0 && isInit"></fu-empty>
							  <uni-load-more v-if="listData.length >= 5" :status="status"></uni-load-more> -->
								</scroll-view>
							</swiper-item>
						</swiper>

					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		checkOpenGPSServiceByAndroid,
		androidPermision,
		iosPermision
	} from '@/common/function/device.js';
	import {
		getUpdateCoor
	} from '@/common/function/common.js';
	export default {
		data() {
			return {
				swiperHeight: 1000,
				swiperDateList: [{
						id: 4,
						name: '待取货',
						badge: {
							count: null
						}
					},
					{
						id: 5,
						name: '配送中',
						badge: {
							count: null
						}
					},
					{
						id: 6,
						name: '已完成',
						badge: {
							count: null
						}
					},
					{
						id: 7,
						name: '售后',
						badge: {
							count: null
						}
					}
				],
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				city: global.userInfo ? global.userInfo.province + '-' + global.userInfo.city : '',
				tabId: 4, // 订单选择状态 4:待取货;5:配送;6:已完成
				search_key: '', // 搜索关键词
				pickNum: 0, // 待取货 (订单数量)
				distribNum: 0, // 配送中 (订单数量)
				finishNum: 0, // 已完成 (订单数量)
				lng: '118.15589',
				lat: '24.53076',
				// lng: "113.6429744466146",
				// lat: "34.73823567708333", // 经纬度
				tabOrder: 1, // 0 跑腿订单 1 外卖订单
				show: false, // 取货码弹窗
				imgshow: false, // 外卖无接触配送
				orderSn: '', // 订单编号
				receivCode: '', // 收货码
				sendImg: '/static/img/uplodImg.png', // 送达图片
				countBum: 0, // 未读消息数量
				site: [15, 3], // 消息红点标识的位置
				take_pick_num: 0, // 外卖待取货订单数量
				take_distrib_num: 0, // 外卖待配送订单数量
				run_pick_num: 0, // 跑腿待取货订单数量
				run_distrib_num: 0, // 跑腿待配送订单数量
				InterfaceApi: global.apiUrls.foodsList, // 接口
				listData: [], // 订单列表数据
				page: 1, // 分页
				allowLoadMore: true, // 允许加载更多
				loadedAll: false, // 已加载全部数据
				noListData: false, // 没有列表数据
				scrollLeft: 40,
				tabCurrent: 'tabNum1',
				currentIndex: 0,
				timeInterval: null,
				freshing: false,
				triggered: false,
				scrollTop: 0,
				isLocation: false,
			}
		},
		computed: {
			memberData() {
				console.log(12121)
				console.log(this.$store.state.getData)
				return this.$store.state.getData;
			},
		},
		watch: {
			async memberData() {
				console.log(this.$store.state.getData)
				this.getOrderNum();
				await this.refreshOrder() //这是我监听数据变化调用接口更新页面数据
				this.$refs.uToast.show({
					title: '更新数据了',
					// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
					type: 'success',
					position: 'top ',
					// 如果不需要图标，请设置为false
					icon: true
				})
			}
		},
		onLoad() {
			let that = this;
			uni.$on('notice', res => {
				// that.pagingListToggle()
				that.refreshOrder(true)
				that.getOrderNum()
			})
			uni.$on('messagreNotice', res => {
				this.getTidings()
			})
		},
		onShow() {
			this.getOrderNum()
			this.getTidings()
			var that = this;
			if (uni.getSystemInfoSync().platform === 'android') {
				if (!uni.getStorageSync('isLocation')) {
					this.isLocation = true;
				} else {
					setTimeout(function() {
						androidPermision('android.permission.ACCESS_FINE_LOCATION').then(res => {
							console.log(22222, res)
							if (!res) {
								that.isLocation = true;
								return
							} else {
								if (res == 1) {
									that.getlocat();
								}
							}
						})
					}, 1000)
				}
			} else {
				//检测ios是否开启定位/
				iosPermision('location').then(res => {
					if (res) {
						that.getlocat()
					} else {
						that.isLocation = true;
					}
				})
			}
			this.page = 1;
			this.allowLoadMore = true;
			this.loadedAll = false;
			this.noListData = false;
			this.listData = [];
			this.getMsgData();
		},
		// 下拉刷新
		onPullDownRefresh() {
			uni.showLoading({})
			console.log(this.tabAc)
			this.page = 1;
			this.allowLoadMore = true;
			this.loadedAll = false;
			this.noListData = false;
			this.listData = [];
			uni.hideLoading({})
			this.getMsgData(() => {
				uni.stopPullDownRefresh()
			});
			this.getOrderNum()
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000)
		},

		// //上拉加载更多
		// onReachBottom(e) {
		// 	this.page += 1;
		// 	this.getMsgData();
		// },
		onHide() {
			console.log(this.ticker)
			if (this.timeInterval) {
				clearInterval(this.timeInterval);
				this.timeInterval = null;
			}
			if (this.ticker) {
				clearInterval(this.ticker)
				this.ticker = null;
			}
		},
		methods: {
			refreshOrder(value) {
				var that = this;
				this.page = 1;
				this.allowLoadMore = true;
				this.loadedAll = false;
				this.noListData = false;
				this.listData = [];
				uni.hideLoading({})
				this.getMsgData(() => {
					uni.stopPullDownRefresh()
				});
				this.getOrderNum()
				// if (this.timeInterval) {
				// 	clearInterval(this.timeInterval)
				// 	this.timeInterval = null;
				// }
				// if (this.tabId == 4) {
				// 	this.timeInterval = setInterval(function() {
				// 		that.allowLoadMore = true;
				// 		that.loadedAll = false;
				// 		that.noListData = false;
				// 		that.getMsgData()
				// 	}, 4000);
				// } else {
				// 	clearInterval(this.timeInterval)
				// 	this.timeInterval = null;
				// }
			},
			/**
			 * 获取数据列表
			 */
			getMsgData() {
				let url = '';
				if (!this.allowLoadMore || this.loadedAll || this.noListData) return;
				this.allowLoadMore = false;
				this.$api.post(this.InterfaceApi, {
					page: this.page,
					lng: this.lng,
					lat: this.lat,
					status: this.tabId,
					keyword: this.search_key
				}).then(res => {
					if (res.data.code == 1) {
						if (res.data.data.length > 0) {
							let tempLists = res.data.data,
								// totalPage = res.data.last_page,
								listData = this.listData;
							if (this.listData.length > 0) {
								for (var i = 0; i < this.listData.length; i++) {
									for (var j = 0; j < tempLists.length; j++) {
										if (this.listData[i].id != tempLists[j].id) {
											this.listData.push(...tempLists);
										}
									}
								}
							} else {
								this.listData.push(...tempLists);
							}
							this.beginTimer()
							this.allowLoadMore = true;
							this.loadedAll = true;
							if (this.page >= totalPage) this.loadedAll = true;
							if (this.page == 1 && this.listData.length == 0) this.noListData = true;
							this.page += 1;

						} else {
							this.noListData = true
						}
					} else {
						this.allowLoadMore = true;
					}
					if (fn) fn();
					uni.stopPullDownRefresh();
				}).catch(err => {
					this.allowLoadMore = true;
					uni.stopPullDownRefresh();
				})
			},
			// tab切换
			tabClick(index) {
				let id = this.swiperDateList[index].id;
				this.tabId = id;
				this.listData = [];
				this.refreshOrder(true)
				console.log(this.tabId + 'tabId')
				for (var i = 0; i < this.swiperDateList.length; i++) {
					if (this.tabId == this.swiperDateList[i].id) {
						this.currentIndex = i;
					}
				}
				// this.pagingListToggle()
				this.getOrderNum()
			},

			beginTimer() { //这个计时器是每秒减去数组中指定字段的时间
				let that = this
				let list = that.listData;
				this.ticker = setInterval(() => {
					// console.log(this.listData.length)
					that.listData.forEach((res, index) => {
						if (res.status == 0) {
							let dataTime = res.time
							if (res.time > 0) {
								res.time = dataTime;
							} else {
								if (that.listData.length == 0) {
									clearInterval(that.ticker)
									that.listData = []
									return
								}
							}
						} else {

						}
						this.listData.splice(index, 1, this.listData[index])
					})
					// that.listData=list
				}, 1000);
			},

			/**
			 * 耗时
			 */
			takeTime(time, item) {
				var self = this;
				let count = 0;
				let nowTime = 0
				// time : 下单时间
				var myDate = new Date();
				var timestamp = Date.parse(new Date());
				var vartimestamp = new Date().getTime()
				let surplus = (timestamp - (Number(time * 1000))) / 1000
				var hour = 0,
					minute = 0,
					second = 0;
				hour = parseInt(surplus / 60 / 60);
				minute = parseInt(surplus / 60 % 60);
				second = parseInt(surplus % 60);
				nowTime = self.toDouble(hour) + ":" + self.toDouble(minute) + ":" + self.toDouble(second);
				surplus++;
				// this.takeTime(time)
				// this.times = nowTime
				return nowTime;
			},
			timeFormat(timestamp) {
				var countDownInterval = timestamp * 1000; // 倒计时间隔（这里是一秒钟）
				var currentTime = new Date().getTime();
				// console.log(currentTime)
				var timeLeft = countDownInterval - currentTime;
				// console.log(timeLeft)
				let result = "";
				// 如果时间还未到达，则显示剩余时间
				if (timeLeft > 0) {
					var days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
					days = days < 10 ? '0' + days : days;
					var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					hours = hours < 10 ? '0' + hours : hours;
					var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
					minutes = minutes < 10 ? '0' + minutes : minutes;
					var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
					seconds = seconds < 10 ? '0' + seconds : seconds;
					result = hours + " ： " + minutes + " ： " + seconds;
				} else {
					if (timestamp) {
						let endTime = this.datatimestampToTime(timestamp);
						// console.log(endTime)
						let startTime = this.getDateYYYYMMddHHMMSS();
						// console.log(startTime)
						let minutesNum = this.minutesBetweenDates(startTime, endTime);
						// console.log(minutesNum)
						result = "已超时" + minutesNum
					}
				}
				return result;
			},
			minutesBetweenDates(date1, date2) {
				var start = Date.parse(new Date(date2));
				var end = Date.parse(new Date(date1));
				// 两个时间戳相差的毫秒数
				var time = end - start;
				// 计算相差的天数
				var day = Math.floor(time / (24 * 3600 * 1000));
				// 计算天数后剩余的毫秒数
				var msec = time % (24 * 3600 * 1000);
				// 计算出小时数
				var hour = Math.floor(msec / (3600 * 1000));
				// 计算小时数后剩余的毫秒数
				var msec2 = msec % (3600 * 1000);
				// 计算相差分钟数
				var minute = Math.floor(msec2 / (60 * 1000));

				var result = "";
				if (day > 0) {
					result = day + "天" + hour + "时" + minute + "分";
				} else if (hour > 0) {
					result = hour + "时" + minute + "分";
				} else if (minute > 0) {
					result = minute + "分";
				} else if (minute == 0) {
					result = "";
				}
				return result; // 向下取整到最接近的分钟数
			},
			/**
			 * 配送剩余时间
			 */
			surplusTime(ms) {
				let endTime = ms * 1000;
				let nowTime = new Date().getTime();
				let timeleft = endTime - nowTime;
				var h = parseInt(timeleft / (1000 * 60 * 60) % 24);
				var m = parseInt((timeleft / (1000 * 60)) % 60);
				var s = parseInt((timeleft / 1000) % 60);
				let result = ""
				if (m > 0) {
					if (h < 10) {
						h = '0' + h
					}
					if (m < 10) {
						m = '0' + m
					}
					if (s < 10) {
						s = '0' + s
					}
					result = h + ":" + m + ":" + s;
				} else {
					let startTime = this.getDateYYYYMMddHHMMSS();
					let minutesNum = this.minutesBetweenDates(startTime, endTime);
					result = "已超时" + minutesNum
				}

				return result;
			},

			toDouble(num) {
				if (num < 10) {
					return '0' + num;
				} else {
					return '' + num;
				}
			},

			/**
			 * 获取未读消息标识
			 */
			getTidings() {
				this.$api.post(global.apiUrls.informats).then(res => {
					if (res.data.code == 1) {
						this.countBum = res.data.data
					} else {

					}
				}).catch(err => {

				})
			},

			/**
			 * 获取订单数
			 */
			getOrderNum() {
				this.$api.post(global.apiUrls.orderNum).then(res => {
					console.log(res)
					if (res.data.code == 1) {
						//待取货
						this.swiperDateList[0].badge.count = Number(res.data.data.taking_num) + Number(res.data
							.data.run_pick_num);
						// 配送中
						this.swiperDateList[1].badge.count = Number(res.data.data.sending_num) + Number(res.data
							.data.pt_sending_num);
						// this.take_pick_num = res.data.data.taking_num
						// this.take_distrib_num = res.data.data.sending_num
						// this.run_pick_num = res.data.data.pt_taking_num
						// this.run_distrib_num = res.data.data.pt_sending_num
					} else {
						//待取货
						this.swiperDateList[0].badge.count = 0;
						// 配送中
						this.swiperDateList[1].badge.count = 0;
						// this.take_pick_num = 0
						// this.take_distrib_num = 0
						// this.run_pick_num = 0
						// this.run_distrib_num = 0
					}
				}).catch(err => {

				})
			},
			getDateYYYYMMddHHMMSS(format) {
				const date = new Date();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const strDate = date.getDate().toString().padStart(2, '0');
				const starHours = date.getHours().toString().padStart(2, '0');
				const starMinutes = date.getMinutes().toString().padStart(2, '0');
				const starSeconds = date.getSeconds().toString().padStart(2, '0');
				format = `${date.getFullYear()}-${month}-${strDate}
    ${starHours}:${starMinutes}:${starSeconds}`;
				// console.log(format)
				return format
			},
			datatimestampToTime(timestamp) {
				// 此处时间戳以毫秒为单位
				let date = new Date(parseInt(timestamp) * 1000);
				let Year = date.getFullYear();
				let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
				let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
				let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
				let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
				let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				let GMT = Year + '-' + Moth + '-' + Day + '   ' + Hour + ':' + Minute + ':' + Sechond;
				return GMT
			},
			timestampToTime(timestamp) {
				// 此处时间戳以毫秒为单位
				let date = new Date(parseInt(timestamp) * 1000);
				let Year = date.getFullYear();
				let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
				let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
				let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
				let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
				let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
				let GMT = Day + '   ' + Hour + ':' + Minute + ':' + Sechond;
				return GMT
			},
			/**
			 * 上传图片
			 */
			handleChooseImage() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					success: function(res) {
						console.log(res.tempFilePaths)
						const tempFilePaths = res.tempFilePaths;
						new UploadImg(tempFilePaths, {
							complete: function(res) {
								self.sendImg = res[0].path;
							}
						})
					}
				});
			},
			swichMenu(id) {
				this.tabId = id
				console.log(11, id)
				//this.tabCurrent = 'tabNum'+ id

				// 滑动swiper后，每个选项距离其父元素最左侧的距离
				this.scrollLeft = 0;
				for (let i = 0; i < id; i++) {
					this.scrollLeft += 60
					console.log(this.scrollLeft, 60, id)
				};
			},
			handleScroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},
			swiperChange(e) {
				console.log(e)
				// //获取滑动页面index
				this.listData = [];
				let index = e.detail.current;
				this.currentIndex = index;
				let id = this.swiperDateList[index].id;
				this.tabId = id;
				this.scrollTop = this.oldScrollTop;
				this.$nextTick(function() { //这里应该是箭头函数
					this.scrollTop = 0
				});
				this.refreshOrder(true)
				this.swichMenu(id);
				// console.log(this.tabId + 'tabId')
				// // this.pagingListToggle()
				this.getOrderNum()
			},
			/**
			 * 跳转到详情
			 */
			JumpParticul(item, type) {
				let url = ''
				if (this.tabOrder == 0) {
					url = '/pages/index/order-detail/index?orderSn=' + item.order_sn
				} else {
					url = '/pages/index/fooddetail/index?orderSn=' + item.order_sn
				}
				uni.navigateTo({
					url: url
				})
			},
			handleLocation() {
				this.getlocat();
				uni.$emit('getIntervalAddress');
			},
			handleLocationClose() {
				this.isLocation = false;
			},
			// 获取经纬度
			getlocat() {
				let that = this
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						that.lat = res.latitude;
						that.lng = res.longitude;
						that.$nextTick(function() {
							that.isLocation = false;
						})
						uni.setStorageSync('isLocation', true)
						getUpdateCoor(res.latitude, res.longitude)
						// #ifdef APP-PLUS
						// that.allowOnloadGetList = true
						// that.pagingListToggle()
						// #endif
					},
					fail: err => {
						checkOpenGPSServiceByAndroid()
						uni.setStorageSync('isLocation', false);
					}
				});
			},

			/**
			 * 跳转到搜索
			 */
			jumpSearch() {
				uni.navigateTo({
					url: '/pages/index/search/index'
				})
			},

			// 查看地址
			look_local(item, name) {
				console.log(item)
				let latitude = ''
				let longitude = ''
				let address = ''
				if (this.tabOrder == 0) {
					if (name == 'start') {
						latitude = item.start_address_info.lat
						longitude = item.start_address_info.lng
						address = item.start_address_info.address
					} else {
						latitude = item.end_address_info.lat
						longitude = item.end_address_info.lng
						address = item.end_address_info.address
					}
				} else {
					if (name == 'start') {
						latitude = item.store_info.lat
						longitude = item.store_info.lng
						address = item.store_info.address_desc
					} else {
						latitude = item.order_info.lat
						longitude = item.order_info.lng
						address = item.order_info.receiver_address
					}
				}

				uni.openLocation({
					latitude: Number(latitude),
					longitude: Number(longitude),
					address: address,
					success: function() {
						console.log('success');
					}
				});
			},

			// 关闭提醒弹窗
			close() {
				this.is_remind = false
			},

			// 拨打电话
			handleCall(mobile) {
				let _this = this
				if (mobile == '' || mobile == null) {
					_this.$message.info(`${this.LANGUAGE_DATA['暂无联系方式'][this.LANGUAGE]}`);
				} else {
					uni.makePhoneCall({
						phoneNumber: mobile
					});
				}
			},

			/**
			 * 到达商家
			 */
			arriveShop(orderSn, type, index) {
				let that = this
				uni.showModal({
					title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
					content: '是否到达商家?',
					cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
					confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
					confirmColor: '#1CB5FD',
					cancelColor: '#999999',
					success(res) {
						if (res.confirm) {
							that.$api.post(global.apiUrls.reachStore, {
								order_sn: orderSn
							}).then(res => {
								that.$message.info(res.data.msg)
								if (res.data.code == 1) {
									that.listData[index].status = 4;
									// that.pagingListToggle()
									// that.refreshOrder(true)
									// that.getOrderNum()
								} else {
									that.$message.info(res.data.msg)
								}
							}).catch(err => {

							})
						}
					}
				});
			},

			/**
			 * 取货
			 */
			pickup(orderSn, type) {
				let that = this
				uni.showModal({
					title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
					content: '是否确认已取货?',
					cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
					confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
					confirmColor: '#1CB5FD',
					cancelColor: '#999999',
					success(res) {
						if (res.confirm) {
							let url = ''
							if (type == 1) {
								// 外卖派单
								url = global.apiUrls.pickOrder
							} else {
								url = global.apiUrls.runPickOrder
							}
							that.$api.post(url, {
								order_sn: orderSn
							}).then(res => {
								that.$message.info(res.data.msg)
								if (res.data.code == 1) {
									// that.pagingListToggle()
									that.refreshOrder(true)
									that.getOrderNum()
								} else {

								}
							}).catch(err => {

							})
						}
					}
				});
			},

			/**
			 * 立即送达
			 */
			ImmedService(item, type) {
				let that = this
				uni.showModal({
					title: `${that.LANGUAGE_DATA['温馨提示'][that.LANGUAGE]}`,
					content: '是否确认已送达?',
					cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
					confirmText: `${that.LANGUAGE_DATA['确定'][that.LANGUAGE]}`,
					success(res) {
						if (res.confirm) {
							let url = ''
							if (type == 1) {
								// 外卖派单
								url = global.apiUrls.Service
							} else {
								url = global.apiUrls.runSever
							}
							that.$api.post(url, {
								order_sn: item.order_sn
							}).then(res => {
								if (res.data.code == 1) {
									// that.pagingListToggle()
									that.refreshOrder(true)
									that.getOrderNum()
								} else {
									that.$message.info(res.data.msg)
								}
							}).catch(err => {

							})
						}
					}
				});
			},

			/**
			 * 转派订单
			 */
			reass(item, type) {
				let that = this
				uni.showModal({
					title: `${that.LANGUAGE_DATA['提示'][that.LANGUAGE]}`,
					content: `${that.LANGUAGE_DATA['是否转单到抢单大厅，5分钟内无人接单，订单由您再次派送?'][that.LANGUAGE]}`,
					cancelText: `${that.LANGUAGE_DATA['取消'][that.LANGUAGE]}`,
					confirmText: `${that.LANGUAGE_DATA['确认转单'][that.LANGUAGE]}`,
					confirmColor: '#1CB5FD',
					cancelColor: '#999999',
					success(res) {
						if (res.confirm) {
							let url = ''
							if (type == 1) {
								// 外卖派单
								url = global.apiUrls.reassOrder1
							} else {
								url = global.apiUrls.reassOrder2
							}
							that.$api.post(url, {
								order_sn: item.order_sn,
							}).then(res => {
								that.$message.info(res.data.msg)
								if (res.data.code == 1) {
									// that.pagingListToggle()
									that.refreshOrder(true)
									that.getOrderNum()
								} else {

								}
							}).catch(err => {

							})
						}
					}
				});
			},

			/**
			 * 跳转到详情
			 */
			JumpParticul(item, type) {
				let url = ''
				if (type == 2) {
					url = '/pages/index/order-detail/index?orderSn=' + item.order_sn
				} else {
					url = '/pages/index/fooddetail/index?orderSn=' + item.order_sn
				}
				uni.navigateTo({
					url: url
				})
			},
			swichMenu(id) {
				this.tabId = id
				console.log(11, id)
				//this.tabCurrent = 'tabNum'+ id

				// 滑动swiper后，每个选项距离其父元素最左侧的距离
				this.scrollLeft = 0;
				for (let i = 0; i < id; i++) {
					this.scrollLeft += 60
					console.log(this.scrollLeft, 60, id)
				};
			},
			// tabs通知swiper切换
			tabChange(index) {
				this._setCurrent(index);
			},
			// 下拉刷新时，通知当前显示的列表进行reload操作
			onRefresh() {
				var that = this;
				this.refreshOrder(true)
				setTimeout(function() {
					that.$refs.pagePaging.endRefresh();
				}, 500);
			},
			// 当滚动到底部时，通知当前显示的列表加载更多
			scrolltolower() {
				console.log("到底了....")
				// this.$refs.swiperList[this.currentIndex].doLoadMore();
			},
			// swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			// swiper滑动结束
			swiperAnimationfinish(e) {
				// console.log()
				// // this._setCurrent(e.detail.current);
				// this.listData = [];
				// let index = e.detail.current;
				// this.currentIndex = index;
				// let id = this.swiperDateList[index].id;
				// this.tabId = id;
				// this.swichMenu(id);
				// this.refreshOrder(true)
				// // console.log(this.tabId + 'tabId')
				// // // this.pagingListToggle()
				// this.getOrderNum()
				this.$refs.tabs.unlockDx();
			},
			_setCurrent(current) {
				if (current !== this.currentIndex) {
					//切换tab时，将上一个tab的数据清空
					this.$refs.swiperList[this.currentIndex].clear();
				}
				this.currentIndex = current;
			}
		}
	}
</script>

<style lang="scss">
	@import './index.scss';
</style>