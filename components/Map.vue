<template>
  <div class="map" :id="mapDiv"></div>
</template>
<script>
import mapConfig from "~/config/mapConfig";
export default {
  name: "g2map",
  props: {
    mapDiv: String //这里指定了字符串类型，如果类型不一致会警告的哦
  },
  data() {
    return {
      g2map: {}
    };
  },
  methods: {
    //初始化地图
    init() {
      this.g2map = new this.gs2.carto.Map({
        defaultExtent: mapConfig.defaultExtent3857
      });
      this.g2map.init({
        targetId: this.mapDiv
      });
      //创建底图图层
      var baseLayer = new this.gs2.carto.TileLayer({
        layerType: this.gs2.carto.TileLayer,
        tileType: this.gs2.carto.TileType.BaiduMap,
        opacity: 1.0,
        visible: true,
        matrix: 22,
        maxZoom:18,
        crossOrigin: "anonymous",
        url: mapConfig.baseLayer.url
      });
      //将底图图层添加到地图
      this.g2map.addLayer(baseLayer);
      this.mapEvents();
    },
    /**
     * 创建elementLayer
     * @param string layerId 图层id
     * @param string layerName 图层名称
     */
    createElementLayer(layerId, layerName) {
      //创建点元素图层
      let elementLayer = new this.gs2.lys.ElementLayer({
        id: layerId,
        name: layerName,
        map: this.g2map
      });
      this.g2map.addLayer(elementLayer);
      return elementLayer;
    },
    /**
     * 创建heatLayer热力图层
     * @param string layerId 图层id
     * @param string layerName 图层名称
     */
    createHeatLayer(layerId, layerName) {
      let heatMapLayer = new this.gs2.lys.HeatMapLayer({
        id: layerId,
        name: layerName,
        blur: 15,
        //模糊值
        radius: 20,
        //圆半径
        gradient: ["#00f", "#0ff", "#0f0", "#ff0", "#f00"] //颜色数组
      });
      this.g2map.addLayer(heatMapLayer);
      return heatMapLayer;
    },
    //添加TooltipWare
    createTooltipWare() {
      let toolTipWare = new this.gs2.ext.TooltipWare({
        map: this.g2map
      });
      return toolTipWare;
    },
    //创建图层覆盖物容器
    createOverlayWare(){
      let overlayWare = new this.gs2.widget.OverlayWare({
        map: this.g2map
      });
      return overlayWare;
    },
    setMapCenter(point){
      this.g2map.setCenter(point)
    },
    setMapLevel(num){
      this.g2map.zoomTo(num);
    },
    getMapLevel(){
      const level = this.g2map.getZoomLevel();
      return level;
    },
    getMapCenter(){
      return this.g2map.getCenter();
    },
    mapPan(multipoint){
      this.g2map.pan(multipoint, [100, 100, 100, 100]);
    },
    //地图的事件
    mapEvents() {
      let _this = this;
      /***
       * 鼠标单击事件
       * @param Number button 按下的鼠标按键
       * @param Number shift 是否同时按下的键盘上的shift键
       * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
       * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
       * @param Number mapX 鼠标在地图上的X坐标
       * @param Number mapY 鼠标在地图上的Y坐标
       * @param Number handle 该事件是否已经不需要再处理
       */
      this.g2map.on("click", function(
        button,
        shift,
        screenX,
        screenY,
        mapX,
        mapY,
        handle
      ) {
        _this.$emit("mapClick", {
          button: button,
          shift: shift,
          screenX: screenX,
          screenY: screenY,
          mapX: mapX,
          mapY: mapY,
          handle: handle
        });
      });
      /***
       * 鼠标双击事件
       * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
       * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
       * @param Number mapX 鼠标在地图上的X坐标
       * @param Number mapY 鼠标在地图上的Y坐标
       */
      this.g2map.on("dblclick", function(screenX, screenY, mapX, mapY) {
        _this.$emit("mapDblclick", {
          screenX: screenX,
          screenY: screenY,
          mapX: mapX,
          mapY: mapY
        });
      });
      /***
       * 鼠标移动事件
       * @param Number button 按下的鼠标按键
       * @param Number shift 是否同时按下的键盘上的shift键
       * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
       * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
       * @param Number mapX 鼠标在地图上的X坐标
       * @param Number mapY 鼠标在地图上的Y坐标
       * @param Number handle 该事件是否已经不需要再处理
       */
      this.g2map.on("mousemove", function(
        button,
        shift,
        screenX,
        screenY,
        mapX,
        mapY,
        handle
      ) {
        _this.$emit("mapMousemove", {
          button: button,
          shift: shift,
          screenX: screenX,
          screenY: screenY,
          mapX: mapX,
          mapY: mapY,
          handle: handle
        });
      });
      /***
       * 鼠标按下事件
       * @param Number button 按下的鼠标按键
       * @param Number shift 是否同时按下的键盘上的shift键
       * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
       * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
       * @param Number mapX 鼠标在地图上的X坐标
       * @param Number mapY 鼠标在地图上的Y坐标
       * @param Number handle 该事件是否已经不需要再处理
       */
      this.g2map.on("mousedown", function(
        button,
        shift,
        screenX,
        screenY,
        mapX,
        mapY,
        handle
      ) {
        _this.$emit("mapMousedown", {
          button: button,
          shift: shift,
          screenX: screenX,
          screenY: screenY,
          mapX: mapX,
          mapY: mapY,
          handle: handle
        });
      });
      /***
       * 鼠标按下后抬起事件
       * @param Number button 按下的鼠标按键
       * @param Number shift 是否同时按下的键盘上的shift键
       * @param Number screenX 事件发生时鼠标在屏幕上的X坐标
       * @param Number screenY 事件发生时鼠标在屏幕上的Y坐标
       * @param Number mapX 鼠标在地图上的X坐标
       * @param Number mapY 鼠标在地图上的Y坐标
       * @param Number handle 该事件是否已经不需要再处理
       */
      this.g2map.on("mouseup", function(
        button,
        shift,
        screenX,
        screenY,
        mapX,
        mapY,
        handle
      ) {
        _this.$emit("mapMouseup", {
          button: button,
          shift: shift,
          screenX: screenX,
          screenY: screenY,
          mapX: mapX,
          mapY: mapY,
          handle: handle
        });
      });
      /***
       * 地图可视范围改变事件
       * @param Number left 左上角X坐标
       * @param Number top 左上角Y坐标
       * @param Number right 右下角X坐标
       * @param Number bottom 右下角Y坐标
       */
      this.g2map.on("extentchanged", function(left, top, right, bottom) {
        _this.$emit("mapExtentchanged", {
          left: left,
          top: top,
          right: right,
          bottom: bottom
        });
      });
      /***
       * 地图拖拽事件
       * @param Number left 左上角X坐标
       * @param Number top 左上角Y坐标
       * @param Number right 右下角X坐标
       * @param Number bottom 右下角Y坐标
       */
      this.g2map.on("drag", function(left, top, right, bottom) {
        _this.$emit("mapDrag", {
          left: left,
          top: top,
          right: right,
          bottom: bottom
        });
      });
      /***
       * 浏览器窗口大小改变事件
       * @param Number newSize 新的窗口尺寸,如：[782, 389]
       * @param Number oldSize 旧的窗口尺寸，如：[1440,719]
       */
      this.g2map.on("resize", function(newSize, oldSize) {
        _this.$emit("mapResize", {
          newSize: newSize,
          oldSize: oldSize
        });
      });
      /**
       * 比例尺改变事件
       * @param Number newResolution 新的分辨率
       * @param Number oldResolution 旧的分辨率值
       * @param Number level 当前层级
       */
      this.g2map.on("resolutionchanged", function(
        newResolution,
        oldResolution,
        level
      ) {
        _this.$emit("mapResolutionchanged", {
          newResolution: newResolution,
          oldResolution: oldResolution,
          level: level
        });
      });
    }
  },
  created() {},
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.map {
  height: 100%;
  width: 100%;
}
</style>
