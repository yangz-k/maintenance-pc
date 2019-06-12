<template>
  <div class="floor-storey-div">
    <el-row style="line-height:.48rem;" class="div-flex align_center">
      <el-col :span="1">
        <div
          class="div-flex align_center"
          style="margin-left: .15rem;cursor: pointer;"
        >
          <img
            id="floor-backBtn"
            src="~@/static/img/RealTimeMonitoring/l-arrows.png"
            @click="goBack()"
          />
        </div>
      </el-col>
      <el-col :span="4">
        <div class="div-flex">
          <span class="fs16px colorLabel">区域：</span>
          <el-select
            v-model.trim="regionValue"
            placeholder="请选择"
            class="flex1 fs14px"
            @change="searchFilter()"
          >
            <el-option
              v-for="(item, index) in regionListData"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="div-flex" style="margin-left:.1rem">
          <span class="fs16px colorLabel">设施系统：</span>
          <el-select
            v-model.trim="facilitySystemValue"
            placeholder="请选择"
            class="flex1 fs14px"
            @change="searchFilter()"
          >
            <el-option
              v-for="(item, index) in facilitySystem"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" style="margin-left:.1rem">
        <div class="div-flex">
          <span class="fs16px colorLabel">设施：</span>
          <el-select
            v-model.trim="facilitiesValue"
            placeholder="请选择"
            class="flex1 fs14px"
            @change="searchFilter()"
          >
            <el-option
              v-for="(item, index) in facilities"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" style="margin-left:.1rem">
        <div class="div-flex">
          <span class="fs16px colorLabel">设施状态：</span>
          <el-select
            v-model.trim="facilitiesStateValue"
            placeholder="请选择"
            class="flex1 fs14px"
            @change="searchFilter()"
          >
            <el-option
              v-for="(item, index) in facilitiesStateList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
    <div id="floor-page" class="gg-floor-wrap" v-loading="loading">
      <div :id="g2mapDiv" :style="g2mapDivStyle"></div>
      <!-- 地图上的控件 -->
      <div class="build-alarm-info">
        <div class="alarm-info-title">
          <span class="gg-company-warnTitle">{{regionName}}</span
          ><span class="alarm-info-toggle maintenance-arrowBottom"></span>
        </div>
        <div class="alarm-info-body">
          <div class="build-floor-alarm">
            <div class="floor-alarm-num floor-num-size" id="alarmcount">
              {{ buildAlarmInfo.alarmcount }}
            </div>
            <div class="floor-alarm-name">火警</div>
          </div>

          <div class="build-floor-warn">
            <div class="floor-warn-num floor-num-size" id="warn_number">
              {{ buildAlarmInfo.warnNumber }}
            </div>
            <div class="floor-warn-name">电气火灾预警</div>
          </div>

          <div class="build-floor-hidden">
            <div class="floor-hidden-num floor-num-size" id="accicount">
              {{ buildAlarmInfo.accicount }}
            </div>
            <div class="floor-hidden-name">消防设施故障</div>
          </div>

          <div class="build-floor-abnormal">
            <div class="floor-abnormal-num floor-num-size" id="abnormal">
              {{ buildAlarmInfo.abnormal }}
            </div>
            <div class="floor-abnormal-name">监测设备异常</div>
          </div>

          <div class="build-warp-line"></div>
          <div class="build-weft-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "~/config/http";
import mapConfig from "~/config/mapConfig";
import { Message, MessageBox } from "element-ui";
import SpecialDeviceType from "~/config/data/specialDeviceType.json";
import complexDeviceIcons from "~/config/data/complexDeviceIcons.json";
export default {
  props: [
    "regionList",
    "region",
    "currentDeviceParent",
    "currentFloorParent",
    "rowData"
  ],
  data() {
    return {
      loading: true,
      orgId: "",
      imgUrlObj: {
        floorAlarm: require("@/static/img/RealTimeMonitoring/11.gif")
      },
      currentDevice: this.currentDeviceParent,
      currentFloor: this.currentFloorParent,
      g2mapDiv: "g2map",
      g2mapDivStyle:"height: calc(100vh - 3rem);",
      regionName:"",//区域名称
      regionValue: "", //区域值
      regionListData: [], //
      facilitySystemValue: "", //设施系统值
      facilitySystem: [], //设施系统
      deviceType: [], //所有设备类型
      facilities: [], //设施数据
      deviceQueryType: "", //选中的设备值。用于查询
      facilitiesValue: "", //设施值
      facilitiesStateList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "正常"
        },
        {
          value: "1",
          label: "报警"
        },
        {
          value: "2",
          label: "故障"
        },
        {
          value: "98",
          label: "预警"
        }
      ], //设施状态数据
      facilitiesStateValue: "", //设施状态值
      //地图数据start
      baiduvec:undefined,//底图
      wfsService: undefined, //web要素服务实现  地图框
      styleService: undefined, //样式描述服务实现
      catService: undefined, //服务渲染实现
      wfsLayer: undefined, //wfs图层
      OwnerFeatureLayer: undefined,
      wgFeatureLayer: undefined, //新分区
      OwnerALLFeatureLayer: undefined,
      ownerQueryParam: false, //空间分析判断全局变量初始化设置
      circleElementLayer: undefined, //创建元素图层
      deviceLayer: undefined, //
      bufferDeviceLayer: undefined, //缓冲画圆图层
      floorTooltipWare: undefined, //创建tooltip管理
      distanceOverlayWare: undefined, //地图覆盖物管理
      alarmDeviceOverlayWare: undefined, //
      distanceMesasureLayer: undefined, //距离测量图层
      ploylinePlot: undefined, //测量
      distanceToolTipWare: undefined, //距离测量容器
      buildAlarmInfo: {
        alarmcount: 0,
        warnNumber: 0,
        accicount: 0,
        abnormal: 0
      },
      gridChecked: false, //网格勾选
      userModel: 0, //0:适用室内gis 其他都是普通的
      iconConf: {
        deviceIcons: "" //图标库
      },
      addUnit: "", //deviceId
      monitoringObject: "" //物联网监控装置显隐
    };
  },
  methods: {
    //返回展示楼层平面提
    goBack() {
      this.$emit("goBack");
    },
    //初始化搜索
    initSearch() {
      //查询区域数据
      this.queryRegionData();
      this.getDeviceInfoList();
    },
    searchFilter() {
      const _this = this;
      setTimeout(()=>{
        _this.deviceLayer.clear(); // 清除设备点
        _this.floorTooltipWare.clear(); // 清除tooltip
        if (_this.regionValue == _this.region) {
          //不切换楼层图
          // 加载设备信息
          let floorId = $(".floor-nav .floor-lift-cur").attr("floorid");
          _this.loadDevice(floorId, _this.regionValue);
        } else {
          $(".gg-company-warnTitle").text($(".gs-el-input__inner").val());
          $(".gg-company-warnTitle").attr(
            "title",
            $(".gs-el-input__inner").val()
          );
          // 获取建筑楼层信息
          _this.queryFloorList();
        }
      })
    },
    //查询区域数据
    queryRegionData() {
      let arr = this.regionList;
      let opts = [];
      if (arr && arr.length > 0) {
        for (let key in arr) {
          let temp = {};
          temp.value = arr[key].buildId;
          temp.label = arr[key].buildName;
          opts.push(temp);
        }
      }
      this.regionListData = opts;
    },
    //获取设施系统
    getDeviceInfoList() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getDeviceInfoList";
      api.post(serviceUrl).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"] || [];
          let treeData = this.toTreeData(data);
          this.deviceType = treeData;
          // 设备大类
          let opts1 = [
            {
              value: "00000000",
              label: "全部"
            }
          ];
          if (treeData[0] != undefined) {
            let type1Arr = treeData[0].children;
            for (let key in type1Arr) {
              let temp = {};
              temp.value = type1Arr[key].id;
              temp.label = type1Arr[key].name;
              opts1.push(temp);
            }
          }
          this.facilitySystem = opts1;
          this.facilitySystemValue = "00000000";
          // 设备小类
          let opts2 = [
            {
              value: "00000000",
              label: "全部"
            }
          ];
          this.facilities = opts2;
          this.facilitiesValue = "00000000";
        } else {
          Message.error("获取设施系统失败！");
        }
      });
    },
    //将设备类型原始数据转为树形结构
    toTreeData(data) {
      let pos = {};
      let tree = [];
      let i = 0;
      while (data.length != 0) {
        if (data[i].parentid == -1) {
          tree.push({
            id: data[i].id,
            name: data[i].name,
            children: []
          });
          pos[data[i].id] = [tree.length - 1];
          data.splice(i, 1);
          i--;
        } else {
          let posArr = pos[data[i].parentid];
          if (posArr != undefined) {
            let obj = tree[posArr[0]];
            for (let j = 1; j < posArr.length; j++) {
              obj = obj.children[posArr[j]];
            }

            obj.children.push({
              id: data[i].id,
              name: data[i].name,
              children: []
            });
            pos[data[i].id] = posArr.concat([obj.children.length - 1]);
            data.splice(i, 1);
            i--;
          }
        }
        i++;
        if (i > data.length - 1) {
          i = 0;
        }
      }
      return tree;
    },
    //初始化地图
    initMap() {
      if (this.userModel === 0) {
        this.g2map = new this.gs2.carto.Map({
          defaultExtent: {
            center: [13055397.563187543, 3710327.453552903],
            maxZoom: 24,
            minZoom: 1,
            // extent: [0, 0, 3000000, 3000000], //图片范围，请按照坐标系的范围给出，此为3857的坐标系范围
            projection: "EPSG:3857", // 设置地图坐标系
            level: 19
          } // 为方便展示设置视野中心点的范围
        });
        this.g2map.init({
          targetId: this.g2mapDiv
        });
        //创建底图图层
        let baiduvec = new this.gs2.carto.TileLayer({
          layerType: this.gs2.carto.TileLayer,
          tileType: this.gs2.carto.TileType.BaiduMap,
          opacity: 1.0,
          visible: true,
          matrix: 22,
          maxZoom: 18,
          crossOrigin: "anonymous",
          baiduType: 2,
          url: mapConfig.serviceUrl.baiduImg
        });
        //将底图图层添加到地图
        this.baiduvec = baiduvec;
        this.g2map.addLayer(baiduvec);
        this.initService();
      } else {
        let g2map = new this.gs2.maps.Map({
          defaultExtent: {
            center: [0, 0],
            maxZoom: 8,
            minZoom: 3,
            // extent: [0, 0, 3000000, 3000000], //图片范围，请按照坐标系的范围给出，此为3857的坐标系范围
            projection: "EPSG:3857", // 设置地图坐标系
            level: 5
          } // 为方便展示设置视野中心点的范围
        });
        g2map.init({
          targetId: this.g2mapDiv
        });
        this.g2map = g2map;
        let elementLayer = new this.gs2.lys.ElementLayer({
          id: "elmentPointLayer",
          minZoom: 19,
          maxZoom: 23,
          zIndex: 99,
          visible: true
        });
        this.g2map.addLayer(elementLayer);
        this.deviceLayer = elementLayer; //全局标点使用
      }
    },
    //后台服务实现地图渲染
    initService() {
      let deserializer = new this.gs2.core.Deserializer();
      let token = "Bearer d277145";
      let resthttp = new this.gs2.core.RestHttp({ token: token });

      //web要素服务实现  地图框
      this.wfsService = new this.gs2.ows.RestWFSService({
        url: mapConfig.serviceUrl.RestWFSService,
        http: resthttp,
        deserializer: deserializer
      });

      //样式描述服务实现
      this.styleService = new this.gs2.cat.RestStyleDescriptorService({
        url: mapConfig.serviceUrl.RestStyleDescriptorService,
        http: resthttp,
        deserializer: deserializer
      });

      //服务渲染实现
      this.catService = new this.gs2.cat.RestRenderDescriptorService({
        url: mapConfig.serviceUrl.RestStyleDescriptorService,
        http: resthttp,
        deserializer: deserializer
      });
      //符号
      let symbolTable = new this.gs2.sfs.SymbolTable({ baseUrl: "" });
      //查找实体样式  样式描述服务
      const _this = this;
      this.styleService.findEntityStyle().then(
        function(data) {
          for (let i = 0, len = data.length; i < len; ++i) {
            let entity = data[i];
            let symbol = entity.symbol;
            let name = entity.name;
            symbolTable.append(name, symbol);
          }
          _this.baseLayerSymbolInit(symbolTable);
        },
        function(e) {
          _this.baseLayerSymbolInit(symbolTable);
        }
      );
    },
    //矢量图符号初始化
    baseLayerSymbolInit(symbolTable) {
      this.wfsLayer = new this.gs2.carto.FeatureLayer({
        id: "featureLayer",
        opacity: 1.0,
        zIndex: 0
      });
      this.OwnerFeatureLayer = new this.gs2.carto.FeatureLayer({
        id: "OwnerFeatureLayer",
        opacity: 0.8,
        visible: true,
        zIndex: 6
      });
      //新分区
      this.wgFeatureLayer = new this.gs2.carto.FeatureLayer({
        id: "wgFeatureLayer",
        opacity: 0.9,
        visible: false,
        zIndex: 7
      });
      //旧分区
      this.OwnerALLFeatureLayer = new this.gs2.carto.FeatureLayer({
        id: "OwnerALLFeatureLayer",
        opacity: 0.9,
        visible: false,
        zIndex: 7
      });
      //创建渲染 符号表单
      let renderCreator = new this.gs2.render.RenderCreator({
        symbolTable: symbolTable
      });
      const _this = this;
      this.catService
        .findByName(mapConfig.serviceUrl.wfsLayerCatService)
        .then(function(descriptor) {
          let uniqueRender = renderCreator.createRender(descriptor, "purpose");
          uniqueRender.showLabel = true;
          uniqueRender.labelField = "Text";
          _this.wfsLayer.render(uniqueRender);
        });

      this.catService
        .findByName(mapConfig.serviceUrl.OwnerFeatureLayerCatService)
        .then(function(descriptor) {
          let uniqueRender = renderCreator.createRender(descriptor);
          uniqueRender.showLabel = true;
          uniqueRender.labelField = "person";
          _this.OwnerFeatureLayer.render(uniqueRender);
        });
      //网格
      this.catService
        .findByName(mapConfig.serviceUrl.wgFeatureLayerRender)
        .then(function(descriptor) {
          let uniqueRender = renderCreator.createRender(
            descriptor,
            "type_color_code"
          );
          uniqueRender.showLabel = true;
          uniqueRender.labelField = "grid_address";
          _this.wgFeatureLayer.render(uniqueRender);
        });
      this.catService
        .findByName(mapConfig.serviceUrl.OwnerALLFeatureLayer)
        .then(function(descriptor) {
          let uniqueRender = renderCreator.createRender(descriptor, "person");
          uniqueRender.showLabel = true;
          uniqueRender.labelField = "person";
          _this.OwnerALLFeatureLayer.render(uniqueRender);
        });
      this.g2map.addLayer(this.wfsLayer);
      this.g2map.addLayer(this.OwnerFeatureLayer);
      this.g2map.addLayer(this.wgFeatureLayer);
      this.g2map.addLayer(this.OwnerALLFeatureLayer);
      //空间分析判断全局变量初始化设置
      this.ownerQueryParam = false;
      this.circleElementLayer = new this.gs2.lys.ElementLayer({
        zIndex: 2
      });
      this.g2map.addLayer(this.circleElementLayer);
      this.deviceLayer = new this.gs2.lys.ElementLayer({
        id: "elmentPointLayer",
        minZoom: 19,
        maxZoom: 23,
        zIndex: 99,
        visible: true
      });
      this.g2map.addLayer(this.deviceLayer);
      this.bufferDeviceLayer = new this.gs2.lys.ElementLayer({
        id: "bufferDeviceLayer",
        zIndex: 3
      });
      this.floorTooltipWare = new this.gs2.ext.TooltipWare({
        excluseLayerIds: this.deviceLayer.getLayerId(),
        map: this.g2map
      });
      //地图覆盖物管理
      this.distanceOverlayWare = new this.gs2.widget.OverlayWare({
        map: this.g2map
      });
      this.alarmDeviceOverlayWare = new this.gs2.widget.OverlayWare({
        map: this.g2map
      });
      //距离测量图层
      this.distanceMesasureLayer = new this.gs2.lys.ElementLayer({
        id: "distanceMesasureLayer",
        zIndex: 3,
        visible: true
      });
      this.g2map.addLayer(this.distanceMesasureLayer);
      //直线类型符号
      let gsLineSymbol = new this.gs2.syms.SimpleLinesymbol({
        opacity: 1,
        color: new this.gs2.syms.Color({ r: 255, g: 97, b: 0 })
      });
      //路径形状
      let distancePath = new this.gs2.geom.Path({ spatialReference: 3857 });
      //不规则图形
      let distancePolyline = new this.gs2.geom.Polyline({
        spatialReference: 3857
      });
      distancePolyline.addGeometry(distancePath);
      let distancePolylineEle = new this.gs2.ele.Element({
        geometry: distancePolyline,
        symbol: gsLineSymbol
      });
      let distanceSpatailRef = {
        srid: 3857
      };
      let ploylinePlot = new this.gs2.cmds.DrawTool({
        id: "ploylinePlot",
        templateElement: distancePolylineEle,
        layer: this.distanceMesasureLayer,
        drawLayer: this.distanceMesasureLayer
      });
      this.ploylinePlot = ploylinePlot;
      let projectService = new this.gs2.ext.ProjectService();
      let measureService = new this.gs2.sfs.MeasureService({
        projectService: projectService
      });
      let distanceToolTipWare = new this.gs2.ext.TooltipWare({
        map: this.g2map
      });
      this.distanceToolTipWare = distanceToolTipWare;
      //  监听设备点击事件
      this.g2map.on("click", this.deviceClickEvent);
      this.g2map.on("mousemove", this.mouseMoveEvent);
      this.g2map.on("resolutionchanged", this.resolutionchangedEvent);
      this.resolutionchangedEvent();
    },
    //查询楼层数据
    queryFloorList() {
      //查询区域名称
      let regionList = this.regionListData;
      if(regionList&& regionList.length>0){
        for(let i=0;i<regionList.length;i++){
          if(regionList[i].value == this.regionValue){
            this.regionName = regionList[i].label;
          }
        }
      }
      this.loading = true;
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getTAndAByUnitIdAndBuildId";
      let params = {
        unitId: this.rowData.unitId,
        buildId: this.regionValue,
        type:"2"
      };
      api.post(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          //加载左侧楼层导航
          let data = res["data"] || [];
          if (data && data.length > 0) {
            this.loadSideFloorNav(data);
          } else {
            Message.warning("暂无楼层数据");
          }
        } else {
          Message.error("查询楼层列表失败!");
        }
      });
    },
    //加载左侧楼层导航
    loadSideFloorNav(floorArr) {
      const self = this;
      //销毁旧容器
      let oldContainer = $("#floor-page").find(".nav-div");
      if (oldContainer.length > 0) {
        oldContainer.remove();
      }
      //加载导航html
      let floor_nav_div =
        "<div class='nav-div'><div class='floor-nav'><a class='icon-lift-up'><i class='maintenance-arrowTop'></i></a><div class='floor-di'><div class='floor-ul-div'></div></div><a class='icon-lift-down'><i  class='maintenance-arrowBottom'></i></a>";
      let firstFloor = null,
        alarmFloor = null,
        troubleFloor = null,
        ulHtml = "<ul>";
      for (let key in floorArr) {
        let floor = floorArr[key];
        // 第一层楼
        if (firstFloor == null) {
          firstFloor = floor.floorId;
        }
        // 当前楼层
        if (alarmFloor == null && floor.alarmState != 0) {
          alarmFloor = floor.floorId;
        }
        if (troubleFloor == null && floor.troubleType != 0) {
          troubleFloor = floor.floorId;
        }
        let statusClass = "";
        if (floor.alarmState != 0) {
          statusClass = "is-error";
        } else if (floor.troubleType != 0) {
          statusClass = "is-warning";
        }
        let urlTemp = "";
        if (floor.floorAreaImg === "") {
          urlTemp = "~@/static/img/RealTimeMonitoring/simple-logo-hidden.png";
        } else {
          urlTemp =
            api.forent_url.image_url + "/floorImage/" + floor.floorAreaImg; // 楼层平面图
        }
        ulHtml +=
          "<li class='" +
          statusClass +
          "' floorid='" +
          floor.floorId +
          "' picurl='" +
          urlTemp +
          "' alarmcount='" +
          floor.alarmState +
          "' accicount='" +
          floor.troubleType +
          "' warncount='" +
          floor.warningState +
          "'abnormalcount='"+
          floor.abnormalCount+"'>\
                <a href='javascript:;'><span class='gg-floor-circle' title=" +
          floor.floorName +
          ">" +
          floor.floorName +
          "</span></a></li>";
      }
      ulHtml += "</ul>";
      $("#floor-page").append(floor_nav_div);
      $(".floor-ul-div").append(ulHtml);
      let ulObj = $(".floor-ul-div > ul");
      let liftLength = ulObj.find("li").length; //个数
      let liftNumHeight = ulObj.find("li").outerHeight(true) * liftLength; //左侧楼梯ul高度
      ulObj.css("height", liftNumHeight + "px");
      if (ulObj.length == 0) {
        return;
      }
      let initListOffsetTop = ulObj.offset().top;
      let curListOffsetTop = 0; //当前左侧楼梯ul offsetTop
      let liftNum = liftLength / 8;
      let step = 6 * ulObj.find("li").outerHeight(true); //步长
      let liftTop = 0;
      let liftUpBtn = $(".icon-lift-up"); //向上箭头
      let listDownBtn = $(".icon-lift-down"); // 向下箭头
      //初始化li显示位置
      let currentFloor;
      //如果是点击火警进入的有当前楼层
      if (this.currentFloor) {
        currentFloor = this.currentFloor;
      } else {
        if (alarmFloor) {
          currentFloor = alarmFloor;
        } else if (troubleFloor) {
          currentFloor = troubleFloor;
        } else {
          currentFloor = firstFloor;
        }
      }
      let currentTag = $('.floor-ul-div>ul>li[floorid="' + currentFloor + '"]');
      let prevLiNum = currentTag.prevAll("li").length;
      currentTag
        .addClass("floor-lift-cur")
        .siblings()
        .removeClass("floor-lift-cur");
      currentTag.addClass("floor-checked");
      ulObj.offset({ top: initListOffsetTop - prevLiNum * 40 });
      let buildId = this.regionValue;
      let picUrl = currentTag.attr("picurl");
      let floorId = currentTag.attr("floorid");
      let alarmcount = currentTag.attr("alarmcount"); //报警数
      let accicount = currentTag.attr("accicount"); //故障数
      let warncount = currentTag.attr('warncount'); //预警数
      let abnormalcount = currentTag.attr('abnormalCount');//异常数
      //楼层页
      this.buildAlarmInfo.alarmcount = alarmcount;
      this.buildAlarmInfo.warnNumber = warncount;
      this.buildAlarmInfo.accicount = accicount;
      this.buildAlarmInfo.abnormal = abnormalcount;
      $(".gg-company-warnTitle").text($(".gs-el-input__inner").val());
      $(".gg-company-warnTitle").attr("title", $(".gs-el-input__inner").val());
      //切换楼层图
      this.addPicToMap(picUrl, buildId, floorId);
      //向下按钮 点击事件
      listDownBtn.click(function() {
        liftTop = parseInt(ulObj.css("top").split("px")[0]);
        curListOffsetTop = ulObj.offset().top;
        if (liftTop - step > -liftNumHeight + step) {
          ulObj.animate({ top: liftTop - step });
          liftUpBtn.css("color", "#3c8dbc");
        } else if (
          liftTop - step <= -liftNumHeight + step &&
          liftTop > -liftNumHeight + step
        ) {
          ulObj.animate({ top: -liftNumHeight + step });
          listDownBtn.css("color", "#cccccc");
          liftUpBtn.css("color", "#3c8dbc");
        }
      });
      //向上按钮 点击事件
      liftUpBtn.click(function() {
        liftTop = parseInt(ulObj.css("top").split("px")[0]);
        curListOffsetTop = ulObj.offset().top;
        if (curListOffsetTop + step < initListOffsetTop) {
          ulObj.animate({ top: liftTop + step });
          listDownBtn.css("color", "#3c8dbc");
        } else if (
          curListOffsetTop + step >= initListOffsetTop &&
          curListOffsetTop < initListOffsetTop
        ) {
          ulObj.animate({ top: 0 });
          liftUpBtn.css("color", "#cccccc");
          listDownBtn.css("color", "#3c8dbc");
        }
      });
      //楼层切换
      ulObj.find("li").click(function() {
        if (self.floorTooltipWare) {
          self.floorTooltipWare.clear();
        }
        let floorNum = $(this).attr("floorNum");
        $(this)
          .addClass("floor-lift-cur")
          .siblings()
          .removeClass("floor-lift-cur");
        $(".gg-company-warnFloor span").text($(".floor-lift-cur").text());
        $(".gg-company-warnFloor span").attr(
          "title",
          $(".floor-lift-cur").text()
        );
        $(".floor-ul-div>ul>li").removeClass("floor-checked");
        $(this).addClass("floor-checked");
        let buildId = self.regionValue;
        let picUrl = $(this).attr("picurl");
        let floorId = $(this).attr("floorid");
        let alarmcount = $(this).attr("alarmcount"); //报警数
        let accicount = $(this).attr("accicount"); //故障数
        let warncount = $(this).attr('warncount'); //预警数
        let abnormalcount = $(this).attr('abnormalCount');//异常数
        //楼层页
        self.buildAlarmInfo.alarmcount = alarmcount;
        self.buildAlarmInfo.warnNumber = warncount;
        self.buildAlarmInfo.accicount = accicount;
        self.buildAlarmInfo.abnormal = abnormalcount;
        self.addPicToMap(picUrl,buildId,floorId);
      });
    },
    //切换楼层图
    addPicToMap(picUrl, buildId, floorId) {
      const _this = this;
      if (this.userModel === 0) {
        //室内gis
        this.currentFloorId = floorId;
        this.clearLayersAndEvents();
        //添加wfs服务
        let filter = new this.gs2.ows.GQueryFilter({
          subFields: "*",
          where: "floor_id ='" + floorId + "'",
          returnGeometry: true
        });
        let result = this.wfsService.find(
          mapConfig.serviceUrl.wfsSource,
          filter
        );
        result.then(function(data) {
          if (data) {
            _this.wfsLayer.addFeatureCollection(data);
            let layExtent = _this.wfsLayer.getExtent();
            _this.initMapLocation(layExtent); //图层初始化定位
            _this.OwnerALLFeatureLayer.addFeatureCollection(data);
          }
        });
        //网格服务
        let resultWg = this.wfsService.find(
          mapConfig.serviceUrl.wgFeatureLayerSource,
          filter
        );
        resultWg.then(function(data) {
          if (data) {
            _this.wgFeatureLayer.addFeatureCollection(data);
          }
        });
        //加载设备信息
        this.loadDevice(floorId, buildId);
      } else {
        let img = new Image();
        img.src = picUrl;
        img.onload = function() {
          //  清除图层及事件
          let arr = _this.g2map.getLayers();
          for (let i = 0; i < arr.length; i++) {
            _this.g2map.removeLayer(arr[i]);
            i--;
          }
          _this.g2map.un("click", _this.deviceClickEvent);
          _this.g2map.un("mousemove", _this.mouseMoveEvent);
          _this.g2map.un("resolutionchanged", _this.resolutionchangedEvent);
          let w = img.width * 1000;
          let h = img.height * 1000;
          //创建一个图像图层
          let floor_imageLayer = new _this.gs2.lys.ImageLayer({
            imageType: 702,
            extent: [0, 0, w, h], //图片范围，请按照坐标系的范围给出，此为3857的坐标系范围
            crossOrigin: "anonymous", //跨域
            url: picUrl // 图层服务 url
          });
          // 将 图像图层添加到地图
          _this.g2map.addLayer(floor_imageLayer);
          let point = new _this.gs2.geom.Point({
            x: w / 2,
            y: h / 2,
            spatialReference: _this.gs2.geom.SpatialReference.EPSG3857
          });
          _this.g2map.pan(
            new _this.gs2.geom.Envelope({ minx: 0, miny: 0, maxx: w, maxy: h })
          );
          //创建元素图层
          let elementLayer = new _this.gs2.lys.ElementLayer();
          _this.g2map.addLayer(elementLayer);
          _this.deviceLayer = elementLayer; //全局标点使用

          //创建tooltip管理
          _this.floorTooltipWare = new _this.gs2.ext.TooltipWare({
            excluseLayerIds: elementLayer.getLayerId(),
            map: _this.g2map
          });
          //加载设备信息
          _this.loadDevice(floorId, buildId);
        };
      }
    },
    //加载设备信息
    loadDevice(floorId, buildId) {
      const _this = this;
      let serviceUrl = api.forent_url.image_url + "/deviceIcons.json";
      if (!this.iconConf.deviceIcons) {
        api.get(serviceUrl).then(res => {
          let icons = res.deviceIcons;
          initSymbols(icons).then(function(obj) {
            _this.iconConf.deviceIcons = obj;
            _this.loadDevice(floorId, buildId);
          });
        });
      } else {
        //如果有值
        this.getEquipmentListByFloorId(floorId, buildId);
      }
      function initSymbols(icons) {
        let mapObj = {};
        let dtd = $.Deferred();
        let iconKeys = Object.keys(icons);
        for (let key in icons) {
          for (let key1 in icons[key]) {
            loadImg(icons[key][key1], key + "_" + key1).then(function(
              symbol,
              key
            ) {
              mapObj[key] = symbol;
              let mapObjKeys = Object.keys(mapObj);
              if (iconKeys.length == mapObjKeys.length) {
                dtd.resolve(mapObj);
              }
            });
          }
        }
        return dtd;
      }

      function loadImg(imgSrc, key) {
        let dtd = $.Deferred();
        let img = new Image();
        if (!imgSrc.icon) {
          dtd.resolve("", key);
          return dtd;
        }
        img.src = "data:image/jpg;base64," + imgSrc.icon;
        img.onload = function() {
          let w = img.width;
          let h = img.height;
          let markerSymbol = new _this.gs2.syms.Picturemarkersymbol({
            source: img.src,
            width: w,
            height: h,
            rotation: "0",
            opacity: "1",
            offsetX: w / 2,
            offsetY: h / 2
          });
          dtd.resolve(markerSymbol, key);
        };
        return dtd;
      }
    },
    //根据楼层id获取设备列表
    getEquipmentListByFloorId(floorId, buildId) {
      let params = {
        unitId: this.rowData.unitId,
        floorId: floorId,
        buildId: buildId,
        deviceTypeIds: this.deviceQueryType,
        runState: this.facilitiesStateValue,
        orgId:this.orgId,
        type:"2"
      };
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getDeviceListByCondition";
      api.post(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"];
          this.loadEquipmentPoint(data);
        } else {
          Message.error("根据楼层id获取设备列表失败!");
        }
      });
    },
    //加载楼层设备点信息
    loadEquipmentPoint(data) {
      for (let key in data) {
        let equip = data[key];
        let status = "normal";
        let iot_typeId = undefined;
        if (equip["runState"] == "1") {
          //报警
          status = "calltheplice";
        } else if (equip["runState"] == "2") {
          status = "fault";
        } else if (equip["runState"] == "98") {
          status = "warning";
        }
        let iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
        //判断物联网设备点
        if (equip.list1 !== "") {
          //物联网主体状态
          status = "monitorNormal_deviceNormal";
          iot_typeId = equip.deviceTypeId;
          if (equip.runState === "98") {
            //主体预警
            for (let i of JSON.parse(equip.list1)) {
              if (i.onlineState === "0") {
                status = "monitorOffline_deviceWarning"; //预警 离线
              } else {
                if (i.runState === "1") {
                  status = "monitorTrouble_deviceWarning"; //预警 故障
                  continue;
                } else {
                  if (status == "monitorNormal_deviceNormal") {
                    status = "monitorNormal_deviceWarning"; //预警 正常
                  }
                }
              }
            }
          } else if (equip.runState === "2") {
            //主体故障
            for (let i of JSON.parse(equip.list1)) {
              if (i.onlineState === "0") {
                status = "monitorOffline_deviceTrouble"; //故障 离线
              } else {
                if (i.runState === "1") {
                  status = "monitorTrouble_deviceTrouble"; //故障 故障
                  continue;
                } else {
                  if (status == "monitorNormal_deviceNormal") {
                    status = "monitorNormal_deviceTrouble"; //故障 正常
                  }
                }
              }
            }
          } else {
            //主体正常
            for (let i of JSON.parse(equip.list1)) {
              if (i.onlineState === "0") {
                status = "monitorOffline_deviceNormal"; //正常 离线
              } else {
                if (i.runState === "1") {
                  status = "monitorTrouble_deviceNormal"; //正常 故障
                  continue;
                }
              }
            }
          }
          if (
            equip.deviceTypeId != "01020000" &&
            equip.deviceTypeId != "01030000"
          ) {
            if (complexDeviceIcons[status]) {
              if (complexDeviceIcons[status][iot_typeId]) {
                iconUrl.source =
                  "data:image/jpg;base64," + complexDeviceIcons[status][iot_typeId].icon;
              } else {
                if (equip["runState"] == "1") {
                  //报警
                  status = "calltheplice";
                  iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
                } else if (equip["runState"] == "2") {
                  status = "fault";
                  iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
                } else if (equip["runState"] == "98") {
                  status = "warning";
                  iconUrl = this.getIconUrl("19050000", status);
                }
              }
            } else {
              if (equip["runState"] == "1") {
                //报警
                status = "calltheplice";
                iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
              } else if (equip["runState"] == "2") {
                status = "fault";
                iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
              } else if (equip["runState"] == "98") {
                status = "warning";
                iconUrl = this.getIconUrl("19050000", status);
              }
            }
          }
        } else if (equip.list2 !== "") {
          //物联网设备状态
          status = "monitorNormal_deviceNormal";
          iot_typeId = equip.deviceTypeId;
          if (equip.onlineState === "0") {
            if (JSON.parse(equip.list2)[0].runState === "2") {
              //离线 故障
              status = "monitorOffline_deviceTrouble";
            } else if (JSON.parse(equip.list2)[0].runState === "98") {
              //离线 预警
              status = "monitorOffline_deviceWarning";
            } else {
              //离线 正常
              status = "monitorOffline_deviceNormal";
            }
          } else {
            if (equip.runState === "2") {
              if (JSON.parse(equip.list2)[0].runState === "2") {
                //故障 故障
                status = "monitorTrouble_deviceTrouble";
              } else if (JSON.parse(equip.list2)[0].runState === "98") {
                //故障 预警
                status = "monitorTrouble_deviceWarning";
              } else {
                //故障 正常
                status = "monitorTrouble_deviceNormal";
              }
            } else if (equip.runState === "98") {
              //设备状态不完善 完善后删除
              status = "warning";
              iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
            } else {
              if (JSON.parse(equip.list2)[0].runState === "2") {
                //正常 故障
                status = "monitorNormal_deviceTrouble";
              } else if (JSON.parse(equip.list2)[0].runState === "98") {
                //正常 预警
                status = "monitorNormal_deviceWarning";
              }
            }
          }
          if (
            equip.deviceTypeId != "01020000" &&
            equip.deviceTypeId != "01030000"
          ) {
            if (complexDeviceIcons[status]) {
              if (complexDeviceIcons[status][iot_typeId]) {
                iconUrl.source =
                  "data:image/jpg;base64," + complexDeviceIcons[status][iot_typeId].icon;
              } else {
                if (equip["runState"] == "1") {
                  //报警
                  status = "calltheplice";
                  iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
                } else if (equip["runState"] == "2") {
                  status = "fault";
                  iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
                } else if (equip["runState"] == "98") {
                  status = "warning";
                  iconUrl = this.getIconUrl("19050000", status);
                }
              }
            } else {
              if (equip["runState"] == "1") {
                //报警
                status = "calltheplice";
                iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
              } else if (equip["runState"] == "2") {
                status = "fault";
                iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
              } else if (equip["runState"] == "98") {
                status = "warning";
                iconUrl = this.getIconUrl("19050000", status);
              }
            }
          }
        } else {
          if (equip["runState"] == "1") {
            //报警
            status = "calltheplice";
          } else if (equip["runState"] == "2") {
            status = "fault";
          } else if (equip["runState"] == "98") {
            status = "warning";
          }
          iconUrl = this.getIconUrl(equip["deviceTypeId"], status);
        }
        //gis2.0设备点
        if (this.userModel === 0) {
          if (equip["mapX"] == "" || equip["mapY"] == "") {
            continue;
          }
          if (equip.runState == "1") {
            this.drawAlarmPoint(
              equip["mapX"],
              equip["mapY"],
              equip["deviceId"],
              equip
            );
            iconUrl = mapConfig.serviceUrl.alarmTransparentIcon;
            this.drawPoint(equip["mapX"], equip["mapY"], iconUrl, equip);
          } else {
            this.drawPoint(equip["mapX"], equip["mapY"], iconUrl, equip);
          }
        } else {
          if (equip["longitude"] == "" || equip["latitude"] == "") {
            continue;
          }
          this.drawPoint(equip["longitude"], equip["latitude"], iconUrl, equip);
        }
      }
      if(this.userModel != 1){
         //  监听设备点击事件
        this.g2map.on("click", this.deviceClickEvent);
        this.g2map.on("mousemove", this.mouseMoveEvent);
      }
      this.mapCenterAndShow();
    },
    //地图展示当前点击的火警
    mapCenterAndShow() {
      if (this.currentDevice) {
        let element = this.deviceLayer.find(this.currentDevice);
        this.g2map.setCenter(element.geometry);
        this.showWindow(element);
      }
    },
    //地图标点
    drawPoint(x, y, icon, bind_param) {
      //构造一个点(坐标，空间参考系）
      let point = new this.gs2.geom.Point({
        x: x,
        y: y,
        spatialReference: this.gs2.geom.SpatialReference.EPSG3857
      });
      let ele = new this.gs2.ele.Element({
        geometry: point,
        symbol: icon,
        id: bind_param.deviceId
      });
      ele.tag = bind_param;
      this.deviceLayer.add(ele);
      this.loading = false;
    },
    //设备报警点
    drawAlarmPoint(longitude, latitude, deviceId) {
      let point = new this.gs2.geom.Point({
        x: longitude,
        y: latitude,
        spatialReference: this.gs2.geom.SpatialReference.EPSG3857
      });
      let imgSrc = this.imgUrlObj.floorAlarm;
      let html =
        '<div class ="alarmPointClass" id ="' +
        deviceId +
        '"><img src="' +
        imgSrc +
        '"></div>';
      let overlay = new this.gs2.widget.OverLay({
        id: deviceId,
        element: this.parseDom(html),
        offset: [-21.5, -21],
        position: point,
        positioning: "top-left",
        stopEvent: false
      });
      this.alarmDeviceOverlayWare.add(overlay);
      const _this = this;
      $(".alarmPointClass").unbind("click");
      $(".alarmPointClass").bind("click", function() {
        let id = this.id;
        for (let i = 0; i < _this.deviceLayer.elements.length; i++) {
          if (id == _this.deviceLayer.elements[i].id) {
            _this.showWindow(_this.deviceLayer.elements[i]);
            break;
          }
        }
      });
    },
    //生成dom
    parseDom(elementStr) {
      let div = document.createElement("div");
      div.innerHTML = elementStr;
      return div.childNodes[0];
    },
    //根据设备类型和状态获取图标url
    getIconUrl(type, status) {
      let iconObj = this.iconConf.deviceIcons[status + "_" + type];
      if (iconObj) {
        return iconObj;
      }
      return;
    },
    //清除图层及事件
    clearLayersAndEvents() {
      let arr = this.g2map.getLayers();
      for (let i = 0; i < arr.length; i++) {
        let layer = this.g2map.getLayers()[i];
        layer.clear(); //清除所有图层数据
      }
      if (this.distanceOverlayWare) {
        this.distanceOverlayWare.clear();
      }
      if (this.alarmDeviceOverlayWare) {
        this.alarmDeviceOverlayWare.clear();
      }
      if (this.distanceToolTipWare) {
        this.distanceToolTipWare.clear();
      }
      this.g2map.un("click", this.deviceClickEvent);
      this.g2map.un("mousemove", this.mouseMoveEvent);
      this.g2map.un("resolutionchanged", this.resolutionchangedEvent);
    },
    //地图点击事件
    deviceClickEvent(button, shift, screenX, screenY, mapX, mapY, handle) {
      if (!this.deviceLayer) {
        return;
      }
      //点击设备
      let ele = this.deviceLayer.hitTest(screenX, screenY);
      this.floorTooltipWare.clear();
      if (ele) {
        let ele_video, graphic;
        let element = ele.element;
        this.showWindow(element);
      }
    },
    //展示弹框
    showWindow(element) {
      //当前的楼栋id
      let buildId = this.regionValue;
      this.floorTooltipWare.clear();
      let point = new this.gs2.geom.Point({
        x: element.geometry.x,
        y: element.geometry.y,
        spatialReference: this.gs2.geom.SpatialReference.EPSG3857
      });
      //模板拼接
      let data = element.tag;
      let status = ""; //状态
      let warDateStr = ""; //报警时间字段
      if (data["runState"] == "1") {
        status = "报警";
        warDateStr =
          '<p class="gg-hydraulic-info">报警时间：<span>' +
          data["deviceTime"] +
          "</span></p>";
      } else if (data["runState"] == "2") {
        status = "故障";
        warDateStr =
          '<p class="gg-hydraulic-info">报警时间：<span>' +
          data["deviceTime"] +
          "</span></p>";
      } else {
        status = "正常";
      }
      let deviceTypeId = data["deviceTypeId"];
      let tooltipTemplate = "";
      if (deviceTypeId == SpecialDeviceType.fireMonitorCode) {
        //电气火灾的模板html
        tooltipTemplate = this.iotFacility(deviceTypeId);
      } else if (
        deviceTypeId == SpecialDeviceType.insideCode ||
        deviceTypeId == SpecialDeviceType.outsideCode ||
        deviceTypeId == SpecialDeviceType.sprayEndCode ||
        deviceTypeId == SpecialDeviceType.waterLevelCode ||
        deviceTypeId == SpecialDeviceType.waterPump
      ) {
        //室内室外消防水压监测装置
        tooltipTemplate = this.iotFacility(deviceTypeId);
      } else if (deviceTypeId == SpecialDeviceType.smokeMonitorCode) {
        //烟感
        tooltipTemplate = this.smokeHtml();
      } else if (
        deviceTypeId == SpecialDeviceType.distributeBox ||
        deviceTypeId == SpecialDeviceType.fireWaterTank ||
        deviceTypeId == SpecialDeviceType.fireWaterPool ||
        deviceTypeId == SpecialDeviceType.fireWaterPump ||
        deviceTypeId == SpecialDeviceType.fireHydrant_end ||
        deviceTypeId == SpecialDeviceType.fireHydrant_indoor ||
        deviceTypeId == SpecialDeviceType.fireHydrant_outUp ||
        deviceTypeId == SpecialDeviceType.fireHydrant_outDown
      ) {
        //物联网模版
        tooltipTemplate = this.iotDevice(deviceTypeId);
      } else {
        //其他
        tooltipTemplate = this.fireOther(deviceTypeId);
      }
      //long
      let deviceType_tooltipStyle = [
        SpecialDeviceType.distributeBox,
        SpecialDeviceType.fireWaterTank,
        SpecialDeviceType.fireHydrant_end,
        SpecialDeviceType.fireWaterPool,
        SpecialDeviceType.fireWaterPump,
        SpecialDeviceType.fireHydrant_indoor,
        SpecialDeviceType.fireHydrant_outUp,
        SpecialDeviceType.fireHydrant_outDown,
        SpecialDeviceType.fireMonitorCode,
        SpecialDeviceType.insideCode,
        SpecialDeviceType.outsideCode,
        SpecialDeviceType.smokeMonitorCode,
        SpecialDeviceType.sprayEndCode,
        SpecialDeviceType.waterLevel,
        SpecialDeviceType.waterPump
      ];
      let tooltip;
      if (deviceType_tooltipStyle.indexOf(deviceTypeId) === -1) {
        //short_style
        tooltip = new this.gs2.ext.Tooltip({
          anchor: point, //提示在地图上停靠位置
          content: tooltipTemplate, //提示内容
          layerId: this.deviceLayer.getLayerId(), //提示所在图层ID
          offset: [0, 0], //位置偏移量
          className: "g2-tooltip" //tooltip样式
        });
        this.floorTooltipWare.add(tooltip); //将tooltip添加到tooltipWare中
      } else {
        //long_style
        tooltip = new g2.ext.Tooltip({
          anchor: point, //提示在地图上停靠位置
          content: tooltipTemplate, //提示内容
          layerId: this.deviceLayer.getLayerId(), //提示所在图层ID
          offset: [0, 0], //位置偏移量
          className: "g2-tooltip" //tooltip样式
        });
        this.floorTooltipWare.add(tooltip); //将tooltip添加到tooltipWare中
      }

      //查询楼栋类型
      //楼栋的类型  01	超高层建筑02	一类高层建筑03	二类高层建筑04	高层厂房05	高层库房06	低层民用建筑07	低层厂房08	低层库房09	地下建筑99	其他建筑
      const _this = this;
      this.getBuildClass(buildId).then(function(build_class) {
        //设备id
        let deviceId = data["deviceId"];
        //加载设备基本信息
        _this.deviceInfo(deviceId, _this.rowData.unitId, deviceTypeId);
        //加载水压水位电流数据 echarts
        if (
          deviceTypeId == SpecialDeviceType.distributeBox ||
          deviceTypeId == SpecialDeviceType.fireMonitorCode ||
          deviceTypeId == SpecialDeviceType.insideCode ||
          deviceTypeId == SpecialDeviceType.outsideCode ||
          deviceTypeId == SpecialDeviceType.sprayEndCode ||
          deviceTypeId == SpecialDeviceType.waterLevel ||
          deviceTypeId == SpecialDeviceType.fireWaterTank ||
          deviceTypeId == SpecialDeviceType.fireHydrant_end ||
          deviceTypeId == SpecialDeviceType.fireWaterPool ||
          deviceTypeId == SpecialDeviceType.fireWaterPump ||
          deviceTypeId == SpecialDeviceType.fireHydrant_indoor ||
          deviceTypeId == SpecialDeviceType.fireHydrant_outUp ||
          deviceTypeId == SpecialDeviceType.fireHydrant_outDown
        ) {
          //加载电流 线缆温度echarts
          _this.devicemA(
            deviceId,
            _this.rowData.unitId,
            deviceTypeId,
            "7",
            build_class,
            data["runState"]
          );
        }
        //实时读数
        if (
          deviceTypeId == SpecialDeviceType.fireMonitorCode ||
          deviceTypeId == SpecialDeviceType.distributeBox
        ) {
          _this.deviceCur(deviceId, _this.rowData.unitId);
        }
        //出去三种特殊设备    其他设备展示 正常 报警  故障
        if (
          deviceTypeId != SpecialDeviceType.insideCode &&
          deviceTypeId != SpecialDeviceType.outsideCode &&
          deviceTypeId != SpecialDeviceType.sprayEndCode &&
          deviceTypeId != SpecialDeviceType.waterLevel &&
          deviceTypeId != SpecialDeviceType.waterPump
        ) {
          if (data["runState"] == "0") {
            //正常
            $("#currentState").html("正常");
          } else if (data["runState"] == "1") {
            //报警

            $("#currentState").html("报警");
            $("#currentState")
              .parent()
              .removeClass("gg-normal-item")
              .addClass("gg-alarm-item");
          } else if (data["runState"] == "2") {
            //故障
            $("#currentState").html("故障");
            $("#currentState")
              .parent()
              .removeClass("gg-normal-item")
              .addClass("gg-prober-item");
          } else if (data["runState"] == "96") {
            if (deviceTypeId == fireDoor) {
              $("#currentState").html("开启");
              $("#currentState")
                .parent()
                .removeClass("gg-normal-item")
                .addClass("gg-prober-item");
            }
          } else if (data["runState"] == "97") {
            if (deviceTypeId == fireDoor) {
              $("#currentState").html("关闭");
              $("#currentState")
                .parent()
                .removeClass("gg-normal-item")
                .addClass("gg-prober-item");
            }
          } else if (data["runState"] == "98") {
            $("#currentState").html("预警");
            $("#currentState")
              .parent()
              .removeClass("gg-normal-item")
              .addClass("gg-warning-item");
          }
        }
        //电器火灾探测器弹窗面板 选项卡点击事件
        let prober_btn = $(".gg-prober-content .gg-btn-capsule");
        let prober_unit = $(".gg-prober-model .gg-prober-unit");
        let capuse_time = $(".gg-capuse-time--item");
        prober_unit.eq(0).show();
        if (deviceTypeId == SpecialDeviceType.fireMonitorCode) {
          if ($(this).index() == 1) {
            $(".gg-capuse-time").show();
          } else {
            $(".gg-capuse-time").hide();
          }
        }
        prober_btn.click(function() {
          prober_btn.removeClass("is-active");
          prober_unit.removeClass("is-active");
          $(this).addClass("is-active");
          if ($(this).attr("name") == "accidRecord") {
            //加载异常记录列表  查询前四条 传递0
            if (deviceTypeId != SpecialDeviceType.fireDoor) {
              _this.deviceAccidentInfo(deviceId, _this.rowData.unitId);
            }
          }
          prober_unit.hide();
          prober_unit.eq($(this).index()).show();
          //sheshi
          if (deviceTypeId == SpecialDeviceType.fireMonitorCode) {
            if ($(this).index() == 1) {
              $(".gg-capuse-time").show();
            } else {
              $(".gg-capuse-time").hide();
            }
          } else if (
            deviceTypeId == SpecialDeviceType.insideCode ||
            deviceTypeId == SpecialDeviceType.outsideCode ||
            deviceTypeId == SpecialDeviceType.sprayEndCode
          ) {
            if ($(this).index() == 0) {
              $(".gg-capuse-time").show();
            } else {
              $(".gg-capuse-time").hide();
            }
          } else if (
            deviceTypeId == SpecialDeviceType.waterLevel ||
            deviceTypeId == SpecialDeviceType.waterPump
          ) {
            if ($(this).index() == 0) {
              $(".gg-capuse-time").show();
            } else {
              $(".gg-capuse-time").hide();
            }
          } else if (deviceTypeId == SpecialDeviceType.smokeMonitorCode) {
            if ($(this).index() == 0) {
              $(".gg-capuse-time").show();
            } else {
              $(".gg-capuse-time").hide();
            }
          }
        });
        //物联网设备 选项卡点击事件
        $(".add-btn-capsule").click(function() {
          $(".add-btn-capsule").removeClass("add-is-active");
          $(this).addClass("add-is-active");
          $(".add-prober-unit").hide();
          let capsure_click = $(this).index();
          $(".add-prober-unit")
            .eq(capsure_click)
            .show();
        });
        //物联网监测装置显隐
        $(".toggle-warnNum-dialog").click(function() {
          $(".toggle-warnNum-dialog .maintenance-back2").css(
            "transform",
            "rotate(180deg)"
          );
          $(".add-warnNum-dialog").toggle();
          if ($(".add-warnNum-dialog").is(":visible")) {
            $(".toggle-warnNum-dialog .maintenance-back2").css(
              "transform",
              "rotate(0deg)"
            );
            let search_deviceType = "";
            if (_this.monitoringObject === "") {
              search_deviceType = "/recordEnterprise/getMonitoringObject";
            } else {
              search_deviceType = "/recordEnterprise/getDeviceByMonitoringObject";
            }
            api
              .post(api.forent_url.maintenance_service_url + search_deviceType, {
                unitId: _this.rowData.unitId,
                deviceId: _this.addUnit
              })
              .then(res => {
                if (res && res["code"] == "success") {
                  let data = res["data"] || "";
                  let html_addUnit = "";
                  for (let i = 0; i < data.length; i++) {
                    html_addUnit += "<li>监测装置" + (i + 1) + "</li>";
                  }
                  $("#add_deviceUnit").html(html_addUnit);
                  $("#add_deviceUnit li:first").addClass("add-unit-active");
                  //默认第一个设施信息
                  let data_click;
                  if (data[0]) {
                    data_click = data[0];
                  } else {
                    data_click = data;
                  }
                  $("#add_deviceTitle").html(data_click.deviceTypeName);
                  $("#add_onlineState").html(
                    data_click.onlineState === "0" ? "离线" : "在线"
                  );
                  if (data_click.onlineState === "0") {
                    $("#add_onlineState")
                      .parent()
                      .removeClass("gg-online-item")
                      .addClass("gg-outline-item");
                  }
                  $("#add_deviceTitle1").html(
                    data_click.buildName +
                      data_click.floorName +
                      data_click.deviceAddress
                  );
                  $("#add_deviceTitle1").attr("title",data_click.buildName + data_click.floorName +data_click.deviceAddress);
                  $("#add_deviceId").html(data_click.deviceId);
                  $("#add_deviceBrand").html(
                    data_click.brand + data_click.model
                  );
                  $("#add_controlHost").html(data_click.controlHost);
                  $("#add_deviceAccident").html(data_click.measurement);
                  //默认第一个异常记录
                  _this.addAbnormal(_this.addUnit, _this.rowData.unitId);
                  //实时读数
                  $("#curData").html("");
                  _this.deviceCur(_this.addUnit, _this.rowData.unitId);
                  //监测曲线
                  $("#deviceMa").html("");
                  _this.devicemA(
                    _this.addUnit,
                    _this.rowData.unitId,
                    deviceTypeId,
                    "7",
                    "1",
                    data_click.runState
                  );
                  $("#add_deviceUnit li").click(function() {
                    $("#add_deviceUnit li").removeClass("add-unit-active");
                    $(this).addClass("add-unit-active");
                    //设施信息
                    let data_click1 = data[$(this).index()];
                    $("#add_deviceTitle").html(data_click1.deviceTypeName);
                    $("#add_onlineState").html(
                      data_click1.onlineState === "0" ? "离线" : "在线"
                    );
                    if (data_click1.onlineState === "0") {
                      $("#add_onlineState")
                        .parent()
                        .removeClass("gg-online-item")
                        .addClass("gg-outline-item");
                    }
                    $("#add_deviceTitle1").html(
                      data_click1.buildName +
                        data_click1.floorName +
                        data_click1.deviceAddress
                    );
                    $("#add_deviceTitle1").attr("title",data_click1.buildName + data_click1.floorName +data_click1.deviceAddress);
                    $("#add_deviceId").html(data_click1.deviceId);
                    $("#add_deviceBrand").html(
                      data_click1.brand + data_click1.model
                    );
                    $("#add_controlHost").html(data_click1.controlHost);
                    //异常记录
                    _this.addAbnormal(_this.addUnit, _this.rowData.unitId);
                    //实时读数
                    _this.deviceCur(_this.addUnit, _this.rowData.unitId);
                    //监测曲线
                    _this.devicemA(
                      _this.addUnit,
                      _this.rowData.unitId,
                      deviceTypeId,
                      "7",
                      "1",
                      data_click1.runState
                    );
                  });
                } else {
                  Message.error("获取设备失败!");
                }
              });
          }
        });
        //电流与温度
        var gg_ele_btn = $('.gg-ele-btn');
        var gg_tem_btn = $('.gg-tem-btn');
        var gg_liu_btn = $('.gg-liu-btn');
        var gg_ya_btn = $('.gg-ya-btn');
        gg_ele_btn.click(function () {
            $(this).css('color','#3c8dbc');
            $(this).css('borderBottom','2px solid #3c8dbc');
            $(this).siblings().css('color','#a5a5a5');
            $(this).siblings().css('borderBottom','0');
            $('.gg-chart-tem').hide();
            $('.gg-chart-liu').hide();
            $('.gg-chart-ya').hide();
            $('.gg-chart-ele').show();
        });
        gg_tem_btn.click(function () {
            $(this).css('color','#3c8dbc');
            $(this).css('borderBottom','2px solid #3c8dbc');
            $(this).siblings().css('color','#a5a5a5');
            $(this).siblings().css('borderBottom','0');
            $('.gg-chart-ele').hide();
            $('.gg-chart-liu').hide();
            $('.gg-chart-ya').hide();
            $('.gg-chart-tem').show();
        });
        gg_liu_btn.click(function () {
            $(this).css('color','#3c8dbc');
            $(this).css('borderBottom','2px solid #3c8dbc');
            $(this).siblings().css('color','#a5a5a5');
            $(this).siblings().css('borderBottom','0');
            $('.gg-chart-ele').hide();
            $('.gg-chart-liu').show();
            $('.gg-chart-ya').hide();
            $('.gg-chart-tem').hide();
        });
        gg_ya_btn.click(function () {
            $(this).css('color','#3c8dbc');
            $(this).css('borderBottom','2px solid #3c8dbc');
            $(this).siblings().css('color','#a5a5a5');
            $(this).siblings().css('borderBottom','0');
            $('.gg-chart-ele').hide();
            $('.gg-chart-liu').hide();
            $('.gg-chart-ya').show();
            $('.gg-chart-tem').hide();
        });
        capuse_time.click(function () {
            capuse_time.removeClass("is-active");
            $(this).addClass("is-active");
            //查询24小时内 还是 一周内的
            var value = $(this).attr("id");
            //加载设备基本信息
            _this.deviceInfo(_this.addUnit,  _this.rowData.unitId,deviceTypeId);
            //加载异常记录列表  查询前四条 传递0  传递1时查询最近一条 作为实时数据
            //deviceAccidentInfo(deviceId,unitId,value);
            //加载电流 线缆温度echarts
            _this.devicemA(_this.addUnit, _this.rowData.unitId, deviceTypeId, value, build_class,data["runState"]);
        });
      });
    },
    //物联网装置弹出设备
    iotFacility(deviceTypeId) {
      let tooltipTemplate =
        '<div class="floor-main-wrap gg-prtrol-pos"><div class="gg-structure"><!--装置 面板-->';
      tooltipTemplate +=
        '<div class="gg-warnNum-dialog gg-prober-pos gg-warnNum-long-dialog">';
      tooltipTemplate +=
        '<div class="gg-prober-header clearfix"><div class="gg-prober-header--info">' +
        '<span class="gg-prober-h5" id="deviceTitle"></span><a class="gg-online-item"><span id="onlineState"></span></a>' +
        '<a class="gg-prober-location"><span id="deviceTitle1" title=""></span></a></div></div>';
      tooltipTemplate +=
        '<div class="gg-prober-body">' +
        '<div class="gg-prober-content">' +
        '<div class="gg-switch-content">';
      //设备类型电气火灾监控装置 显示 实时电流电温
      //设备类型 室内水压监测装置  室外水压加测装置 显示实时水压

      let tooltipTemplate_capsule = "";
      let tooltipTemplate_unit = "";
      switch (deviceTypeId) {
        //消火栓
        case "19020000": //室内消火栓水压监测装置  室外
        case "19030000": //室外消火栓水压监测装置  室内
        case "19080000": //喷淋末端自动试水装置   末端
          tooltipTemplate +=
            '<div class="gg-prober-group"><a class="gg-normal-item"><span id="currentMpa"></span>MPa</a></div>';
          tooltipTemplate_capsule =
            '<a class="gg-btn-capsule is-active" name="mpa">水压曲线</a>';
          tooltipTemplate_unit =
            '<div class="gg-prober-unit"><!--水压 折线图--><div class="gg-probe-chart" id="deviceWater"></div></div>';
          break;
        //配电箱
        case "19050000": //电气火灾监控装置
          tooltipTemplate +=
            '<div class="gg-prober-group"><a class="gg-normal-item"><span id="currentState"></span></a></div>';
          tooltipTemplate_capsule =
            '<a class="gg-btn-capsule is-active">实时读数</a>' +
            '<a class="gg-btn-capsule" name="ma">监测曲线</a>';
          tooltipTemplate_unit =
            '<div class="gg-prober-unit">' +
            '<div class="gg-prober-unit__table">' +
            '<table><thead><th width="50%">对象</th><th width="50%">实时值</th></thead></table></div>' +
            '<div class="gg-scroll-tbody scroll-normal"><table><tbody id="curData"></tbody></table></div></div>' +
            '<div class="gg-prober-unit">' +
            '<div class="gg-probe-chart">' +
            '<div class="gg-probe-chart__btn">' +
            '<a class="gg-ele-btn">剩余电流</a>' +
            '<a class="gg-tem-btn">线缆温度</a>' +
            '<a class="gg-liu-btn">相电流</a>' +
            '<a class="gg-ya-btn">相电压</a>' +
            '</div><!--剩余电流 折线图--><div class="gg-chart-ele" id="deviceMa"></div>' +
            '<div class="gg-chart-tem" id="deviceTem"></div><div class="gg-chart-liu" id="deviceLiu"></div><div class="gg-chart-ya" id="deviceYa"></div></div></div>';
          break;
        //水箱
        case "19150000": //水位传感器  消防水池水箱
        case "19180000": //消防泵启停监测装置  消防泵
          tooltipTemplate +=
            '<div class="gg-prober-group"><a class="gg-normal-item"><span id="currentM"></span>m</a></div>';
          tooltipTemplate_capsule =
            '<a class="gg-btn-capsule is-active" name="m">水位曲线</a>';
          tooltipTemplate_unit =
            '<div class="gg-prober-unit"><!--水位 折线图--><div class="gg-probe-chart" id="deviceWaterLevel"></div></div>';
          break;
      }

      //面板胶囊按钮
      tooltipTemplate +=
        '<div class="gg-btn-capsuleGroup gg-btn-capsuleInline gg-prober-capsule">' +
        tooltipTemplate_capsule;

      tooltipTemplate +=
        '<a class="gg-btn-capsule">设施信息</a>' +
        '<a class="gg-btn-capsule" name="accidRecord">异常记录</a></div>';

      tooltipTemplate +=
        '<div class="gg-capuse-time" >' +
        '<a class="gg-capuse-time--item is-active" id="7">近一周</a>' +
        '<a class="gg-capuse-time--item"  id="24">24小时</a></div></div>';

      tooltipTemplate += '<div class="gg-prober-model">' + tooltipTemplate_unit;

      tooltipTemplate +=
        '<div class="gg-prober-unit "><!--设施信息 列表-->\n' +
        '<div class="gg-prober-device-list">';

      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell">主机回路点位：</span>' +
        '<span class="gg-probe-cell"><a class="gg-probe-unit-item" id="loop"></a></span></div>' +
        '<div class="gg-prober-device"><span class="gg-probe-cell" >设备ID：</span><span class="gg-probe-cell" id="deviceId"></span></div>';

      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >设施品牌：</span>' +
        '<span class="gg-probe-cell" ><a class="gg-probe-unit-item" id="deviceBrand"></a></span></div>';

      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >ID/SN/序列号：</span>' +
        '<span class="gg-probe-cell" id="controlHost"></span></div></div></div>';

      tooltipTemplate +=
        '<div class="gg-prober-unit"><!--异常记录 列表-->' +
        '<ul class="gg-probe-list" id="deviceAccident"></ul></div>';

      tooltipTemplate += "</div></div></div></div>";

      tooltipTemplate +=
        '<div class="toggle-warnNum-dialog">消防设施<span class="maintenance-back2"></span></div>';

      //装置拼接
      tooltipTemplate +=
        '<div class="gg-warnNum-long-dialog add-prober-pos add-warnNum-dialog">' +
        '<ul id="add_deviceUnit" class="add_deviceUnit"></ul>' +
        '<div class="add-prober-header">' +
        '<div class="gg-prober-header--info"><span class="gg-prober-h5" id="add_deviceTitle">暂无设备</span>' +
        '<a class="gg-online-item"><span id="add_onlineState"></span></a>' +
        '<a class="gg-prober-location"><span id="add_deviceTitle1" title="" class="add-device-info">找不到设备</span></a></div></div>' +
        '<div class="add-prober-body">' +
        '<div class="gg-prober-content">' +
        '<div class="gg-switch-content">' +
        '<div class="gg-btn-capsuleGroup gg-btn-capsuleInline gg-prober-capsule">' +
        '<a class="add-btn-capsule add-is-active">设施信息</a>' +
        '<a class="add-btn-capsule" name="accidRecord">异常记录</a></div>' +
        '<div class="gg-capuse-time"></div></div>' +
        '<div class="gg-prober-model">' +
        '<div class="add-prober-unit" style="display: block;"><!--设施信息 列表-->' +
        '<div class="gg-prober-device-list">' +
        '<div class="gg-prober-device"><span class="gg-probe-cell">设备ID：</span><span class="gg-probe-cell add-device-info" id="add_deviceId"></span></div>' +
        '<div class="gg-prober-device"><span class="gg-probe-cell">设施品牌：</span><span class="gg-probe-cell add-device-info" id="add_deviceBrand"></span></div>' +
        '<div class="gg-prober-device"><span class="gg-probe-cell">ID/SN/序列号：</span><span class="gg-probe-cell add-device-info" id="add_controlHost"></span></div>' +
        "</div></div>" +
        '<div class="add-prober-unit"><!--异常记录 列表--><ul class="gg-probe-list" id="add_deviceAccident"></ul></div></div></div></div>' +
        "</div></div>" +
        "</div>";
      return tooltipTemplate;
    },
    //物联网 监测装置 异常记录
    addAbnormal() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getAlarmAccidentTime";
      let params = {
        unitId: this.rowData.unitId,
        deviceId: this.addUnit
      };
      api.post(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let receivedate = res.data;
          if (receivedate != null && receivedate != "") {
            let getMonitorNotesUrl =
              api.forent_url.maintenance_service_url + "/recordEnterprise/getMonitorNotes";
            let getMonitorNotesParams = {
              unitId: this.rowData.unitId,
              deviceId: this.addUnit,
              date: receivedate
            };
            api.get(getMonitorNotesUrl, getMonitorNotesParams).then(res1 => {
              if (res1 && res1["code"] == "success") {
                let data = res1["data"] || "";
                let html = "",
                  describe = "";
                if (data && data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    describe = data[i].faultDescribe;
                    describe =
                      describe.length > 10
                        ? describe.substring(0, 10) + "..."
                        : describe;
                    html +=
                      '<li><a class="gg-probe-list--item" title=\'' +
                      data[i].faultDescribe +
                      '\'><span class="gg-probe-list--num">' +
                      (i + 1) +
                      "</span>" +
                      describe +
                      "</a>" +
                      '<a class="gg-probe-list--item"><span class="gg-probe-list--time">' +
                      data[i].createTime +
                      '<span class="gg-margin-l-20"></span></span></a></li>';
                  }
                } else {
                  html += "暂无数据";
                }
                $("#add_deviceAccident").html(html);
              } else {
                Message.error("获取监测装置异常记录数据!");
              }
            });
          } else {
            $("#add_deviceAccident").html("暂无数据");
          }
        } else {
          Message.error("获取监测装置异常记录!");
        }
      });
    },
    //烟感
    smokeHtml() {
      let tooltipTemplate =
        '<div class="floor-main-wrap gg-prtrol-pos">' +
        '<div class="gg-structure">' +
        "<!--烟感 面板-->";
      tooltipTemplate +=
        '<div class="gg-warnNum-dialog gg-prober-pos gg-warnNum-short-dialog">';

      tooltipTemplate +=
        '<div class="gg-prober-header clearfix">' +
        '<div class="gg-prober-header--info">' +
        '<span class="gg-prober-h5" id="deviceTitle"></span><a class="gg-online-item"><span id="onlineState"></span></a>' +
        '<a class="gg-prober-location"><span id="deviceTitle1" title=""></span></a>' +
        "</div>";

      tooltipTemplate +=
        '<div class="gg-prober-group">' +
        '<a class="gg-normal-item"><span id="currentState">正常</span></a>' +
        "</div>";
      tooltipTemplate +=
        "</div>" +
        '<div class="gg-prober-body">' +
        '<div class="gg-prober-content">' +
        '<div class="gg-switch-content">' +
        '<div class="gg-btn-capsuleGroup gg-btn-capsuleInline gg-prober-capsule">';

      tooltipTemplate +=
        '<a class="gg-btn-capsule is-active" name="info">设施信息</a>' +
        '<a class="gg-btn-capsule" name="accidRecord">异常记录</a>' +
        "</div>";
      tooltipTemplate += "</div>" + '<div class="gg-prober-model">';

      tooltipTemplate +=
        '<div class="gg-prober-unit ">' +
        "<!--设施信息 列表-->" +
        '<div class="gg-prober-device-list">';
      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >设备ID：</span>' +
        '<span class="gg-probe-cell" id="deviceId"></span>' +
        "</div>";

      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >设施品牌：</span>' +
        '<span class="gg-probe-cell" id="deviceBrand"></span>' +
        "</div>";
      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >型号：</span>' +
        '<span class="gg-probe-cell" id="deviceInfo"></span>' +
        "</div>";
      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >模组：</span>' +
        '<span class="gg-probe-cell" id="deviceModule"></span>' +
        "</div>";
      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >NB卡号：</span>' +
        '<span class="gg-probe-cell" id="deviceNB"></span>' +
        "</div>";
      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >安装日期：</span>' +
        '<span class="gg-probe-cell" id="installDate"></span>' +
        "</div>";

      tooltipTemplate += "</div>" + "</div>";
      tooltipTemplate +=
        '<div class="gg-prober-unit">' +
        "<!--异常记录 列表-->" +
        '<ul class="gg-probe-list" id="deviceAccident">' +
        "</ul>" +
        "</div>";

      tooltipTemplate +=
        "</div>" + "</div>" + "</div>" + "</div>" + "</div>" + "</div>";
      return tooltipTemplate;
    },
    //物联网设备弹出装置
    iotDevice(deviceTypeId) {
      let tooltipTemplate =
        '<div class="floor-main-wrap gg-prtrol-pos"><div class="gg-structure">';

      tooltipTemplate +=
        '<div class="gg-warnNum-dialog gg-prober-pos gg-warnNum-long-dialog">';

      tooltipTemplate +=
        '<div class="gg-prober-header clearfix"><div class="gg-prober-header--info">' +
        '<span class="gg-prober-h5" id="deviceTitle"></span><a class="gg-online-item"><span id="onlineState"></span></a>' +
        '<a class="gg-prober-location"><span id="deviceTitle1" title=""></span></a></div></div>';

      tooltipTemplate +=
        '<div class="gg-prober-body">' +
        '<div class="gg-prober-content">' +
        '<div class="gg-switch-content">';

      tooltipTemplate +=
        '<div class="gg-btn-capsuleGroup gg-btn-capsuleInline gg-prober-capsule"><a class="gg-btn-capsule is-active">设施信息</a>' +
        '<a class="gg-btn-capsule" name="accidRecord">异常记录</a></div>';

      tooltipTemplate += '<div class="gg-prober-model">';

      tooltipTemplate +=
        '<div class="gg-prober-unit"><!--设施信息 列表--><div class="gg-prober-device-list">';

      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell">主机回路点位：</span>' +
        '<span class="gg-probe-cell"><a class="gg-probe-unit-item" id="loop"></a></span></div>' +
        '<div class="gg-prober-device"><span class="gg-probe-cell" >设备ID：</span><span class="gg-probe-cell" id="deviceId"></span></div>';

      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >设施品牌：</span>' +
        '<span class="gg-probe-cell" ><a class="gg-probe-unit-item" id="deviceBrand"></a></span></div>';

      tooltipTemplate +=
        '<div class="gg-prober-device">' +
        '<span class="gg-probe-cell" >ID/SN/序列号：</span>' +
        '<span class="gg-probe-cell" id="controlHost"></span></div></div></div>';

      tooltipTemplate +=
        '<div class="gg-prober-unit"><!--异常记录 列表-->' +
        '<ul class="gg-probe-list" id="deviceAccident"></ul></div></div></div>';

      tooltipTemplate += "</div></div></div></div>";

      tooltipTemplate +=
        '<div class="toggle-warnNum-dialog">监测装置<span class="maintenance-back2"></span></div>';

      tooltipTemplate +=
        '<div class="gg-warnNum-long-dialog add-prober-pos add-warnNum-dialog">' +
        '<ul id="add_deviceUnit" class="add_deviceUnit"></ul>' +
        '<div class="add-prober-header">' +
        '<div class="gg-prober-header--info"><span class="gg-prober-h5" id="add_deviceTitle">暂无装置</span>' +
        '<a class="gg-online-item"><span id="add_onlineState"></span></a>' +
        '<a class="gg-prober-location"><span id="add_deviceTitle1" title="" class="add-device-info">找不到装置</span></a></div></div>' +
        '<div class="add-prober-body">' +
        '<div class="gg-prober-content">' +
        '<div class="gg-switch-content">';

      let tooltipTemplate_capsule = "";
      let tooltipTemplate_unit = "";
      switch (deviceTypeId) {
        //消火栓
        case SpecialDeviceType.fireHydrant_indoor:
        case SpecialDeviceType.fireHydrant_outUp:
        case SpecialDeviceType.fireHydrant_outDown:
          tooltipTemplate +=
            '<div class="gg-prober-group"><a class="gg-normal-item"><span id="currentMpa"></span>MPa</a></div>';
          tooltipTemplate_capsule =
            '<a class="add-btn-capsule add-is-active" name="mpa">水压曲线</a>';
          tooltipTemplate_unit =
            '<div class="add-prober-unit" style="display: block;"><!--水压 折线图--><div class="gg-probe-chart" id="deviceWater"></div></div>';
          break;
        //电气火灾
        case SpecialDeviceType.distributeBox:
          tooltipTemplate +=
            '<div class="gg-prober-group"><a class="gg-normal-item"><span id="currentState"></span></a></div>';
          tooltipTemplate_capsule =
            '<a class="add-btn-capsule add-is-active">实时读数</a>' +
            '<a class="add-btn-capsule " name="ma">监测曲线</a>';
          tooltipTemplate_unit =
            '<div class="add-prober-unit" style="display: block;">' +
            '<div class="gg-prober-unit__table">' +
            '<table><thead><th width="50%">对象</th><th width="50%">实时值</th></thead></table></div>' +
            '<div class="gg-scroll-tbody scroll-normal"><table><tbody id="curData"></tbody></table></div></div>' +
            '<div class="add-prober-unit">' +
            '<div class="gg-probe-chart">' +
            '<div class="gg-probe-chart__btn">' +
            '<a class="gg-ele-btn">剩余电流</a>' +
            '<a class="gg-tem-btn">线缆温度</a>' +
            '<a class="gg-liu-btn">相电流</a>' +
            '<a class="gg-ya-btn">相电压</a>' +
            '</div><!--剩余电流 折线图--><div class="gg-chart-ele" id="deviceMa"></div>' +
            '<div class="gg-chart-tem" id="deviceTem"></div><div class="gg-chart-liu" id="deviceLiu"></div><div class="gg-chart-ya" id="deviceYa"></div></div></div>';
          break;
        //水箱
        case SpecialDeviceType.fireWaterTank:
        case SpecialDeviceType.fireWaterPool:
        case SpecialDeviceType.fireWaterPump:
        case SpecialDeviceType.fireHydrant_end:
          tooltipTemplate +=
            '<div class="gg-prober-group"><a class="gg-normal-item"><span id="currentM"></span>m</a></div>';
          tooltipTemplate_capsule =
            '<a class="add-btn-capsule add-is-active" name="m">水位曲线</a>';
          tooltipTemplate_unit =
            '<div class="add-prober-unit" style="display: block;"><!--水位 折线图--><div class="gg-probe-chart" id="deviceWaterLevel"></div></div>';
          break;
      }

      tooltipTemplate +=
        '<div class="gg-btn-capsuleGroup gg-btn-capsuleInline gg-prober-capsule">' +
        tooltipTemplate_capsule;

      tooltipTemplate +=
        '<a class="add-btn-capsule">设施信息</a>' +
        '<a class="add-btn-capsule" name="accidRecord">异常记录</a></div>' +
        '<div class="add-capuse-time">' +
        '<a class="gg-capuse-time--item is-active" id="7">近一周</a>' +
        '<a class="gg-capuse-time--item"  id="24">24小时</a></div></div>' +
        '<div class="gg-prober-model">' +
        tooltipTemplate_unit +
        '<div class="add-prober-unit"><!--设施信息 列表-->' +
        '<div class="gg-prober-device-list">' +
        '<div class="gg-prober-device"><span class="gg-probe-cell">设备ID：</span><span class="gg-probe-cell add-device-info" id="add_deviceId"></span></div>' +
        '<div class="gg-prober-device"><span class="gg-probe-cell">设施品牌：</span><span class="gg-probe-cell add-device-info" id="add_deviceBrand"></span></div>' +
        '<div class="gg-prober-device"><span class="gg-probe-cell">ID/SN/序列号：</span><span class="gg-probe-cell add-device-info" id="add_controlHost"></span></div>' +
        "</div></div>" +
        '<div class="add-prober-unit"><!--异常记录 列表--><ul class="gg-probe-list" id="add_deviceAccident"></ul></div></div></div></div>' +
        "</div></div>" +
        "</div>";

      return tooltipTemplate;
    },
    //其他设备
    fireOther(deviceTypeId) {
      let tooltipTemplate =
        '<div class="floor-main-wrap gg-prtrol-pos">\n' +
        '                <div class="gg-structure">\n' +
        "                        <!--电气火灾探测器 面板-->\n";
      tooltipTemplate +=
        '                        <div class="gg-warnNum-dialog gg-prober-pos gg-warnNum-short-dialog">\n';

      tooltipTemplate +=
        '                            <div class="gg-prober-header clearfix">\n' +
        '                                <div class="gg-prober-header--info">\n' +
        '                                    <span class="gg-prober-h5" id="deviceTitle"></span><a class="gg-online-item"><span id="onlineState"></span></a>\n' +
        '                                    <a class="gg-prober-location"><span id="deviceTitle1" title=""></span></a>\n' +
        "                                </div>";
      //设备类型电气火灾监控装置 显示 实时电流电温

      tooltipTemplate +=
        ' <div class="gg-prober-group">\n' +
        '                                    <a class="gg-normal-item"><span id="currentState">正常</span></a>\n' +
        "                                </div>";
      tooltipTemplate +=
        "</div>\n" +
        '                            <div class="gg-prober-body">\n' +
        '                                <div class="gg-prober-content">\n' +
        '                                    <div class="gg-switch-content">\n' +
        '                                        <div class="gg-btn-capsuleGroup gg-btn-capsuleInline gg-prober-capsule">';

      tooltipTemplate +=
        '<a class="gg-btn-capsule is-active" name="info">设施信息</a>';
      if (deviceTypeId != SpecialDeviceType.fireDoor) {
        tooltipTemplate +=
          ' <a class="gg-btn-capsule" name="accidRecord">异常记录</a>';
      }
      tooltipTemplate += "                                        </div>";
      tooltipTemplate +=
        "                                    </div>\n" +
        '                                    <div class="gg-prober-model">';

      tooltipTemplate +=
        '                                        <div class="gg-prober-unit ">\n' +
        "                                            <!--设施信息 列表-->\n" +
        '                                            <div class="gg-prober-device-list">';
      tooltipTemplate +=
        '                                                <div class="gg-prober-device">\n' +
        '                                                    <span class="gg-probe-cell">主机回路点位：</span>\n' +
        '                                                    <span class="gg-probe-cell">\n' +
        '                                                        <a class="gg-probe-unit-item" id="loop"></a>\n' +
        "                                                    </span>\n" +
        "                                                </div>\n" +
        // '                                                <div class="gg-prober-device">\n' +
        // '                                                </div>
        '                                                <div class="gg-prober-device">\n' +
        '                                                    <span class="gg-probe-cell" >设备ID：</span>\n' +
        '                                                    <span class="gg-probe-cell" id="deviceId"></span>\n' +
        "                                                </div>";
      /* }*/
      tooltipTemplate +=
        '                                                <div class="gg-prober-device">\n' +
        '                                                    <span class="gg-probe-cell" >设施品牌：</span>\n' +
        '                                                    <span class="gg-probe-cell" >\n' +
        '                                                       <a class="gg-probe-unit-item" id="deviceBrand"></a>\n' +
        "                                               </span>\n" +
        "                                                </div>";
      tooltipTemplate += "</div>" + "</div>";
      tooltipTemplate +=
        '                                        <div class="gg-prober-unit">\n' +
        "                                            <!--异常记录 列表-->\n" +
        '                                            <ul class="gg-probe-list" id="deviceAccident">\n' +
        "                                            </ul>\n" +
        "                                        </div>";

      tooltipTemplate +=
        "                              </div>\n" +
        "                                </div>\n" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                </div>\n" +
        "            </div>";
      return tooltipTemplate;
    },
    //设备的故障列表
    deviceAccidentInfo(deviceId, unitId) {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getAlarmAccidentTime";
      let params = {
        deviceId: deviceId,
        unitId: unitId
      };
      api.post(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let receivedate = res["data"] || "";
          if (receivedate) {
            let getMonitorNotesUrl =
              api.forent_url.maintenance_service_url + "/recordEnterprise/getMonitorNotes";
            let getMonitorNotesParams = {
              unitId: unitId,
              deviceId: deviceId,
              date: receivedate
            };
            api.get(getMonitorNotesUrl, getMonitorNotesParams).then(res1 => {
              if (res1 && res1["code"] == "success") {
                let data = res1["data"] || "";
                let html = "",
                  describe = "";
                if (data && data.length > 0) {
                  for (let i = 0; i < data.length; i++) {
                    describe = data[i].faultDescribe;
                    describe =
                      describe.length > 10
                        ? describe.substring(0, 10) + "..."
                        : describe;
                    html +=
                      '<li><a class="gg-probe-list--item" title=\'' +
                      data[i].faultDescribe +
                      '\'><span class="gg-probe-list--num">' +
                      (i + 1) +
                      "</span>" +
                      describe +
                      "</a>" +
                      '<a class="gg-probe-list--item"><span class="gg-probe-list--time">' +
                      data[i].createTime +
                      '<span class="gg-margin-l-20"></span></span></a></li>';
                  }
                } else {
                  html += "暂无数据";
                }
                $("#deviceAccident").html(html);
              } else {
                Message.error("获取监测装置异常记录数据!");
              }
            });
          } else {
            $("#deviceAccident").html("暂无数据");
          }
        } else {
          Message.error("查询设备故障列表失败!");
        }
      });
    },
    //查询楼栋的建筑类型
    getBuildClass(buildId) {
      const _this = this;
      return new Promise(function(re, ro) {
        let serviceUrl =
          api.forent_url.maintenance_service_url +
          "/recordEnterprise/getBuildClassByUnitIdBuildId";
        let params = {
          buildId: buildId,
          unitId: _this.rowData.unitId
        };
        api.get(serviceUrl, params).then(res => {
          let data = res.date;
          re(data);
        });
      });
    },
    //查询设备的基本信息
    deviceInfo(deviceId, unitId, deviceTypeId) {
      let serviceUrl = api.forent_url.maintenance_service_url + "/recordEnterprise/getMoniterDevice";
      let params = {
        unitId: unitId,
        deviceId: deviceId
      };
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"];
          if (data != null) {
            let brand = data.brand == null ? "" : data.brand; //品牌
            let model = data.model == null ? "" : data.model; //型号
            let vender =
              data.vender == null || data.vender == "null" ? "" : data.vender; //厂商
            let deviceTypeName =
              data.deviceTypeName == null ? "" : data.deviceTypeName;
            let deviceId = data.deviceId == null ? "" : data.deviceId;
            this.addUnit = deviceId;
            this.monitoringObject = data.monitoringObject;
            let buildName = data.buildName == null ? "" : data.buildName; //楼栋名称
            let floorName = data.floorName == null ? "" : data.floorName; //楼层名称
            let deviceAddress =
              data.deviceAddress == null ? "" : data.deviceAddress; //具体地址
            let laLoop = data.laLoop == null ? "" : data.laLoop; //回路
            let laPoint = data.laPoint == null ? "" : data.laPoint; //点位
            let controlHost = data.controlHost == null ? "" : data.controlHost; //ID/SN/序列号
            let cardNo = data.cardno == null ? "" : data.cardno; //nb卡号
            let moduleArr = data.module == null ? "" : data.module; //模组
            let installDate = data.installDate == null ? "" : data.installDate; //安装日期
            let onlineState =
              data.onlineState == null
                ? ""
                : data.onlineState == ""
                ? ""
                : data.onlineState == "1"
                ? "在线"
                : "离线"; //设备是否在线 1 在线 0  离线
            let deviceTypeId = data.deviceTypeId; //设备类型id
            $("#deviceId").html(deviceId);
            $("#deviceBrand").html(brand + model);
            $("#deviceTypeName").html(deviceTypeName + deviceId);
            $("#deviceInfo").html(vender + brand + model);
            $("#controlHost").html(controlHost);
            $("#deviceTitle").html(deviceTypeName);
            $("#deviceModule").html(moduleArr);
            $("#deviceNB").html(cardNo);
            $("#installDate").html(installDate);
            let title1 = buildName + floorName + deviceAddress;
            $("#deviceTitle1").attr("title",title1);
            $("#deviceTitle1").html(title1);
            if (
              deviceTypeId == "19010000" ||
              deviceTypeId == "19020000" ||
              deviceTypeId == "19030000" ||
              deviceTypeId == "19210000" ||
              deviceTypeId == "19080000" ||
              deviceTypeId == "19150000" ||
              deviceTypeId == SpecialDeviceType.fireDoor
            ) {
              if (onlineState == "离线") {
                $("#onlineState")
                  .parent()
                  .removeClass("gg-online-item")
                  .addClass("gg-outline-item");
              }
              $("#onlineState").html(onlineState); //设备在线状态
            }
            $("#loop").html(
              data.laMake +
                "-" +
                (laLoop == null ? "" : laLoop) +
                "-" +
                (laPoint == null ? "" : laPoint)
            );
          }
        } else {
          Message.error("查询设备基本信息失败!");
        }
      });
    },
    //加载线缆温度数据 echarts 图
    devicemA(deviceId, unitId, deviceTypeId, value, build_class, runState) {
      //先查询 当前设备 最新的报警 或者隐患 获取时间 用于查询 异常记录（监测中心数据量大，用时间限制查询范围）
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getMonitorNotesByTime";
      let params = {
        unitId: unitId,
        deviceId: deviceId,
        flag: value
      };
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res["data"] || "";
          //当前水压-当前水位-电池电压
          let currentMpa = 0,
            currentM = 0,
            currentV = "";
          if (data) {
            if (data.yValue != null && data.yValue.length > 0) {
              currentMpa = data.yValue[data.yValue.length - 1];
            }
            if (data.batteryValue != null && data.batteryValue.length > 0) {
              currentV = data.batteryValue[data.batteryValue.length - 1];
            }
            if (
              data.waterLevelValue != null &&
              data.waterLevelValue.length > 0
            ) {
              currentM = data.waterLevelValue[data.waterLevelValue.length - 1];
            }
          }
          if (
            deviceTypeId == SpecialDeviceType.insideCode ||
            deviceTypeId == SpecialDeviceType.outsideCode ||
            deviceTypeId == SpecialDeviceType.sprayEndCode ||
            deviceTypeId == SpecialDeviceType.fireHydrant_indoor ||
            deviceTypeId == SpecialDeviceType.fireHydrant_outUp ||
            deviceTypeId == SpecialDeviceType.fireHydrant_outDown
          ) {
            if (runState == "0") {
              //正常
            } else if (runState == "1") {
              //报警
              $("#currentMpa")
                .parent()
                .removeClass("gg-normal-item")
                .addClass("gg-alarm-item");
            } else if (runState == "2") {
              //故障
              $("#currentMpa")
                .parent()
                .removeClass("gg-normal-item")
                .addClass("gg-prober-item");
            }
          }

          if (
            deviceTypeId == SpecialDeviceType.waterLevel ||
            deviceTypeId == SpecialDeviceType.waterPump ||
            deviceTypeId == SpecialDeviceType.fireHydrant_indoor ||
            deviceTypeId == SpecialDeviceType.fireHydrant_outUp ||
            deviceTypeId == SpecialDeviceType.fireHydrant_outDown
          ) {
            if (runState == "0") {
              //正常
            } else if (runState == "1") {
              //报警
              $("#currentM")
                .parent()
                .removeClass("gg-normal-item")
                .addClass("gg-alarm-item");
            } else if (runState == "2") {
              //故障
              $("#currentM")
                .parent()
                .removeClass("gg-normal-item")
                .addClass("gg-prober-item");
            }
          }
          //当前的电流 温度  水压值回显
          $("#currentMpa").html(currentMpa == null ? 0 : currentMpa);
          $("#powersupplyVoltage").html(currentV == null ? "" : currentV);
          $("#currentM").html(currentM == null ? "" : currentM);
          let zheXianContent = {
            containerId: "deviceTem",
            option: {
              title: {
                text: ""
              },
              tooltip: {
                trigger: "axis",
                formatter: function(params) {
                  let relVal = params[0].name;
                  for (let i = 0, l = params.length; i < l; i++) {
                    relVal +=
                      "<br/>" +
                      params[i].seriesName +
                      " : " +
                      params[i].value +
                      "℃";
                  }
                  return relVal;
                },
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985"
                  }
                }
              },
              legend: {
                data: ["A相温度", "B相温度", "C相温度", "N相温度"]
              },
              toolbox: {},
              grid: {
                top:"20%",
                left: "4%",
                right: "4%",
                bottom: "1%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.xValue.map(function(str) {
                    return str.replace(" ", "\n");
                  })
                }
              ],
              yAxis: [
                {
                  type: "value",
                  axisLine: {
                    show: false
                  },
                  axisTick: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: "A相温度",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.yaValue
                  data: [2,9,11,5],
                },
                {
                  name: "B相温度",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.ybValue
                  data: [2,9,11,5],
                },
                {
                  name: "C相温度",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.ycValue
                  data: [2,9,11,5],
                },
                {
                  name: "N相温度",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.ydValue
                  data: [2,9,11,5],
                }
              ]
            }
          };
          let mAContent = {
            containerId: "deviceMa",
            option: {
              title: {
                text: ""
              },
              tooltip: {
                trigger: "axis",
                formatter: function(params) {
                  let relVal = params[0].name;
                  for (let i = 0, l = params.length; i < l; i++) {
                    relVal +=
                      "<br/>" +
                      params[i].seriesName +
                      " : " +
                      params[i].value +
                      "mA";
                  }
                  return relVal;
                },
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985"
                  }
                }
              },
              legend: {
                data: ["剩余电流"]
              },
              toolbox: {},
              grid: {
                top:"20%",
                left: "4%",
                right: "4%",
                bottom: "1%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.xValue.map(function(str) {
                    return str.replace(" ", "\n");
                  })
                }
              ],
              yAxis: [
                {
                  type: "value",
                  axisLine: {
                    show: false
                  },
                  axisTick: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: "剩余电流",
                  type: "line",
                  // data: data.ymaValue,
                  data: [2,9,11,5],
                  smooth: true,
                  itemStyle: { normal: { color: "#a8f8fd" } },
                  areaStyle: { normal: { color: "#add8f7" } },
                  lineStyle: { normal: { color: "#4baaee", width: 1 } }
                }
              ]
            }
          };
          let mpaContent = {
            containerId: "deviceWater",
            option: {
              title: {
                text: ""
              },
              color: ["#add8f7"],
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985"
                  }
                }
              },
              legend: {
                data: ["水压"]
              },
              grid: {
                top:"30%",
                left: "4%",
                right: "4%",
                bottom: "1%",
                containLabel: true
              },
              xAxis: [
                {
                  //name:'时/天',
                  nameLocation: "middle",
                  type: "category",
                  boundaryGap: false,
                  data: data.xValue,
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  }
                }
              ],
              yAxis: [
                {
                  name: " 单位/MPa",
                  nameLocation: "end",
                  type: "value",
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: "水压",
                  type: "line",
                  areaStyle: { normal: {} },
                  // data: data.yValue,
                  data: [2,9,11,5],
                  smooth: true,
                  lineStyle: {
                    normal: {
                      color: "#4baaee",
                      width: 1
                    }
                  }
                }
              ]
            }
          };
          let waterLevelContent = {
            containerId: "deviceWaterLevel",
            option: {
              title: {
                text: ""
              },
              color: ["#4baaee"],
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "black"
                  }
                }
              },
              legend: {
                data: ["水位"]
              },
              grid: {
                top:"20%",
                left: "4%",
                right: "4%",
                bottom: "1%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.xValue,
                  axisLine: {
                    show: false
                  }
                }
              ],
              yAxis: [
                {
                  name: " 单位/m",
                  type: "value",
                  axisLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: "水位",
                  smooth: true,
                  type: "line",
                  itemStyle: { normal: { color: "#a8f8fd" } },
                  areaStyle: { normal: { color: "#add8f7" } },
                  lineStyle: { normal: { color: "#4baaee", width: 1 } },
                  // data: data.waterLevelValue
                  data: [2,9,11,5],
                }
              ]
            }
          };
          //相电流
          let liuContent = {
            containerId: "deviceLiu",
            option: {
              title: {
                text: ""
              },
              tooltip: {
                trigger: "axis",
                formatter: function(params) {
                  let relVal = params[0].name;
                  for (let i = 0, l = params.length; i < l; i++) {
                    relVal +=
                      "<br/>" +
                      params[i].seriesName +
                      " : " +
                      params[i].value +
                      "A";
                  }
                  return relVal;
                },
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985"
                  }
                }
              },
              legend: {
                data: ["A相电流", "B相电流", "C相电流"]
              },
              toolbox: {},
              grid: {
                top:"20%",
                left: "4%",
                right: "4%",
                bottom: "1%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.xValue.map(function(str) {
                    return str.replace(" ", "\n");
                  })
                }
              ],
              yAxis: [
                {
                  type: "value",
                  axisLine: {
                    show: false
                  },
                  axisTick: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: "A相电流",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.yAma
                  data: [2,9,11,5],
                },
                {
                  name: "B相电流",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.yBma
                  data: [2,9,11,5],
                },
                {
                  name: "C相电流",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.yCma
                  data: [2,9,11,5],
                }
              ]
            }
          };
          let yaContent = {
            containerId: "deviceYa",
            option: {
              title: {
                text: ""
              },
              tooltip: {
                trigger: "axis",
                formatter: function(params) {
                  let relVal = params[0].name;
                  for (let i = 0, l = params.length; i < l; i++) {
                    relVal +=
                      "<br/>" +
                      params[i].seriesName +
                      " : " +
                      params[i].value +
                      "V";
                  }
                  return relVal;
                },
                axisPointer: {
                  type: "cross",
                  label: {
                    backgroundColor: "#6a7985"
                  }
                }
              },
              legend: {
                data: ["A相电压", "B相电压", "C相电压"]
              },
              toolbox: {},
              grid: {
                top:"20%",
                left: "4%",
                right: "4%",
                bottom: "1%",
                containLabel: true
              },
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  data: data.xValue.map(function(str) {
                    return str.replace(" ", "\n");
                  })
                }
              ],
              yAxis: [
                {
                  type: "value",
                  axisLine: {
                    show: false
                  },
                  axisTick: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: "A相电压",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.yAv
                  data: [2,9,11,5],
                },
                {
                  name: "B相电压",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.yBv
                  data: [2,9,11,5],
                },
                {
                  name: "C相电压",
                  type: "line",
                  smooth: true,
                  areaStyle: { normal: { width: 1 } },
                  // data: data.yCv
                  data: [2,9,11,5],
                }
              ]
            }
          };
          let zhexian_echart,
            mAContent_echart,
            liuContent_echart,
            yaContent_echart,
            mpaContent_echart,
            waterLevelContent_echart;
          if (
            deviceTypeId == SpecialDeviceType.fireMonitorCode ||
            deviceTypeId == SpecialDeviceType.distributeBox
          ) {
            //设备类型 电气火灾监控装置 显示电流曲线 电温曲线
            zhexian_echart = this.$echarts.init(
              document.getElementById(zheXianContent.containerId)
            );
            zhexian_echart.setOption(zheXianContent.option);
            mAContent_echart = this.$echarts.init(
              document.getElementById(mAContent.containerId)
            );
            mAContent_echart.setOption(mAContent.option);
            if (deviceTypeId == SpecialDeviceType.distributeBox) {
              liuContent_echart = this.$echarts.init(
                document.getElementById(liuContent.containerId)
              );
              liuContent_echart.setOption(liuContent.option);
              yaContent_echart = this.$echarts.init(
                document.getElementById(yaContent.containerId)
              );
              yaContent_echart.setOption(yaContent.option);
            }
          } else if (
            deviceTypeId == SpecialDeviceType.insideCode ||
            deviceTypeId == SpecialDeviceType.outsideCode ||
            deviceTypeId == SpecialDeviceType.sprayEndCode ||
            deviceTypeId == SpecialDeviceType.fireHydrant_indoor ||
            deviceTypeId == SpecialDeviceType.fireHydrant_outUp ||
            deviceTypeId == SpecialDeviceType.fireHydrant_outDown
          ) {
            //设备类型 室内水压监测装置  室外水压加测装置 显示水压曲线
            mpaContent_echart = this.$echarts.init(
              document.getElementById(mpaContent.containerId)
            );
            mpaContent_echart.setOption(mpaContent.option);
          } else if (
            deviceTypeId == SpecialDeviceType.waterLevel ||
            deviceTypeId == SpecialDeviceType.waterPump ||
            deviceTypeId == SpecialDeviceType.fireWaterPool ||
            deviceTypeId == SpecialDeviceType.fireWaterPump ||
            deviceTypeId == SpecialDeviceType.fireWaterTank ||
            deviceTypeId == SpecialDeviceType.fireHydrant_end
          ) {
            //水位
            waterLevelContent_echart = this.$echarts.init(
              document.getElementById(waterLevelContent.containerId)
            );
            waterLevelContent_echart.setOption(waterLevelContent.option);
          }
          $(window).resize(function() {
            if (
              deviceTypeId == SpecialDeviceType.fireMonitorCode ||
              deviceTypeId == SpecialDeviceType.distributeBox
            ) {
              zhexian_echart.resize();
              mAContent_echart.resize();
              if (deviceTypeId == SpecialDeviceType.distributeBox) {
                liuContent_echart.resize();
                yaContent_echart.resize();
              }
            } else if (
              deviceTypeId == SpecialDeviceType.insideCode ||
              deviceTypeId == SpecialDeviceType.outsideCode ||
              deviceTypeId == SpecialDeviceType.sprayEndCode ||
              deviceTypeId == SpecialDeviceType.fireHydrant_indoor ||
              deviceTypeId == SpecialDeviceType.fireHydrant_outUp ||
              deviceTypeId == SpecialDeviceType.fireHydrant_outDown
            ) {
              mpaContent_echart.resize();
            } else if (
              deviceTypeId == SpecialDeviceType.waterLevel ||
              deviceTypeId == SpecialDeviceType.waterPump ||
              deviceTypeId == SpecialDeviceType.fireWaterPool ||
              deviceTypeId == SpecialDeviceType.fireWaterPump ||
              deviceTypeId == SpecialDeviceType.fireWaterTank ||
              deviceTypeId == SpecialDeviceType.fireHydrant_end
            ) {
              waterLevelContent_echart.resize();
            }
          });
        } else {
          Message.error("查询温度数据失败!");
        }
      });
    },
    //实时读数
    deviceCur(deviceId, unitId) {
      let serviceUrl = api.forent_url.maintenance_service_url + "/recordEnterprise/getMeasurement";
      let params = {
        deviceId: deviceId,
        unitId: unitId
      };
      api.get(serviceUrl, params).then(res => {
        if (res && res["code"] == "success") {
          let data = res.data.json || "";
          if (data != null && data != "") {
            let html = "";
            data = JSON.parse(data);
            data.forEach(function(value, index, array) {
              if (value != null) {
                let flagName = value.flagName; //名称
                let measurement = value.measurement; //实时值
                let unit =
                  value.unit == null
                    ? ""
                    : value.unit == "undefined"
                    ? ""
                    : value.unit; //单位
                let flag = value.flag; //标识
                html +=
                  "<tr><td style='width: 50%'>" +
                  flagName +
                  "</td><td style='width: 50%'>" +
                  measurement +
                  unit +
                  "</td></tr>";
              }
            });
            $("#curData").html(html);
          }
        } else {
          Message.error("查询实时读数失败!");
        }
      });
    },
    //地图mousemove事件
    mouseMoveEvent() {
      document.getElementById(this.g2mapDiv).style.cursor = "pointer";
    },
    //监听底图视野改变
    resolutionchangedEvent(newResolution, oldResolution, level){
      if(this.userModel == 0){
        let level = this.g2map.getZoomLevel();
        if(level > 18){
          this.baiduvec.setVisible(false);
        }else{
          this.baiduvec.setVisible(true);
        }
      }
    },
    //地图初始化定位
    initMapLocation(data) {
      let polyline = new this.gs2.geom.Polyline({
        spatialReference: this.g2map.spatialReference
      });
      let path = new this.gs2.geom.Path({
        spatialReference: this.g2map.spatialReference
      });
      let startPoint = new this.gs2.geom.Point({
        x: data.maxx,
        y: data.maxy,
        spatialReference: this.gs2.geom.SpatialReference.EPSG3857
      });
      let endPoint = new this.gs2.geom.Point({
        x: data.minx,
        y: data.miny,
        spatialReference: this.gs2.geom.SpatialReference.EPSG3857
      });
      path.addPoint(startPoint);
      path.addPoint(endPoint);
      polyline.addGeometry(path);
      this.g2map.pan(polyline);
    },
    //初始化事件
    initEvent() {
      const _this = this;
      $(".build-alarm-info").show();
      if ($(".gg-build-show").css("position") == "absolute") {
        $(".build-enlargeBtn").hide();
      } else {
        $(".build-narrowBtn").hide();
      }
      //报警数量框
      $(".alarm-info-title .alarm-info-toggle").click(function() {
        if ($(".build-alarm-info .alarm-info-body").is(":visible")) {
          $(this)
            .removeClass("maintenance-arrowBottom")
            .addClass("maintenance-arrowTop");
        } else {
          $(this)
            .removeClass("maintenance-arrowTop")
            .addClass("maintenance-arrowBottom");
        }
        $(".build-alarm-info .alarm-info-body").toggle();
      });
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    const _this = this;
    this.$nextTick(function() {
      _this.regionValue = _this.region;
      let serviceUrl = api.forent_url.maintenance_service_url+"recordEnterprise/getEmsOrg";
      api.post(serviceUrl,{unitId:_this.$props.rowData.unitId}).then(res => {
        if(res&&res["code"]=="success"&&res["data"]){
          this.userModel = res["data"]["extendstr5"];
        }else{
          this.userModel = 1;
        }
        //初始化地图框
        if(document.body.clientWidth==1366){
          _this.g2mapDivStyle = "height: calc(100vh - 3rem);";
        }else{
          _this.g2mapDivStyle = "height: calc(100vh - 2.7rem);";
        }
        //初始化搜索框
        _this.initSearch();
        //初始化地图
        _this.initMap();
        _this.queryFloorList();
        //事件绑定
        _this.initEvent();
      })
    });
  },
  watch: {
    //设施系统值变化
    facilitySystemValue(newVal, oldVal) {
      let optsTemp = [
        {
          value: "00000000",
          label: "全部"
        }
      ];
      if (this.deviceType[0] != undefined) {
        let type1Arr = this.deviceType[0].children;
        for (let key in type1Arr) {
          if (type1Arr[key].id == newVal) {
            let typeStr = ""; //设备类型查询
            let type2Arr = type1Arr[key].children;
            for (let key2 in type2Arr) {
              let temp = {};
              temp.value = type2Arr[key2].id;
              temp.label = type2Arr[key2].name;
              optsTemp.push(temp);
              typeStr = typeStr + "," + temp.value;
            }
            if (typeStr.length > 0) {
              this.deviceQueryType = typeStr.substr(1);
            }
          }
        }
      }
      this.facilities = optsTemp;
      this.facilitiesValue = "00000000";
      if (newVal == "00000000") {
        this.deviceQueryType = "";
      }
    },
    //设施值变化
    facilitiesValue(newVal, oldVal) {
      if (newVal == "00000000") {
        let typeStr = "";
        for (let key in this.facilities) {
          if (this.facilities[key].value != "00000000") {
            typeStr = typeStr + "," + this.facilities[key].value;
          }
        }
        if (typeStr.length > 0) {
          this.deviceQueryType = typeStr.substr(1);
        }
      } else {
        this.deviceQueryType = newVal;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/RealTimeMonitoring/popup.scss";
* {
  margin: 0 auto;
  // padding: 0;
}
.floor-storey-div {
  height: 100%;
  width: 100%;
  .searchBtn {
    margin-left: 0.1rem;
    color: #fff;
    background-color: #e6a23c;
    border-radius: 17px;
    width: 0.8rem;
    margin-right: 0.5rem;
    margin-top: 0.04rem;
  }
  .build-alarm-info {
    width: 234px;
    top: 70px;
    left: 20px;
    position: absolute;
    border-radius: 5px;
    box-shadow: 0 0 3px rgba(37, 40, 41, 0.5);
    z-index: 2;
    line-height: 1;
  }
  .build-alarm-info .alarm-info-body {
    padding: 0 10px;
    background: #fff;
    height: 110px;
  }

  .build-floor {
    width: 100px;
  }

  .alarm-info-title {
    font-size: 18px;
    color: #fff;
    padding: 8px 0 8px 10px;
    background: #4777e7;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .alarm-info-title .maintenance-arrowBottom {
    position: absolute;
    right: 6px;
    top: 8px;
    cursor: pointer;
  }

  .alarm-info-title .maintenance-arrowTop {
    position: absolute;
    right: 6px;
    top: 8px;
    cursor: pointer;
  }

  .build-floor {
    display: inline-block;
    font-size: 32px;
    color: #1f88ec;
    text-align: center;
    vertical-align: bottom;
  }

  .build-floor-alarm,
  .build-floor-hidden,
  .build-floor-warn,
  .build-floor-abnormal {
    width: 105px;
    display: inline-block;
    text-align: center;
    font-size: 12px;
  }

  .build-alarm-info .floor-alarm-num {
    margin-top: 8px;
    color: #f03718;
  }
  .build-alarm-info .floor-warn-num {
    margin-top: 8px;
    color: #5c52cc;
  }
  .build-alarm-info .floor-hidden-num {
    margin-top: 8px;
    color: #ff7800;
  }
  .build-alarm-info .floor-abnormal-num {
    margin-top: 8px;
    color: #a1a8b2;
  }

  .build-alarm-info .floor-num-size {
    font-size: 26px;
  }
  .floor-alarm-name,
  .floor-warn-name,
  .floor-hidden-name,
  .floor-abnormal-name {
    margin-top: 7px;
  }
  @media screen and (max-width: 1680px) {
    .build-alarm-info .floor-num-size {
      font-size: 20px;
    }
  }
  @media screen and (max-width: 1440px) {
    .build-alarm-info .floor-num-size {
      font-size: 16px;
    }
  }

  .build-alarm-info .build-warp-line {
    width: 1px;
    height: 90px;
    background: #a1a8b2;
    position: absolute;
    top: 45px;
    left: 117px;
  }

  .build-alarm-info .build-weft-line {
    width: 210px;
    height: 1px;
    background: #a1a8b2;
    position: absolute;
    top: 90px;
    left: 15px;
  }

  @media screen and (max-width: 1680px) {
    .build-alarm-info .build-warp-line {
      height: 100px;
      top: 39px;
      left: 117px;
    }
    .build-alarm-info .build-weft-line {
      top: 88px;
      left: 15px;
    }
  }

  @media screen and (max-width: 1440px) {
    .build-alarm-info .build-warp-line {
      height: 95px;
      top: 44px;
      left: 117px;
    }
    .build-alarm-info .build-weft-line {
      top: 83px;
      left: 15px;
    }
  }
}
/* 楼层平面图导航 start */
/deep/.nav-div {
  position: absolute;
  top: 0;
  right: 0px;
  z-index: 1;
  .floor-nav {
    position: absolute;
    right: 0.28rem;
    top: 1.5rem;
    a {
      color: #424242;
      display: block;
      text-align: center;
    }
    .icon-lift-up,
    .icon-lift-down {
      z-index: 11;
      position: relative;
      width: 50px;
      height: 30px;
      display: block;
      color: #3c8dbc;
      text-align: center;
      padding-top: 2px;
      // border-left: 2px solid #386fc2;
      // border-right: 2px solid #386fc2;
    }
    .icon-lift-up {
      border-top: 2px solid #386fc2;
      padding-top: 10px;
      margin-bottom: 10px;
      margin-left: 24px;
    }
    .icon-lift-up > i,
    .icon-lift-down > i {
      font-size: 20px;
    }
    .icon-lift-down {
      padding-bottom: 10px;
      margin-top: 10px;
      border-bottom: 2px solid #386fc2;
      margin-left: 24px;
    }
    .icon-lift-up:hover,
    .icon-lift-down:hover,
    .floor-btn-div > .floor-fire-btn > i:hover {
      cursor: pointer;
    }
    .floor-ul-hidden {
      overflow-x: visible;
    }
  }
  .floor-nav:before {
    position: absolute;
    content: "";
    top: 0;
    left: 24px;
    right: 24px;
    bottom: 0;
    border-left: 2px solid #386fc2;
    border-right: 2px solid #386fc2;
    background: #fff;
  }
  .floor-ul-div {
    width: 100px;
    height: 320px;
    position: relative;
    overflow-y: hidden;
    ul {
      list-style: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 0;
      margin: 0;
      li {
        position: relative;
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #000;
        margin-bottom: 8px;
      }
    }
  }
  .floor-ul-div {
    ul {
      list-style-type: none;
      li {
        position: relative;
        text-align: center;
        font-size: 0.16rem;
      }
    }
  }
  .floor-ul-div > ul > li.is-warning,
  .floor-ul-div > ul > li.is-error {
    position: relative;
  }
  .is-error .gg-floor-circle {
    color: #f00;
  }
  .floor-ul-div > ul > li.is-error.floor-checked .gg-floor-circle {
    background-color: #4777e7;
  }

  .floor-ul-div > ul > li.is-warning .gg-floor-circle {
    border-color: #ffa939;
    background-color: #ffeed8;
  }
  .floor-ul-div > ul > li.is-warning.floor-checked .gg-floor-circle {
    background-color: #4777e7;
  }

  .floor-ul-div ul li:hover .gg-floor-circle {
    background-color: #4777e7;
    color: #fff;
  }

  .floor-checked .gg-floor-circle {
    background: #4777e7;
    color: #fff;
  }
  .floor-checked:before {
    content: "";
    position: absolute;
    left: 5px;
    top: 50%;
    display: block;
    border: 0.06rem solid transparent;
    border-left-color: #4777e7;
    margin-top: -0.04rem;
  }

  .gg-floor-circle {
    width: 36px;
    height: 36px;
    line-height: 36px;
    display: inline-block;
    border-radius: 50%;
  }

  .floor-ul-div > ul > li.is-warning a {
    color: #ff9204;
  }

  .floor-ul-div > ul > li.is-warning:before,
  .floor-ul-div > ul > li.is-error:before {
    position: absolute;
    border: none;
    content: "";
    display: inline-block;
    width: 25px;
    height: 25px;
    left: 0;
    top: 6px;
    margin-top: 0;
  }
  .floor-ul-div > ul > li.is-error:before {
    background: url("~@/static/img/RealTimeMonitoring/floor-alarm.png")
      no-repeat 2px 4px;
  }
  .floor-ul-div > ul > li.is-warning:before {
    background: url("~@/static/img/RealTimeMonitoring/floor-warn.png") no-repeat
      2px 4px;
  }
  .floor-ul-div > ul > li > b {
    position: absolute;
    bottom: -2px;
    right: -2px;
    font-size: 20px;
  }
  @media screen and (max-width: 1440px) {
    .floor-ul-div {
      height: 240px;
    }
    .floor-header .gg-floor-btn {
      height: 30px;
      padding: 0;
    }
  }
  @media screen and (max-width: 1366px) {
    .floor-ul-div {
      height: 240px;
    }
    .floor-header .gg-floor-btn {
      height: 30px;
      padding: 0;
    }
  }
}
/* 楼层平面图导航 end */
</style>
