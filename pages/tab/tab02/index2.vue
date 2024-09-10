<template>
	<view class="page-wrapper">
		<view class="order_title" style="background: #29B772;">
			<view class="status_bar"></view>
			<view class="title">
				<view class="title_left" @click="handleGetLocation">
					<u-icon name="map" color="#fff" size="48"></u-icon>
					<text style="font-weight: 600;margin-left: 20rpx;">{{city||'获取位置'}}</text>
				</view>
				<view class="title_right">
					<view class="messageBox" @tap="handleJump" :data-url="`/pagecenter/pages/my/messagelist/index`">
						<image src="/static/img/messageIcon.png" mode="" class="messageImg"></image>
						<u-badge type="error" :count="countBum" :is-dot="true" :absolute="true"
							:offset="site"></u-badge>
					</view>
				</view>
			</view>
			     <view class="tab orderTab">
        <view class="tab_row" @click="changes(1)">
          <view :class="tabOrder == 1 ? 'active' : ''" >{{LANGUAGE_DATA['外卖订单'][LANGUAGE]}}</view>
          <image src="/static/img/lineImg.png" mode="" class="line" v-if="tabOrder == 1"></image>
        </view>
        <view class="tab_row " @click="changes(0)">
          <view :class="tabOrder == 0 ? 'active' : ''" >{{LANGUAGE_DATA['跑腿订单'][LANGUAGE]}}</view>
          <image src="/static/img/lineImg.png" mode="" class="line" v-if="tabOrder == 0"></image>
        </view>
      </view>
		</view>
		<view class="contents">
			<view class="bgImg"></view>
			<view class="prominPart">
				<view class="body-view">
					<!-- 使用scroll-view实现tabs滑动切换 -->
					<scroll-view class="top-menu-view" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
						<view class="tab" v-if="tabOrder == 0">
							<view class="tab_row" @click="tabClick(2)">
								<view :class="tabId == 2 ? 'active' : ''">
									{{LANGUAGE_DATA['待取货'][LANGUAGE]}}({{run_pick_num}})
								</view>

							</view>
							<view class="tab_row" @click="tabClick(3)">
								<view :class="tabId == 3 ? 'active' : ''">
									{{LANGUAGE_DATA['进行中'][LANGUAGE]}}({{run_distrib_num}})
								</view>
							</view>
							<view class="tab_row" @click="tabClick(4)">
								<view :class="tabId == 4 ? 'active' : ''">{{LANGUAGE_DATA['已完成'][LANGUAGE]}}</view>
							</view>
						</view>
						<view class="tab" v-if="tabOrder == 1">
							<view class="tab_row" @click="tabClick(4)">
								<view :class="tabId == 4 ? 'active' : ''">
									{{LANGUAGE_DATA['待取货'][LANGUAGE]}}({{take_pick_num}})
								</view>
								<view :class="tabId == 4 ? 'ac_line' : ''" id="line"></view>
							</view>
							<view class="tab_row" @click="tabClick(5)">
								<view :class="tabId == 5 ? 'active' : ''">
									{{LANGUAGE_DATA['配送中'][LANGUAGE]}}({{take_distrib_num}})
								</view>
								<view :class="tabId == 5 ? 'ac_line' : ''" id="line"></view>
							</view>
							<view class="tab_row" @click="tabClick(6)">
								<view :class="tabId == 6 ? 'active' : ''">{{LANGUAGE_DATA['已完成'][LANGUAGE]}}</view>
								<view :class="tabId == 6 ? 'ac_line' : ''" id="line"></view>
							</view>
							<view class="tab_row" @click="tabClick(7)">
								<view :class="tabId == 7 ? 'active' : ''">售后</view>
								<view :class="tabId == 7 ? 'ac_line' : ''" id="line"></view>
							</view>
						</view>
					</scroll-view>
					<!-- 内容 -->
					<view class="swiper-item">
						<view class="listBox">
							<swiper class="swiper-box-list" :current="currentIndex" @change="swiperChange"
								:disable-touch="!allowLoadMore">
								<swiper-item class="swiper-item" v-for="item in swiperDateList" :key="item.id">
									<!-- 外卖  :refresher-triggered="triggered"-->
									<scroll-view class="top-menu-content" scroll-y="true" :refresher-enabled="freshing"
										:refresher-threshold="60" @refresherpulling="handleRefresherrefresh"
										@refresherrefresh="onRefresh" @refresherrestore="onRestore"
										:scroll-top="scrollTop">
										<view class="list" v-for="(item,index) in listData" :key="index"
											v-if="tabOrder == 1">
											<!-- <view class="list_row"> -->
											<!-- <view class="lefts">
								        <text class="orderNum">{{LANGUAGE_DATA['订单'][LANGUAGE]}}{{item.order_sn}}</text>
								      </view> -->
											<!-- <text class="orderCode" v-if="tabOrder == 1">#{{item.store_code}}</text> -->
											<!-- </view> -->
											<view class="list_row"
												v-if="(item.status == 7 || item.status == 5) && (item.is_once == 0 || item.is_once == 1)">
												<view class="lefts">
													<text class="orderCode" style="margin-right: 15rpx;"
														v-if="tabOrder == 1">#{{item.store_code}}</text>
													<text class="orderNum" v-if="item.is_once == 1">耗时：<text
															class="times">{{takeTime(item.take_time_rider,item)}}</text></text>
													<text class="orderNum" v-if="item.is_once == 0">配送剩余：<text
															class="times">{{surplusTime(item.surplus_time)}}</text></text>
												</view>
											</view>
											<view class="list_row rowBg">
												<view class="gap flex_top">
													<view class="" v-if="tabId != 6 && item.is_once != 1">
														<text>{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}}：</text>
														<text style="color: #FF4444;">{{item.forecast_time}}</text>
													</view>
													<view class="flex_top">
														<view v-if="tabId == 6">
															<text>{{LANGUAGE_DATA['送达时间'][LANGUAGE]}}：</text>
															<text
																style="color: #FD710F;font-size: 36rpx;font-weight: 700;">{{item.finish_time}}</text>
														</view>
														<view class="" v-if="item.is_once != 0">
															{{LANGUAGE_DATA['立即配送'][LANGUAGE]}}
														</view>
													</view>
												</view>
											</view>
											<view class="list_con lineStyle" @click="JumpParticul(item,1)">
												<view class="con_part">
													<view class="charact">
														<image src="/static/img/take-img.png" mode="" class="icon_img">
														</image>
														<view class="disRang">{{item.store_distance}}km</view>
													</view>
													<view class="part_right">
														<view class="addr_dis">
															<text
																style="font-size: 38rpx; font-weight: 600;">{{item.store_info.name}}</text>
															<image src="/static/img/adres.png" mode="aspectFill"
																class="addr-img1" @click.stop="look_local(item,'start')"
																v-if="tabId != 6"></image>
															<image src="/static/img/mobile.png" mode="aspectFill"
																class="addr-img2"
																@click.stop="call(item.store_info.mobile)"
																v-if="tabId != 6"></image>
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
															<text v-if="item.order_info">{{item.order_info.receiver_name}}({{item.order_info.receiver_mobile.substring(0, 3) +"****"+ item.order_info.receiver_mobile.substr(item.order_info.receiver_mobile.length-4)}})</text>
															<view class="flex-wrap" v-if="tabId != 6">
																<image src="/static/img/adres.png" mode="aspectFill"
																	class="addr-img1"
																	@click.stop="look_local(item,'end')">
																</image>
																<image src="/static/img/mobile.png" mode="aspectFill"
																	class="addr-img2"
																	@click.stop="call(item.order_info.receiver_mobile)">
																</image>
															</view>
														</view>
														<view class="address-style">
															<view class="addr" style="font-size: 32rpx;" v-if="item.order_info">
																{{item.order_info.province}}{{item.order_info.city}}{{item.order_info.district}}{{item.order_info.receiver_address}}
															</view>

														</view>
													</view>

												</view>
												<view class="remark">备注：<span style="color:#FD710F" v-if="item.remark">{{item.remark}}</span></view>
                        	<view class="remark">订单类别：<span style="color:#FD710F" v-if="item.type_name">{{item.type_name}}</span></view>
												<!-- <view class="punct">••••</view> -->
											</view>
											<view class="floor_btn">
												<view class="seeDel" v-if="item.status == 6"
													@click="JumpParticul(item,2)">
													{{LANGUAGE_DATA['查看详情'][LANGUAGE]}}
												</view>
												<view class="btns look" v-if="tabId == 4" @click="reass(item)">
													{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}
												</view>
												<view class="btns look" v-if="tabId == 5" @tap="handleJump"
													:data-url="`/pages/index/delayed/index?order=${item.order_sn}`">
													{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="tabId == 4 && item.status == 7"
													@click="arriveShop(item.order_sn,tabOrder,index)">
													{{LANGUAGE_DATA['到达商家'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 4"
													@click="pickup(item.order_sn,tabOrder)">
													{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 5"
													@click="ImmedService(item,tabOrder)">确认到店</view>
												<!-- <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
								      <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view> -->
											</view>
										</view>
										<view class="list" v-for="(item,index) in listData" :key="index"
											v-if="tabOrder == 0">
											<view class="list_row lineStyle">
												<view class="lefts">
													<view class="" v-if="tabOrder == 0">
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
											</view>
											<view class="list_row"
												v-if="(item.status == 2 || item.status == 3) && (item.is_once == 0 || item.is_once == 1)">
												<view class="lefts">
													<text class="orderNum" v-if="item.is_once == 1">耗时：<text
															class="times">{{takeTime(item.take_time_rider)}}</text></text>
													<text class="orderNum " v-if="item.is_once == 0">配送剩余：<text
															class="times">{{surplusTime(item.surplus_time)}}</text></text>
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
											<view class="list_con lineStyle" @click="JumpParticul(item,1)">
												<view class="con_part" v-if="item.is_nearby == 0">
													<view class="charact">
														<!-- <image src="/static/img/locaEnd.png" mode="" class="icon_img" v-if="item.type == 1"></image> -->
														<image src="/static/img/take-img.png" mode="aspectFill"
															class="icon_img" v-if="item.type == 1 || item.type == 2">
														</image>
														<image src="/static/img/locaStar.png" mode="" class="icon_img"
															v-if="item.type == 3"></image>

														<view class="">{{item.start_address_info.distance}}km</view>
													</view>
													<view class="part_right">
														<view class="addr_dis">
															<text
																style="font-size: 42rpx; font-weight: 600;">{{item.start_address_info.name}}</text>
														</view>
														<view class="address-style">
															<view class="addr">
																{{item.start_address_info.province}}{{item.start_address_info.city}}{{item.start_address_info.district}}{{item.start_address_info.address}}
															</view>
															<view class="" v-if="tabId != 6">
																<image src="/static/img/adres.png" mode=""
																	class="addr-img1" v-if="item.status !=4"
																	@click.stop="look_local(item,'start')"></image>
																<image src="/static/img/mobile.png" mode=""
																	class="addr-img2" v-if="item.status !=4"
																	@click.stop="call(item.start_address_info.mobile)">
																</image>
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
																<image src="/static/img/adres.png" mode="aspectFill"
																	class="addr-img1" v-if="item.status !=4"
																	@click.stop="look_local(item,'end')"></image>
																<image src="/static/img/mobile.png" mode="aspectFill"
																	class="addr-img2" v-if="item.status !=4"
																	@click.stop="call(item.end_address_info.mobile)">
																</image>
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
												<!-- <view class="punct">••••</view> -->
											</view>
											<view class="floor_btn">
												<view class="seeDel" v-if="item.status == 4"
													@click="JumpParticul(item,2)">
													{{LANGUAGE_DATA['查看详情'][LANGUAGE]}}
												</view>
												<view class="btns look" v-if="item.status == 2" @click="reass(item)">
													{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}
												</view>
												<!-- <view class="" v-if="item.status == 3"></view> -->
												<view class="btns look" v-if="item.status == 3" @tap="handleJump"
													:data-url="`/pages/index/delayed/index`">
													{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 2"
													@click="pickup(item.order_sn,tabOrder)">
													{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}
												</view>
												<view class="btns rob" v-if="item.status == 3"
													@click="ImmedService(item,tabOrder)">确认到店</view>
												<!-- <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
								      <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view> -->
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
									</scroll-view>
									<!-- <fu-empty v-if="listData.length == 0 && isInit"></fu-empty>
								  <uni-load-more v-if="listData.length >= 5" :status="status"></uni-load-more> -->
								</swiper-item>
							</swiper>

						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		validate,
		UploadImg
	} from '@/common/utils/index';
	import {
		nextTick
	} from "vue";
	// import pagingList from '@/common/minix/paging_list.js'
	export default {
		// mixins: [pagingList],
		data() {
			return {
				// minixPagingListsApi: global.apiUrls.foodsList,
				// allowOnloadGetList: false,
				city: global.userInfo ? global.userInfo.province + '-' + global.userInfo.city : '',
				tabId: 4, // 订单选择状态 4:待取货;5:配送;6:已完成
				search_key: '', // 搜索关键词
				pickNum: 0, // 待取货 (订单数量)
				distribNum: 0, // 配送中 (订单数量)
				finishNum: 0, // 已完成 (订单数量)
				// lng: '118.15589',
				// lat: '24.53076',
				lng: "113.6429744466146",
				lat:"34.73823567708333",// 经纬度
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
				backgroundColor: 'rgba(28, 181, 248, 0)',
				InterfaceApi: global.apiUrls.foodsList, // 接口
				listData: [], // 订单列表数据
				page: 1, // 分页
				allowLoadMore: true, // 允许加载更多
				loadedAll: false, // 已加载全部数据
				noListData: false, // 没有列表数据
				scrollLeft: 0,
				tabCurrent: 'tabNum1',
				currentIndex: 0,
				// Tab切换内容
				swiperDateList: [{
						id: 4,
						content: '待取货',
						num:null,
					},
					{
						id: 5,
						content: '配送中',
						num:null,
					},
					{
						id: 6,
						content: '已完成',
						num:null,
					},
					{
						id: 7,
						content: '售后',
						num:null,
					}
				],
				timeInterval: null,
				freshing: true,
				triggered: false,
				scrollTop: '100px',
			}
		},
		onPageScroll(e) {
			// 监听页面滚动距离
			this.backgroundColor = 'rgba(28, 181, 248,' + e.scrollTop / 300 + ')';
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
			// this.getlocat()
			this.getOrderNum()
			this.getTidings()
			// // #ifdef H5
			// this.allowOnloadGetList = true
			// this.pagingListToggle()
			// // #endif
			// console.log(this.tabId)
			var that = this;
			// if (this.timeInterval) {
			// 	clearInterval(this.timeInterval)
			// 	this.timeInterval = null;
			// }
			// if (this.tabId == 4) {
			// 	this.timeInterval = setInterval(function() {
			// 		that.allowLoadMore = true;
			// 		that.loadedAll = true;
			// 		that.noListData = false;
			// 		// that.page = 1;
			// 		that.getMsgData()
			// 	}, 4000);
			// }
			this.page = 1;
			this.allowLoadMore = true;
			this.loadedAll = false;
			this.noListData = false;
			this.listData = [];
			this.getMsgData()
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

		//上拉加载更多
		onReachBottom(e) {
			this.page += 1;
			this.getMsgData();
		},
		onHide() {
			if (this.timeInterval) {
				clearInterval(this.timeInterval);
				this.timeInterval = null;
			}
		},
		methods: {
			// pagingListPostData(){
			//   return { lng: this.lng, lat: this.lat, status: this.tabId, keyword: this.search_key }
			// },
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
								totalPage = res.data.last_page,
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
							this.allowLoadMore = true;this.loadedAll = true;
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

				if (h < 10) {
					h = '0' + h
				}
				if (m < 10) {
					m = '0' + m
				}
				if (s < 10) {
					s = '0' + s
				}
				return h + ":" + m + ":" + s;
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
					if (res.data.code == 1) {
						//待取货
						this.swiperDateList[0].num=res.data.data.taking_num;
						// 配送中
						this.swiperDateList[1].num=res.data.data.sending_num;
						// this.take_pick_num = res.data.data.taking_num
						// this.take_distrib_num = res.data.data.sending_num
						// this.run_pick_num = res.data.data.pt_taking_num
						// this.run_distrib_num = res.data.data.pt_sending_num
					} else {
						this.swiperDateList[0].num=0;
						// 配送中
						this.swiperDateList[1].num=0;
						// this.take_pick_num = 0
						// this.take_distrib_num = 0
						// this.run_pick_num = 0
						// this.run_distrib_num = 0
					}
				}).catch(err => {

				})
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

			// tab切换
			tabClick(e) {
				this.tabId = e;
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

			/**
			 * 切换跑腿和美食
			 */
			changes(type) {
				this.tabOrder = type
				if (this.tabOrder == 1) {
					this.InterfaceApi = global.apiUrls.foodsList
					this.tabId = 4
				} else {
					this.InterfaceApi = global.apiUrls.ReceList
					this.tabId = 2
				}
				// this.pagingListToggle()
				this.refreshOrder(true)
				this.getOrderNum()
			},
			handleGetLocation() {
				this.getlocat()
			},
			// 获取经纬度
			getlocat() {
				let that = this
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success: function(res) {
						that.lat = res.latitude;
						that.lng = res.longitude;
						// #ifdef APP-PLUS
						// that.allowOnloadGetList = true
						// that.pagingListToggle()
						// #endif
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
			call(mobile) {
				console.log(mobile)
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
			arriveShop(orderSn, type,index) {
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
                  that.listData[index].status=4;
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
							if (that.tabOrder == 1) {
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
							if (that.tabOrder == 1) {
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
			reass(item) {
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
							if (that.tabOrder == 1) {
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
				if (this.tabOrder == 0) {
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
			swiperChange(e) {
				console.log(e)
				//获取滑动页面index
				this.listData = [];
				let index = e.detail.current;
				this.currentIndex = index;
				let id = this.swiperDateList[index].id;
				this.swichMenu(id);
				this.tabId = id;
				this.refreshOrder(true)
				console.log(this.tabId + 'tabId')
				// this.pagingListToggle()
				this.getOrderNum()
			},
			handleRefresherrefresh() {
        console.log(1111)
				let that = this;
				this.triggered = true;
				this.listData = [];
				this.refreshOrder();
				setTimeout(() => {
					that.triggered = false;
					that.freshing = false;
					that.scrollTop = 60;
				}, 3000)
				this.$nextTick(function() {
					this.freshing = false;

				})
			},
			onRefresh() {
				this.$nextTick(function() {
					this.triggered = false;
					this.scrollTop = 0;
				})
			},
			onRestore() {
				this.triggered = 'restore';
				this.freshing = true;
				this.scrollTop = 0;
			}
		}
	}
</script>

<style lang="scss">
	@import './index2.scss';

	.body-view {
		width: 100%;
	}

	.swiper-box-list {
		width: 100%;
		height: 100%;
		// overflow: scroll;
	}

	// /deep/.uni-swiper-wrapper {
	// 	overflow: scroll;
	// }

	// /deep/swiper-item {
	// 	overflow: scroll;
	// }

	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	/deep/.uni-scroll-view::-webkit-scrollbar {
		display: none
	}

	.top-menu-content {
		height: 100%;
	}
	.remark{
		color:#666;
		font-size:24upx;
	}
</style>
