<template>
  <div v-if="dialogFormVisible">
    <!-- 分配维保人员弹框 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
      v-dialogDrag
      :title="title"
      class="service-dialog"
      width="8.6rem"
      @close="closeDialog"
      top="'0'"    >
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
	                  <span :title="item.name" class="name">{{ item.name }}</span>
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
            <el-row>
              <el-col
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
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-scrollbar>
      <div class="confirm-button-div div-flex all_center" style="text-align: center;margin-top: .1rem;">
      	<el-button class="wb-clear" style="margin-right: .15rem;" @click="dialogFormVisible=false" round>取 消</el-button>
        <el-button
          class="wb-sure"
          round
          @click="confirmBtn()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "~/config/http";
import { Message, MessageBox } from "element-ui";
export default {
  props: {
    title:{
      type:String,
      default:"分配人员"
    },
    queryUserListUrl:{
      type:String,
      default:""
    },
    updateUserUrl:{
      type:String,
      default:""
    },
    pageName:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      orgId: "", //存放当前系统编码
      proprietorId: "",
      loading:false,
      // 分配维保人员弹框开始
      searchUserName: "",
      userList: [], //展示的人员列表
      allUserList: "", //所有人员列表
      userCheckList: [], //选中的人员列表
      proprietorId: "", //点击需要操作的企业
      dialogFormVisible: false,// 分配维保人员弹框结束
      currentRow:{},//点击当前行
      preMaintenanceUsers:"",//
    };
  },
  methods: {
    //展示分配人员列表
    openPersonnelList(row) {
      this.dialogFormVisible = true;
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
      this.currentRow = row;
      this.loading = true;
      this.proprietorId = row.proprietorId;
      let serviceUrl = this.queryUserListUrl || "http://";
      let params = {
        id: this.orgId,
        proprietorId: row.proprietorId,
        orderId:row.orderId
      };
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"];
          //过滤已经分配人员的信息
          this.queryAllocatedUser(data).then(userData => {
            //过滤已选择维保人员和头像转换
            this.userCheckList = this.filterChecked(userData); //选中人员
            this.allUserList = userData; //页面所有人员
            this.userList = userData; //展示的所有人员
            this.loading = false;
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
          dataArr[i].headPortraitUrl = require("@/assets/img/main/weibao.png");
        }
        if (dataArr[i].status == 1 || dataArr[i].status == "1") {
          dataArr[i].checked = true;
          ids = ids + dataArr[i].userId + ",";
          checkedArr.push(dataArr[i]);
        } else {
          dataArr[i].checked = false;
        }
      }
      this.preMaintenanceUsers = ids.substring(0, ids.length - 1);
      return checkedArr;
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
    //提交按钮
    confirmBtn() {
      this.$confirm(
        "绑定服务关系的维保人员，优先为该业主单位服务。确定绑定服务关系么?",
        "绑定服务关系",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.loading = true;
        let arr = this.userCheckList;
        let ids = "";
        if (arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            ids += arr[i].userId + ",";
          }
        }
        let _ids = ids.substring(0, ids.length - 1);
        let serviceUrl = this.updateUserUrl || "http://";
        //判断是
        let params = {};
        if(this.pageName == "emergency"){
          let publishType = "1"
          if(this.currentRow.isDispatched == '0' && this.currentRow.serviceState != "3" && this.currentRow.serviceState != "4"){
              publishType = "0";
          }
          params = {
            orderId:this.currentRow.orderId,
            publishType: publishType,
            operationPerson:api.getGlobalVal("maintenance_userObj").id,
            preMaintenanceUsers:this.preMaintenanceUsers,
            maintenanceUsers:_ids
          }
           api.post(serviceUrl, params).then(res => {
            if (res && res["code"] == "success") {
              Message.success("分配人员成功！");
              this.dialogFormVisible = false;
              this.$emit("distributivePersonnel", "");
            } else {
              Message.error("分配人员失败！");
            }
          });
        }else{
          params = {
            ids: ids,
            proprietorId: this.proprietorId,
            orgId: this.orgId
          };
           api.get(serviceUrl, params).then(res => {
            if (res && res["code"] == "success") {
              Message.success("分配人员成功！");
              this.dialogFormVisible = false;
              this.$emit("distributivePersonnel", "");
            } else {
              Message.error("分配人员失败！");
            }
          });
        }
      });
    },
    //关闭弹框
    closeDialog() {
      this.dialogFormVisible = false;
      this.$emit("closeDistributivePersonnelDialog", "");
    }
  },
  mounted() {
    this.dialogFormVisible = true;
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog{
	margin:0;
}
/deep/.el-button{
	line-height: 0.08rem;
}
.is-round {
  padding: 0;
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
      cursor: pointer;
     .nameCon{
     	flex-direction: column;
     	overflow: hidden;
     }
      & > img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: .15rem;
      }
      .name {
        display: block;
        font-size: 0.18rem;
        overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
        width: 100%;
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
}
/deep/.el-dialog__body {
  padding: 30px 20px 20px 20px;
  font-size: 0.16rem;
}
</style>
