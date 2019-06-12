<template>
  <div class="real-time-div">
    <div v-if="pageSwitchBool" style="height:100%">
      <div :id="mapDiv"></div>
      <!-- 视频弹框 -->
      <div
        style="width: 600px;
        height:100%;
        position: absolute;
        z-index: 99999;
        left: 4rem;
        top: 1.2rem;
        border: 0;"
        v-if="videoBool"
      >
        <a
          class="btn-close maintenance-removeSolid"
          href="javascript:;"
          @click="closeVideo()"
        ></a>
        <video
          id="myPlayer"
          :src="playerUrl"
          poster=""
          controls
          playsInline
          webkit-playsinline
          autoplay
          style="width: 600px;height: 400px;"
        ></video>
      </div>
      <!-- 火警列表 -->
      <div class="gg-fire-content">
        <div class="gg-fire-icon" @click="fireClick()"></div>
        <div class="fire-alarm-outside">
          <div id="monitor-alarm-list" class="gg-fire-panel scroll-normal">
            <dl
              v-for="(item, index) in alarmList"
              :key="index"
              :class="['clearfix', 'gg-fire-dl', index == alarmList.length - 1 ? '' : 'gg-fire-bd']"
              @click="openFloorPage(item.buildId,item.floorId,item.deviceId)"
            >
              <div class="fire-alarm-time">
                <div class="gg-fire-dt">{{ item.warningTimeHH }}</div>
                <div class="gg-fire-date">{{ item.warningTimeDD }}</div>
              </div>
              <div class="gg-fire-dd">
                <h3 class="gg-fire-title" :title="item.deviceType">
                  {{ item.deviceType }}
                </h3>
                <p class="gg-fire-add" :title="item.deviceAddress">
                  {{ item.deviceAddress }}
                </p>
              </div>
            </dl>
            <div v-if="alarmList.length == 0" class="gg-text-notice">
              暂无报警！
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <FloorStoreyInfo :regionList="buildArr" :region="region" :currentFloorParent="currentFloor" :currentDeviceParent="currentDevice" :rowData="rowData" @goBack="goBack"></FloorStoreyInfo>
    </div>
  </div>
</template>
<script>
import api from "~/config/http";
import mapConfig from "~/config/mapConfig";
import { Message, MessageBox } from "element-ui";
import FloorStoreyInfo from "./FloorStoreyInfo";
export default {
  components: {
    FloorStoreyInfo
  },
  props: {
    rowData: {
      type: Object
    }
  },
  data() {
    return {
      pageSwitchBool:true,//展示那个页面
      orgId: "",
      mapDiv: "g2map",
      g2map: {}, //地图对象
      elementLayer: {}, //元素图层
      tooltipWare: {},
      aerialviewImg: "", //楼层平面图地址
      videoBool: false, //是否展示视频
      playerUrl: "", //播放视频地址
      alarmList: [], //报警列表
      buildArr:[],//楼栋楼层数据
      region:"",//楼栋楼层值
      currentFloor:"",//当前楼层
      currentDevice:""//当前设备
    };
  },
  methods: {
    //设备信息点击了返回按钮
    goBack(){
      this.pageSwitchBool=true;
      const _this = this;
      this.$nextTick(function(){
        _this.initPage();
      })
    },
    //初始化页面
    initPage() {
      //初始化地图
      const _this = this;
      this.initMap().then(() => {
        //初始化楼层平面图
        let floorUrl =
          api.forent_url.maintenance_service_url +
          "/recordEnterprise/enterprises/1/" +
          _this.rowData.unitId;
        api.get(floorUrl).then(res => {
          if (res && res["code"] == "success") {
            let data = res["data"][0] || "";
            if (data && data.aerialviewImg) {
              //楼层平面图地址
              _this.aerialviewImg =
                api.forent_url.image_url + "/floorImage/" + data.aerialviewImg;
              //初始化楼层平面图
              _this.initFloorImg(_this.aerialviewImg);
              //获取监测建筑信息并加载
              _this.queryMonitoringBuildingInformation();
              //获取企业报警列表
              _this.getAlarmList();
            } else {
              Message.error("暂无楼层图！");
            }
          } else {
            Message.error("暂无楼层图！");
          }
        });
      });
    },
    //初始化地图
    initMap() {
      const _this = this;
      return new Promise((resolve, reject) => {
        this.g2map = new _this.gs2.carto.Map({
          defaultExtent: mapConfig.defaultExtent3857
        });
        this.g2map.init({
          targetId: this.mapDiv
        });
        this.elementLayer = new _this.gs2.lys.ElementLayer();
        this.elementLayer.setZIndex(9);
        this.g2map.addLayer(this.elementLayer);
        this.tooltipWare = new _this.gs2.ext.TooltipWare({
          excluseLayerIds: this.elementLayer.getLayerId(),
          map: this.g2map
        });
        resolve();
      });
    },
    //初始化楼层平面图页面
    initFloorImg(imgUrl) {
      let _this = this;
      let img = new Image();
      img.src = imgUrl;
      img.onload = function() {
        let w = img.width * 1000;
        let h = img.height * 1000;
        let imagLayer = new _this.gs2.lys.ImageLayer({
          imageType: 702,
          extent: [0, 0, w, h], //图片范围，请按照坐标系的范围给出，此为3857的坐标系范围
          crossOrigin: "anonymous", //跨域
          url: imgUrl // 图层服务 url
        });
        _this.g2map.addLayer(imagLayer);
        let point = new _this.gs2.geom.Point({
          x: w / 2,
          y: h / 2 - 40000,
          spatialReference: _this.gs2.geom.SpatialReference.EPSG3857
        });
        _this.g2map.setCenter(point);
        _this.g2map.zoomTo(8);
      };
    },
    //获取监测建筑信息并加载
    queryMonitoringBuildingInformation() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getTAndAByUnitId";
      api.post(serviceUrl, { unitId: this.rowData.unitId ,orgId:this.orgId,type:"2"}).then(res => {
        if (res && res["code"] == "success") {
          let buildArr = res["data"] || [];
          this.buildArr = buildArr;
          if (buildArr && buildArr.length > 0) {
            for (let key in buildArr) {
              let build = buildArr[key];
              if (build["unitPointX"] !== "" && build["unitPointY"] !== "") {
                let point = new this.gs2.geom.Point({
                  x: build["unitPointX"],
                  y: build["unitPointY"],
                  spatialReference: this.gs2.geom.SpatialReference.EPSG3857
                });
                let pictureMarker = new this.gs2.syms.Picturemarkersymbol({
                  source:
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjEwN0JBRjg3MzJGRjExRThBMjcwREFDMDM5RkQwMjYxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjEwN0JBRjg4MzJGRjExRThBMjcwREFDMDM5RkQwMjYxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTA3QkFGODUzMkZGMTFFOEEyNzBEQUMwMzlGRDAyNjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTA3QkFGODYzMkZGMTFFOEEyNzBEQUMwMzlGRDAyNjEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6frkWPAAAHmUlEQVR42uxY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",
                  width: 40,
                  height: 40,
                  offsetX: 20,
                  offsetY: 20
                });
                let ele = new this.gs2.ele.Element({
                  geometry: point,
                  symbol: pictureMarker
                });
                ele.tag = build;
                this.elementLayer.add(ele);
                //设备数  展示 总设备数
                if (build.runState === NaN || build.runState === "") {
                  build.runState = 0;
                }
                if (build.alarmState === NaN || build.alarmState === "") {
                  build.alarmState = 0;
                }
                if (build.troubleType === NaN || build.troubleType === "") {
                  build.troubleType = 0;
                }
                if (build.warningState === NaN || build.warningState === "") {
                  build.warningState = 0;
                }
                let build_monitor = 'style="display:block"';
                let simple_monitor = 'style="display:none"';
                let build_offset = 'style="top:5px"';
                let simple_state = "";
                if (build.alarmState > 0) {
                  simple_state = '<div class="simple-state-alarm"></div>';
                } else {
                  if (build.warningState > 0) {
                    simple_state = '<div class="simple-state-warn"></div>';
                  } else {
                    if (build.troubleType > 0) {
                      simple_state = '<div class="simple-state-trouble"></div>';
                    } else {
                      simple_state = '<div class="simple-state-normal"></div>';
                      build_monitor = 'style="display:none"';
                      simple_monitor = 'style="display:block"';
                      build_offset = 'style="top:139px"';
                    }
                  }
                }
                let tooltipTemplate =
                  '<div class="gg-build-monitor" ' +
                  build_offset +
                  ">" +
                  '                    <div class="gg-build-head"' +
                  build_monitor +
                  '><div class="build-head-name" title="' +
                  build.buildName +
                  '">' +
                  build.buildName +
                  '</div><span class="maintenance-arrowBottom"></span></div>\n' +
                  '                    <div class="gg-build-body" ' +
                  build_monitor +
                  ">" +
                  '                      <div class="total_stateNum"><span class="build_state_title">设备数</span><span class="build_state_num">' +
                  build.allCount +
                  "</span></div> " +
                  '                      <div class="build_stateNum build_state_alarm"><span class="build_state_title">火警</span><span class="build_state_num" style="color: #f03718">' +
                  build.alarmState +
                  "</span></div> " +
                  '                      <div class="build_stateNum build_state_warn"><span class="build_state_title">电气火灾预警</span><span class="build_state_num" style="color: #5c52cc">' +
                  build.warningState +
                  "</span></div> " +
                  '                      <div class="build_stateNum build_state_trouble"><span class="build_state_title">消防设施故障</span><span class="build_state_num" style="color: #ff7800">' +
                  build.troubleType +
                  "</span></div> " +
                  '                      <div class="build_stateNum build_state_abnormal"><span class="build_state_title">监测设备异常</span><span class="build_state_num" style="color: #a1a8b2">' +
                  build.abnormalState +
                  "</span></div> " +
                  "                    </div>" +
                  ' <div class="gg-build-simple"' +
                  simple_monitor +
                  ">" +
                  simple_state +
                  '<span class="simple-head-name">' +
                  build.buildName +
                  '</span><span class="maintenance-arrowTop"></span></div>' +
                  "                  </div>";

                var tooltip = new this.gs2.ext.Tooltip({
                  anchor: point, //提示在地图上停靠位置
                  content: tooltipTemplate, //提示内容
                  layerId: this.elementLayer.getLayerId(), //提示所在图层ID
                  offset: [-94, -210], //位置偏移量
                  className: "g2-tooltip" //tooltip样式
                });
                this.tooltipWare.add(tooltip);
                //加载视频点信息
              }
            }
          }
          this.loadVideoBuild();
        } else {
          this.loadVideoBuild();
          Message.error("获取监测建筑信息失败!");
        }
      });
    },
    //加载视频点信息
    loadVideoBuild() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getVideoInfoList";
      api.post(serviceUrl, { unitId: this.rowData.unitId,orgId:this.orgId}).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"] || [];
          if (data && data.length > 0) {
            let elements = [];
            for (let i in data) {
              let point = new this.gs2.geom.Point({
                x: data[i].longitude,
                y: data[i].latitude,
                spatialReference: this.gs2.geom.SpatialReference.EPSG3857
              });
              let pictureMarker = new this.gs2.syms.Picturemarkersymbol({
                source:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGYmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA0LTIzVDE5OjMyOjU2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wNC0yM1QxOTozODo0MyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wNC0yM1QxOTozODo0MyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoyM2ZkOTdkMS04YjJiLWNhNGUtOGU3OC0yODFhMzdjM2YwZDMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5NGJiMDViYi04ZTFiLWJiNDMtOTBmMi0zMjIyYmQwYjIwNWYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZTkwYTg4Ny1iOWJjLWFjNDAtYjk1Ni01OTM5ZTg4MjdmZWIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjRlOTBhODg3LWI5YmMtYWM0MC1iOTU2LTU5MzllODgyN2ZlYiIgc3RFdnQ6d2hlbj0iMjAxOC0wNC0yM1QxOTozMjo1NiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzZmQ5N2QxLThiMmItY2E0ZS04ZTc4LTI4MWEzN2MzZjBkMyIgc3RFdnQ6d2hlbj0iMjAxOC0wNC0yM1QxOTozODo0MyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Piqf/mwAAAi+SURBVFiFzZhpbFTXFYC/+5YZj8fjGS/jbWyCDcZmaTAmKdnYaaK0ghI1UIk2UiolkSpVahrxo0rVpv+qki5SfkRR/0RK0lRRkuIQIhJIaSAEMA07GAeKABsPxtt4nfW9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",
                width: 40,
                height: 40,
                offsetX: 20,
                offsetY: 20
              });
              let ele = new this.gs2.ele.Element({
                geometry: point,
                symbol: pictureMarker
              });
              ele.tag = data[i];
              ele.type = "video";
              elements.push(ele);
            }
            this.elementLayer.addElements(elements);
          }
          //绑定事件
          this.initEvent();
        } else {
          Message.error("查询视频点信息失败!");
        }
      });
    },
    //获取企业报警列表
    getAlarmList() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getLyMonitorListInfo";
      api
        .get(serviceUrl, { unitId: this.rowData.unitId, runState: 1 ,orgCode:this.orgId})
        .then(res => {
          if (res && res["code"] == "success") {
            let data = res["data"] || [];
            let fire_icon = $(".gg-fire-icon");
            if (data && data.length > 0) {
              Date.prototype.format = function(fmt) {
                var o = {
                  "M+": this.getMonth() + 1, //月份
                  "d+": this.getDate(), //日
                  "h+": this.getHours(), //小时
                  "m+": this.getMinutes(), //分
                  "s+": this.getSeconds(), //秒
                  "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                  S: this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) {
                  fmt = fmt.replace(
                    RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length)
                  );
                }
                for (var k in o) {
                  if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(
                      RegExp.$1,
                      RegExp.$1.length == 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                    );
                  }
                }
                return fmt;
              };
              fire_icon.removeClass("gg-fire-icon_default");
              fire_icon.addClass("gg-fire-icon_fire");
              for (let i in data) {
                let alarm = data[i];
                let warningTime = new Date(alarm.warningTime);
                data[i].warningTimeHH = warningTime.format("hh:mm");
                data[i].warningTimeDD = warningTime.format("yyyy-MM-dd");
              }
            } else {
              fire_icon.removeClass("gg-fire-icon_fire");
              fire_icon.addClass("gg-fire-icon_default");
            }
            this.alarmList = data;
          } else {
            Message.error("获取企业报警列表失败！");
          }
        });
    },
    //绑定事件
    initEvent() {
      //地图点击事件
      this.mapClick();
      //地图划入事件
      this.mapMousemove();
      //展开
      $(".gg-build-simple .maintenance-arrowTop").click(function() {
        $(this)
          .parents(".gg-build-simple")
          .hide();
        $(this)
          .parents(".gg-build-simple")
          .siblings()
          .show();
        $(this)
          .parents(".gg-build-monitor")
          .css("top", "5px");
      });
      //合上
      $(".gg-build-head .maintenance-arrowBottom").click(function() {
        $(this)
          .parents(".gg-build-head")
          .hide();
        $(this)
          .parents(".gg-build-head")
          .siblings(".gg-build-body")
          .hide();
        $(this)
          .parents(".gg-build-head")
          .siblings(".gg-build-simple")
          .show();
        $(this)
          .parents(".gg-build-monitor")
          .css("top", "139px");
      });
      //置顶
      $(".gg-build-monitor").click(function() {
        $(".gg-build-monitor").css("z-index", "0");
        $(this).css("z-index", "10");
      });
    },
    //火警列表
    fireClick() {
      $(".fire-alarm-outside").toggle();
    },
    //地图的点击事件
    mapClick() {
      let _this = this;
      this.g2map.on("click", function(
        button,
        shift,
        screenX,
        screenY,
        mapX,
        mapY,
        handle
      ) {
        var ele = _this.elementLayer.hitTest(screenX, screenY);
        if (ele) {
          _this.videoBool = false; //移除播放视频
          if (ele.element.type == "video") {
            //播放视频
            _this.playerUrl = ele.element.tag.videoPath;
            _this.videoBool = true;
          } else {
            //跳转页面
            _this.openFloorPage(ele.element.tag.buildId);
          }
        }
      });
    },
    //打开楼栋楼层信息页面
    openFloorPage(buildId,floorId,deviceId) {
      this.region = buildId;
      this.currentFloor = floorId;
      this.currentDevice = deviceId;
      this.pageSwitchBool = false;
    },
    //关闭视频
    closeVideo() {
      this.videoBool = false;
      this.playerUrl = "";
    },
    //监听鼠标划入事件
    mapMousemove() {
      let _this = this;
      this.g2map.on("mousemove", function(
        button,
        shift,
        screenX,
        screenY,
        mapX,
        mapY,
        handle
      ) {
        document.getElementById("g2map").style.cursor = "";
        var ele = _this.elementLayer.hitTest(screenX, screenY);
        if (ele) {
          document.getElementById("g2map").style.cursor = "pointer";
        }
      });
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    const _this = this;
    this.$nextTick(function() {
      _this.initPage();
    })
  }
};
</script>
<style lang="scss" scoped>
.real-time-div {
  height: 100%;
  width: 100%;
}
#g2map{
	height:100%;
}
/deep/.gg-build-monitor {
  width: 185px;
  background: #4356c5;
  padding-top: 5px;
  padding-bottom: 5px;
  position: relative;
  border-radius: 4px;
  .gg-build-head {
    height: 35px;
    padding-left: 6px;
    color: #fff;
    font-size: 0.14rem;
    .build-head-name {
      display: inline-block;
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    .maintenance-arrowBottom {
      position: relative;
      top: -7px;
      cursor: pointer;
    }
  }
  .gg-build-body {
    margin-top: 0.05rem;
    width: 174px;
    height: 128px;
    background: #fff;
    border-radius: 4px;
    margin: 0 auto;
    padding: 0;
    .total_stateNum {
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #e6e6e6;
      .build_state_title {
        float: left;
        margin-left: 18px;
      }
      .build_state_num {
        float: right;
        margin-right: 18px;
      }
    }
    .build_stateNum {
      position: relative;
      height: 24px;
      line-height: 24px;
      .build_state_title {
        float: left;
        margin-left: 18px;
      }
      .build_state_num {
        float: right;
        margin-right: 18px;
      }
    }
  }
  .gg-build-simple {
    background: #fff;
    width: 174px;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    margin: 0 auto;
    padding: 0;
    .simple-state-trouble,
    .simple-state-warn,
    .simple-state-alarm {
      width: 20px;
      height: 30px;
      float: left;
    }
    .simple-state-alarm {
      background: url("~@/static/img/RealTimeMonitoring/simple-logo-alarm.png")
        no-repeat center;
    }
    .simple-state-warn {
      background: url("~@/static/img/RealTimeMonitoring/simple-logo-warn.png")
        no-repeat center;
    }
    .simple-state-trouble {
      background: url("~@/static/img/RealTimeMonitoring/simple-logo-hidden.png")
        no-repeat center;
    }
    .simple-head-name {
      display: inline-block;
      width: 136px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      color: #5163c9;
    }
    .maintenance-arrowTop {
      margin-top: 8px;
      color: #5163c9;
      cursor: pointer;
      display: inline-block;
      width: 14px;
      float: right;
      margin-right: 4px;
    }
  }
}
.btn-close {
  cursor: pointer;
  z-index: 20000;
  display: block;
  position: absolute;
  right: 15px;
  top: 15px;
  width: 25px;
  height: 25px;
  color: #fff;
  font-size: 0.27rem;
}
.gg-fire-content {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 20;
  .gg-fire-icon {
    position: relative;
    width: 65px;
    height: 65px;
    text-align: center;
    border-radius: 5px;
    z-index: 20;
    cursor: pointer;
    background: url("~@/static/img/RealTimeMonitoring/fire-logo.png") no-repeat
      center;
  }
  .gg-fire-icon_fire {
    background-color: #ff0000;
    border: 5px solid rgba(255, 87, 87, 0.5);
  }

  .gg-fire-icon_default {
    background-color: #b3b3b3;
    border: 5px solid rgba(179, 179, 179, 0.5);
  }
  .fire-alarm-outside {
    display: none;
    position: absolute;
    bottom: 80px;
    right: 0;
    background-color: #fff;
    border-radius: 5px;
    padding: 0 10px;
    transition: all ease-in-out 0.1s;
    transform-origin: 50% 50%;
    z-index: 10;
    border: 2px solid #bfbfbf;
    .gg-fire-panel {
      // width: 380px;
      max-height: 370px;
      overflow-y: auto;
      background: #fff;
      .gg-text-notice {
        padding-bottom: 5px;
        padding-top: 5px;
        font-size: 14px;
        width: 70px;
      }
      .fire-alarm-outside::before {
        content: "";
        position: absolute;
        left: 92%;
        bottom: -18px;
        display: block;
        width: 0;
        height: 0;
        border: 9px solid transparent;
        margin-left: -9px;
        border-top-color: #fff;
      }
      .gg-fire-dd {
        margin-left: 10px;
        display: inline-block;
        width: 74%;
      }
      .gg-fire-date {
        color: #f00;
        font-size: 12px;
      }
      .gg-fire-title {
        width: 100%;
        color: #000;
        font-size: 16px;
        line-height: 24px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .fire-alarm-time {
        width: 22%;
        float: left;
        text-align: center;
      }
      .gg-fire-dt {
        height: 28px;
        line-height: 28px;
        font-size: 20px;
        color: #f00;
        border: 1px solid #f00;
        border-radius: 20px;
        background: #f0d3d3;
        margin-bottom: 4px;
      }
      .gg-fire-add {
        font-size: 16px;
        margin-top: 4px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .gg-fire-dl {
        width: 380px;;
        position: relative;
        margin: 0;
        padding-top: 10px;
        padding-bottom: 10px;
        cursor: pointer;
      }
      .gg-fire-bd {
        border-bottom: 1px solid #bfbfbf;
      }
    }
    .fire-none-data {
      width: 200px;
      min-height: 100px;
    }
  }
  .fire-alarm-outside::before {
    content: "";
    position: absolute;
    right: 22px;
    bottom: -22px;
    display: block;
    width: 0;
    height: 0;
    border: 11px solid transparent;
    margin-left: -9px;
    border-top-color: #bfbfbf;
  }
  .fire-alarm-outside::after {
    content: "";
    position: absolute;
    right: 23px;
    bottom: -18px;
    display: block;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    margin-left: -9px;
    border-top-color: #fff;
  }
}
/deep/.gg-build-monitor:before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -0.2rem;
  display: block;
  border: 0.1rem solid transparent;
  margin-left: -0.09rem;
  border-top-color: #4356c5;
}
@media screen and (max-width: 1440px) {
}
</style>
