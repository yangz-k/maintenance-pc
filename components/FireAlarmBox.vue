<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="trueAlarmVis"
      :close-on-click-modal="false"
      top="'0'"
    >
      <div class="gg-warning-panel" id="v_pop_alarm">
        <!--地图ID-->
        <div class="cancelMar gg-image-display" id="alarm_map_div"></div>
        <div class="cancelMar gg-image-info">
          <!--关闭按钮-->
          <a class="gg-warning-panel--icon" @click="popClose">
            <h3 class="gg-image-fire">
              <img src="~/assets/img/FireAlarmBox/RedClose.png" />
            </h3>
          </a>
          <!--图标-->
          <center class="red-icon">
            <img src="~/assets/img/FireAlarmBox/RedIcon.png" alt="" />
          </center>
          <div class="gg-image-des">
            <div class="gg-prober-device">
              <div class="parents gg-probe-cell">
                业主单位：<span>{{ msgExtend.proprietorName }}</span>
              </div>
            </div>
            <div class="gg-prober-device">
              <div class="parents gg-probe-cell">
                设备类型：<span>{{ msgExtend.deviceType }}</span>
              </div>
            </div>
            <div class="gg-prober-device">
              <div class="parents gg-probe-cell">
                报警时间：<span>{{ msgExtend.alarmTime }}</span>
              </div>
            </div>
            <div class="gg-prober-device">
              <div class="parents gg-probe-cell">
                楼　　栋：<span>{{ msgExtend.build }}</span>
              </div>
            </div>
            <div class="gg-prober-device">
              <div class="parents gg-probe-cell">
                位　　置：<span>{{ msgExtend.floor }}</span>
              </div>
            </div>
            <div class="gg-prober-device">
              <div class="parents gg-probe-cell">
                回路点位：<span>{{ msgExtend.laPoint }}</span>
              </div>
            </div>
            <div class="gg-prober-device">
              <div class="parents gg-probe-cell">
                上 报 人：<span>{{ msgExtend.feedbackPerson }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import api from "~/config/http";
import { Message } from "element-ui";
export default {
  data() {
    return {
      orgCode: "",
      trueAlarmVis: false,
      msgExtend: {},
      extendList: [],
      g2map: undefined, //地图容器
      floorImageLayer: undefined, //楼层平面图layer
      elementLayer: undefined //点位数据
    };
  },
  mounted() {
    this.orgCode = api.getGlobalVal("maintenance_userObj").orgCode;
    this.messageMonitoring();
  },
  methods: {
    messageMonitoring() {
      let _this = this;
      if (this.stompClient.connected) {
        this.stompClient.subscribe(
          "/topic/" + _this.orgCode + "/system_notice",
          function(greeting) {
            let message = greeting.body;
            if (typeof message == "string") {
              message = JSON.parse(message);
            }
            let extend = message.extend;
            if (extend) {
              extend = JSON.parse(extend);
            }
            switch (message.type) {
              case "1":
                if (!_this.trueAlarmVis) {
                  _this.trueAlarmVis = true;
                }
                _this.extendList.push(extend);
                _this.msgExtend = _this.extendList[_this.extendList.length - 1];
                _this.$nextTick(function() {
                  _this.initMap();
                });
                break;
            }
          }
        );
      } else {
        let _this = this;
        setTimeout(function() {
          _this.messageMonitoring();
        }, 3000);
      }
    },
    // 关闭按钮
    popClose() {
      if (this.extendList.length === 1) {
        this.trueAlarmVis = false;
        this.extendList = [];
      } else {
        this.extendList.splice(this.extendList.length - 1, 1);
        this.msgExtend = this.extendList[this.extendList.length - 1];
        this.initMap();
      }
    },
    initMap() {
      // 创建地图
      if (!this.g2map) {
        this.g2map = new this.gs2.maps.Map({
          defaultExtent: {
            center: [0, 0],
            maxZoom: 20,
            minZoom: 5,
            projection: "EPSG:3857", // 设置地图坐标系
            level: 5
          } // 为方便展示设置视野中心点的范围
        });
        // 初始化地图，传入要初始化的DOM对象的id
        this.g2map.init({
          targetId: "alarm_map_div"
        });
      }
      this.getFloorObj();
    },
    getFloorObj() {
      let params = {
        unitId: this.msgExtend.proprietorId,
        buildId: this.msgExtend.buildId,
        floorId: this.msgExtend.floorId
      };
      let serviceUrl =
        api.forent_url.maintenance_service_url +
        "/recordEnterprise/getFloorInfo";
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          this.initFloorImg(res.data.floorAreaImg);
        } else {
          Message.error("请求楼层平面图失败！");
        }
      });
    },
    //初始化楼层平面图
    initFloorImg(floorAreaImg) {
      let that = this;
      let picUrl = api.forent_url.image_url + "floorImage/" + floorAreaImg;
      let img = new Image();
      img.src = picUrl;
      img.onload = function() {
        let w = img.width * 1000;
        let h = img.height * 1000;
        if (that.floorImageLayer) {
          that.g2map.removeLayer(that.floorImageLayer);
          that.floorImageLayer = undefined;
        }
        //创建一个图像图层
        that.floorImageLayer = new that.gs2.lys.ImageLayer({
          imageType: 702,
          extent: [0, 0, w, h], //图片范围，请按照坐标系的范围给出，此为3857的坐标系范围
          crossOrigin: "anonymous", //跨域
          url: picUrl // 图层服务 url
        });
        // 将 图像图层添加到地图
        that.g2map.addLayer(that.floorImageLayer);
        that.g2map.pan(
          new that.gs2.geom.Envelope({
            minx: 0,
            miny: 0,
            maxx: w,
            maxy: h
          })
        );
        if (!that.elementLayer) {
          that.elementLayer = new that.gs2.lys.ElementLayer({
            zIndex:199
          });
          that.g2map.addLayer(that.elementLayer);
        } else {
          that.elementLayer.clear();
        }
        let x2 = that.msgExtend.log; //经度
        let y2 = that.msgExtend.lat; //纬度
        let point2 = new that.gs2.geom.Point({
          x: x2,
          y: y2,
          spatialReference: that.gs2.geom.SpatialReference.EPSG3857
        });
        let b64icon2 =
          "iVBORw0KGgoAAAANSUhEUgAAAB4AAAAoCAYAAADpE0oSAAAB80lEQVRYhcXXv2oUURQH4G9HDYKoKSwUi4CImBcQxAQtrITkBSzs1QdQsBErwcLGQgTRN9BKC0VJtLBNoSERDIhEUEgEE0hM9ljsTLJZdnd29s/shVMMy/w+zjB77p1K6GgluIQrOIczGE1/W8UCPuEV3qOamxjtayS4GSwF0WEtpfeMtMtuh54P5guAjTWfZhSCbwSbPaBZbaZZHcG3+wA21q08+GpQHQBcTbObwuPB2gDQrNZSYw9cCWYGiGY1k1o78HQJaFbT9fBsifBsqLV9Cl9RyZ02/VmB0wmmSkSl1lSCiRLRbE0mODsEeLwSrNjdacpafyrBttq2V+aKBOslo7CSYHEI8PcEH4YAf0zwYgjw62yDWChxZP4KDiRqI+xxid0+w79skzgWrJfQ7UZwMuz+f3/jUQndPscPqD+BjKbPf1Dd/g1OZF79xFrF3QF2+wDLO1ext/YHXwbQ7WJwsN5qdrydCLb7DF9udFod6B/2EX3azGgFH4r+DJVvwZEisOBCsNUDuhVcbJWf97V4pwf4XrvsPHhf8KYL9F16b9ew4HiwXAD9GXWDohdYMBm1OZuHbkTt3cjN7BQWXO8AvtZpXhFY8KQNer9IVlF4JHjbBH0ZOS9Tr7DgaDBXh84Fh4vmdAMLxoLPUdtQxrrJ+A8T7ueKw5k8gQAAAABJRU5ErkJggg==";
        let imgIcon2 = new Image();
        imgIcon2.src = "data:image/jpg;base64," + b64icon2;
        imgIcon2.onload = function() {
          let w = imgIcon2.width;
          let h = imgIcon2.height;
          let markerSymbol = new that.gs2.syms.Picturemarkersymbol({
            source: imgIcon2.src,
            width: w,
            height: h,
            rotation: "0",
            opacity: "1",
            offsetX: w / 2,
            offsetY: h / 2
          });
          let ele = new that.gs2.ele.Element({
            geometry: point2,
            symbol: markerSymbol
          });
          that.elementLayer.add(ele);
          that.g2map.setCenter(point2);
        };
      };
    }
  }
};
</script>
<style lang="scss" >
#v_pop_alarm {
  .ol-unselectable {
    background-color: #e9ebf2;
  }
  .ol-attribution.ol-unselectable.ol-control.ol-collapsed {
    display: none;
  }
  .ol-zoom.ol-unselectable.ol-control {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
#v_pop_alarm {
  width: 11.38rem;
  min-height: 5.7rem;
  border-radius: 14px;
  background: -webkit-linear-gradient(#f55c5d, #ee3232, #b92423);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-size: 0.18rem;
  color: rgba(255, 255, 255, 0.98);
}

.cancelMar {
  margin: 0;
}

.gg-warning-panel--icon {
  position: absolute;
  top: 0.18rem;
  right: 0.18rem;
  cursor: pointer;
}

.gg-warning-panel--icon:hover {
  opacity: 0.7;
}

#alarm_map_div {
  width: 8.26rem;
  height: 5.55rem;
  border-radius: 4px;
  margin: 10px 0 10px 10px;
  overflow: hidden;
}

.gg-image-info {
  width: 3rem;
  padding-left: 15px;
  padding-right: 8px;
}

.red-icon {
  margin: 0.72rem 0 0.5rem 0;
}

.parents {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.gg-prober-device .gg-probe-cell span {
  font-size: 0.18rem;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  line-height: 0.28rem;
}

.gg-probe-cell {
  margin: 0;
}
</style>
