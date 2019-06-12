<template>
  <div v-cloak ref="pageHeight" class="contentAll">
    <el-container>
      <el-aside
        :class="collapsed ? 'menu-collapsed' : 'menu-expanded'"
        class="menu-aside"
      >
        <div
          :class="
            collapsed
              ? 'gg-nav-head logo-collapse-width'
              : 'gg-nav-head logo-width'
          "
        >
          <a class="gg-logo">
            <span v-if="collapsed" class="gg-mini-logo"></span>
            <span v-else class="gg-logo-lg"></span>
          </a>
        </div>
        <!-- default-active="0-0" -->

        <el-scrollbar id="navScroll" class="navScroll bigMenu">
          <el-menu
            ref="elmenu"
            class="el-menu-vertical-demo"
            :default-active="lightMenu"
            @open="handleOpen"
            @close="handleClose"
            :default-openeds="[lightMenu.split('-')[0]]"
            unique-opened
            @select="handleselect"
            :collapse="collapsed"
            text-color="#6e7584"
            :collapse-transition="false"
            active-text-color="#fff"
          >
            <template v-for="(item, index) in listAll">
              <el-menu-item
                class="noChild"
                :key="index"
                :index="index + ''"
                v-if="item.children.length === 0"
                @click="changeMenu(item, item.resName, '', index, 0)"
              >
                <!--<i
                  :class="[
                    lightMenu.split('-')[0] == index ? item.icon : item.icon,
                    'navIcon'
                  ]"
                ></i>-->
                <i :class="item.resIcon"></i>
                <span slot="title" :title="item.resName">
                  {{ item.resName }}
                </span>
              </el-menu-item>

              <el-submenu
                :index="index + ''"
                :key="index"
                :show-timeout="timeOut"
                active-text-color="#fff"
                v-if="item.children && item.children.length != 0"
                popper-class="popperClass"
                font-size="1.6rem"
              >
                <template v-if="item.children != 0" slot="title">
                  <i :class="item.resIcon"></i>
                  <!-- <i
                    :class="[
                      lightMenu.split('-')[0] == !index
                        ? item.icon + 'Active'
                        : item.icon,
                      'navIcon'
                    ]"
                  ></i>-->
                  <span slot="title" :title="item.resName">
                    {{ item.resName }}
                  </span>
                </template>
                <el-menu-item-group
                  v-if="item.children != 0"
                  class="scroll-min"
                >
                  <el-menu-item
                    v-for="(itt, index1) in item.children"
                    :key="index1"
                    :index="index + '-' + index1"
                    @click="
                      changeMenu(
                        item.children[index1],
                        itt.resName,
                        item.resName,
                        index,
                        index1
                      )
                    "
                  >
                    <span slot="title" :title="itt.resName">
                      <strong class="point">·</strong>
                      <label>{{ itt.resName }}</label>
                    </span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </template>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container style="width:100%">
        <el-header id="change-style-header">
          <div class="tool gg-nav-collapse" @click.prevent="collapse">
            <span>
              <b class="maintenance-list"></b>
            </span>
          </div>
          <div class="top-r">
            <!-- 消息列表 -->
            <MessageReminder
              @changeNewsList="changeNewsList"
              ref="MessageReminder"
            ></MessageReminder>

            <em class="item_line"></em>
            <el-dropdown
              @command="handleCommand"
              @visible-change="changeCommand"
              trigger="hover"
            >
              <span class="el-dropdown-link userinfo-inner">
                <img :src="uerHead" :onerror="errorGoodsImg" />
                <span
                  >{{ userName }}
                  <i
                    class="el-select__caret el-input__icon sec_icon el-icon-arrow-down"
                  ></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item command="changePwd">
                  <b class="down maintenance-passowrd"></b>修改密码
                </el-dropdown-item>
                <el-dropdown-item command="switchCompanies">
                  <b class="down maintenance-switch"></b>切换企业
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <b class="down maintenance-exit"></b>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="mainPage" v-if="isRouterAlive">
          <nuxt exclude="RoutineDetails" keep-alive />
        </el-main>
      </el-container>
      <!-- 弹出修改密码 -->
      <el-dialog
        class="changePassword"
        title="修改密码"
        :visible.sync="dialogUpdatePwd"
        v-dialogDrag
        :close-on-click-modal="false"
        :before-close="handleClose_pwd"
        width="5.8rem"
      >
        <el-form
          :model="pwd_obj"
          :rules="rules"
          ref="pwd_obj"
          style="height:2.6rem;"
        >
          <div class="div-flex m_b20rem">
            <div class="form_title fs18px">
              <span class="red">*</span>
              原密码：
            </div>
            <div class="form_input_div">
              <el-form-item prop="oldPwd">
                <el-input
                  placeholder="请输入原密码"
                  type="password"
                  v-model="pwd_obj.oldPwd"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="div-flex m_b20rem">
            <div class="form_title fs18px">
              <span class="red">*</span>
              新密码：
            </div>
            <div class="form_input_div">
              <el-form-item prop="newPwd">
                <el-input
                  placeholder="请输入新密码"
                  type="password"
                  v-model="pwd_obj.newPwd"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="div-flex ">
            <div class="form_title fs18px">
              <span class="red">*</span>
              确认密码：
            </div>
            <div class="form_input_div">
              <el-form-item prop="reNewPwd">
                <el-input
                  placeholder="请再次输入新密码"
                  type="password"
                  v-model="pwd_obj.reNewPwd"
                ></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="text_center div-flex all_center" style="margin-top:.5rem">
            <el-button
              class="wb-clear"
              style="margin-right: .15rem;"
              @click="dialogUpdatePwd = false"
              round
              >取 消</el-button
            >
            <el-button class="wb-sure" round @click="submit_pwd('pwd_obj')"
              >确 定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
    </el-container>
    <!-- 弹出切换企业 -->
    <el-dialog
      class="switchEnterprise"
      title="选择企业"
      :visible.sync="previewVisible"
      :top="'0'"
      :close-on-click-modal="false"
      width="4.5rem"
    >
      <div id="loginDiv" class="login-div">
        <ul>
          <li
            :title="joinEnterprise.orgName"
            v-for="(joinEnterprise, index) in joinEnterpriseData"
            :key="index"
          >
            <!-- <span><input type="radio" name="radio" :value="joinEnterprise.id" :checked="isChecked" /></span>
              <span>{{joinEnterprise.orgName}}</span> -->

            <a
              v-if="joinEnterprise.isChecked"
              href="javascript:;"
              class="unchecked checked"
              :value="joinEnterprise.id"
              @click="enterprise($event)"
            >
              {{ joinEnterprise.orgName }}
              <b id="logo" class="el-icon-check"></b>
            </a>
            <a
              v-else
              href="javascript:;"
              class="unchecked"
              :value="joinEnterprise.id"
              @click="enterprise($event)"
              >{{ joinEnterprise.orgName }}</a
            >
          </li>
        </ul>
      </div>
      <div class="div-flex all_center">
        <el-button
          id="joinEnterprise"
          class="login-btn-dialog fs18px button-radius"
          type="warning"
          @click="joinEnterprise(joinEnterpriseData)"
          >进入企业</el-button
        >
      </div>
    </el-dialog>
    <FireAlarmBox></FireAlarmBox>
    <HelpCenter ref="HelpCenter"></HelpCenter>
  </div>
</template>
	<script>
import "babel-polyfill";
import { mapActions } from "vuex";
import Cookie from "js-cookie";
import api from "~/config/http";
import menuSystem from "~/config/menu_system";
import common from "~/utils/common";
import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { mapState, mapMutations } from "vuex";
import MessageReminder from "~/components/MessageReminder";
import FireAlarmBox from "~/components/FireAlarmBox";
import HelpCenter from "~/components/HelpCenter";
export default {
  middleware: "authenticated",
  components: {
    MessageReminder,
    FireAlarmBox,
    HelpCenter
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("提示：原密码输入错误请重新输入"));
      }
      callback();
    };
    var validatePass1 = (rule, value, callback) => {
      //验证密码必须由数字和字母组成，并且不能小于6位
      if (value === "") {
        callback(new Error("提示：密码至少6位数字或字母，请重新输入"));
      } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
        callback(
          new Error("请按规则填写密码(密码为6~14位，英文字母+数字组合)！")
        );
      } else {
        if (this.pwd_obj.reNewPwd !== "") {
          this.$refs.pwd_obj.validateField("reNewPwd");
        }
      }
      callback();
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("提示：两次密码输入不一致，请重新输入"));
      } else if (value !== this.pwd_obj.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      }
      callback();
    };
    return {
      pwd_obj: {
        oldPwd: "",
        newPwd: "",
        reNewPwd: ""
      },
      rules: {
        oldPwd: [{ validator: validatePass, trigger: ["blur"] }],
        newPwd: [{ validator: validatePass1, trigger: ["blur"] }],
        reNewPwd: [{ validator: validatePass2, trigger: ["blur"] }]
      },
      dialogUpdatePwd: false,
      collapsed: false,
      changePswVis: false,
      trueAlarmVis: false,
      isRouterAlive: true,
      //自适应屏幕高度 ryq
      fullHeight: process.browser ? document.documentElement.clientHeight : "0",
      classObj: {
        popperClass: {
          "max-height": "50px",
          "overflow-y": "auto",
          "overflow-x": "hidden"
        }
      },
      userName: "",
      userObj: "",
      orgName: "",
      timeOut: 1000,
      uerLogo: require("../assets/img/Overalllayout/new-portrait.png"),
      uerHead: "",
      errorGoodsImg:
        'this.src="' +
        require("../assets/img/Overalllayout/new-portrait.png") +
        '"',
      weatherInfo: "",
      weatherClass: "",
      lightMenu: api.getGlobalVal("CmenuName")
        ? api.getGlobalVal("CmenuName").lightMenu
        : "0",
      user: "",
      list: [],
      popAlarm: {},
      isPopOpen: false,
      socket: null,
      // 初始化 webSocket
      stompClient: null,

      // 选择企业开始
      previewVisible: false,
      joinEnterpriseData: [], //组织机构数据
      selectedEnterprises: "", // 选中企业
      userInfo: [] //用户信息
      // 选择企业结束
    };
  },
  mounted() {
    $(document).unbind("mousewheel");
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      $(document).unbind("DOMMouseScroll");
    }

    // this.$nextTick(function() {
    if (!api.getGlobalVal("maintenance_userObj")) return;
    this.browserEvent();
    this.pageInit();
    this.initColor();
    this.isload();
    //定时统计web用户在线时长
    this.statisticalDuration();
    // });
  },
  methods: {
    statisticalDuration() {
      //定时统计web用户在线时长
      setInterval(function() {
        let eventLevelVariables = {
          userId_var: api.getGlobalVal("maintenance_userObj").id,
          userName_var:
            api.getGlobalVal("maintenance_userObj").name ||
            api.getGlobalVal("maintenance_userObj").loginName,
          onlineTime_var: 1
        };
        // gio("track", "webUserOnlineStatistics", eventLevelVariables);
      }, 60000);
    },
    // 提交修改密码
    submit_pwd(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.request_closepwd();
        } else {
          return false;
        }
      });
    },
    request_closepwd() {
      let _this = this;
      var obj = {
        userId: api.getGlobalVal("maintenance_userObj").userId,
        password: _this.pwd_obj.newPwd,
        updateUserId: api.getGlobalVal("maintenance_userObj").userId
      };
      api
        .post(
          api.forent_url.maintenance_service_url + "/userAuth/updateUserPwd",
          obj
        )
        .then(function(response) {
          let code = response["code"];
          if (code == "success") {
            let res = response.data;
            _this.dialogUpdatePwd = false;
            //退出登录后清除cookie和store中的数据
            api.removeGlobalVal("maintenance_userObj");
            api.removeGlobalVal("userToken");
            _this.$store.commit("update", "");
            _this.$store.commit("updateUserObj", {});
            _this.$router.push({
              path: "/login"
            });
          } else {
            _this.$Message.error(data["message"]);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    // 关闭修改密码
    handleClose_pwd() {
      this.$refs["pwd_obj"].resetFields();
      this.dialogUpdatePwd = false;
    },
    // f5刷新时跳到首页
    isload() {
      api.setGlobalVal("CmenuName", "0");
      this.lightMenu = "0";
      this.$router.push({ name: "main-main" });
    },
    reload() {
      //当前页刷新
      this.isRouterAlive = false;
      this.$nextTick(function() {
        //    	this.$route.params = {}
        this.isRouterAlive = true;
        // 刷新消息

        this.changeNewsList();
        this.previewVisible = false;
      });
      this.$store.commit("updateUserObj", this.userObj);
      this.orgName = this.userObj.orgName;
    },
    browserEvent() {
      //浏览器的回退事件，联动导航菜单和面包屑；
      let _key,
        _index,
        listAll,
        that = this;
      if (window.history) {
        $(".el-submenu .el-submenu__title").css("background", "transparent");
        window.addEventListener("popstate", function() {
          let pathname = window.location.pathname;
          let pathnameArr = pathname.split("/").slice(-2);
          let _pathname = pathnameArr[0] + "-" + pathnameArr[1]; //.replace("/","-")
          listAll = that.list;
          //      	console.log(_pathname)
          if (_pathname === "main-main") {
            api.setGlobalVal("CmenuName", "0");
            that.lightMenu = "0";
          } else {
            listAll.forEach(function(item, index) {
              if (item.children.length > 0) {
                item.children.forEach(function(ele, key) {
                  if (ele.resAlias === _pathname) {
                    api.setGlobalVal(
                      "CmenuName",
                      JSON.stringify({
                        name: ele.resName,
                        parName: item.resName,
                        lightMenu: index + "-" + key
                      })
                    );
                    that.lightMenu = index + "-" + key;
                  }
                });
              }
            });
          }
          setTimeout(function() {
            $(".is-opened .el-submenu__title").css("background", "#313a50");
          }, 300);
        });
      }
    },
    collapse: function() {
      this.collapsed = !this.collapsed;
      this.$store.commit("pageW", Math.random());
      this.initColor();
    },
    handleClose(key, keyPath) {
      $(".el-submenu .el-submenu__title").css("background", "transparent");
    },
    handleOpen(key, keyPath) {
      this.lightMenu = key + "";
      setTimeout(() => {
        //  		$(".el-submenu .el-submenu__title").css("background","transparent")
        $(".is-opened .el-submenu__title").css("background", "#313a50");
        let name = api.getGlobalVal("CmenuName");
        let item = this.list[key].children[0];
        let url = item.resAlias;
        api.setGlobalVal(
          "CmenuName",
          JSON.stringify({
            name: item.resName,
            parName: this.list[key].resName,
            lightMenu:
              item.resName && item.resName == "首页" ? "0" : key + "-" + 0
          })
        );
        this.$router.push({
          name: url ? url : "Building",
          params: {
            name: item.resName,
            parName: this.list[key].resName
          }
        });
      }, 300);
    },
    handleselect: function(a, b) {},
    handleCommand(command) {
      if (command == "logout") {
        this.$confirm("是否确认退出?", "提示", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          closeOnClickModal: false
        })
          .then(() => {
            //退出登录后清除cookie和store中的数据
            api.removeGlobalVal("maintenance_userObj");
            api.removeGlobalVal("userToken");
            this.$store.commit("update", "");
            this.$store.commit("updateUserObj", {});
            this.$router.push({
              path: "/login"
            });
          })
          .catch(err => {});
      } else if (command == "changePwd") {
        this.dialogUpdatePwd = true;
      } else if (command == "switchCompanies") {
        this.getEnterprise();
        // this.previewVisible = true;
      }
    },
    pageInit() {
      this.getUserObj();
      const that = this;
      if (process.browser) {
        window.onresize = () => {
          return (() => {
            that.fullHeight = document.documentElement.clientHeight;
            that.$refs.pageHeight.style.height = that.fullHeight + "px";
          })();
        };
      }
    },
    getUserObj: function() {
      if (!api.getGlobalVal("maintenance_userObj")) return;
      this.userObj = api.getGlobalVal("maintenance_userObj");
      this.$store.commit("updateUserObj", this.userObj);
      this.userName = this.userObj.name;
      this.orgName = this.userObj.orgName;
      this.uerHead =
        api.forent_url.image_url + this.userObj.headPortrait || this.uerLogo;
      this.init();
    },

    init: function() {
      let that = this;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0,0,0,0.8)",
        customClass: "border",
        target: document.getElementById("navScroll")
      });
      let userObj = api.getGlobalVal("maintenance_userObj");
      this.jump_attr = "resAlias";
      api
        .post(
          api.forent_url.maintenance_service_url +
            "/userAuth/findResourceByAuthId",
          {
            authId: userObj.authId,
            userId: userObj.id,
            userToken: userObj.userToken
          }
        )
        .then(function(response) {
          let code = response["code"];
          if (code == "success") {
            let res = response.data;
            that.list = res;
            //api.setGlobalVal("CmenuList",res);
            let params = {
              name: "menulist",
              content: res
            };
            that.$store.dispatch("AppInfo/setMenulist", params);

            loading.close();
          } else {
            that.$Message.error(response["message"]);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //页面跳转
    changeMenu: function(item, pathName, parName, index, index1) {
      let name = api.getGlobalVal("CmenuName").name;
      let url = item[this.jump_attr];

      //    $(".el-submenu .el-submenu__title").css("background","transparent")
      if (name == pathName) {
        this.$route.params.menuName = undefined;
        this.$route.params.isEmergency = undefined;
        this.$route.params.isRoutine = undefined;
        this.$route.params.flag = false;
        this.reload();
      }
      api.setGlobalVal(
        "CmenuName",
        JSON.stringify({
          name: pathName,
          parName: parName,
          lightMenu: pathName && pathName == "首页" ? "0" : index + "-" + index1
        })
      );
      this.$router.push({
        name: url ? url : "Building",
        params: {
          name: pathName,
          parName: parName
        }
      });
      //    setTimeout(function(){
      //    	$(".is-opened .el-submenu__title").css("background","#313a50")
      //    },300)
    },
    changeCommand(item) {
      if (item) {
        $(".sec_icon").addClass("el-icon-arrow-up");
      } else {
        $(".sec_icon").removeClass("el-icon-arrow-up");
      }
    },

    openChildDialog() {
      this.$refs.childNode.opendialog(true);
    },
    initColor() {
      let val = "#313a50";
      setTimeout(() => {
        let subItem = [].slice
          .call(document.getElementsByClassName("el-submenu"))
          .map(item => {
            item.onmouseover = function() {
              //            let _child = item.childNodes[0];
              //            if (_child.nodeName === "SPAN") {
              //              item.style.background = val;
              //            }
            };
            //          item.onclick = function() {
            //            [].slice
            //              .call(document.getElementsByClassName("el-menu-item"))
            //              .map(i => {
            //                i.isClick = false;
            //                let _child = i.childNodes[0];
            //                if (_child.nodeName === "SPAN") {
            //                  _child.style.background = "";
            //                }
            //              });
            //            item.isClick = true;
            //            let _child = item.childNodes[0];
            //            if (_child.nodeName === "SPAN") {
            //              _child.style.background = val;
            //            }
            //          };
            item.onmouseleave = function() {
              let hasClass = $(item).hasClass("is-active");
              if (hasClass) {
                item.childNodes[0].style.background = val;
              }
              if (!item.isClick) {
                item.childNodes[0].style.background = "";
              }
            };
          });
        let _active = document.getElementsByClassName("el-menu-item is-active");
        if (_active.length !== 0) {
          _active[0].isClick = true;
          //        let _child = _active[0].childNodes[0];
          //        if (_child.nodeName === "SPAN") {
          //          _child.style.background = val;
          //        }
        } else {
          this.initColor();
        }
      }, 500);
    },
    setColor() {
      let val = "#ff6722";
      let restoreVal = "#6E7584";
      setTimeout(() => {
        let _noActive = document.getElementsByClassName("el-menu-item");
        if (_noActive.length > 0) {
          for (let i = 0; i < _noActive.length; i++) {
            let item = _noActive[i];
            item.isClick = false;
            let _child = item.childNodes[0];
            if (_child.nodeName === "SPAN") {
              _child.style.color = restoreVal;
            }
          }
        }
        let _active = document.getElementsByClassName("el-menu-item is-active");
        if (_active.length !== 0) {
          _active[0].isClick = true;
          let _child = _active[0].childNodes[0];
          if (_child.nodeName === "SPAN") {
            _child.style.color = val;
          }
        }
      });
    },

    // 选择企业开始
    joinEnterprise(data) {
      //选择组织机构进入企业
      let that = this;
      let obj;
      for (let j = 0; j < data.length; j++) {
        if (data[j].id == this.selectedEnterprises) {
          obj = data[j];
        }
      }
      if (this.selectedEnterprises) {
        if (obj.authStatus == "0") {
          that.joinSystem(obj);
        } else if (obj.authStatus == "2") {
          Message.error("此账号已经被该组织机构锁定！");
        } else if (obj.authStatus == "1") {
          Message.error("此账号已经被该组织机构注销！");
        }
      } else {
        Message.error("请选择需要进入的组织机构");
      }
    },
    changeNewsList() {
      this.$refs.MessageReminder.getNewsList();
    },
    joinSystem(orgInfo) {
      let userInfo = api.getGlobalVal("maintenance_userObj");
      let that = this;
      let serverUrl =
        api.forent_url.maintenance_service_url +
        "/userAuth/getIdByUserIdAndOrg";
      let params = {
        userId: userInfo.userId,
        sysCode: "sys_maintenance_web",
        orgCode: orgInfo.orgCode
      };
      api.get(serverUrl, params, 0).then(obj => {
        if (obj && obj["code"] == "success") {
          let authorizedId = obj["data"].id;
          let headPortrait = obj["data"].headPortrait;
          let data = {
            id: authorizedId,
            userId: userInfo.userId,
            name: userInfo.userName || userInfo.name,
            loginName: userInfo.loginName,
            orgCode: orgInfo.orgCode,
            orgName: orgInfo.orgName,
            userToken: userInfo.userToken,
            authId: orgInfo.authId,
            headPortrait: headPortrait,
            sysCode_app: "sys_maintenance_app",
            sysCode_web: "sys_maintenance_web"
          };
          api.setGlobalVal("maintenance_userObj", JSON.stringify(data));
          api.setGlobalVal("userToken", data.userToken);
          api.setGlobalVal(
            "CmenuName",
            JSON.stringify({
              lightMenu: "0"
            })
          );
          //维保埋点
          let urlGrowingIo =
            api.forent_url.maintenance_service_url +
            "/userInfo/getUserAboutInfoById";
          api
            .get(
              urlGrowingIo,
              {
                id: data.id
              },
              0
            )
            .then(ret => {
              let retData = ret.data;
              // gio("setUserId", data.id);
              // gio("people.set", {
              //   userName_ppl: retData.userName_ppl,
              //   userPhone_ppl: retData.userPhone_ppl,
              //   userRole_ppl: retData.userRole_ppl,
              //   userUnitCity_ppl: retData.cityName_ppl,
              //   subCenterName_ppl: retData.yyzxName_ppl,
              //   userUnitName_ppl: retData.wbgsName_ppl,
              //   unitUserNum_ppl: retData.wbzxUserNum_ppl,
              //   userLoginName_ppl: retData.loginName_ppl
              // });
            });
          that.$router.push({ name: "main-main" });
          that.reload();
        } else {
          that.$message.error("获取授权id失败！");
        }
      });
    },
    enterprise(dom) {
      $(".unchecked").removeClass("checked");
      $(".el-icon-check").remove();
      this.selectedEnterprises = $(dom.currentTarget).attr("value");
      $(dom.currentTarget).addClass("checked");
      $(dom.currentTarget).append("<b id='logo' class='el-icon-check'></b>");
    },
    getEnterprise() {
      let that = this;
      let getOrgListByUserId =
        api.forent_url.maintenance_service_url + "/userAuth/getOrgListByUserId";
      let params1 = {
        userId: api.getGlobalVal("maintenance_userObj").userId,
        sysCode: "sys_maintenance_web"
      };
      //根据用户id获取组织机构
      api.post(getOrgListByUserId, params1, 0).then(obj_1 => {
        if (obj_1 && obj_1["code"] == "success") {
          let data = obj_1["data"];
          // let data = [{"id":"13073518398e11e9aa36000c2927c352","orgCode":"340104FWJG201806250001","parentOrgCode":"-1","orgName":"合肥科大立安安全技术股份有限公司","orgAlias":"合肥科大立安安全技术股份有限公司","orgType":"","sysCode":"sys_maintenance_web","dataRes":"","createUserId":"","updateUserId":"","authId":"2c938c4d6a302f22016a30694359010b","isDefault":"","authStatus":"0"}]
          // data = data.concat(data);
          // data.length = 3
          that.joinEnterpriseData = data;
          if (data && data.length > 0) {
            if (data.length == 1) {
              if (data[0].authStatus == "0") {
                this.$message({
                  message: "该用户只分配了一个组织机构",
                  type: "error",
                  duration: 4000
                });
                // this.joinSystem(data[0]);
              } else if (data[0].authStatus == "2") {
                GS.$Message.error("用户已经被锁定！");
              } else if (data[0].authStatus == "1") {
                GS.$Message.error("用户已经被注销！");
              }
            } else {
              that.previewVisible = true;
              let maintenance_userObj = api.getGlobalVal("maintenance_userObj");
              for (let i = 0; i < data.length; i++) {
                if (
                  maintenance_userObj &&
                  maintenance_userObj.orgCode == data[i].orgCode
                ) {
                  that.joinEnterpriseData[i].isChecked = true;
                  that.selectedEnterprises = data[i].id;
                  break;
                } else {
                  that.joinEnterpriseData[i].isChecked = false;
                }
              }
              //  if(!maintenance_userObj||!maintenance_userObj.orgCode){
              //    that.joinEnterpriseData[0].isChecked=true;
              //    that.selectedEnterprises = that.joinEnterpriseData[0].id
              //  }
            }
          } else {
            this.$message.error("该账号没有在系统下授权！");
          }
        } else {
          this.$message.error("该账号没有在系统下授权！");
        }
      });
    }
    // 选择企业结束
  },
  computed: {
    listAll: function() {
      return this.list;
    },
    ...mapState(["GroupFlag"])
  },
  watch: {
    $route(to, from, sd) {
      this.setColor();
      $(".el-submenu .el-submenu__title").css("background", "transparent");
      this.lightMenu = api.getGlobalVal("CmenuName").lightMenu;
      if (!this.lightMenu) {
        this.lightMenu = "0";
      }
      setTimeout(function() {
        $(".is-opened .el-submenu__title").css("background", "#313a50");
      });
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    //自适应屏幕高度，监听屏幕高度 ryq
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
        }, 400);
      }
    }
  }
};
</script>
	<style lang='scss' scoped>
// @import "../assets/font-icon/style.css";
.el-menu-item * {
  cursor: pointer;
}
/deep/.el-menu {
  background-color: #1e2330;
}
.contentAll {
  position: relative;
}
/* 全局弹框动画效果 */
.form_input_div {
  width: 75%;
}
.form_input_div .el-form-item {
  margin-bottom: 0;
}
.form_input_div /deep/ .el-form-item__error {
  padding-top: 0;
}
.red {
  color: #ff2626;
  margin-right: 0.1rem;
  position: relative;
  top: 2px;
}
.form_title {
  width: 1.2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #454545;
}
@keyframes dialog-fade-in {
  0% {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(-100%, 0, 0);
    opacity: 0;
  }
}

.top-r {
  cursor: pointer;
  display: flex;
  justify-items: center;
  align-items: center;
  margin-right: 0.2rem;
  .item_line {
    width: 0;
    border-right: 1px solid#D7D7D7;
    height: 0.28rem;
    position: relative;
    right: 0.15rem;
    // transform: translate(-50%,-50%);
  }
  .el-button {
    width: 32px;
    height: 32px;
  }
  img {
    border-radius: 50%;
    margin-right: 0.2rem;
  }
  .el-badge {
    right: 0.5rem;
  }
  .el-dropdown span {
    display: flex;
    color: #727989;
    justify-items: center;
    align-items: center;
  }
}

.el-button.is-circle {
  padding: 0;
}
.el-badge__content {
}
/deep/.el-badge__content {
  padding: 0 3px;
  line-height: 16px;
}
/deep/.el-submenu {
  /*>li{*/
  &:hover {
    /*background-color:#313a50;*/
  }
  /*}*/
}
/deep/.is-active {
  /deep/.el-submenu__title {
    span {
      color: #fff;
    }
  }
}
/deep/.is-opened {
  /deep/.el-submenu__title {
  }
}
// 修改密码
.changePassword {
  /deep/.el-dialog {
    margin-top: 0 !important;
  }
}
// 选择企业开始
.switchEnterprise {
  display: block;
  /deep/.el-dialog {
    margin: 0 auto;
    border-radius: 0.05rem;
    position: fixed;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    height: 2.78rem;
    .el-dialog__header {
      background-color: #ff7b45 !important;
      padding: 0.15rem;
      height: 0.5rem;
      border-top-right-radius: 0.05rem;
      border-top-left-radius: 0.05rem;
      .el-dialog__title {
        color: #ffffff;
        font-size: 0.18rem;
        line-height: 0.18rem;
      }
      .el-dialog__headerbtn {
        top: 0.16rem;
      }
    }
    .el-dialog__body {
      padding: 0.3rem 0.2rem 0.2rem;
    }
    .unchecked {
      display: block;
      text-decoration: none;
      color: #828285;
      width: 100%;
      text-align: center;
      font-size: 0.18rem;
      background: rgba(245, 245, 245, 1);
      border-radius: 4px;
    }
    .checked {
      background: rgba(255, 241, 235, 1) !important;
      color: #ff7b45 !important;
    }
    #logo {
      position: absolute;
      top: -0.2rem;
      right: -0.22rem;
      width: 0.44rem;
      height: 0.4rem;
      background: rgba(255, 123, 69, 1);
      border-radius: 0.2rem;
      color: #fff;
    }
    .el-icon-check:before {
      position: absolute;
      top: 0.2rem;
      left: 0.04rem;
    }
  }
}

.login-div {
  width: 100%;
  max-height: 1.98rem;
  overflow: auto;
  ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
    li {
      height: 0.46rem;
      line-height: 0.46rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-bottom: 0.2rem;
      a {
        position: relative;
      }
    }
  }
}
.login-btn-dialog {
  text-align: center;
  width: 1.48rem;
  height: 0.36rem;
  background: rgba(255, 104, 34, 0);
  border: 1px solid rgba(255, 104, 34, 1);
  border-radius: 0.18rem;
  margin-top: 0.1rem;
}
/deep/.login-btn-dialog {
  color: #ff6822;
}
// 选择企业结束
</style>
