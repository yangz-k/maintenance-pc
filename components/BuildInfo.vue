<template>
    <el-dialog  title="提示" :visible.sync="dialog_build" width="40%" :before-close="resetForm">
  <div class="form_table pd20rem fs18px overflow_auto" v-loading="loading2" style="height:5rem;">
    <el-form :model="build_obj" :rules="rules" ref="build_obj" label-width="130px" class="demo-dynamic">
      <el-form-item prop="buildName" class="form_input_div_host fs18px m_b15rem" label="建筑名称：">
        <el-input placeholder="请输入建筑名称" v-model="build_obj.buildName"></el-input>
        <span class="right_span">
          <i>{{build_obj.buildName.length}}</i>/20
        </span>
      </el-form-item>
      <el-form-item prop="buildArea" class="form_input_div_host" label="建筑面积：">
        <el-input placeholder="请输入建筑面积" v-model="build_obj.buildArea"></el-input>
        <span class="right_span">平方米</span>
      </el-form-item>
      <el-form-item prop="buildHight" class="form_input_div_host" label="建筑高度：">
        <el-input placeholder="请输入建筑高度" v-model="build_obj.buildHight"></el-input>
        <span class="right_span">米</span>
      </el-form-item>
      <el-form-item prop="upFloor" class="form_input_div_host" label="地上层数：">
        <el-input placeholder="请输入地上层数" v-model="build_obj.upFloor"></el-input>
        <span class="right_span">层</span>
      </el-form-item>
      <el-form-item prop="downFloor" class="form_input_div_host" label="地下层数：">
        <el-input placeholder="请输入地下层数" v-model="build_obj.downFloor"></el-input>
        <span class="right_span">层</span>
      </el-form-item>
      <el-form-item prop="fireAcceptanceTime" class="form_input_div_host" label="验收时间：">
        <el-date-picker :editable='false' v-model="build_obj.fireAcceptanceTime"  value-format='yyyy-MM-dd'  type="date" placeholder="选择日期"> </el-date-picker>
      </el-form-item>
      <!--<div class="div-flex text-center m-b15rem" style="width: 90px; margin:30px  auto 0 auto;">
       <el-button
          size="medium"
         round
          class="fs14px wb-clear"
          @click="dialog_build=false"
        >取消</el-button>
        <el-button size="medium" round class="fs14px wb-sure" @click="saveFormBuild()">保存</el-button>

      </div>-->
      <el-col style="text-align: center;" class="confirm-button-div div-flex all_center">
        	<el-button class="wb-clear" style="margin-right: .15rem;"  @click="resetForm()" round>取消</el-button>
          <el-button
            round
            class="wb-sure"
            @click="saveFormBuild()"
            style="display: inline-block;"
            >保存</el-button
          >
        </el-col>
    </el-form>
  </div>
  </el-dialog>
</template>
<script>
import api from "~/config/http";
import validate from "~/plugins/validate";
export default {
  props:['types'],
  data() {
    return {
      loading2:false,
      queryInfo:{},
      dialog_build:false,
      build_obj: {
        buildName: "",
        buildArea: "",
        buildHight: "",
        upFloor: "",
        downFloor: "",
        fireAcceptanceTime: ""
      },
      rules: {
        buildName: [
          { required: true, message: "请输入建筑名称", trigger: ["blur"] },
          {
            min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: ["blur",'change']
          }
        ],
        buildArea: [
          { required: true, message: "请输入建筑面积", trigger: ["blur",'change'] },
          {
            min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: ["blur",'change']
          },
          { validator: validate.checkAreaVal, trigger: ["blur",'change'] }
        ],
        buildHight: [
          { required: true, message: "请输入建筑高度", trigger: ["blur"] },
          { validator: validate.checkHeightVal, trigger: ["blur",'change'] }
        ],
        upFloor: [
          { required: true, message: "请输入地上层数", trigger: ["blur"] },
          { validator: validate.isOneToNinetyNineInteger, trigger: ["blur",'change'] }
        ],
        downFloor: [
          { required: true, message: "请输入地下层数", trigger: ["blur"] },
          { validator: validate.isOneToNinetyNineInteger, trigger: ["blur",'change'] }
        ],
        fireAcceptanceTime: [
          { required: true, message: "请输入验收时间", trigger: ["blur"] }        ]
      }
    };
  },
  methods: {
    openBuild(item){
      this.dialog_build=item;
    },
     resetForm() {
        this.$refs['build_obj'].resetFields();
        this.dialog_build=false;
     },
    saveFormBuild() {
      this.$refs['build_obj'].validate((valid) => {
        if (valid) {
          let _this=this;
          console.log(_this.build_obj)
          if(this.types){
            var datas_s= {
            'unitId':_this.queryInfo.unitId,
            'unitName':_this.queryInfo.unitName,
            "maintenanceId": api.getGlobalVal("maintenance_userObj").orgCode,
            "maintenanceUnit": api.getGlobalVal("maintenance_userObj").orgName,
            'buildName':_this.build_obj.buildName,
            'buildArea':_this.build_obj.buildArea,
            'buildHight':_this.build_obj.buildHight,
            'upFloor':_this.build_obj.upFloor,
            'downFloor':_this.build_obj.downFloor,
            'fireAcceptanceTime':_this.build_obj.fireAcceptanceTime
          }
          _this.loading2=true;
          var datas = {jsonBuilds:JSON.stringify(datas_s)}
            api.post(api.forent_url.maintenance_service_url + "/serverUnit/addServiceBuildList",datas)
            .then(function(data) {
              _this.loading2=false;
              var code = data["code"];
              var datas = data["data"];
              if(code == "success") {
                _this.$message({message: '保存成功',type: 'success'});
                _this.build_obj.buildId=datas;
                _this.$emit("saveFormBuild",_this.build_obj)
                _this.dialog_build = false;
                _this.$refs['build_obj'].resetFields();
              }else{
                _this.$message({message: data["message"],type: 'warning'});
              }
            })
          }else{
              _this.$emit("saveFormBuild",_this.build_obj)
              _this.dialog_build = false;
              _this.$refs['build_obj'].resetFields();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.queryInfo=this.$route.params;
  }
};
</script>
<style lang="scss" scoped>
//主机信息
.form_input_div_host {
  width: 90%;
  position: relative;
}
.form_input_div_host .el-form-item__label{
    font-size: .18rem!important;
}
.form_input_div_host input {
  width: 100%;
}
.form_input_div_host .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width:100%;
}
.right_span {
  height: 30px;
  width: 50px;
  text-align: center;
  line-height: 30px;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translate(0%, -50%);
  background-color: #fff;
  color: #999;
}
.caozuo {
  display: inline-block;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  line-height: 1;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
  margin-left: 10px;
}
.minus {
  border: #ff3434 solid 1px;
  color: #ff3434;
}
.add {
  border: #5f34ff solid 1px;
  color: #5f34ff;
}
</style>
