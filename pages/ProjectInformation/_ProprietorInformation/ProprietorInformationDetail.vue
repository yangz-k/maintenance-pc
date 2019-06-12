<template>
  <el-col style="height: 100%;width: 100%;">
    <el-row class=" h100 ">
      <!-- 面包屑 -->
      <el-row class="l-head" type="flex" justify="space-between" align="middle">
          <!-- 面包屑 -->
          <Title />
          <el-button
            class="goBack"
            type="text"
            icon="maintenance-back1"
            @click="back()"
            >返回</el-button
          >
      </el-row>
      <el-row class="bg-white m_b15rem padb_h" v-loading="loading2">
        <div class="switch_tab position_r h100">
          <div class="right_caozuo div-flex flex-end " v-if="parentParams.unitSource == '2' && showEditBtn">
            <!-- <el-button size="mini" type="warning" class="gg-btn fs14px " @click="edit()">编辑</el-button> -->
            <el-button @click="edit()" class="wb-edit fs18px" type="text" icon="el-icon-edit-outline">编辑</el-button>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick" class="h100" style="">
            <!-- 服务中 -->
            <el-tab-pane label="企业信息" name="first">
              <div class="form_table" v-if="parentParams.unitSource == '1'" style="border: none;">
                <!-- start -->
                <div class="pdb0 fs16px boxShadow mb-15">
                  <el-form :model="dataFirst ">
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            服&nbsp;&nbsp;务&nbsp;&nbsp;模&nbsp;&nbsp;式：
                          </div>
                          <div class="form_div">
                            {{dataFirst.enterpriseUnitServiceModelName}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            服&nbsp;&nbsp;务&nbsp;&nbsp;期&nbsp;&nbsp;始：
                          </div>
                          <div class="form_div">
                            {{dataFirst.enterpriseUnitServiceStartDate}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            服&nbsp;&nbsp;务&nbsp;&nbsp;期&nbsp;&nbsp;止：
                          </div>
                          <div class="form_div">
                            {{dataFirst.enterpriseUnitServiceEndDate}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            企&nbsp;&nbsp;业&nbsp;&nbsp;种&nbsp;&nbsp;类：
                          </div>
                          <div class="form_div">
                            {{dataFirst.enterpriseUnitTypeName}}
                          </div>
                        </div>
                    </div>
                  </el-form>
                </div>
                <div class="bg_gray pd5_20rem flex1 color_mo fs20px">
                    基本信息
                </div>
                <!-- 基本信息 -->
                <div class="pdb0 fs16px boxShadow mb-15">
                  <el-form :model="dataFirst">
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;位&nbsp;&nbsp;编&nbsp;&nbsp;号：
                          </div>
                          <div class="form_input_div">
                            {{dataFirst.unitId}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            信&nbsp;&nbsp;用&nbsp;&nbsp;代&nbsp;&nbsp;码：
                          </div>
                          <div class="form_input_div">
                            {{dataFirst.subCenterCode}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;位&nbsp;&nbsp;名&nbsp;&nbsp;称：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.unitName}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            所&nbsp;&nbsp;属&nbsp;&nbsp;行&nbsp;&nbsp;业：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.unitIndustryName}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;位&nbsp;&nbsp;类&nbsp;&nbsp;别：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.unitClassName}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;位&nbsp;&nbsp;地&nbsp;&nbsp;址：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.unitAddress}}
                          </div>
                        </div>
                    </div>
                  </el-form>
                </div>
                <div class="bg_gray div-flex color_mo fs20px pd5_20rem">
                    建筑信息
                </div>
                <!-- 建筑信息 -->
                <div class="pdb0 fs16px boxShadow mb-15">
                  <el-form :model="dataFirst"  >
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            占&nbsp;&nbsp;地&nbsp;&nbsp;面&nbsp;&nbsp;积：
                          </div>
                          <div class="form_input_div">
                            {{dataFirst.areaCode}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            建筑总面积：
                          </div>
                          <div class="form_input_div">
                            {{dataFirst.buildArea}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            建&nbsp;&nbsp;筑&nbsp;&nbsp;数&nbsp;&nbsp;量：
                          </div>
                          <div class="form_input_div">
                            {{dataFirst.buildCount}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            风&nbsp;&nbsp;险&nbsp;&nbsp;类&nbsp;&nbsp;别：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.riskClassName}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            经济所有制：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.unitPropertyName}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            常&nbsp;&nbsp;驻&nbsp;&nbsp;人&nbsp;&nbsp;数：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.employeeNum}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            消防主管单位：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.superviseClass}}
                          </div>
                        </div>
                    </div>
                  </el-form>
                </div>
                <div class="bg_gray color_mo fs20px pd5_20rem">
                    联系人
                </div>
                <!-- 联系人 -->
                <div class="pdb0 fs16px boxShadow">
                  <el-form :model="dataFirst"  >
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;&nbsp;位&nbsp;&nbsp;&nbsp;法&nbsp;&nbsp;&nbsp;&nbsp;人：
                          </div>
                          <div class="form_input_div">
                            {{dataFirst.legalperson}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            联&nbsp;&nbsp;系&nbsp;&nbsp;方&nbsp;&nbsp;式：
                          </div>
                          <div class="form_input_div">
                            {{dataFirst.legalpersonTel}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            消防安全责任人：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.personliable}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            联&nbsp;&nbsp;系&nbsp;&nbsp;方&nbsp;&nbsp;式：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.personliableTel}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            消防安全管理人：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.contacts}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            联&nbsp;&nbsp;系&nbsp;&nbsp;方&nbsp;&nbsp;式：
                          </div>
                          <div class="form_input_div">
                              {{dataFirst.contactsTel}}
                          </div>
                        </div>
                    </div>
                  </el-form>
                </div>
                <!-- end -->
              </div>
              <div class="form_table m_t10rem" v-if="parentParams.unitSource == '2'">
                <!-- start -->
                <div class="bg_gray pd5_20rem flex1 color_mo fs20px">
                    基本信息
                </div>
                <!-- 基本信息 -->
                <div class="pdb0 fs16px">
                  <el-form :model="form_obj"  >
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;位&nbsp;&nbsp;名&nbsp;&nbsp;称：
                          </div>
                          <div class="form_input_div">
                            {{form_obj.unitName}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            单&nbsp;&nbsp;&nbsp;位&nbsp;&nbsp;&nbsp;简&nbsp;&nbsp;&nbsp;称：
                          </div>
                          <div class="form_input_div">
                            {{form_obj.unitShortName}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;位&nbsp;&nbsp;地&nbsp;&nbsp;址：
                          </div>
                          <div class="form_input_div">
                              {{form_obj.province}}
                              {{form_obj.city}}
                              {{form_obj.county}}
                              {{form_obj.unitAddress}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            消防安全管理人：
                          </div>
                          <div class="form_input_div">
                              {{form_obj.contacts}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            管理&nbsp;人&nbsp;电&nbsp;话：
                          </div>
                          <div class="form_input_div">
                              {{form_obj.contactsTel}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            消防安全责任人：
                          </div>
                          <div class="form_input_div">
                              {{form_obj.personliable}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            责任&nbsp;人&nbsp;电&nbsp;话：
                          </div>
                          <div class="form_input_div">
                              {{form_obj.personliableTel}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">
                          <div class="form_title">
                            所&nbsp;&nbsp;&nbsp;属&nbsp;&nbsp;&nbsp;行&nbsp;&nbsp;&nbsp;业：
                          </div>
                          <div class="form_input_div">
                              {{form_obj.unitIndustry}}
                          </div>
                        </div>
                    </div>
                    <div class="form_li div-flex">
                        <div class="flex1 div-flex m_r20rem">
                          <div class="form_title fs16px">
                            单&nbsp;&nbsp;位&nbsp;&nbsp;类&nbsp;&nbsp;别：
                          </div>
                          <div class="form_input_div">
                              {{form_obj.unitClass}}
                          </div>
                        </div>
                        <div class="flex2 div-flex fs16px">

                        </div>
                    </div>
                  </el-form>
                </div>
                <div class="bg_gray div-flex color_mo fs20px pd5_20rem position-r">
                    建筑信息	<span class="flex1 ml-20 text-right white-space" :title="buildAreas.unitName + '共有建筑' + (buildAreas.counts ? buildAreas.counts : '0') + '个，建筑面积' + (buildAreas.buildAreas ? buildAreas.buildAreas : '0') + '平方米'">{{buildAreas.unitName}}共有建筑<i class="color_yingji">{{buildAreas.counts ? buildAreas.counts : '0'}}</i>个，建筑面积<i class="color_yingji">{{buildAreas.buildAreas ? buildAreas.buildAreas : '0'}}</i>平方米</span>
                </div>
                <!-- 建筑信息 -->
                <div class="pdb0">
                  <el-row class="from_div_one dleft m_r15rem m_b15rem form_demo fs16px" v-for="(item,index) in buildArr" :key="index">
                    <span class="left_jiao architecture_buildName" :style="bg_pic" :title="item.buildName">{{item.buildName}}</span>
                    <el-row class="color_9999 m_b15rem">
                      <el-col :span="13" class="ALine">
                        建筑面积：<span class="color_4545" :title="item.buildArea + '平方米'">{{item.buildArea}}平方米</span>
                      </el-col>
                      <el-col :span="11" class="ALine">
                        建筑高度：<span class="color_4545" :title="item.buildHight + '米'">{{item.buildHight}}米</span>
                      </el-col>
                    </el-row>
                    <el-row class="color_9999 m_b15rem">
                      <el-col :span="13" class="ALine">
                        地上层数：<span class="color_4545" :title="item.upFloor + '层'">{{item.upFloor}}层</span>
                      </el-col>
                      <el-col :span="11" class="ALine">
                        地下层数：<span class="color_4545" :title="item.downFloor + '层'">{{item.downFloor}}层</span>
                      </el-col>
                    </el-row>
                    <el-row class="color_9999">
                      <el-col class="ALine">
                        消防验收时间：<span class="color_4545" :title="item.fireAcceptanceTime">{{item.fireAcceptanceTime}}</span>
                      </el-col>
                    </el-row>
                  </el-row>
                  <!-- 循环添加建筑信息 end -->


                  <div class="clearfix"></div>
                </div>
                <div class="bg_gray color_mo fs20px pd5_20rem">
                    主机信息
                </div>
                <!-- 主机信息 -->
                <div class="pdb0 fs16px">
                  <!-- 循环添加主机信息start -->
                  <el-row class="from_div_two m_r15rem m_b15rem dleft form_demo_zhuji" v-for="(item,index) in hostArr" :key="index">
                    <span class="left_jiao host_fireRoom" :style="bg_pic" :title="item.fireRoom" id="fireRoomTitle">{{item.fireRoom}}</span>
                    <el-row class="color_9999 m_b15rem">
                      <el-col :span="13" class="ALine">
                        消控室名称：<span class="color_4545" :title="item.fireRoom" id="fireRoom">{{item.fireRoom}}</span>
                      </el-col>
                      <el-col :span="11" class="ALine">
                        具体位置：<span class="color_4545" :title="item.fireRoomAddress">{{item.fireRoomAddress}}</span>
                      </el-col>
                    </el-row>
                    <el-row class="color_9999 m_b15rem">
                      <el-col class="ALine">
                        消控室电话：<span class="color_4545" :title="item.fireRoomTel">{{item.fireRoomTel}}</span>
                      </el-col>
                    </el-row>
                    <el-row class="color_9999 ">
                      <el-col class="ALine" style="vertical-align: text-top;">
                        <div style="display: flex;">
                          <div>主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：</div>
                          <div class="color_4545 m_r15rem" v-for="(item_type, index) in setArr(item)" :key="index" style="display: inline-block;">
                            <div class="one_item">
                              <div class="gray_block"></div>
                              <p class="slpit" :title="item_type">{{item_type}}</p>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </el-row>

                  <!-- 循环添加主机信息end -->
                  <div class="clearfix"></div>
                </div>
                <!-- end -->
              </div>
            </el-tab-pane>
            <el-tab-pane class="real-time-monitoring-div" label="消防系统运行状况实时监控" name="second" style="padding: 0 .2rem;">
              <RealTimeMonitoring v-if="initFloorBool" :rowData="parentParams"></RealTimeMonitoring>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-row>
    </el-row>
  </el-col>
</template>
<script>
import Title from "~/components/Title";
import RealTimeMonitoring from "./RealTimeMonitoring";
import api from "~/config/http";
import { Message, MessageBox } from "element-ui";
import mixin from "~/mixin/mixin";
export default {
  mixins: [mixin],
  components: {
    Title,
    RealTimeMonitoring
  },
  data() {
    return {
      activeName: 'first',
      parentParams:{},//父级传过来的参数
      loading2: false,
      showEditBtn:true,//是否展示编辑按钮
      map:{},
      buildAreas:{},
      form_obj:{
        unitName:'',//单位名称
        unitShortName:'',//单位简称
        address_lat:'',//经纬度
        contacts:'',//消防安全管理人
        contactsTel:'',//管理人电话
        personliable:'',//消防安全责任人
        personliableTel:'',//责任人电话
        unitIndustry:'',//所属行业
        unitClass:'',//单位类别
        province:'',//省
        city:'',//市
        county:'',//县
      },
      dataFirst: {},
      unitIndustryArr:[],
      unitClassArr:[],
      provinceArr:[],
      provinceArrs:[],
      cityArr:[],
      cityArrs:[],
      countyArr:[],
      countyArrs:[],
      imgUrlObj:{
          adress_pro:require('@/assets/img/ProjectInformation/adress_pro.png'),
          addPropri:require('@/assets/img/ProjectInformation/addPropri.png'),
          addPropri_1:require('@/assets/img/ProjectInformation/addPropri_1.png'),
          del_form_pro:require('@/assets/img/ProjectInformation/del_form_pro.png'),
      },
      bg_pic:{
        backgroundImage: "url(" + require("@/assets/img/ProjectInformation/shili_demo1.png") + ")"
      },
      dialogVisible:false,//显示地图弹窗
      dialog_build:false,//显示建筑弹窗
      buildArr:[{
        buildName: '--',
        buildArea: '--',
        buildHight: '--',
        upFloor: '--',
        downFloor: '--',
        fireAcceptanceTime: '--'
      }], //建筑信息数组
      dialog_host:false,//显示主机弹窗
      hostArr:[{
        fireRoom: "--",
        fireRoomAddress: "--",
        fireRoomTel: "--",
        hostModel: "--"
      }],
      initFloorBool:false//是否加载楼层平面图
    }
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      this.initFloorBool = false;
       this.showEditBtn = true;
      if(tab.name=='first'){
        // this.getUintIfo()//服务中
      }else{
        //楼层平面图
        if(this.parentParams.unitSource == "2"){//自建企业
         this.$alert("业主单位服务升级后，提供对消防系统运行状况的实时监控。服务升级请联系0551-64367910", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {
              this.activeName = "first";
            }
          }).then(() => {
            this.activeName = "first";
          });
        }else{
          this.showEditBtn = false;
          this.initFloorBool = true;
          this.activeName = "second";
        }
      }
    },
    setArr(value){
      return value.hostModel.split(",")
    },
    getDataInfoFirst() {
      let _this=this;
      var info = _this.parentParams;
      api.post(api.forent_url.maintenance_service_url + "/serverUnit/getProprietorById",
        {
          unitId:info.unitId,
          orgId:api.getGlobalVal("maintenance_userObj").orgCode,
          unitSource:info.unitSource
        }
      )
      .then(function(data) {
        var code = data["code"];
        var datas = data["data"];
        if(code == "success") {
          _this.dataFirst = datas;
        }else{
          _this.examplesOfBuildingInformation();
          _this.hostInformationExample(); 
          _this.$message({message: data["message"],type: 'warning'});
        }
      })
    },
    getDataInfo(){
      let _this=this;
      var info = _this.parentParams;
      api.post(api.forent_url.maintenance_service_url + "/serverUnit/getServerUnitInfoById",
        {
          unitId:info.unitId,
          orgId:api.getGlobalVal("maintenance_userObj").orgCode,
          unitSource:info.unitSource
        }
      )
      .then(function(data) {
        var code = data["code"];
        var datas = data["data"];
        if(code == "success") {
          if(datas&&datas.unitList){
            _this.form_obj = datas.unitList;
          }
          if(datas&&datas.buildAreas){
            _this.buildAreas=datas.buildAreas;
          }
          if(datas&&datas.buildList){
            _this.buildArr = datas.buildList;
            if(_this.buildArr && _this.buildArr.length==0){
              _this.examplesOfBuildingInformation(); 
            }
          }else{
            _this.examplesOfBuildingInformation();
          }
          if(datas&&datas.fireRoomList){
            _this.hostArr = datas.fireRoomList;
            if(_this.hostArr && _this.hostArr.length==0){
              _this.hostInformationExample(); 
            }
          } else {
            _this.hostInformationExample(); 
          }
        }else{
          _this.examplesOfBuildingInformation();
          _this.hostInformationExample(); 
          _this.$message({message: data["message"],type: 'warning'});
        }
      })
    },
    edit(){
      var info = this.parentParams;
      info.type = "edit";
        this.$router.push({
          name:'ProjectInformation-ProprietorInformation-ProprietorInformationEdit',
          params: info
        });
    },
    back(){
      this.delKeepAlive();//
      this.$router.push({
        name: "ProjectInformation-ProprietorInformation",
        params: {
          tabName: this.parentParams.tabName
        }
      })
    },
    // 建筑信息示例
    examplesOfBuildingInformation () {
      this.buildArr = [{
        buildName: '示例',
        buildArea: "2000",
        buildHight: "54",
        upFloor: "5",
        downFloor: "5",
        fireAcceptanceTime: "2019-01-01"
      }]
    },
    // 主机信息示例
    hostInformationExample () {
      this.hostArr = [{
        fireRoomAddress: "2/3号楼之间",
        fireRoomTel: "010-6543213",
        hostModel: "海湾湾G220,海湾湾G220"
      }]
      this.$nextTick(()=>{
        $("#fireRoomTitle").html("示例");
        $("#fireRoom").html("3号楼消控室");
        $("#fireRoomTitle").attr("title", "示例");
        $("#fireRoom").attr("title", "3号楼消控室");
      })
      
    }
  },
  mounted () {
    this.parentParams = this.$route.params;
    this.tabName = this.parentParams.tabName;
    //获取详情
    if (this.parentParams.unitSource == '1') {
      this.getDataInfoFirst();
    } else if (this.parentParams.unitSource == '2') {
      this.getDataInfo();
    }
  }
};
</script>
<style lang="scss" scoped>
.boxShadow{
	padding-bottom: 10px;
  box-shadow: 0px 5px 5px rgba(0,0,0,.08);
}
.padb_h {
  height: calc(100% - .7rem);
  padding-bottom: 0.2rem;
}
.pdb0 {
  padding: .15rem .2rem 5px .2rem;
}
// /deep/.el-scrollbar{
// 	height:calc(100% - .7rem);
// 	/deep/.el-scrollbar__view{
// 		height:100%;
// 	}
// }
.m_t10rem{
  margin-top: .1rem;
}

.position_r{
  position: relative;
}
.right_caozuo{
  position: absolute;
  right: 0.2rem;
  top: 0.09rem;
  z-index: 999;
}
.right_caozuo button{
  height: .3rem;
  // width: .53rem;
  width: .8rem;
}

i{
  font-style: normal;
}
.overflow_auto{
  overflow: auto
}
.m-r3px{
  margin-right: 3px;
}
.form_li .el-form-item{
  margin-bottom: 0;
}
.form_table{
  border: #f7f7f7 solid 1px;
}
.form_table .form_line{
  width: 100%;
}
.el-tabs__item{
  font-size: .16rem;
}
.form_title{
  width: 1.6rem;
  display: flex;
  justify-content:flex-end;
  align-items: flex-start;
  color: #9a9a9a;
}
.flex2{
  flex:2;
}
.red {
  color: red;
  margin-right: 2px;
}
.form_input_div{
  display: flex;
  width: 3rem;
  align-items: flex-start;
  position: relative;
}
.form_div{
  display: flex;
  width: 2rem;
  align-items: flex-start;
  position: relative;
}
.form_table .form_span{
  margin-right: .2rem;
}
.form_table .form_input{
  flex:1;
}
.form_table .el-input__inner{
  height: .45rem;
}
.form_li{
  margin-bottom: .1rem;
}
.selected_select{
  display: flex;
}

.adress_pres{
  position: absolute;
  right: .15rem;
  top: .08rem;
  width: .3rem;
  background-color: #fff;
  cursor: pointer;
}
.from_div_one{
  padding:30px 20px 15px 20px;
  border: #ddd solid 1px;
  position: relative;
  width: 407px;
  min-height: 144px;
}
.from_div_two{
  padding:30px 20px 15px 20px;
  border: #ddd solid 1px;
  position: relative;
  width: 500px;
  min-height: 227px;
  margin-bottom: 15px;
}
.left_jiao{
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  background-position: 100%;
  background-repeat: no-repeat;
  background-color: #ff6822;
  padding:2px  12px 2px 5px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
}
.architecture_buildName {
  max-width: 203px;
  overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
.host_fireRoom {
  max-width: 250px;
  overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
.dleft{
  float: left;
}
.color_9999{
  color: #999;
}
.color_4545{
  color: #454545;
}
.ALine {
  overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap;
}
// 弹出地图样式
.el-dialog__body{
  padding: 0px;
}
.input_search{
  position: absolute;
  top: 10px;
  left: 10px;
  box-shadow: 0 0 10px 0px #999;
  border-radius: 5px;
  background-color: #fff;
  padding: 10px;
}
.input_search input{
  padding: 5px 10px;
  width: 300px;
  border: #ddd solid 1px;
  border-radius: 3px;
  margin-right: 5px;
}
.set_div p{
  padding:10px;
  width: 100%;
  border-bottom: #EFEFEF solid 1px;
  background-color: #fff;
}
.tangram-suggestion-main{z-index: 99999!important;}
.BMap_bubble_content{
  margin-top: 10px;
}
#g2map{
  width: 100%;
  height: 100%;
  background-color: #9a9a9a
}
#out_lat{
    color: #ffb156;
    cursor: pointer;
    display: inline-block;
    position: absolute;
    right: 0px;
    bottom: 0px;
}
.BMap_cpyCtrl,.anchorBL{
  display: none!important;
}
.lat_div{
  height: 5rem;
  position: relative;
}
.right_jiao{
  display: inline-block;
  position: absolute;
  right: -5px;
  top: -5px;
  cursor: pointer;
}
.right_jiao img{
  max-width: 100%;
}
.one_item p{
  font-size: 12px;
  text-align: center;
  color: #5f687f;
  margin-top: 4px;
}
.slpit{
  width: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.one_item .gray_block{
width: 78px;height: 58px;background-color: #e0e0e0;}
.color_yingji {
				color: #ff6822;
			}
// 消防系统运行状况
.real-time-monitoring-div{
  height: 100% !important;
  padding: .05rem;
}
.tabCon{
  height:calc(100% - .7rem);
}
/deep/.el-tabs__content{
  height:calc(100% - .5rem);
  overflow: auto;
  /*padding: 0 .2rem;*/
}
.position-r {
  position: relative;
}
.max-width {
  position: absolute;
  right: 0;
  max-width: 6rem;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.wb-edit{
  color:#5F687F;
  &:hover{
    color:#409EFF;
  }
}
</style>
