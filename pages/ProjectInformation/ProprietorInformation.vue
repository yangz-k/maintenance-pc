<template>
  <div style="height: 100%;width: 100%;">
    <div class="l-head">
      <!-- 面包屑 -->
      <Title />
    </div>
    <div class="switch_tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 服务中 -->
        <el-tab-pane label="服务中" name="first">
          <!-- 下拉框 -->
          <el-row
            type="flex"
            justify="space-between"
            class="align_center search_div operationCon"
          >
            <el-col :span="12" class="div-flex align_center">
              <div class="m-l2rem div-flex align_center">
                <label class="fs16px color_mo">单位来源：</label>
                <el-select
                  clearable
                  v-model="source_value"
                  @change="searchFilter()"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in source_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <!-- 搜索条 -->
              <div
                class="contract-operation-head m-l2rem div-flex align_center"
              >
                <el-input
                  class="enterprise-name-search div-flex align_center"
                  suffix-icon="el-icon-search"
                  v-model.trim="proprietorName"
                  placeholder="请输入企业名称"
                  clearable="clearable"
                  @clear="searchFilter()"
                  @change="searchFilter()"
                >
                  <!-- <i></i> -->
                </el-input>
              </div>
            </el-col>

            <el-button
              class="searchBtn  searchBtn_add border-radius05rem fs14px m-l2rem m-r2rem"
              type="info"
              @click="addUnit()"
              ><b class="el-icon-plus"></b>新增</el-button
            >
          </el-row>
          <!-- 表格 -->
          <div class="table-list table_list_one table_cursor">
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
        </el-tab-pane>

        <!-- 服务终止  -->
        <el-tab-pane label="服务终止" name="second">
          <!-- 下拉框 -->
          <div class="div-flex align_center search_div">
            <!-- 搜索条 -->
            <div class="contract-operation-head m-l2rem div-flex">
              <el-input
                class="enterprise-name-search"
                suffix-icon="el-icon-search"
                v-model="unitName"
                placeholder="请输入企业名称"
                clearable="clearable"
                @clear="searchFilterEnd()"
                @change="searchFilterEnd()"
              ></el-input>
            </div>
          </div>
          <!-- 表格 -->
          <div class="table-list table_list_two">
            <Table
              ref="tableEnd"
              :tableList="dataListEnd"
              :options="options"
              :columns="columnsEnd"
              :operates="operatesEnd"
              :url="requestEndUrl"
              @rowClick="rowClickEnd"
            ></Table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加合同弹框 -->
    <div v-if="addContractObj.dialogFormVisible">
      <AddContract
        ref="AddContract"
        :isSee="addContractObj.isSee"
        @closeAddContractDialog="closeAddContractDialog"
        @addContractCallback="addContractCallback"
      >
      </AddContract>
    </div>
    <!-- 分配维保人员弹框 -->
    <div v-if="distributivePersonnelObj.dialogFormVisible">
      <DistributivePersonnel
        ref="distributivePersonnel"
        :title="distributivePersonnelObj.title"
        :pageName="distributivePersonnelObj.pageName"
        :queryUserListUrl="distributivePersonnelObj.queryUserListUrl"
        :updateUserUrl="distributivePersonnelObj.updateUserUrl"
        @closeDistributivePersonnelDialog="closeDistributivePersonnelDialog"
        @distributivePersonnel="distributivePersonnel"
      >
      </DistributivePersonnel>
    </div>
  </div>
</template>
<script>
import Title from "~/components/Title";
import api from "~/config/http";
import { Message, MessageBox } from "element-ui";
import Table from "~/components/Table";
import AddContract from "~/components/AddMaintenanceContractDialog";
import DistributivePersonnel from "~/components/DistributivePersonnelDialog";
import mixin from "~/mixin/mixin";
export default {
  mixins: [mixin],
  components: {
    Title,
    Table,
    AddContract,
    DistributivePersonnel
  },
  data() {
    return {
      pageParams: {},
      //添加维保合同弹框
      addContractObj: {
        isSee: false,
        dialogFormVisible: false,
        contractObj: {
          contractName: "",
          contractAmount: 0,
          proprietorId: "", //企业id
          proprietorName: "", //企业名称
          applicantTime: ""
        }
      },
      //添加维保合同弹框结束
      //分配人员信息
      distributivePersonnelObj: {
        dialogFormVisible: false,
        title: "绑定服务关系",
        pageName: "proprietorInformation",
        queryUserListUrl:
          api.forent_url.maintenance_service_url +
          "/serverUnit/getUserDistributionList",
        updateUserUrl:
          api.forent_url.maintenance_service_url + "/serverUnit/updateUserRel"
      },
      //分配人员信息结束
      activeName: "first",
      tabName: "",
      source_options: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "服务指定"
        },
        {
          value: "2",
          label: "自建企业"
        }
      ],
      source_value: "",
      orgId: "", //存放当前系统编码
      proprietorName: "", //用于搜索的企业名称
      unitName: "",
      requestUrl:
        api.forent_url.maintenance_service_url +
        "serverUnit/getProprietorListByIdAndState", //服务中
      requestEndUrl:
        api.forent_url.maintenance_service_url +
        "serverUnit/getServiceEndUnitListByOrgId", //服务终止
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        isShowSerialNumber: true,
        mutiSelect: false // 是否支持列表项选中功能
      }, // table 的参数
      initTableParams: {}, //第一次传入的参数
      dataList: [], // table数据,
      dataListEnd: [], // table数据,
      columns: [
        {
          prop: "unitSourceName",
          label: "来源",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "unitName",
          label: "企业名称",
          align: "center",
          minWidth: "25%"
        },
        {
          prop: "contacts",
          label: "消防安全管理人",
          align: "center",
          minWidth: "15%"
        },
        {
          prop: "proprietorPhone",
          label: "电话",
          align: "center",
          minWidth: "15%"
        },
        {
          prop: "unitServiceTime",
          label: "服务期止",
          align: "center",
          minWidth: "25%"
        },
        {
          prop: "buildCount",
          label: "建筑物数量",
          align: "center",
          minWidth: "10%"
        }
      ], // 需要展示的列
      columnsEnd: [
        {
          prop: "unitSourceName",
          label: "来源",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "unitName",
          label: "企业名称",
          align: "center",
          minWidth: "25%"
        },
        {
          prop: "contacts",
          label: "消防安全管理人",
          align: "center",
          minWidth: "15%"
        },
        {
          prop: "contactsTel",
          label: "电话",
          align: "center",
          minWidth: "15%"
        },
        {
          prop: "unitEndTime",
          label: "服务解除时间",
          align: "center",
          minWidth: "25%"
        }
      ], // 需要展示的列
      operates: {
        columnName: "操作",
        width: "200px",
        fixed: "right",
        list: [
          {
            type: "text",
            title: "添加维保合同",
            show: (index, row) => {
              return row.contractStatus != "1";
            },
            icon: "maintenance-contract",
            plain: false,
            disabled: false,
            method: (index, row) => {
              //添加合同
              this.addContractObj.dialogFormVisible = true;
              let _this = this;
              setTimeout(function() {
                _this.$refs.AddContract.$data.contractObj.proprietorId =
                  row.unitId;
              });
            }
          },
          {
            type: "text",
            title: "分配人员",
            show: (index, row) => {
              return row.serviceStatus == "0";
            },
            icon: "maintenance-peopleManagement",
            plain: false,
            disabled: false,
            method: (index, row) => {
              //展示分配人员列表
              this.distributivePersonnelObj.dialogFormVisible = true;
              let _this = this;
              setTimeout(function() {
                row.proprietorId = row.unitId;
                _this.$refs.distributivePersonnel.openPersonnelList(row);
              });
            }
          }
        ]
      },
      operatesEnd: {}
    };
  },
  methods: {
    //关闭添加维保合同的回调
    closeAddContractDialog() {
      this.addContractObj.dialogFormVisible = false;
    },
    //关闭分配人员弹框
    closeDistributivePersonnelDialog() {
      this.distributivePersonnelObj.dialogFormVisible = false;
    },
    // 切换tab
    handleClick(tab, event) {
      this.source_value = '';
      this.proprietorName = '';
      this.unitName = '';
      this.tabName = this.activeName;
      if (tab.name == "first") {
        this.getUintIfo(); //服务中
      } else {
        this.getUintIfoEnd(); //服务终止
      }
    },
    //服务中 搜索
    searchFilter() {
      this.getUintIfo();
    },
    // 服务终止
    searchFilterEnd() {
      this.getUintIfoEnd();
    },
    clearable() {
      return true;
    },
    getUintIfo() {
      //服务中企业
      let params = {
        unitId: this.orgId,
        proprietorName: this.proprietorName,
        unitSource: this.source_value,
        serviceState: "服务中"
      };

      let _this = this;
      _this.$nextTick(function() {
        $(".table_list_one").css(
          "height",
          $(".mainPage").height() -
            $(".search_div").height() -
            $(".el-tabs__header").height() -
            $(".title-main").height() +
            "px"
        );
        _this.$refs.table.queryTableListByParams(params);
      });
    },
    getUintIfoEnd() {
      //服务终止
      let params = {
        serviceUnitId: this.orgId,
        unitName: this.unitName
      };
      this.$refs.tableEnd.queryTableListByParams(params);
      $(".table_list_two").css(
        "height",
        $(".mainPage").height() -
          $(".search_div").height() -
          $(".el-tabs__header").height() -
          $(".title-main").height() +
          "px"
      );
    },
    rowClick(obj) {
        let _this = this;
        //详情页面包屑();
        let paramCrumb = {
          name: "业主信息详情",//title name
              parName: "业主信息",//父级title name
              lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
              linkname: "ProjectInformation-ProprietorInformationControl-ProprietorInformationDetail",
              path: "ProjectInformation-ProprietorInformationControl-ProprietorInformationDetail"
        };
        _this.setDetailBreadcrumb(paramCrumb,true);
        //详情页面包屑 end
        
      //点击服务中列表
      obj.row.tabName = this.activeName;
      if (obj.column.label != "操作") {
        this.$router.push({
          name:
            "ProjectInformation-ProprietorInformationControl-ProprietorInformationDetail",
          params: obj.row
        });
      }
    },
    rowClickEnd(obj) {
      //点击服务终止列表
      obj.row.tabName = this.activeName;
      if (obj.column.label != "操作") {
        this.$router.push({
          name:
            "ProjectInformation-ProprietorInformationControl-ProprietorInformationDetail",
          params: obj.row
        });
      }
    },
    addUnit() {
      this.$router.push({
        name:
          "ProjectInformation-ProprietorInformationControl-ProprietorInformationAdd"
      });
    },
    //添加维保合同之后的回调
    addContractCallback() {
      let params = {
        unitId: this.orgId,
        proprietorName: this.proprietorName,
        unitSource: this.source_value,
        serviceState: "服务中"
      };
      this.$refs.table.queryTableListByParams(params);
    },
    //分配人员之后的回调
    distributivePersonnel() {
      let params = {
        unitId: this.orgId,
        proprietorName: this.proprietorName,
        unitSource: this.source_value,
        serviceState: "服务中"
      };
      this.$refs.table.queryTableListByParams(params);
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    this.pageParams = this.$route.params;
    this.activeName = this.pageParams.tabName
      ? this.pageParams.tabName
      : "first";
    // 进来获取服务中业主信息
    if (this.activeName == "first") {
      this.getUintIfo();
    } else {
      this.getUintIfoEnd();
    }
  }
};
</script>
<style lang="scss" scoped>
.contract-operation-head {
  background-color: #fff;
  .enterprise-name-search {
    width: 2.8rem;
  }
}
.search_div {
  height: 0.6rem;
}
.table-list {
  background-color: #fff;
}
.color_mo {
  color: #43495A;
}
.m-r2rem {
  margin-right: 0.2rem;
}
.m-l2rem {
  margin-left: 0.2rem;
}
.table_cursor /deep/ .el-table__row {
  cursor: pointer;
}
.table_list_two /deep/ .el-table__row {
  cursor: pointer;
}
/deep/.el-input__suffix-inner {
  cursor: pointer;
}
</style>
