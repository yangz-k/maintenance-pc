<!--该页需接受 MaintenancePersonnelInformation.vue 点击按钮时传递的那条信息 -->
<template>
	<div class="mainPage bg-white">
		<!-- 面包屑 -->
		<el-row class="l-head" style="background-color:#edf0f7;" type="flex" justify="space-between" align="middle">
			<!-- 面包屑 -->
			<Title/>
			<el-button class="goBack" type="text" icon="maintenance-back1" @click="back()">返回</el-button>
		</el-row>
		<div class="tab pt_0px">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="基本信息" name="first">
					<div class="form_table">
						<div class="bg_gray color_mo div-flex fs20px pd15_20rem">
							<span class="flex1 lineHeight1">基本信息</span>
						</div>
						<div v-if="!isEdit" class="form_line pd15_20rem">
							<div class="div-flex">
								<div class="algin_top m_r15rem">
									<img :src="img_obj.weibao" class="head_img" alt>
								</div>
								<div class="m_t15rem fs16px">
									<div class>
										<div class="form_li div-flex m_b20rem p_t20rem">
											<div class="div-flex flex1">
												<div class="form_title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</div>
												<div class="form_input_div">{{infoObj.username}}</div>
											</div>
											<div class="div-flex flex1">
												<div class="form_title">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</div>
												<div class="form_input_div" v-if="infoObj.sexCode == '0'">男</div>
												<div class="form_input_div" v-if="infoObj.sexCode == '1'">女</div>
												<div class="form_input_div" v-if="infoObj.sexCode == '2'">其他</div>
											</div>
											<div class="div-flex flex1">
												<div class="form_title">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄：</div>
												<div class="form_input_div">{{infoObj.age}}</div>
											</div>
										</div>
										<div class="form_li div-flex m_b20rem">
											<div class="div-flex flex1">
												<div class="form_title">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</div>
												<div class="form_input_div">{{infoObj.loginName}}</div>
											</div>
											<!--<div class="div-flex flex1">
												<div class="form_title">出生日期：</div>
												<div class="form_input_div">{{infoObj.birthDate}}</div>
											</div>-->
											<div class="div-flex flex1">
												<div class="form_title">身份证号：</div>
												<div class="form_input_div">{{infoObj.idNumber}}</div>
											</div>
											<div class="div-flex flex1">
												<div class="form_title">联系电话：</div>
												<div class="form_input_div">{{infoObj.telephone}}</div>
											</div>
										</div>
										<div class="form_li div-flex m_b20rem">
											
											<div class="div-flex flex1">
												<div class="form_title">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;位：</div>
												<div class="form_input_div">{{infoObj.positionName}}</div>
											</div>
											<div class="div-flex flex1">
												<div class="form_title">从业时间：</div>
												<div class="form_input_div" v-text="infoObj.worktime? infoObj.worktime.split(' ')[0] : ''"></div>
											</div>
											<div class="div-flex flex1">
												<div class="form_title">入职时间：</div>
												<div class="form_input_div" v-text="infoObj.entrytime ? infoObj.entrytime.split(' ')[0] : ''"></div>
											</div>
										</div>
										<!--<div class="form_li div-flex m_b20rem">
											<div class="div-flex flex1">
												<div class="form_title">从业时间：</div>
												<div class="form_input_div" v-text="infoObj.worktime? infoObj.worktime.split(' ')[0] : ''"></div>
											</div>
										</div>-->
										<div class="form_li div-flex">
											<div class="div-flex flex1">
												<div class="form_title">资质证书：</div>
												<!--<div class="form_input_div div-flex flex1 credentialsList">
                          <div class="m_r15rem" v-for="(item,index) in infoObj.credentialsList" :key="index">
                            <img :src="getImgUrl(item.attachPath)" @click="clickImg($event)" class="ziziImg" alt>
                          </div>
                        </div>-->
												<!--<div class="banner form_input_div div-flex flex1 credentialsList" >
								          <div class="pd20rem"  v-if="infoObj.credentialsList.length<1"><img :src="errorImg" class="errorImg" alt="" srcset=""> </div>
								          <div class="pd20rem"  v-if="infoObj.credentialsList.length===1"><img :src="getImgUrl(infoObj.credentialsList[0].attachPath)" class="errorImg" @click="clickImg($event)" alt="" srcset=""> </div>
								          <el-carousel
								          	v-else
								            :interval="0"
								            type="card"
								            height="2rem"
								            arrow="always"
								            indicator-position="outside"
								            :loop='false'
								            class="flex1"
								          >
								            <el-carousel-item class="m_r15rem" v-for="(item,index) in infoObj.credentialsList" :key="index">
								              <img :src="getImgUrl(item.attachPath)" @click="clickImg($event)" class="ziziImg" alt>
								            </el-carousel-item>
								          </el-carousel>
                        </div>-->
												<div v-if="infoObj.credentialsList.length<1">
													<img style="width: 2.5rem; height: auto;" :src="errorImg" alt srcset class="wb-qualification-img errorImg">
												</div>
												<div style="position: relative; width: 13.9rem; padding: 0 0.5rem;" v-else>
													<div class="swiper-container" style="margin: 0 auto;">
														<div class="swiper-wrapper">
															<div class="wb-plan-item swiper-slide swiper-no-swiping" style="overflow: hidden;" v-for="(item,index) in infoObj.credentialsList" :key="index">
																<div class="swiper-img_block">
																	<img @click="clickImg($event)" :src="(imgUrl+item.attachPath).substring(0,(imgUrl+item.attachPath).lastIndexOf('.'))+'_240X160'+(imgUrl+item.attachPath).substring((imgUrl+item.attachPath).lastIndexOf('.'),(imgUrl+item.attachPath).length)">
																</div>
																<p class="swiper-p_block">{{item.name}}</p>
															</div>
														</div>
													</div>

													<!--<div class="three_img swiper-button-prev leftArrow" style="left: -40px;margin-top: -42px;cursor: pointer;"></div>
                          <div class="three_img swiper-button-next rightArrow" style="right: 35px;margin-top: -42px;cursor: pointer;"></div>-->
													<div class="maintenance-pullWest leftArrow prohibit" @click="prev()" v-if="infoObj.credentialsList.length > 4"></div>
													<div class="maintenance-pullWest rightArrow" @click="next()" v-if="infoObj.credentialsList.length > 4"></div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<UpdateTabe v-if="isEdit"></UpdateTabe>
					</div>
				</el-tab-pane>
				<el-tab-pane label="服务企业" name="second">
					<!-- 表格 -->
					<div class="table-list table_list_one">
						<Table ref="table" :tableList="dataList" :options="options" :columns="columns" :operates="operates" :url="requestUrl"></Table>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
		<big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
	</div>
</template>
<script>
	import api from "~/config/http";
	import config from "~/config/api.config";
	import Title from "~/components/Title";
	import BigImg from "~/components/BigImg.vue";
	import Table from "~/components/Table";
	import mixin from "~/mixin/mixin";
	//import Swiper from "Swiper";
	let Swiper = null;
	export default {
		mixins: [mixin],
		components: {
			Title,
			Table,
			"big-img": BigImg
		},
		data() {
			return {
				isEdit: false,
				activeName: "first",
				errorImg: require("@/assets/img/BasicUnitInformation/credentials_error.png"),
				imgUrl: config.forent_api.image_url,
				infoObj: {
					credentialsList: []
				}, //基本信息
				img_obj: {
					weibao: require("@/assets/img/MaintenanceUnitInformation/weibao.png"),
					zizhi: require("@/assets/img/BasicUnitInformation/zizhi.png"),
					women: require("@/assets/img/MaintenanceUnitInformation/women.png")
				},
				//放大图片
				showImg: false,
				imgSrc: "",
				// 表格
				dataList: [],
				requestUrl: api.forent_url.maintenance_service_url +
					"userInfo/getUserProprietoList", //服务终止
				options: {
					stripe: true, // 是否为斑马纹 table
					loading: true, // 是否添加表格loading加载动画
					highlightCurrentRow: true, // 是否支持当前行高亮显示
					isShowSerialNumber: true,
					mutiSelect: false // 是否支持列表项选中功能
				}, // table 的参数
				columns: [{
						prop: "proprietorName",
						label: "企业名称",
						align: "center",
						minWidth: "10%"
					},
					{
						prop: "enterpriseType",
						label: "企业类型",
						align: "center",
						minWidth: "10%"
					},
					{
						prop: "areaCode",
						label: "建筑面积",
						align: "center",
						minWidth: "10%"
					},
					{
						prop: "proprietorAddress",
						label: "企业地址",
						align: "center",
						minWidth: "15%"
					},
					{
						prop: "servicePeriodBeginning",
						label: "服务开始时间",
						align: "center",
						minWidth: "15%"
					},
					{
						prop: "servicePeriodEnding",
						label: "服务截止时间",
						align: "center",
						minWidth: "15%"
					}
				], // 需要展示的列
				operates: {},
				mySwiper: null,
				step: 4,
				flag: true
			};
		},
		props: ["pagedata"],
		created() {},
		mounted() {
			this.$nextTick(function() {
				if(process.browser) {
					Swiper = require("swiper");
					window.onresize = () => {
						return(() => {
							if(this.$route.params.isService) {
								this.activeName = "second";
								this.getService();
							} else {
								this.getInfo();
							}
						})();
					};
					if(this.$route.params.isService) {
						this.activeName = "second";
						this.getService();
					} else {
						this.getInfo();
					}
				}
			});
		},
		methods: {
			prev() {
				if(this.flag && this.step > 4) {
					this.flag = false;
					this.mySwiper.swipePrev();
				}
			},
			next() {
				if(this.flag && this.step < this.infoObj.credentialsList.length) {
					this.flag = false;
					this.mySwiper.swipeNext();
				}
			},
			back() {
				this.$router.back(-1);
			},
			getImgUrl(url) {
				return config.forent_api.image_url + url;
			},
			clickImg(e) {
				this.showImg = true; // 获取当前图片地址
				this.imgSrc = e.currentTarget.src;
			},
			viewImg() {
				this.showImg = false;
			},
			getInfo() {
				let info = this.$route.params;
				let _this = this;
				api
					.get(api.forent_url.maintenance_service_url + "/userInfo/getUserInfo", {
						userId: info.userId,
						orgCode: info.orgId
					})
					.then(function(res) {
						let code = res["code"];
						if(code == "success") {
							let data = res["data"];
							_this.infoObj = data;
							// _this.step = this.infoObj.credentialsList.length;
							_this.initSwiper();
						}
					})
					.catch(function(err) {
						console.log(err);
					});
			},
			initSwiper() {
				let _this = this;
				if(_this.mySwiper) {
					_this.mySwiper.reInit();
				} else {
					_this.$nextTick(function() {
						_this.mySwiper = new Swiper(".swiper-container", {
							slidesPerView: 4,
							noSwiping: true,
							initialSlide: 0,
							onSlidePrev: function(swiper) {
								if(_this.step < 5) {
									$(".leftArrow").addClass("prohibit");
								} else if(_this.step == 5) {
									$(".leftArrow").addClass("prohibit");
									$(".rightArrow").removeClass("prohibit");
									_this.step--;
								} else {
									$(".leftArrow").removeClass("prohibit");
									$(".rightArrow").removeClass("prohibit");
									_this.step--;
								}
								console.log("_this.step", _this.step);
							},
							onSlideNext: function(swiper) {
								if(_this.step > _this.infoObj.credentialsList.length - 1) {
									$(".rightArrow").addClass("prohibit");
								} else if(
									_this.step ==
									_this.infoObj.credentialsList.length - 1
								) {
									$(".rightArrow").addClass("prohibit");
									$(".leftArrow").removeClass("prohibit");
									_this.step++;
								} else {
									$(".leftArrow").removeClass("prohibit");
									$(".rightArrow").removeClass("prohibit");
									_this.step++;
								}
								console.log("_this.step", _this.step);
							},
							onSlideChangeEnd: function(swiper) {
								_this.flag = true;
							},
							onInit: function(swiper) {
								// swiper.swipeNext()
							}
						});
					});
				}
			},
			getService() {
				//服务企业
				let _this = this;
				let info = this.$route.params;
				let userId = info.userId;
				let params = {
					userId: userId
				};
				_this.$nextTick(function() {
					$(".table_list_one").css(
						"height",
						$(".mainPage").height() -
						$(".l-head").height() -
						$(".el-tabs__header").height() -
						15 +
						"px"
					);
					_this.$refs.table.queryTableListByParams(params);
				});
			},
			handleClick(tab, event) {
				if(tab.name == "first") {
					this.getInfo(); //个人信息
				} else {
					this.getService(); //服务企业
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	.errorImg {
		width: 2.34rem;
		height: 1.9rem;
		margin-left: 0.1rem;
	}
	
	/deep/.el-carousel__indicators {
		display: none;
	}
	
	.swiper-slide {
		text-align: center;
		// width: 2.6rem;
		// height: 2.1rem;
		img {
			width: auto;
			height: 1.5rem;
			display: inline-block;
			cursor: pointer;
		}
	}
	
	.mainPage {
		min-height: 100%;
		height: auto;
	}
	
	.form_table {
		height: 100%;
		border: #f7f7f7 solid 1px;
	}
	
	.form_table .form_line {
		width: 100%;
	}
	
	.form_table .el-form-item {
		margin-bottom: 0;
	}
	
	.head_img {
		width: 0.9rem;
		border-radius: 50%;
		border: #ddd solid 2px;
	}
	
	.form_title {
		color: #9a9a9a;
	}
	
	.form_input_div {
		width: 2rem;
		color: #434343;
	}
	
	.ziziImg {
		width: 3rem;
	}
	
	.p_t20rem {
		padding-top: 0.2rem;
	}
	
	/deep/.el-tabs__nav-wrap {
		padding-left: 0.3rem;
	}
	
	.credentialsList {
		flex-wrap: wrap;
		flex-basis: auto;
	}
	
	.maintenance-pullWest {
		border: 0;
		margin-top: -0.2rem;
		cursor: pointer;
		width: 0.4rem;
		height: 0.4rem;
		position: absolute;
		top: 50%;
		text-align: center;
		font-size: 0.4rem;
	}
	
	.leftArrow {
		left: 5px;
		color: #5f687f;
	}
	
	.rightArrow {
		right: 5px;
		color: #5f687f;
		transform: rotate(180deg);
		-ms-transform: rotate(180deg);
		-moz-transform: rotate(180deg);
		-webkit-transform: rotate(180deg);
		-o-transform: rotate(180deg);
		// -webkit-transform-origin: center center;
		// transform-origin: center center;
	}
	
	.prohibit {
		color: #dbdbdb;
		cursor: default;
	}
	
	.hide {
		visibility: hidden;
	}
	
	// @media screen and (max-width: 1920px) {
	//   .swiper-slide {
	//     height: 2.1rem;
	//   }
	// }
	// @media screen and (max-width: 1366px) {
	//   .swiper-slide {
	//     height: 1.5rem;
	//   }
	// }
</style>