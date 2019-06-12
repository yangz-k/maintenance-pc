<template>
  <el-row class="contract-main">
    <!-- 面包屑 -->
    <el-row class="l-head">
      <Title />
    </el-row>
    <!-- 搜索栏 -->
    <el-row class="contract-operation-head" type="flex" justify="space-around" align="middle">
      <el-col :span="5">
        <div class="div-flex">
          <span class="fs18px colorLabel">维保人员：</span>
          <el-select v-model.trim="userName" @change="searchFilter()" clearable placeholder="请选择" class="flex1">
            <el-option
              v-for="item in userNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="div-flex">
          <span class="fs18px colorLabel">状态：</span>
          <el-select  v-model.trim="status" @change="searchFilter()" clearable placeholder="请选择" class="flex1">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="div-flex align_center">
          <span class="fs18px colorLabel">申请时间：</span>
          <el-date-picker
            style="line-height: 0.6rem;"
            class="flex1"
            v-model="dataPicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="searchFilter()">
          </el-date-picker>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="div-flex">
          <el-input
            class="flex1"
            v-model="informName"
            placeholder="请输入告知单名称"
            clearable="clearable"
            suffix-icon="el-icon-search" 
            @clear="searchFilter()" 
            @change="searchFilter()">
          </el-input>
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
    <!-- 预览弹框 -->
    <el-dialog top="'0'" title="预览" :visible.sync="previewVisible" :close-on-click-modal="false" width="50%" v-dialogDrag>
      <iframe frameborder="0" id="word_href" :src="previewSrc"></iframe>
    </el-dialog>
  </el-row>
</template>
<script>
import axios from "axios";
import api from '~/config/http';
import Table from "~/components/Table";
import Title from "~/components/Title";
export default {
  components: {
    Table,
    Title
  },
  data() {
    return {
      dataList: [], // table数据,
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        mutiSelect: false, // 是否支持列表项选中功能
        isShowSerialNumber: true, // 是否展示序号
      }, // table 的参数
      columns: [
        {
          prop: "informName",
          label: "告知单名称",
          align: "center",
          minWidth: "25%"
        },
        {
          prop: "userName",
          label: "维保人员",
          align: "center",
          minWidth: "20%"
        },
        {
          prop: "stateName",
          label: "状态",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "commitTime",
          label: "上报时间",
          align: "center",
          minWidth: "15%"
        },
        {
          prop: "acceptTime",
          label: "接收时间",
          align: "center",
          minWidth: "15%"
        }
      ], // 需要展示的列
      operates: {
        columnName: '报告',
        widthMin: "10%",
        fixed: "right",
        list: [
          {
            title: "生成报告",
            type: "text",
            icon: "maintenance-download",
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.handleDownload(index, row);
            }
          },
          {
            title: "预览",
            type: "text",
            icon: "maintenance-icon_yan",
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: (index, row) => {
              return false;
            },
            method: (index, row) => {
              this.handlePreview(index, row);
            }
          }
        ]
      }, // 操作按钮
      requestUrl:
        api.forent_url.maintenance_service_url + "maintenance/getMaintenanceInformingList",
      userNameOptions: [
        {
          value: '',
          label: '请选择'
        }
      ], // 维保人员下拉菜单
      statusOptions: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "0",
          label: "待确认"
        },
        {
          value: "1",
          label: "已完成"
        }
      ], // 状态下拉菜单
      status: '',  // 状态
      userName: '',  // 维保人员
      dataPicker: '',  // 时间数据
      informName: '', // 告知单名称
      previewVisible: false,
      previewSrc: '' // 预览src
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params = {
      orgId: this.orgId
    };
    this.$refs.table.queryTableListByParams(params);
    this.getUserNameOptions();
  },
  methods: {
    // 获取维保人员下拉选项
    getUserNameOptions () {
      api.get(api.forent_url.maintenance_service_url + "/userInfo/getUsersByorgId", {
        orgId: api.getGlobalVal("maintenance_userObj").orgCode,
        startTime: '',
        endTime: '',
        userId: '',
        informName: ''
      }).then(res=>{
        if (res.code === 'success') {
          res.data.forEach(element=>{
            this.userNameOptions.push({
              value: element.userId,
              label: element.name
            })
          })
        }
      })
    },
    // 搜索过滤数据
    searchFilter() {
      let params = {};
      params.orgId = this.orgId;
      params.userName = '';
      params.status = this.status;
      params.informName = this.informName;
      params.userId = this.userName;
      if (this.dataPicker) {
        params.startTime = this.dataPicker[0];
        params.endTime = this.dataPicker[1];
      }
      this.$refs.table.queryTableListByParams(params);
    },
    // 下载附件
    handleDownload(index, row) {
			// window.location.href = api.forent_url.maintenance_service_url + "/maintenance/exportNoticeWord?infoId=" + row.id;
      let $a = document.createElement("a");
      $a.setAttribute("href", api.forent_url.maintenance_service_url + "/maintenance/exportNoticeWord?infoId=" + row.id);
      $a.download = row.attachName;
      let evObj = document.createEvent("MouseEvents");
      evObj.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        true,
        false,
        0,
        null
      );
      $a.dispatchEvent(evObj);
    },
    // 预览
    handlePreview(index, row) {
      let _this = this
      api.get(api.forent_url.maintenance_service_url + "/maintenance/previewNoticeWord", {
        infoId: row.id
      }).then(res=>{
        if (res && res.code === 'success') {
          if (res.data) {
            this.previewVisible = true;
            setTimeout(function(){
              _this.previewSrc = api.forent_url.image_url + res.data;
            })
          } else {
            this.$message.error("pdf生成失败！");
          }
        } else {
          this.$message.error(res.message);
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.contract-main {
  height: 100%;
  width: 100%;
  .contract-operation-head {
    line-height: 0.6rem;
    background-color: #fff;
  }
  .table-list {
    height: calc(100% - 1.34rem);
    background-color: #fff;
  }
  /deep/.el-dialog {
    height: 80%;
    margin-top: 0 !important;
    margin-bottom: 0;
  }
  /deep/.el-dialog__wrapper {
    overflow: hidden;
  }
  #word_href {
    width:100%;
    height:100%;
    margin:0 auto;
  }
  /deep/.el-dialog__body {
    height: 94%;
  }
  /deep/.el-input__suffix-inner {
    cursor: pointer;
  }
}
</style>
