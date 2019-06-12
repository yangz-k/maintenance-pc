<template>
    <el-row style="height: 100%;">
      <el-row class="l-head" type="flex" justify="space-between" align="middle">
        <el-col :span="12">
          <!-- 面包屑 -->
          <Title />
        </el-col>
        <el-col :span="1">
          <el-button class="goBack" type="text" icon="maintenance-back1" @click="cabackList">返回</el-button>
        </el-col>
      </el-row>
      <el-card  class="box-card">
        <el-row class="map-clock">
          <el-col :span="2" align='center'>打卡类型：</el-col>
          <el-col :span="20" align='left'>上下班打卡</el-col>
          <el-col :span="2">
            <!-- <el-button @click="saveMapUpdate" type="primary" class="maintenance-save">保存</el-button> -->
            <el-button class="wb-edit fs18px" @click="saveMapUpdate()" type="text" icon="maintenance-save">&nbsp;保存</el-button>
          </el-col>
        </el-row>
        <el-row class="map-clock">
          <el-col :span="2" align='center'>打卡时间：</el-col>
          <el-col :span="22" align="left">
            <el-row>
              <el-col :span="4">
                <el-radio v-model="radio" label="1" disabled></el-radio><span class="ml-8">固定时间上下班</span>
              </el-col>
              <el-col :span="4">
                <el-radio v-model="radio" label="2" disabled ></el-radio><span class="ml-8">自由上下班</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="geolocation map-clock">
          <el-col :span="2" align='center'>打卡地点：</el-col>
          <el-col class="sign-div-col" :span="22" style="height: 100%; padding-bottom: 20px;">
            <div class="sign-div"><img src="~assets/img/LocationManagement/sign.png" /></div>
            <!-- 地图 -->
            <g2Map ref="map" :map-div="g2map" @mapClick="mapClick" @mapExtentchanged="mapExtentchanged" class="locationImap"></g2Map>
            <el-input v-model="unitInfoObj.unitName" class="clock-address-name" style="height:24px;" disabled></el-input>
            <!-- <div class="clock-address wb-mapFine-tuning" @click="isRelocation()">
              <img src="~assets/img/LocationManagement/fine-tuning.png" alt="" />
            </div> -->
          </el-col>
        </el-row>
        <el-row class="map-clock">
          <el-col class="clock-address" align='center' :span="2"><span class="warp-color">*</span>&nbsp;打卡地点：</el-col>
          <el-col class="clock-address" :span="6">
            <el-input v-model="unitInfoObj.unitAddress" class="clock-address-enter" style="height:24px;" disabled></el-input>
          </el-col>
          <el-col class="clock-address" :span="16">
          </el-col>
        </el-row>
        <el-row class="map-clock">
          <el-col align='center' :span="2"><span class="warp-color">*</span>&nbsp;打卡范围：</el-col>
          <el-col :span="3" align="left">
            <el-input
              type="number"
              :min="1"
              :max="2000"
              v-model="unitInfoObj.clockRange"
              @change="contractAmountChange()"
              @clear="contractAmountChange()">
            </el-input>
          </el-col>
          <el-col :span="19" align="left">
            <div class="normal-range">m，员工可在画圈范围内正常打卡</div>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
</template>
<script>
import axios from "axios";
import api from '~/config/http';
import Title from "~/components/Title";
import g2Map from "~/components/Map";
import mixin from "~/mixin/mixin";
export default {
  mixins: [mixin],
  components: {
    g2Map,
    Title
  },
  data(){
    return {
      unitInfoObj: {
        unitName: '', //input输入框
        clockRange: '', //input范围输入框
        unitAddress: '',//地图上的搜索框
      },
      radio: '2',
      g2map: 'g2map',
      editId: '',
      elementLayer: '',
      pageParams: {},
      flag: false,
    }
  },
  mounted() {
    this.loadData();
    //初始化地图标记样式
    this.initSignCss();
  },
  methods: {
    // 显示编辑页信息
    loadData () {
      this.pageParams = this.$route.params;
      this.editId = this.pageParams.id;
      api.get(api.forent_url.maintenance_service_url + "/clock/getUnitInfoById?pid="+Math.random(), {
        id: this.pageParams.id
      }).then(res=>{
        if (res.code === 'success') {
          this.unitInfoObj = res.data
          this.addElementLayer();
          var point = new this.gs2.geom.Point({
            x: this.unitInfoObj.log,
            y: this.unitInfoObj.lat,
            spatialReference: "EPSG:3857"
          });
          this.$refs.map.setMapCenter(point);
          this.$refs.map.setMapLevel(14);
        }
      })
    },
    // 验证打卡范围
    contractAmountChange () {
      if (this.unitInfoObj.clockRange > 2000) {
        this.$message.error("打卡范围上限为2000米");
        this.unitInfoObj.clockRange = parseInt(
          this.unitInfoObj.clockRange = 2000
        );
        this.createCircle(this.unitInfoObj.clockRange)
      } else if (this.unitInfoObj.clockRange < 1 || this.unitInfoObj.clockRange == '')  {
        this.unitInfoObj.clockRange = ''
      } else {
        this.unitInfoObj.clockRange = parseInt(
          this.unitInfoObj.clockRange
        );
      }
      this.addElementLayer()
    },
    // 切换地图位置事件
    isRelocation () {
      this.flag = true;
    },
    // 地图点击事件
    mapClick (obj) {
      let _this = this;
      if (this.flag === true) {
        this.unitInfoObj.log = obj.mapX;
        this.unitInfoObj.lat = obj.mapY;
        this.addElementLayer()
        let location = obj.mapX + "," + obj.mapY;
        $.ajax({
					url: "http://api.map.baidu.com/geocoder/v2/",
					type: 'get',
					dataType: "jsonp",
					data:{
						location: location,
						ak: "hmFFKbr0nFUvqAN2gcUHwMILWFTzm5Xt",
						output: "json",
						coordtype: "bd09mc"
					},
          success: function (res) {
            if (res.status === 0) {
              _this.unitInfoObj.unitAddress = res.result.formatted_address;
            }
					}
				})
      }
      this.flag = false;
    },
    //拖拽地图
    mapExtentchanged(){
      const _this = this;
      let point= this.$refs.map.getMapCenter();
      this.unitInfoObj.log = point[0];
      this.unitInfoObj.lat = point[1];
      this.addElementLayer();
      let location = point[0] + "," + point[1];
        $.ajax({
					url: "http://api.map.baidu.com/geocoder/v2/",
					type: 'get',
					dataType: "jsonp",
					data:{
						location: location,
						ak: "hmFFKbr0nFUvqAN2gcUHwMILWFTzm5Xt",
						output: "json",
						coordtype: "bd09mc"
					},
          success: function (res) {
            if (res.status === 0) {
              _this.unitInfoObj.unitAddress = res.result.formatted_address;
            }
					}
				})
    },
    // 初始化地图
    addElementLayer () {
      if (!this.elementLayer) {
        this.elementLayer = this.$refs.map.createElementLayer(
          "elementLayer",
          "图层"
        );
      }else{
        this.elementLayer.clear();
      }
      // 初始化标点
      var picSource = ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAoCAYAAADt5povAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1QzU0QzRDQzdDNzExMUU5QjdGQ0RGODFDRjgzRTA0RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1QzU0QzRDRDdDNzExMUU5QjdGQ0RGODFDRjgzRTA0RSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVDNTRDNENBN0M3MTExRTlCN0ZDREY4MUNGODNFMDRFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVDNTRDNENCN0M3MTExRTlCN0ZDREY4MUNGODNFMDRFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Pe6u1QAABD1JREFUeNqsWGtMVEcUPrsLiCmErRbjgxXlYSmuYE2xPkh8oCwqGlPbphFNqjH46MP0j7YhIWnwj5poU4UorZpI/GF/4A/XKC/RKKFsabddwESwGt9vKaZqBOH6nd2Bveze2bu77Em+7Nx7zsx358yZM2fWsPKLnaQjJiAPWAbMAVIAs9D9B1wHmoGzwHmgP9BgUTq6DUAJkCyxGSfAH/IdcBvYD5QDvVodjJKB5gNXgMoAZFpiAfYB7cC8YAk3AxeAdApfuO9FoFiP8BvgkI6rgxUe4zCwTUZoE/6PtPwM5PsGDUfdMRGRmpI6dRLZ8maT9YMUShxrpqgoEz149IxcHf+SvaaJbt95FCjKeexMoGeQ8AdggpZ1dHQUFX+5ivIX5ZDBYBimmzThPTcK8CHnGhx0pMpOvb19WsNMBL5nHtP71tw4NE4CMX6LgFmUlWyiuTlWPzK1sC49JYkyM6bQpWYX9fcPaJnNBA7wGn4CxGlZ8MymZ0z1vvi7DkG/luhbK9H2GZ62q35Ize7eULRc9l3MsdoogsVPki3jybZ4tvdF9W7E7xaizhZs6VdEr1962hXYRae9sVaQ9zFZksbJSG1MmK2lyV+sWjOeRW2lPA7PHCRqa/REiMlISxfmyCxnMuFkTY1Vte/rj+oHf4PX5sMsac6wMOE7WprERLP34WabPqHKZuyYBJlVAhM+0UwTJlNo21tRVFErtepmwgdamvsPn3ofpmTpEyZbh5pPnvbIrO4axVnmJ05Xp/chb6M+ocrG6eqSWbUyYaOWpq7xDxoYEBs4C+dvwVY52bJtHhsI96m/0CqzPMuZ5gYaXwGxak3P8xf0rjme0lOTPC8ycLxZphM9f0z0fzcWORoJdhbR56VEC9YN9TtX30INF//UXD8++jiXvhQZvdTX4pfjp2kicmW2Nc3zInuJBxL5p/2au49EfgJe8QzdvgWKVLWKcI9Cl393UXzcaEpDrpTlUwURWosl2F/xG/X1vdEyYS+yG/oGCbn+cALrfQ9lXpNW51VqdnS4CUfHjqJRMTHuNkdyU0sblf9aTbXnHbKkzUXVKlFskcGnatsB7I7wAcwEe2Qlxl7gVATJTokxpTWNIkrDrgiQdYmxFL2qjdPEpyJ6wxXuu0aMFVRd6gK2jICQ+7aFUgizVImSMVSpEH0pVEKW7YAjBDKHKPkpXELen5/JjjAfeSxse0dCyHJLZIlAt6J+YXNLbzBjkK6qAX4MoGddbTADGUNYn13iDuhXQgkdRZpQEW674ZOU1/tu7pAupMVFuYHsn1WeuMxJoUmQrIF9t8wYtiOa4eAH/YWfrxloO8O5wwWSacAK4CMgTVxKEkAUrzpUOX3dA66Jc5XXtFN6D1GU4e632+3qTMOHsiHESfCAJ3htCwsLR+7SIGUgHJdy9JWpXJouXGpWVesvxF8n98RxpOvStwIMAIPwHok1GLlNAAAAAElFTkSuQmCC"]
      var imgSymbol = new this.gs2.syms.Picturemarkersymbol({
          source: picSource[0],
          width: "28",
          height: "40",
          rotation: "0",
          opacity: "1",
          offsetX: "14",
          offsetY: "40"
      });
      var point = new this.gs2.geom.Point({
          x: this.unitInfoObj.log,
          y: this.unitInfoObj.lat,
          spatialReference: "EPSG:3857"
      });
      //创建一个点元素
      // var ele = new this.gs2.ele.Element({
      //     geometry: point,
      //     symbol: imgSymbol //图片元素要展示的样式
      // });
      //元素图层添加点元素
      //this.elementLayer.add(ele);
      // this.$refs.map.setMapCenter(point);
      // this.$refs.map.setMapLevel(14);
      this.createCircle(point);
    },
    // 创建点圆元素
    createCircle (point) {
      var geoJson = this.getBufferGeoJson(point,this.unitInfoObj.clockRange);
      var polygonGeometry = this.gs2.geom.GeometryFactory.createGeometryFromGeoJson(geoJson, "EPSG:3857");
      var ring = new this.gs2.geom.Polygon({
        spatialReference:"EPSG:3857"
      });
      polygonGeometry.addGeometry(ring);
      var symbol=new this.gs2.syms.SimpleFillsymbol({
        borderColor:new this.gs2.syms.Color({a:150,b:48,g:35,r:30}),
        fillColor:new this.gs2.syms.Color({a:20,b:127,g:104,r:95}),
        borderThickness:1
        });
      var circleEle = new this.gs2.ele.Element({
        geometry: polygonGeometry,
        symbol: symbol
      });
      this.elementLayer.add(circleEle);
    },
    getBufferGeoJson (centerGeom, radius) {
      if(!(centerGeom && !isNaN(radius))) {
        return null;
      }
      var geoJson = null;
      var spatialRef = centerGeom.spatialReference;
      var projService = new this.gs2.ext.ProjectService();
      //激活tool
      var opts = {
        center: [centerGeom.x, centerGeom.y],
        radius: radius,
        count: 128,
      };
      var circlePoints = this.getCirclePonits(opts);
      var geomJson = {
        type: 'Polygon',
        coordinates: [circlePoints]
      }
      var geom = this.gs2.geom.GeometryFactory.createGeometryFromGeoJson(geomJson);
      geom.spatialReference = 3857;
      geoJson = projService.transform(geom,'3857').asGeoJson();
      return geoJson;
    },
    /**
     * 获取圆上的点
     * @method
     * @param options {Object} 必填，参数
     * @param options.center {Array} 必填 圆心
     * @param options.radius {Number} 必填，半径
     * @param options.count {Number} 必填，点数，默认为128
     * @param options.spatialReference {Number} 必填，中心点坐标系， 默认为3857
     * @returns {Array}
     */
    getCirclePonits (options) {
      var center = options.center,
        count = options.count || 128,
        radius = parseFloat(options.radius),
        spatialReference = 3857;
      var ic = (Math.PI * 2) / count,
        icc = 360 / count;
      var arr = [],
        cx = center[0],
        cy = center[1];
      for(var i = 0; i < count; i++) {
        var rad = ic * i;
        var x = cx + radius * Math.cos(rad);
        var y = cy + radius * Math.sin(rad);
        arr.push([x, y]);
      }
      return arr;
    },
    // 编辑页面返回按钮
    cabackList () {
      let _this = this;
      //详情页面包屑();
      let paramCrumb = {
        name: "位置管理编辑",//title name
            parName: "位置管理",//父级title name
            lightMenu: api.getGlobalVal("CmenuName").lightMenu + "-0",
            linkname: "SystemManagement-LocationManagement",
            path: "SystemManagement-LocationManagement"
      };
      _this.setDetailBreadcrumb(paramCrumb,_this.isLevelDetail);
      //详情页面包屑 end

      this.$router.push({
        name: "SystemManagement-LocationManagement",
      });
    },
    // 保存地图修改信息
    saveMapUpdate () {
      if(this.unitInfoObj.clockRange === '') {
        this.$message.error('请输入打卡范围');
        return;
      } else {
        api.post(api.forent_url.maintenance_service_url + "/clock/updateUnitRule", {
          id: this.editId,
          log: this.unitInfoObj.log,
          lat: this.unitInfoObj.lat,
          clockRange: this.unitInfoObj.clockRange,
          unitAddress: this.unitInfoObj.unitAddress,
        }).then(res=>{
          if (res.code === 'success') {
            this.$message({
              message: '设置成功!',
              type: 'success'
            });
            this.$router.push({
              name: "SystemManagement-LocationManagement",
            });
          }
        })
      }
    },
    //初始化地图标记样式
    initSignCss(){
      let width = $(".sign-div-col").width()/2 - 14;
      $(".sign-div").css("margin-left",width);
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  font-size: 16px;
  height: calc(100% - .74rem)
}
.map-clock{
  height: 0.45rem;
  /deep/.el-radio {
    margin-right: 0;
    /deep/.el-radio__input.is-disabled.is-checked .el-radio__inner::after {
      background-color: #FF6722;
    }
    /deep/.el-radio__label {
      display: none;
    }
    /deep/.el-radio__label {
      padding-left: 0;
    }
  }
  .sign-div{
    position: absolute;
    top: calc(50% - 50px);
    z-index: 1002;
    img{
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  }
}
.warp-color{
  color:#ff6b6b;
}
.clock-address-enter .el-input__inner{
  height: 24px;
}
.locationImap {
  position: relative;
}
.normal-range{
  text-indent: 1em;
}
.clock-address-name{
  width: 320px;
  position: absolute;
  top: 20px;
  left: 1.56rem;
  z-index: 999;
}
.el-input.is-disabled .el-input__inner {
  color: #999;
}

.wb-mapFine-tuning img{
  width:100%;
  display: inline-block;
}
.wb-mapFine-tuning:hover img{
  transform: scale(.85);
}
@media screen and (max-width: 1920px) {
  .geolocation {
    height: 63vh;
  }
  .wb-mapFine-tuning{
    height:48px;
    width:48px;
    position:absolute;
    right: 1080px;
    top: 10px;
    z-index: 1001;
    cursor: pointer;
  }
}
@media screen and (max-width: 1366px) {
  .geolocation {
    height: 52vh;
  }
  .wb-mapFine-tuning{
    height:48px;
    width:48px;
    position:absolute;
    right: 630px;
    top: 10px;
    z-index: 1001;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
.maintenance-save:before {
  margin-right: 5px;
}
.wb-edit{
  color:#5F687F;
  &:hover{
    color:#409EFF;
  }
}
/deep/.el-radio__label {
  padding: 0;
  display: none;
}
/deep/.el-radio {
  margin-right: 0;
}
/deep/.el-radio__input.is-disabled.is-checked .el-radio__inner::after {
  background-color: #FF6722;
}
</style>
