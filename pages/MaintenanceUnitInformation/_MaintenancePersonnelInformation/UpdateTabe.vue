<!--该页需接受 MaintenancePersonnelInformation.vue 点击按钮时传递的那条信息 -->
<template>
<div  class="form_line pd15_20rem">
  <el-form :model="form_obj" :rules="rules" ref="form_obj" >
    <div class="div-flex">
      <div class="algin_top m_r15rem">
        <!-- <img :src="img_obj.weibao" class="head_img" alt> -->
      </div>
      <div class="m_t15rem flex1">
        <div class>
          <div class="form_li div-flex  m_b20rem p_t20rem">
            <div class="flex1 div-flex">
              <div class="form_title ">姓名：</div>
              <div class="form_input_div">
                  <el-form-item prop="name" >
                    <el-input placeholder="请输入" v-model="form_obj.name"></el-input>
                  </el-form-item>
              </div>
            </div>
            <div class="flex1 div-flex">
              <div class="form_title">姓别：</div>
              <div class="form_input_div" >
                <el-form-item prop="sex" >
                  <el-input placeholder="请输入" v-model="form_obj.sex"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="flex1 div-flex">
              <div class="form_title">年龄：</div>
              <div class="form_input_div">
                <el-form-item prop="age" >
                  <el-input placeholder="请输入" v-model="form_obj.age"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="form_li div-flex m_b20rem">
            <div class="flex1 div-flex">
              <div class="form_title">账号：</div>
              <div class="form_input_div">
                <el-form-item prop="loginName" >
                  <el-input placeholder="请输入" v-model="form_obj.loginName"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="flex1 div-flex">
              <div class="form_title">出生日期：</div>
              <div class="form_input_div">
                <el-form-item prop="birthDate" >
                  <el-input placeholder="请输入" v-model="form_obj.birthDate"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="flex1 div-flex">
              <div class="form_title">联系电话：</div>
              <div class="form_input_div">
                <el-form-item prop="name" >
                  <el-input placeholder="请输入" v-model="form_obj.telephone"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="form_li div-flex m_b20rem">
            <div class="flex1 div-flex">
              <div class="form_title">身份证号：</div>
              <div class="form_input_div">
                <el-form-item prop="idNumber" >
                  <el-input placeholder="请输入" v-model="form_obj.idNumber"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="flex1 div-flex">
              <div class="form_title">职位：</div>
              <div class="form_input_div">
                <el-form-item prop="positionName" >
                  <el-input placeholder="请输入" v-model="form_obj.positionName"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="flex1 div-flex">
              <div class="form_title">入职时间：</div>
              <div class="form_input_div">
                <el-form-item prop="entrytime" >
                  <el-input placeholder="请输入" v-model="form_obj.entrytime"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="form_li div-flex m_b20rem">
            <div class="flex1 div-flex">
              <div class="form_title">从业时间：</div>
              <div class="form_input_div">
                <el-form-item prop="entrytime" >
                  <el-input placeholder="请输入" v-model="form_obj.worktime"></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="form_li div-flex">
            <div class="flex1 div-flex">
              <div class="form_title">资质证书：</div>
              <div class="form_input_div div-flex">
                <!-- <div class="m_r15rem" v-for="(item,index) in infoObj.credentialsList" :key="index">
                  <img :src="getImgUrl(item.attachPath)" @click="clickImg($event)" class="ziziImg" alt>
                </div> -->
                <!-- <div>
                  <img :src="img_obj.zizhi" @click="clickImg($event)" class="ziziImg" alt>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-form>
</div>
</template>
<script>
export default{
 data(){
   return{
     form_obj:{
        name:'',
        sex:'',
        age:'',
        loginName:'',
        birthDate:'',
        telephone:'',
        idNumber:'',
        positionName:'',
        entrytime:'',
        worktime:''
      },
      rules:[]
   }
 }

}
</script>
<style lang="scss" scoped>
.form_title{
  width: 80px;
  display: flex;
  justify-content:flex-end;
  align-items: center;
  color: #9a9a9a;
}
.red{color: red;margin-right: 2px;}
.form_input_div{
    position: relative;
}
.form_table .form_span{
  margin-right: .2rem;
}
.form_table .form_input{
  flex:1;
}
.form_table .el-form-item{
  margin-bottom: 0;
}
.form_table .el-input__inner{
  height: .45rem;
}
.selected_select{
  display: flex;
}
</style>

