<template>
    <el-dialog  title="提示" :visible.sync="dialog_Host" width="40%" :before-close="resetForm" v-dialogDrag :close-on-click-modal="false">
  <div class="form_table pd20rem overflow_auto" v-loading='loading2' style="height:5rem;">
    <el-form :model="host_obj" :rules="rules" ref="host_obj" label-width="130px" class="demo-dynamic">
      <el-form-item prop="host_name" class="form_input_div_host" label="消控室名称：">
        <el-input placeholder="请输入消控室名称" v-model="host_obj.host_name"></el-input>
        <span class="right_span">
          <i>{{host_obj.host_name.length}}</i>/20
        </span>
      </el-form-item>
      <el-form-item prop="host_address" class="form_input_div_host" label="具 体 位  置：">
        <el-input placeholder="请输入具体位置" v-model="host_obj.host_address"></el-input>
        <span class="right_span">
          <i>{{host_obj.host_address.length}}</i>/20
        </span>
      </el-form-item>
      <el-form-item prop="host_phone" class="form_input_div_host" label="消控室电话：">
        <el-input placeholder="请输入消控室电话" v-model="host_obj.host_phone"></el-input>
      </el-form-item>
      <el-form-item  label="主 机 类  型：" class="form_input_div_host" >
        <div class="div-flex m_b10rem" v-for="(item, index) in host_obj.host_type_val" :key="item.index">
          <el-input v-model="item.value"></el-input>
          <div class="div-flex align_center">
            <span v-if="index==0" class="caozuo add add_inputs" @click="addline()">+</span>
            <span v-else class="caozuo minus add_inputs" @click="removeline(index)">-</span>
          </div>
        </div>
      </el-form-item>
      <!--<div class="div-flex text-center m-b15rem" style="width: 90px; margin:30px  auto 0 auto;">
        <el-button
          size="medium"
          type="warning"
          class="gg-btn fs14px btn_back"
          @click="dialog_Host=false"
        >取消</el-button>
        <el-button size="medium" type="success" class="gg-btn fs14px" @click="saveFormhost()">保存</el-button>
      </div>-->
      <el-col style="text-align: center;" class="confirm-button-div div-flex all_center">
        	<el-button class="wb-clear" style="margin-right: .15rem;"  @click="resetForm()" round>取消</el-button>
          <el-button
            round
            class="wb-sure"
            @click="saveFormhost()"
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
  props:['types','queryInfo'],
  data() {
    return {
      loading2:false,
//    queryInfo:{},
      dialog_Host:false,
      host_obj: {
        host_name: "",
        host_address: "",
        host_phone: "",
        host_type: "",
        host_type_val: [{
          value:''
        }]
      },
      rules: {
        host_name: [
          { required: true, message: "请输入消控室名称", trigger: ["blur"] },
          {
            min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: ["blur",'change']
          }
        ],
        host_address: [
          { required: true, message: "请输入具体位置", trigger: ["blur",'change'] },
          {
            min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: ["blur",'change']
          }
        ],
        host_phone: [
          { required: true, message: "请输入消控室电话", trigger: ["blur"] },
          { validator: validate.validatePhoneTwo, trigger: ["blur",'change'] }
        ]
      }
    };
  },
  methods: {
    openHost(item){
      this.dialog_Host=item;
    },
    addline() {
      //追加主机型号
      this.host_obj.host_type_val.push({value:''});
    },
    resetForm() {
        this.$refs['host_obj'].resetFields();
        this.dialog_Host=false;
     },
    removeline(index) {
      //删除当前索引主机型号
      this.host_obj.host_type_val.splice(index, 1);
    },
    saveFormhost() {
      this.$refs['host_obj'].validate((valid) => {
        if (valid) {
          let _this=this;
          var datas={
            hostcontrolroomName:_this.host_obj.host_name,
            hostcontrolroomAddress:_this.host_obj.host_address,
            hostcontrolroomTel:_this.host_obj.host_phone,
            hostModel:_this.host_obj.host_type_val
          }
          if(this.types){
            let host_type_arr=[];
            let host_type_val;//字符串格式
            if(_this.host_obj.host_type_val){
              for (let item in _this.host_obj.host_type_val) {
                host_type_arr.push(_this.host_obj.host_type_val[item].value)
              }
            }
            host_type_val =host_type_arr.join(',')
            var datas_s= {
              unitId:_this.queryInfo.unitId,
              maintenanceId: api.getGlobalVal("maintenance_userObj").orgCode,
              maintenanceUnit: api.getGlobalVal("maintenance_userObj").orgName,
              firecontrolroomName:_this.host_obj.host_name,
              firecontrolroomAddress:_this.host_obj.host_address,
              firecontrolroomTel:_this.host_obj.host_phone,
              hostModel:host_type_val
            }
            var datas = {jsonFireRooms:JSON.stringify(datas_s)}
            _this.loading2=true;
            api.post(api.forent_url.maintenance_service_url + "/serverUnit/addServiceFireRoomList",datas)
            .then(function(data) {
              _this.loading2=false;
              var code = data["code"];
              var datas = data["data"];
              if(code == "success") {
                _this.$message({message: '保存成功',type: 'success'});
                _this.host_obj.id=datas
                _this.$emit("saveFormHost",_this.host_obj)
                _this.dialog_Host = false;
                _this.$refs['host_obj'].resetFields();
                _this.host_obj.host_type_val=[{value:''}];;
              }else{
                _this.$message({message: data["message"],type: 'warning'});
              }
            })
          }else{
                _this.$emit("saveFormHost",_this.host_obj)
                _this.dialog_Host = false;
                _this.$refs['host_obj'].resetFields();
                _this.host_obj.host_type_val=[{value:''}];
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
//  this.queryInfo=this.$route.query;//this.parentsData
console.log(this.types)
console.log(this.queryInfo)
  }
};
</script>
<style lang="scss" scoped>
//主机信息
.form_input_div_host {
  width: 90%;
  position: relative;
}
.form_input_div_host input {
  width: 100%;
}
.right_span {
  height: .3rem;
  width: .5rem;
  text-align: center;
  line-height: 0.3rem;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translate(0%, -50%);
  background-color: #fff;
  color: #999;
  font-size: .14rem;
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
