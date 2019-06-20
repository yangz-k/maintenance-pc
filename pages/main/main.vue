<template>
	<div id="homePage" class="homePage">
		<!--<el-row class="">
			<Title />
	    </el-row>-->
		<div id="topCount" class="homePageHead div-flex align_center bg-white" v-cloak>
			<div class="top-count div-flex align_center" @click="mainDrillDown('uncompletedFault')">
				<div class="wb-imgCon">
					<img src="../../assets/img/main/stay_down.png">
				</div>

				<div class="m-l10 div-flex align_center height_100 flex1">
					<div class="flex1 mt-5 height_100 div-flexColumn">
						<span class="fs26px font_w6">维修任务待下发</span>
						<p class="fs46px font_yahei" v-text="uncompletedFault">
							<!--{{uncompletedFault}}-->
						</p>
					</div>
				</div>
			</div>
			<div class="top-count div-flex align_center" @click="mainDrillDown('overdueUncompleted')">
				<div class="wb-imgCon">
					<img src="../../assets/img/main/incomplete.png">
				</div>
				<div class="m-l10 div-flex height_100 flex1 align_center">
					<div class="flex1 mt-5 height_100 div-flexColumn">
						<span class="fs26px font_w6">应急维保逾期未完成</span>
						<p class="fs46px font_yahei" v-text="overdueUncompleted">
							<!--{{overdueUncompleted}}-->
						</p>
					</div>
				</div>
			</div>
			<div class="top-count div-flex align_center" @click="mainDrillDown('uncompletedToday')">
				<div class="wb-imgCon">
					<img src="../../assets/img/main/daytobecompleted.png">
				</div>
				<div class="m-l10 div-flex  align_center height_100 flex1">
					<div class="flex1 mt-5 height_100 div-flexColumn">
						<span class="fs26px font_w6">应急维保今日待完成</span>
						<p class="fs46px font_yahei" v-text="uncompletedToday">
							<!--{{uncompletedToday}}-->
						</p>
					</div>
				</div>
			</div>
			<div class="top-count div-flex align_center none" @click="mainDrillDown('uncompletedMonth')">
				<div class="wb-imgCon">
					<img src="../../assets/img/main/monthtobecompleted.png">
				</div>
				<div class="m-l10 div-flex  align_center flex1 height_100">
					<div class="flex1 mt-5 height_100 div-flexColumn">
						<span class="fs26px font_w6">例行维保本月待完成</span>
						<p class="fs46px font_yahei" v-text="uncompletedMonth">
							<!--{{uncompletedMonth}}-->
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="homePageMainCon">
			<div class="homePageEmergency bg-white">
				<div class="homePageEmergency_top">
					<div class="div-flex align_center pd10px color_yingji yy-border-bottom homePageTitle homePageEmergency_topC">
						<div class="div-flex align_center flex1">
							<img class="widthImg_auto" src="../../assets/img/main/rili_yingji.png">
							<span class="ml-8 fs24px">应急维保</span>
						</div>
						<div class="div-flex align_center fs16px fw600 font_yahei_bold">
							今日需处理应急维保
							<span class="fw600 totle_num" id="totle_num">{{maintenanceOrderAllCount}}</span>单，已完成
							<span class="fw600 cur_color_yingji completed_num" id="completed_num">{{maintenanceOrderOverCount}}</span>单
						</div>
					</div>
					<div class="bg-white" style="margin:10px">
						<div class="bd_w jcalendar_week fs14px" id="jcalendar_week"></div>
					</div>
				</div>
				<div class="homePageEmergency_bottom fs16px" id="toJU_load" style="flex: 1 1 0%;overflow: auto;">
					<div class="not_datas " style="display: none; height: 100%;overflow: hidden;">
						<div class="div-flex align_center" style=" height: 100%;">
							<img style="max-width: 100%;width: 40%; margin:auto;" src="../../assets/img/main/no_data_img1.png" />
						</div>
					</div>
					<ul class="cbp_tmtimeline hava_datas" id="havas_datas"></ul>
					<!--<div class="pd15px bg-white">
							<div class="bd_w jcalendar_week" id="jcalendar_week"></div>
						</div>-->
				</div>
			</div>
			<div class="homePageMainRightCon">
				<div class="homePageMainRightTopCon">
					<div class="homePageRoutineCon bg-white">
						<div class="homePageEmergency_top">
							<div class="div-flex align_center pd10px color_yingji yy-border-bottom homePageTitle">
								<div class="div-flex align_center flex1 ju_center_start">
									<!--<b class="maintenance-maintainPlan"></b>-->
									<img class="widthImg_auto" src="../../assets/img/main/lv_weibao.png">
									<span class="ml-8 fs24px">例行维保</span>
								</div>
							</div>
						</div>
						<!--<div class="title"><b class="maintenance-maintainPlan"></b>&nbsp;例行维保</div>-->
						<div id="echarts-div" class="echarts-div div-flex align_center flex1">
							<canvas id="Mymaintenance" width="250" height="250"></canvas>
						</div>
						<div class="month-count font_yahei" id="month-count">
							<article class="month-center div-flex align_center flex1">
								<p id="totality" class="fs36px">0</p>
								<p class="now-result fs18px fw600">本月总数</p>
								<div class="line"></div>
							</article>
							<article class="month-center div-flex align_center flex1">
								<p id="Currentcompleted" class="fs36px">0</p>
								<p class="now-result fs18px fw600">本月待完成</p>
								<div class="line"></div>
							</article>
							<article class="div-flex align_center flex1">
								<p id="completed" class="fs36px">0</p>
								<p class="now-result fs18px fw600">本月已完成</p>
							</article>
						</div>
						<!--<div class="line bottomLine"></div>-->
					</div>
					<!--lipengfei start-->
					<div class="homePageServicefall bg-white" id="wb-homePageServicefall" v-cloak v-on:mouseenter="mouseenter($event)" v-on:mouseleave="mouseleave($event)">
						<div class="homePageEmergency_top homePageServicefallTitle">
							<div class="div-flex align_center pd10px color_yingji yy-border-bottom homePageTitle">
								<p class="div-flex align_center flex1 ju_center_start">
									<img class="widthImg_auto" src="../../assets/img/main/cup.png">
									<span class="ml-8 fs24px">近30天服务情况</span>
								</p>
								<p class="div-flex align_center rotineAndEmergency">
									<span class="routineSpan wb-selected selectedSpan fs18px" @click="selectedSpan($event,1,true)">例行维保</span>
									<span class="emergencySpan selectedSpan fs18px" @click="selectedSpan($event,0,true)">应急维保</span>
								</p>
							</div>
						</div>
						<div class="homePageServicefallMain">
							<div class="homePageServicefallMainTitle" style="padding-right: 4%; ">
								<p style="position:relative;text-align: right;cursor: pointer;margin-right:3%;margin-top:2%" @click="selectedSort($event,1,true)">
									<span class="wb-counts m-r5px fs20px">完成数量(单)</span>
									<img class="wb-countsTop" :src="isSelected ? imgUrlObj.upOrange : imgUrlObj.upGray" alt="" />
								</p>
								<p style="position:relative;text-align: right;cursor: pointer;margin-top:2%" @click="selectedSort($event,0,false)">
									<span v-if='routineOrEmergency' class="wb-area fs20px m-r5px">维保面积(m²)</span>
									<span v-else class="wb-area fs20px m-r5px">响应时间(分)</span>
									<img class="wb-countsTop" :src="isSelected ? imgUrlObj.upGray : imgUrlObj.upOrange" alt="" />
								</p>
							</div>
							<el-scrollbar class="homePageServicefallMainUlCon">
								<ul class="homePageServicefallMainUl">
									<!-- v-on:mouseenter="mouseenter($event)" v-on:mouseleave="mouseleave($event)"-->
									<li class="ServicefallMainUlList" v-for="(item,index) in ServicefallList" :key='index'>
										<span class='wb-num' :class="[index =='0'?'wb-no1':index == '1'?'wb-no2':index == '2'?'wb-no3':'']">{{index+1}}</span>
										<div style="display: inline-block;position: relative;" class="wb-portrait" :class="[index =='0'?'wb-champion':index == '1'?'wb-runnerUp':index == '2'?'wb-thirdPlace':'']">
											<img class="" :src="item.headPortrait ? imgUrl+item.headPortrait : imgUrlObj.weibao" alt="" />
										</div>
										<span class="wb-name fs18px" :title="item.name">{{item.name}}</span>
										<!---->
										<span class="wb-completeCounts fs18px">{{item.count}}</span>
										<span v-if='routineOrEmergency ' :title="item.buildArea" class="wb-maintenanecArea fs18px">{{item.buildArea}}</span>
										<span v-else class="wb-maintenanecArea fs18px" :title="item.avgTime">{{item.avgTime}}</span>
									</li>
									<li class="noMoreData fs16px" v-if='noMoreDate'>暂无更多数据~</li>
								</ul>

							</el-scrollbar>
						</div>
					</div>
					<!--lipengfei end-->
				</div>
				<div class="homePageMaintenanceTrend bg-white">
					<div class="homePageEmergency_top">
						<div class="div-flex align_center pd10px color_yingji yy-border-bottom homePageTitle">
							<div class="div-flex align_center flex1 ju_center_start">
								<img class="widthImg_auto" src="../../assets/img/main/ese.png">
								<span class="ml-8 fs24px">近30天维保趋势</span>
							</div>
						</div>
					</div>
					<div id="echarts-container" class="flex1"></div>

				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import weekfn from "~/plugins/rili_script";
	import api from "~/config/http";
	import axios from "axios";
	import Echart from "echarts"
	import Cookie from "js-cookie";
	import { Message } from "element-ui";
	import Title from "~/components/Title";
	export default {
		components: {
			Title
		},
		data() {
			return {
				imgUrlObj: {
					upOrange: require('@/assets/img/main/upOrange.png'),
					upGray: require('@/assets/img/main/upGray.png'),
					weibao: require('@/assets/img/main/weibao.png'),
					icon5: require('@/assets/img/main/icon5.png'),
					icon_build: require('@/assets/img/main/icon_build.png'),
					iocn3: require('@/assets/img/main/iocn3.png'),
					iocn2: require('@/assets/img/main/iocn2.png'),
					iocn1: require('@/assets/img/main/iocn1.png'),
					icon_person: require('@/assets/img/main/icon_person.png'),
					icon_time: require('@/assets/img/main/icon_time.png')
				},
				pageName: "首页",
				userInfo: api.getGlobalVal("maintenance_userObj"), //获取用户信息
				uncompletedFault: "--", //维修代下发数
				overdueUncompleted: "--", //逾期未完成
				uncompletedToday: "--", //今日待完成
				uncompletedMonth: "--", //本月待完成
				arc_num: 80, //饼图半径
				size_top: "40px",
				size_bottom: "20px",
				routineMaintenanceData: [],
				ServicefallList: [], //近30天服务情况列表
				routineOrEmergency: 1, //判断是例行维保还是应急维保
				isCountOrder: '', //按数量排序吗
				isTimeOrder: '', //是否按时间排序
				isAreaOrder: '', //是否按面积排序
				imgUrl: api.forent_url.image_url, //图片路径
				isRoutine: true, //是否例行维保
				ajaxUrl: "", //后台数据路径
				dataNum: 0, //数据个数
				dataConHeight: null, //数据内容高度
				noMoreDate: false, //是否有数据
				isSelected: true, //是否已选择
				canClick: true, //是否可以点击
				repeatClick: false, //是否重复点击
				switchClick: true, //是否切换了tab
				count: 1,
				area: 0,
				timer: null, //计时器
				maintenanceOrderAllCount: '', // 需处理订单数
				maintenanceOrderOverCount: '' // 已完成订单数
			};
		},
		methods: {
			getMaintenanceAndCompletion () {
				api.post(api.forent_url.maintenance_service_url + "webHome/getMaintenanceAndCompletion", {
					maintenanceId: api.getGlobalVal("maintenance_userObj").orgCode
				}).then(res=>{
					if (res && res.code == 'success') {
						this.maintenanceOrderAllCount = res.data.maintenanceOrderAllCount;
						this.maintenanceOrderOverCount = res.data.maintenanceOrderOverCount
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			mainDrillDown(menuName) { //下钻
				let url;
				switch(menuName) {
					case "uncompletedFault":
						Message.warning("功能开发中！");
						return;
						break;
					case "overdueUncompleted":
						url = "MaintenanceManagement-EmergencyMaintenanceTracking";
						api.setGlobalVal(
							"CmenuName",
							JSON.stringify({
								name: "应急维保跟踪",
								parName: "维保管理",
								lightMenu: "4-0"
							})
						);
						break;
					case "uncompletedToday":
						url = "MaintenanceManagement-EmergencyMaintenanceTracking";
						api.setGlobalVal(
							"CmenuName",
							JSON.stringify({
								name: "应急维保跟踪",
								parName: "维保管理",
								lightMenu: "4-0"
							})
						);
						break;
					case "uncompletedMonth":
						url = "MaintenanceManagement-RoutineMaintenanceTracking";
						api.setGlobalVal(
							"CmenuName",
							JSON.stringify({
								name: "例行维保跟踪",
								parName: "维保管理",
								lightMenu: "4-2"
							})
						);
						break;
				}
				/*var obj = {
						flag: "true",
						menuName: menuName
					}
				localStorage.setItem("mainDown", JSON.stringify(obj));*/
				this.$router.push({
					name: url,
					params: {
						flag: "true",
						menuName: menuName
					}
				})
			},
			getPageData() { //页面尺寸数据
				let that = this;
				let clientWidth = document.body.clientWidth;
				let Mymaintenance = document.getElementById("Mymaintenance") ? document.getElementById("Mymaintenance") : undefined;
				if(!Mymaintenance) return;
				if(clientWidth <= 1920) {
					Mymaintenance.width = 250;
					Mymaintenance.height = 250;
					that.arc_num = 80;
					that.size_top = "24px";
					that.size_bottom = "14px";
				}
				if(clientWidth < 1600) {
					Mymaintenance.width = 150;
					Mymaintenance.height = 130;
					that.arc_num = 60;
					that.size_top = "24px";
					that.size_bottom = "14px";
				}
				if(clientWidth <= 1366) {
					Mymaintenance.width = 150;
					Mymaintenance.height = 150;
					that.arc_num = 48;
					that.size_top = "18px";
					that.size_bottom = "14px";
				}
			},
			getRoutineData(data) { //绘制例行维保数据图表；
				let that = this;
				let arc_num = that.arc_num;
				let size_top = that.size_top;
				let size_bottom = that.size_bottom;
				$("#totality").text(data.planCount);
				$("#completed").text(data.planComplete);
				$("#Currentcompleted").text(data.planUnComplete);
				//--------------------------------------------------
				let cc = document.querySelector("#Mymaintenance") ? document.querySelector("#Mymaintenance") : undefined;
				if(!cc) return;
				let g = cc.getContext("2d");
				let deg = (2 * Math.PI) / 360; //每一度°
				let result = ((data.planComplete / data.planCount) * 100).toFixed(0);
				let StepDeg = parseInt((result * 360) / 100);
				isNaN(StepDeg) ? (result = StepDeg = 0) : StepDeg; //容错
				g.strokeStyle = "#d7d7d7";
				g.beginPath();
				// g.arc(cc.width / 2, cc.height / 2, arc_num, 0, deg * 360);
				g.arc(cc.width / 2, cc.height / 2, arc_num, 0, 2 * Math.PI);
				g.lineWidth = 8;
				g.stroke();
				g.save();
				g.beginPath();
				g.lineWidth = 8;
				g.strokeStyle = "#fe6d27";

				g.arc(
					cc.width / 2,
					cc.height / 2,
					arc_num,
					deg * 225,
					deg * 225 + deg * StepDeg,
					false
				);
				g.stroke();
				g.restore();
				//%开始
				g.beginPath();
				g.strokeStyle = "#fe6d27";
				g.font = " " + size_top + " Arial normal";
				g.fillStyle = "#fe6d27";
				//文字水平中间对齐
				g.textBaseline = "middle";
				//文字垂直对齐
				g.textAlign = "center";
				g.fillText(result + "%", cc.width / 2, cc.height / 2 - 10);
				g.save();
				g.fillStyle = "#5e687e";
				g.font = "bold " + size_bottom + " Arial normal";
				g.fillText("本月完成率", cc.width / 2, cc.height / 1.6);
				g.save();
				g.stroke();
			},
			/**
			 *日历组件开始
			 * */
			//初始化日历控件
			getWeekfun() {
				let _this = this;
				weekfn.jcalendar_week({
					element: "#jcalendar_week", //填充日历的dom元素
					dayaddclass: function(date) {
						//添加某天时给添加类名
						return "";
					},
					Backclick: function(date) {
						setTimeout(function() {
							_this.getInfo(1); //返回今天
						}, 500)
					},
					direction: function(year, weeknum) {
						_this.getInfo_to(year, weeknum); //
					},
					dayclick: function(date, obj) {
						//day点击事件
						$(obj).addClass("calendar_day_act").siblings().removeClass("calendar_day_act");
						_this.gettodeys(date); //点击确定的天
					}
				});
				//初始化当天数据
				this.getInfo(1)
			},
			getInfo_to(year, weeknum) {
				let startTime = weekfn.getDatas().start_y_m_d;
				let endTime = weekfn.getDatas().end_y_m_d;
				api.post(api.forent_url.maintenance_service_url + "/webHome/getOverdue", {
					// maintenanceId: userObj.orgCode,
					maintenanceId: '340104FWJG201806250002',
					startTime: startTime,
					endTime: endTime
				}).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"];
						weekfn.setWeeks(year, weeknum, data);
					}
				}).catch(function(err) {
					console.log(err);
				});
			},
			getNum_top() {
				jQuery.ajax({
					url: forent_url.maintenance_service_url +
						"/webHome/getMaintenanceAndCompletion",
					type: "post",
					data: {
						maintenanceId: userObj.orgCode
					},
					success: function(res) {
						let code = res["code"];
						if(code == "success") {
							let data = res["data"];
							$("#totle_num").text(data.maintenanceOrderAllCount);
							$("#completed_num").text(data.maintenanceOrderOverCount);
						}
					},
					error: function(error) {}
				});
			},
			getInfo(num_tyos) {
				let _this = this;
				let startTime = weekfn.getDatas().start_y_m_d;
				let endTime = weekfn.getDatas().end_y_m_d;
				api.post(api.forent_url.maintenance_service_url + "/webHome/getOverdue", {
						maintenanceId: _this.userInfo.orgCode,
						// maintenanceId: '340104FWJG201806250002',
						startTime: startTime,
						endTime: endTime
					}).then(function(response) {
						let code = response["code"];
						if(code == "success") {
							let data = response["data"];
							weekfn.newweek(data);
							if(num_tyos) {
								_this.gettodeys()
							}
						} else {
							GS.$Message.error(data["message"]);
						}
					})
					.catch(function(err) {
						console.log(err);
					});
			},
			gettodeys(days) {
				let dates = new Date();
				let yy = dates.getFullYear();
				let mm = dates.getMonth() + 1;
				if(mm < 10) {
					mm = "0" + mm;
				}
				let dd = dates.getDate();
				if(dd < 10) {
					dd = "0" + dd;
				}
				let nowdats = "";
				if(days) {
					nowdats = days;
				} else {
					nowdats = yy + "-" + mm + "-" + dd;
				}
				let _this = this;
				api.post(
					api.forent_url.maintenance_service_url + "/webHome/getEmergencyToday", {
						maintenanceId: _this.userInfo.orgCode,
						// maintenanceId: '340104FWJG201806250002',
						bespeakTime: nowdats
					}
				).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"].maintenanceList;
						if(data.length < 1) {
							$(".not_datas").show();
							$(".hava_datas").hide();
						} else {
							let str = "";
							let str_ststus = "";
							let str_ststus_img = "";
							for(let i = 0; i < data.length; i++) {
								if(data[i].serviceState == 3 || data[i].serviceState == 4) {
									str_ststus =
										'<span class="span_ststus ststus_finish m-l5px">已完成</span>';
									str_ststus_img =
										'<img src="' + _this.imgUrlObj.iocn2 + '" />';
								} else {
									str_ststus =
										'<span class="span_ststus ststus_be_finish m-l5px">待完成</span>';
									str_ststus_img =
										'<img src="' + _this.imgUrlObj.iocn1 + '" />';
								}
								str +=
									`<li>
										<div class="cbp_tmicon">
											` +
									str_ststus_img +
									`
										</div>
										<div class="cbp_tmlabel">
											<img class="left_sa" src="` + _this.imgUrlObj.icon5 + `" />
											<div style="max-width:400px">
												<div class="pd15px_20px div-flex align_center color_yingji yy-border-bottom">
													<p class="p_splice font_yahei">维保单号：<span class="fw400" title="` +
									data[i].maintenanceId +
									`">` +
									data[i].maintenanceId +
									`</span></p>
													` +
									str_ststus +
									`
												</div>
												<div class="pd15px_20px">
													<div class="div-flex align_center mb-10px fs18px">
														<div><img class="emergency_icon" src="` + _this.imgUrlObj.icon_build + `" /></div>
														<p class=" div-flex align_center m-l5px flex1">
															<span class="color_left">维保单位：</span>
															<span class="flex1 color_right ellipsis" title="${data[i].maintencanceName}">` +
									data[i].maintencanceName +
									`</span>
														</p>
													</div>
													<div class="div-flex align_center mb-10px">
														<div><img class="emergency_icon" src="` + _this.imgUrlObj.icon_person + `" /></div>
														<p class="div-flex align_center m-l5px flex1">
															<span class="color_left">维保人员：</span>
															<span class="flex1 color_right ellipsis" title="${data[i].userName}">` +
									data[i].userName +
									`</span>
														</p>
													</div>
													<div class="div-flex">
														<div><img class="emergency_icon" src="` + _this.imgUrlObj.icon_time + `" /></div>
														<p class="div-flex align_center m-l5px flex1">
															<span class="color_left">预约时间：</span>
															<span class="flex1 color_right" title="${data[i].bespeakTime}">` +
									data[i].bespeakTime +
									`</span>
														</p>
													</div>
												</div>
											</div>
										</div>
									</li>`;
								$("#havas_datas").html(str);
							}
							$(".not_datas").hide();
							$(".hava_datas").show();
						}
					}
				}).catch(function(err) {
					console.log(err);
				})
			},
			/**
			 *日历组件结束
			 * */
			initData() { //初始化页面数据；
				let that = this;
				that.isCountOrder = 0;
				that.isAreaOrder = 1;
				that.ajaxUrl = "/webHome/getPlanCountAndAreaOfEmployee";
				let orgCode = api.getGlobalVal("maintenance_userObj").orgCode;
				api.post( //获取例行维保数据;
						api.forent_url.maintenance_service_url +
						"/webHome/getRoutinePlanCount", {
							orgId: orgCode
						}
					).then(function(response) {
						let code = response["code"];
						if(code == "success") {
							let res = response.data;
							that.routineMaintenanceData = res;
							that.getRoutineData(res);
						} else {
							GS.$Message.error(data["message"]);
						}
					})
					.catch(function(err) {
						console.log(err);
					});
				api.post(
						api.forent_url.maintenance_service_url +
						"/webHome/getWebHomeStatistics", {
							orgId: orgCode
						}
					).then(function(response) {
						let code = response["code"];
						if(code == "success") {
							let res = response.data;
							if(res) {
								that.overdueUncompleted = res.overdueUncompleted;
								that.uncompletedMonth = res.uncompletedMonth;
								that.uncompletedToday = res.uncompletedToday;
							}
						} else {
							GS.$Message.error(data["message"]);
						}
					})
					.catch(function(err) {
						console.log(err);
					});
				api.post( //近30天服务情况初始数据;
						api.forent_url.maintenance_service_url + that.ajaxUrl, {
							maintenanceId: orgCode,
							isCountOrder: that.isCountOrder,
							isTimeOrder: that.isTimeOrder,
							isAreaOrder: that.isAreaOrder
						}
					).then(function(response) {
						let code = response["code"];
						if(code == "success") {
							let res = response.data;
							that.ServicefallList = res;
							//							that.$forceUpdate();
							that.getDataNum();
						} else {
							alert(response["message"])
							GS.$Message.error(response["message"]);
						}
					})
					.catch(function(err) {
						console.log(err);
					});
				api.post( //近30天维保趋势数据;
						api.forent_url.maintenance_service_url + "/webHome/getGraphStatistics", {
							orgId: orgCode
						}
					).then(function(response) {
						let code = response["code"];
						if(code == "success") {
							let res = response.data;
							that.getEchars(res);

						} else {
							//						alert(response["message"])
							GS.$Message.error(response["message"]);
						}
					})
					.catch(function(err) {
						console.log(err);
					});

			},
			autoPlay() { //内容滚动
				let that = this,
					height = $(".homePageServicefallMainUl>li:eq(0)").height() - 10
				$(".homePageServicefallMainUl").animate({
					"marginTop": -height
				}, 1000, function() {
					$(".homePageServicefallMainUl").css("margin-top", 10)
						.find("li:first")
						.appendTo($(".homePageServicefallMainUl"));
				})
			},
			mouseenter(event) { //鼠标移入清除计时器
				let that = this;
				clearInterval(that.timer);
				that.timer = undefined;
			},
			mouseleave(event) { //鼠标移出判断是否开启计时器
				let that = this;
				that.getDataNum("mouseleave");
			},
			selectedSpan(event, index, isTrue) { //判断加载例行维保数据还是应急维保数据；
				let that = this;
				let currentTarget = $(event.currentTarget)
				that.area = 0;
				that.count = 0;
				clearInterval(that.timer);
				that.timer = undefined;
				this.ServicefallList = []
				that.noMoreDate = false;
				if(that.switchClick) {
					$(".selectedSpan").removeClass("wb-selected");
					currentTarget.addClass("wb-selected");
					that.isSelected = isTrue;
					that.routineOrEmergency = index;
					if(index == "1") {
						that.ajaxUrl = "/webHome/getPlanCountAndAreaOfEmployee";
						//						$(".homePageServicefallMainTitle").css("padding-right","7%");
						that.isCountOrder = 0;
						that.isAreaOrder = 1;
						that.isTimeOrder = null;
						that.isRoutine = true;
					} else {
						that.ajaxUrl = "/webHome/getEmergencyCountAndAvgTimeOfEmployee";
						//						$(".homePageServicefallMainTitle").css("padding-right","4%");
						that.isCountOrder = 0;
						that.isAreaOrder = null;
						that.isTimeOrder = 1;
						that.isRoutine = false;
					}
				}
				if(that.switchClick) {
					that.switchClick = false;
					api.post( //近30天服务情况数据;
							api.forent_url.maintenance_service_url + that.ajaxUrl, {
								maintenanceId: that.userInfo.orgCode,
								isCountOrder: that.isCountOrder,
								isTimeOrder: that.isTimeOrder,
								isAreaOrder: that.isAreaOrder
							}
						).then(function(response) {
							let code = response["code"];
							if(code == "success") {
								let res = response.data;
								that.ServicefallList = res;
								that.getDataNum();
								that.switchClick = true;
							} else {
								GS.$Message.error(data["message"]);
							}
						})
						.catch(function(err) {
							console.log(err);
						});
				}

			},
			selectedSort(event, index, isTrue, canClick) { //判断以什么规则排序
				let that = this;
				that.isSelected = isTrue;
				if(that.isRoutine) {
					if(index == "1") {
						that.isCountOrder = 0;
						that.isAreaOrder = 1;
						that.count++;
						that.area = 0;
					} else {
						that.isCountOrder = 1;
						that.isAreaOrder = 0;
						that.area++;
						that.count = 0;
					}
				} else {
					if(index == "1") {
						that.isCountOrder = 0;
						that.isTimeOrder = 1;
						that.count++;
						that.area = 0;
					} else {
						that.isCountOrder = 1;
						that.isTimeOrder = 0;
						that.area++;
						that.count = 0;
					}
				}
				if(that.count === 1) {
					that.noMoreDate = false;
					that.ServicefallList = []
					if(that.canClick) {
						that.canClick = false;
						api.post( //近30天服务情况数据;
								api.forent_url.maintenance_service_url + that.ajaxUrl, {
									maintenanceId: that.userInfo.orgCode,
									isCountOrder: that.isCountOrder,
									isTimeOrder: that.isTimeOrder,
									isAreaOrder: that.isAreaOrder
								}
							).then(function(response) {
								let code = response["code"];
								if(code == "success") {
									let res = response.data;
									that.ServicefallList = res;
									that.getDataNum();
									that.canClick = true;
								} else {
									GS.$Message.error(data["message"]);
								}
							})
							.catch(function(err) {
								console.log(err);
							});
					}
				}
				if(that.area === 1) {
					that.noMoreDate = false;
					that.ServicefallList = []
					if(that.canClick) {
						that.canClick = false;
						api.post( //近30天服务情况数据;
								api.forent_url.maintenance_service_url + that.ajaxUrl, {
									maintenanceId: that.userInfo.orgCode,
									isCountOrder: that.isCountOrder,
									isTimeOrder: that.isTimeOrder,
									isAreaOrder: that.isAreaOrder
								}
							).then(function(response) {
								let code = response["code"];
								if(code == "success") {
									let res = response.data;
									that.ServicefallList = res;
									that.getDataNum();
									that.canClick = true;
								} else {
									GS.$Message.error(data["message"]);
								}
							})
							.catch(function(err) {
								console.log(err);
							});
					}
				}

			},
			getDataNum(str) { //查看返回数据的数量
				let that = this;
				if(that.ServicefallList.length >= that.dataNum) {
					that.noMoreDate = false;
					clearInterval(that.timer);
					that.timer = undefined;
					//					$(".homePageServicefallMainUlCon").css("overflow-y","scroll")
					that.timer = setInterval(function() {
						that.autoPlay()
					}, 5000);
				} else {
					//					$(".homePageServicefallMainUlCon").css("overflow-y","initial")
					if(str != "mouseleave") {
						clearInterval(that.timer);
						that.timer = undefined;
						that.noMoreDate = true;
					}
				}
			},
			getEchars(data) { //近30天维保趋势折线图
				// 动态计算字体高度
				var that = this;
				var chartFontSize = Math.floor(document.body.clientWidth / 1920) * 18;
				var myChart = Echart.init(document.getElementById('echarts-container'));
				var options = {
					legend: {
						icon: 'circle',
						itemWidth: 10,
						itemHeight: 10,
						right: '15',
						top: "4%",
						padding: [5, 15, 5, 5],
						data: ['完成应急维保数量', '完成例行维保数量'],
						textStyle: {
							color: "##676767",
							fontSize: chartFontSize,
							fontWeight: 'bold',
						}
					},
					tooltip: {
						trigger: 'axis',
						backgroundColor: "#fff",
						textStyle: {
							color: "#7F8699",
							fontSize: 16
						},
						borderColor: "#ccc",
						borderWidth: 1,
						padding: 10,
						confine: true
					},
					grid: {
						left: '4%',
						right: '3%',
						bottom: '5%',
						top: "20%",
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: data.list,

						axisLabel: {
							fontSize: 14
						},
						axisLine: {
							lineStyle: {
								color: "#ccc"
							}
						}

					}],
					yAxis: {
						type: 'value',
						axisLabel: {
							fontSize: 14
						},
						splitLine: {
							show: true,
							lineStyle: {
								type: "dashed"
							}
						},
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						}
					},
					series: [{
						name: '完成应急维保数量',
						type: 'line',
						smooth: true,
						lineStyle: {
							color: '#5cb7ff'
						},
						color: '#5cb7ff',
						data: data.eneryList,
						areaStyle: {
							color: '#eef9ff'
						},
						showSymbol: false
					}, {
						name: '完成例行维保数量',
						type: 'line',
						smooth: true,
						lineStyle: {
							color: '#7f8699'
						},
						color: '#7f8699',
						areaStyle: {
							color: '#f7f7f7'
						},
						data: data.rountList,
						showSymbol: false
					}]
				};
				// 动态设置echart宽高
				$('#page').resize(function() {

					myChart.resize();
				})
				$(window).resize(function() { //当浏览器大小变化时
					options.legend.textStyle.fontSize = Math.floor(18 * (document.body.clientWidth / 1920));
					// 重新计算
					myChart.setOption(options);
					// 重新计算尺寸
					myChart.resize();
					that.getPageData();
					that.getRoutineData(that.routineMaintenanceData);
				});
				myChart.setOption(options);
			}
		},
		created() {
			clearInterval(this.timer)
			this.timer = null
		},
		mounted() {
			let that = this;
			clearInterval(this.timer);
			this.timer = null;
			that.dataConHeight = $(".homePageServicefallMain").height() - $(".homePageServicefallMainTitle").height();
			that.dataNum = Math.floor(that.dataConHeight / 60);
			this.initData();
			this.getPageData();
			//初始化日历
			this.getWeekfun();
			this.getMaintenanceAndCompletion();
		},
		beforeDestroy() {
			clearInterval(this.timer)
			this.timer = null
		}
	};
	//window.onresize = function(){
	//		indexPage.getPageData();
	//	}
	//	export default indexPage;
</script>
<style lang="scss">
	html,
	body {
		overflow-y: hidden;
		overflow-x: initial;
	}
	
	#homePage {
		min-height: 500px;
		min-width: 1000px;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		line-height: 1;
		padding-top: 15px;
		@media screen and (max-width: 1920px) {
		  &{
		  	min-height: 796px;
		  }
		}
		@media screen and (max-width: 1680px) {
		  &{
		  	min-height: 745px;
		  }
		}
		@media screen and (max-width: 1440px) {
		  &{
		  	min-height: 640px;
		  }
		}
		@media screen and (max-width: 1366px) {
		  &{
		  	min-height: 520px;
		  }
		}
		.homePageTitle {
			height: 0.52rem;
			color: #5f687f;
			.widthImg_auto {
				width: 0.25rem;
			}
		}
		.div-flexColumn {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		/*-日历样式 start-*/
		.ju_center_start {
			align-items: center;
		}
		.color_left{
			color:#767676;
		}
		.color_right{
			color:#3B4358;
		}
		.flex_i {
			display: -webkit-box;
			display: -moz-box;
			display: -ms-flexbox;
			display: -webkit-flex;
			display: flex;
			-webkit-align-items: center;
			align-items: center;
		}
		.flex_auto {
			-webkit-box-flex: 1;
			-moz-box-flex: 1;
			-webkit-flex: 1;
			-ms-flex: 1;
			flex: 1;
			text-align: center;
		}
		.bd_w {
			background-color: #f5f5f5;
		}
		.pd15px {
			padding: 15px;
		}
		.switch_month {
			border: 0;
			background-color: transparent;
			padding: 10px;
			&:hover {
				cursor: pointer;
				color: #ff6c25;
			}
			&:active {
				background-color: #eee;
			}
		}
		.calendar_info {
			text-align: center;
			padding: 5px;
			font-size: 14px;
			font-weight: bold;
		}
		.calendar_tr:after {
			content: "";
			display: block;
			clear: both;
			padding: 0 1%;
		}
		.calendar_week {
			padding: 0;
			margin: 0;
			padding-top: 10px;
			>li {
				list-style: none;
				color: #2e343b;
				float: left;
				width: 14%;
				text-align: center;
				position: relative;
			}
		}
		.notnowmonth {
			color: #aaa;
		}
		.calendar_day_bar {
			padding: 10px 0;
			>li {
				list-style: none;
				float: left;
				width: 14%;
				text-align: center;
				position: relative;
				color: #7f8285;
				display: inline-block;
				margin-bottom: 15px;
			}
		}
		.calendar_day_i {
			cursor: pointer;
			display: inline-block;
			width: 30px;
			height: 30px;
			line-height: 30px;
		}
		.calendar_day_act .calendar_day_i {
			background-color: #ff6c25;
			color: #fff;
			border-radius: 50%;
		}
		.cur_color {
			color: #ff6c25;
		}
		.pointer {
			cursor: pointer;
		}
		.back_span {
			cursor: pointer;
			color: #ff6c25;
			display: inline-block;
			padding: 1px 10px;
			border: #ff6c25 solid 1px;
			border-radius: 100px;
			font-size: 14px;
			margin-left: 10px;
			font-weight: 600;
		}
		.calendar_today {
			position: relative;
		}
		.have_i {
			display: block;
			position: absolute;
			bottom: 0;
			left: 50%;
			-webkit-transform: translateX(-50%);
			transform: translateX(-50%);
			background-color: #ff6c25;
			border: 2px solid #ff6c25;
			border-radius: 50%;
		}
		.today_i {
			display: block;
			position: absolute;
			bottom: 0;
			left: 50%;
			width: 30px;
			height: 30px;
			line-height: 30px;
			-webkit-transform: translateX(-50%);
			transform: translateX(-50%);
			background-color: #7d8497;
			border: 1px solid #7d8497;
			color: #fff;
			border-radius: 50%;
		}
		.cbp_tmtimeline {
			padding: 0;
			list-style: none;
			position: relative;
			padding-top: 1px;
		}
		/* The line */
		.cbp_tmtimeline:before {
			content: '';
			position: absolute;
			top: 0;
			bottom: 0;
			width: 5px;
			background: #e9e9e9;
			left: 28px;
		}
		.cbp_tmtimeline>li {
			position: relative;
			margin-bottom: 20px;
		}
		/* The icons */
		.cbp_tmtimeline>li .cbp_tmicon {
			width: 5px;
			height: 5px;
			position: absolute;
			text-align: center;
			left: 22px;
			top: 0;
		}
		/* Right content */
		.cbp_tmtimeline>li .cbp_tmlabel {
			margin-left: 60px;
			margin-right: 40px;
			background: #fff;
			position: relative;
			border-radius: 10px;
			min-height: 100px;
			box-shadow: 0 0 20px 1px #e1e4e7;
			border-top-left-radius: 0;
			position: relative;
			top: 7px;
			max-width: 405px;
		}
		.left_sa {
			position: absolute;
			left: -14px;
			top: -2px;
		}
		.ststus_be_finish {
			background-color: #ff6c25;
		}
		.mb-10px {
			margin-bottom: 10px;
		}
		.pd15px_20px {
			padding: 10px 20px;
		}
		.span_ststus {
			display: inline-block;
			border-radius: 3px;
			color: #fff;
			font-size: 12px;
			text-align: center;
			width: 50px;
			height: 22px;
			line-height: 22px;
		}
		.p_splice {
			flex: 1;
			width: 60%;
			overflow: hidden;
			white-space: nowrap;
			color:#848CA3;
			/* text-overflow: ellipsis; */
			span{
				color:#5F687F;
			}
		}
		.ellipsis {
			display: inline-block;
			max-width: 200px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			z-index: 100;
		}
		.color_right {
			color: #3b4358;
		}
		.color_yingji {
			color: #5f687f;
		}
		.m-l5px {
			margin-left: 5px;
		}
		/*-日历样式 end-*/
	
	
	.homePageHead {
		width: 100%;
		height: 1.2rem;
		margin-bottom: 0.8%;
		box-shadow: 0px 0px 20px rgba(172, 172, 172, 0.2);
		/* padding: 1.8% 0;*/
		padding: 0.26rem 0;
		min-height: 70px;
		.top-count:not(:last-child) {
			border-right: 1px solid #e1e2e7;
		}
		.top-count {
			width: 25%;
			height: 100%;
			cursor: pointer;
			color: #5f687f;
			.fs26px {
				display: block;
				font-weight: bold;
				font-size: 0.24rem;
				color: #5f687f;
			}
			p {
				color: #677089;
				margin-top: 0.06rem;
			}
		}
		.wb-imgCon {
			display: inline-block;
			margin-left: 30px;
			height: 100%;
			margin-right: 0.22rem;
			width: 0.68rem;
			img {
				height: 100%;
			}
		}
	}
	
	.homePageMainCon {
		width: 100%;
		flex: 1;
		display: flex;
		box-shadow: 0px 0px 20px rgba(172, 172, 172, 0.2);
		min-height: 450px;
		.homePageEmergency {
			width: 35%;
			margin-right: 0.8%;
			box-shadow: 0px 0px 20px rgba(172, 172, 172, 0.2);
			display: flex;
			flex-direction: column;
			background-color: #fff;
			.homePageEmergency_top {
				color: #5f687f;
				.homePageEmergency_topC {
					height: 0.52rem;
					.totle_num,
					.completed_num {
						color: #ff6c25;
					}
				}
			}
		}
		.homePageMainRightCon {
			flex: 1;
			display: flex;
			width: 100%;
			flex-direction: column;
			justify-content: flex-start;
			.homePageMainRightTopCon {
				width: 100%;
				height: 56%;
				margin-bottom: 1.25%;
				display: flex;
				justify-content: flex-start;
				box-shadow: 0px 0px 20px rgba(172, 172, 172, 0.2);
			}
		}
		.homePageRoutineCon {
			width: 49.4%;
			margin-right: 1.25%;
			box-shadow: 0px 0px 20px rgba(172, 172, 172, 0.2);
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			.echarts-div {
				justify-content: center;
			}
			.month-count {
				display: flex;
				height: 24%;
				color: #5e697a;
				justify-content: space-around;
				text-align: center;
				padding-bottom: 0.25rem;
				article {
					color: #677089;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
				}
				.month-center {
					position: relative;
					.line {
						width: 2px;
						height: 70%;
						background: #ccc;
						position: absolute;
						right: 0px;
						top: 15%;
					}
				}
			}
		}
		.homePageServicefall {
			flex: 1;
			box-shadow: 0px 0px 20px rgba(172, 172, 172, .2);
			display: flex;
			flex-direction: column;
			.rotineAndEmergency {
				justify-content: space-around;
				width: 45%;
			}
			.routineSpan {
				cursor: pointer;
				position: relative;
				margin-right: -.3rem;
			}
			.emergencySpan {
				justify-content: flex-end!important;
				cursor: pointer;
				position: relative;
				margin-right: -.3rem;
			}
			.homePageServicefallTitle {
				p:last-child span:before {
					content: "";
					height: .065rem;
					width: .065rem;
					border: 1px solid #c0c0c0;
					position: absolute;
					left: -19%;
					top: 32%;
					border-radius: 50%;
				}
				p:last-child span.wb-selected:before {
					content: "";
					height: .06rem;
					width: .06rem;
					background-color: #ff6722;
					border: none;
					position: absolute;
					left: -28%;
					top: 33%;
					border: 2px solid #fff;
					box-shadow: 0 0 0 1px #ff6722;
					border-radius: .5rem;
					z-index: 100;
				}
			}
		}
		.homePageServicefallMainTitle {
			color: #5F687F;
			position: relative;
			background-color: #fff;
			.wb-countsTop {
				width: .14rem;
			}
		}
		.homePageServicefallMain {
			overflow: hidden;
			display: flex;
			flex-direction: column;
			flex: 1;
			>div:first-child {
				height: 11%;
				width: 100%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding-right: 12%;
				z-index: 1001;
			}
			.wb-portrait {
				height: .38rem;
				width: .38rem;
				border-radius: 100%;
				margin: 0 4%;
				position: relative;
				background-color: #bfbfbf;
				img {
					height: .38rem;
					width: .38rem;
					border-radius: 100%;
				}
			}
			.homePageServicefallMainUlCon {
				height: 89%;
				/*overflow: auto;
				padding-top: 10px;
				position: relative;
				&::-webkit-scrollbar {
					background: transparent;
				}
				
				&::-webkit-scrollbar-track-piece {
					display: none;
				}
				
				&::-webkit-scrollbar-track {
					background-color: #fff;
				}*/
			}
			.homePageServicefallMainUl {
				/*height: 94.5%;*/
				background-color: #fff;
				width: 100%;
				margin-top: 10px;
				li {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					/*font-size: .18em;*/
					min-height: 20%;
					height: 60px;
					background-color: #fff;
					width: 96%;
					.wb-num {
						width: 10%;
						display: inline-block;
						text-align: center;
						color: #5f687f;
						font-weight: 600;
					}
					.wb-name {
						width: 20%;
						display: inline-block;
						text-align: left;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						color: #767676;
						font-weight: 600;
					}
					.wb-completeCounts,
					.wb-maintenanecArea {
						width: 25%;
						display: inline-block;
						text-align: center;
						color: #767676;
						font-weight: 600;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.noMoreData {
					height: 53px!important;
					width: 100%;
					justify-content: center!important;
					color: darkgray;
				}
				.wb-champion:before {
					content: url("../../assets/img/main/champion.png");
					position: absolute;
					top: -21px;
					left: 50%;
					transform: translateX(-50%);
					z-index: 1000;
				}
				.wb-runnerUp:before {
					content: url("../../assets/img/main/runner-up.png");
					position: absolute;
					top: -21px;
					left: 50%;
					transform: translateX(-50%);
					z-index: 1000;
				}
				.wb-thirdPlace:before {
					content: url("../../assets/img/main/thirdPlace.png");
					position: absolute;
					top: -21px;
					left: 50%;
					transform: translateX(-50%);
					z-index: 1000;
				}
				.wb-no1 {
					color: #f31e1e
				}
				.wb-no2 {
					color: #ff6c25
				}
				.wb-no3 {
					color: #ffc704
				}
			}
		}
		.homePageMaintenanceTrend {
			/*近30天维保趋势*/
			width: 100%;
			flex: 1;
			box-shadow: 0px 0px 20px rgba(172, 172, 172, 0.2);
			flex-direction: column;
			display: flex;
			justify-content: flex-end;
		}
	}
	
	@media screen and (max-width: 1440px) {
		.mt-26 {
			margin-top: -.26rem!important;
		}
		.fs46px {
			font-size: .4rem;
		}
		.homePageHead {
			padding: .2rem 0;
		}
	}
}
</style>