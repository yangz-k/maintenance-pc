<template>
	<div class="main" v-loading="loading">

		<div class="copyright">
			Copyright © 2018 辰安天泽智联技术有限公司 All rights reserved
			<a href="http://www.miitbeian.gov.cn/" target="_blank">皖ICP备18004330号-1</a>
			<a href="http://www.ibw.cn/mianze.htm" target="_blank">免责声明</a>
		</div>
		<div class="wb-login-header">
			<img src="../assets/img/Overalllayout/logoTitle.png" alt="维保登录">
		</div>
		<div class="wb-login-middle" style="">
			<img src="../assets/img/Overalllayout/loginOne.png" alt="维保登录">
		</div>
		<el-form class="login-main" :model="ruleForm" status-icon :rules="rules" ref="loginForm">
			<div class="img">
				<img src="../assets/img/Overalllayout/system.png" alt="">
			</div>
			<div class="system">
				<span>安云维保助手</span>
			</div>
			<div class="login">
				<div class="login-wrap div-flex align_center" prop="">
					<span class="login-ipt-icon"><i class="maintenance-user"></i></span>
					<el-input id="loginName" v-model="accountInput" placeholder="请输入账号" @keyup.enter.native="login"></el-input>
				</div>
			</div>
			<div class="login">
				<div class="login-wrap div-flex align_center">
					<span class="login-ipt-icon"><i class="maintenance-lock"></i></span>
					<el-input type="password" id="password" v-model="passwordInput" placeholder="请输入密码" @keyup.enter.native="login"></el-input>
				</div>
			</div>
			<el-row>
				<el-button id="btn" @click="login()" type="warning">登 录</el-button>
			</el-row>
		</el-form>

		<!-- 选择企业开始 -->
		<el-dialog title="选择企业" :visible.sync="previewVisible" :top="'0'" :close-on-click-modal="false" width="4.5rem">
			<div id="loginDiv" class="login-div">
				<ul>
					<li :title="joinEnterprise.orgName" v-for="(joinEnterprise,index) in joinEnterpriseData" :key="index">
						<!-- <span><input type="radio" name="radio" :value="joinEnterprise.id" :checked="isChecked" /></span>
						<span>{{joinEnterprise.orgName}}</span> -->

						<a v-if="joinEnterprise.isChecked" href="javascript:;" class="unchecked checked" :value="joinEnterprise.id" @click="enterprise($event)">
							{{joinEnterprise.orgName}}
							<b id='logo' class='el-icon-check'></b>
						</a>
						<a v-else href="javascript:;" class="unchecked" :value="joinEnterprise.id" @click="enterprise($event)">{{joinEnterprise.orgName}}</a>
					</li>
				</ul>
			</div>
			<div class="div-flex all_center">
				<el-button id="joinEnterprise" class="login-btn-dialog fs18px button-radius" type="warning" @click="joinEnterprise(joinEnterpriseData,userInfo)">进入企业</el-button>
			</div>
		</el-dialog>
		<!-- 选择企业结束 -->

	</div>
</template>

<script>
	import 'babel-polyfill';
	import axios from "axios";
	import md5 from "js-md5";
	import Cookie from "js-cookie";
	import { Message } from "element-ui";
	import api from "~/config/http";
	import { mapMutations } from "vuex";
	import validate from "~/plugins/validate";
	export default {
		layout: "login",
		data() {
			return {
				loading: false,
				// 选择企业开始
				previewVisible: false, // 选择企业弹框
				joinEnterpriseData: [], //组织机构数据
				selectedEnterprises: '', // 选中企业
				userInfo: [], //用户信息
				// 选择企业结束

				accountInput: "", //账号
				passwordInput: "", //密码
				salt: "true",
				// isChecked:false,//是否选中组织机构
				ruleForm: {
					userName: '',
					passWord: '',
				},
				rules: {
					userName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}]
				}
			};
		},
		methods: {
			enterprise(dom) {
				$(".unchecked").removeClass("checked");
				$("#logo").remove();
				this.selectedEnterprises = $(dom.currentTarget).attr("value");
				$(dom.currentTarget).addClass("checked");
				$(dom.currentTarget).append("<b id='logo' class='el-icon-check'></b>")
			},
			login() {
				this.loading = true;
				let that = this;
				if("" == this.accountInput || "" == this.passwordInput) {
          			this.loading = false;
					this.$message.error("用户名或密码不能为空");
				} else {
					let pwdOld = this.passwordInput + this.salt;
					md5(pwdOld);
					let hash = md5.create();
					hash.update(pwdOld);
					let pwd = hash.hex(pwdOld);
					let serverUrl =
						api.forent_url.maintenance_service_url + "/userAuth/userAuthLogin";
					let params = {
						loginName: this.accountInput,
						password: pwd,
						sysCode: "sys_maintenance_web",
						client: "WEB"
					};
					api.post(serverUrl, params, 30000).then(obj => {
						if(obj && obj.code == "success") {
							that.userInfo = obj["data"]
							let getOrgListByUserId =
								api.forent_url.maintenance_service_url +
								"/userAuth/getOrgListByUserId";
							let params1 = {
								userId: obj.data.id,
								sysCode: "sys_maintenance_web"
							};
							//根据用户id获取组织机构
							api.post(getOrgListByUserId, params1, 0).then(obj_1 => {
                				that.loading = false;
								if(obj_1 && obj_1["code"] == "success") {
									let data = obj_1["data"];
									// data = data.concat(data);
									// data.length = 3
									that.joinEnterpriseData = data;
									if(data && data.length > 0) {
										if(data.length == 1) {
											if(data[0].authStatus == "0") {
												this.joinSystem(data[0], obj.data);
											} else if(data[0].authStatus == "2") {
												GS.$Message.error("用户已经被锁定！");
											} else if(data[0].authStatus == "1") {
												GS.$Message.error("用户已经被注销！");
											}
										} else {
											//											that.$nextTick(function () {
											//										        that.joinEnterpriseData[0].isChecked=true;
											//												that.selectedEnterprises = that.joinEnterpriseData[0].id
											//										    })
											that.previewVisible = true;
											let maintenance_userObj = api.getGlobalVal("maintenance_userObj");
											for(let i = 0; i < data.length; i++) {
												if(maintenance_userObj && maintenance_userObj.orgCode == data[i].orgCode) {
													that.joinEnterpriseData[i].isChecked = true;
													that.selectedEnterprises = data[i].id
													//													break;
													// that.isChecked = true;
												} else {
													that.joinEnterpriseData[i].isChecked = false;
													// that.isChecked = false;
												}
											}
											if(!maintenance_userObj || !maintenance_userObj.orgCode) {
												that.joinEnterpriseData[0].isChecked = true;
												that.selectedEnterprises = that.joinEnterpriseData[0].id
											}
										}
									} else {
										this.$message.error("该账号没有在系统下授权！");
									}
								} else {
									this.$message.error("该账号没有在系统下授权！");
								}
							});
						} else {
              this.loading = false;
							this.$message.error(obj.message);
						}
					});
				}
			},
			joinSystem(orgInfo, userInfo) {
				let that = this;
				let serverUrl =
					api.forent_url.maintenance_service_url + "/userAuth/getIdByUserIdAndOrg";
				let params = {
					userId: userInfo.id,
					sysCode: "sys_maintenance_web",
					orgCode: orgInfo.orgCode
				};
				api.get(serverUrl, params, 0).then(obj => {
					if(obj && obj["code"] == "success") {
						let authorizedId = obj["data"].id || obj["data"];
						let headPortrait = obj["data"].headPortrait;
						let data = {
							id: authorizedId,
							userId: userInfo.id,
							name: userInfo.userName,
							loginName: userInfo.loginName,
							orgCode: orgInfo.orgCode,
							orgName: orgInfo.orgName,
							userToken: userInfo.userToken,
							authId: orgInfo.authId,
							headPortrait: headPortrait,
							sysCode_app: "sys_maintenance_app",
							sysCode_web: "sys_maintenance_web"
						};
						api.setGlobalVal("maintenance_userObj", JSON.stringify(data));
						api.setGlobalVal("userToken", data.userToken);
						api.setGlobalVal("CmenuName", JSON.stringify({
							lightMenu: "0"
						}));
						//维保埋点
						let urlGrowingIo = api.forent_url.maintenance_service_url + "/userInfo/getUserAboutInfoById";
						api.get(urlGrowingIo, {
							id: data.id
						}, 0).then(ret => {
							let retData = ret.data;
							gio('setUserId', data.id);
							gio('people.set', {
								"userName_ppl": retData.userName_ppl,
								"userPhone_ppl": retData.userPhone_ppl,
								"userRole_ppl": retData.userRole_ppl,
								"userUnitCity_ppl": retData.cityName_ppl,
								"subCenterName_ppl": retData.yyzxName_ppl,
								"userUnitName_ppl": retData.wbgsName_ppl,
								"unitUserNum_ppl": retData.wbzxUserNum_ppl,
								"userLoginName_ppl": retData.loginName_ppl
							})
						})
						//登陆index
						that.$router.push({
							name: "main-main",
							params: {
								ref: "login"
							}
						});
					} else {
						that.$message.error("获取授权id失败！");
					}
				});
			},
			joinEnterprise(data, userInfo) { //选择组织机构进入企业
				let that = this;
				// let val_payPlatform = $('#loginDiv input[name="radio"]:checked').val();
				// let val_payPlatform = $('#loginDiv li a').hasclass('checked').val();
				let obj;
				for(let j = 0; j < data.length; j++) {
					if(data[j].id == this.selectedEnterprises) {
						obj = data[j];
					}
				}
				if(this.selectedEnterprises) {
					if(obj.authStatus == "0") {
						that.joinSystem(obj, userInfo);
						that.previewVisible = false;
					} else if(obj.authStatus == "2") {
						Message.error("此账号已经被该组织机构锁定！");
					} else if(obj.authStatus == "1") {
						Message.error("此账号已经被该组织机构注销！");
					}
				} else {
					Message.error("请选择需要进入的组织机构");
				}
			}
		},

		mounted() {
			window.onresize = () => {
				//重置window.onresize的return
				return false;
			};
			$("#loginName").focus();
		}
	};
</script>
<style lang="scss" scoped>
	/deep/.el-input__inner {
		color: #fff;
	}

	// 选择企业开始
	/deep/.el-dialog {
		margin: 0 auto;
		border-radius: 0.05rem;
		position: absolute;
		top:50%;
		right:50%;
		transform: translate(50%,-50%);
		height:2.78rem;
		.el-dialog__header {
			background-color: #FF7B45 !important;
			padding: .15rem;
			height: .5rem;
			border-top-right-radius: 0.05rem;
			border-top-left-radius: 0.05rem;
			.el-dialog__title {
				color: #ffffff;
				font-size: 0.18rem;
				line-height: 0.18rem;
			}
			.el-dialog__headerbtn {
				top: .16rem;
			}
		}
		.el-dialog__body {
			padding: 0.3rem 0.2rem 0.2rem;
		}
		.unchecked {
			display: block;
			text-decoration: none;
			color: #828285;
			width: 100%;
			text-align: center;
			font-size: 0.18rem;
			background: rgba(245, 245, 245, 1);
			border-radius: 4px;
		}
		.checked {
			background: rgba(255, 241, 235, 1) !important;
			color: #FF7B45 !important;
		}
		#logo {
			position: absolute;
			top: -0.2rem;
			right: -0.22rem;
			width: 0.44rem;
			height: 0.4rem;
			background: rgba(255, 123, 69, 1);
			border-radius: 0.2rem;
			color: #fff;
		}
		.el-icon-check:before {
			position: absolute;
			top: 0.2rem;
			left: 0.04rem;
		}
	}

	.login-div {
		width: 100%;
		max-height: 1.98rem;
		overflow: auto;
		ul {
			list-style: none;
			margin: 0px;
			padding: 0px;
			li {
				height: 0.46rem;
				line-height: 0.46rem;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-bottom: 0.2rem;
				a {
					position: relative;
				}
			}
		}
	}

	.login-btn-dialog {
		text-align: center;
		width: 1.48rem;
		height: 0.36rem;
		background: rgba(255, 104, 34, 0);
		border: 1px solid rgba(255, 104, 34, 1);
		border-radius: 0.18rem;
		margin-top: 0.1rem;
	}

	.login-btn-dialog{
		color: #FF6822;
	}
	/*// 选择企业结束
	// #joinEnterprise span {
	// 	border: 0px;
	// 	color: #FF6822;
	// 	background-color: #ff951b;
	// 	height: 30px;
	// 	width: 100px;
	// 	display: inline-block;
	// 	text-align: center;
	// 	line-height: 30px;
	// 	font-size: 14px;
	// 	margin-top: 6px;
	// 	cursor: pointer;
	// }*/
	/*插入背景图*/

	.main {
		background: url(../assets/img/Overalllayout/loginTwo.jpg) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		height: 100%;
		width: 100%;
		/*padding-top: 5%;*/
	}
	/*版权文字*/

	.copyright {
		font-size: 14px;
		line-height: 14px;
		color: #bababd;
		position: absolute;
		bottom: 10px;
		left: 32px;
		a {
			color: #bababd;
			text-decoration: none;
		}
	}

	.wb-login-header {
		padding: 23px 0 0 30px;
		img {
			height: .5rem;
			width: 2.91rem;
		}
	}

	.wb-login-middle {
		position: absolute;
		left: 1.38rem;
		top: 1.87rem;
		height: 5.79rem;
		width: 9.41rem;
		img {
			height: 100%;
			width: 100%;
		}
	}
	/*登录框*/

	.login-main {
		width: 5.02rem;
		height: 5.5rem;
		border-radius: .1rem;
		background: #1e2037;
		position: fixed;
		transform: translateY(-50%);
		top: 50%;
		right: 5%;
		.img {
			position: absolute;
			top: -.58rem;
			left: 40%;
			width: .94rem;
			height: 1.14rem;
			display: inline-block;
			img {
				display: inline-block;
				width: 100%;
				height: 100%;
			}
		}
		.login {
			width: 100%;
			text-align: center;
			line-height: .35rem;
			vertical-align: middle;
		}
		.login-wrap {
			display: inline-block;
			position: relative;
			width: 3.74rem;
			height: .6rem;
			border-bottom: 1px solid #43455b;
			margin-bottom: .4rem;
		}
		.login-wrap .login-ipt-icon {
			width: .18rem;
			height: .21rem;
			position: absolute;
			top: .18rem;
			left: 0;
			font-size: .2rem;
		}
		.login-ipt-icon i {
			display: inline-block;
			width: .18rem;
			height: .22rem;
			color: #fff;
		}
		.el-input {
			background: #1e2037;
			margin: 0;
			width: 3rem;
			margin-top: .15rem;
			border: none;
		}
		.el-input /deep/ .el-input__inner {
			background: #1e2037;
			border: none;
		}
		.system {
			margin: .95rem 0 .6rem 0;
			width: 100%;
			height: .36rem;
			line-height: .36rem;
			color: #fff;
			text-align: center;
		}
		span {
			font-size: .36rem;
		}
	}

	.el-row {
		text-align: center;
		margin-top: 20px;
	}

	#btn {
		display: inline-block;
		width: 3.76rem;
		height: .70rem;
		background: #ff7b45;
		line-height: .35rem;
		border-radius: .35rem;
		text-align: center;
		color: #fff;
		font-size: .2rem;
	}
</style>
