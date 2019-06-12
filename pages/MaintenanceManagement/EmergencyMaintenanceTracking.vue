<template>

	<el-row class="contract-main">
		<!-- 面包屑 -->
		<el-row class="l-head" type="flex" justify="space-between" align="middle">
			<el-col :span="12">
				<!-- 面包屑 -->
				<Title/>
			</el-col>
			<el-col :span="1" v-if="disableds">
				<el-button class="goBack" type="text" icon="maintenance-back1" @click="goBack()">返回</el-button>
			</el-col>
		</el-row>

		<div class="switch-tabs-div switch_tab">
      <el-tabs class="switch-tabs" v-model="activeName" @tab-click="handleClick">
        <!-- 业主申请 -->
        <el-tab-pane class="switch-tab-pane" label="业主申请" name="first">

					<!-- 搜索栏 -->
					<el-row type="flex" class="row-bg emergency-operation-head bg-white" justify="space-around" align="middle">
						<el-col :span="4">
							<div class="div-flex">
								<span class="fs18px colorLabel">
									维保人员：
								</span>
								<el-select v-model="userName" @change="searchFilter()" :disabled="canSelectUser" clearable placeholder="请选择" class="flex1">
									<el-option v-for="(item, index) in userNameOptions" :key="index" :label="item.label" :title="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="4">
							<div class="div-flex">
								<span class="fs18px colorLabel">
									服务状态：
								</span>
								<el-select v-model="serviceState" @change="searchFilter()" clearable placeholder="请选择" class="flex1" :disabled="canSelectState">
									<el-option v-for="(item, index) in serviceStateOptions" :key="index" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="4">
							<div class="div-flex">
								<span class="fs18px colorLabel">
									服务及时性：
								</span>
								<el-select v-model="isOverdue" @change="searchFilter()" clearable placeholder="请选择" class="flex1" :disabled="canSelectIsOverdue">
									<el-option v-for="(item, index) in isOverdueOptions" :key="index" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="div-flex">
								<span class="fs18px colorLabel">
									申请时间：
								</span>
								<el-date-picker v-model="dataPicker" @change="searchFilter()" type="daterange" :disabled="canSelectTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="flex1">
								</el-date-picker>
							</div>
						</el-col>
						<el-col :span="3">
							<div class="div-flex">
								<el-input class="enterprise-name-search flex1"  @clear="searchFilter()" @change="searchFilter()" suffix-icon="el-icon-search" v-model="proprietorName" placeholder="请输入企业名称" clearable="clearable"></el-input>
							</div>
						</el-col>
					</el-row>
					<!-- 表格 -->
					<el-row class="table-list">
						<Table ref="tableFirst" :tableList="dataList" :options="options" :columns="columnsFirst" :operates="operatesFirst" :url="requestUrlFirst" @rowClick="rowClick"></Table>
					</el-row>
				</el-tab-pane>
				<!-- 预测维保 -->
        <el-tab-pane class="switch-tab-pane" label="预测维保" name="second">
					<!-- 搜索栏 -->
					<el-row type="flex" class="row-bg emergency-operation-head bg-white" justify="space-around" align="middle">
						<el-col :span="4">
							<div class="div-flex">
								<span class="fs18px colorLabel">
									维保人员：
								</span>
								<el-select v-model="userName" @change="searchFilter()" :disabled="canSelectUser" clearable placeholder="请选择" class="flex1 userName">
									<el-option v-for="(item, index) in userNameOptions" :title="item.label" :key="index" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="4" :offset="1">
							<div class="div-flex">
								<span class="fs18px colorLabel">
									服务状态：
								</span>
								<el-select v-model="serviceState" @change="searchFilter()" clearable placeholder="请选择" class="flex1 serviceState" :disabled="canSelectState">
									<el-option v-for="(item, index) in serviceStateOptions" :key="index" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</el-col>
						<el-col :span="6" :offset="1">
							<div class="div-flex">
								<span class="fs18px colorLabel">
									申请时间：
								</span>
								<el-date-picker v-model="dataPicker" @change="searchFilter()" type="daterange" :disabled="canSelectTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="flex1">
								</el-date-picker>
							</div>
						</el-col>
						<el-col :span="3" :offset="1">
							<div class="div-flex">
								<el-input class="enterprise-name-search flex1" @clear="searchFilter()" @change="searchFilter()" suffix-icon="el-icon-search" v-model="proprietorName" placeholder="请输入企业名称" clearable="clearable"></el-input>
							</div>
						</el-col>
					</el-row>
					<!-- 表格 -->
					<el-row class="table-list">
						<Table ref="tableSecond" :tableList="dataList" :options="options" :columns="columnsSecond" :operates="operatesSecond" :url="requestUrlSecond" @rowClick="rowClick"></Table>
					</el-row>
				</el-tab-pane>
				<!-- 中心指派 -->
        <!-- <el-tab-pane class="switch-tab-pane" label="中心指派" name="third">
				</el-tab-pane> -->
			</el-tabs>

			<!-- 预览弹框 -->
			<el-dialog id="previewDialog" top="'0'" title="预览" :visible.sync="previewVisible" :close-on-click-modal="false" width="50%" v-dialogDrag>
				<iframe frameborder="0" id="word_href" :src="previewSrc"></iframe>
			</el-dialog>
      <!-- 分配维保人员弹框 -->
      <div v-if="distributivePersonnelObj.dialogFormVisible">
        <DistributivePersonnel
          ref="distributivePersonnel"
          :title="distributivePersonnelObj.title"
          :pageName="distributivePersonnelObj.pageName"
          :queryUserListUrl="distributivePersonnelObj.queryUserListUrl"
          :updateUserUrl="distributivePersonnelObj.updateUserUrl"
          @closeDistributivePersonnelDialog="closeDistributivePersonnelDialog"
          @distributivePersonnel = "distributivePersonnel"
        >
        </DistributivePersonnel>
      </div>
		</div>
	</el-row>

</template>
<script>
	import api from "~/config/http";
	import Title from "~/components/Title";
	import Table from "~/components/Table";
  	import { Message, MessageBox } from "element-ui";
  	import DistributivePersonnel from "~/components/DistributivePersonnelDialog";
  	import mixin from "~/mixin/mixin";
	export default {
		mixins: [mixin],
		components: {
			Title,
      Table,
      DistributivePersonnel
		},
		data() {
			return {
				orgId: "",
				isDispatched: "",//当前更新的状态 0下发 1改派
				pageParams: {},
				activeName: "first",
				tabName: '',
				disableds:false,
				canSelectUser:false,//状态可选性
				canSelectState:false,
				canSelectIsOverdue:false,//逾期可选性
				canSelectTime:false,//时间可选性
				userInfo: api.getGlobalVal("maintenance_userObj"), //获取用户信息
				previewSrc: '',//预览
				previewVisible: false,
				userName:"",//维保人员
				isOverdue:"",//服务及时性
				isOverdues: "",
				serviceState:"",//服务状态
				proprietorName:"",//企业名称
				dataPicker: '',  // 时间数据
				state:"",
				states: "",
				startApplicantTime: "",
				endApplicantTime: "",
				userNameOptions:[
					{
						value: "",
						label: "请选择"
					}
				], // 维保人员下拉选项
				dataList:[], // table数据,
				serviceStateOptions:[
					{
						value: "",
						label: "请选择"
					}, {
						value: "0",
						label: "待处理"
					}, {
						value: "1",
						label: "处理中"
					}, {
						value: "3",
						label: "待确认"
					}, {
						value: "4",
						label: "已完成"
					}
				],// 服务状态下拉选项
				isOverdueOptions: [
					{
						value: "",
						label: "请选择"
					}, {
						value: "0",
						label: "正常"
					}, {
						value: "1",
						label: "已逾期"
					}
        ],// 服务及时性下拉选项
        //分配人员信息
        distributivePersonnelObj:{
          dialogFormVisible: false,
          title:"分配人员",
          pageName:"emergency",
          queryUserListUrl:api.forent_url.maintenance_service_url +"/maintenance/getUserList",
          updateUserUrl:api.forent_url.maintenance_service_url + "/maintenance/reassigMaintenanceOrder"
        },
        //分配人员信息结束
				options: {
					stripe: true, // 是否为斑马纹 table
					loading: true, // 是否添加表格loading加载动画
					highlightCurrentRow: true, // 是否支持当前行高亮显示
					mutiSelect: false, // 是否支持列表项选中功能
					isShowSerialNumber:true,//是否展示序号
				}, // table 的参数
				requestUrlFirst: api.forent_url.maintenance_service_url + "/maintenance/getEmergencyTrackList",
				requestUrlSecond: api.forent_url.maintenance_service_url + "/maintenance/getPredictionEmergencyTrackList",
				columnsFirst: [
					{
						prop: "proprietorName",
						label: "业主单位",
						align: "center",
						minWidth: "25%"
					},
					{
						prop: "isOverdue",
						label: "服务及时性",
						align: "center",
						minWidth: "8%"
					},
					{
						prop: "overdueMinutes",
						label: "逾期时间",
						align: "center",
						minWidth: "9%"
					},
					{
						prop: "userNames",
						label: "维保人员",
						align: "center",
						minWidth: "20%"
					},
					{
						prop: "stateName",
						label: "服务状态",
						align: "center",
						minWidth: "8%"
					},
					{
						prop: "applicantTime",
						label: "申请时间",
						align: "center",
						minWidth: "15%"
					}
				], // 业主申请需要展示的列
				columnsSecond: [
					{
						prop: "proprietorName",
						label: "业主单位",
						align: "center",
						minWidth: "25%"
					},
					{
						prop: "userNames",
						label: "维保人员",
						align: "center",
						minWidth: "25%"
					},
					{
						prop: "stateName",
						label: "服务状态",
						align: "center",
						minWidth: "15%"
					},
					{
						prop: "applicantTime",
						label: "申请时间",
						align: "center",
						minWidth: "25%"
					}
				], // 预测维保需要展示的列
				operatesFirst: {
					columnName: '操作',
					widthMin: "7%",
					fixed: "right",
					list: [{
							title: "生成报告",
							type: "text",
							show: (index, row) => {
								return row.serviceState >= "3";
							},
							icon: "maintenance-download",
							plain: false,
							disabled: false,
							method: (index, row) => {
								this.downloadBtn(index, row);
							}
						},
						{
							title: "预览",
							type: "text",
							icon: "el-icon-view",
							show: (index, row) => {
								return row.serviceState >= "3";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								this.previewTheReport(index, row);
							}
						},
						{
							title: "分配人员",
							type: "text",
							icon: "maintenance-peopleManagement",
							show: (index, row) => {
								return row.isDispatched == '0' && row.serviceState != "3" && row.serviceState != "4";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								//展示分配人员列表 下发
								this.isDispatched = "0";
								this.openPersonnelList(row);
							}
						},
						{
							title: "改派人员",
							type: "text",
							icon: "maintenance-reassignment",
							show: (index, row) => {
								return row.isDispatched == '1' && row.serviceState != "3" && row.serviceState != "4";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								//展示分配人员列表 改派
								this.isDispatched = "1";
								this.openPersonnelList(row);
							}
						}
					]
				}, // 业主申请操作按钮
				operatesSecond: {
					columnName: '操作',
					widthMin: "10%",
					fixed: "right",
					list: [{
							title: "生成报告",
							type: "text",
							show: (index, row) => {
								return row.serviceState >= "3";
							},
							icon: "maintenance-download",
							plain: false,
							disabled: false,
							method: (index, row) => {
								this.downloadBtn(index, row);
							}
						},
						{
							title: "预览",
							type: "text",
							icon: "el-icon-view",
							show: (index, row) => {
								return row.serviceState >= "3";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								this.previewTheReport(index, row);
							}
						},
						{
							title: "分配人员",
							type: "text",
							icon: "maintenance-peopleManagement",
							show: (index, row) => {
								return row.isDispatched == '0' && row.serviceState != "3" && row.serviceState != "4";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								//展示分配人员列表 下发
								this.isDispatched = "0";
								this.openPersonnelList(row);
							}
						},
						{
							title: "改派人员",
							type: "text",
							icon: "maintenance-reassignment",
							show: (index, row) => {
								return row.isDispatched == '1' && row.serviceState != "3" && row.serviceState != "4";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								//展示分配人员列表 下发
								this.isDispatched = "1";
								this.openPersonnelList(row);
							}
						}
					]
				}, // 预测维保操作按钮
			}
		},
		methods: {
			// 切换tab
			handleClick(tab, event) {
				this.tabName = this.activeName;
				if (tab.name == "first") {
					//业主申请
					this.searchFilter();
				} else if (tab.name == "second") {
					//预测维保
					this.searchFilter();
					setTimeout(function() {
						$(".serviceState input").css('height', $(".el-input__inner").height() + 'px');
						$(".userName input").css('height', $(".el-input__inner").height() + 'px');
					})
				} else if (tab.name == "third") {
					//中心指派
				}
			},
			//下载
			downloadBtn(index, row) {
				window.location.href = api.forent_url.maintenance_service_url + "/maintenance/exportEmergencyWord?type=0&id=" + row.orderId;
			},
			goBack(){//返回
				let name;
				if(this.$route.params.flag){
					api.setGlobalVal(
				        "CmenuName",
				        JSON.stringify({
				          name: "首页",
				          parName: "首页",
				          lightMenu: "0"
				        })
				    );
				    name="main-main"
				}else if(this.$route.params.isEmergency){
					api.setGlobalVal(
						"CmenuName",
						JSON.stringify({
							name: "维保单位信息",
							parName: "维保人员信息",
							lightMenu: "1-1"
						})
					);
					name = "MaintenanceUnitInformation-MaintenancePersonnelInformation"
				}
				this.$router.push({
			        name: name,
			        params: {

			        }
		        });
      },
      //改派-下发
      openPersonnelList(row){
        //展示分配人员列表
        this.distributivePersonnelObj.dialogFormVisible = true;
        let _this = this;
        setTimeout(function(){
          _this.$refs.distributivePersonnel.openPersonnelList(row);
        })
      },
      //分配人员之后的回调
      distributivePersonnel(){
				//to do 刷新列表
				this.searchFilter();
      },
      //关闭分配人员弹框
      closeDistributivePersonnelDialog(){
				this.distributivePersonnelObj.dialogFormVisible = false;
      },
			//预览报告
			previewTheReport(index, row) {
				localStorage.setItem('show_pre', '');
				let that = this;
				api.get(
						api.forent_url.maintenance_service_url + "/maintenance/previewEmergencyWord", {
							id: row.orderId,
							type: '0'
						}
					).then(function(res) {
						let code = res["code"];
						if(code == "success") {
							let data = res["data"];
							that.previewVisible = true;
							setTimeout(function() {
								that.previewSrc = api.forent_url.image_url + res.data;
							})
						} else {
							this.$message.error(res.message);
						}
					})
					.catch(function(err) {
						this.$message.error(err);
					});
			},
			 // 获取维保人员下拉选项
			getUserNameOptions () {
				let _this=this,url;
				return new Promise(function(resolve,reject){
					if(_this.$route.params.flag){
						_this.disableds=true
					};
					api.get(api.forent_url.maintenance_service_url + "/userInfo/getUsersByorgId", {
						id: api.getGlobalVal("maintenance_userObj").orgCode,
						orgId: api.getGlobalVal("maintenance_userObj").orgCode,
						startApplicantTime: '',
						endApplicantTime: '',
						userId: '',
						proprietorName: ''
					}).then(res=>{
						if (res.code === 'success') {
							res.data.forEach(element=>{
								_this.userNameOptions.push({
									value: element.userId,
									label: element.name
								})
							})
						}
						resolve()
					})
				})

			},
			// 搜索过滤数据
			searchFilter() {
				let _this = this;
				let params = {};
				params.id = _this.userInfo.orgCode;
				params.orgId = _this.userInfo.orgCode;
				params.userId = '';
				params.userIds = _this.userName;
				params.state = _this.serviceState;
				params.isOverdue = _this.isOverdue;
				params.proprietorName = _this.proprietorName;
				if(_this.$route.params.menuName === "overdueUncompleted"){
					_this.serviceState = "未完成";
					_this.isOverdue = "已逾期";
					params.state = _this.states = "0,1"
					params.isOverdue = _this.isOverdues = "1"
					_this.canSelectIsOverdue = true;
					_this.canSelectState = true;
				}else if(_this.$route.params.menuName === "uncompletedToday"){
					_this.canSelectIsOverdue = false;
					_this.canSelectTime = true;
					_this.canSelectState = true;
					_this.serviceState = "未完成";
					params.state = _this.states = "0,1";
					params.isOverdue = _this.isOverdues = "1";
					params.startApplicantTime = _this.startApplicantTime = _this.getNowFormatDate(new Date());
					params.endApplicantTime = _this.endApplicantTime = _this.getNowFormatDate(new Date());
					let  date = new Date()
					let year = date.getFullYear(),month = date.getMonth() + 1,day = date.getDate();
					if(month >= 1 && month <= 9) {
						month = "0" + month;
					}
					if(day >= 0 && day <= 9) {
						day = "0" + day;
					}
					_this.dataPicker = [new Date(year, month, day), new Date(year, month, day)];
				}
				if (_this.dataPicker) {
					params.startApplicantTime = _this.endApplicantTime = _this.dataPicker[0];
					params.endApplicantTime = _this.endApplicantTime = _this.dataPicker[1];
				}
				if (_this.activeName == 'first') {
					_this.$refs.tableFirst.queryTableListByParams(params);
				} else if (_this.activeName == 'second') {
						_this.$refs.tableSecond.queryTableListByParams(params);
				}
			},
			getNowFormatDate(val) {
				let date = new Date(val)
				let seperator1 = "-";
				let seperator2 = ":";
				let month = date.getMonth() + 1;
				let strDate = date.getDate();
				if(month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if(strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
				return currentdate;
			},
			// 选中行跳转到详情页
			rowClick(obj) {
				let _this = this;
		        //详情页面包屑();
		        let paramCrumb = {
		          name: "应急维保跟踪详情",//title name
		              parName: "应急维保跟踪",//父级title name
		              lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
		              linkname: "MaintenanceManagement-EmergencyMaintenanceTracking-EmeTrackDetails",
		              path: "MaintenanceManagement-EmergencyMaintenanceTracking-EmeTrackDetails"
		        };
		        _this.setDetailBreadcrumb(paramCrumb,_this.isLevelDetail);
		        //详情页面包屑 end
        
				this.tabName = this.activeName;
				
				if (obj.column.label != "操作") {
					if (this.tabName == 'second') {
						obj.row.maintenanceType = '0'
					}
					if(obj.row.maintenanceType) {
						_this.$router.push({
							name: 'MaintenanceManagement-EmergencyMaintenanceTracking-EmeTrackDetails',
							params: {
								orderId: obj.row.orderId,
								maintenanceType: obj.row.maintenanceType,
								tabName: this.tabName,
								userName: this.userName,
								disableds: this.disableds,
								canSelectUser: this.canSelectUser,
								isEmergency: this.pageParams.isEmergency,



								canSelectIsOverdue: this.canSelectIsOverdue,
								canSelectTime: this.canSelectTime,
								canSelectState: this.canSelectState,
								serviceState: this.serviceState,
								state: this.states,
								isOverdue: this.isOverdue,
								isOverdues: this.isOverdues,
								menuName: this.pageParams.menuName,
								flag: this.pageParams.flag,
								startApplicantTime: this.endApplicantTime,
								endApplicantTime: this.endApplicantTime
							}
						})
					}
				}
			},
		},
		created() {
		},
		mounted() {
			this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
			this.pageParams = this.$route.params;
			let _this =this;
			_this.getUserNameOptions().then(function(){
				if(_this.$route.params.isEmergency){
					_this.userName = _this.$route.params.userId || _this.$route.params.userName;
					_this.canSelectUser = true;
					_this.disableds = true;
				} else if (_this.$route.params.menuName) {
					_this.disableds = true;
					_this.canSelectIsOverdue = _this.pageParams.canSelectIsOverdue || _this.canSelectIsOverdue;
					_this.canSelectTime = _this.pageParams.canSelectTime || _this.canSelectTime;
					_this.canSelectState = _this.pageParams.canSelectState || _this.canSelectState;
					_this.serviceState = _this.pageParams.serviceState;
					_this.state = _this.pageParams.state || _this.states;
					_this.isOverdue = _this.pageParams.isOverdue;
					_this.startApplicantTime = _this.pageParams.endApplicantTime,
					_this.endApplicantTime = _this.pageParams.endApplicantTime,
					_this.flag = _this.pageParams.flag
				}
				_this.searchFilter();
			});
			_this.activeName = _this.pageParams.tabName ? _this.pageParams.tabName : 'first'
		}
	}
</script>
<style lang="scss" scoped>
	.contract-main{
		height: 100%;
		width: 100%;
		.switch-tabs-div{
			height: calc(100% - .7rem);
			/deep/.el-tabs__content{
				height: calc(100% - .5rem);
			}
			.switch-tabs{
				height: 100%;
			}
			.switch-tab-pane{
				height: 100%;
				.table-list {
					height: calc(100% - .6rem);
					background-color: #fff;
				}
			}
		}
	}
	.emergency-operation-head {
		height: .6rem;
		.colorLabel {
			color: #43495A;
		}
	}
	#word_href {
		width: 100%;
		height: 100%;
		margin: 0 auto;
	}
	/deep/#previewDialog .el-dialog {
		height: 80%;
		margin-top: 0 !important;
		margin-bottom: 0;
	}
	/deep/ #previewDialog .el-dialog__wrapper {
		overflow: hidden;
	}
	/deep/#previewDialog .el-dialog__body {
		height: 94%;
	}
	/deep/.el-table__row {
		cursor: pointer;
	}
	/deep/.el-input__suffix-inner {
		cursor: pointer;
	}
</style>
