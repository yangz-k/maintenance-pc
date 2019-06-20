<template>
  <div style="height:100%;width:100%">
    <!-- 面包屑 -->
    <el-row class="l-head">
      <Title />
    </el-row>
    <!-- 搜索栏 -->
    <el-row class="contract-operation-head">
      <el-col :span="5" :offset="1">
        <el-input
          class="enterprise-name-search"
          suffix-icon="el-icon-search"
          v-model="proprietorName"
          placeholder="请输入项目名称"
          clearable
          @clear="searchFilter"
          @change="searchFilter"
        >
        </el-input>
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
      orgId: "",
      proprietorName: "", //业主名称搜索
      requestUrl:
        api.forent_url.maintenance_service_url + "/plan/getStatisticalList",
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
          prop: "proprietorName",
          label: "项目名称",
          align: "center",
          minWidth: "18%"
        },
        {
          prop: "dpcount",
          label: "已下发日计划",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "wpcount",
          label: "已下发周计划",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "mpcount",
          label: "已下发月计划",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "qpcount",
          label: "已下发季计划",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "ypcount",
          label: "已下发年计划",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "customcount",
          label: "已下发自定义计划",
          align: "center",
          minWidth: "12%"
        },
        {
          prop: "notcount",
          label: "未下发计划",
          align: "center",
          minWidth: "10%"
        }
      ], // 需要展示的列
      operates: {}
    };
  },
  methods: {
    //按项目名称搜索
    searchFilter() {
      let params = {
        maintenanceId: this.orgId,
        proprietorName: this.proprietorName
      };
      this.$refs.table.queryTableListByParams(params);
    },
    //行点击事件
    rowClick(obj) {
      let _this = this;
      //详情页面包屑
      let paramCrumb = {
        name: "当前例行维保计划列表",//title name
            parName: "例行维保计划制定",//父级title name
            lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
            linkname: "MaintenanceManagement-RoutineMaintenancePlanningControl-ProprietorPlanList",
            path: "MaintenanceManagement-RoutineMaintenancePlanningControl-ProprietorPlanList"
      };
      _this.setDetailBreadcrumb(paramCrumb,true);
      //详情页面包屑 end

      this.$router.push({
        name: "MaintenanceManagement-RoutineMaintenancePlanningControl-ProprietorPlanList",
        params:obj.row
      });
    }
  },
  mounted() {
    //查询列表数据
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params = {
      maintenanceId: this.orgId
    };
    const _this = this;
    this.$nextTick(function(){
      _this.$refs.table.queryTableListByParams(params);
    })
  }
};
</script>
<style lang="scss" scoped>
.contract-operation-head {
  line-height: 0.6rem;
  background-color: #fff;
  .el-icon-search {
    cursor: pointer;
  }
}
.table-list {
  height: calc(100% - 1.34rem);
  background-color: #fff;
}
/deep/.el-table .el-table__row {
  cursor: pointer;
}
/deep/.el-input__suffix-inner {
  cursor: pointer;
}
.enterprise-name-search{
  margin-left: -15.83333%;
}
</style>
