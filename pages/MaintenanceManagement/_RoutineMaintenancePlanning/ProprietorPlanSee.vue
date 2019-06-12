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
    <div class="title">
      <el-row>
        <el-col :span="22">
          <span>项目名称:</span>{{ pageParams.pageParams.proprietorName}}<em
            >(合同日期：{{ pageParams.pageParams.orgContractStart }}至{{
              pageParams.pageParams.orgContractEnd
            }})</em
          >
        </el-col>
        <el-col :span="2">
          <!-- <el-button type="info" @click="editPlan()">
            编辑
          </el-button> -->
          <el-button @click="editPlan()" class="wb-edit fs18px" type="text" icon="el-icon-edit-outline">编辑</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: .1rem;">
        <el-col :span="6">
          <div class="div-flex align_center">
            <span class="fs18px colorLabel">计划类型:</span>
            <el-select
              v-model.trim="planType"
              clearable
              placeholder="请选择"
              class="flex1"
              disabled="disabled"
            >
              <el-option
                v-for="item in planTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="11" :offset="2">
          <div class="div-flex align_center">
            <span class="fs18px colorLabel">计划时间:</span>
            <el-date-picker
              style="width: 2.8rem;"
              v-if="!season.isSeasonShow"
              v-model="dateOptions.planDataPickerStart"
              :type="dateOptions.dateType"
              :placeholder="dateOptions.placeholderStart"
              :picker-options="pickerOptions"
              :format="dateOptions.dateFormat"
              @change="dateClick()"
              disabled="disabled"
            >
            </el-date-picker>
            <span
              style="margin-left: 0.1rem;"
              v-if="dateOptions.whetherToShowTheSecondTimeSelector"
              >至</span
            >
            <el-date-picker
              style="width: 2.8rem;"
              v-if="
                dateOptions.whetherToShowTheSecondTimeSelector &&
                  !season.isSeasonShow
              "
              v-model="dateOptions.planDataPickerEnd"
              :type="dateOptions.dateType"
              :placeholder="dateOptions.placeholderEnd"
              :picker-options="pickerOptions1"
              :format="dateOptions.dateFormat"
              @change="dateClick()"
              disabled="disabled"
            >
            </el-date-picker>
            <el-select
              v-if="season.isSeasonShow"
              v-model="season.seasonValue"
              placeholder="请选择"
              @change="seasonChange()"
            >
              <el-option
                v-for="item in season.seasonList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: .1rem;">
        <el-col :span="6" class='div-flex'>
          <span class="fs18px colorLabel">计划名称:</span>
          <el-input class='flex1' disabled="disabled" v-model="pageParams.row.planName"></el-input>
        </el-col>
      </el-row>
    </div>
    <!-- 树结构 -->
    <div class="ztreeContent">
      <el-row class="history-row">
        <el-col :span="5" class="history-col">
        </el-col>
        <el-col :span="4" v-if="historyObj.referenceHistory">
        </el-col>
        <el-col v-if="historyObj.referenceHistory" :span="2">
        </el-col>
      </el-row>
      <div class="ztreeCon">
        <div class="ztreeLeft">
          <p class="checkedWb">勾选维保内容</p>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="treeObj.filterText"
            style="width:80%;margin-top:.1rem;"
          >
          </el-input>
          <div id="ztree" class="ztree"></div>
        </div>
        <div class="ztreeRight">
          <p class="checkedWb">本次维保内容</p>
          <p class="device" v-show="deviceObj.showTable">
            本次维保共针对{{ deviceObj.systemNum }}个消防系统，进行{{
              deviceObj.deviceBigClassNum
            }}个设备大类的检查。
          </p>
          <div v-show="deviceObj.showTable" class="table-list">
            <Table
              ref="table"
              :tableList="dataList"
              :options="options"
              :columns="columns"
              :operates="operates"
              :url="requestUrl"
              @tableInitializationComplete="tableInitializationComplete"
            ></Table>
          </div>
          <div class="noContent" v-show="!deviceObj.showTable"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "~/config/http";
import Title from "~/components/Title";
import Table from "~/components/Table";
import { Message } from "element-ui";
import mixin from "~/mixin/mixin";
let planType = "1"; //记录选择格式因为this获取不到
export default {
  mixins: [mixin],
  components: {
    Title,
    Table
  },
  data() {
    return {
      imgUrl: {
        month: require("~/node_modules/ztree/css/zTreeStyle/img/diy/month.png"),
        season: require("~/node_modules/ztree/css/zTreeStyle/img/diy/season.png"),
        year: require("~/node_modules/ztree/css/zTreeStyle/img/diy/year.png")
      },
      orgId: "",
      pageParams: {
        pageParams:{},
        row:{}
      }, //父级传过来的参数
      planType: "1", //计划类型 日周月。。。
      planTypeList: [], //计划类型下拉菜单
      //计划信息相关参数
      planInfoObj: {
        isShowInfo: false,
        ceratePlanNums: "0个", //预计生成几个
        planTypeName: "日计划", //记录预计生成的计划类型
        batchNums: 0, //冲突的个数
        planLists: [] //要生成的计划值
      },
      //季度选择器的设置
      season: {
        isSeasonShow: false, //是否展示季度
        seasonValue: "", //选中的值
        seasonList: [
          {
            value: "1",
            label: "第一季度",
            disabled: new Date().getMonth() > 2 ? true : false
          },
          {
            value: "2",
            label: "第二季度",
            disabled: new Date().getMonth() > 5 ? true : false
          },
          {
            value: "3",
            label: "第三季度",
            disabled: new Date().getMonth() > 8 ? true : false
          },
          {
            value: "4",
            label: "第四季度",
            disabled: false
          }
        ]
      },
      //时间选择器的设置
      dateOptions: {
        planDataPickerStart: "", //计划时间开始
        planDataPickerEnd: "", //计划时间结束
        whetherToShowTheSecondTimeSelector: true, //是否展示第二个时间选择器
        dateType: "date", //日期类型
        dateFormat: "yyyy-MM-dd", //日期展示格式
        placeholderStart: "请选择开始时间", //提示
        placeholderEnd: "请选择结束时间", //提示
        valueFormat: "" //日期返回值
      },
      pickerOptions: {}, //时间设置
      pickerOptions1: {}, //时间设置
      //历史计划复制的数据
      historyObj: {
        referenceHistory: false, //是否展示历史计划
        dataList: [], //历史原有数据
        hisDataList: [], //展示历史数据
        hisVal: "" //选择历史数据的值
      },
      //树的数据
      tree: {}, //树本体
      treeObj: {
        filterText: "", //过滤数据
        treeList: [], //树的数据
        filteredData: [] //需要展示的数据
      },
      //右侧设备数据
      deviceObj: {
        systemNum: 0, //消防系统
        deviceBigClassNum: 0, //设备大类
        showTable: false, //展示列表还是图片
        maintenanceTable: {
          //维护设备内容列表
        }
      },
      //table数据
      requestUrl:
        api.forent_url.maintenance_service_url + "/plan/getDeviceCount",
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
          prop: "systemNameFirst",
          label: "系统",
          align: "center",
          minWidth: "20%"
        },
        {
          prop: "deviceTypeName",
          label: "设备类型",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "maintenanceCount",
          label: "计划维保数量",
          align: "center",
          minWidth: "10%"
        }
      ],
      operates: {}
    };
  },
  methods: {
    //返回上一层
    goBack() {
      this.delKeepAlive();//
      this.$router.push({
        name:
          "MaintenanceManagement-RoutineMaintenancePlanning-ProprietorPlanList",
        params: this.$route.params.pageParams
      });
    },
    // 计划类型下拉菜单
    planTypeSelect() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/getPlanTypeDic";
      api.get(serviceUrl).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"];
          let arr = [];
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              let obj = {
                value: data[i].id,
                label: data[i].name
              };
              arr.push(obj);
            }
            this.planTypeList = arr;
            this.planType = this.pageParams.row.planType;
            this.dateOptions.planDataPickerStart = this.pageParams.row.planStartTime;
            this.dateOptions.planDataPickerEnd = this.pageParams.row.planEndTime;
          }
        } else {
          Message.error("查询计划类型失败！");
        }
      });
    },
    //初始化树
    initSystemTree() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/getInspectionItems";
      let params = {
        orgId: this.orgId,
        proprietorId: this.pageParams.pageParams.proprietorId
      };
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"];
          //初始化ztree
          let node = {
            name: "全部设施类型",
            pId: "-2",
            id: "-1"
          };
          data.push(node);
          this.treeObj.treeList = data;
          this.initTree(data,this.pageParams.row.ids);
        } else {
          Message.error("查询系统数据出错!");
        }
      });
    },
    //初始化树节点
    initTree(data,ids) {
      if (this.tree) {
        $.fn.zTree.destroy("ztree");
        this.tree = {};
      }
      let setting = {
        treeId: "ztree",
        data: {
          //非常重要
          keep: {
            //子节点和父节点属性设置 默认值都为false
            leaf: false, //zTree 的节点叶子节点属性锁，是否始终保持 isParent = false
            parent: false //zTree 的节点父节点属性锁，是否始终保持 isParent = true
          },
          key: {
            //节点数据
            checked: "checked", //zTree 节点数据中保存 check 状态的属性名称。
            children: "children", //zTree 节点数据中保存子节点数据的属性名称。
            name: "name", //zTree 节点数据保存节点名称的属性名称。
            title: "" //zTree 节点数据保存节点提示信息的属性名称。[setting.view.showTitle = true 时生效]
          },
          simpleData: {
            enable: true, //确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)
            idKey: "id", //节点数据中保存唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]
            pIdKey: "pId", //节点数据中保存其父节点唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]
            rootPId: null //用于修正根节点父节点数据，即 pIdKey 指定的属性值。[setting.data.simpleData.enable = true 时生效]
          }
        },
        check: {
          chkboxType: {
            Y: "ps",
            N: "ps"
          }, //勾选 checkbox 对于父子节点的关联关系。[setting.check.enable = true 且 setting.check.chkStyle = "checkbox" 时生效]
          chkStyle: "checkbox", //勾选框类型(checkbox 或 radio）[setting.check.enable = true 时生效]
          enable: true, //设置 zTree 的节点上是否显示 checkbox / radio
          nocheckInherit: false,
          //默认值: false
          chkDisabledInherit: false //当父节点设置 chkDisabled = true 时，设置子节点是否自动继承 chkDisabled = true 。[setting.check.enable = true 时生效]
        },
        callback: {
          onCheck: this.treeCheck
        }
      };
      //默认需要勾选的节点
      let arr = [];
      if(ids){
        arr = this.checkNodesFn(data,ids);
      }else{
        arr = JSON.parse(JSON.stringify(data));
      }
      let treeData = this.filterUpdateIcon(arr);
      this.tree = $.fn.zTree.init($("#ztree"), setting, treeData);
      let nodeList = this.tree.getNodes();
      //展开第一个根节点
      this.tree.expandNode(nodeList[0], true);
      this.treeCheck();
    },
    //默认需要勾选的节点
    checkNodesFn(data,ids){
      let arr = JSON.parse(JSON.stringify(data));
      if(ids.length > 0) {
        let idArr = ids.split(",");
        for(let i = 0; i < arr.length; i++) {
          arr[i].chkDisabled = true;
          for(let j = 0; j < idArr.length; j++) {
            if(arr[i].id == idArr[j]) {
              arr[i].checked = true;
            }
          }
        }
      }
      return arr;
    },
    //选中该选中的
    setCheckNode(node) {
      var parentArr = this.tree.getNodesByParam("id", "-1");
      if (parentArr && parentArr.length > 0) {
        this.tree.checkNode(parentArr[0], true, false, false);
      }
      if (node.pId != "-1") {
        var nodeArr = this.tree.getNodesByParam("id", node.pId);
        if (nodeArr && nodeArr.length > 0) {
          this.tree.checkNode(nodeArr[0], true, false, false);
          this.setCheckNode(nodeArr[0]);
        }
      }
    },
    //更换树图标
    filterUpdateIcon(arr) {
      if (!planType) {
        return;
      }
      if (arr && arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          var checkType = arr[i].checkType;
          switch (checkType) {
            case "1":
              break;
            case "2":
              break;
            case "3":
              arr[i].icon = this.imgUrl.month;
              if (planType == "3") {
                arr[i].checked = true;
              }
              break;
            case "4":
              arr[i].icon = this.imgUrl.season;
              if (planType == "4") {
                arr[i].checked = true;
              }
              break;
            case "5":
              arr[i].icon = this.imgUrl.year;
              if (planType == "5") {
                arr[i].checked = true;
              }
              break;
            case "6":
              break;
          }
        }
      }
      return arr;
    },
    //树节点点击事件
    treeCheck() {
      //获取维保计划内容
      let checkNodes = this.tree.getCheckedNodes();
      let paramNodes = this.tree.getNodesByParam("chkDisabled", true);
      let arr = checkNodes.concat(paramNodes);
      let ids = "";
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          ids = ids + arr[i].id + ",";
        }
      }
      ids = ids.substring(ids.length - 1, 0);
      if (ids) {
        this.deviceObj.showTable = true;
      } else {
        this.deviceObj.showTable = false;
      }
      this.initTable(ids);
    },
    //初始化table表格
    initTable(ids) {
      let params = {
        orgId: this.orgId,
        proprietorId: this.pageParams.pageParams.proprietorId,
        unitSource: this.pageParams.pageParams.unitSource,
        proprietorName: this.pageParams.pageParams.proprietorName,
        ids: ids
      };
      this.$refs.table.queryTableListByParams(params);
    },
    //table数据初始化完成的回调
    tableInitializationComplete(data) {
      if (data && data.rows.length > 0) {
        this.deviceObj.systemNum = data.rows[0].systemFirstCount;
        this.deviceObj.deviceBigClassNum = data.rows[0].systemSecondCount;
      } else {
        this.deviceObj.systemNum = 0;
        this.deviceObj.deviceBigClassNum = 0;
      }
    },
    //过滤树的数据
    filterTreeData(val) {
      this.tree.hideNodes(this.tree.transformToArray(this.tree.getNodes()));
      if (val.length > 0) {
        let nodeList = this.tree.getNodesByParamFuzzy("name", val);
        let nodes = this.tree.getNodes();
        this.filteredData = [];
        for (let n in nodeList) {
          this.findParent(this.tree, nodeList[n]);
        }
        this.tree.showNodes(nodeList);
      } else {
        this.tree.showNodes(this.tree.transformToArray(this.tree.getNodes()));
      }
    },
    findParent(treeObj, data) {
      this.filteredData.push(data);
    },
    //编辑数据
    editPlan(){
      this.$router.push({
        name:
          "MaintenanceManagement-RoutineMaintenancePlanning-ProprietorPlanEdit",
        params: this.$route.params
      });
    },
  },
  watch: {
    "treeObj.filterText": {
      handler(newVal, oldVal) {
        this.filterTreeData(newVal);
      }
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    this.pageParams = this.$route.params;
    // 计划类型下拉菜单
    this.planTypeSelect();
    //初始化系统树
    this.initSystemTree();
  }
};
</script>
<style lang="scss" scoped>
.title {
  height: 1.6rem;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.11) 0 3px 3px;
  padding: 0.1rem 0 0 0.25rem;
  font-size: 0.16rem;
  span {
    color: #999;
    font-size: 0.16rem;
    margin-right: 0.1rem;
  }
  em {
    margin-left: 0.1rem;
    font-size: 0.14rem;
    color: #999;
  }
}
.createPlan {
  width: 936px;
  position: absolute;
  left: 5px;
  top: 37px;
  z-index: 10;
  .btnRemove {
    position: absolute;
    right: -16px;
    top: -10px;
    z-index: 12;
    background: #999;
    color: #fff9f1;
    border-radius: 50%;
    border: 2px solid #ffb156;
    cursor: pointer;
  }
  .planList {
    width: 100%;
    background-color: #fff9f1;
    border: 1px solid #ffb156;
    max-height: 450px;
    overflow-y: auto;
    li {
      float: left;
      width: 50%;
      padding: 8px 0px 8px 20px;
      label {
        display: inline-block;
        color: #999;
        font-size: 16px;
      }
      input {
        padding: 5px 10px 5px;
        width: 70%;
        font-size: 16px;
        line-height: 1;
        border: 1px solid #bfcbd9;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        outline: 0;
        vertical-align: middle;
      }
      .maintenance-sureHalf {
        color: #2cca20;
      }
    }
  }
  .planList:before {
    content: "";
    border: 8px solid transparent;
    border-bottom-color: #ffb156;
    position: absolute;
    top: -16px;
    left: 30px;
  }
  .planList:after {
    content: "";
    border: 8px solid transparent;
    border-bottom-color: #fff9f1;
    position: absolute;
    top: -15px;
    left: 30px;
  }
}
.ztreeContent {
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.11) 0 3px 3px;
  padding: 0 0 0 0.25rem;
  font-size: 0.16rem;
  margin-top: 0.1rem;
  height: calc(100% - 1.6rem - 0.8rem);
  .history-row {
    border-bottom: 1px solid #ccc;
    line-height: 0.5rem;
  }
  .history-col {
    height: 0.5rem;
    .history-col-checkbox {
      color: #333;
      /deep/.el-checkbox__inner {
        height: 18px;
        width: 18px;
      }
      /deep/.el-checkbox__inner::after {
        height: 10px;
        left: 6px;
      }
      /deep/.el-checkbox__label {
        font-size: 0.18rem;
      }
    }
  }
  .ztreeCon {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    height: calc(100% - 0.5rem);
    .ztreeLeft {
      height: 100%;
      overflow: auto;
      width: 660px;
      border-right: 1px solid #cbcbcb;
      .ztree {
        margin-top: 0.1rem;
        padding-left: 26px;
      }
      /deep/.ztree li span {
        font-size: 0.16rem !important;
      }
      .checkedWb {
        color: #666;
        font-size: 0.16rem;
        line-height: 0.4rem;
        box-sizing: border-box;
      }
    }
    .ztreeRight {
      height: 100%;
      width: 100%;
      .checkedWb {
        color: #666;
        font-size: 0.16rem;
        line-height: 0.4rem;
        box-sizing: border-box;
        margin-left: 0.26rem;
      }
      .device {
        color: #666;
        font-size: 0.16rem;
        line-height: 0.2rem;
        box-sizing: border-box;
        margin-left: 0.26rem;
      }
      .noContent {
        height: 80%;
        width: 100%;
        background: url("/static/img/RoutineMaintenanceTracking/noCon.png")
          no-repeat center;
        background-size: 35%;
      }
      .table-list {
        height: calc(100% - 0.6rem);
        width: 100%;
        padding: 0.1rem;
      }
    }
  }
}
.wb-edit{
  color:#5F687F;
  &:hover{
    color:#409EFF;
  }
}
</style>
