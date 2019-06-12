<template>
  <div id="personnelMain" class="personnel-main">
    <div class="l-head">
      <!-- 面包屑 -->
      <Title />
    </div>
    <!-- 左侧弹框 -->
    <div class="personnel-list">
      <div class="list-title">
        <span>实时监控</span>
        <b class="maintenance-pullSouth" @click="taggerUserList()"></b>
      </div>
      <div class="list-div" v-show="showUserList">
        <div class="search-div">
          <input
            type="search"
            placeholder="请输入人员信息"
            v-model="searchName"
            @clear="queryMaintenanceUser(searchName, 'search')"
            @keyup.enter="queryMaintenanceUser(searchName, 'search')"
          />
          <b
            class="maintenance-searchSolid"
            @click="queryMaintenanceUser(searchName, 'search')"
          ></b>
        </div>
        <div class="list-main">
          <div
            class="user-info"
            v-for="(item, index) in userList"
            :key="index"
            @click="queryUserObjShow(item.userId)"
            @mouseout="userInfoMouseout($event)"
            @mouseover="userInfoMouseover($event)"
          >
            <span><img :src="imgUrl + item.headPortrait" alt="" :onerror="imgError"/></span>
            <span class="user-info-span user-info-name">{{ item.name }}</span>
            <span class="user-info-span user-info-telephone">{{
              item.telephone
            }}</span>
          </div>
        </div>
        <div class="show-personnel-info">
          <span>在地图中展示人员信息</span>
          <el-switch
            class="userInfoSwitch"
            v-model="value2"
            active-color="#FF6722"
            inactive-color="#cdcdcd"
            @change="personnelInfoSwitch()"
          >
          </el-switch>
        </div>
      </div>
    </div>
    <div class="main">
      <!-- 地图 -->
      <g2Map ref="g2map" :map-div="g2map" @mapClick="mapClick"></g2Map>
    </div>
  </div>
</template>
<script>
import Title from "~/components/Title";
import g2Map from "~/components/Map";
import { Message } from "element-ui";
import api from "~/config/http";
// import headPortrait from "~/config/data/headPortrait";//人员的假数据
export default {
  components: {
    Title,
    g2Map
  },
  data() {
    return {
      imgUrlObj:{
          sign:require('@/assets/img/PersonnelLocationMonitoring/sign.png'),
      },
      g2map: "g2map",
      elementLayer: {},
      signOverlayWare: {},
      userinfoOverlayWare: {},
      signTooltipWare: {},
      userinfoTooltipWare: {},
      userList: [], //用户数据
      allUserList: [], //所有
      imgUrl: api.forent_url.image_url,
      showUserList: true, //是否展示用户列表
      value1: true,
      value2: false,
      searchName: "",
      personnelInfoSwitchState: false,
      imgError:'this.src="' + require('@/assets/img/PersonnelLocationMonitoring/weibao.png') + '"'
    };
  },
  methods: {
    //初始化页面
    initPage() {
      this.elementLayer = this.$refs.g2map.createElementLayer(
        "personnelLocationLayer",
        "人员定位图层"
      );
      this.signOverlayWare = this.$refs.g2map.createOverlayWare();
      this.userinfoOverlayWare = this.$refs.g2map.createOverlayWare();
      // this.signTooltipWare = this.$refs.g2map.createTooltipWare();
      // this.userinfoTooltipWare = this.$refs.g2map.createTooltipWare();
      //查询维保人员数据
      this.queryMaintenanceUser();
    },
    queryMaintenanceUser(name, type) {
      let serverUrl = api.forent_url.maintenance_service_url + "/getOnlineUser";
      let orgCode = api.getGlobalVal("maintenance_userObj").orgCode;
      let params = {
        orgId: orgCode,
        name: name
      };
      if (type == "search") {
        let allUserList = this.allUserList;
        if (allUserList && allUserList.length > 0) {
          let arr = [];
          allUserList.forEach(function(item) {
            if (item.name.indexOf(name) != -1) {
              //包含
              arr.push(item);
            }
          });
          this.userList = arr;
          this.$forceUpdate();
        }
      } else {
        api.get(serverUrl, params, 30000).then(ret => {
          this.elementLayer.clear();
          this.signOverlayWare.clear();
          this.userinfoOverlayWare.clear();
          // ret["data"] = headPortrait.urlList;
          if (ret && ret["code"] == "success") {
            let data = ret["data"];
            this.userList = data;
            this.allUserList = data;
            if (data && data.length == 0) {
              return;
            } else {
              let multipoint = new this.gs2.geom.MultiPoint();
              let _this = this;
              for (let i = 0; i < data.length; i++) {
                (function(i) {
                  let point = new _this.gs2.geom.Point({
                    x: data[i].log,
                    y: data[i].lat
                  });
                  multipoint.addPoint(point);
                  setTimeout(function() {
                    _this.addSignOverlay(data[i]);
                  }, (i + 1) * 100);
                })(i);
              }
              if (data.length > 0) {
                this.$refs.g2map.mapPan(multipoint);
              }
            }
          } else {
            this.$message.error("查询在线用户失败！");
          }
        });
      }
    },
    //添加标记点位
    addSignOverlay(obj) {
      let point = new this.gs2.geom.Point({
        x: obj.log,
        y: obj.lat
      });
      let ele = new this.gs2.ele.Element({
        geometry: point,
        symbol: new this.gs2.syms.SimpleMarkersymbol({
          fillColor: new this.gs2.syms.Color({
            a: 255,
            r: 0,
            g: 0,
            b: 255
          }),
          borderColor: new this.gs2.syms.Color({
            a: 255,
            r: 0,
            g: 0,
            b: 255
          }),
          size: 5
        })
      });
      // this.elementLayer.add(ele);
      let template =
        `<div class="signOverlay" id="` +
        obj.userId +
        `"><img src="`+this.imgUrlObj.sign+`" ></div>`;
      let Overlay = new this.gs2.widget.OverLay({
        id: obj.userId,
        element: this.parseDom(template),
        //DOM元素
        position: point,
        //覆盖物位置
        positioning: "top-left",
        //覆盖物相对于坐标点的位置
        offset: [-18, -47],
        //位置偏移量
        stopEvent: false //在地图覆盖物上是否禁用地图事件
      });
      this.signOverlayWare.add(Overlay);
      let _this = this;
      $("#" + obj.userId).unbind("click");
      $("#" + obj.userId).on("click", function() {
        _this.queryUserObjShow(this.id);
      });
    },
    //查询用户信息并且展示
    queryUserObjShow(id) {
      if (!this.personnelInfoSwitchState) {
        let obj = this.getUserObj(id);
        this.mapHeadPortraitClick(obj);
      }
    },
    //map点击展示人员信息弹框
    mapHeadPortraitClick(obj) {
      //通过id先获取用户数据
      let point = new this.gs2.geom.Point({
        x: obj.log,
        y: obj.lat
      });
      let name = obj.name;
      if (name.length > 7) {
        name = name.substr(0, 7) + "...";
      }
      let contentTemplate =
        `<div class="tooltipUserInfor"><div class='miantenceUserInfo'>
        <div class="headPortrait"><img src=` +
        api.forent_url.image_url +
        obj.headPortrait +
        ` onerror=`+this.imgError+`></div>
            <div class="userInfoPortrait"><ul>
              <li><b class="maintenance-user"></b><span title="` +
        name +
        `">` +
        name +
        `</span></li>
              <li><b class="maintenance-telphone"></b><span>` +
        obj.telephone +
        `</span></li>
            </ul></div>
          </div></div>`;
      let Overlay = new this.gs2.widget.OverLay({
        id: obj.userId + "_info",
        element: this.parseDom(contentTemplate),
        //DOM元素
        position: point,
        //覆盖物位置
        positioning: "top-left",
        //覆盖物相对于坐标点的位置
        offset: [0, 0],
        //位置偏移量
        stopEvent: false //在地图覆盖物上是否禁用地图事件
      });
      if (!this.personnelInfoSwitchState) {
        this.userinfoOverlayWare.clear();
      }
      this.userinfoOverlayWare.add(Overlay);
    },
    //切换展示人员信息框
    personnelInfoSwitch() {
      let _this = this;
      this.personnelInfoSwitchState = !this.personnelInfoSwitchState;
      let allUserList = this.allUserList;
      if (this.personnelInfoSwitchState) {
        //展示所有
        this.userinfoOverlayWare.clear();
        allUserList.forEach(function(item) {
          _this.mapHeadPortraitClick(item);
        });
      } else {
        //不展示
        this.userinfoOverlayWare.clear();
      }
    },
    //获取用户信息
    getUserObj(id) {
      let allUserList = this.allUserList;
      let userObj = {};
      allUserList.forEach(obj => {
        if (obj.userId == id) {
          userObj = obj;
        }
      });
      return userObj;
    },
    //显隐用户列表
    taggerUserList() {
      if ($('.maintenance-pullSouth').is('.transform')) {
        $('.maintenance-pullSouth').removeClass('transform');
      } else {
        $('.maintenance-pullSouth').addClass('transform');
      }
      this.showUserList = !this.showUserList;
    },
    //鼠标移出事件监听
    userInfoMouseout($event) {
      $event.currentTarget.className = "user-info";
    },
    //鼠标移入事件监听
    userInfoMouseover($event) {
      $event.currentTarget.className = "user-info userInfoActive";
    },
    //将DOM元素字符串转换为DOM元素
    parseDom(elementStr) {
      let div = document.createElement("div");
      div.innerHTML = elementStr;
      return div.childNodes[0];
    },
    //地图的点击事件
    mapClick(obj) {
      if (!this.personnelInfoSwitchState) {
        this.userinfoOverlayWare.clear();
      }
    },
    //监听webscoket推送的消息
    webScoketEvent() {
      let _this = this;
      let orgCode = api.getGlobalVal("maintenance_userObj").orgCode;
      if (this.stompClient.connected) {
        this.stompClient.subscribe(
          "/topic/" + orgCode + "/app_location_update",
          function(greeting) {
            let message = greeting.body;
            if (typeof message == "string") {
              message = JSON.parse(message);
            }
            let data = message.content;
            switch (message.type) {
              case "MSG_APP_POSITION":
                //更新点位消息
                _this.personnelPositionMonitoringCrudAcceptUpdateMessage(data);
                break;
              case "MSG_APP_STATUS":
                //推送过来的上下线消息
                _this.personnelPositionMonitoringCrudAcceptUpAndDownMessage(
                  data
                );
                break;
            }
          }
        );
      } else {
        let _this = this;
        setTimeout(function() {
          _this.webScoketEvent();
        }, 3000);
      }
    },
    //更新点位
    personnelPositionMonitoringCrudAcceptUpdateMessage(data) {
      let obj = {
        id: data.userId,
        anchor: {
          x: data.log,
          y: data.lat
        }
      };
      try {
        this.signOverlayWare.update(obj);
      } catch (e) {}
      if (!this.personnelInfoSwitchState) {
        this.userinfoOverlayWare.remove(data.userId + "_info");
      }
      let allUserList = this.allUserList;
      for (let i = 0; i < allUserList.length; i++) {
        if (allUserList[i].userId == data.userId) {
          this.allUserList.splice(i, 1);
          this.allUserList.push(data);
        }
      }
    },
    //上下线消息
    personnelPositionMonitoringCrudAcceptUpAndDownMessage(data) {
      //onlineStatus 0是下线，1是上线
      let obj = this.getUserObj(data.userId);
      if (data.onlineStatus == "0") {
        if (obj) {
          if (this.allUserList.length > 0) {
            //数组中删一个，图层上移除一个，列表中移除一个
            try {
              this.userinfoOverlayWare.remove(data.userId + "_info");
              this.signOverlayWare.remove(data.userId);
            } catch (e) {
              //TODO handle the exception
            }
            let allUserList = this.allUserList;
            let userList = this.userList;
            for (let i = 0; i < allUserList.length; i++) {
              if (allUserList[i].userId == data.userId) {
                this.allUserList.splice(i, 1);
              }
            }
            for (let i = 0; i < userList.length; i++) {
              if (userList[i].userId == data.userId) {
                this.userList.splice(i, 1);
                this.$forceUpdate();
              }
            }
          }
        }
      } else {
        let userObj = this.getUserObj(data.userId);
        if (Object.keys(userObj).length > 0) {
          //证明地图上有这个数据
          return;
        } else {
          this.allUserList.push(data);
          this.userList.push(data);
          this.addSignOverlay(data);
          if (this.personnelInfoSwitchState) {
            this.mapHeadPortraitClick(data);
          }
        }
      }
    }
  },
  mounted() {
    this.initPage();
    //监听webscoket推送的消息
    this.webScoketEvent();
  }
};
</script>
<style lang="scss">
#personnelMain {
  height: 100%;
  width: 100%;

  .main {
    height: calc(100% - 0.7rem);
    width: 100%;
  }
  .signOverlay img {
    cursor: pointer;
  }
  // 开始用户信息的弹框
  .tooltipUserInfor {
    position: absolute;
    background-color: #fff;
    -moz-box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    border-radius: 0;
    border: 1px solid #b6b6b6;
    bottom: 55px;
    left: -113px;
    font-size: 0.16rem;
    border: 1px solid #4d5877;
    border-radius: 8px;
    .miantenceUserInfo {
      box-sizing: border-box;
      display: flex;
      width: 2.3rem;
      height: 0.72rem;
      .headPortrait {
        display: flex;
        height: 0.5rem;
        width: 0.5rem;
        margin-top: 0.11rem;
        margin-left: 0.05rem;
        img {
          height: 100%;
          width: 100%;
          border-radius: 50%;
        }
      }

      .userInfoPortrait {
        display: flex;
        border-left: 1px solid #edecec;
        margin-left: 0.13rem;
        padding: 0.05rem;
        ul {
          list-style: none;
          padding: 0;
          text-align: left;
          margin: 0;
          color: #5f687f;
          li span {
            font-size: 0.16rem;
            white-space: nowrap;
            margin-left: 0.07rem;
          }
        }
      }
    }
  }

  .tooltipUserInfor:after,
  .tooltipUserInfor:before {
    top: 100%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .tooltipUserInfor:after {
    border-top-color: white;
    border-width: 10px;
    left: 113px;
    margin-left: -10px;
  }

  .tooltipUserInfor:before {
    border-top-color: #4d5877;
    border-width: 11px;
    left: 113px;
    margin-left: -11px;
  }
  // 结束用户信息的弹框
  //左侧列表弹框
  .personnel-list {
    position: absolute;
    height: 6.6rem;
    width: 3rem;
    z-index: 50;
    margin-top: 0.3rem;
    margin-left: 0.3rem;
    .list-title {
      height: 0.5rem;
      background-color: #5f687f;
      text-align: left;
      line-height: 0.5rem;
      color: white;
      font-size: 0.2rem;
      font-family: "宋体";
      span {
        margin-left: 0.1rem;
      }
      b {
        display: inline-block;
        cursor: pointer;
        margin-left: 1.6rem;
      }
    }
    .search-div {
      height: 0.6rem;
      background-color: #f7f8f8;
      line-height: 0.6rem;
      border-right: 1px solid #cccccc;
      border-left: 1px solid #cccccc;
      padding-left: 0.1rem;
      input {
        height: 0.3rem;
        border: 1px solid #ccc;
        width: 2.8rem;
        border-radius: 50px;
        padding-left: 0.1rem;
        padding-right: 0.1rem;
      }
      input::-webkit-search-cancel-button {
        width: 0.8em;
        min-height: 0.8em;
        margin-right: 0.15rem;
        padding: 0 0.5em 0 0;
      }
      .maintenance-searchSolid {
        position: absolute;
        right: 0.2rem;
        top: 0.73rem;
        font-size: 0.15rem;
        cursor: pointer;
      }
    }
    .list-main {
      height: 5rem;
      width: 100%;
      background-color: #ffffff;
      overflow-y: auto;
      position: absolute;
      border-left: 1px solid #cccccc;
      border-right: 1px solid #cccccc;
      .user-info {
        height: 0.5rem;
        width: 100%;
        line-height: 0.5rem;
        font-size: 0.16rem;
        border-bottom: 1px solid #ccc;
        text-align: left;
        cursor: pointer;
        .user-info-span {
          margin-left: 0.15rem;
        }
        .user-info-name {
          margin-left: 0.7rem;
        }
        img {
          height: 0.3rem;
          width: 0.3rem;
          border-radius: 50%;
          position: absolute;
          margin-top: 0.1rem;
          margin-left: 0.15rem;
        }
      }
      .userInfoActive {
        background-color: #ececef;
      }
    }
    .show-personnel-info {
      height: 0.5rem;
      line-height: 0.5rem;
      width: 100%;
      border: 1px solid #cccccc;
      position: absolute;
      bottom: 0;
      font-size: 0.16rem;
      text-align: left;
      background-color: #ffffff;
      span {
        margin-left: 0.12rem;
      }
      .userInfoSwitch {
        margin-left: 0.4rem;
      }
    }
  }
  .transform {
    transform: rotate(180deg);
  }
}
</style>
