<template>
  <div style="height:100%;width:100%">
    <!-- 面包屑 -->
    <el-row class="l-head">
      <Title />
    </el-row>
    <!-- 搜索栏 -->
    <el-row class="contract-operation-head">
      <el-col :span="5" class="ml-20">
        <div class="div-flex">
          <span class="fs18px colorLabel">业主单位：</span>
          <el-select
            v-model.trim="proprietorId"
            clearable
            placeholder="请选择"
            class="flex1"
            @change="searchFilter()"
          >
            <el-option
              v-for="(item,index) in proprietorList"
              :key="index"
              :label="item.label"
              :title="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="div-flex align_center">
          <span class="demonstration">时间:</span>
          <el-date-picker
            v-model="dataPicker"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择开始日期"
            end-placeholder="请选择结束日期"
            value-format="yyyy-MM-dd"
            class="flex1"
            @change="searchFilter()"
          >
          </el-date-picker>
        </div>
      </el-col>
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
  </div>
</template>
<script>
import api from "~/config/http";
import Table from "~/components/Table";
import Title from "~/components/Title";
import { Message } from "element-ui";
export default {
  components: {
    Table,
    Title
  },
  data() {
    return {
      orgId: "",
      proprietorList: [], //业主单位下拉菜单
      dataPicker:"",//时间值
      proprietorId:"",//业主单位id
      //表格开始
      requestUrl:
        api.forent_url.maintenance_service_url +
        "/maintenance/message/alarmPageList",
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        isShowSerialNumber: true, //是否展示序号
        mutiSelect: false // 是否支持列表项选中功能
      }, // table 的参数
      dataList: [], // table数据,
      operates:{},
      columns: [
        {
          prop: "proprietorName",
          label: "业主单位",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "pushTime",
          label: "时间",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "content",
          label: "消息内容",
          align: "center",
          minWidth: "30%"
        }
      ] // 需要展示的列
    };
  },
  methods: {
    //搜索过滤数据
    searchFilter(){
      let startDate = "";
      let endDate = "";
      if(this.dataPicker){
        startDate = this.dataPicker[0];
        endDate = this.dataPicker[1];
      }
      let params = {
        orgId: this.orgId,
        startDate:startDate,
        endDate:endDate,
        proprietorId:this.proprietorId
      };
      this.$refs.table.queryTableListByParams(params);
    },
    //获取业主单位时间
    getProprietorList() {
      let serviceUrl = api.forent_url.maintenance_service_url + "/serverUnit/getProprietorListByIdAndState";
      let params = {
        pageNo: "1",
        pageSize: "50",
        unitId: this.orgId
      };
      api.post(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"].rows;
          let arr = [];
          data.forEach(function(item, index) {
            arr.push({
              value: item.unitId,
              label: item.unitName
            });
          });
          this.proprietorList = arr;
        } else {
          Message.error(res["message"]);
        }
      });
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params = {
      orgId: this.orgId
    };
    this.$refs.table.queryTableListByParams(params);
    //查询业主单位
    this.getProprietorList();
  }
};
</script>
<style lang="scss" scoped>
.contract-operation-head {
  line-height: 0.6rem;
  background-color: #fff;
  .demonstration {
    font-size: 0.18rem;
    color: #43495a;
    margin-left: 0.3rem;
    margin-right: 0.1rem;
  }
  .searchBtn {
    margin-left: 0.1rem;
    color: #fff;
    background-color: #e6a23c;
    border-radius: 17px;
    width: 0.8rem;
    margin-right: 0.5rem;
  }
}
.table-list {
  height: calc(100% - 1.34rem);
  background-color: #fff;
}
.align_center {
  margin-right: 0.2rem;
}
</style>
