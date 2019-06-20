<template>
  <div class="contract-main">
    <div class="l-head">
      <!-- 面包屑 -->
      <Title />
    </div>
    <div class="contract-operation-head div-flex align_center justify-between">
      <div class="datePicker ml-20">
        <span class="demonstration">服务期止:</span>
        <el-date-picker
          v-model="dataPicker"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="searchFilter()"
        >
        </el-date-picker>
        <el-input
          class="enterprise-name-search"
          suffix-icon="el-icon-search"
          v-model="proprietorName"
          placeholder="请输入企业名称"
          clearable="clearable"
          @clear="searchFilter()"
          @change="searchFilter()"
        ></el-input>
      </div>
      <el-button
        class="add-contract fs14px"
        @click="addContract()"
        type="warning"
        plain
        ><b class="el-icon-plus"></b>新增</el-button
      >
      <!-- <el-button
        class="searchBtn fs14px"
        type="warning"
        @click="searchFilter()"
        @keyup.enter="searchFilter()"
        >搜索</el-button
      > -->
    </div>
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
    <!-- 弹框增加合同信息 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
      v-if="dialogFormVisible"
      :title="dialogTitle"
      class="add-contract-dialog"
      width="8.6rem"
      v-dialogDrag
      top="'0'"
    >
      <el-row>
        <el-col
          ><span class="red">*</span><span>合同名称：</span
          ><el-input
            clearable="clearable"
            type="text"
            v-model="contractObj.contractName"
            v-if="!isSee"
            placeholder="请输入合同名称"
            maxlength="30"
            minlength="2"
          ></el-input
          ><span v-else>{{ contractObj.contractName }}</span></el-col
        >
        <el-col
          ><span class="red">*</span><span>企业名称：</span
          ><el-select
            v-model="contractObj.proprietorId"
            placeholder="请选择"
            class="enterpriseName-select"
            v-if="!isSee"
            filterable
          >
            <el-option
              v-for="(item,index) in enterpriseList"
              :key="index"
              :label="item.label"
              :value="item.value"
              :title="item.label"
            >
            </el-option> </el-select
          ><span v-else>{{ contractObj.proprietorName }}</span></el-col
        >
        <el-col
          ><span class="red">*</span><span>服务期止：</span
          ><el-date-picker
            class="applicantTime"
            v-model="contractObj.applicantTime"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择服务开始时间"
            end-placeholder="请选择服务结束时间"
            value-format="yyyy-MM-dd"
            v-if="!isSee"
          >
          </el-date-picker
          ><span v-else>{{ contractObj.applicantTime }}</span></el-col
        >
        <el-col
          ><span style="visibility: hidden;">*</span><span>合同金额：</span
          ><el-input
            class="contractAmount"
            type="number"
            min="0"
            v-model="contractObj.contractAmount"
            @clear="contractAmountChange()"
            @change="contractAmountChange()"
            v-if="!isSee"
          ></el-input
          ><span v-else>{{ contractObj.contractAmount }}</span
          ><span
            style="font-size: .14rem;color: #b6b6b6;margin-left: 5px;text-align: center;"
            >(万元)(合同金额涉及到合同额与提供维保服务的统计对比)</span
          ></el-col
        >
        <el-col class="system-col"
          ><span class="red">*</span><span>消防系统：</span>
          <div class="system-equipment flex1 div-flex">
            <div
              v-for="(item,index) in systemDataList"
              :key="index"
              v-if="item.pId == '-1'"
              :class="item.id"
              class="div-flex align_center"
            >
              <div
                class="xf-check-box div-flex align_center"
                style="margin-right: .1rem;"
              >
                <input
                  :id="item.id"
                  type="checkbox"
                  name="checkbox"
                  :value="item.id"
                  @click="checkedClick(item.id)"
                  :disabled="isDisabled"
                />
              </div>
              <b :class="item.className"></b>
              <span :title="item.name">{{ item.name }}</span>
            </div>
          </div>
        </el-col>
        <el-col class="system-col div-flex"
          ><span></span><span>服务合同：</span>
          <el-button class='el-button AddAttachments' type="primary" @click="uploadFile()" v-if="!isSee"
            >上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
          <input
            id="fileInput"
            type="file"
            multiple="multiple"
            style="display:none;"
            v-if="!isSee"
          />
          <em v-if="!isSee">*支持word/pdf/jpg/png/bmp/jpeg/gif格式</em>
          <em v-if="isSee">共有{{ fileList.length }}个合同附件</em>
        </el-col>
        <el-col>
          <div class="fileList">
            <div v-for="(item, index) in fileList" :key="index">
              <span>{{ item.name }}</span>
              <b
                v-if="!isSee"
                class="maintenance-circleClose"
                @click="deleteFile(item.id)"
              ></b>
              <b
                v-else
                class="maintenance-download downloadFile"
                style="color:#42abff"
                @click="downloadFile(item)"
              ></b>
            </div>
          </div>
        </el-col>
        <el-col style="text-align: center;" class="confirm-button-div div-flex all_center">
        	<el-button class="wb-clear" style="margin-right: .15rem;" @click="dialogFormVisible=false" round>取消</el-button>
          <el-button
            v-if="!isSee"
            round
            class="wb-sure"
            @click="saveContract()"
            style="display: inline-block;"
            >保存</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import api from "~/config/http";
import Title from "~/components/Title";
import Table from "~/components/Table";
import { Message, MessageBox } from "element-ui";
import download from 'ly-downloader'
export default {
  components: {
    Title,
    Table
  },
  data() {
    return {
      orgId: "",
      dataPicker: "", //时间数据
      proprietorName: "", //企业名称
      isSee: false, //是否是查看
      dialogFormVisible: false, //弹框展示隐藏
      dialogTitle:"添加维保合同",
      contractObj: {
        contractName: "",
        contractAmount: 0,
        proprietorId: "", //企业id
        proprietorName: "", //企业名称
        applicantTime: ""
      },
      enterpriseList: [], //企业下拉框数组
      systemDataList: [], //系统类型
      isDisabled: false, //系统是否可以点击
      fileList: [], //存放文件列表
      requestUrl:
        api.forent_url.maintenance_service_url + "/orgInfo/getOrgContractList",
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
          prop: "contractName",
          label: "合同名称",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "proprietorName",
          label: "企业名称",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "serviceUnitStart",
          label: "服务期始",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "serviceUnitEnd",
          label: "服务期止",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "contractMoney",
          label: "合同总额(万元)",
          align: "center",
          minWidth: "10%"
        }
      ], // 需要展示的列
      operates: {
        // columnName:"操作",
        widthMin: "10%",
        fixed: "right",
        list: [
          {
            // label: "下载",
            type: "text",
            title:"下载",
            show: (index, row) => {
              return row.attachMent.length > 0;
            },
            icon: "maintenance-download",
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.downloadBtn(index, row);
            }
          },
          {
            // label: "删除",
            type: "text",
            title:"删除",
            icon: "el-icon-delete",
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: (index, row) => {
              return false;
            },
            method: (index, row) => {
              this.handleDel(index, row);
            }
          }
        ]
      }
    };
  },
  created(){

  },
  methods: {
    //搜索过滤数据
    searchFilter() {
      let params = {};
      params.orgId=this.orgId;
      params.proprietorName = this.proprietorName;
      if (this.dataPicker) {
        params.serviceUnitStart = this.dataPicker[0];
        params.serviceUnitEnd = this.dataPicker[1];
      }
      this.$refs.table.queryTableListByParams(params);
    },
    //添加合同管理
    addContract() {
      this.isSee = false;
      //清除dialog上的数据
      this.clearContractData();
      this.dialogTitle = "添加维保合同";
      this.dialogFormVisible = !this.dialogFormVisible;
      this.isDisabled = false; //消防系统不能点击
      //查询企业数据
      this.queryEnterpriseList();
      this.getInspectionItems();
    },
    // 选中行
    rowClick(obj) {
      let _this = this;
      if (obj.column.label != "操作") {
        this.dialogTitle = "查看维保合同";
        this.dialogFormVisible = !this.dialogFormVisible; //展示弹框
        this.clearContractData();
        this.isSee = true; //改为查看
        if (obj && obj.row) {
          this.contractObj.contractName = obj.row.contractName;
          this.contractObj.contractAmount = obj.row.contractMoney || 0;
          this.contractObj.proprietorName = obj.row.proprietorName;
          this.contractObj.applicantTime =
            obj.row.serviceUnitStart + "——" + obj.row.serviceUnitEnd;
          //合同附件展示
          let attachMent = obj.row.attachMent;
          let fileArr = [];
          if (attachMent && attachMent.length > 0) {
            for (let i = 0; i < attachMent.length; i++) {
              let obj = {
                name: attachMent[i].attachName,
                attachPath: attachMent[i].attachPath
              };
              fileArr.push(obj);
            }
          }
          this.fileList = fileArr;
          //消防系统勾选
          this.isDisabled = true; //消防系统不能点击
          let serviceUrl =
            api.forent_url.maintenance_service_url +
            "/orgInfo/getContractInfoById";
          api.get(serviceUrl, { id: obj.row.id }).then(res => {
            _this.getInspectionItems().then(() => {
              let strArr = res.data.checkIds.split(",");
              setTimeout(function() {
                for (let j = 0; j < strArr.length; j++) {
                  $("#" + strArr[j]).attr("checked", true);
                  _this.checkedClick(strArr[j]);
                }
              });
            });
          });
        }
      }
    },
    //清空弹框上的数据
    clearContractData() {
      //清除dialog上的数据
      this.contractObj = {
        contractName: "",
        contractAmount: 0,
        proprietorId: "", //企业id
        proprietorName: "", //企业名称
        applicantTime: ""
      };
      this.fileList = [];
      this.systemDataList = [];
    },
    //查询企业数据
    queryEnterpriseList() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "orgInfo/getOrgNameList";
      if (this.enterpriseList && this.enterpriseList.length > 0) {
        return; //已经存在值
      } else {
        api
          .get(serviceUrl, {
            orgId: this.orgId
          })
          .then(res => {
            if (res && res["code"] == "success") {
              this.enterpriseList = res["data"];
            } else {
              Message.error(res.msg);
            }
          });
      }
    },
    //查询消防系统
    getInspectionItems() {
      let _this = this;
      return new Promise(function(re, je) {
        if (_this.systemDataList && _this.systemDataList.length > 0) {
          re();
          return; //已经存在值
        } else {
          let serviceUrl =
            api.forent_url.maintenance_service_url + "/plan/getInspectionItems";
          api.get(serviceUrl).then(res => {
            re();
            if (res && res["code"] == "success") {
              if (res["data"] && res["data"].length > 0) {
                let items = _this.selectChecked(res["data"]);
                _this.systemDataList = items;
              } else {
                Message.error("系统类型为空！");
              }
            } else {
              Message.error(res.msg);
            }
          });
        }
      });
    },
    //处理数据找到对应的图标
    selectChecked(list) {
      var arr = [];
      if (list && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          switch (list[i].id) {
            case "01000000": //消防供电设施
              list[i].className = "maintenance-facility";
              break;
            case "02000000": //火灾自动报警系统
              list[i].className = "maintenance-forewarning";
              break;
            case "03000000": //电气火灾监控系统
              list[i].className = "maintenance-powerUp";
              break;
            case "04000000": //可燃气体探测监控系统
              list[i].className = "maintenance-fire";
              break;
            case "05000000": //消防供水系统
              list[i].className = "maintenance-water";
              break;
            case "06000000": //消火栓（消防炮）灭火系统
              list[i].className = "maintenance-fireHydrant";
              break;
            case "07000000": //自动喷水灭火系统
              list[i].className = "maintenance-fireExtinguishingSprinkler";
              break;
            case "08000000": //泡沫灭火系统
              list[i].className = "maintenance-foamFire-fighting";
              break;
            case "09000000": //气体灭火系统
              list[i].className = "maintenance-gasFireControl";
              break;
            case "10000000": //防排烟系统
              list[i].className = "maintenance-fan";
              break;
            case "11000000": //应急照明、疏散指示系统
              list[i].className = "maintenance-illumination";
              break;
            case "12000000": //应急广播系统
              list[i].className = "maintenance-trumpet";
              break;
            case "13000000": //消防专用电话
              list[i].className = "maintenance-telphone";
              break;
            case "14000000": //防火分隔设施
              list[i].className = "maintenance-fireSeparationFacility";
              break;
            case "15000000": //消防电梯
              list[i].className = "maintenance-fireElevator";
              break;
            case "16000000": //细水雾灭火系统
              list[i].className = "maintenance-waterMist";
              break;
            case "17000000": //干粉灭火系统
              list[i].className = "maintenance-powderExtinguishingSystem";
              break;
            case "18000000": //灭火器
              list[i].className = "maintenance-annihilator";
              break;
          }
          //消防设施物联网系统,消防设备电源监控系统,智能消防炮灭火系统,其他系统
          arr.push(list[i]);
        }
      }
      return arr;
    },
    //验证输入的金额
    contractAmountChange() {
      if (this.contractObj.contractAmount.length > 10) {
        this.contractObj.contractAmount = parseInt(
          this.contractObj.contractAmount.substring(0, 10)
        );
      } else {
        this.contractObj.contractAmount = parseInt(
          this.contractObj.contractAmount
        );
      }
    },
    //选中消防系统改变样式
    checkedClick(id) {
      var checked = $("#" + id).is(":checked");
      if (checked) {
        $(".system-equipment ." + id + " span").css("color", "#FF6822");
        $(".system-equipment ." + id + " b").css("color", "#FF6822");
      } else {
        $(".system-equipment ." + id + " span").css("color", "#454545");
        $(".system-equipment ." + id + " b").css("color", "#9f9f9f");
      }
    },

    //上传附件
    uploadFile() {
      let _this = this;
      let fileInput = $("#fileInput");
      fileInput.click();
      fileInput.unbind("change");
      fileInput.on("change", function() {
        let file = this.files[0];
        let fileType = file.type;
        if (fileType) {
          let fileTypeArr = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
            "application/pdf",
            "image/png",
            "image/gif",
            "image/jpeg",
            "image/bmp"
          ];
          if (fileTypeArr.indexOf(fileType) < 0) {
            _this.$message.error(
              "文件格式不正确，请上传doc、docx、pdf类型的合同附件。"
            );
            return false;
          }
        } else {
          let fileName = file.name;
          let index = fileName.lastIndexOf(".");
          fileName = fileName
            .substring(index + 1, fileName.length)
            .toLowerCase();
          let fileTypeArray = ["doc", "docx", "pdf"];
          if (fileTypeArray.indexOf(fileName) < 0) {
            _this.$message.error(
              "文件格式不正确，请上传doc、docx、pdf类型的合同附件。"
            );
            return false;
          }
        }
        let fileSize = file.size;
        if (fileSize > 10485760) {
          _this.$message.error("单个文件大小不能超过10M");
          return false;
        }
        file.id = _this.newUUID();
        _this.fileList.push(file);
      });
    },
    //删除附件
    deleteFile(id) {
      let fileList = this.fileList;
      if (fileList && fileList.length > 0) {
        for (let i = 0; i < fileList.length; i++) {
          if (id == fileList[i].id) {
            this.fileList.splice(i, 1);
          }
        }
      }
    },
    //下载附件
    downloadFile(fileObj) {
      download(1, api.forent_url.image_url + fileObj.attachPath,fileObj.name);
    },
    //保存合同信息
    saveContract() {
      let state = false;
      if (!state) {
        state = true;
        let formData = new FormData();
        if (!this.contractObj.contractName) {
          Message.error("请填写合同名称");
          state = false;
          return;
        }
        formData.append("contractName", this.contractObj.contractName);
        if (!this.contractObj.proprietorId) {
          this.$message.error("请选择企业");
          state = false;
          return;
        }
        formData.append("orgId", this.orgId);
        formData.append("proprietorId", this.contractObj.proprietorId);
        //获取企业名称
        this.getProprietorName(this.contractObj.proprietorId);
        formData.append("proprietorName", this.contractObj.proprietorName);
        if (!this.contractObj.applicantTime) {
          this.$message.error("请选择服务期止时间");
          state = false;
          return;
        }
        formData.append("serviceUnitStart", this.contractObj.applicantTime[0]);
        formData.append("serviceUnitEnd", this.contractObj.applicantTime[1]);
        formData.append("contractMoney", this.contractObj.contractAmount);
        let ids = "";
        $(".xf-check-box>input[name='checkbox']:checked").each(function(
          index,
          item
        ) {
          ids = ids + item.id + ",";
        });
        if (!ids) {
          this.$message.error("请勾选消防系统");
          state = false;
          return;
        }
        ids = ids.substring(ids.length - 1, 0);
        formData.append("checkIds", ids);
        let fileList = this.fileList;
        if (fileList && fileList.length > 0) {
          for (let j = 0; j < fileList.length; j++) {
            formData.append("files", fileList[j]);
          }
        }
        let serverUrl = api.forent_url.maintenance_service_url.replace(
          "api",
          "zuul/api"
        );
        let _this = this;
        $.ajax({
          type: "post",
          url: serverUrl + "/orgInfo/addContract",
          data: formData,
          processData: false,
          contentType: false,
          success(res) {
            state = false;
            if (res && res["code"] == "success") {
              let data = res["data"];
              let status = data.status;
              if (status == "1") {
                _this.dialogFormVisible = false;
                //刷新列表
                _this.$refs.table.queryTableList();
                _this.$message.success("添加合同成功!");
              } else {
                _this.$message.error("添加合同时间冲突!");
              }
            } else {
              _this.$message.error("保存合同失败!");
            }
          },
          error(res) {
            state = false;
            _this.$message.error("保存合同失败!");
          }
        });
      }
    },
    //获取企业名称
    getProprietorName(id) {
      let enterpriseList = this.enterpriseList;
      for (let i = 0; i < enterpriseList.length; i++) {
        if (enterpriseList[i].value == id) {
          this.contractObj.proprietorName = enterpriseList[i].label;
        }
      }
    },
    // 下载
    downloadBtn(index, row) {
      let attachMent = row.attachMent;
      if (attachMent && attachMent.length > 0) {
        for (let i = 0; i < attachMent.length; i++) {
          download(1, api.forent_url.image_url + attachMent[i].attachPath,attachMent[i].attachName);
          // let $a = document.createElement("a");
          // $a.setAttribute(
          //   "href",
          //   api.forent_url.image_url + attachMent[i].attachPath
          // );
          // $a.download = attachMent[i].attachName;
          // let evObj = document.createEvent("MouseEvents");
          // evObj.initMouseEvent(
          //   "click",
          //   true,
          //   true,
          //   window,
          //   0,
          //   0,
          //   0,
          //   0,
          //   0,
          //   false,
          //   false,
          //   true,
          //   false,
          //   0,
          //   null
          // );
          // $a.dispatchEvent(evObj);
        }
      }
    },
    // 删除
    handleDel(index, row) {
      this.$confirm("确定要删除这条合同吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let serviceUrl =
            api.forent_url.maintenance_service_url +
            "/orgInfo/deleteOrgContract";
          api.post(serviceUrl, { id: row.id }).then(res => {
            if (res && res["code"] == "success") {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.$refs.table.queryTableList();
            } else {
              this.$message({
                type: "warning",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //自动生成uuid
    newUUID() {
      var g = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (
        g() + g() + "-" + g() + "-" + g() + "-" + g() + "-" + g() + g() + g()
      );
    },
    clearable() {
      return true;
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params= {
      orgId:this.orgId
    }
    this.$refs.table.queryTableListByParams(params);
  }
};
</script>
<style lang="scss" scoped>
.contract-main {
  height: 100%;
  width: 100%;
  /deep/.el-input__inner{
  	padding:0;
  	padding-left:.15rem;
  }
  .contract-operation-head {
    line-height: 0.6rem;
    background-color: #fff;
    .el-icon-plus {
      margin-right: 0.05rem;
      margin-left: -0.05rem;
    }
    .add-contract {
      width: 0.88rem;
      background-color: #5f687f;
      color: #fff;
      border: 0;
      border-radius: 0.5rem;
      margin-left: 0.1rem;
      margin-right: 0.2rem;
      cursor: pointer;
      height:.36rem
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
      margin-left: 0.2rem;
    }
    .demonstration {
      margin-right: 0.1rem;
    }
  }
  .table-list {
    height: calc(100% - 1.34rem);
    background-color: #fff;
  }

  .add-contract-dialog {
  	.AddAttachments{
	  		    width: 1.16rem;
	    background: #FF6822;
	    border-radius: 18px;
	    height: .36rem;
	    line-height: .36rem;
	    text-align: center;
	    font-size: .16rem;
	    font-family: 'HiraginoSansGB-W3';
	    font-weight: normal;
	    color: #FFFFFF;
	    border-color:#FF6822;
  	}

    .system-col {
      display: flex;
    }
    .red {
      color: red;
    }
    .el-col {
      margin-bottom: 0.1rem;
      .el-input {
        width: 2.8rem;
        height: 0.36rem;
      }
      .applicantTime {
        height: 0.39rem;
        width: 5rem;
      }
      .enterpriseName-select {
        width: 2.8rem;
        height: 0.36rem;
      }
      .contractAmount {
        width: 2.8rem;
        height: 0.4rem;
      }
      .system-equipment {
        height: 2.26rem;
        width: 7.3rem;
        border: 1px solid #ccc;
       /* display: inline-block;*/
        padding: 0.1rem;
        overflow-y: auto;
        flex-wrap: wrap;
        .xf-check-box {
          input {
            background-color: #fff;
            border: 1px solid #a7a7a7;
            cursor: pointer;
            /*zoom: 140%;*/
           height:.18rem;
           width:.18rem;
          }
        }
      }
      .system-equipment > div {
        /*float: left;*/
        width: 50%;
        min-width: 3.3rem;
        /*margin-top: 3px;*/
        /*line-height: 13px;*/
        height: 30px;
        div {
          // margin-right: .1rem;
        }
        span {
          color: #606266;
          width: 1.75rem;
          overflow: hidden;
          display: inline-block;
          text-overflow: ellipsis;
          white-space: nowrap;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
          flex:1;
          margin-left: .1rem;
          min-width: 1.75rem;
          zoom:1;
        }
      }
      .fileList {
        max-height: 0.7rem;
        overflow-y: auto;
        padding: 2px 0 2px 0.9rem;
        span {
          color: #42abff;
        }
        b {
          color: red;
          cursor: pointer;
          margin-left: 0.1rem;
        }
      }
    }
  }
}
/deep/.el-dialog__body {
  font-size: 0.16rem;
  font-family: "microsoft yahei";
}
/deep/.el-table .el-table__row {
  cursor: pointer;
}
/deep/.el-input__suffix-inner {
  cursor: pointer;
}
/deep/.el-button{
	line-height: 0.08rem;
}
/deep/.is-round {
  padding: 0;
}
</style>
