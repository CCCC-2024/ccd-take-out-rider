<template>
	<view class="contents">
		<view class="bgImg"></view>
	   <!-- <image src="/static/img/indexBg.png" mode="" class="bgImg"></image> -->
	    <view class="prominPart">  
	      <view class="tab" v-if="tabOrder == 0">
	        <view class="tab_row" @click="tabClick(2)">
	          <view :class="tabId == 2 ? 'active' : ''" >{{LANGUAGE_DATA['待取货'][LANGUAGE]}}({{run_pick_num}})</view>
	          
	        </view>
	        <view class="tab_row" @click="tabClick(3)">
	          <view :class="tabId == 3 ? 'active' : ''" >{{LANGUAGE_DATA['进行中'][LANGUAGE]}}({{run_distrib_num}})</view>
	        </view>
	        <view class="tab_row" @click="tabClick(4)">
	          <view :class="tabId == 4 ? 'active' : ''" >{{LANGUAGE_DATA['已完成'][LANGUAGE]}}</view>
	        </view>
	      </view>
	      <view class="tab" v-if="tabOrder == 1">
	        <view class="tab_row" @click="tabClick(4)">
	          <view :class="tabId == 4 ? 'active' : ''" >{{LANGUAGE_DATA['待取货'][LANGUAGE]}}({{take_pick_num}})</view>
				   <view :class="tabId == 4 ? 'ac_line' : ''" id="line"></view>
	        </view>
	        <view class="tab_row" @click="tabClick(5)">
	          <view :class="tabId == 5 ? 'active' : ''" >{{LANGUAGE_DATA['配送中'][LANGUAGE]}}({{take_distrib_num}})</view>
	 <view :class="tabId == 5 ? 'ac_line' : ''" id="line"></view>
	        </view>
	        <view class="tab_row" @click="tabClick(6)">
	          <view :class="tabId == 6 ? 'active' : ''" >{{LANGUAGE_DATA['已完成'][LANGUAGE]}}</view>
	<view :class="tabId == 6 ? 'ac_line' : ''" id="line"></view>
	        </view>
	        <view class="tab_row" @click="tabClick(7)">
	          <view :class="tabId == 7 ? 'active' : ''" >售后</view>
				  <view :class="tabId == 7 ? 'ac_line' : ''" id="line"></view>
	        </view>
	      </view>
	      <view class="listBox">
	        <!-- 外卖 -->
	        <view class="list" v-for="(item,index) in listData" :key="index" v-if="tabOrder == 1">
	          <!-- <view class="list_row"> -->
	            <!-- <view class="lefts">
	              <text class="orderNum">{{LANGUAGE_DATA['订单'][LANGUAGE]}}{{item.order_sn}}</text>
	            </view> -->
	            <!-- <text class="orderCode" v-if="tabOrder == 1">#{{item.store_code}}</text> -->
	          <!-- </view> -->
	          <view class="list_row" v-if="(item.status == 7 || item.status == 5) && (item.is_once == 0 || item.is_once == 1)">
	            <view class="lefts">
									<text class="orderCode" style="margin-right: 15rpx;" v-if="tabOrder == 1">#{{item.store_code}}</text>
	              <text class="orderNum" v-if="item.is_once == 1">耗时：<text class="times">{{takeTime(item.take_time_rider,item)}}</text></text>
	              <text class="orderNum" v-if="item.is_once == 0">配送剩余：<text class="times">{{surplusTime(item.surplus_time)}}</text></text>
	            </view>
	          </view>
	          <view class="list_row rowBg">
	              <view class="gap flex_top">
	                <view class="" v-if="tabId != 6 && item.is_once != 1">
	                  <text>{{LANGUAGE_DATA['预计送达时间'][LANGUAGE]}}：</text>
	                  <text style="color: #FF4444;">{{item.forecast_time}}</text>
	                </view>
					  <view class="flex_top">
						  <view  v-if="tabId == 6">
						    <text>{{LANGUAGE_DATA['送达时间'][LANGUAGE]}}：</text>
						    <text style="color: #FD710F;font-size: 36rpx;font-weight: 700;">{{item.finish_time}}</text>
						  </view>
						  <view class="" v-if="item.is_once != 0">{{LANGUAGE_DATA['立即配送'][LANGUAGE]}}</view>
						  </view>
					  </view>
	          </view>
	          <view class="list_con lineStyle" @click="JumpParticul(item,1)">
	            <view class="con_part">
	              <view class="charact">
	                <image src="/static/img/take-img.png" mode="" class="icon_img"></image>
	                <view class="disRang">{{item.store_distance}}km</view>
	              </view>
	              <view class="part_right">
	                <view class="addr_dis">
	                  <text style="font-size: 38rpx; font-weight: 600;">{{item.store_info.name}}</text>
	                  <image src="/static/img/adres.png" mode="aspectFill" class="addr-img1" @click.stop ="look_local(item,'start')" v-if="tabId != 6"></image>
	                  <image src="/static/img/mobile.png" mode="aspectFill" class="addr-img2" @click.stop ="call(item.store_info.mobile)" v-if="tabId != 6"></image>
					  </view>
	                <view class="address-style">
	                  <view class="addr">{{item.store_info.address}}{{item.store_info.address_desc}}</view>
	
	                </view>
	              </view>
	            </view>
	            <view class="con_part two_part">
	              <view class="charact">
	                <image src="/static/img/locaEnd.png" mode="aspectFill" class="icon_img"></image>
	                <view class="disRang">{{item.send_distance}}km</view>
	              </view>
	              <view class="part_right">
	                <view class="addr_dis">
	                  <text>{{item.order_info.receiver_name}}({{item.order_info.receiver_mobile.substring(0, 3) +"****"+ item.order_info.receiver_mobile.substr(item.order_info.receiver_mobile.length-4)}})</text>
						<view class="flex-wrap" v-if="tabId != 6">
						  <image src="/static/img/adres.png" mode="aspectFill" class="addr-img1" @click.stop="look_local(item,'end')"></image>
						  <image src="/static/img/mobile.png" mode="aspectFill" class="addr-img2" @click.stop="call(item.order_info.receiver_mobile)"></image>
						</view>
	                </view>
	                <view class="address-style">
	                  <view class="addr" style="font-size: 32rpx;">{{item.order_info.province}}{{item.order_info.city}}{{item.order_info.district}}{{item.order_info.receiver_address}}</view>
	
	                </view>
	              </view>
	            </view>
	            <!-- <view class="punct">••••</view> -->
	          </view>
	          <view class="floor_btn"> 
	            <view class="seeDel" v-if="item.status == 6" @click="JumpParticul(item,2)">{{LANGUAGE_DATA['查看详情'][LANGUAGE]}}</view>
	            <view class="btns look" v-if="tabId == 4" @click="reass(item)" >{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}</view>
	            <view class="btns look" v-if="tabId == 5" @tap="handleJump" :data-url="`/pages/index/delayed/index?order=${item.order_sn}`">{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}</view>
	            <view class="btns rob" v-if="tabId == 4 && item.status == 7" @click="arriveShop(item.order_sn,tabOrder)">{{LANGUAGE_DATA['到达商家'][LANGUAGE]}}</view>
	            <view class="btns rob" v-if="item.status == 4" @click="pickup(item.order_sn,tabOrder)">{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}</view>
	            <view class="btns rob" v-if="item.status == 5" @click="ImmedService(item,tabOrder)">确认到店</view>
	            <!-- <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
	            <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view> -->
	          </view>
	        </view>
	        <view class="list" v-for="(item,index) in listData" :key="index" v-if="tabOrder == 0">
	          <view class="list_row lineStyle">
	            <view class="lefts">
	              <view class="" v-if="tabOrder == 0">
	                <image src="/static/img/take1.png" mode="" class="takeTip" v-if="item.type == 2"></image>
	                <image src="/static/img/take2.png" mode=""  class="takeTip" v-if="item.type == 3"></image>
	                <image src="/static/img/take3.png" mode=""  class="takeTip" v-if="item.type == 1"></image>
	              </view>
	              <text class="orderNum">{{LANGUAGE_DATA['订单'][LANGUAGE]}}{{item.order_sn}}</text>
	            </view>
	          </view>
	          <view class="list_row" v-if="(item.status == 2 || item.status == 3) && (item.is_once == 0 || item.is_once == 1)">
	            <view class="lefts">
	              <text class="orderNum" v-if="item.is_once == 1">耗时：<text class="times">{{takeTime(item.take_time_rider)}}</text></text>
	              <text class="orderNum " v-if="item.is_once == 0" >配送剩余：<text class="times">{{surplusTime(item.surplus_time)}}</text></text>
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
	                <image src="/static/img/take-img.png" mode="aspectFill" class="icon_img" v-if="item.type == 1 || item.type == 2"></image>
	                <image src="/static/img/locaStar.png" mode="" class="icon_img" v-if="item.type == 3"></image>
	
	                <view class="">{{item.start_address_info.distance}}km</view>
	              </view>
	              <view class="part_right" >
	                <view class="addr_dis">
	                  <text style="font-size: 42rpx; font-weight: 600;">{{item.start_address_info.name}}</text>
	                </view>
	                <view class="address-style">
	                  <view class="addr">{{item.start_address_info.province}}{{item.start_address_info.city}}{{item.start_address_info.district}}{{item.start_address_info.address}}</view>
	                  <view class="" v-if="tabId != 6">
	                    <image src="/static/img/adres.png" mode="" class="addr-img1" v-if="item.status !=4" @click.stop="look_local(item,'start')"></image>
	                    <image src="/static/img/mobile.png" mode="" class="addr-img2" v-if="item.status !=4" @click.stop="call(item.start_address_info.mobile)"></image>
	                  </view>
	                </view>
	              </view>
	            </view>
	            <view class="con_part two_part" v-if="item.mode != 2">
	              <view class="charact">
	                <!-- <image src="/static/img/take-img.png" mode="" class="icon_img" v-if="item.type == 1"></image> -->
	                <image src="/static/img/locaEnd.png" mode="" class="icon_img"></image>
	                <!-- <image src="/static/img/locaEnd.png" mode="" class="icon_img"  v-if="item.type == 1 || item.type == 2"></image> -->
	                <view class="">{{item.end_address_info.distance}}km</view>
	              </view>
	              <view class="part_right">
	                <view class="addr_dis">
	                  <text >{{item.end_address_info.name}}({{item.end_address_info.mobile.substring(0, 3) +"****"+ item.end_address_info.mobile.substr(item.end_address_info.mobile.length-4)}})</text>
	                
	                  <view class="flex_wrap" v-if="tabId != 6">
	                    <image src="/static/img/adres.png" mode="aspectFill" class="addr-img1" v-if="item.status !=4" @click.stop="look_local(item,'end')"></image>
	                    <image src="/static/img/mobile.png" mode="aspectFill" class="addr-img2" v-if="item.status !=4" @click.stop="call(item.end_address_info.mobile)"></image>
	                  </view>
					  </view>
	                <view class="address-style">
	                  <view class="addr" style="font-size: 32rpx;">{{item.end_address_info.province}}{{item.end_address_info.city}}{{item.end_address_info.district}}{{item.end_address_info.address}}</view>
	
	                </view>
	              </view>
	            </view>
	            <view class="con_part two_part" v-if="item.mode == 2">
	              <view class="charact"></view>
	              <view class="part_right">
	                <image :src="item.end_address" mode="aspectFill" class="photo"></image>
	              </view>
	            </view>
	            <!-- <view class="punct">••••</view> -->
	          </view>
	          <view class="floor_btn"> 
	            <view class="seeDel" v-if="item.status == 4" @click="JumpParticul(item,2)">{{LANGUAGE_DATA['查看详情'][LANGUAGE]}}</view>
	            <view class="btns look" v-if="item.status == 2" @click="reass(item)" >{{LANGUAGE_DATA['转派订单'][LANGUAGE]}}</view>
	            <!-- <view class="" v-if="item.status == 3"></view> -->
	            <view class="btns look" v-if="item.status == 3" @tap="handleJump" :data-url="`/pages/index/delayed/index`">{{LANGUAGE_DATA['申请延时'][LANGUAGE]}}</view>
	            <view class="btns rob" v-if="item.status == 2" @click="pickup(item.order_sn,tabOrder)">{{LANGUAGE_DATA['确认取货'][LANGUAGE]}}</view>
	            <view class="btns rob" v-if="item.status == 3" @click="ImmedService(item,tabOrder)">确认到店</view>
	            <!-- <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 0" @tap="handleJump" :data-url="`/pages/index/assessUser/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['评价用户'][LANGUAGE]}}</view>
	            <view class="btns rob" v-if="tabId == 6 && item.rider_evaluate == 1" @tap="handleJump" :data-url="`/pages/index/myEvaluate/index?orderSn=${item.order_sn}&type=${tabOrder}`">{{LANGUAGE_DATA['查看评价'][LANGUAGE]}}</view> -->
	          </view>
	        </view>
	        
	        <!-- <fu-empty v-if="listData.length == 0 && isInit"></fu-empty>
	        <uni-load-more v-if="listData.length >= 5" :status="status"></uni-load-more> -->
	      </view>
	      
	      <!-- <fu-empty
	        :paging-list-loaded-all="pagingListLoadedAll"
	        :paging-list-no-list-data="pagingListNoListData"
	        :list-data-length="listDataLength"
	      ></fu-empty> -->
	      
	      <view class="loading-wapper" v-if="!loadedAll && !noListData">
	        <view class="loading-icon"></view>
	        <text class="loading-txt">加载中</text>
	      </view>
	      <view class="loading-wapper" v-if="loadedAll && !noListData && listData.length != 0">
	        <text class="loading-txt">已加载全部数据~</text>
	      </view>
	      <view class="public-page-empty" v-if="listData.length==0">
	        <image src="/static/empty/empty111.png" style="width: 322upx; height: 280upx"></image>
	        <view class="txt">暂时没有任务，快去“新任务”抢一个</view>
	      </view>
	    </view>
	  </view>
	
</template>

<script>
</script>

<style>
</style>