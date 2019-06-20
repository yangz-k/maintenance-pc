<template>
	<el-row class="contract-main">
		<!-- 面包屑 -->
		<el-row class="l-head" type="flex" justify="space-between" align="middle">
			<el-col :span="12">
				<!-- 面包屑 -->
				<Title />
			</el-col>
			<el-col :span="1" v-if="showBack">
				<el-button class="goBack" type="text" icon="maintenance-back1" @click="goBack()">返回</el-button>
			</el-col>
		</el-row>
		<!-- 搜索栏 -->
		<el-row class="contract-operation-head" type="flex" align="middle">
			<el-col :span="4">
				<div class="div-flex ml-20">
					<span class="fs18px colorLabel">维保人员：</span>
					<el-select v-model="userIds" @change="searchFilter()" :disabled="disableds" clearable placeholder="请选择" class="flex1 search_sec">
						<el-option v-for="(item, index) in userIdsOptions" :key="index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="div-flex ml-30">
					<span class="fs18px colorLabel">计划类型：</span>
					<el-select v-model.trim="planType" @change="searchFilter()" clearable placeholder="请选择" class="flex1">
						<el-option v-for="(item, index) in planTypeOptions" :key="index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="div-flex ml-30">
					<span class="fs18px colorLabel">服务及时性：</span>
					<el-select v-model.trim="isOverdue" @change="searchFilter()" clearable placeholder="请选择" class="flex1">
						<el-option v-for="(item, index) in isOverdueOptions" :key="index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="div-flex ml-30">
					<span class="fs18px colorLabel">服务状态：</span>
					<el-select v-model.trim="state" @change="searchFilter()" clearable placeholder="请选择" class="flex1 search_sec1" :disabled="canSelectState">
						<el-option v-for="(item, index) in stateOptions" :key="index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="5">
				<div class="div-flex ml-30">
					<el-input class="flex1 search_bbt" v-model="proprietorName" suffix-icon="el-icon-search" @clear="searchFilter()" @change="searchFilter()" placeholder="请输入企业名称" clearable="clearable">
					</el-input>
				</div>
			</el-col>
		</el-row>
		<!-- 表格 -->
		<el-row class="table-list">
			<Table ref="table" :tableList="dataList" :options="options" :columns="columns" :operates="operates" :url="requestUrl" @rowClick="rowClick" @mouseEnter="mouseEnter" @mouseLeave="mouseLeave">
			</Table>
		</el-row>
		<!-- 预览弹框 -->
		<el-dialog top="'0'" title="预览" :visible.sync="previewVisible" :close-on-click-modal="false" width="50%">
			<iframe frameborder="0" id="word_href" :src="previewSrc"></iframe>
		</el-dialog>
	</el-row>
</template>
<script>
	import axios from "axios";
	import api from "~/config/http";
	import Table from "~/components/Table";
	import Title from "~/components/Title";
  import mixin from "~/mixin/mixin.js";
  import download from 'ly-downloader';
	export default {
		mixins: [mixin],
		components: {
			Table,
			Title
		},
		data() {
			return {
				isLevelDetail: true,//
				pageParams: '',
				disableds: false,
				dataList: [], // table数据,
				canSelectState: false,
				showBack:false,//显示返回按钮否
				options: {
					stripe: true, // 是否为斑马纹 table
					loading: true, // 是否添加表格loading加载动画
					highlightCurrentRow: true, // 是否支持当前行高亮显示
					mutiSelect: false, // 是否支持列表项选中功能
					isShowSerialNumber: true, // 是否展示序号
				}, // table 的参数
				columns: [{
						prop: "proprietorName",
						label: "业主单位",
						align: "center",
						minWidth: "15%"
					},
					{
						prop: "planName",
						label: "计划名称",
						align: "center",
						minWidth: "15%"
					},
					{
						prop: "planTypeName",
						label: "计划类型",
						align: "center",
						minWidth: "7%"
					},
					{
						prop: "stateName",
						label: "服务状态",
						align: "center",
						minWidth: "7%"
					},
					{
						prop: "isOverdue",
						label: "服务及时性",
						align: "center",
						minWidth: "8%"
					},
					{
						prop: "userNames",
						label: "维保人员",
						align: "center",
						minWidth: "18%"
					},
					{
						prop: "norm",
						label: "是否规范",
						isShowTipicon: true,
						align: "center",
						minWidth: "15%"
					}
				], // 需要展示的列
				operates: {
					columnName: "报告",
					widthMin: "10%",
					fixed: "right",
					list: [{
							title: "生成报告",
							type: "text",
							icon: "maintenance-download",
							show: (index, row) => {
								return row.stateName == "已完成";
							},
							plain: false,
							disabled: false,
							method: (index, row) => {
								this.handleDownload(index, row);
							}
						},
						{
							title: "预览",
							type: "text",
							icon: "el-icon-view",
							show: (index, row) => {
								return row.stateName == "已完成";
							},
							plain: false,
							disabled: (index, row) => {
								return false;
							},
							method: (index, row) => {
								this.handlePreview(index, row);
							}
						}
					]
				}, // 操作按钮
				requestUrl: api.forent_url.maintenance_service_url + "/plan/getRoutineTrackList",
				userIdsOptions: [{
					value: "",
					label: "请选择"
				}], // 维保人员下拉菜单
				planTypeOptions: [{
					value: "",
					label: "请选择"
				}], // 计划类型下拉菜单
				isOverdueOptions: [{
						value: "",
						label: "请选择"
					},
					{
						value: "0",
						label: "正常"
					},
					{
						value: "1",
						label: "已逾期"
					}
				], // 服务及时性菜单
				stateOptions: [{
						value: "",
						label: "请选择"
					},
					{
						value: "1",
						label: "已下发"
					},
					{
						value: "11",
						label: "已出发"
					},
					{
						value: "12",
						label: "已抵达"
					},
					{
						value: "2",
						label: "已开始"
					},
					{
						value: "3",
						label: "已完成"
					}
				], // 服务状态菜单
				userIds: "", // 维保人员
				planType: "", // 计划类型
				isOverdue: "", // 服务及时性
				state: "", // 服务状态
				states: "",
				thisMonth: "",
				proprietorName: "", // 企业名称
				previewVisible: false, // 预览弹框默认隐藏
				previewSrc: "" // 预览src
			};
		},
		mounted() {
			this.pageParams = this.$route.params;
			let _this = this;
			_this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
			_this.id = api.getGlobalVal("maintenance_userObj").orgCode;
			_this.getUserIdsOptions().then(function() {
				if(_this.$route.params.isRoutine) {
					_this.userIds = _this.pageParams.userIds;
					_this.disableds = true;
					_this.showBack = true;
					setTimeout(function() {
						$(".search_sec input").css('height', $(".search_bbt .el-input__inner").height() + 'px')
					})
				} else {
					_this.disableds = false;
					_this.showBack = false;
				}
				_this.searchFilter();
			});
			_this.getPlanTypeOptionsOptions();
		},
		methods: {
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
				}else if(this.$route.params.isRoutine){
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
			// 获取维保人员下拉选项
			getUserIdsOptions() {
				let _this = this;
				return new Promise(function(resolve, reject) {
					api
						.get(
							api.forent_url.maintenance_service_url +
							"/userInfo/getUsersByorgId", {
								id: api.getGlobalVal("maintenance_userObj").orgCode,
								orgId: api.getGlobalVal("maintenance_userObj").orgCode,
								thisMonth: "",
								userId: "",
								proprietorName: ""
							}
						)
						.then(res => {
							if(res.code === "success") {
								res.data.forEach(element => {
									_this.userIdsOptions.push({
										value: element.userId,
										label: element.name
									});
								});
							}
							resolve();
						});
				});
			},
			// 获取计划类型下拉选项
			getPlanTypeOptionsOptions() {
				api
					.get(api.forent_url.maintenance_service_url + "/plan/getPlanTypeDic")
					.then(res => {
						if(res.code === "success") {
							res.data.forEach(element => {
								this.planTypeOptions.push({
									value: element.id,
									label: element.name
								});
							});
						}
					});
			},
			// 搜索过滤数据
			searchFilter() {
				let params = {};
				params.id = this.id;
				params.orgId = this.id;
				params.thisMonth = "";
				params.userId = "";
				params.userIds = this.userIds;
				params.planType = this.planType;
				params.isOverdue = this.isOverdue;
				params.state = this.state;
				if(this.$route.params.menuName === "uncompletedMonth") {
					params.state = this.states = "1,11,12,2",
					this.canSelectState = true;
					params.thisMonth = this.thisMonth = "1"
					this.showBack = true;
					setTimeout(function() {
						$(".search_sec1 input").css('height', $(".el-input__inner").height() + 'px')
					})
				}
		        params.proprietorName = this.proprietorName;
		        const _this = this;
		        this.$nextTick(function(){
		        			if(!_this.$refs.table)return;
							try {
								_this.$refs.table.queryTableListByParams(params);
							} catch (error) {
								setTimeout(function(){
									_this.$refs.table.queryTableListByParams(params);
								},0)
							}

		        })
			},
			// 下载附件
			handleDownload(index, row) {
        if(myBrowser() == 'FF'){
          download(1, api.forent_url.maintenance_service_url + "/plan/exportRoutineWord?type=1&fireFox=1&id=" + row.id);
        }else{
          download(1, api.forent_url.maintenance_service_url + "/plan/exportRoutineWord?type=1&id=" + row.id);
        }
			},
			// 预览
			handlePreview(index, row) {
				let _this = this;
				api
					.get(
						api.forent_url.maintenance_service_url + "/plan/previewRoutineWord", {
							id: row.id,
							type: "1"
						}
					)
					.then(res => {
						console.log("res========", res);
						if(res && res.code === "success") {
							if(res.data) {
                this.previewVisible = true;
                if(myBrowser() === "IE"){
                  setTimeout(function() {
                    _this.previewSrc = api.forent_url.localHostName+"/pdfjs/web/viewer.html?file="+api.forent_url.image_url + res.data;
                  });
                }else{
                  setTimeout(function() {
                    _this.previewSrc = api.forent_url.image_url + res.data;
                  });
                }
							} else {
								this.$message.error("pdf生成失败！");
							}
						} else {
							this.$message.error(res.message);
						}
					});
			},
			// 选中行跳转到详情页
			rowClick(obj) {
				let _this = this;
				//详情页面包屑();
				let paramCrumb = {
					name: "例行维保跟踪详情",//title name
			        parName: "例行维保跟踪",//父级title name
			        lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
			        linkname: "MaintenanceManagement-RoutineMaintenanceTrackingControl-RoutineDetails",
			        path: "MaintenanceManagement-RoutineMaintenanceTrackingControl-RoutineDetails"
				};
				_this.setDetailBreadcrumb(paramCrumb,_this.isLevelDetail);
				//详情页面包屑 end

				if(obj.column.label != "报告") {
					_this.$router.push({
						name: "MaintenanceManagement-RoutineMaintenanceTrackingControl-RoutineDetails",
						params: {
							id: obj.row.id,
							userIds: _this.pageParams.userIds,
							disableds: _this.disableds,
							showBack: _this.showBack,
							isRoutine: _this.pageParams.isRoutine,
							menuName: _this.pageParams.menuName,
							flag: _this.pageParams.flag,
							thisMonth: _this.thisMonth,
							state: _this.states,
							canSelectState: _this.canSelectState,
						}
					});
				}
			},
			//鼠标移入事件
			mouseEnter(obj) {
				if(obj.column.label == "是否规范") {
					let html = "";
					let normList = obj.row.normList;
					if(normList && normList.length > 0) {
						for(let i = 0; i < normList.length; i++) {
							let className = "";
							let bStyle = "",
								pstyle = "";
							if(normList[i].isStandard == 1) {
								className = "maintenance-sureHalf success";
								bStyle =
									"color:green;display:inline-block;float:right;margin-top:.05rem;";
								pstyle = "display:inline-block;margin-top:.05rem;";
							} else {
								className = "maintenance-errorHalf error";
								pstyle = "display:inline-block;margin-top:.05rem;";
								bStyle =
									"color:red;display:inline-block;float:right;margin-top:.05rem;";
							}
							if(html) {
								html +=
									"<br/><p class='content-p' style=" +
									pstyle +
									">" +
									normList[i].superviseContent +
									"</p><b class=" +
									className +
									" style=" +
									bStyle +
									"></b>";
							} else {
								html +=
									"<p class='content-p' style=" +
									pstyle +
									">" +
									normList[i].superviseContent +
									"</p><b class=" +
									className +
									" style=" +
									bStyle +
									"></b>";
							}
						}
					} else {
						return;
					}
					this.$refs.table.showPopover(true, obj, html);
				} else {}
			},
			//鼠标移出事件
			mouseLeave(obj) {
				if(obj.column.label == "是否规范") {
					this.$refs.table.showPopover(false, obj, "");
				} else {}
			}
		}
	};
</script>
<style lang="scss" scoped>
	.contract-main {
		height: 100%;
		width: 100%;
		.contract-operation-head {
			line-height: 0.6rem;
			background-color: #fff;
		}
		.table-list {
			height: calc(100% - 1.34rem);
			background-color: #fff;
		}
		/deep/.el-dialog {
			height: 80%;
			margin-top: 0 !important;
			margin-bottom: 0;
		}
		/deep/.el-dialog__wrapper {
			overflow: hidden;
		}
		#word_href {
			width: 100%;
			height: 100%;
			margin: 0 auto;
		}
		/deep/.el-dialog__body {
			height: 94%;
    }
    .colorLabel{
      font-size:.18rem;
      font-family:'HiraginoSansGB-W3';
      font-weight:normal;
      color:#43495A;
    }
	}
	/deep/.operate-group .item .el-button{
		width:32px;
	}
	/deep/.el-table .el-table__row {
		cursor: pointer;
	}
	/deep/.el-input__suffix-inner {
		cursor: pointer;
	}
</style>
