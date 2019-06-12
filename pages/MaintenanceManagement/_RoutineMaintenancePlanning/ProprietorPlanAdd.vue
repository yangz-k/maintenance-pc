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
          <span>项目名称:</span>{{ pageParams.proprietorName
          }}<em
            >(合同日期：{{ pageParams.orgContractStart }}至{{
              pageParams.orgContractEnd
            }})</em
          >
        </el-col>
        <el-col :span="2">
          <!-- <el-button type="warning" @click="savePlan()">
            保存
          </el-button> -->
          <el-button class="wb-edit fs18px" @click="savePlan()" type="text" icon="maintenance-save">&nbsp;保存</el-button>
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
      <el-row v-if="planInfoObj.isShowInfo" style="margin-top: .1rem;">
        <el-col :span="10">
          <span class="maintenance-aroundNotice" style="color: #ff9d4f;" @click="openPlanList('createPlan')"></span>
          <span style="color: #333;font-size: .16rem;"
            >预计生成{{ planInfoObj.ceratePlanNums
            }}{{ planInfoObj.planTypeName }}，其中{{
              planInfoObj.batchNums
            }}个例行维保与历史计划时间冲突</span
          >
        </el-col>
        <div id="createPlan" class="createPlan">
          <span
            @click="closePlanList('createPlan')"
            class="maintenance-remove btnRemove"
          ></span>
          <ul class="planList">
            <li v-for="(planList, index) in planInfoObj.planLists" :key="index">
              <label for="">计划名称：</label>
              <input
                type="search"
                placeholder=""
                :title="planList.perList.planName"
                v-model="planList.perList.planName"
                :disabled="planList.status == '1' ? true : false"
                name=""
                id=""
                class=""
                maxlength="30"
              />
              <span
                :class="
                  planList.status == '0'
                    ? 'maintenance-sureHalf'
                    : 'maintenance-reset'
                "
                :title="planList.status == '0' ? '新计划' : '计划已存在'"
              ></span>
            </li>
          </ul>
        </div>
      </el-row>
    </div>
    <!-- 树结构 -->
    <div class="ztreeContent">
      <el-row class="history-row">
        <el-col :span="5" class="history-col">
          <el-checkbox
            class="history-col-checkbox"
            v-model="historyObj.referenceHistory"
            >复制历史计划制定新的维保计划</el-checkbox
          >
        </el-col>
        <el-col class='div-flex' :span="4" v-if="historyObj.referenceHistory">
          <el-select class='flex1' v-model="historyObj.hisVal" placeholder="请选择">
            <el-option
              v-for="item in historyObj.hisDataList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col v-if="historyObj.referenceHistory" :span="2" :offset="1">
          <el-button
            style="display: inline-block;"
            type="warning"
            @click="confirmHis()"
            >确定</el-button
          >
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
let planType = "1"; //记录选择格式因为this获取不到
export default {
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
      pageParams: {}, //父级传过来的参数
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
      this.$router.push({
        name:
          "MaintenanceManagement-RoutineMaintenancePlanning-ProprietorPlanList",
        params: this.$route.params
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
          }
        } else {
          Message.error("查询计划类型失败！");
        }
      });
    },
    // 时间点击回调
    dateClick() {
      let value1 = this.dateOptions.planDataPickerStart;
      let value2 = this.dateOptions.planDataPickerEnd;
      if (planType != "5") {
        this.$data.pickerOptions.disabledDate = function(time) {
          return time.getTime() > new Date(value2).getTime();
        };
        this.$data.pickerOptions1.disabledDate = function(time) {
          return time.getTime() < new Date(value1).getTime();
        };
      }
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/batchJudgePlanExists";
      let batchPlan = [];
      switch (planType) {
        case "1": //日计划
          if (value2 && value1) {
            let days =
              (new Date(value2).getTime() - new Date(value1).getTime()) /
                (24 * 60 * 60 * 1000) +
              1;
            this.planInfoObj.ceratePlanNums = days + "个";
            for (let i = 0; i < days; i++) {
              let times = new Date(value1).getTime() + 24 * 60 * 60 * 1000 * i;
              let planStartTime = this.getNowFormatDate(times);
              let planEndTime = this.getNowFormatDate(times);
              let planName =
                new Date(times).getFullYear() +
                "年" +
                (new Date(times).getMonth() + 1) +
                "月" +
                new Date(times).getDate() +
                "日" +
                "日计划";
              batchPlan.push({
                proprietorId: this.pageParams.proprietorId,
                maintenanceId: this.orgId,
                planType: "1",
                planStartTime: planStartTime,
                planEndTime: planEndTime,
                planName: planName
              });
            }
            let batchPlanStr = JSON.stringify(batchPlan);
            api.post(serviceUrl, { batchPlan: batchPlanStr }).then(res => {
              if (res && res["code"] == "success") {
                let data = res["data"];
                this.planInfoObj.planLists = data;
                let nums = 0;
                data.forEach(function(item, index) {
                  if (item.status == "1") {
                    nums++;
                  }
                });
                this.planInfoObj.batchNums = nums;
                this.planInfoObj.isShowInfo = true;
              } else {
                Message.error(res["message"]);
              }
            });
          }
          break;
        case "2": //周计划
          if (value1 && value2) {
            let nowMonth = new Date(value2).getMonth();
            let nowYear = new Date(value2).getFullYear();
            let nowDay = new Date(value2).getDate();
            let nowDayOfWeek = new Date(value2).getDay();
            let getStartDate = new Date(
              nowYear,
              nowMonth,
              nowDay - nowDayOfWeek + 1
            );
            let getEndDate = new Date(
              nowYear,
              nowMonth,
              nowDay + (7 - nowDayOfWeek)
            );
            let weeks =
              Math.floor(
                (getEndDate.getTime() - value1.getTime()) /
                  (24 * 60 * 60 * 1000) /
                  7
              ) + 1;
            this.planInfoObj.ceratePlanNums = weeks + "个";
            for (let i = 0; i < weeks; i++) {
              let timeS = getStartDate.getTime() + 7 * 24 * 60 * 60 * 1000 * i;
              let timeE = getEndDate.getTime() + 7 * 24 * 60 * 60 * 1000 * i;
              let planName = "";
              let planStartTime = this.getNowFormatDate(timeS);
              let planEndTime = this.getNowFormatDate(timeE);
              if (
                new Date(timeS).getFullYear() != new Date(timeE).getFullYear()
              ) {
                planName =
                  new Date(timeS).getFullYear() +
                  "年" +
                  (new Date(timeS).getMonth() + 1) +
                  "月" +
                  new Date(timeS).getDate() +
                  "日" +
                  "-" +
                  new Date(timeE).getFullYear() +
                  "年" +
                  (new Date(timeE).getMonth() + 1) +
                  "月" +
                  new Date(timeE).getDate() +
                  "日" +
                  "周计划";
              } else {
                planName =
                  new Date(timeS).getFullYear() +
                  "年" +
                  (new Date(timeS).getMonth() + 1) +
                  "月" +
                  new Date(timeS).getDate() +
                  "日" +
                  "-" +
                  (new Date(timeE).getMonth() + 1) +
                  "月" +
                  new Date(timeE).getDate() +
                  "日" +
                  "周计划";
              }
              batchPlan.push({
                proprietorId: this.pageParams.proprietorId,
                maintenanceId: this.orgId,
                planType: "2",
                planStartTime: planStartTime,
                planEndTime: planEndTime,
                planName: planName
              });
              let batchPlanStr = JSON.stringify(batchPlan);
              api.post(serviceUrl, { batchPlan: batchPlanStr }).then(res => {
                if (res && res["code"] == "success") {
                  let data = res["data"];
                  this.planInfoObj.planLists = data;
                  let nums = 0;
                  data.forEach(function(item, index) {
                    if (item.status == "1") {
                      nums++;
                    }
                  });
                  this.planInfoObj.batchNums = nums;
                  this.planInfoObj.isShowInfo = true;
                } else {
                  Message.error(res["message"]);
                }
              });
            }
          }
          break;
        case "3": //月计划
          if (value2 && value1) {
            let months = this.monthDiff(value1, value2);
            this.planInfoObj.ceratePlanNums = months + "个";
            let month = new Date(value1).getMonth();
            let year = new Date(value1).getFullYear();
            for (let i = 0; i < months; i++) {
              let day = this.getMonthDays(year, month);
              let planStartTime, planEndTime;
              if (month + 1 < 10) {
                planStartTime = year + "-" + "0" + (month + 1) + "-" + "01";
                planEndTime = year + "-" + "0" + (month + 1) + "-" + day;
              } else {
                planStartTime = year + "-" + (month + 1) + "-" + "01";
                planEndTime = year + "-" + (month + 1) + "-" + day;
              }
              let planName = year + "年" + (month + 1) + "月" + "月计划";
              month++;
              if (month == "12") {
                month = 0;
                year++;
              }
              batchPlan.push({
                proprietorId: this.pageParams.proprietorId,
                maintenanceId: this.orgId,
                planType: "3",
                planStartTime: planStartTime,
                planEndTime: planEndTime,
                planName: planName
              });
            }
            let batchPlanStr = JSON.stringify(batchPlan);
            api.post(serviceUrl, { batchPlan: batchPlanStr }).then(res => {
              if (res && res["code"] == "success") {
                let data = res["data"];
                this.planInfoObj.planLists = data;
                let nums = 0;
                data.forEach(function(item, index) {
                  if (item.status == "1") {
                    nums++;
                  }
                });
                this.planInfoObj.batchNums = nums;
                this.planInfoObj.isShowInfo = true;
              } else {
                Message.error(res["message"]);
              }
            });
          }
          break;
        case "4": //季季度
          break;
        case "5": //年季度
          if (!value1) {
            return false;
          }
          let valueStr = new Date(value1).getFullYear();
          this.planInfoObj.ceratePlanNums = valueStr + "年";
          let planStartTime = valueStr + "-01-01";
          var planEndTime = valueStr + "-12-31";
          var planName = valueStr + "年年计划";
          batchPlan.push({
            proprietorId: this.pageParams.proprietorId,
            maintenanceId: this.orgId,
            planType: "5",
            planStartTime: planStartTime,
            planEndTime: planEndTime,
            planName: planName
          });
          let batchPlanStr = JSON.stringify(batchPlan);
          api.post(serviceUrl, { batchPlan: batchPlanStr }).then(res => {
            if (res && res["code"] == "success") {
              let data = res["data"];
              this.planInfoObj.planLists = data;
              let nums = 0;
              data.forEach(function(item, index) {
                if (item.status == "1") {
                  nums++;
                }
              });
              this.planInfoObj.batchNums = nums;
              this.planInfoObj.isShowInfo = true;
            } else {
              Message.error(res["message"]);
            }
          });
          break;
        case "6": //自定义时间
          if (value2 && value1) {
            this.planInfoObj.ceratePlanNums = "1个";
            let planName =
              new Date(value1).getFullYear() +
              "年" +
              (new Date(value1).getMonth() + 1) +
              "月" +
              new Date(value1).getDate() +
              "日" +
              "-" +
              new Date(value2).getFullYear() +
              "年" +
              (new Date(value2).getMonth() + 1) +
              "月" +
              new Date(value2).getDate() +
              "日" +
              "自定义计划";
            let planStartTime = this.getNowFormatDate(value1);
            let planEndTime = this.getNowFormatDate(value2);
            batchPlan.push({
              proprietorId: this.pageParams.proprietorId,
              maintenanceId: this.orgId,
              planType: "6",
              planStartTime: planStartTime,
              planEndTime: planEndTime,
              planName: planName
            });
            let batchPlanStr = JSON.stringify(batchPlan);
            api.post(serviceUrl, { batchPlan: batchPlanStr }).then(res => {
              if (res && res["code"] == "success") {
                let data = res["data"];
                this.planInfoObj.planLists = data;
                let nums = 0;
                data.forEach(function(item, index) {
                  if (item.status == "1") {
                    nums++;
                  }
                });
                this.planInfoObj.batchNums = nums;
                this.planInfoObj.isShowInfo = true;
              } else {
                Message.error(res["message"]);
              }
            });
          }
          break;
      }
    },
    //季度改变
    seasonChange() {
      let value = this.season.seasonValue;
      if (!value.trim()) {
        return false;
      }
      let planName = "",
        planStartTime,
        planEndTime,
        batchPlan = [];
      switch (value) {
        case "1":
          this.planInfoObj.ceratePlanNums = "第一季度";
          planName = new Date().getFullYear() + "年第一季度季计划";
          planStartTime = new Date().getFullYear() + "-" + "01" + "-" + "01";
          planEndTime = new Date().getFullYear() + "-" + "03" + "-" + "31";
          break;
        case "2":
          this.planInfoObj.ceratePlanNums = "第二季度";
          planName = new Date().getFullYear() + "年第二季度季计划";
          planStartTime = new Date().getFullYear() + "-" + "04" + "-" + "01";
          planEndTime = new Date().getFullYear() + "-" + "06" + "-" + "30";
          break;
        case "3":
          this.planInfoObj.ceratePlanNums = "第三季度";
          planName = new Date().getFullYear() + "年第三季度季计划";
          planStartTime = new Date().getFullYear() + "-" + "07" + "-" + "01";
          planEndTime = new Date().getFullYear() + "-" + "09" + "-" + "30";
          break;
        case "4":
          this.planInfoObj.ceratePlanNums = "第四季度";
          planName = new Date().getFullYear() + "年第四季度季计划";
          planStartTime = new Date().getFullYear() + "-" + "10" + "-" + "01";
          planEndTime = new Date().getFullYear() + "-" + "12" + "-" + "31";
          break;
      }
      batchPlan = [
        {
          proprietorId: this.pageParams.proprietorId,
          maintenanceId: this.orgId,
          planType: "4",
          planStartTime: planStartTime,
          planEndTime: planEndTime,
          planName: planName
        }
      ];
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/batchJudgePlanExists";
      let batchPlanStr = JSON.stringify(batchPlan);
      api.post(serviceUrl, { batchPlan: batchPlanStr }).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"];
          this.planInfoObj.planLists = data;
          let nums = 0;
          data.forEach(function(item, index) {
            if (item.status == "1") {
              nums++;
            }
          });
          this.planInfoObj.batchNums = nums;
          this.planInfoObj.isShowInfo = true;
        } else {
          Message.error(res["message"]);
        }
      });
    },
    //获取当前时间
    getNowFormatDate(val) {
      let date = new Date(val);
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate =
        date.getFullYear() + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //获取两个时间之间相差的月份
    monthDiff(d1, d2) {
      var months;
      months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth() + 1;
      months += d2.getMonth() + 1;
      return months <= 0 ? 1 : months + 1;
    },
    //获取某月的天数
    getMonthDays(year, month) {
      return (
        [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] ||
        (this.isLeapYear(year) ? 29 : 28)
      );
    },
    //判断是否为闰年
    isLeapYear(year) {
      return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    },
    //初始化时间设置
    initializationSimeSettings() {
      (this.$data.pickerOptions = {
        //限制选择时间
        disabledDate(time) {
          switch (planType) {
            case "1":
              return time.getTime() < Date.now() - 8.64e7;
              break;
            case "2":
              return (
                time.getTime() <
                Date.now() -
                  (new Date().getDay() == "0" ? 7 : new Date().getDay()) *
                    8.64e7
              );
              break;
            case "3":
              return (
                time.getTime() < Date.now() - new Date().getDate() * 8.64e7
              );
              break;
            case "4":
              return time.getTime() < Date.now() - 8.64e7;
              break;
            case "5":
              return (
                time.getFullYear() <= new Date(Date.now()).getFullYear() - 1
              );
              break;
            case "6":
              return time.getTime() < Date.now() - 8.64e7;
              break;
          }
        },
        firstDayOfWeek: 1
      }),
        (this.$data.pickerOptions1 = {
          disabledDate: function(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
          firstDayOfWeek: 1
        });
    },
    //隐藏计划列表
    closePlanList(divId) {
      $("#" + divId).hide();
    },
    //展示计划列表
    openPlanList(divId) {
      $("#" + divId).show();
    },
    //确定复制计划
    confirmHis() {
      if(this.historyObj.hisVal && this.historyObj.dataList&&this.historyObj.dataList.length>0){
        let list = this.historyObj.dataList;
        for(let i=0;i<list.length;i++){
          if(this.historyObj.hisVal === list[i].id){
            this.initTree(this.treeObj.treeList,list[i].ids);
          }
        }
      }
    },
    //初始化树
    initSystemTree() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/plan/getInspectionItems";
      let params = {
        orgId: this.orgId,
        proprietorId: this.pageParams.proprietorId
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
          this.initTree(data,"");
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
      let checkNodes = this.tree.getCheckedNodes();
      let idsArr = ["0200000003", "020000000301", "0200000004", "020000000401"]; //直接选中
      for (let i = 0, l = checkNodes.length; i < l; i++) {
        if (checkNodes[i].checkType == planType) {
          this.setCheckNode(checkNodes[i]);
          for (let j = 0; j < idsArr.length; j++) {
            if (idsArr[j] == checkNodes[i].id) {
              this.tree.setChkDisabled(nodeList[0], true);
              this.tree.setChkDisabled(checkNodes[i], true);
              this.setChkDisabled(checkNodes[i]);
            }
          }
        }
      }
      this.treeCheck();
    },
    //默认需要勾选的节点
    checkNodesFn(data,ids){
      let arr = JSON.parse(JSON.stringify(data));
      if(ids.length > 0) {
        let idArr = ids.split(",");
        for(let i = 0; i < arr.length; i++) {
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
    //不可点击的
    setChkDisabled(node) {
      if (node.pId != "-1") {
        var nodeArr = this.tree.getNodesByParam("id", node.pId);
        if (nodeArr && nodeArr.length > 0) {
          this.tree.setChkDisabled(nodeArr[0], true);
          this.setChkDisabled(nodeArr[0]);
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
        proprietorId: this.pageParams.proprietorId,
        unitSource: this.pageParams.unitSource,
        proprietorName: this.pageParams.proprietorName,
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
    //保存数据
    savePlan(){
      let jsonPlans = [],repetitionPlan=0,newPlan=0,toast="";
      //计划类型
      if(!planType){
        Message.error("计划类型不能为空!");
        return;
      }
      //计划时间
      if(!this.dateOptions.planDataPickerStart || !this.dateOptions.planDataPickerEnd){
        Message.error("计划时间不能为空!");
        return;
      }
      //勾选树
      let ids = this.getCheckNodes();
      if(!ids){
        Message.error("请选择设备检查项!");
        return;
      }
      //预计生成计划
      let _this = this;
      if(this.planInfoObj.planLists && this.planInfoObj.planLists.length>0){
        this.planInfoObj.planLists.forEach(function(item, index) {
          let _planName = item.perList.planName.replace(/\s/ig, "");
          if(item.status == "0") {
            newPlan++;
            if(item.perList.planName == '' || _planName == '') {
              Message.error("计划名称不能为空!");
              return;
            }
            item.perList.proprietorName = _this.pageParams.proprietorName;
            item.perList.checkItmes = ids;
            item.perList.planEncatId = api.getGlobalVal("maintenance_userObj").id;
            jsonPlans.push(item.perList)
          } else {
            repetitionPlan++;
          }
        })
      }
      if(jsonPlans.length == "0") {
        toast = "新建计划全部与已有计划重复，预计新生成0个例行维保计划.";
      }else if(jsonPlans.length == this.planInfoObj.planLists.length){
        toast = "预计新生成" + newPlan + "个例行维保计划.";
      }else{
        toast = "新建计划中包含" + repetitionPlan + "个计划与已有计划重复，预计新生成" + newPlan + "个例行维保计划.";
      }
      this.$confirm(
        toast,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        let url = api.forent_url.maintenance_service_url + "/plan/batchAddPlan";
        api.post(url,{jsonPlan:JSON.stringify(jsonPlans)}).then(res => {
          if(res && res["code"]=="success"){
            Message.success("保存计划成功！");
            this.goBack();
          }else{
            Message.error("保存计划失败！");
          }
        })
      });
    },
    //获取选中的节点
    getCheckNodes(){
      let ids = "";
      let checkedData = this.tree.getCheckedNodes();
      let paramNodes = this.tree.getNodesByParam("chkDisabled", true);
      let arr = checkedData.concat(paramNodes);
      if(arr.length > 0) {
        for(let i=0;i<arr.length;i++){
          if(!ids) {
            ids = arr[i].id;
          } else {
            ids = ids + "," + arr[i].id;
          }
       }
      }
      return ids;
    }
  },
  watch: {
    //监听计划类型下拉菜单
    planType(value) {
      this.dateOptions.planDataPickerStart = ""; //重置日期
      this.dateOptions.planDataPickerEnd = ""; //重置日期
      this.season.isSeasonShow = false; //季度不展示
      this.planInfoObj.isShowInfo = false; //是否展示信息
      this.initializationSimeSettings(); //初始化一下可选范围
      planType = value;
      this.initTree(this.treeObj.treeList,"");//重新初始化一下树，选择上该选择的
      this.historyObj.referenceHistory = false;
      this.historyObj.hisVal = "";
      switch (value) {
        case "1":
          this.planInfoObj.planTypeName = "日计划";
          this.dateOptions.dateType = "date";
          this.dateOptions.dateFormat = "yyyy-MM-dd";
          this.dateOptions.placeholderStart = "请选择开始时间";
          this.dateOptions.placeholderEnd = "请选择结束时间";
          this.dateOptions.whetherToShowTheSecondTimeSelector = true;
          break;
        case "2":
          this.planInfoObj.planTypeName = "周计划";
          this.dateOptions.dateType = "week";
          this.dateOptions.dateFormat = "yyyy 第 WW 周";
          this.dateOptions.placeholderStart = "请选择开始周";
          this.dateOptions.placeholderEnd = "请选择结束周";
          this.dateOptions.whetherToShowTheSecondTimeSelector = true;
          break;
        case "3":
          this.planInfoObj.planTypeName = "月计划";
          this.dateOptions.dateType = "month";
          this.dateOptions.dateFormat = "yyyy-MM";
          this.dateOptions.placeholderStart = "请选择开始月";
          this.dateOptions.placeholderEnd = "请选择结束月";
          this.dateOptions.whetherToShowTheSecondTimeSelector = true;
          break;
        case "4": //季度不能用时间选择器
          this.planInfoObj.planTypeName = "季计划";
          this.dateOptions.whetherToShowTheSecondTimeSelector = false;
          this.season.isSeasonShow = true; //季度展示 判断那个季度不展示
          break;
        case "5":
          this.planInfoObj.planTypeName = "年计划";
          this.dateOptions.dateType = "year";
          this.dateOptions.dateFormat = "yyyy";
          this.dateOptions.placeholderStart = "请选择年份";
          this.dateOptions.whetherToShowTheSecondTimeSelector = false;
          break;
        case "6":
          this.planInfoObj.planTypeName = "自定义计划";
          this.dateOptions.dateType = "date";
          this.dateOptions.placeholderStart = "请选择开始时间";
          this.dateOptions.placeholderEnd = "请选择结束时间";
          this.dateOptions.whetherToShowTheSecondTimeSelector = true;
          break;
      }
    },
    "historyObj.referenceHistory": {
      handler(newBool, oldBool) {
        if (newBool) {
          //查询历史维保计划
          let serviceUrl =
            api.forent_url.maintenance_service_url +
            "/plan/getMaintenancePlanList";
          let params = {
            planType: planType,
            maintenanceId: this.orgId,
            proprietorId: this.pageParams.proprietorId,
            pageNo: 1,
            pageSize: 100,
            copyStatus: 1
          };
          api.post(serviceUrl, params).then(res => {
            if (res && res["code"] == "success") {
              let data = res["data"].rows;
              let arr = [];
              if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  let obj = {
                    value: data[i].id,
                    label: data[i].planName
                  };
                  arr.push(obj);
                }
              }
              this.historyObj.dataList = data;
              this.historyObj.hisDataList = arr;
            } else {
              this.historyObj.hisDataList = [];
              Message.error(res["message"]);
            }
          });
        } else {
          this.historyObj.hisDataList = [];
        }
      },
      immediate: true
    },
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
    //初始化时间
    this.initializationSimeSettings();
    //初始化系统树
    this.initSystemTree();
  }
};
</script>
<style lang="scss" scoped>
.title {
  height: 1.4rem;
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
  height: calc(100% - 1.4rem - 0.8rem);
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
