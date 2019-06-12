<template>
	<el-row class="content-main">
		<el-row class="l-head headTitle" type="flex" justify="space-between" align="middle">
			<el-col :span="8">
				<!-- 面包屑 -->
				<Title />
			</el-col>
			<el-col :span="1">
				<el-button @click="goBack()" class="goBack" type="text" icon="maintenance-back1">返回</el-button>
			</el-col>
		</el-row>
		<el-row class="detailCon bg-white">
			<el-row class="detailConM">
				<el-row type="flex" justify="space-between" align="middle" class="detailTitle">
					<el-col :span="2" class='div-flex align_center fs20px pdl-15px'>查看详情</el-col>
					<el-col :span="2" class='div-flex all_center'>
						<el-button @click="edit()" class="wb-edit fs18px" type="text" icon="el-icon-edit-outline">编辑</el-button><!--maintenance-edit-->
					</el-col>
				</el-row>
				<el-row class="detailInfo">
					<el-row class="fs16px">
						<el-col :span="12" class='div-flex all_center'>
							<label class=""><span>手</span><span>机</span><span>号 :</span></label>
							<el-col class="flex1">
								{{userInfo.userTelphone}}
							</el-col>
						</el-col>
						<el-col :span="12" class='div-flex all_center'>
							<label><span>用</span><span>户</span><span>名 :</span></label>
							<el-col class="flex1">
								{{userInfo.loginName}}
							</el-col>
						</el-col>
					</el-row>
					<el-row class="fs16px">
						<el-col :span="12" class='div-flex all_center'>
							<label class=""><span>密</span><span>码 :</span></label>
							<el-col class="flex1">
								********
							</el-col>
						</el-col>
						<el-col :span="12" class='div-flex all_center'>
							<label><span>姓</span><span>名 :</span></label>
							<el-col class="flex1">
								{{userInfo.userName}}
							</el-col>
						</el-col>
					</el-row>
					<el-row class="fs16px">
						<el-col :span="12" class='div-flex all_center'>
							<label class=""><span>性</span><span>别 :</span></label>
							<el-col class="flex1">
								{{userInfo.userSex}}
							</el-col>
						</el-col>
						<el-col :span="12" class='div-flex all_center'>
							<label><span>身</span><span>份</span><span>证</span><span>号 :</span></label>
							<el-col class="flex1">
								{{userInfo.userCardNo}}
							</el-col>
						</el-col>
					</el-row>
					<el-row class="fs16px">
						<el-col :span="12" class='div-flex all_center'>
							<label class=""><span>年</span><span>龄 :</span></label>
							<el-col class="flex1">
								{{userInfo.age}}
							</el-col>
						</el-col>
						<el-col :span="12" class='div-flex all_center'>
							<label><span>角</span><span>色 :</span></label>
							<el-col class="flex1">
								{{userInfo.roleNames}}
							</el-col>
						</el-col>
					</el-row>
					<el-row class="fs16px">
						<el-col :span="12" class='div-flex all_center'>
							<label class=""><span>岗</span><span>位 :</span></label>
							<el-col class="flex1">
								{{userInfo.positionName}}
							</el-col>
						</el-col>
					</el-row>
					
				</el-row>
			</el-row>
		</el-row>

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
				IDinfo: api.getGlobalVal("maintenance_userObj"), //用户信息
				userInfo: {//账号信息
					userEdit: "edit",
					userId: '',
					roleids: "",
					roleList: [],
					userTelphone:"",
					loginName:"",
					userName:"",
					userSex:"",
					userCardNo:"",
					age:"",
					roleNames:"",
					positionName:""
				},
			}
		},
		methods: {
			initData(){//初始化数据
				let userId = this.$route.params.userId,that = this;
				that.userInfo.userId = userId;
				api.post(
					api.forent_url.maintenance_service_url + "/userAuth/findUserByUserId", {
						userId: userId,
					}
				).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"];
						$.extend(true,that.userInfo,data);
						that.userInfo.userSex = data.userSex == "0" ? "男" : data.userSex == "1" ? "女" : "未知"
					} else {
						Message.error(res.message);
					}
				})
				.catch(function(err) {
					Message.error(err);
				});
				api.post(//角色
					api.forent_url.maintenance_service_url + "/userAuth/findRoleListByUserId", {
						userId: userId,
						orgCode: that.IDinfo.orgCode,
						sysCode: that.IDinfo.sysCode_web + "," + that.IDinfo.sysCode_app
					}
				).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"];
						if(data.length > 0) {
							var roleNames = ""
							data.forEach(function(item, index) {
								var arr = item.roleName.split(",");
								if(arr.length > 0 && arr[0]) {
									for(var i = 0; i < arr.length; i++) {
										if(item.sysCode == that.IDinfo.sysCode_web) {
											if(roleNames) {
												roleNames = roleNames + ",web-" + arr[i];
											} else {
												roleNames = "web-" + arr[i];
											}
										} else {
											if(roleNames) {
												roleNames = roleNames + ",app-" + arr[i];
											} else {
												roleNames = "app-" + arr[i];
											}
										}
									}
								}
								if(!that.userInfo.roleids) {
									that.userInfo.roleids = item.roleIds
								} else {
									that.userInfo.roleids = that.userInfo.roleids + "," + item.roleIds;
								}
							})
							that.userInfo.roleNames = roleNames;
						}
						
					} else {
						Message.error(res.message);
					}
				})
				.catch(function(err) {
					Message.error(err);
				});
				api.post(//岗位
					api.forent_url.maintenance_service_url + "/userAuth/findPostListByUserId", {
						userId: userId,
						orgCode: that.IDinfo.orgCode,
						sysCode: that.IDinfo.sysCode_web + "," + that.IDinfo.sysCode_app
					}
				).then(function(res) {
					let code = res["code"];
					if(code == "success") {
						let data = res["data"];
						if(data) {
							that.userInfo.positionName = data[0].positionName;
							that.userInfo.positionId = data[0].positionId;
						}
					} else {
						Message.error(res.message);
					}
				})
				.catch(function(err) {
					Message.error(err);
				});
			},
			edit(){
				var that = this;
				sessionStorage.setItem("userInfo", JSON.stringify(that.userInfo));//保存回显信息
				that.$router.push({
					name: 'SystemManagement-UserManagement-addUser',
					params: {
						
					}
				})
			},
			goBack(){
				this.delKeepAlive();//
				this.$router.push({
					name: 'SystemManagement-UserManagement',
					params: {
						
					}
				})
			}
			
		},
		mounted() {
			
		},
		created(){
			this.initData();
		}
	}
</script>
<style lang="scss" scoped>
	.detailCon{
		.pdl-15px{
			padding-left: .15rem;
		}
		height:calc(100% - .7rem);
		padding:15px;
		.detailConM{
			height:100%;
			box-shadow:0px 1px 1px 0px rgba(0, 0, 0, 0.05);
		}
		.detailTitle{
			height:.5rem;
			background-color:rgba(150,150,150,.08);
			color:#677089;
			.wb-edit{
				color:#5F687F;
				&:hover{
					color:#409EFF;
				}
			}
		}
		.detailInfo{
			height:calc(100% - .5rem);
			padding:15px;
			label{
				color:#999999;
				margin-right:.1rem;
				display: flex;
				justify-content: space-between;
				width:.8rem;
			}
			/deep/.el-col{
				color: #454545;
			}
			/deep/.el-row{
				line-height: 3.5;
			}
		}
	}
</style>