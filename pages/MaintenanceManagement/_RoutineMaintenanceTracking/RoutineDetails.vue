<template>
  <el-row style="height: 100%; flex-direction: column;" type="flex" justify="space-between">
    <el-row class="l-head" type="flex" justify="space-between" align="middle">
      <el-col :span="12">
        <!-- 面包屑 -->
        <Title/>
      </el-col>
      <el-col :span="1">
        <el-button class="goBack" type="text" icon="maintenance-back1" @click="cabackList">返回</el-button>
      </el-col>
    </el-row>
    <el-row class="head">
      <el-row class="titles borderB" type="flex">
        <div style="margin: 0 10px;">
          <span></span>
          <h2>{{head.planName}}</h2>
        </div>
        <el-col :span="4" class="label">
          <span v-if="head.norm==0" class="norm">不规范</span>
          <span v-if="head.isOverdue==1" class="overdue">逾期</span>
          <span v-if="head.isOperation==1" class="operation">改派</span>
        </el-col>
      </el-row>
      <el-row style="padding: 0.2rem;" class="borderB">
        <el-col :span="5">
          <el-col :span="5">
            <div style="background-color: #1F8FFF;" class="circular">
              <img src="~assets/img/RoutineDetails/executionTime.png" alt>
            </div>
          </el-col>
          <el-col :span="19">
            <el-row class="type">计划累计执行时长</el-row>
            <el-row class="num">{{head.executionTime}}</el-row>
          </el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="5">
            <div style="background-color: #FD773A;" class="circular">
              <img src="~assets/img/RoutineDetails/troubleshootingFault.png" alt>
            </div>
          </el-col>
          <el-col :span="19">
            <el-row class="type">排查故障总数</el-row>
            <el-row class="num">{{head.faultCount}}</el-row>
          </el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="5">
            <div style="background-color: #4ED25C;" class="circular">
              <img src="~assets/img/RoutineDetails/facilitiesMaintenance.png" alt>
            </div>
          </el-col>
          <el-col :span="19">
            <el-row class="type">设施保养总数</el-row>
            <el-row class="num">{{head.maintainCount}}</el-row>
          </el-col>
        </el-col>
        <el-col :span="5">
          <el-col :span="5">
            <div style="background-color: #BC78F0;" class="circular">
              <img src="~assets/img/RoutineDetails/maintenanceEquipment.png" alt>
            </div>
          </el-col>
          <el-col :span="19">
            <el-row class="type">维修设备总数</el-row>
            <el-row class="num">{{head.repairCount}}</el-row>
          </el-col>
        </el-col>
      </el-row>
      <el-row style="padding: 0.1rem; position: relative;">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="wb-plan-item swiper-slide swiper-no-swiping" :class="[item.states == 'complete' ? 'wb-plan-completed':'',item.states == 'cur_complete' ? 'wb-plan-current':'']"
              style="overflow: hidden; margin-right: 0px!important;" v-for="(item,index) in measur" :key="index">
              <span class="wb-plan-dot wb-dot-default">{{index + 1}}</span>
              <h5>{{item.processName}}</h5>
              <p :style="item.states != 'uncomplete' ? '' : 'opacity:0'">{{item.dealTime}}</p>
            </div>
          </div>
        </div>
        <div class="maintenance-pullWest leftArrow" @click="prev()" v-if="measur.length > 6"></div>
        <div class="maintenance-pullWest rightArrow prohibit" @click="next()" v-if="measur.length > 6"></div>
      </el-row>
    </el-row>
    <el-row class="tab flex1">
      <el-tabs v-model="activeName" @tab-click="handleClick" style="width:98%;margin:0 auto;height:100%">
        <el-tab-pane label="维保内容" name="first">
          <el-scrollbar style="height: 100%;">
            <el-row :span="24" style="padding: 0.1rem 0.34rem; font-size: 0.16rem; color: #5F687F;">
              <el-row style="text-align:left;" :span="24">
                <el-col :span="8">
                  <span class="colorH">业主单位：</span>
                  <span>{{content.proprietorName}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="colorH">维保执行人员：</span>
                  <span>{{content.maintenanceUsers}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="colorH">消防安全管理人：</span>
                  <span>{{content.fireSafetySupervisor}}</span>
                </el-col>
              </el-row>
              <el-row style="text-align:left;" :span="24">
                <el-col :span="8">
                  <span class="colorH">计划名称：</span>
                  <span>{{content.planName}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="colorH">计划时间：</span>
                  <span>{{content.planTime}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="colorH">计划类型：</span>
                  <span>{{content.planType}}</span>
                </el-col>
              </el-row>
              <el-row style="text-align:left;" :span="24">
                <el-col :span="8">
                  <span class="colorH">服务状态：</span>
                  <span>{{content.serviceState}}</span>
                </el-col>
                <el-col :span="8">
                  <span class="colorH">服务及时性：</span>
                  <span>{{content.servicePromptness}}</span>
                </el-col>
              </el-row>
              <el-row style="text-align:left;" :span="24">
                <el-col :span="3">
                  <span class="colorH">是否规范：</span>
                  <span>{{content.norm ? content.norm : '--'}}</span>
                </el-col>
                <el-col :span="21">
                  <el-row :span="24" v-if="normList.length > 0">
                    <el-col :span="10" v-for="(item, index) in normList" :key="index">
                      <span>
                        {{index + 1}}.
                        <span>{{item.superviseContent}}</span>
                        <span
                          :class="item.isStandard == 1 ? 'maintenance-sureHalf success' : 'maintenance-errorHalf error'"
                        ></span>
                      </span>
                      <br>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
            <el-table
              :data="check"
              style="width: 100%; font-size: 0.18rem;"
              id="table"
              :row-key="getRowKeys"
              :expand-row-keys="expands"
              @expand-change="expandSelect"
            >
              <el-table-column type="expand" :show-overflow-tooltip="true" align="center">
                <template slot-scope="scope">
                  <el-table
                    v-if="scope.row.children.length>0"
                    :show-header="false"
                    :data="scope.row.children"
                    style="width: 100%; font-size: 0.18rem;"
                    id="professionalsTable"
                  >
                    <el-table-column width="48px"></el-table-column>
                    <el-table-column min-width="20%"></el-table-column>
                    <el-table-column
                      prop="name2"
                      :show-overflow-tooltip="true"
                      align="center"
                      min-width="22%"
                    ></el-table-column>
                    <el-table-column
                      prop="name3"
                      :show-overflow-tooltip="true"
                      align="center"
                      min-width="28%"
                    ></el-table-column>
                    <el-table-column
                      prop="planMaintenCount"
                      :show-overflow-tooltip="true"
                      align="center"
                      min-width="10%"
                    ></el-table-column>
                    <el-table-column
                      prop="realTimeCount"
                      :show-overflow-tooltip="true"
                      align="center"
                      min-width="10%"
                    ></el-table-column>
                    <el-table-column
                      prop="localFaultCount"
                      :show-overflow-tooltip="true"
                      align="center"
                      min-width="10%"
                    ></el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                label="系统类别"
                prop="name1"
                :show-overflow-tooltip="true"
                align="center"
                min-width="20%"
              ></el-table-column>
              <el-table-column
                label="维保项目"
                prop="name2"
                :show-overflow-tooltip="true"
                align="center"
                min-width="22%"
              ></el-table-column>
              <el-table-column
                label="维保内容"
                prop="name3"
                :show-overflow-tooltip="true"
                align="center"
                min-width="28%"
              ></el-table-column>
              <el-table-column
                label="计划维保数量"
                prop="planMaintenCount"
                :show-overflow-tooltip="true"
                align="center"
                min-width="10%"
              ></el-table-column>
              <el-table-column
                label="实时监测反馈"
                prop="realTimeCount"
                :show-overflow-tooltip="true"
                align="center"
                min-width="10%"
              ></el-table-column>
              <el-table-column
                label="现场发现故障"
                prop="localFaultCount"
                :show-overflow-tooltip="true"
                align="center"
                min-width="10%"
              ></el-table-column>
            </el-table>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="完成情况跟踪" name="second">
          <el-scrollbar style="height: 100%;">
            <el-row class="divH">
              <el-row v-for="(item,index) in situation" :key="index" :class="['ul', index % 2 == 0 ? 'bgc' : '']">
                <el-col :span="3" style="color:#000">【{{item.processName}}】</el-col>
                <el-col :span="4" style="color: #5F687F;">{{item.dealTime}}</el-col>
                <el-col :span="17" style="color: #5F687F;">{{item.planDetails}}</el-col>
              </el-row>
            </el-row>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="监测反馈" name="third">
          <!-- 搜索栏 -->
          <el-row class="contract-operation-head" type="flex" align="middle">
            <el-col :span="5">
              <div class="div-flex">
                <span class="fs18px colorLabel">设备类型：</span>
                <el-select v-model.trim="userIds" @change="searchFilter()" clearable placeholder="请选择" class="flex1">
                  <el-option
                    v-for="(item, index) in userIdsOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-row class="div-flex align_center">
                <span class="fs18px colorLabel">申请时间：</span>
                <el-date-picker
                  size="mini"
                  style="width: 180px;"
                  ref="start_ref"
                  v-model="startTime"
                  type="datetime"
                  placeholder="请选择开始时间"
                  :picker-options="pickerStartOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  @change="getStartTime"
                  :default-time="defalutTimeStart"
                ></el-date-picker>
                <span style="margin: 0 10px;">~</span>
                <el-date-picker
                  size="mini"
                  style="width: 180px;"
                  v-model="endTime"
                  type="datetime"
                  placeholder="请选择结束时间"
                  :picker-options="pickerEndOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  @change="getEndTime"
                  :default-time="defalutTimeEnd"
                ></el-date-picker>
              </el-row>
            </el-col>
            <!-- <el-col :span="1">
              <div class="div-flex">
                <el-button
                  class="flex1"
                  type="warning"
                  @click="searchFilter()"
                  @keyup.enter="searchFilter()"
                >搜索</el-button>
              </div>
            </el-col> -->
          </el-row>
          <!-- 表格 -->
          <el-row class="table-list table_list_two">
            <Table
              ref="tableFeedBack"
              :tableList="dataList"
              :options="optionsFeedBack"
              :columns="columnsFeedBack"
              :operates="operatesFeedBack"
              :url="requestFeedBackUrl"
            ></Table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-row>
</template>
<script>
import axios from "axios";
import api from "~/config/http";
import Title from "~/components/Title";
import Table from "~/components/Table";
import mixin from "~/mixin/mixin";
let Swiper= null;
export default {
  mixins: [mixin],
  components: {
    Table,
    Title
  },
  data() {
    return {
      name: "", // 缓存tab切换name
      active: null, // 步骤条
      measur: [], // 步骤条
      pageParams: {}, // 跳转时传入参数
      head: "", // 详情页头部数据缓存
      tableData: [],
      wait: "wait",
      success: "success",
      content: "", // 维保内容基本信息
      normList: [], // 维保内容是否规范信息
      activeName: "first", // tab栏默认页
      situation: [], // 完成跟踪情况
      check: [], // 维保内容表格数据
      startTime: "", // 开始时间
      defalutTimeStart: "",
      endTime: "", // 结束时间
      defalutTimeEnd: "",
      userIds: "", // 设备类型id
      userIdsOptions: [
        {
          value: "",
          label: "请选择"
        }
      ], // 设备类型下拉选项
      dataList: [], // table数据,
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        isShowSerialNumber: false // 是否展示序号
      }, // table 的参数
      optionsFeedBack: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        isShowSerialNumber: true // 是否展示序号
      }, // table 的参数
      columnsFeedBack: [
        {
          prop: "alarmTime",
          label: "数据时间",
          align: "center",
          minWidth: "18%"
        },
        {
          prop: "loopPoint",
          label: "回路点位",
          align: "center",
          minWidth: "18%"
        },
        {
          prop: "deviceType",
          label: "设施类型",
          align: "center",
          minWidth: "18%"
        },
        {
          prop: "deviceAddress",
          label: "设施地址",
          align: "center",
          minWidth: "28%"
        },
        {
          label: "运行状态",
          align: "center",
          minWidth: "18%",
          formatter: (row, column, cellValue) => {
            return `<span>报警</span>`;
          }
        }
      ], // 需要展示的列
      operatesFeedBack: {}, // 操作按钮
      requestFeedBackUrl: api.forent_url.maintenance_service_url + "plan/getRealTimeMonitoring",
      pickerStartOptions: {
        disabledDate(time) {
          return;
        }
      },
      pickerEndOptions: {
        disabledDate(time) {
          return;
        }
      },
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      mySwiper:null,
      expands: [],
      step: '',
      flag: true
    };
  },
  mounted() {
    this.pageParams = this.$route.params;
     this.$nextTick(function(){
      if (process.browser) {
        Swiper = require('swiper');
        window.onresize = () => {
          return (() => {
            this.loadData();
            this.getMaintenanceContents(); //维保内容
          })();
        };
      }
    })
    this.loadData();
    this.getMaintenanceContents(); //维保内容
  },
  methods: {
    prev () {
      if (this.flag && this.step > 6) {
        this.flag = false;
        this.mySwiper.swipePrev();
      }
    },
    next () {
      if (this.flag && this.step < this.measur.length) {
        this.flag = false;
        this.mySwiper.swipeNext();
      }
    },
    swiperList () {
      let _this = this;
      _this.mySwiper = new Swiper('.swiper-container', {
        noSwiping: true,
        slidesPerView: 6,
        calculateHeight: true,
        initialSlide: _this.measur.length - 1,
        onSlidePrev: function(swiper){
          if (_this.step < 7) {
            $('.leftArrow').addClass('prohibit');
          } else  if (_this.step == 7) {
            $('.leftArrow').addClass('prohibit');
            $('.rightArrow').removeClass('prohibit');
            _this.step--;
          } else {
            $('.leftArrow').removeClass('prohibit');
            $('.rightArrow').removeClass('prohibit');
            _this.step--;
          }
        },
        onSlideNext: function(swiper){
          if (_this.step > _this.measur.length - 1) {
            $('.rightArrow').addClass('prohibit');
          } else  if (_this.step == _this.measur.length - 1) {
            $('.rightArrow').addClass('prohibit');
            $('.leftArrow').removeClass('prohibit');
            _this.step++;
          } else {
            $('.leftArrow').removeClass('prohibit');
            $('.rightArrow').removeClass('prohibit');
            _this.step++;
          }
        },
        onSlideChangeEnd: function(swiper){
          _this.flag = true;
        },
        onInit: function(swiper){
          swiper.swipeNext()
        }
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true,
        // },
        // // 如果需要前进后退按钮
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev',
        // },
      })
    },
    // 开始时间
    getStartTime(val) {
      console.log("this.startTime", this.startTime);
      this.pickerEndOptions.disabledDate = function(time) {
        return time.getTime() < new Date(val).getTime();
      };
      if (this.startTime && this.endTime || this.startTime == null && this.endTime == null) {
        this.verification();
        this.searchFilter();
      }
    },
    // 结束时间
    getEndTime(val) {
      console.log("this.endTime", this.endTime);
      this.pickerStartOptions.disabledDate = function(time) {
        if (val) {
          return time.getTime() > new Date(val).getTime();
        } else {
          return;
        }
      };
      if (this.startTime && this.endTime || this.startTime == null && this.endTime == null) {
        this.verification();
        this.searchFilter();
      }
    },
    // 时间验证
    verification() {
      let flag = true;
      if (
        new Date(this.endTime).getTime() < new Date(this.startTime).getTime()
      ) {
        this.$message.error("结束时间不能小于开始时间！");
        flag = false;
      }
      return flag;
    },
    testkeepalive(){
      if (this.$vnode && this.$vnode.data.keepAlive)
      {
          if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache)
          {
              if (this.$vnode.componentOptions)
              {
                  var key = this.$vnode.key == null
                              ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
                              : this.$vnode.key;
                  var cache = this.$vnode.parent.componentInstance.cache;
                  var keys  = this.$vnode.parent.componentInstance.keys;
                  if (cache[key])
                  {
                      if (keys.length) {
                          var index = keys.indexOf(key);
                          if (index > -1) {
                              keys.splice(index, 1);
                          }
                      }
                      delete cache[key];
                  }
              }
          }
      }
      this.$destroy();
    },
    // 编辑页面返回按钮
    cabackList() {
      //this.$data = {};
      //_this.$route.path = "";
      //console.log('this.$vnode:'+this.$vnode);

      //common.delKeepAlive(this);
      this.delKeepAlive();

      //console.log('this.$vnode:'+this.$vnode);
      //this.testkeepalive();
      this.$router.push({
        name: "MaintenanceManagement-RoutineMaintenanceTracking",
        params: this.pageParams
      });
    },
    // 显示编辑页信息
    loadData() {
      // 步骤条
      api.get(
        api.forent_url.maintenance_service_url +"/plan/getRoutineTrackBasicInfo",
        // api.forent_url.maintenance_service_url + "/mainManage/getRoutineTrackBasicInfo",
          {planId: this.pageParams.id}
        )
        .then(res => {
          if (res && res.code == "success") {
            this.head = res.data;
            this.measur = res.data.processList;
            this.step = this.measur.length;
            this.active = res.data.processList.length + 1;
            this.$nextTick(callback=>{
              this.swiperList();
              // if (this.step < 6) {
              //   $('.maintenance-pullWest').addClass('hide');
              //   $('.wb-plan-item').css('height', '37.3px')
              // } else {
                // $('.wb-plan-item').css('height', '112px');
                // $('.swiper-wrapper').css('height', '112px');
              // }
              // hide
            })
          }
        });
    },
    // tab切换
    handleClick(tab, event) {
      this.name = tab.name;
      if (tab.name == "first") {
        this.getMaintenanceContents(); //维保内容
      } else if (tab.name == "second") {
        this.getCompletionTracking(); //完成情况跟踪
      } else if (tab.name == "third") {
        this.equipmentType(); //设备类型
        this.getMonitoringFeedback(); //监测反馈列表
      }
    },
    // 维保内容
    getMaintenanceContents() {
      api
        .get(
          api.forent_url.maintenance_service_url + "plan/getPlanContent",
          // api.forent_url.maintenance_service_url + "/mainManage/getPlanContent",
          {
            planId: this.pageParams.id
          },
          5000
        )
        .then(res => {
          if (res && res.code === "success") {
            this.isLoading = false;
            this.check = res.data.checkList;
            // 存储缓存id
            let tempId = "";
            // 存储index
            let tempIndex = -1;
            // 处理后的list
            let arr = [];
            for (let i = 0; i < this.check.length; i++) {
              let item = this.check[i];
              item.id = i + "";
              item.uKey = i;
              item.uniqKey = new Date().getTime();
              // 上次id==当前迭代元素的id1
              if (tempId == item.id1) {
                if (arr[tempIndex]) {
                  arr[tempIndex].children.push(item);
                }
              } else {
                // 上次元素id！=当前迭代远的id1
                tempId = item.id1;
                tempIndex++;
                item.children = [];
                arr.push(item);
              }
            }
            this.check = arr;
            this.content = res.data.planContent;
            this.normList = res.data.planContent.normList;
          } else {
            this.isLoading = false;
            // this.tableData = [];
          }
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
          this.$message({ type: "warning", message: "加载超时,请重新加载!" });
        });
    },
    // 完成情况跟踪
    getCompletionTracking() {
      api
        .get(
          api.forent_url.maintenance_service_url + "plan/getPlanTracking",
          {
            planId: this.pageParams.id
          },
          5000
        )
        .then(res => {
          if (res && res.code === "success") {
            this.situation = res.data.processList;
          }
        })
        .catch(err => {
          this.$message({ type: "warning", message: "加载超时,请重新加载!" });
        });
    },
    // 监测反馈列表
    getMonitoringFeedback() {
      let params = {
        planId: this.pageParams.id
      };
      this.$refs.tableFeedBack.queryTableListByParams(params);
    },
    // 设备类型
    equipmentType() {
      api
        .get(
          api.forent_url.maintenance_service_url +
            "plan/getMonitorDeviceTypeInfoList"
        )
        .then(res => {
          if (res && res.code === "success") {
            res.data.forEach(element => {
              this.userIdsOptions.push({
                value: element.deviceTypeId,
                label: element.deviceTypeName
              });
            });
          }
        });
    },
    // 搜索过滤数据
    searchFilter() {
      if (!this.verification()) {
        return;
      }
      let params = {};
      (params.planId = this.pageParams.id), (params.userIds = this.userIds);
      params.startTime = this.startTime ? this.startTime : "";
      params.endTime = this.endTime ? this.endTime : "";
      this.$refs.tableFeedBack.queryTableListByParams(params);
    },
    //控制只展示一行
    expandSelect(row, expandedRows) {
      let _this = this;
      if (expandedRows.length) {
        _this.expands = [];
        if (row) {
          _this.expands.push(row.id);
        }
      } else {
        _this.expands = [];
      }
    },
  }
};
</script>
<style lang="scss" scoped>
#table /deep/.el-table__body-wrapper tr td:nth-child(2) .el-table__expand-icon {
  display: none;
}

  @media all and (-ms-high-contrast: none),
(-ms-high-contrast: active) {
   /deep/.el-scrollbar__bar{
  	bottom:-15px;
  }
}
.head {
  background-color: #fff;
  margin-bottom: 0.2rem;
  .swiper-container {
    width: 95%;
    // height: auto;
    .wb-plan-item {

      text-align: center;
      position: relative;
      h5 {
        padding-bottom: 24px;
        color: #AFAFAF;
        font-weight: 600;
        font-size: 0.16rem;
      }
       p {
        padding-top: 24px;
        color: #5F687F;
        font-size: 0.16rem;
        font-weight: 500;
      }
    }
    .wb-plan-completed {
      h5 {
        color: #5F687F;
      }
    }
    .wb-plan-current {
      h5 {
        color: #5F687F;
      }
    }
  }
  
  .wb-plan-item:before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    content: '';
    width: 100%;
    height: 4px;
    background-color: #ccc;
    margin: 0 2px;
  }
  .wb-plan-completed .wb-dot-default, .wb-plan-completed:before {
    background-color: #70d859;
  }
  .wb-plan-item .wb-plan-dot, .wb-plan-item:before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .wb-plan-item .wb-plan-dot {
    display: inline-block;
    width: 22px;
    height: 22px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 22px;
    border-radius: 50%;
  }
  .wb-plan-current .wb-dot-default, .wb-plan-current:before {
    background-color: #24bd00;
  }
  .wb-dot-default {
    background-color: #ccc;
  }
  .wb-plan-item .wb-plan-dot {
    display: inline-block;
    width: 22px;
    height: 22px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 22px;
    border-radius: 50%;
  }
  .wb-plan-item .wb-plan-dot, .wb-plan-item:before {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .swiper-slide[data-v-0e4aa71a] {
    width: 16.66%;
  }
  .wb-plan-completed:before {
    background-color: #70d859;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    content: '';
    width: 100%;
    height: 4px;
  }
  .wb-plan-current:before {
    background-color: #24bd00;
  }
  .borderB {
    border-bottom: 1px solid #e6e6e6;
    .type {
      color: #5f687f;
      font-size: 0.18rem;
      line-height: 0.18rem;
      margin-bottom: 10px;
    }
    .num {
      color: #677089;
      font-size: 0.29rem;
      line-height: 0.29rem;
    }
    .circular {
      width: 0.59rem;
      height: 0.59rem;
      border-radius: 50%;
      img {
        width: 0.33rem;
        height: 0.33rem;
        margin: 0.13rem;
      }
    }
  }
  .titles {
    height: 0.5rem;
    line-height: 0.5rem;
    h2 {
      color: #5f687f;
      font-size: 0.2rem;
      font-weight: bold;
    }
    .label {
      span {
        padding: 1px 5px;
        border-radius: 14px;
        margin-left: 8px;
        font-size: 0.14rem;
      }
      .norm {
        color: #f6394f;
        border: 1px solid #f6394f;
      }
      .overdue {
        color: #fd7575;
        border: 1px solid #fd7575;
      }
      .operation {
        color: #1f8fff;
        border: 1px solid #1f8fff;
      }
    }
  }
  /deep/.el-step.is-center .el-step__description {
    padding: 0;
  }
}
.tab {

  /deep/.el-tabs__item {
    font-size: 0.2rem;
  }
  /deep/.el-tabs__item.is-active {
    color: #ff6822;
  }
  /deep/.el-tabs__item:hover {
    color: #ff6822;
  }
  /deep/.el-tabs__active-bar {
    background-color: #ff6822;
  }
  /deep/.el-tabs__nav {
    height: 0.5rem;
  }
  /deep/.el-tabs__header {
    margin: 0;
  }
  /deep/.el-tabs__content{
  	 height: calc(100% - 50px)
  }
  /deep/.el-tab-pane{
  	height:100%;
  }
  .colorH {
    color: #999;
  }
  .divH {
    padding: 0.1rem;
  }
  .h5 {
    color: #999;
  }
  .ul {
    color: #999;
    font-size: 0.16rem;
    height: 0.5rem;
    line-height: 0.5rem;
    padding: 0 0.1rem;
  }
  .bgc {
    background-color: #F9F9F9;
  }
  .success {
    color: #24bd00;
  }
  .error {
    color: #ff3232;
  }
  .contract-operation-head {
    line-height: 0.6rem;
    background-color: #fff;
  }
  #table {
    /deep/.el-table__expanded-cell[class*="cell"] {
      padding: 0;
    }
  }
}
/deep/.el-button {
  display: inline-block !important;
}
@media screen and (max-width: 1920px) {
  .tab {
    background-color: #fff;
    height: calc(100% - 3.8rem);
  }
  /deep/.el-scrollbar__wrap {
    height: 4.6rem;
  }
  .table-list {
    height: calc(100% - 50px);
  }
}
@media screen and (max-width: 1366px) {
  .tab {
    background-color: #fff;
    height: calc(100% - 4rem);
  }
  /deep/.el-scrollbar__wrap {
    height: 100%;
  }
  .table-list {
    height: 3.3rem;
  }
  .table_list_two {
    /deep/.el-pagination {
      padding: 0px 5px;
      height:calc(100% - .6rem)
    }
  }
  .table-list{
  	height:calc(100% - .6rem)
  }
}
.maintenance-pullWest {
  border: 0;
  margin-top: -.2rem;
  cursor: pointer;
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  top: 50%;
  text-align: center;
  font-size: 0.4rem;
}
.leftArrow {
  left: 5px;
  color: #5F687F;
}
.rightArrow {
  right: 5px;
  color: #5F687F;
  transform: rotate(180deg);
  -ms-transform:rotate(180deg);
  -moz-transform:rotate(180deg);
  -webkit-transform:rotate(180deg);
  -o-transform:rotate(180deg);
  // -webkit-transform-origin: center center;
  // transform-origin: center center;
}
.prohibit {
  color: #DBDBDB;
  cursor: default;
}
.hide {
  visibility: hidden;
}
</style>
