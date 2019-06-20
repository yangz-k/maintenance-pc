<template>
  <el-row class="contract-main">
    <!-- 面包屑 -->
    <el-row class="l-head">
      <Title />
    </el-row>
    <!-- 搜索栏 -->
    <el-row type="flex" justify="space-between" align="middle" class="contract-operation-head">
      <el-col :span="5" class="ml-20">
        <el-input
          placeholder="可按名称搜索"
          v-model="contractName"
          clearable
          @clear="search()"
          @change="search()"
          suffix-icon="el-icon-search"
          style="cursor: pointer;"
        >
        </el-input>
      </el-col>
    <el-button
      class="add-contract fs14px el-icon-plus mr-20"
      @click="addFlie()"
      type="warning"
      plain
      >新增</el-button
    >
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
    <!-- 弹窗 -->
    <el-dialog top="'0'" title="添加附件" :visible.sync="dialogFormVisible" width="8.6rem" v-dialogDrag>
      <el-form :model="ruleForm" align="left" :rules="rules" ref="ruleForm">
        <el-form-item
          label="名称："
          :label-width="formLabelWidth"
          label-position="left"
          prop="name"
        >
          <el-input
            class="el-input"
            v-model.trim="ruleForm.name"
            autocomplete="off"
            placeholder="名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="说明："
          :label-width="formLabelWidth"
          label-position="left"
        >
          <el-input
            type="textarea"
            resize="none"
            maxlength="250"
            @clear="descInput"
            @change="descInput"
            :rows="3"
            placeholder="附件说明"
            v-model.trim="ruleForm.desc"
          ></el-input>
          <span style="margin-left:0.05rem;">{{ remnant }}/250</span>
        </el-form-item>
        <el-form-item
          label="附件："
          class="label"
          :label-width="formLabelWidth"
          label-position="left"
        >
          <label class="maintenance-uploadings" for="contract" v-show="isUpload">
            上传
          </label>
          <input
            type="file"
            v-show="false"
            name="contract"
            id="contract"
            @change="upload($event)"
          />
          <span id="fileName" v-show="!isUpload">
            {{ fileName }}
            <i class="maintenance-deleteSolid" @click="removeFile()"></i>
          </span>
        </el-form-item>
        <el-form-item align="center" style="margin-top:10px;">
          <el-button
            class="wb-sure"
            round
            @click="submitForm('ruleForm')"
            >保 存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>
<script>
import axios from "axios";
import api from "~/config/http";
import Table from "~/components/Table";
import Title from "~/components/Title";
import { Message } from "element-ui";
import download from 'ly-downloader'
export default {
  components: {
    Table,
    Title
  },
  data() {
    return {
      orgId: "",
      enclosure: "", //附件
      fileName: "",
      isUpload: true,
      ruleForm: {
        name: "",
        delivery: false,
        type: [],
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          // { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      contractName: "", // 搜索参数，附件名
      dialogFormVisible: false,
      remnant: 0,
      formLabelWidth: "120px",
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
          prop: "attachName",
          label: "名称",
          align: "center",
          minWidth: "39%"
        },
        {
          prop: "createTime",
          label: "上传时间",
          align: "center",
          minWidth: "16%"
        },
        {
          prop: "memo",
          label: "说明",
          align: "center",
          minWidth: "30%"
        }
      ], // 需要展示的列
      operates: {
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
              this.handleEdit(index, row);
            }
          },
          {
            title: "删除",
            type: "text",
            icon: "el-icon-delete",
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: (index, row) => {
              return false;
            },
            method: (index, row) => {
              this.handleDelete(index, row);
            }
          }
        ]
      }, // 操作按钮
      requestUrl:
        api.forent_url.maintenance_service_url + "orgInfo/getContractList"
    };
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    let params = {
      maintenanceId: this.orgId
    };
    this.$refs.table.queryTableListByParams(params);
  },
  methods: {
    // 按附件名称搜索
    search() {
      let params = {};
      params.maintenanceId = this.orgId;
      params.contractName = this.contractName;
      this.$refs.table.queryTableListByParams(params);
    },
    //删除文件
    removeFile() {
      this.fileName = "";
      this.enclosure = "";
      this.isUpload = true;
    },
    // 上传文件
    upload(event) {
      var file = event.target.files[0];
      var fileName = file.name;
      var index = fileName.lastIndexOf(".");
      fileName = fileName.substring(index + 1, fileName.length).toLowerCase();
      var fileSize = file.size;
      var fileTypeArray = ["doc", "docx", "pdf", "png", "jpg", "bmp", "gif"];
      if (fileTypeArray.indexOf(fileName) < 0) {
        Message.warning(
          "文件格式不正确，请上传doc、docx、pdf,图片类型的合同附件。"
        );
        this.enclosure = event.target.value = "";
        this.isUpload = true;
      } else if (fileSize > 10485760) {
        Message.warning("单个文件大小不能超过10M");
        this.enclosure = event.target.value = "";
        this.isUpload = true;
      } else {
        this.enclosure = file;
        this.fileName = event.target.value;
        this.isUpload = false;
      }
      event.target.value = "";
    },
    // 添加附件
    addFlie() {
      this.remnant = 0;
      this.ruleForm = {};
      this.dialogFormVisible = true;
    },
    //新增功能保存
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.enclosure == "") {
            Message.error("请上传附件！");
            return;
          }
        }
      });
      var formData;
      formData = new FormData();
      formData.append("attachName", this.ruleForm.name);
      formData.append("memo", this.ruleForm.desc || "");
      formData.append("userId", api.getGlobalVal().maintenance_userObj.userId);
      formData.append(
        "maintenanceId",
        api.getGlobalVal().maintenance_userObj.orgCode
      );
      formData.append("file", this.enclosure);
      axios({
        method: "post",
        url:
          api.forent_url.maintenance_service_url + "/orgInfo/addContractAttach",
        data: formData,
        contentType: false,
        processData: false
      })
        .then(res => {
          res = res.data;
          if (res.code == "success") {
            var code = res["code"];
            if (code == "success") {
              this.dialogFormVisible = false;
              this.$emit("isShow", this.dialogFormVisible);
              Message.success("操作成功!");
              this.$emit("addList", { pageNo: 1 });
              this.$refs["ruleForm"].resetFields(); //表单内容重置
              this.isUpload = true;
              this.enclosure = "";
              this.$refs.table.queryTableList();
              //刷新列表
            } else {
              Message.success(res["message"]);
            }
          }
        })
        .catch(res => {
          return res;
        });
    },
    //下载附件
    handleEdit(index, row) {
      download(1, api.forent_url.image_url + row.attachPath,row.attachName);
    },
    //删除列表
    handleDelete(index, row) {
      let that = this;
      this.$confirm("确定要删除这条信息吗?", "信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .get(
              api.forent_url.maintenance_service_url +
                "/orgInfo/deleteContractAttach",
              {
                attachId: row.id
              }
            )
            .then(res => {
              const code = res.code;
              const message = res.message;
              if (code === "success") {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$refs.table.queryTableList();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            });
        })
        .catch(() => {
          console.log("已取消删除");
        });
    },
    //文件上传数量
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    //弹窗文本域字数限制
    descInput() {
      var txtVal = this.ruleForm.desc.length;
      this.remnant = txtVal;
    }
  }
};
</script>
<style lang="scss" scoped>
.contract-main {
  height: 100%;
  width: 100%;
  .contract-operation-head {
    line-height: 0.6rem;
    background-color: #fff;
    .add-contract {
      width: 0.8rem;
      background-color: #5f687f;
      color: #fff;
      border: 0;
      border-radius: 0.5rem;
      margin-left: 0.5rem;
      cursor: pointer;
    }
    /deep/.el-button {
      display: inline-block;
    }
    /deep/.el-input__inner {
      height: 0.4rem;
      line-height: 0.4rem;
    }
  }
  .table-list {
    height: calc(100% - 1.34rem);
    background-color: #fff;
  }
  .maintenance-uploadings{
    cursor: pointer;
  }
}
/deep/.el-form-item__label{
  font-size: .16rem;
}
/deep/.el-input__suffix-inner {
  cursor: pointer;
}
/deep/.el-button{
  line-height: 0.08rem;
}
.is-round {
  padding: 0;
}
</style>
