<template>
  <el-row class="contract-main">
    <!-- 面包屑 -->
    <el-row class="l-head">
      <Title />
    </el-row>
    <!-- 表格 -->
    <el-row class="table-list">
      <Table
        ref="table"
        :tableList="dataList"
        :options="options"
        :columns="columns"
        :operates="operates"
        :url="requestUrl"
      >
      </Table>
    </el-row>
  </el-row>
</template>
<script>
import axios from "axios";
import api from '~/config/http';
import Table from "~/components/Table";
import Title from "~/components/Title";
import mixin from "~/mixin/mixin";
export default {
  mixins: [mixin],
  components: {
    Table,
    Title
  },
  data(){
    return {
      dataList: [], // table数据,
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        isShowSerialNumber: false, // 是否展示序号
      }, // table 的参数
      columns: [
        {
          prop: "type",
          label: "类型",
          align: "center",
          minWidth: "20%"
        },
        {
          prop: "unitName",
          label: "打卡地点",
          align: "center",
          minWidth: "30%"
        },
        {
          prop: "clockRange",
          label: "打卡范围",
          align: "center",
          minWidth: "20%"
        },
        {
          prop: "clockTime",
          label: "打卡时间",
          align: "center",
          minWidth: "20%"
        }
      ], // 需要展示的列
      operates: {
        widthMin: "10%",
        fixed: "right",
        list: [
          {
            title: "编辑",
            type: "text",
            icon: "maintenance-editAround",
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleEdit(index, row);
            }
          }
        ]
      }, // 操作按钮
      requestUrl: api.forent_url.maintenance_service_url + "clock/getUnitClockRuleList",
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params = {
      orgId: this.orgId
    };
    this.$refs.table.queryTableListByParams(params);
  },
  methods: {
    // 跳转编辑页面
    handleEdit (index, row) {
      let _this = this;
      //详情页面包屑
      let paramCrumb = {
      name: "位置管理编辑",//title name
            parName: "位置管理",//父级title name
            lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
            linkname: "SystemManagement-LocationManagement-LocationManagementEdit",
            path: "SystemManagement-LocationManagement-LocationManagementEdit"
      };
      _this.setDetailBreadcrumb(paramCrumb,true);
      //详情页面包屑 end
          
      console.log('row', row)
      this.$router.push({
        name: "SystemManagement-LocationManagement-LocationManagementEdit",
        params:{
          id: row.id
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.contract-main {
  height: 100%;
  width: 100%;
  .table-list {
    height: calc(100% - .74rem);
    background-color: #fff;
  }
}
.ctrl-map-visible{
  background-color: #fff;
  margin: 0.2rem 0 0.1rem 0;
  .el-button {
    display: inline-block;
  }
}
</style>
