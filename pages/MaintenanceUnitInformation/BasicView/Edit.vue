<template>
  <div class="mainCon" v-loading='loading'>
     <!-- 面包屑 -->
    <el-row class="l-head" style="background-color:#edf0f7" type="flex" justify="space-between" align="middle">
        <!-- 面包屑 -->
        <Title />
        <el-button
          class="goBack"
          type="text"
          icon="maintenance-back1"
          @click="returnMain()"
          >返回</el-button
        >
    </el-row>
    <div class="content">
      <div class="content_con">
        <el-form class="gg-base-info edit" :rules="rules" ref="ruleForm" v-model="tableDate">
          <!-- 编辑页面 -->
          <div class="gg-base-unit">
            <h3 class="gg-base-h3" style="display:flex;justify-content:space-between">
              企业信息
              <div class="is-right" style="display:inline-block">
                <!-- <el-button
                  type="primary"
                  size="medium"
                  class="gg-btn btn_update_qx fs16px"
                  @click="update()"
                >
                  <i class="maintenance-save"></i>
                  保存
                </el-button> -->
                <el-button class="wb-edit fs18px" @click="update()" type="text" icon="maintenance-save">&nbsp;保存</el-button>
              </div>
            </h3>
            <div class="title" style="display:inline-block">
              <span class="title_span">
                <i></i>
                <span class="con">
                		 基本信息
                </span>
              </span>
            </div>
            <table class="gg-table gg-tableFix" cellspacing="0" cellpadding="0">
              <colgroup>
                <col width="5.5%">
                <col width="40.5%">
                <col width="5.5%">
                <col width="40.5%">
              </colgroup>
              <tbody>
                <tr class="con">
                  <th>单位编号：</th>
                  <td class="pad">{{ tableDate.id }}</td>
                  <th>单位名称：</th>
                  <td class="pad">{{ tableDate.maintenanceName }}</td>
                </tr>
                <tr class="con">
                  <th>合作模式：</th>
                  <td class="pad">{{ tableDate.serviceUnitJoinModel }}</td>
                  <th>运营中心：</th>
                  <td class="pad">{{ tableDate.subCenterName }}</td>
                </tr>
                <tr class="con">
                  <th>服务期始：</th>
                  <td class="pad">{{ tableDate.serviceUnitStartDate }}</td>
                  <th>服务期止：</th>
                  <td class="pad">{{ tableDate.serviceUnitEndDate }}</td>
                </tr>
                <tr class="con">
                  <th>企业地址：</th>
                  <td class="pad">{{ tableDate.address }}</td>
                  <th>服务电话：</th>
                  <td>
          			  <!--<el-form-item prop="checkPhone">-->
                    <el-input
                      clearable
                      id="phone"
                      class="noResize serviceTel"
                      placeholder="请输入服务电话"
                      style="width:60%;float:left"
                      v-model.trim="tableDate.serviceTel"
                      :maxlength="16"
                       @change="validate('2',tableDate.serviceTel)"
                    ></el-input>
                    <!--</el-form-item>-->
                  </td>
                </tr>
                <tr class="con">
                  <th>联&nbsp; 系&nbsp;人：</th>
                  <td class="pad">{{ tableDate.conact }}</td>
                  <th>联系电话：</th>
                  <td class="pad">{{ tableDate.conactPhone }}</td>
                </tr>
                <tr class="con">
                  <th>法人姓名：</th>
                  <td>
                    <el-input
                      clearable
                      class="noResize"
                      placeholder="请输入法人姓名"
                      maxlength="15"
                      style="width:60%;float:left;height:98%"
                      v-model.trim="tableDate.legalperson"
                    >
                      <!---legalperson-->
                    </el-input>
                  </td>
                  <th>法人电话：</th>
                  <td>
                    <el-input
                      clearable
                      class="noResize legalpersonTel"
                      placeholder="请输入法人电话"
                      style="width:60%;float:left"
                      v-model.trim="tableDate.legalpersonTel"
                      prop="tel"
                      @change="validate('3',tableDate.legalpersonTel)"
                    >
                      <!--legalpersonTel-->
                    </el-input>
                  </td>
                </tr>
                <tr class="con">
                  <th>在职人数：</th>
                  <td >
                  	<!--<el-form-item prop="roundNumber">-->
                    <el-input
                      clearable
                      class="noResize activeEmployees"
                      placeholder="请输入大于0的数字"
                      type="number"
                      min="0"
                      maxlength="6"
                      style="width:60%;float:left;height:98%;"
                      v-model.trim="tableDate.activeEmployees"
                      @change="validate('1',tableDate.activeEmployees)"
                    >
                    </el-input>
                    <!--</el-form-item>-->
                  </td>
                  <th>服务区域：</th>
                  <td class="pad">{{tableDate.serviceRange}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-form>
        <div class="title">
          <span class="title_span" >
            <i></i>
            <span class="con">资质</span>
          </span>
        </div>
        <div class="last ">
          <!-- 图片展示 start-->
          <div class="pd15_20rem m_l15rem">
            <div class="img_div" v-for="(item,index) in fileList2" :key="index">
              <div class="divs_img">
                <img title="点击查看大图" :src="getimgUrl(item.attachmentUrl)" @click="clickImg($event)" alt>
              </div>
              <div class="del_img cursor" title="点击删除" @click="handleRemove(item)">x</div>
              <p class="fs16px img_p" :title="item.attachmentName">{{item.attachmentName}}</p>
            </div>
          </div>
          <!-- 图片展示 end-->
          <div class="div-flex align_center" style="padding-bottom:.4rem">
            <div class="div-flex align_center m_r15rem ">
              <span class="m_r15rem span_color m_l35rem">选择资质：</span>
              <div class="ev_err position_r">
                <el-select v-model="aptitude_value" @change="changeZi(aptitude_value)" placeholder="请选择资质" style="width:3.91rem;">
                  <el-option
                    v-for="(item,index) in itemList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <span class="span_error"></span>
              </div>
            </div>
            <div class="div-flex align_center">
              <span style="width:1.5rem" class="span_color">上传附件：</span>
              <el-input type="text" readonly  class="m_r15rem"></el-input>
              <div class="position_r">
                <input type="file" id="changeFile" @change="changeFile($event)" class="btn_file">
                <el-button size="small" @click="to_load()" type="info">点击上传</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</template>

<script>
import axios from "axios";
import api from "~/config/http";
import { Message, MessageBox } from "element-ui";
import BigImg from "~/components/BigImg.vue";
import Title from "~/components/Title";
export default {
  components: {
    "big-img": BigImg,
    Title
  },
  props: {
    showMain: false
  },
  data() {
  	//验证手机号
				let checkMobilePhone = (rule, value, callback) =>{
					if(!value) {

					} else {
						if(!/^1[34578]\d{9}$/.test(value)) {
							callback(new Error('你输入的电话号码有误'));
						}
					}
				}
				//验证是否是电话号码
				let checkPhone = (rule, value, callback) =>{
					const reg = /^0\d{2,3}-?\d{7,8}$/
					console.log(value)
					if(!value) {
						callback();
					} else {
						if((!reg.test(value))) {
							callback(new Error('你输入的电话号码有误'));
						}else{
							callback();
						}
					}

				}
				//同时验证手机和座机
				let checkPhoneAndMobilePhone = (rule, value, callback) =>{
					if(!value) {

					} else {
						var isPhone = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;//手机号码
    					var isMob= /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;// 座机格式
						if(isMob.test(value)||isPhone.test(value)) {
							callback();
						}else{
							callback(new Error('你输入的电话号码有误'));
						}
					}

				}
				//验证是否是正整数
				let roundNumber = (rule, value, callback) =>{
					if(!value) {
						callback();
					} else {
						if(!/^[1-9]\d*$/.test(value)) {
							callback(new Error('请输入正整数'));
						}else{
							callback();
						}
					}

				}
    return {
      loading:false,
      //放大图片
      showImg: false,
      canSave:true,
      imgSrc: "",
      tableDate: {
      	activeEmployees:"",
      	serviceTel:""
      },
      itemList: [], //资质列表
      aptitude_value: "", //资质值
      value: "",
      offShowMain: this.showMain,
      input: "",
      fileList: [],
      fileList2: [],
      upLoadImgUrl: "",
      uploadPicParam: {},
      name: [],
      rules:{
      	roundNumber:[
      		{ validator: roundNumber, trigger: 'change'}
      	],
      	checkPhone:[
      		{validator: checkPhone, trigger: 'change'}
      	]
      }
    };
  },
  created() {
    this.upLoadImgUrl =
      api.forent_url.maintenance_service_url + "/orgInfo/addCredentialAttach";
  },
  mounted() {
    this.getEnterpriseInformation();
    this.getCredentialDicList();
  },
  methods: {
  	validate(type,value){
  		let that = this;
  		that.canSave = true;
  		switch(type){
  			case "1" :
  				$(".activeEmployees").removeClass("errorMessage")	
  				if(value){
  					if(!/^[1-9]\d*$/.test(value)){
  						$(".activeEmployees").attr("data-message","请输入正整数").addClass("errorMessage")
  						that.canSave = false;
  					}
  				};
  				break;
  			case "2" :
  				$(".serviceTel").removeClass("errorMessage");
  				if(value){
  					if(!/^0\d{2,3}-?\d{7,8}$/.test(value)){
  						$(".serviceTel").attr("data-message","服务电话输入有误").addClass("errorMessage")
  						that.canSave = false;
  					}
  				}
  				break;
  			case "3" :
  				$(".serviceTel").removeClass("legalpersonTel");
  				if(value){
  					let isPhone = /^((13[0-9])|(14[0-9])|(15[0-9])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;//手机号码
    				let isMob= /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;// 座机格式
						if(isMob.test(value) || isPhone.test(value)) {
  						
  					}else{
  						$(".legalpersonTel").attr("data-message","输入的电话号码或手机号有误").addClass("errorMessage")
  						that.canSave = false;
  					}
  				}	
  				break;
  		}
  	},
    clickImg(e) {
      this.showImg = true; // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.showImg = false;
    },
    changeZi(val){
        if(val){
          $(".span_error").text('')
          $(".ev_err").removeClass("span_error_border")
        }
    },
    to_load() {
      if (this.aptitude_value == "") {
        $(".span_error").text('请选择资质')
        $(".ev_err").addClass("span_error_border")
        // this.$message({ message: "请选择资质", type: "warning" });
      } else {
        $("#changeFile").click();
      }
    },
    changeFile(file) {
      if (file.target) {
        this._fileUpload(file.target);
      }
    },
    //文件上传
    _fileUpload(that) {
      let _this = this;
      var file = that.files[0];
      var fileType = file.type;
      //blob
      // console.log(window.URL.createObjectURL(file))
      //base64
      // var reader = new FileReader();
      // if (file && file.type.match('image.*')) {
      //     reader.readAsDataURL(file);
      // }
      // reader.onloadend = function (e) {
      //   console.log(reader.result)
      // }
      // ZS.MONITOR.name=file.name;
      if (fileType) {
        var fileTypeArr = [
          "image/jpeg",
          "image/png",
          "image/x-png",
          "image/bmp",
          "image/gif"
        ];
        if (fileTypeArr.indexOf(fileType) < 0) {
          _this.$message({
            message:
              "文件格式不正确，请上传jpeg、png、x-png、bmp、gif类型的合同附件。",
            type: "warning"
          });
          return false;
        }
      } else {
        var fileName = file.name;
        var index = fileName.lastIndexOf(".");
        fileName = fileName.substring(index + 1, fileName.length).toLowerCase();
        var fileTypeArray = ["jpeg", "png", "bmp", "gif", "x-png"];
        if (fileTypeArray.indexOf(fileName) < 0) {
          _this.$message({
            message:
              "文件格式不正确，请上传jpeg、png、x-png、bmp、gif类型的合同附件。",
            type: "warning"
          });
          return false;
        }
      }
      var fileSize = file.size;
      if (fileSize > 2097152) {
        _this.$message({ message: "单个文件大小不能超过2M", type: "warning" });
        return false;
      }
      _this.uploadImg(file);
    },
    backName(id) {
      var obj;
      this.itemList.forEach(element => {
        if (element.id == id) {
          obj = element;
        }
      });
      return obj;
    },
    uploadImg(file) {
      let _this = this;
      var formData;
      formData = new FormData();
      formData.append(
        "maintenanceId",
        api.getGlobalVal("maintenance_userObj").orgCode
      );
      formData.append(
        "pid",
        Math.random()
      );
      formData.append(
        "credentialName",
        _this.backName(_this.aptitude_value).name
      );
      formData.append("files", file);
      axios({
        method: "post",
        url:
          api.forent_url.maintenance_service_url +
          "/orgInfo/addCredentialAttach",
        data: formData,
        contentType: false,
        processData: false
      }).then(res => {
        res = res.data;
        var code = res["code"];
        if (code == "success") {
          _this.getEnterpriseInformation();
          $("#changeFile").val('')
        } else {
          _this.$message({ message: res["message"], type: "warning" });
        }
      });
    },
    getimgUrl(url) {
      //返回图片地址
      return api.forent_url.image_url + url;
    },
    //删除图片
    handleRemove(item) {
      let params = {
        credentialId: item.credentialId
      };
      api
        .get(
          api.forent_url.maintenance_service_url +
            "/orgInfo/delCredentialAttach?pid="+Math.random(),
          params
        )
        .then(res => {
          this.getEnterpriseInformation();
        });
    },
    returnMain() {
      this.offShowMain = true;
    },
    //获取企业信息
    getEnterpriseInformation(data) {
      let self = this;
      var datas = {
        id: api.getGlobalVal("maintenance_userObj").orgCode
      };
      self.loading=true;
      api
        .get(
          api.forent_url.maintenance_service_url +
            "/orgInfo/getMaintenanceOrgById?pid="+Math.random(),
          datas
        )
        .then(res => {
      		self.loading=false;
          self.tableDate = res.data;
          this.fileList2 = res.data.credentials;
        });
    },
    //获取资质信息
    getCredentialDicList() {
      let _this = this;
      api
        .get(
          api.forent_url.maintenance_service_url +
            "/orgInfo/getCredentialDicList",
          {}
        )
        .then(res => {
          _this.itemList = res.data;
        });
    },
    //更新企业信息
    update() {
      let self = this;
			if(!self.canSave){
				Message.error("保存失败,请按规则填写信息。");
				return;
			}else{
				self.loading=true;
				api
        .post(
          api.forent_url.maintenance_service_url +
            "/orgInfo/updateMaintenanceOrgById",
          self.tableDate
        )
        .then(res => {
      self.loading=false;
          if (res.code == "success") {
            this.offShowMain = true;
            Message.success("保存成功!");
          } else {
            Message.error("保存失败!");
          }
        });
			}
      
    },
    changeBtn() {
      let kk = document.getElementById("kk");
      kk.click();
    }
  },
  watch: {
    offShowMain: function() {
      this.$emit("exitEdit", this.offShowMain);
    }
  }
};
</script>
<style lang="scss" scoped>
.m_l35rem{
  margin-left: .35rem;
}
.m_l15rem{
  margin-left: .15rem;
}
.title_span{
  display:inline-block;height:.19rem;line-height:.19rem;
}
.span_color{
  font-size: 0.16rem;
  color: #999999;
  font-weight: bold;
}
.span_error{
  position: absolute;
  left: 5px;
  bottom:-30px;
  color: red;
  font-size: .14rem;
}
.span_error_border{
    border: 1px solid red;
    border-radius: 5px;
}

.btn_file {
  font-size: 99rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 0.8rem;
  height: 0.38rem;
  display: none;
}

.img_p {
  margin-top: 5px;
  color: #5f687f;
  text-align: center;
  font-weight: 600;
  line-height: 1.4;
  padding: 2px 15px;
  height: 0.45rem;
  overflow:hidden;
  text-overflow:ellipsis; 
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.img_div {
  display: inline-block;
  position: relative;
  padding: 0.1rem;
  margin-bottom: 0.1rem;
  width: 2.24rem;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  margin-right: 0.15rem;
}
.divs_img {
  width: 2.04rem;
  height: 1.38rem;
  overflow: hidden;
}
.img_div img {
  width: 2.04rem;
}
.img_div:hover {
  .del_img {
    transition: opacity 0.5s;
    opacity: 1;
  }
}
.del_img {
  opacity: 0;
  position: absolute;
  top: -5px;
  right: -5px;
  width: 15px;
  height: 15px;
  background-color: red;
  line-height: 1;
  text-align: center;
  color: #fff;
  border-radius: 50%;
}
.mainCon {
  width: 100%;
  height: 100%;
}
.content {
  width: 100%;
  height: calc(100% - .7rem);
  overflow-y: auto;
  padding: .2rem;
}
.content_con{
  border: 1px solid #efefef;
}
.gg-base-unit .gg-table {
  margin: 0 0 0 0.35rem;
  line-height: 0.2rem;
}
.gg-base-info {
  width: 100%;
}

.title {
  font-size: 0.19rem;
  min-width: 96px;
  color: #677089;
  margin-left: 0.2rem;
  margin-top: 0.1rem;
  font-weight: bold;
}
.title i {
  line-height: 0.5rem;
  display: inline-block;
  width: 5px;
  height: 0.18rem;
  float: left;
  margin-right: 0.1rem;
  background: #ff6822;
}
.gg-table th {
  min-width: 64px;
  text-align: left;
  font-size: 0.16rem;
}
.gg-table .con th {
  color: #999999;
}
.gg-table /deep/ .title {
  color: #677089;
}
.gg-table tr {
  color: #454545;
  height: 0.6rem;
}

.gg-table td {
  text-align: left;
  font-size: 0.16rem;
  color: #454545;
  font-weight: bold;
}
.gg-table .pad {
  padding-left: 0.04rem;
}

.gg-base-unit .gg-base-h3 {
  box-sizing: border-box;
  padding: 0 0 0 0.2rem;
  height: 0.5rem;
  width: 100%;
  line-height: 0.5rem;
  background: #f7f7f7;
  text-align: left;
  font-size: 0.21rem;
  color: #677089;
}

/deep/ .el-input__inner {
  height: 0.4rem;
  padding: 0;
  padding-left: 4px;
  font-size: 0.16rem;
  color: #454545;
  font-weight: bold;
}
.el-select {
  font-size: 12px;
}
// .btn_update_qx {
//   height: 100%;
//   float: right;
//   background: #f7f7f7;
//   border: none;
//   color: #5f687f;
//   margin-bottom: 3px;
// }
.wb-edit{
  color:#5F687F;
  height: 0.5rem;
  line-height: 0.5rem;
  &:hover{
    color:#409EFF;
  }
}
.btn_update_cencel {
  height: 100%;
  // position: fixed;
  // top:.8rem;
  // right:.6rem;
  background: #eff3f6;
  border: none;
}
.showImg {
  width: 100%;
  height: 100%;
}

.go {
  width: 100%;
  height: 100%;
}

.upload-demo {
  height: 100%;
}
.errorMessage{
	position: relative;
	&:before{
		content: attr(data-message);
			position:absolute;
			left:.15rem;
			bottom: -0.2rem;
			color:#f56c6c;
			z-index: 10;
	}
	/deep/.el-input__inner{
		border-color: #f56c6c;
		&:before{
			content: "lallalll";
			position:absolute;
			left:.15rem;
			bottom: -0.2rem;
			color:#f56c6c;
			z-index: 10;
		}
	}
  /*border: 1px solid #f56c6c;
	border-radius: 4px;*/
}

</style>
