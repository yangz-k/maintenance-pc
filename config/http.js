//axios 封装
import axios from 'axios'
import qs from 'qs'
import Cookie from 'js-cookie'
import { Loading, Message } from 'element-ui'
//引入api 全局配置
import apiConfig from './api.config'

var isOnline = false;

axios.interceptors.request.use(config => {
  return config
}, error => {
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  //响应拦截
  return response
}, error => {
  Message.error({
    message: '请求失败'
  })
  return Promise.resolve(error.response)
})

function checkStatus(response) {
  if (response && response.data) {
    return response.data
  }
  if (response && response.data.code == "success") {
    return response
  }
}

function checkCode(res) {
  // 222如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  return res
}

export default {
  post(url, params, timeout) {
    let token = Cookie.getJSON("userToken") ? Cookie.getJSON("userToken") : "";
    let time = timeout ? timeout : 30000;
    return axios({
      method: 'post',
      url: url,
      data: qs.stringify(params),
      timeout: time,
      contentType: false,
      processData: false,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'JSESSIONID': token
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params, timeout) {
    let token = Cookie.getJSON("userToken") ? Cookie.getJSON("userToken") : "";
    var timeout = timeout ? timeout : 30000;
    return axios({
      method: 'get',
      url: url,
      params, // get 请求时带的参数
      timeout: timeout,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'JSESSIONID': token
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch(
      (res) => {
        return checkCode(res)
      }
    )
  },
  isOnline: isOnline,
  auth: Cookie.getJSON("userToken"),
  ajaxUrl: apiConfig.forent_api.ajaxUrl,
  getGlobalVal(key) {
    return Cookie.getJSON(key);
  },
  setGlobalVal(key, value) {
    return Cookie.set(key, value);
  },
  removeGlobalVal(key, value) {
    return Cookie.remove(key, value);
  },
  apiConfig,
  forent_url: apiConfig.forent_api,
  versionNumber : apiConfig.versionNumber
}
