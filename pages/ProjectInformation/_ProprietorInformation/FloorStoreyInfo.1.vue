<template>
  <div class="floor-storey-div">
    <el-row style="line-height:.48rem;">
      <el-col :span="1">
        <div
          class="div-flex align_center"
          style="margin-top: .08rem;margin-left: .15rem;"
        >
          <img
            id="floor-backBtn"
            src="~@/static/img/RealTimeMonitoring/l-arrows.png"
          />
        </div>
      </el-col>
      <el-col :span="4">
        <div class="div-flex">
          <span class="fs16px colorLabel">区域：</span>
          <el-select
            v-model.trim="region"
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
    <div :id="g2mapDiv"></div>
    <!-- 地图上的控件 -->
    <div class="build-alarm-info">
      <div class="alarm-info-title">
        <span class="gg-company-warnTitle">指挥中心大楼（1号楼）</span
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
    <div class="mapFeature">
      <div id="mapFeature_wgtc" class="mapFeature_wgtc">
        <el-checkbox v-model="gridChecked" @change="gridCheckedChange()"
          >网格图层</el-checkbox
        >
      </div>
      <ul>
        <li class="mapFeature_btn axld_btn">
          <b class="maintenance-pathPlanning"></b>
          <p>安消联动</p>
        </li>
        <li>
          <div class="mapFeature_line"></div>
        </li>
        <li class="mapFeature_btn jlcl_btn">
          <b class="maintenance-measure"></b>
          <p>距离测量</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import api from "~/config/http";
import mapConfig from "~/config/mapConfig";
import { Message, MessageBox } from "element-ui";
export default {
  props: ["regionList", "region", "rowData"],
  data() {
    return {
      orgId: "",
      g2mapDiv: "g2map",
      regionListData: [], //
      facilitySystemValue: "", //设施系统值
      facilitySystem: [], //设施系统
      facilities: [], //设施数据
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
      wfsService: {}, //web要素服务实现  地图框
      styleService: {}, //样式描述服务实现
      catService: {}, //服务渲染实现
      wfsLayer: {}, //wfs图层
      OwnerFeatureLayer: {},
      wgFeatureLayer: {}, //新分区
      OwnerALLFeatureLayer: {},
      ownerQueryParam: false, //空间分析判断全局变量初始化设置
      circleElementLayer: {}, //创建元素图层
      deviceLayer: {}, //
      bufferDeviceLayer: {}, //缓冲画圆图层
      floorTooltipWare: {}, //创建tooltip管理
      distanceOverlayWare: {}, //地图覆盖物管理
      alarmDeviceOverlayWare: {}, //
      distanceMesasureLayer: {}, //距离测量图层
      ploylinePlot: {}, //测量
      distanceToolTipWare: {}, //距离测量容器
      buildAlarmInfo: {
        alarmcount: 0,
        warnNumber: 0,
        accicount: 0,
        abnormal: 0
      },
      gridChecked: false, //网格勾选
      userModel: 0, //0:适用室内gis 其他都是普通的
      iconConf:{
        deviceIcons:{}//图标库
      }
    };
  },
  methods: {
    initSearch() {
      //查询区域数据
      this.queryRegionData();
      this.getDeviceInfoList();
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
        var baiduvec = new this.gs2.carto.TileLayer({
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
        this.g2map.addLayer(baiduvec);
        this.initService();
        this.g2map.addScaleLineControl("ol-scale-line");
      } else {
        let g2map = new g2.maps.Map({
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
        let elementLayer = new g2.lys.ElementLayer({
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
          for (var i = 0, len = data.length; i < len; ++i) {
            var entity = data[i];
            var symbol = entity.symbol;
            var name = entity.name;
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
      ploylinePlot.onCreate({
        map: this.g2map,
        spatialRef: 3857,
        tooltipWare: distanceToolTipWare,
        measureService: measureService
      }); //传入地图实例和空间坐标参考
      let pointList = [];
      ploylinePlot.onMouseUp = function(
        button,
        shift,
        screenx,
        screeny,
        mapx,
        mapy,
        handled
      ) {
        let polyline = new this.gs2.geom.Polyline({ spatialReference: 3857 });
        let paths = new this.gs2.geom.Path();
        let point = new this.gs2.geom.Point({ x: mapx, y: mapy });
        pointList.push(point);
        let contentTemplate = "";
        if (pointList.length > 1) {
          $.each(pointList, function(i, point) {
            paths.addPoint(point);
          });
          polyline.addGeometry(paths);
          let length = measureService.length(polyline);
          contentTemplate =
            "<div >" +
            '<label class="emap-measuring-points_distance">' +
            length.toFixed(1) +
            "米" +
            "</br>";
          ("</label>");
          ("</div>");
          distanceToolTipWare.add(
            new _this.gs2.ext.Tooltip({
              id: "tooltip" + pointList.length,
              anchor: pointList[pointList.length - 1], //提示在地图上停靠位置
              content: contentTemplate, //提示内容
              layerId: _this.distanceMesasureLayer.getLayerId(), //提示所在图层ID
              offset: [0, 0], //位置偏移量
              className: "emap-measuring-tooltip" //tooltip样式
            })
          );
        } else {
          contentTemplate =
            '<div class="emap-measuring-point_distance-div">' +
            '<label class="emap-measuring-point_distance-label">' +
            "起点" +
            "</br></label></div>";
          distanceToolTipWare.add(
            new _this.gs2.ext.Tooltip({
              anchor: pointList[0], //提示在地图上停靠位置
              content: contentTemplate, //提示内容
              layerId: _this.distanceMesasureLayer.getLayerId(), //提示所在图层ID
              offset: [0, 0], //位置偏移量
              className: "" //tooltip样式
            })
          );
        }
      };
      ploylinePlot.onEndDraw = function(ele) {
        distanceToolTipWare.remove("tooltip" + pointList.length);
        _this.g2map.currentTool(null);
        if (ele) {
          let tooltipCoord = ele.coordinate;
          _this.distanceMesasureLayer.add(ele);
          let length = measureService.length(ele.geometry);
          let contentTemplate =
            "<div >" +
            '<label  class="emap-measuring-points_distance">' +
            "总长:" +
            length.toFixed(1) +
            "米" +
            "</br></label></div>";
          let tooltip = new g2.ext.Tooltip({
            anchor: pointList[pointList.length - 1], //提示在地图上停靠位置
            content: contentTemplate, //提示内容
            layerId: _this.distanceMesasureLayer.getLayerId(), //提示所在图层ID
            offset: [0, 0], //位置偏移量
            className: "emap-measuring-tooltip" //tooltip样式
          });
          distanceToolTipWare.add(tooltip);
          pointList = [];
        }
      };
    },
    //网格勾选
    gridCheckedChange() {},
    //查询楼层数据
    queryFloorList() {
      let serviceUrl =
        api.forent_url.maintenance_service_url + "/recordEnterprise/getTAndAByUnitIdAndBuildId";
      let params = {
        unitId: this.rowData.unitId,
        buildId: this.region,
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
        troubleFloor = null;
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
        if (floor.floorAreaImg == "") {
          urlTemp = "~@/static/img/RealTimeMonitoring/simple-logo-hidden.png";
        } else {
          urlTemp = forent_url.pic_url + "/floorImage/" + floor.floorAreaImg; // 楼层平面图
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
          "'>\
                <a href='javascript:;'><span class='gg-floor-circle' title=" +
          floor.floorName +
          ">" +
          floor.floorName +
          "</span></a></li>";
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
          this.currentFloor = undefined;
        } else {
          if (alarmFloor) {
            currentFloor = alarmFloor;
          } else if (troubleFloor) {
            currentFloor = troubleFloor;
          } else {
            currentFloor = firstFloor;
          }
        }
        let currentTag = $(
          '.floor-ul-div>ul>li[floorid="' + currentFloor + '"]'
        );
        let prevLiNum = currentTag.prevAll("li").length;
        currentTag
          .addClass("floor-lift-cur")
          .siblings()
          .removeClass("floor-lift-cur");
        currentTag.addClass("floor-checked");
        ulObj.offset({ top: initListOffsetTop - prevLiNum * 40 });
        let buildId = ZS.MONITOR.currentBuild;
        let picUrl = currentTag.attr("picurl");
        let floorId = currentTag.attr("floorid");
        let alarmcount = currentTag.attr("alarmcount"); //报警数
        let accicount = currentTag.attr("accicount"); //故障数
        let warncount = currentTag.attr("warncount"); //预警数
        //楼层页
        this.buildAlarmInfo.alarmcount = alarmcount;
        this.buildAlarmInfo.accicount = accicount;
        $(".gg-company-warnTitle").text($(".gs-el-input__inner").val());
        $(".gg-company-warnTitle").attr(
          "title",
          $(".gs-el-input__inner").val()
        );
        //切换楼层图
        this.addPicToMap(picUrl, buildId, floorId);
      }
    },
    //切换楼层图
    addPicToMap(picUrl, buildId, floorId) {
      const _this = this;
      if (this.userModel === 0) {//室内gis
        this.currentFloorId = floorId;
        this.clearLayersAndEvents();
        //添加wfs服务
        let filter = new this.gs2.ows.GQueryFilter({
          subFields: "*",
          where: "floor_id ='" + floorId + "'",
          returnGeometry: true
        });
        let result = this.wfsService.find(mapConfig.serviceUrl.wfsSource, filter);
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
        this.loadDevice(floorId,buildId);
      }else{

      }
    },
    //加载设备信息
    loadDevice(floorId,buildId){
      if(this.deviceIcons){

      }
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
      this.g2map.un("click", deviceClickEvent);
      this.g2map.un("mousemove", mouseMoveEvent);
    },
    /*
    *地图初始化定位
     */
    initMapLocation(data) {
      let polyline =new this.gs2.geom.Polyline({spatialReference:this.g2map.spatialReference});
      let path =new this.gs2.geom.Path({
        spatialReference:this.g2map.spatialReference
      });
      let startPoint =new this.gs2.geom.Point({
        x:data.maxx,
        y:data.maxy,
        spatialReference: this.gs2.geom.SpatialReference.EPSG3857
      })
      let endPoint =new this.gs2.geom.Point({
        x:data.minx,
        y:data.miny,
        spatialReference: this.gs2.geom.SpatialReference.EPSG3857
      })
      path.addPoint(startPoint);
      path.addPoint(endPoint);
      polyline.addGeometry(path);
      this.g2map.pan(polyline);
    }
  },
  mounted() {
    this.orgId = api.getGlobalVal("maintenance_userObj").orgCode;
    const _this = this;
    setTimeout(function() {
      //初始化搜索框
      _this.initSearch();
      //初始化地图
      _this.initMap();
      _this.queryFloorList();
    });
  }
};
</script>
<style lang="scss" scoped>
* {
  margin: 0 auto;
  padding: 0;
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
    top: 38px;
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
      height: 75px;
      top: 32px;
      left: 117px;
    }
    .build-alarm-info .build-weft-line {
      top: 76px;
      left: 15px;
    }
  }

  @media screen and (max-width: 1440px) {
    .build-alarm-info .build-warp-line {
      height: 70px;
      top: 28px;
      left: 117px;
    }
    .build-alarm-info .build-weft-line {
      top: 70px;
      left: 15px;
    }
  }
  .mapFeature {
    position: absolute;
    right: 116px;
    top: 65px;
    z-index: 10;
    .mapFeature_wgtc {
      display: block;
      float: left;
      box-shadow: 0px 1px 4px 1px #b4b4b4;
      margin-right: 10px;
      width: 98px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      background: #fff;
    }
    ul {
      overflow: auto;
      background: #fff;
      box-shadow: 0px 1px 4px 1px #b4b4b4;
      li {
        float: left;
        text-align: center;
        padding-top: 5px;
      }
      .mapFeature_btn {
        width: 68px;
        height: 100%;
        b {
          font-size: 20px;
          color: #5c6266;
        }
        p {
          color: #5c6266;
        }
      }
    }
  }
}
</style>
