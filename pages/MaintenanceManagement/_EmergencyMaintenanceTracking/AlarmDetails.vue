<template>
  <div class="contract-main">
    <el-row class="l-head" type="flex" justify="space-between" align="middle">
        <el-col :span="12">
            <!-- 面包屑 -->
            <Title/>
        </el-col>
        <el-col :span="1">
            <el-button class="goBack" type="text" icon="maintenance-back1" @click="cabackList">返回</el-button>
        </el-col>
    </el-row>
    <!-- 搜索栏 -->
    <el-row type="flex" class="contract-operation-head div-flex align_center" align="middle">
        <el-col :span="8" style="margin-left: 0.2rem;">
            <div class="div-flex">
                <span class="fs18px colorLabel">
                    误报确认时间:
                </span>
                <el-date-picker v-model="dataPicker" @change="searchFilter()" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" class="flex1">
                </el-date-picker>
            </div>
        </el-col>
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
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="showDetail" :title="dialogTitle" class="rotationChart" width="8.6rem" v-dialogDrag top="'0'">
      <el-carousel height="5rem">
        <el-carousel-item v-for="item in picList" :key="item">
          <img :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
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
      showDetail: false,
      dialogTitle:"现场照片",
      pageParams: {}, // 跳转时传入参数
      dataPicker: "", //时间数据
      requestUrl:
        api.forent_url.maintenance_service_url + "/maintenance/getFalseAlarmByOrderId",
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        isShowSerialNumber:false,//是否展示序号
        mutiSelect: false // 是否支持列表项选中功能
      }, // table 的参数
      dataList: [], // table数据,
      columns: [
        {
          prop: "deviceName",
          label: "设备名称",
          align: "center",
          minWidth: "20%"
        },
        {
          prop: "deviceAddress",
          label: "设备位置",
          align: "center",
          minWidth: "30%"
        },
        {
          prop: "issueTime",
          label: "误报确认时间",
          align: "center",
          minWidth: "20%"
        },
        {
          prop: "issueUserName",
          label: "误报确认人",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "issueDesc",
          label: "描述",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "attachPath",
          label: "现场照片",
          align: "center",
          minWidth: "10%",
          formatter: (row, column, cellValue) => {
            if ( row.attachPath.length > 0) {
              const imgUrl = api.forent_url.image_url + row.attachPath[0].substring(0,row.attachPath[0].length-4)+'_35X35'+row.attachPath[0].substring(row.attachPath[0].length-4,row.attachPath[0].length);
              return `<img src="`+imgUrl+`" alt="" class="imgs"></img>`;
            }
          }
        }
      ], // 需要展示的列
      operates: {},
      picList: []
    };
  },
  created(){

  },
  methods: {
    // 编辑页面返回按钮
    cabackList () {
      this.delKeepAlive();//
      this.$router.push({
        name: "MaintenanceManagement-EmergencyMaintenanceTracking-EmeTrackDetails",
        params: this.pageParams
      });
    },
    rowClick (obj) {
      this.picList = [];
      let _this = this;
      if (obj.column.label == "现场照片" && obj.row.attachPath.length > 0) {
        this.showDetail = true;
        if (obj.row.attachPath.length > 0) {
          obj.row.attachPath.forEach(element=>{
            _this.picList.push(api.forent_url.image_url + element)
          })
        }
      }
    },
    //搜索过滤数据
    searchFilter() {
      let params = {};
      params.orderId = this.pageParams.orderId;
      if (this.dataPicker) {
        params.alarmTimeStart = this.dataPicker[0];
        params.alarmTimeEnd = this.dataPicker[1];
      }
      this.$refs.table.queryTableListByParams(params);
    },
  },
  mounted() {
    this.pageParams = this.$route.params;
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params= {
      orderId: this.pageParams.orderId,
    }
    this.$refs.table.queryTableListByParams(params);
  }
};
</script>
<style lang="scss" scoped>

// 轮播图
/deep/.el-dialog__body {
  padding: 5px;
  background-color: #ccc;
}
/deep/.el-carousel__arrow {
  background-color: #5f687f;
  opacity: 0.5;
}
/deep/.el-carousel__arrow:hover {
  background-color: #5f687f;
  opacity: 0.8;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
/deep/.el-carousel__button {
  background-color: #000;
}

.rotationChart {
  img {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
}
// 轮播图



.el-input__inner {
    margin-top: 0.1rem;
    margin-left: 10px;
}
.contract-main {
  height: 100%;
  width: 100%;
  .contract-operation-head {
    line-height: 0.6rem;
    background-color: #fff;
    .el-icon-plus {
      margin-right: 0.05rem;
      margin-left: -0.05rem;
    }
    .add-contract {
      margin-left: 0.5rem;
    }
    .datePicker {
      display: inline-block;
      /*margin-left: 6rem;*/
      span {
        font-size: 0.18rem;
        color: #43495a;
      }
    }
    .enterprise-name-search {
      width: 2.8rem;
      margin-left: 0.5rem;
    }
    .demonstration {
      margin-left: 0.5rem;
      margin-right: 0.1rem;
    }
  }
  .table-list {
    height: calc(100% - 1.34rem);
    background-color: #fff;
  }
  /deep/.imgs {
    display: inline-block;
    cursor: pointer;
    width: 35px;
    height: 35px;
    // margin-top: 5px;
  }
  .table .el-table .cell .ovfl[data-v-e28d5efa] {
    padding: 0;
  }
}

</style>
