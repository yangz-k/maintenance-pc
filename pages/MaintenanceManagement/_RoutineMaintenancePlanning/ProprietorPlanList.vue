<template>
  <div style="height:100%;width:100%">
    <!-- 面包屑 -->
    <el-row class="l-head" type="flex" justify="space-between" align="middle">
      <el-col :span="12">
        <!-- 面包屑 -->
        <Title />
      </el-col>
      <el-col :span="1">
        <el-button
          class="goBack"
          type="text"
          icon="maintenance-back1"
          @click="goBack()"
          >返回</el-button
        >
      </el-col>
    </el-row>
    <el-row type="flex" justify="space-between" class="contract-operation-head align_center">
      <el-col :span="7" class="ml-20">
        <div class="div-flex align_center">
          <span class="fs18px colorLabel">计划状态：</span>
          <el-select
            v-model.trim="state"
            clearable
            placeholder="请选择"
            class="flex1"
             @change="searchFilter()"
          >
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
			  </div>
      </el-col>
      <el-button
        @click="addPlan()"
        class="add-plan fs14px"
        type="warning"
        plain
        ><b class="el-icon-plus"></b>新增</el-button
      >
    </el-row>
    <!-- 表格 -->
    <div class="table-list">
      <Table
        ref="table"
        :tableList="dataList"
        :options="options"
        :columns="columns"
        :operates="operates"
        :url="requestUrl"
        @rowClick="rowClick"
      ></Table>
    </div>
    <!-- 分配维保人员弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
      title="绑定服务关系"
      class="service-dialog"
      width="8.6rem"
      v-dialogDrag
      top="'0'"
    >
      <!-- 左边 -->
      <el-scrollbar v-loading="loading">
        <el-row :span="24">
          <!-- 搜索框 -->
          <el-row :span="24">
            <el-col :span="12">
              <el-input
                class="xqInput"
                clearable
                v-model.trim="searchUserName"
                placeholder="请输入姓名查询关键字"
                ref="inputSearch"
                @change="dialogSearchFilter()"
                @clear="dialogSearchFilter()"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search is-ableClick"
                  @click="dialogSearchFilter()"
                ></i>
              </el-input>
            </el-col>

            <el-col class="tcTitle pdl-15px" :span="12">
              已选择
              <span class="buleSpan">{{ userCheckList.length }}</span
              >个维保人员
            </el-col>
          </el-row>
          <el-col :span="12" class="elLeft">
            <el-row>
              <el-col
                class="leftFp"
                style="background:#fff"
                v-for="(item, index) in userList"
                :key="index"
              >
                <div class="leftFp_one div-flex align_center h100 cursor" @click="selectionPerson(item, index)">
                  <img :src="item.headPortraitUrl" />
                  <div class="div_flex flex1 nameCon">
                  	<span class="name">{{ item.name }}</span>
	                  <div>
	                    <span
	                      v-if="item.proprietorList.length === 0"
	                      class="allocating"
	                      >未分配</span
	                    >
	                    <span
	                      v-if="item.proprietorList.length > 0"
	                      class="allocating"
	                      :title="item.proprietorNames"
	                      >已分配{{ item.proprietorList.length }}家企业</span
	                    >
	                  </div>
                  </div>
                  <span
                    v-if="item.checked === false"
                    class="check-span el-icon-success gray"
                  ></span>
                  <span
                    v-if="item.checked === true"
                    class="check-span el-icon-success green"
                  ></span>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!-- 右侧列表删除 -->
          <el-col :span="12" class="elRight">
            <el-row
              class="tcCont div-flex align_center"
              :span="12"
              v-for="(item, index) in userCheckList"
              :key="index"
            >
             <div class="leftFp_one div-flex align_center h100" @click="noSelectionPerson(item, index)">
	              <img :src="item.headPortraitUrl" />
	              <span :title="item.name" class="check-name">{{ item.name }}</span>
	              <span
	                class="check-span el-icon-error"
	              ></span>
	            </div>
            </el-row>
          </el-col>
        </el-row>
      </el-scrollbar>
      <div class="confirm-button-div div-flex all_center" style="text-align: center;margin-top: .1rem;">
      	<el-button class="wb-clear" style="margin-right: .15rem;" @click="dialogFormVisible=false" round>取消</el-button>
        <el-button
        	class="wb-sure"
          round
          @click="confirmBtn()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 分配维保人员弹框 end-->
    <!-- 计划已经下发弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="planDialogFormVisible"
      v-if="planDialogFormVisible"
      title="计划已下发"
      class=""
      width="5.2rem"
      top="'0'"
    >
      <div class="plan-lowerhair-dislogs">
        <span style="height: .85rem;overflow-y: auto;display: block;"
          >计划已下发给{{
            planLowerHairName
          }},计划完成前还可以改派给其他人。</span
        >
        <div class="plan-lowerhair-dislogs-btndiv">
          <el-checkbox
            v-if="dislogsCheckboxShow"
            v-model="dislogsCheckbox"
            style="color: #aaa;"
            >将当前选定的人绑定为该公司的维保人员。</el-checkbox
          >
          <el-button @click="confirmPlanBtn()">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "~/config/http";
import Table from "~/components/Table";
import Title from "~/components/Title";
import { Message } from "element-ui";
import mixin from "~/mixin/mixin";
export default {
  mixins: [mixin],
  components: {
    Title,
    Table
  },
  data() {
    return {
      loading: true,
      orgId: "",
      pageParams: {
        proprietorId: "" //点击需要操作的企业
      }, //上级页面带过来的参数
      state: "", //计划状态值
      currentPlan: {}, //当前点中的行元素
      publishType: "", //当前更新的状态 0下发 1改派
      // 分配维保人员弹框开始
      searchUserName: "",
      userList: [], //展示的人员列表
      allUserList: "", //所有人员列表
      userCheckList: [], //选中的人员列表
      originalUserIds: "", //上一次下发给的人员或者服务关系绑定的人员id
      // 分配维保人员弹框结束
      dialogFormVisible: false, //弹框展示隐藏
      planDialogFormVisible: false, //计划已经下发弹框
      planLowerHairName: "", //计划下发给了谁
      planLowerHairIds: "", //计划下发给了谁id
      dislogsCheckbox: false, //是否勾选上了绑定维保人员
      dislogsCheckboxShow: false, //是否展示绑定维保人员
      stateList: [
        {
          value: "0",
          label: "待下发"
        },
        {
          value: "1",
          label: "待处理"
        },
        {
          value: "2",
          label: "处理中"
        },
        {
          value: "3",
          label: "已完成"
        }
      ], //计划状态数组
      requestUrl:
        api.forent_url.maintenance_service_url + "/plan/getMaintenancePlanList",
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        isShowSerialNumber: true, //是否展示序号
        mutiSelect: false // 是否支持列表项选中功能
      }, // table 的参数
      dataList: [], // table数据,
      columns: [
        {
          prop: "planName",
          label: "计划名称",
          align: "center",
          minWidth: "20%"
        },
        {
          prop: "planTypeName",
          label: "计划类型",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "maintenanceUsers",
          label: "项目维保人员",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "statusName",
          label: "计划状态",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "createTime",
          label: "创建时间",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "updateTime",
          label: "更新时间",
          align: "center",
          minWidth: "10%"
        }
      ], // 需要展示的列
      operates: {
        columnName: "操作",
        widthMin: "10%",
        fixed: "right",
        list: [
          {
            type: "text",
            title: "分配人员",
            show: (index, row) => {
              return row.status == "0";
            },
            icon: "maintenance-peopleManagement",
            plain: false,
            disabled: false,
            method: (index, row) => {
              //展示分配人员列表 下发
              this.publishType = "0";
              this.openPersonnelList(row);
            }
          },
          {
            type: "text",
            title: "改派人员",
            show: (index, row) => {
              return row.status == "1" || row.status == "2";
            },
            icon: "maintenance-reassignment",
            plain: false,
            disabled: false,
            method: (index, row) => {
              //展示分配人员列表 下发
              this.publishType = "1";
              this.openPersonnelList(row);
            }
          },
          {
            // label: "删除",
            type: "text",
            title: "删除",
            icon: "el-icon-delete",
            show: (index, row) => {
              return row.status == "0" || row.status == "1";
            },
            plain: false,
            disabled: (index, row) => {
              return false;
            },
            method: (index, row) => {
              //删除
              this.deletePlan(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    //搜索过滤数据
    searchFilter() {
      let params = {
        maintenanceId: this.orgId,
        proprietorId: this.pageParams.proprietorId,
        state: this.state
      };
      this.$refs.table.queryTableListByParams(params);
    },
    //添加维保计划
    addPlan() {
      //查询是否有合同
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/getServiceRelation";
      let params = {
        orgId: this.orgId,
        proprietorId: this.pageParams.proprietorId
      };
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"];
          if (data && data.length > 0) {
            this.$router.push({
              name:
                "MaintenanceManagement-RoutineMaintenancePlanning-ProprietorPlanAdd",
              params: this.pageParams
            });
          } else {
            //请先添加维保合同，选择合同范围内要维保的消防系统
            this.isAddContract();
          }
        } else {
          this.isAddContract();
        }
      });
    },
    //弹出是否添加合同信息的弹框
    isAddContract() {
      this.$confirm(
        "请先添加维保合同，选择合同范围内要维保的消防系统",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        //跳转到合同页面
        this.$router.push({
          name: "ProjectInformation-ContractManagement",
          params: this.pageParams
        });
      });
    },
    //弹框中过滤人员
    dialogSearchFilter() {
      let allUserList = this.allUserList;
      this.userList = [];
      for (let i = 0; i < allUserList.length; i++) {
        if (allUserList[i].name.indexOf(this.searchUserName) !== -1) {
          this.userList.push(allUserList[i]);
        }
      }
    },
    //展示分配人员列表
    openPersonnelList(row) {
      this.currentPlan = row;
      //查询该维保企业下所有人员
      this.getUserList(row);
    },
   //列表选中人员
    selectionPerson(item, index) {
      //选中里面加人员
      if (item.checked == true) {
//    	item.checked = ! item.checked;
        //如果已经选中移除
        this.noSelectionPerson(item, index);
      } else {
//      item.checked = true;
				item.checked = ! item.checked;
        this.userCheckList.push(item);
      }
    },
    //列表不选中人员
    noSelectionPerson(item, index) {
//    item.checked = false;
			item.checked = ! item.checked;
      let userCheckList = this.userCheckList;
      userCheckList.forEach((element,i) => {
        if(element.userId == item.userId){
          this.userCheckList.splice(i, 1);
        }
      });
    },
    //查询该维保企业下所有人员
    getUserList(row) {
      this.loading = true;
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/getUserList";
      let params = {
        id: this.orgId,
        proprietorId: this.pageParams.proprietorId,
        planId: this.currentPlan.id
      };
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          this.loading = false;
          let data = res["data"];
          //过滤已经分配人员的信息
          this.queryAllocatedUser(data).then(userData => {
            //过滤已选择维保人员和头像转换
            this.userCheckList = this.filterChecked(userData); //选中人员
            this.allUserList = userData; //页面所有人员
            this.userList = userData; //展示的所有人员
            this.dialogFormVisible = !this.dialogFormVisible;
          });
        } else {
          Message.error(res["message"]);
        }
      });
    },
    //过滤已经分配人员的信息
    queryAllocatedUser(dataArray) {
      return new Promise((re, js) => {
        let arr = [];
        if (dataArray && dataArray.length > 0) {
          for (let i = 0; i < dataArray.length; i++) {
            let data = dataArray[i];
            if (data.countnum > 0) {
              let dataList = data.proprietorList;
              let proprietorNames = "";
              if (dataList) {
                for (let p = 0; p < dataList.length; p++) {
                  if (p == 0) {
                    proprietorNames = dataList[p];
                  } else {
                    proprietorNames = proprietorNames + "\r" + dataList[p];
                  }
                }
              }
              data.proprietorNames = proprietorNames;
              arr.push(data);
            } else {
              arr.push(data);
            }
          }
        }
        re(arr);
      });
    },
    //过滤已选择维保人员和头像转换
    filterChecked(dataArr) {
      let checkedArr = [];
      let ids = "";
      if (dataArr && dataArr.length > 0) {
        for (let i = 0; i < dataArr.length; i++) {
          //拼接头像
          if (dataArr[i].headPortrait) {
            dataArr[i].headPortraitUrl =
              api.forent_url.image_url +
              dataArr[i].headPortrait.substring(
                0,
                dataArr[i].headPortrait.length - 4
              ) +
              "_60X60" +
              dataArr[i].headPortrait.substring(
                dataArr[i].headPortrait.length - 4,
                dataArr[i].headPortrait.length
              );
          } else {
            dataArr[
              i
            ].headPortraitUrl = require("~/assets/img/main/weibao.png");
          }
          if (dataArr[i].status == 1 || dataArr[i].status == "1") {
            dataArr[i].checked = true;
            ids = ids + dataArr[i].userId + ",";
            checkedArr.push(dataArr[i]);
          } else {
            dataArr[i].checked = false;
          }
        }
        ids = ids.substring(0, ids.length - 1);
      }
      this.originalUserIds = ids;
      return checkedArr;
    },
    //获取所有当前选中的所有人员
    getCurrentUserids() {
      var userIds = "",
        userNames = "";
      var arr = this.userCheckList;
      if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          userIds = userIds + arr[i].userId + ",";
          userNames = userNames + arr[i].name + "、";
        }
        userIds = userIds.substring(0, userIds.length - 1);
        userNames = userNames.substring(0, userNames.length - 1);
      }
      return {
        ids: userIds,
        names: userNames
      };
    },
    //确定下发按钮
    confirmBtn() {
      let currentIds = this.getCurrentUserids().ids;
      let currentNames = this.getCurrentUserids().names;
      if (!currentIds.trim()) {
        Message.error("请选择维保人员！");
        return;
      }
      let params = {
        planId: this.currentPlan.id,
        publishType: this.publishType,
        operationPerson: api.getGlobalVal("maintenance_userObj").id,
        preMaintenanceUsers: this.originalUserIds,
        maintenanceUsers: currentIds,
      };
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/reassigMaintenancePlan";
      api.post(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          this.dialogFormVisible = false;
          this.$refs.table.queryTableList();
          //查询企业是否有绑定服务人员
          this.judgeUserExist(currentIds, currentNames);
        } else {
          Message.error(res["message"]);
        }
      });
    },
    //查询企业是否有绑定服务人员
    judgeUserExist(currentIds, currentNames) {
      let sreviceUrl =
        api.forent_url.maintenance_service_url + "/serverUnit/judgeUserExist";
      api
        .get(sreviceUrl, { 
          proprietorId: this.pageParams.proprietorId,
          orgId: api.getGlobalVal("maintenance_userObj").orgCode
        })
        .then(res => {
          if (res && res["code"] == "success") {
            let val = res["data"];
            if (val == "1") {
              //有关联弹出下发给了谁
              this.isBindingServiceRelationship(currentIds, currentNames, true);
            } else {
              //没关联弹出下发给了谁+是否关联
              this.isBindingServiceRelationship(
                currentIds,
                currentNames,
                false
              );
            }
          } else {
            Message.error(res["message"]);
          }
        });
    },
    //有关联弹出下发个了谁+是否关联
    isBindingServiceRelationship(ids, names, bool) {
      this.planDialogFormVisible = true;
      this.planLowerHairName = names;
      this.planLowerHairIds = ids;
      if (bool) {
        //有关联弹出下发个了谁
        this.dislogsCheckboxShow = false;
      } else {
        //没关联弹出下发个了谁+是否关联
        this.dislogsCheckboxShow = true;
      }
    },
    //确定计划已经下发按钮
    confirmPlanBtn() {
      this.planDialogFormVisible = false;
      if (this.dislogsCheckbox) {
        //需要绑定服务关系
        let serviceUrl =
          api.forent_url.maintenance_service_url + "/serverUnit/updateUserRel";
        let params = {
          ids: this.planLowerHairIds,
          proprietorId: this.pageParams.proprietorId,
          orgId: this.orgId
        };
        api.get(serviceUrl, params).then(res => {
          this.dislogsCheckbox = false;
          if (res && res["code"] == "success") {
            Message.success("绑定服务关系成功!");
          } else {
            Message.error("绑定服务关系失败!");
          }
        });
      } else {
        //不需要绑定服务关系
        this.dislogsCheckbox = false;
      }
    },
    //删除计划
    deletePlan(row) {
      let _this = this;
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/delMaintenancePlanById";
      this.$confirm("确定要删除这条信息吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        api.get(serviceUrl, { planId: row.id }).then(res => {
          if (res && res["code"] == "success") {
            Message.success("删除成功！");
            _this.$refs.table.queryTableList();
          } else {
            Message.error("删除失败！");
          }
        });
      });
    },
    goBack() {
      this.delKeepAlive();//
      this.$router.push({
        name: "MaintenanceManagement-RoutineMaintenancePlanning"
      });
    },
    //行点击事件
    rowClick(obj) {
      let _this = this;
      //详情页面包屑
      let paramCrumb = {
        name: "当前例行维保计划列表详情",//title name
            parName: "当前例行维保计划列表",//父级title name
            lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
            linkname: "MaintenanceManagement-RoutineMaintenancePlanning-ProprietorPlanSee",
            path: "MaintenanceManagement-RoutineMaintenancePlanning-ProprietorPlanSee"
      };
      _this.setDetailBreadcrumb(paramCrumb,true);
      //详情页面包屑 end
      
      if (obj.column.label != "操作") {
        obj.pageParams = this.pageParams;
        //跳转到合同页面
        this.$router.push({
          name:
            "MaintenanceManagement-RoutineMaintenancePlanning-ProprietorPlanSee",
          params: obj
        });
      }
    }
  },
  mounted() {
    //接受上级页面带过来的参数
    this.pageParams = this.$route.params;
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params = {
      maintenanceId: this.orgId,
      proprietorId: this.pageParams.proprietorId
    };
    this.$refs.table.queryTableListByParams(params);
  }
};
</script>
<style lang="scss" scoped>
.contract-operation-head {
  line-height: 0.6rem;
  background-color: #fff;
  .add-plan {
    width: 0.8rem;
    background-color: #5f687f;
    color: #fff;
    border: 0;
    border-radius: 0.5rem;
    margin-left: 0.1rem;
    margin-right: 0.2rem;
    cursor: pointer;
  }
  // .searchBtn {
  //   margin-left: 0.1rem;
  //   color: #fff;
  //   background-color: #e6a23c;
  //   border-radius: 17px;
  //   width: 0.8rem;
  //   margin-right: 0.5rem;
  // }
  .el-icon-search {
    cursor: pointer;
  }
}
.table-list {
  height: calc(100% - 1.34rem);
  background-color: #fff;
}
.service-dialog {
  .xqInput {
    width: 95%;
    height: 40px;
    line-height: 36px;
    border-radius: 4px;
    float: left;
  }
  .tcTitle {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .buleSpan {
    color: #0a7bc7;
  }
  .certain {
    bottom: 20px;
    right: 26px;
  }
  .elLeft {
    height: 420px;
    overflow: scroll;
    border-right: 1px solid #e4e4e4;
  }
  .elRight {
    height: 420px;
    overflow: scroll;
  }
  .check-span {
    cursor: pointer;
    margin:0 .15rem;
  }
  // 左边
  .leftFp {
    display: block;
    width: 100%;
    height: 80px;
    color: #5f687f;
    border-bottom: 2px solid #eef1f4;
    .leftFp_one {
     .nameCon{
     	flex-direction: column;
     	overflow: hidden;
     }
      & > img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin:0 .15rem 0 0;
      }
      .name {
        display: block;
        font-size: 0.18rem;
        overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
		   width: 2.72rem;
		   flex:1;
      }
      .allocating {
        display: block;
        color: #ff951b;
        font-size: 0.16rem;
      }
      .el-icon-success {
        display: block;
      }
      .gray {
        color: #aaa;
      }
      .green {
        color: green;
      }
    }
  }
  // 右边
  .tcCont {
    display: block;
    width:100%;
    height: 80px;
    color: #5f687f;
    border-bottom: 2px solid #eef1f4;
    overflow: hidden;
    .leftFp_one {
      cursor: pointer;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin:0 .15rem;
      }
      .check-name {
        flex:1;
        font-size: 0.18rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
    }
  }
  /deep/.el-button{
    line-height: 0.08rem;
  }
  .is-round {
    padding: 0;
  }
}
/deep/.el-dialog__body {
  padding: 30px 20px 20px 20px;
  font-size: 0.16rem;
}
/deep/.el-input__suffix-inner {
  cursor: pointer;
}
/deep/.el-table__row {
  cursor: pointer;
}
</style>
