<template>
<div class="h100">
  <div class="main bg-white" v-loading="loading">
    <el-row class="l-head" style="background-color:#edf0f7" v-show="showMain" type="flex" justify="space-between" align="middle">
        <!-- 面包屑 -->
        <Title style="width:100%" />
    </el-row>
    <div class="contentCon " v-show="showMain" >
      <div class="contentCon_con " >
        <div class="title">
          企业信息
          <!-- <button class="btn" @click="editBtn">
            <i class="el-icon-edit-outline"></i>
            编辑
          </button> -->
          <el-button @click="editBtn" class="wb-edit fs18px" type="text" icon="el-icon-edit-outline">编辑</el-button>
        </div>
        <div class="information">
          <div class="titleCon">
            <i></i>
            <span>基本信息</span>
          </div>
          <ul class="table">
            <li>
              <span class="prop">单位编号 :</span>
              <span class="con">{{tableDate.id}}</span>
            </li>
            <li>
              <span class="prop">单位名称 :</span>
              <span class="con">{{tableDate.maintenanceName}}</span>
            </li>
            <li>
              <span class="prop">合作模式 :</span>
              <span class="con">{{tableDate.serviceUnitJoinModel}}</span>
            </li>
            <li>
              <span class="prop">运营中心 :</span>
              <span class="con">{{tableDate.subCenterName}}</span>
            </li>
            <li>
              <span class="prop">服务期始 :</span>
              <span class="con">{{tableDate.serviceUnitStartDate}}</span>
            </li>
            <li>
              <span class="prop">服务期止 :</span>
              <span class="con">{{tableDate.serviceUnitEndDate}}</span>
            </li>
            <li>
              <span class="prop">企业地址 :</span>
              <span class="con">{{tableDate.address}}</span>
            </li>
            <li>
              <span class="prop">法人姓名 :</span>
              <span class="con">{{tableDate.legalperson}}</span>
            </li>
            <li>
              <span class="prop">联 &nbsp;系&nbsp;人 :</span>
              <span class="con">{{tableDate.conact}}</span>
            </li>
            <li>
              <span class="prop">法人电话 :</span>
              <span class="con">{{tableDate.legalpersonTel}}</span>
            </li>
            <li>
              <span class="prop">联系电话 :</span>
              <span class="con">{{tableDate.conactPhone}}</span>
            </li>
            <li>
              <span class="prop">服务电话 :</span>
              <span class="con">{{tableDate.serviceTel}}</span>
            </li>
            <li>
              <span class="prop">在职人数 :</span>
              <span class="con">{{tableDate.activeEmployees}}</span>
            </li>
            <li>
              <span class="prop">服务区域 :</span>
              <span class="con">{{tableDate.serviceRange}}</span>
            </li>
          </ul>
        </div>
        <div class="qualification">
          <div class="titleCon">
            <i></i>
            <span>资质</span>
          </div>
        </div>
        <div class="banner" >
          <div class="pd20rem"  v-if="dataImg.length<1"><img :src="errorImg" class="errorImg" alt="" srcset=""> </div>
          <div class="pd20rem"  v-if="dataImg.length===1"><img :src="dataImg[0].src" class="errorImg" @click="clickImg($event)" alt="" srcset=""> </div>
          <el-carousel
            :interval="0"
            type="card"
            height="2rem"
            :initial-index="1 ? 1 : 0"
            arrow="always"
            :indicator-position="dataImg.length > 3 ? 'outside' : 'none'"
            v-if="dataImg.length>1"
            :loop='false'
          >
            <el-carousel-item v-for="item in dataImg" :key="item.value">
              <img :src="item.src" @click="clickImg($event)" alt>
              <p class="tex fs16px" :title="item.title">
                {{ item.title }}
              </p>
            </el-carousel-item>
          </el-carousel>

          <!-- <div class="pd20rem"  v-if="dataImg.length<1"><img :src="errorImg" class="errorImg" alt="" srcset=""> </div>
          <div class="pd20rem"  v-if="dataImg.length===1"><img :src="dataImg[0].src" class="errorImg" @click="clickImg($event)" alt="" srcset=""> </div>
          <div style="position: relative; padding: 0 0.5rem;" v-if="dataImg.length>1">
            <div class="swiper-container" style="margin: 0 auto;">
              <div class="swiper-wrapper">
                <div
                  class="wb-plan-item swiper-slide swiper-no-swiping"
                  style="overflow: hidden;"
                  v-for="item in dataImg" 
                  :key="item.value"
                >
                  <div class="swiper-img_block">
                    <img
                      @click="clickImg($event)"
                      :src="item.src"
                    >
                  </div>
                  <p class="swiper-p_block">{{item.title}}</p>
                </div>
              </div>
            </div>
            <div
              class="maintenance-pullWest leftArrow prohibit"
              @click="prev()"
              v-if="dataImg.length > 4"
            ></div>
            <div
              class="maintenance-pullWest rightArrow"
              @click="next()"
              v-if="dataImg.length > 4"
            ></div>
          </div> -->


        </div>
      </div>
    </div>
    <!-- 编辑页面 -->
    <Edit v-if="!showMain" :showMain="showMain" v-on:exitEdit="exitEdit"/>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</div>
</template>
<script>
import api from "~/config/http";
import menuName from "~/config/menu";
import common from "~/utils/common";
import axios from "axios";
import UploadPlace from "~/components/UploadPlace";
import Edit from "~/pages/MaintenanceUnitInformation/BasicView/Edit";
import BigImg from "~/components/BigImg.vue";
import Title from "~/components/Title";
let Swiper = null;
export default {
  components: {
    Edit,
    Title,
    "big-img": BigImg
  },
  data() {
    return {
      loading: false,
      //放大图片
      showImg: false,
      imgSrc: "",
      tableDate: "",
      dataImg: [],
      errorImg:require('@/assets/img/BasicUnitInformation/credentials_error.png'),
      showMain: true,
      // mySwiper: null,
      // step: 4,
      // flag: true
    };
  },
  mounted() {
    this.$nextTick(function() {
      if (process.browser) {
        Swiper = require("swiper");
        window.onresize = () => {
          return (() => {
            this.getEnterpriseInformation();
          })();
        };
        this.getEnterpriseInformation();
      }
    });
  },
  methods: {
    // prev() {
    //   if (this.flag && this.step > 4) {
    //     this.flag = false;
    //     this.mySwiper.swipePrev();
    //   }
    // },
    // next() {
    //   if (this.flag && this.step < this.dataImg.length) {
    //     this.flag = false;
    //     this.mySwiper.swipeNext();
    //   }
    // },
    // initSwiper() {
    //   let _this = this;
    //   if (_this.mySwiper) {
    //     _this.mySwiper.reInit();
    //   } else {
    //     _this.$nextTick(function() {
    //       _this.mySwiper = new Swiper(".swiper-container", {
    //         slidesPerView: 4,
    //         noSwiping: true,
    //         initialSlide: 0,
    //         calculateHeight: true,
    //         onSlidePrev: function(swiper) {
    //           if (_this.step < 5) {
    //             $(".leftArrow").addClass("prohibit");
    //           } else if (_this.step == 5) {
    //             $(".leftArrow").addClass("prohibit");
    //             $(".rightArrow").removeClass("prohibit");
    //             _this.step--;
    //           } else {
    //             $(".leftArrow").removeClass("prohibit");
    //             $(".rightArrow").removeClass("prohibit");
    //             _this.step--;
    //           }
    //           console.log("_this.step", _this.step);
    //         },
    //         onSlideNext: function(swiper) {
    //           if (_this.step > _this.dataImg.length - 1) {
    //             $(".rightArrow").addClass("prohibit");
    //           } else if (
    //             _this.step ==
    //             _this.dataImg.length - 1
    //           ) {
    //             $(".rightArrow").addClass("prohibit");
    //             $(".leftArrow").removeClass("prohibit");
    //             _this.step++;
    //           } else {
    //             $(".leftArrow").removeClass("prohibit");
    //             $(".rightArrow").removeClass("prohibit");
    //             _this.step++;
    //           }
    //           console.log("_this.step", _this.step);
    //         },
    //         onSlideChangeEnd: function(swiper) {
    //           _this.flag = true;
    //         },
    //         onInit: function(swiper) {
    //           // swiper.swipeNext()
    //         }
    //       });
    //     });
    //   }
    // },
    clickImg(e) {
      this.showImg = true; // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    viewImg() {
      this.showImg = false;
    },
    getEnterpriseInformation(data) {
      let self = this;
      self.loading = true;
      api
        .get(
          api.forent_url.maintenance_service_url +
            "/orgInfo/getMaintenanceOrgById?pid="+Math.random(),
          {id:api.getGlobalVal("maintenance_userObj").orgCode}
        )
        .then(res => {
          self.loading = false;
          this.dataImg = [];
          if (res.code == "success") {
            self.tableDate = res.data;
            // res.data.credentials = [{credentialId: "020573be7eb64ba1b7e3afb159c9f072", attachmentName: "消防设施维护保养检测机构二级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/020573be7eb64ba1b7e3afb159c9f072.jpg"},
            //                         {credentialId: "531f981c7f48409b88aa3eca869c665e", attachmentName: "消防设施维护保养检测机构三级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/531f981c7f48409b88aa3eca869c665e.png"},
            //                         {credentialId: "31743afa987c482dafc42cb71c4affba", attachmentName: "消防设施维护保养检测机构三级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/31743afa987c482dafc42cb71c4affba.jpeg"},
            //                         {credentialId: "b26ff8aa0b604934b3e4b9f9e3ecdcb2", attachmentName: "消防安全评估机构一级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/b26ff8aa0b604934b3e4b9f9e3ecdcb2.jpg"},
            //                         {credentialId: "020573be7eb64ba1b7e3afb159c9f072", attachmentName: "消防设施维护保养检测机构二级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/020573be7eb64ba1b7e3afb159c9f072.jpg"},
            //                         {credentialId: "531f981c7f48409b88aa3eca869c665e", attachmentName: "消防设施维护保养检测机构三级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/531f981c7f48409b88aa3eca869c665e.png"},
            //                         {credentialId: "31743afa987c482dafc42cb71c4affba", attachmentName: "消防设施维护保养检测机构三级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/31743afa987c482dafc42cb71c4affba.jpeg"},
            //                         {credentialId: "b26ff8aa0b604934b3e4b9f9e3ecdcb2", attachmentName: "消防安全评估机构一级资质",attachmentUrl: "org/credentials/340104FWJG201806250001/b26ff8aa0b604934b3e4b9f9e3ecdcb2.jpg"},];
            for (let i = 0; i < res.data.credentials.length; i++) {
              const title = res.data.credentials[i].attachmentName;
              const src =
                api.forent_url.image_url +
                res.data.credentials[i].attachmentUrl;
              this.dataImg.push({ title, src });
              // this.initSwiper();
            }
          }
        });
    },
    editBtn() {
      this.showMain = false;
    },
    exitEdit() {
      this.showMain = true;
    }
  },
  watch: {
    showMain: function() {
      this.getEnterpriseInformation();
    }
  }
};
</script>
<style lang="scss" scoped>
  .errorImg{
    width: 2.34rem;
    height: 1.9rem;
    margin-left: .1rem;
  }
  .main {
    width: 100%;
    height: 100%;
  }

  .contentCon {
    padding: .2rem;
    width: 100%;
    height: calc(100% - .7rem);
    .contentCon_con{
      height:100%;
      overflow-y: auto;
      border: 1px solid #efefef;
    }
    .title {
      width: 100%;
      height: 0.5rem;
      line-height: 0.5rem;
      display: flex;
      justify-content: space-between;
      background: #f7f7f7;
      color: #677089;
      padding: 0 8px 0 19px;
      font-size: 0.21rem;
      text-align: left;
      font-weight: bold;
      vertical-align: middle;
    }
    .information {
      width: 100%;
      height: 3.4rem;
      margin-top: 0.2rem;
      .titleCon {
        // margin-top: 20px;
        padding-left: 0.19rem;
        width: 100%;
        height: 0.21rem;
        color: #677089;
        font-weight: bold;
        font-size: 0.19rem;
        line-height: 0.19rem;
        // vertical-align: middle;
        background: #fff;
        i {
          display: inline-block;
          float: left;
          // vertical-align: middle;
          margin-top: 0.01rem;
          margin-right: 0.1rem;
          height: 0.18rem;
          width: 5px;
          background: #ff6822;
        }
        span {
          display: inline-block;
          line-height: 0.18rem;
        }
      }
      .border {
        border: 1px solid #c6c6c6;
      }
    }
  }
  .qualification {
    margin-bottom: .15rem;
    width: 100%;
    text-align: left;
    position: relative;
    .titleCon {
      padding-left: 0.19rem;
      font-weight: bold;
      text-align: left;
      width: 100%;
      height: 0.21rem;
      line-height: 0.19rem;
      color: #677089;
      font-size: 0.19rem;
      background: #fff;
      i {
        display: inline-block;
        margin-top: 0.01rem;
        margin-right: 0.1rem;
        height: 0.18rem;
        width: 5px;
        background: #ff6822;
      }
      span {
        display: inline-block;
      }
    }
  }

  .table {
    float: left;
    list-style: none;
    width: 90%;
    height: 2.4rem;
    margin: 0.15rem 0 0 0.3rem;
    padding: 0;
    li {
      display: inline-block;
      float: left;
      width: 50%;
      height: 0.4rem;
      font-size: 0.16rem;
      // font-weight: bold;
      text-align: left;
      color: #454545;
    }
    .prop {
      font-size: 0.16rem;
      font-weight: bold;
      color: #999999;
      margin-right: 10px;
    }
    .con {
      font-weight: bold;
    }
  }
  .banner {
    position: relative;
  }
  /deep/ .el-carousel__arrow {
    width: 0.6rem;
    height: 0.6rem;
    background: rgba(255, 255, 255, 0);
    font-size: 0.6rem;
    font-weight: bold;
    color: #dbdbdb;
  }
  @media all and (-ms-high-contrast: none),
  (-ms-high-contrast: active) {
    /deep/ .el-carousel__arrow {
      height: 0.8rem;
    } 
  }
  /deep/ .el-carousel__arrow:hover {
    color: #ff6722;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 0.14rem;
    opacity: 0.75;
    line-height: 2rem;
    margin: 0;
  }
  .el-carousel__item {
    background: rgba(255, 255, 255, 0);
    .tex {
      width: 100%;
      height: 0.45rem;
      margin-top: 5px;
      color: #5f687f;
      text-align: center;
      font-weight: 600;
      line-height: 1.4;
      padding: 2px 15px;
      height: 0.45rem;
      overflow:hidden;
    }
  }
  /deep/.el-carousel__indicators {
    display: none;
  }
  .el-carousel__item {
    text-align: center;
  }
  .el-carousel__item img {
    display: inline-block;
    height: 66%;
  }
  // .btn {
  //   border: none;
  //   // width: .8rem;
  //   height: 0.5rem;
  //   line-height: 0.5rem;
  //   background: #f7f7f7;
  //   font-weight: bolder;
  //   color: #5f687f;
  //   font-size: 0.16rem;
  // }
  // .btn:hover {
  //   cursor: pointer;
  // }
  .wb-edit{
    color:#5F687F;
    height: 0.5rem;
    line-height: 0.5rem;
    &:hover{
      color:#409EFF;
    }
  }
  .swiper-slide {
    text-align: center;
    // width: 2.6rem;
    height: 1.9rem;
    img {
      width: auto;
      height: 1.5rem;
      display: inline-block;
      cursor: pointer;
    }
    p {
      color: #5F687F;
      font-size: 0.16rem;
    }
  }
  .maintenance-pullWest {
    border: 0;
    margin-top: -0.2rem;
    cursor: pointer;
    width: 0.4rem;
    height: 0.4rem;
    position: absolute;
    top: 50%;
    text-align: center;
    font-size: 0.4rem;
  }
  .leftArrow {
    left: 5px;
    color: #5f687f;
  }
  .rightArrow {
    right: 5px;
    color: #5f687f;
    transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    // -webkit-transform-origin: center center;
    // transform-origin: center center;
  }
  .prohibit {
    color: #dbdbdb;
    cursor: default;
  }
</style>
