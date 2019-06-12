export default {
  "defaultExtent3857": {
    "maxZoom": 18, //最大缩放
    "minZoom": 2, //最小缩放
    "center": [12431916.315302458, 4908797.176369604], //中心点
    "level": 6, //缩放级别
    "projection": "EPSG:3857" //投影坐标系
  },
  "defaultExtent4326": {
    "maxZoom": 15, //最大缩放
    "minZoom": 2, //最小缩放
    "center": [12431916.315302458, 4908797.176369604], //中心点
    "level": 6, //缩放级别
    "projection": "EPSG:3857" //投影坐标系
  },
  "baseLayer": {
    "id": "tiandituvec",
    "name": "wmts服务",
    "layers": "nurc:foshan11",
    "//": "图层名称",
    "matrix": 22,
    "//": "切图级别小于等于切图级别",
    "matrixSet": "EPSG:4326",
    "//": "切图策略",
    "matrixPrefix": "EPSG:4326:",
    "//": "切图策略加冒号：",
    "levelShift": 1,
    "format": "image/png",
    "//": "图层格式",
    "projection": "EPSG:4326",
    "//": "投影参考",
    "opacity": 1.0,
    "//": "透明度",
    "visible": true,
    "//": "是否显示",
    "crossOrigin": "anonymous",
    "style": "",
    "url": "http://api1.map.bdimg.com/customimage/tile"
  },
  "serviceUrl": {
    "//": "百度地图影像地址",
    "baiduImg": "http://shangetu1.map.bdimg.com/it",
    "//": "wfs样式服务地址端口",
    "RestStyleDescriptorService": "http://112.27.198.15:9855",
    "//": "wfs服务地址",
    "RestWFSService": "http://112.27.198.15:9856",
    "//": "设备缓冲查询距离",
    "bufferDistance": 5,
    "//": "wfs底图样式实例名称",
    "wfsLayerCatService": "indoorgis",
    "//": "楼层所属区域样式实例名称",
    "OwnerFeatureLayerCatService": "ownerHoverColor20181104Render",
    "//": "查看全部楼层所属区域实例名称",
    "OwnerALLFeatureLayer": "allFeatrueColorRender",
    "//": "网格熏染服务",
    "wgFeatureLayerRender": "wgxrms",
    "//": "网格底图服务",
    "wgFeatureLayerSource": "wgfb",
    "//": "wfs底图服务地址",
    "wfsSource": "indoorgis",
    "//": "图层搜索颜色控制",
    "mapSearchBorderColor": "#CB2221",
    "mapSearchFillColor": "#F7D0D0",
  }
}
