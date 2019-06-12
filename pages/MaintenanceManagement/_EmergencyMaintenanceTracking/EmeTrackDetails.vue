<template>
  <el-row class="contract-main" style="height: 100%;">
    <el-row class="l-head" type="flex" justify="space-between" align="middle">
      <el-col :span="12">
        <!-- 面包屑 -->
        <Title/>
      </el-col>
      <el-col :span="1">
        <el-button class="goBack" type="text" icon="maintenance-back1" @click="cabackList">返回</el-button>
      </el-col>
    </el-row>
    <el-row class="detail" :gutter="20" v-loading="loading">
      <el-col :span="12" class="div-flex leftCon">
        <el-card>
          <div slot="header">
            <span class="tailTitle">应急维保订单申请信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <span class="textStyle">维保单号：</span>
              <span class="textRight">{{stepsData ? stepsData.applyInfo.orderId : ''}}</span>
            </el-col>
            <el-col :span="12">
              <span class="textStyle">业主单位：</span>
              <span class="textRight">{{stepsData ? stepsData.applyInfo.proprietorName : ''}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="textStyle">申请时间：</span>
              <span class="textRight">{{stepsData ? stepsData.applyInfo.applicantTime : ''}}</span>
            </el-col>
            <el-col :span="12" v-if="pageParams.tabName == 'first'">
              <span class="textStyle">预约时间：</span>
              <span class="textRight">{{stepsData ? stepsData.applyInfo.bespeakTime : ''}}</span>
            </el-col>
            <el-col :span="12" v-if="pageParams.tabName == 'second'">
              <span class="textStyle">联系电话：</span>
              <span class="textRight">{{stepsData ? stepsData.applyInfo.contactsPhone : ''}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="textStyle letterSpacingSan">联系人：</span>
              <span class="textRight">{{stepsData ? stepsData.applyInfo.contacts : ''}}</span>
            </el-col>
            <el-col :span="12" v-if="pageParams.tabName == 'first'">
              <span class="textStyle">联系电话：</span>
              <span class="textRight">{{stepsData ? stepsData.applyInfo.contactsPhone : ''}}</span>
            </el-col>
          </el-row>
          <el-row>
            <span class="textStyle">维保要求：</span>
            <span class="textRight">{{stepsData ? stepsData.applyInfo.maintenanceDemand : ''}}</span>
          </el-row>
         <!-- <el-row v-if="pageParams.tabName == 'first'">
            <el-col :span="12">
              <div class="fl">
                <span class="textStyle letterSpacingSan">评价人：</span>
                <span class="textRight">{{assessPerson ? assessPerson : '暂无'}}</span>
              </div>
              <el-rate
                class="fl"
                v-model="userStar"
                disabled
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </el-col>
            <el-col :span="12">
              <div v-for="item in keyWord" :key="item" :value="item">
                <span class="Evaluation fl">{{item}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="pageParams.tabName == 'first'">
            <el-col>
              <span class="textStyle letterSpacingEr">评价：</span>
              <span class="textRight">{{desc}}</span>
            </el-col>
          </el-row>-->
          <el-row v-if="pageParams.tabName == 'first'">
            <el-row v-for="(step,index) in ReassignVO" :key="index" class="emergencyService">
              <el-row v-if="step.reassignUser" class="steps-container">
                <el-steps direction="vertical" class="deal-steps" :active="active">
                  <el-step
                      :title="step.reassignTime"
                      class="textStyle"
                      v-for="(step,index) in ReassignVO"
                      :key="index"
                    >
                    <span slot="icon" class="step-icon step-unavtive"></span>
                    <div slot="description" class="step-info">应急维保订单{{step.orgerId}}由{{step.reassignUser}}操作改派给{{step.reassignTo}}</div>
                  </el-step>
                </el-steps>
              </el-row>
            </el-row>
          </el-row>
        </el-card>
        <el-card>
          <div slot="header" class="clearfix">
            <span class="tailTitle">维保信息</span>
          </div>
          <el-row>
            <span class="textStyle letterSpacingSi">维保人员：</span>
            <span class="textRight">{{stepsData ? stepsData.maintenanceInfo.personName : ''}}</span>
          </el-row>
          <el-row v-if="pageParams.tabName == 'first'">
            <span class="textStyle">服务及时性：</span>
            <span class="textRight">{{stepsData ? stepsData.maintenanceInfo.serviceValidity : ''}}</span>
          </el-row>
          <el-row>
            <span class="textStyle letterSpacingSi">服务状态：</span>
            <span class="textRight">{{stepsData ? stepsData.maintenanceInfo.serviceStatus : ''}}</span>
          </el-row>
        </el-card>
        <el-card class="flex1" style="margin-bottom: 0;flex:auto">
          <div slot="header">
            <span class="tailTitle">{{pageParams.tabName  == 'first' ?  '订单详情' : '报警详情'}}</span>
            <el-button class="flortR" style="width:auto" type="text" icon="maintenance-newtime" @click="details" v-if="pageParams.tabName == 'second'">历史记录</el-button>
          </div>
          <div v-if="pageParams.tabName == 'first' && pageParams.maintenanceType == '1' || pageParams.tabName == 'second'">
            <div v-for="(item , index) in orderDetail" :key="index">
              <el-row>
                <span class="textStyle">楼栋楼层：</span>
                <span class="textRight">{{item ? item.buildAndFloorInfo :''}}</span>
              </el-row>
              <el-row>
                <span class="textStyle letterSpacingEr">设施：</span>
                <span class="textRight">{{item ? item.deviceType :''}}</span>
              </el-row>
              <el-row>
                <span class="textStyle letterSpacingEr">位置：</span>
                <span class="textRight">{{item ? item.deviceAddress :''}}</span>
              </el-row>
              <el-row>
                <span class="textStyle letterSpacingEr">描述：</span>
                <span class="textRight">{{item ? item.deviceDescription :''}}</span>
              </el-row>
              <el-row v-if="pageParams.tabName == 'first'">
                <span class="textStyle letterSpacingEr">照片：</span>
                <div v-if="urlLists.length === 0"></div>
                <div v-else>
                  <img class="img" :src="item" @click="enlarge($event)" v-for="(item, index) in urlLists" :key="index" alt>
                </div>
              </el-row>
            </div>
          </div>
          <div v-if="pageParams.tabName == 'first' && pageParams.maintenanceType != '1'">
            <el-collapse accordion v-for="(item , index) in orderDetail" :key="index" v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title" style="padding: 0 0 15px 0;">
                  <el-col :span="20">
                    <span class="textStyle orange" style="font-size: 0.18rem;">隐患编号：</span>
                    <span class="textRight orange" style="font-size: 0.18rem;">{{item ? item.dangerId : ''}}</span>
                  </el-col>
                  <el-col :span="4" v-if="item.dealState">
                    <span class="state">
                      {{item ? item.dealState : ''}}
                    </span>
                  </el-col>
                </template>
                <el-row>
                  <span class="textStyle">位置信息：</span>
                  <span class="textRight">{{item ? item.deviceAddress :''}}</span>
                </el-row>
                <el-row>
                  <span class="textStyle">设备类型：</span>
                  <span class="textRight">{{item ? item.deviceType :''}}</span>
                </el-row>
                <el-row>
                  <span class="textStyle letterSpacingEr">照片：</span>
                  <div v-if="urlListsDanger.length === 0"></div>
                  <div v-else>
                    <img class="img" :src="item" @click="enlarge($event)" v-for="(item, index) in urlListsDanger" :key="index" alt>
                  </div>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-col>
      <el-col class="rightCon" :span="12">
        <el-card style="height: 100%; margin-bottom: 0;">
          <div slot="header">
            <span class="tailTitle">订单详情跟踪</span>
          </div>
          <div class="serviceTime" v-if="flag">
              <i
                class="maintenance-calendar"
                style="font-size: 0.26rem; margin-right: 5px; color: #ff951b;"
              ></i>
              本次应急维保已服务{{stepsData ? stepsData.OrderTracking.maintenanceTime :''}}
          </div>
          <div class="serviceTime" v-if="!flag">
            <i
              class="maintenance-sureSolid"
              style="font-size: 0.26rem; margin-right: 5px; color: #30B84A;"
            ></i>
            本次应急维保服务历时{{stepsData ? stepsData.OrderTracking.maintenanceTime :''}}完成
          </div>
          <div class="emergencyService">
            <!-- <el-scrollbar> -->
              <div class="steps-container">
                <el-steps direction="vertical" class="deal-steps flex-flow" :active="active">
                  <el-step
                    :class="step.stateName.indexOf('已完成处置')>-1 || step.stateName.indexOf('处置第')>-1 ? 'red': step.stateName=='已确认' ? 'green' : ''"
                    :title="step.stateName"
                    class="textStyle flex1"
                    v-for="(step,index) in process"
                    :key="index"
                    >
                    <span slot="icon" class="step-icon step-unavtive"></span>
                    <div slot="description" class="step-info" v-if="step.concat">{{step.concat}}</div>
                    <div slot="description" class="step-info" v-if="step.bluetooth">{{step.bluetooth}}</div>
                    <div slot="description">
                      <div v-if="step.handingInfo.problemFix">
                        <span style="color: #666;">问题定位：</span>
                        {{step.handingInfo.problemFix}}
                      </div>
                      <div v-if="step.handingInfo.maintenanceDesc">
                        <span style="color: #666;">处置描述：</span>
                        {{step.handingInfo.maintenanceDesc}}
                      </div>
                      <div v-if="step.handingInfo.emergencyHandle">
                        <span style="color: #666;">应急措施：</span>
                        {{step.handingInfo.emergencyHandle}}
                      </div>
                      <div v-if="step.handingInfo.attachList">
                        <div v-if="pics.length === 0"></div>
                        <div v-else>
                          <img :src=item v-for="(item, index) in pics" :key="index" alt="" class="img" @click="enlarge($event)">
                        </div>
                      </div>
                    </div>
                    <span slot="description" class="step-time">{{step.time ? step.time :''}}</span>
                  </el-step>
                </el-steps>
              </div>
            <!-- </el-scrollbar> -->
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 显示图片 -->
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </el-row>
</template>
<script>
import api from "~/config/http";
import Title from "~/components/Title";
import BigImg from "~/components/BigImg.vue";
import { Message, MessageBox } from "element-ui";
import mixin from "~/mixin/mixin";
export default {
  mixins: [mixin],
  components: {
    Title,
    "big-img": BigImg
  },
  data() {
    return {
      loading:false,
      //放大图片
      showImg: false, // 照片详情弹框隐藏
      imgSrc: "",
      activeNames: '1',
      active: null,
      ReassignVO: '', // 评价内容
      pageParams: {}, // 跳转时传入参数
      stepsData: "", // 应急维保订单申请信息数据
      assessPerson: "", // 评价人
      userStar: null, // 评分
      scoreDescription: "",
      orderDetail: [], //订单详情
      keyWord:[], // 评价内容
      desc:'', // 评价
      process: [], // 订单详情跟踪步骤
      urlLists: [], // maintenanceType=1时的照片
      urlListsDanger: [], // maintenanceType!=1时的照片
      pics: [], // 订单详情跟踪图片
      flag: true,
    };
  },
  methods: {
    // 历史记录详情页
    details() {
      this.$router.push({
        name: 'MaintenanceManagement-EmergencyMaintenanceTracking-AlarmDetails',
        params: this.pageParams
      })
    },
    viewImg() {
      this.showImg = false;
    },
    // 点击图片显示弹框
    enlarge(e) {
      this.showImg = true; // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    // 编辑页面返回按钮
    cabackList () {
      this.delKeepAlive();//
      this.$router.push({
        name: "MaintenanceManagement-EmergencyMaintenanceTracking",
        params: this.pageParams
      });
    },
    //显示详情页，请求
    detailSteps() {
      this.loading = true;
      let that = this;
      that.isList = false;
      // orderId存在时发送请求
      if (that.pageParams.orderId && that.pageParams.orderId !== "") {
        if (this.pageParams.tabName == 'first') {
          api.get(api.forent_url.maintenance_service_url+"/maintenance/getEmergencyOrderBasicInfo", {
            orderId: that.pageParams.orderId
          }).then(res => {
            if (res.code === "success") {
              that.loading = false;
              // 应急维保订单申请信息数据
              that.stepsData = res.data;
              // 评分
              that.userStar = res.data.applyInfo.score;
              // 评价内容
              that.ReassignVO = res.data.maintenanceInfo.ReassignVO;
              // 评价人
              that.assessPerson = res.data.applyInfo.assessPerson;
              // 评价及评价内容
              that.scoreDescription = res.data.applyInfo.scoreDescription;
              //订单详情
              that.orderDetail = res.data.orderDetail;
              // 订单详情跟踪步骤
              that.process = res.data.OrderTracking.process;
              if (that.scoreDescription) {
                // 评价内容
                that.keyWord = JSON.parse(res.data.applyInfo.scoreDescription).keyWord;
                // 评价
                that.desc = JSON.parse(res.data.applyInfo.scoreDescription).desc;
              }
              //订单详情照片
              if (that.orderDetail != null && that.orderDetail.length > 0) {
                that.orderDetail.forEach(item => {
                  // maintenanceType=1时的照片
                  if (item.attachment != null && item.attachment.length > 0) {
                    item.attachment.forEach(ele => {
                      that.urlLists.push(api.forent_url.image_url + ele.attachPath);
                    });
                  }
                  // maintenanceType!=1时的照片
                  if (item.faultAttach != null && item.faultAttach.length > 0) {
                    item.faultAttach.forEach(ele => {
                      that.urlListsDanger.push(api.forent_url.image_url + ele.attachPath);
                    });
                  }
                });
              }
              // 判断显示订单详情跟踪标题
              that.process.forEach(element=>{
                if (element.stateName.indexOf('已完成处置') > -1) {
                  that.attachList = element.handingInfo.attachList
                  that.flag = false
                }
              })
              // 获取显示订单详情跟踪图片
              if (that.attachList && that.attachList.length > 0) {
                that.pics = []
                that.attachList.forEach(element=>{
                  that.pics.push(api.forent_url.image_url + element.attachPath)
                })
              }
            }
          });
        } else if (this.pageParams.tabName == 'second') {
          api.get(api.forent_url.maintenance_service_url+"/maintenance/getPredictionEmergencyOrderBasicInfo", {
            orderId: that.pageParams.orderId
          }).then(res => {
            if (res.code === "success") {
              that.loading = false;
              // 应急维保订单申请信息数据
              that.stepsData = res.data;
              // 评分
              that.userStar = res.data.applyInfo.score;
              // 评价内容
              that.ReassignVO = res.data.maintenanceInfo.ReassignVO;
              // 评价人
              that.assessPerson = res.data.applyInfo.assessPerson;
              // 评价及评价内容
              that.scoreDescription = res.data.applyInfo.scoreDescription;
              //订单详情
              that.orderDetail = res.data.orderDetail;
              // 订单详情跟踪步骤
              that.process = res.data.OrderTracking.process;
              if (that.scoreDescription) {
                // 评价内容
                that.keyWord = JSON.parse(res.data.applyInfo.scoreDescription).keyWord;
                // 评价
                that.desc = JSON.parse(res.data.applyInfo.scoreDescription).desc;
              }
              //订单详情照片
              if (that.orderDetail != null && that.orderDetail.length > 0) {
                that.orderDetail.forEach(item => {
                  // maintenanceType=1时的照片
                  if (item.attachment != null && item.attachment.length > 0) {
                    item.attachment.forEach(ele => {
                      that.urlLists.push(api.forent_url.image_url + ele.attachPath);
                    });
                  }
                  // maintenanceType!=1时的照片
                  if (item.faultAttach != null && item.faultAttach.length > 0) {
                    item.faultAttach.forEach(ele => {
                      that.urlListsDanger.push(api.forent_url.image_url + ele.attachPath);
                    });
                  }
                });
              }
              // 判断显示订单详情跟踪标题
              that.process.forEach(element=>{
                if (element.stateName.indexOf('已完成处置') > -1) {
                  that.attachList = element.handingInfo.attachList
                  that.flag = false
                }
              })
              // 获取显示订单详情跟踪图片
              if (that.attachList && that.attachList.length > 0) {
                that.pics = []
                that.attachList.forEach(element=>{
                  that.pics.push(api.forent_url.image_url + element.attachPath)
                })
              }
            }
          });
        }
      }
    },
  },
  created() {},
  mounted() {
    this.pageParams = this.$route.params;
    this.detailSteps();
  }
};
</script>
<style lang="scss" scoped>
.detail {
  text-align: left;
  padding: 20px;
  height: calc(100% - 0.7rem);
  overflow-y: auto;
  margin:0!important;
  /*margin-bottom: 20px;*/
  background-color: #fff;
  /deep/.el-card.is-always-shadow {
    box-shadow: none;
  }
  /deep/.el-collapse-item__wrap {
    border-bottom: none;
  }
  /deep/.el-collapse-item__arrow {
    transform: rotate(-90deg);
    color: #ff9e2f;
    font-size: 0.3rem;
  }
  /deep/.el-collapse-item__arrow.is-active {
    transform: rotate(90deg);
  }
  .leftCon{
  	flex-direction: column;
  	justify-content: space-between;
  	min-height: 100%;
  }
  .rightCon{
  	min-height:100%;
  }
  /deep/.el-collapse-item__header {
    border: none;
  }
}
.detail .el-card {
  margin-bottom: 10px;
  position: relative;
  border: 1px solid #EFEFEF;
}
/deep/.el-card__header {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  background:rgba(150,150,150,0.08);
}
.tailTitle {
  font-family: "Adobe 黑体 Std";
  font-size: 0.2rem;
  color: #333;
  font-weight: 400;
  color: #4D5877;

}
.flortR {
  float: right;
  font-family: "Adobe 黑体 Std";
  font-size: 0.18rem;
  color: #5F687F;
  line-height: 40px;
}
.flortR:hover {
  color: #409EFF;
}
.state {
  float: right;
  color: #ff9e2f;
  font-size: 0.18rem;
  border: 1px solid #ff9e2f;
  padding: 5px;
  line-height: 0.18rem;
  margin-right: 5px;
}
.serviceTime {
  line-height: 0.26rem;
  font-size: 0.26rem;
  margin: 20px 0 20px 15%;
}
.textStyle {
  font-family: "Adobe 黑体 Std";
  font-size: 0.16rem;
  color: #999;
}
.letterSpacingEr {
  letter-spacing: 0.15rem;
}
.letterSpacingSan {
  letter-spacing: 0.05rem;
}
.letterSpacingSi {
  letter-spacing: 0.04rem;
}
.img {
  cursor: pointer;
  width: 80px;
  height: 80px;
}
.textRight {
  color:#333;
  font-size: 0.16rem;

  /*white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp:2; //显示的行*/
  overflow: hidden;
  text-overflow: ellipsis;
  /*display: -webkit-box;*/
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.Evaluation {
  padding: 5px 10px;
  border: 1px solid #d8dde3;
  border-radius: 5px;
  margin-left: 10px;
  margin-bottom: 10px;
}
.orange {
  color: #ff9e2f !important;
  font-size: 0.18rem;
}
.fl {
  float: left;
}
.el-rate {
  margin-left: 10px;
}
.forward {
  display: block;
  position: absolute;
  top: -50px;
  right: 20px;
  cursor: pointer;
}
/deep/.el-collapse {
  border: none;
}
/deep/.el-collapse-item__content {
  padding-bottom: 0;
}
</style>
<style lang="scss">
.emergencyService {
  // margin-bottom: 20px;
  /*// height: 580px;*/
  // 步骤条详细信息背景颜色
  $stepDetailBgcColor: #f6f6f5;
  $stepDetailFontColor: #999999;
  $unactiveColor: #999999;
  $activeColor: #409eff;
  /* 误报色块背景色 */
  $errorBgcColor: #ed9b95;
  /* 表格状态栏绿色颜色 */
  $tableStatusColor: #0ebd75;
  /* 详情窗口 */
  // #detail-dialog {
  //     /* 步骤条容器 */

  // }
  /deep/.el-scrollbar__wrap {
    margin-bottom: 0 !important;
    margin-top: -20px;
  }
  .steps-container {
    margin: 40px;
    /*// max-height: 580px;*/
    font-family: "microsoft yahei";

    /* 步骤条组件样式修改 */
    .deal-steps {
      margin-left: 100px;
      /*// height: 300px;*/

      .el-step.is-vertical {
        /* 步骤线长 */
        .el-step__line {
          width: 1px !important;
          top: 16px;
          bottom: -21px;
          left: 11px;
          margin-left: -3px;

          // border-right: none;
          // 线条颜色
          .el-step__line-inner {
            border-color: #c0c4cc;
          }
        }

        /* 进度条 圆点图标 */
        .el-step__icon {
          width: 16px;
          height: 16px;
          /*未激活状态圆点颜色*/
          border: 4px solid #5b9df1;
          /*border: 4px solid #c0c4cc*/ /*灰色*/
          /*border: 4px solid #8fc31f*/ /*绿色*/
        }
        .el-step__head.is-finish {
          /* 进度条 圆点图标 */
          // .el-step__icon {
          //     width: 4px;
          //     height: 4px;
          //     border:{
          //         color:$activeColor;
          //     }
          // }
          // 进度条线段颜色
          border: {
            color: #ff4141;
          }
          //激活状态
          .el-step__icon {
            border-color: #8fc31f;
          }

        }

        .el-step__icon {
          border-color: #8fc31f;
        }
        /* 步骤描述上方*/
        /*.el-step__description {
          color: unset;
          padding-right: 3%;
          !*margin-top: -40px;*!
          margin:-40px 0 10px 0;
          }*/
        /* 步骤描述下方*/
        .el-step__description {
          color: unset;
          padding-right: 3%;
          margin-top: -5px;
          font-size: 0.16rem;
          line-height: 2;
        }

        .el-step__title {
          color: #000;
          font-size: 0.16rem;
        }

        /*.el-step__title.is-finish {
        color: $activeColor;
        }*/
      }
      .red {
        /deep/.el-step__icon {
          border-color: #ff4141 !important;
        }
      }
      .green {
        /deep/.el-step__icon {
          border-color: #4ca905 !important;
        }
      }
      // 激活状态
      .step-active {
        width: 3px;
        height: 3px;

        border: {
          width: 1px;
          style: solid;
          color: black;
          radius: 3px;
        }
      }

      /* 通知 */
      .step-notice {
      }

      /* 非激活状态 */
      .step-unactive {
        width: 3px;
        height: 3px;

        border: {
          width: 1px;
          style: solid;
          color: black;
          radius: 3px;
        }
      }

      .step-info {
        // 头部图标
        .step-info-icon {
          display: inline-block;
        }

        // 内容
        .step-info-content {
          display: inline-block;
        }

        // 状态标记
        .step-info-mark {
          display: inline-block;
          width: 30px;
          height: 16px;
          line-height: 15px;
          text-align: center;

          color: #fff;

          // padding: 2px;
          border: {
            radius: 2px;
          }

          &.error {
            background-color: $errorBgcColor;
          }
        }
      }
      /*时间在左侧*/
      /*
        .step-time {
        position: relative;
        color: #999999;
        word-wrap: break-word;
        left: -120px;
        width:70px;
        top:15px;
        display: inline-block;
        }
      */
      /*时间在右侧*/
      .step-time {
        position: relative;
        color: #999999;
        word-wrap: break-word;
        /*top:15px;*/
        top: 1px;
        display: inline-block;
      }

      .step-detail {
        /*background-color: $stepDetailBgcColor;*/
        border-radius: 5px;
        /*padding: 10px;*/
        /*margin-left: 80px;*/
        margin: 10px 0 0 70px;

        .step-detail-img {
          display: block;
          height: 60px;
          width: 60px;
        }
      }
    }
  }
}
</style>
