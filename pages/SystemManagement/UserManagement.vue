<template>
	<el-row class="content-main">
		<el-row class="l-head headTitle" type="flex" justify="space-between" align="middle">
			<el-col :span="6">
				<!-- 面包屑 -->
				<Title />
			</el-col>
			<el-col :span="1" v-if="false">
				<el-button onclick="window.history.back()" class="goBack" type="text" icon="maintenance-back1">返回</el-button>
			</el-col>
		</el-row>
		<el-tabs v-model="activeName" @tab-click="handleClick" class="table-listNoFilter">
			<el-row type="flex" justify="space-between" align="middle" class="operationCon pdl-30px" style="background-color: #fff;">
				<el-col :span="4">
					<el-input type="text" @clear="initTable" @change="initTable" clearable class="enterprise-name-search flex1" name="userName" v-model="role" :maxlength="20" placeholder="请输入人员名称" suffix-icon="el-icon-search"></el-input>
				</el-col>
				<el-col :span="2" v-if="activeName ==='1'">
					<div class="div-flex all_center">
						<el-button class="searchBtn fs14px button-radiusb add-btn" type="info" @click="addUser()"><b class="el-icon-plus"></b>新增</el-button>
					</div>
				</el-col>
			</el-row>
			<el-tab-pane label="活跃用户" name="1" :value="1">
				<Table class="tableOne" ref="tableOne" :tableList="dataList1" :options="options" :columns="columns1" :operates="operates1" :url="requestUrlOne" @rowClick="rowClick"></Table>
			</el-tab-pane>
			<el-tab-pane label="注销用户" name="2" :value="2" class="tableTwo">
				<Table ref="tableTwo" :tableList="dataList2" :options="options" :columns="columns1" :operates="operates1" :url="requestUrlOne"></Table>
			</el-tab-pane>
		</el-tabs>

	</el-row>
</template>
<script>
	import api from "~/config/http";
	import Title from "~/components/Title";
	import Table from "~/components/Table";
	import { Message, MessageBox } from "element-ui";
	import mixin from "~/mixin/mixin";
	export default {
		mixins: [mixin],
		components: {
			Title,
			Table
		},
		data() {
			return {
				userInfo: api.getGlobalVal("maintenance_userObj"), //获取用户信息
				activeName: "1",
				role: "",

				options: {
					stripe: true, // 是否为斑马纹 table
					loading: true, // 是否添加表格loading加载动画
					highlightCurrentRow: true, // 是否支持当前行高亮显示
					mutiSelect: false, // 是否支持列表项选中功能
					isShowSerialNumber: true, //是否展示序号
				},
				requestUrlOne: api.forent_url.maintenance_service_url + "/userAuth/getUserList",
				dataList1: [],
				dataList2: [],
				columns1: [{
						prop: "userName",
						label: "姓名",
						align: "center",
						minWidth: "5%"
					},
					{
						prop: "loginName",
						label: "用户名",
						align: "center",
						minWidth: "8%"
					},
					{
						prop: "userSex",
						label: "性别",
						align: "center",
						minWidth: "5%",
						formatter: (row, column, cellValue) => {
							var sex;
							sex = row.userSex == "0" ? "男" : row.userSex == "1" ? "女" : row.userSex == "2" ? "其他" : "";
				           return `<span>${sex}</span>`;
				        }
					},
					{
						prop: "userTelphone",
						label: "电话",
						align: "center",
						minWidth: "10%"
					},
					{
						prop: "createTime",
						label: "创建时间",
						align: "center",
						minWidth: "15%"
					},
					{
						prop: "userAuthStatusName",
						label: "状态",
						align: "center",
						minWidth: "5%"
					}
				], // 活跃用户需要展示的列
				operates1: {
					widthMin: "10%",
					fixed: "right",
					list: [{
							title: "已锁定",
							type: "text",
							show: (index, row) => {
								return row.userAuthStatus == "2";
							},
							icon: "maintenance-lock",
							plain: false,
							disabled: false,
							method: (index, row) => {
								this.handleLock(index, row,"2");
							}
						},
						{
							title: "锁定",
							type: "text",
							icon: "maintenance-unlock",
							show: (index, row) => {
								return row.userAuthStatus == "0";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
									this.handleLock(index, row,"1");
							}
						},
						{
							title: "注销",
							type: "text",
							icon: "maintenance-exit",
							show: (index, row) => {
								return row.userAuthStatus == "0" || row.userAuthStatus == "2";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								this.logoutOrRestore(index, row, "1")
							}
						},
						{
							title: "还原",
							type: "text",
							icon: "maintenance-backSolid",
							show: (index, row) => {
								return row.userAuthStatus == "1";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								this.logoutOrRestore(index, row, "2")
							}
						},
						{
							title: "重置",
							type: "text",
							icon: "maintenance-reset",
							show: (index, row) => {
								return row.userAuthStatus == "0" || row.userAuthStatus == "2";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								this.passwordReset(index, row);
							}
						},
					]
				},
			}
		},
		methods: {
			initTable(){
				let orgCode = this.userInfo.orgCode,
				sysCode = this.userInfo.sysCode_web;
				let params = {
					orgCode: orgCode,
					sysCode: sysCode,
					userState: this.activeName,
					userName:this.role
				}
				if(this.activeName == '1') {
					this.$refs.tableOne.queryTableListByParams(params);
				} else {
					this.$refs.tableTwo.queryTableListByParams(params);
				}
			},
			addUser(){//添加用户
				var that = this;
//				sessionStorage.setItem("userInfo", JSON.stringify(that.userInfo));//保存回显信息
				that.$router.push({
					name: 'SystemManagement-UserManagementControl-addUser',
					params: {

					}
				})
			},
			// 选中行
			rowClick(obj) {
				let _this = this;
				//详情页面包屑
			    let paramCrumb = {
			    name: "用户管理详情",//title name
		            parName: "用户管理",//父级title name
		            lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
		            linkname: "SystemManagement-UserManagementControl-userInformation",
		            path: "SystemManagement-UserManagementControl-userInformation"
			    };
			    _this.setDetailBreadcrumb(paramCrumb,true);
			    //详情页面包屑 end
				if(obj.column.label != "操作") {
					if(obj.row) {
							_this.$router.push({
								name: 'SystemManagement-UserManagementControl-userInformation',
								params: {
									userId: obj.row.id
								}
							})
					}
				}
			},
			handleClick() {
				let that = this;
				let orgCode = this.userInfo.orgCode,
					sysCode = this.userInfo.sysCode_web;
					this.role = "";
				let params = {
					orgCode: orgCode,
					sysCode: sysCode,
					userState: this.activeName,
					userName:this.role
				}
				that.$nextTick(function() {
					if(this.activeName == '1') {
						this.$refs.tableOne.queryTableListByParams(params);
					} else {
						this.$refs.tableTwo.queryTableListByParams(params);
					}
				})

			},
			// 锁定or解锁
			handleLock(index, row, types) { //		types : 1 是锁定,2是解锁
				let con, title,messageSuccess,messageFailed,catchMessgae, that = this;
				if(types == "1") {
					title = "锁定用户";
					con = '用户锁定后，将无法登录系统，确定执行该操作么?';
					messageSuccess = "用户已锁定";
					messageFailed = "用户锁定失败";
					catchMessgae = "已取消锁定"
				} else {
					title = "解锁用户"
					con = '用户解锁后,该用户可以登录系统,确定执行该操作吗?'
					messageSuccess = "用户已解锁";
					messageFailed = "用户解锁失败";
					catchMessgae = "已取消解锁"
				}
				this.$confirm(con, title, {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let serviceUrl =
							api.forent_url.maintenance_service_url +
							"/userAuth/lockUserByUserId";
						api.post(serviceUrl, {
							userId: row.id,
							state: types,
							orgCode: that.userInfo.orgCode,
							lockUserId: that.userInfo.id,
							sysCode: that.userInfo.sysCode_web + "," + that.userInfo.sysCode_app
						}).then(res => {
							if(res && res["code"] == "success") {
								this.$message({
									type: "success",
									message: messageSuccess
								});
								this.$refs.tableOne.queryTableList();
							} else {
								this.$message({
									type: "warning",
									message: messageFailed
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: catchMessgae
						});
					});
			},
			// 注销or还原
			logoutOrRestore(index, row, types) { //		//types : 1 是注销,2是还原
				let con, title,messageSuccess,messageFailed,catchMessgae, that = this;
				if(types == "1") {
					title = "注销用户";
					con = '用户注销后，该用户将无法登陆系统，但是历史维保记录不会消失，请谨慎操作。确认执行该操作么?';
					messageSuccess = "用户已注销";
					messageFailed = "用户注销失败";
					catchMessgae = "已取消注销"
				} else {
					title = "还原用户"
					con = '用户还原后，用户将恢复到注销前的状态，确定执行该操作么?'
					messageSuccess = "用户已还原";
					messageFailed = "用户还原失败";
					catchMessgae = "已取消还原"
				}
				this.$confirm(con, title, {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let serviceUrl =
							api.forent_url.maintenance_service_url +
							"/userAuth/cancelUserByUserIdAndSysCode";
						api.post(serviceUrl, {
							userId: row.id,
							state: types,
							orgCode: that.userInfo.orgCode,
							cancelUserId: that.userInfo.id,
							sysCode: that.userInfo.sysCode_web + "," + that.userInfo.sysCode_app
						}).then(res => {
							if(res && res["code"] == "success") {
								this.$message({
									type: "success",
									message: messageSuccess
								});
								if(types == "1"){
									this.$refs.tableOne.queryTableList();
								}else{
									this.$refs.tableTwo.queryTableList();
								}

							} else {
								this.$message({
									type: "warning",
									message: messageFailed
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: catchMessgae
						});
					});
			},
			// 密码重置
			passwordReset(index, row) { //		types : 1 是锁定,2是解锁
				let con, title,messageSuccess,messageFailed,catchMessgae, that = this;
					title = "重置密码"
					con = '确定要重置密码么?'
					messageSuccess = "重置成功,重置后密码为";
					messageFailed = "密码重置失败";
					catchMessgae = "已取消重置密码"
				this.$confirm(con, title, {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						let serviceUrl =
							api.forent_url.maintenance_service_url +
							"/userAuth/resetPasswordByUserId";
						api.post(serviceUrl, {
							userId: row.id,
						}).then(res => {
							if(res && res["code"] == "success") {
								this.$message({
									type: "success",
									message: messageSuccess + res["data"]
								});
								this.$refs.tableOne.queryTableList();
							} else {
								this.$message({
									type: "warning",
									message: messageFailed
								});
							}
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: catchMessgae
						});
					});
			},

		},
		mounted() {
			this.initTable();
		}
	}
</script>
<style lang="scss" scoped>
	.table-listNoFilter {
		height: calc(100% - .7rem);
		/deep/.el-tabs__nav-wrap{
			height:.5rem;
		}
		/deep/.el-tabs__content {
			height: calc(100% - .5rem);
		}
		/deep/.el-tab-pane {
			height: calc(100% - .6rem);
			background-color: #fff;
		}
		/deep/.el-icon-search {
			cursor: pointer;
		}
		/deep/.el-tabs__header {
			background-color: #fff;
			margin: 0;
		}
		/deep/.el-tabs__nav {
			margin-left: 0.3rem;
		}
		.table{
			height:calc(100% - .55rem);
		}
		.tableOne{
			/deep/.el-table__row{
				cursor: pointer;
			}
		}
		/deep/.el-input__suffix-inner {
			cursor: pointer;
		}
	}
</style>
