import api from "~/config/http";
import Vue from 'vue'
require("~/utils/sockjs.min.js");
require("~/utils/stomp.min.js");
let _url = api.forent_url.maintenance_message_service_url + '/ws';
let socket = null, stompClient = null, timer = null ;
let webSocketConnect = function () {
  if (!socket) {
    socket = null;
    stompClient = null;
  }
  socket = new SockJS(_url);
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function connectCallback(frame) {
    console.log("webSocket已经连接！")
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }, function errorCallBack(error) {
    console.log("webSocket连接失败！")
    setTimeout(function () {
      webSocketConnect();
    }, 12000);
  })
}
webSocketConnect();
stompClient.heartbeat.outgoing = 1000;
stompClient.heartbeat.incoming = 0; //客户端不从服务端接收心跳包
stompClient.debug = function () {
  if (socket.readyState == 1) {
  } else if (socket.readyState == 3) {
  }
}
socket.onclose = function () {
  if (!timer) {
    console.log("webSocket准备重新连接！");
    timer = setInterval(function () {
      console.log("webSocket重新连接！");
      webSocketConnect();
    }, 30000)
  }
}
Vue.prototype.stompClient = stompClient;//注册全局的消息监听
