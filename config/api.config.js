/*
 * api 全局配置
 */
export default {
  forent_api: {
    localHostName: "maintenance-pc",
    base_url: 'http://112.27.198.15:9832/maintenance-pc',
    // fire_url:"http://112.27.198.15:9832/api/v1/fire-society",//企业侧的url
    // maintenance_service_url: 'http://192.168.228.246:8093/',
    maintenance_service_url: 'http://112.27.198.15:9832/api/v1.1/maintenance-service/',//请求维保后台的数据接口
    maintenance_message_service_url: 'http://112.27.198.15:9832/maintenance-message-service',//维保消息服务后台地址
    // monitor_url: 'http://112.27.198.15:9832/api/v1/monitorCenter', // 监测中心
    image_url: "http://112.27.198.15:9832/image/"// 图片
  }
  // forent_api: {
  //   localHostName: "maintenance-pc",
  //   base_url : 'http://test.gsafetycloud.com/maintenance-pc/',
  //   fire_url:"http://112.27.198.15:9832/api/v1/fire-society",//企业侧的url
  //   maintenance_service_url: 'http://test.gsafetycloud.com/api/v1.1/maintenance-service/',//请求维保后台的数据接口
  //   // maintenance_service_url: 'http://192.168.230.2:8091/',//请求维保后台的数据接口
  //   maintenance_message_service_url: 'http://test.gsafetycloud.com/maintenance-message-service',//维保消息服务后台地址
  //   monitor_url: 'http://test.gsafetycloud.com/api/v1/monitorCenter', // 监测中心
  //   e_record_url: 'http://test.gsafetycloud.com/api/v1/eRecord', // 电子档案
  //   image_url: "http://test.gsafetycloud.com/image/",// 图片
  // }
}
