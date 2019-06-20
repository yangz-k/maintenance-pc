<template>
  <div style="height: 100%;width: 100%;">
    <div class="l-head">
      <!-- 面包屑 -->
      <Title />
    </div>
    <!-- 搜索条 -->
    <div class="contract-operation-head div-flex">
      <el-input
        class="enterprise-name-search"
        v-model="proprietorName"
        suffix-icon="el-icon-search"
        placeholder="请输入企业名称"
        clearable="clearable"
        @clear="searchFilter()"
        @change="searchFilter()"
      >
      </el-input>
    </div>
    <!-- 表格 -->
    <div class="table-list" v-loading="loading">
      <Table
        ref="table"
        :tableList="dataList"
        :options="options"
        :columns="columns"
        :operates="operates"
        :url="requestUrl"
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
                  <img :src="item.headPortraitUrl" :onerror="imgOnerror"/>
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
	              <img :src="item.headPortraitUrl" :onerror="imgOnerror"/>
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
  </div>
</template>
<script>
import Title from "~/components/Title";
import api from "~/config/http";
import { Message, MessageBox } from "element-ui";
import Table from "~/components/Table";
export default {
  components: {
    Title,
    Table
  },
  data() {
    return {
      orgId: "", //存放当前系统编码
      loading:false,
      proprietorName: "", //用于搜索的企业名称
      dialogFormVisible: false, //弹框展示隐藏
      // 分配维保人员弹框开始
      searchUserName: "",
      userList: [], //展示的人员列表
      allUserList: "", //所有人员列表
      userCheckList: [], //选中的人员列表
      proprietorId:"",//点击需要操作的企业
      imgOnerror:'this.src="' +
        require("@/assets/img/main/weibao.png") +
        '"',
      // 分配维保人员弹框结束
      // requestUrl: api.forent_url.maintenance_service_url + "/mservice/getServiceRelationshipList",
      requestUrl: api.forent_url.maintenance_service_url + "/serverUnit/getServiceRelationshipList",
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        isShowSerialNumber:true,//是否展示序号
        mutiSelect: false // 是否支持列表项选中功能
      }, // table 的参数
      dataList: [], // table数据,
      columns: [
        {
          prop: "proprietorName",
          label: "业主名称",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "status",
          label: "状态",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "names",
          label: "分配维保人员",
          align: "center",
          minWidth: "10%"
        }
      ], // 需要展示的列
      operates: {
        columnName:"分配人员",
        width: "200px",
        fixed: "right",
        list: [
          {
            type: "text",
            show: (index, row) => {
              return true;
            },
            icon: "maintenance-peopleManagement",
            plain: false,
            disabled: false,
            method: (index, row) => {
              //展示分配人员列表
              this.openPersonnelList(row);
            }
          }
        ]
      }
    };
  },
  methods: {
    //按企业名称搜索
    searchFilter() {
      let params = {};
      params.id = this.orgId;
      params.proprietorName = this.proprietorName;
      this.$refs.table.queryTableListByParams(params);
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
      this.proprietorId = row.proprietorId;
      let serviceUrl =
        api.forent_url.maintenance_service_url +
        "/serverUnit/getUserDistributionList";
      let params = {
        //t: Date.parse(new Date()) / 1000,
        id: this.orgId,
        proprietorId: row.proprietorId
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
            const _this = this;
            this.$nextTick(function(){
              _this.loading = false;
              _this.dialogFormVisible = !_this.dialogFormVisible;
            })
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
          checkedArr.push(dataArr[i]);
        } else {
          dataArr[i].checked = false;
        }
      }
      return checkedArr;
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
        let arr = this.userCheckList;
        let ids = "";
        if (arr.length > 0) {
          for (let i = 0; i < arr.length; i++) {
            ids += arr[i].userId + ",";
          }
        }
        let _ids = ids.substring(0, ids.length - 1);
        let serviceUrl = api.forent_url.maintenance_service_url+"/serverUnit/updateUserRel";
        let params = {
          //t: Date.parse(new Date()) / 1000,
          ids:ids,
          proprietorId:this.proprietorId,
          orgId:this.orgId
        }
        api.get(serviceUrl,params).then(res=>{
          if(res && res["code"] == "success"){
            Message.success("分配人员成功！");
            this.dialogFormVisible = false;
            this.$refs.table.queryTableList();
          }else{
            Message.error("分配人员失败！");
            this.$refs.table.queryTableList();
          }
        })
      });
    },
    clearable() {
      return true;
    }
  },
  mounted() {
    //查询列表数据
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params = {
      id: this.orgId
    };
    this.$refs.table.queryTableListByParams(params);
  }
};
</script>
<style lang="scss" scoped>
.contract-operation-head {
  line-height: 0.6rem;
  background-color: #fff;
  .enterprise-name-search {
    width: 2.8rem;
    margin-left: .2rem;
  }
}
.table-list {
  height: calc(100% - 1.34rem);
  background-color: #fff;
}
.el-icon-search {
  cursor: pointer;
}
@media screen and (max-width: 1366px) {
  /deep/.el-dialog {
    margin-top: 2vh !important;
  }
}
/deep/.el-dialog{
	margin:0;
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
    font-size: .14rem;
    font-family: 'MicrosoftYaHeiLight';
    font-weight: bold;
    color: #8C8C8C;
    line-height: .40rem;
  }
  .buleSpan {
    color: #FF6822;
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
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: .25rem;
      }
      .name {
        display: block;
        font-size: 0.16rem;
        color: #5F687F;
        overflow: hidden;
		    text-overflow: ellipsis;
		    white-space: nowrap;
        width: 100%;
        flex:1;
      }
      .allocating {
        font-family: 'HiraginoSansGB-W3';
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
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin:0.25rem;
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
  // 按钮
  .wb-clear,.wb-sure{
    width:.88rem;
    height:.36rem;
    background:#FFFFFF;
    border-radius:18px;
    font-size:18px;
    font-family:'HiraginoSansGB-W3';
    font-weight:normal;
  }
  .wb-clear{
    color: #5F687F;
    border:1px solid #5F687F;
  }
  .wb-sure{
     color: #FF6822;
    border:1px solid #FF6822;
  }
}
/deep/.el-dialog__body {
  padding: 30px 20px 20px 20px;
  font-size: 0.16rem;
}
/deep/.el-input__suffix-inner {
  cursor: pointer;
}
.confirm-button-div {
  .el-button {
    line-height: 0.1rem;
  }
  .is-round {
    padding: 0;
  }
}
</style>
