<template>
  <div class="main" id="MaintenancePersonnelInformation">
      <el-row class="l-head "  type="flex" justify="space-between" align="middle">
          <!-- 面包屑 -->
          <Title style="width:100%" />
      </el-row>
      <!--搜索框-->
      <div class="search_div">
        <div class="div-flex align_center border_bottom bg-white" ref="search">
            <label class="color_mo fs18px font_yahei">职位：</label>
            <el-select class="m_r15rem" v-model="position" clearable placeholder="请选择" @change="searchFrom()">
              <el-option
                clearable
                v-for="(item,index) in positionList"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <div class="contract-operation-head div-flex position_r">
              <el-input
                class="enterprise-name-search"
                suffix-icon="el-icon-search"
                v-model.trim="contractName"
                placeholder="请输入姓名或账号"
                clearable="clearable"
                @clear="searchFrom()"
                @change="searchFrom()"
              ></el-input>
            </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-list table_list_one noheader">
        <Table  ref="table"
          :tableList="dataList"
          :options="options"
          :columns="columns"
          :operates="operates"
          :showHeader="false"
          :url="requestUrl"
          @rowClick="rowClick"
        ></Table>
      </div>
  </div>
</template>
<script>
import api from '~/config/http';
import Title from "~/components/Title";
import Table from "~/components/Table";
import mixin from "~/mixin/mixin";
export default {
  mixins: [mixin],
  components:{
    Title,
    Table
  },
  data(){
    return {
      orgId: "",
      positionList:[],
      position:'',
      contractName:'',
      dataList:[],
      userId:'',
      img_obj:{
        weibao:require('@/assets/img/MaintenanceUnitInformation/weibao.png'),
        man:require('@/assets/img/MaintenanceUnitInformation/man.png'),
        women:require('@/assets/img/MaintenanceUnitInformation/women.png'),
      },
      requestUrl:api.forent_url.maintenance_service_url + "userInfo/getUsersByorgIdPage",
      options: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        isShowSerialNumber:false,
        mutiSelect: false // 是否支持列表项选中功能
      }, // table 的参数
      columns: [
        {
          prop: "name",
          label: "",
          align: "center",
          minWidth: "12%",
          formatter: (row, column, cellValue) => {
            var img_url;
            let sexName='';
            if(row.sex == '0'){
              sexName='男';
              img_url=this.img_obj.man
            }else if(row.sex == '1'){
              img_url=this.img_obj.women
              sexName='女';
            }else{
              img_url=this.img_obj.man
              sexName='其他';
            }
            var huoyue;
            if(row.validName == '活跃'){
              huoyue= 'huoyue1'
            }else{
              huoyue= 'huoyue2'
            }
            let userImg = row.headPortrait? api.forent_url.image_url + row.headPortrait : this.img_obj.weibao
           return `
                  <div class="div-flex align_center">
                    <div class="m_r22rem div-flex align_center">
                       <img class="userImg" src="${userImg}" alt="">
                    </div>
                    <div class="flex1 text_left">
                        <div class="headP flex1">${row.name } <img  src="${img_url}" alt=""> <span>${row.age}</span></div>
                        <p><span class="huoyue ${huoyue}" >${row.validName }</span></p>
                    </div>
                  </div>
                  `
          }
        },
        {
          prop: "positionName",
          label: "",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "loginName",
          label: "",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "telephone",
          label: "",
          align: "center",
          minWidth: "10%"
        },
        {
          prop: "credentialsGradeName",
          label: "",
          align: "center",
          minWidth: "10%"
        }
      ], // 需要展示的列
      operates: {
        columnName:'操作',
        widthMin: "20%",
        fixed: "right",
        list: [
          {
            label:'服务企业',
            title:'查看服务企业',
            type: "text",
            class:'services',
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: false,
            method: (index, row) => {
              this.$router.push({
                name:'MaintenanceUnitInformation-MaintenancePersonnelInformationControl-Tabe',
                params:{
                  orgId:row.orgId,
                  userId:row.userId,
                  isService:1
                }
              })
            }
          },
          {
            label:'应急维保',
            type: "text",
            title:'查看应急维保',
            class:'services',
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: false,
            method: (index, row) => {
            	api.setGlobalVal(
					        "CmenuName",
					        JSON.stringify({
					          name: "应急维保跟踪",
					          parName: "维保管理",
					          lightMenu: "4-0"
					        })
					    );
              this.$router.push({
                name:'MaintenanceManagement-EmergencyMaintenanceTracking',
                params:{
                  orgId:row.orgId,
                  userId:row.userId,
                  isEmergency:1
                }
              })
            }
          },
          {
            label:'例行维保',
            type: "text",
            title:'查看例行维保',
            class:'services',
            show: (index, row) => {
              return true;
            },
            plain: false,
            disabled: false,
            method: (index, row) => {
            	api.setGlobalVal(
					        "CmenuName",
					        JSON.stringify({
					          name: "例行维保跟踪",
					          parName: "维保管理",
					          lightMenu: "4-2"
					        })
					    );
              this.$router.push({
                name:'MaintenanceManagement-RoutineMaintenanceTracking',
                params:{
                  orgId:row.orgId,
                  userIds:row.userId,
                  isRoutine:1
                }
              })
            }
          }
        ]
      }
    }
  },
  mounted(){
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    this.getpositionList();
    this.searchFrom()
  },
  methods:{
    rowClick(obj){//点击服务中列表
        let _this = this;
        //详情页面包屑
        let paramCrumb = {
          name: "维保信息人员详情",//title name
              parName: "维保信息人员",//父级title name
              lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
              linkname: "MaintenanceUnitInformation-MaintenancePersonnelInformationControl-Tabe",
              path: "MaintenanceUnitInformation-MaintenancePersonnelInformationControl-Tabe"
        };
        //debugger;
        _this.setDetailBreadcrumb(paramCrumb,true);
        //详情页面包屑 end
        if (obj.column.label != "操作") {
        	sessionStorage.setItem("params",JSON.stringify({
              orgId:obj.row.orgId,
              userId:obj.row.userId
            }))
          this.$router.push({
            name:'MaintenanceUnitInformation-MaintenancePersonnelInformationControl-Tabe',
            params:{
              orgId:obj.row.orgId,
              userId:obj.row.userId
            }
          });
        }
      },
      searchFrom(){
        let params= {
          orgId:this.orgId,
          positions : this.position,
          username:this.contractName
        }
        let _this=this;
        _this.$nextTick(function(){
          _this.$refs.table.queryTableListByParams(params);
          $('.table_list_one').css('height',($(".mainPage").height()-$(".title-main").height()-$(".search_div").height())+'px')
        })
      },
      // 职位结果
      selectTypeName(val){
       this.tableData= []
        api.get(api.forent_url.maintenance_service_url + "/userInfo/getUsersByorgIdPage?orgId=340104FWJG201806250002&username=&positions=" + val + "&pageNo=1&pageSize=" + this.widgetInfo.pageSize)
        .then(res =>{
          this.tableData = res.data.rows;
          this.widgetInfo.pageNo = res.data.pageNo;
          this.total = res.data.total
        })
      },

    //获取职位
    getpositionList(){
      api.get(api.forent_url.maintenance_service_url + "/userInfo/getUserPosition").then(res =>{
        this.positionList = res.data;
      })
    }

  }
}
</script>
<style lang="scss" >
.main{
  height: 100%;
  width: 100%;
}
/*@media screen and (min--moz-device-pixel-ratio:0) {
     /deep/ .el-table__header{
	      display: none;
	    }
	    /deep/.el-table__header-wrapper{
	      display: none;
	    }
}
@media all and (-ms-high-contrast: none),
(-ms-high-contrast: active) {
    /deep/.el-table__header{
      display: none;
    }
    /deep/.el-table__header-wrapper{
      display: none;
    }
}*/

#MaintenancePersonnelInformation{
	/deep/.el-table thead{
		/*display: none;*/
	}
  .userImg{
    width: .61rem;
    height:.61rem;
    border-radius: 50%;
  }
  .border_bottom{
    padding: .11rem .2rem;
    border-bottom:1px solid #DCDFE6;
    .el-input__icon{
      // width: auto;
    }
  }
	.el-table__row{
		cursor: pointer;
	}
  .services button{
    background:transparent;
    width: auto!important;
    border: 0;
    color: #677089;
  }
  .services span{
    display: inline-block;
    position: relative;
    border-right: #677089 solid 2px;
    padding-right: 14px;
    font-size: .15rem;
  }
  .services:last-child span{
    border-right:0;
  }

  .services button:focus,.services button:hover{
    border:0;
    // background-color: #ecf5ff;
    background:transparent;
    color: #ff6000;
  }
  /*.noheader {
    /deep/ .el-table__header{
      display: none;
    }
    .el-table__header-wrapper{
      display: none;
    }
  }*/

  .headP{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family:HiraginoSansGB-W6;
    font-weight:bold;
    font-size:.20rem;
  }
  .huoyue{
    border-radius:3px;
    font-size:.16rem;
    display: inline-block;
    line-height: 1.5;
    padding: 0px 4px;
  }
  .huoyue1{
    background:#ff6000;
    color:#fff;
  }
  .huoyue2{
    background:#8b8b8b;
    color:#fff;
  }
  .noheader /deep/.el-table__row {
    cursor: pointer;
    font-family:"MicrosoftYaHei";
    font-size: 0.18rem;
  }
}
</style>
<style lang="scss" scoped>
/deep/.el-input__suffix-inner {
  cursor: pointer;
}
</style>
