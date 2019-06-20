<template>
  <div class="title-main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item ><span class="maintenance-location"></span>当前位置：</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="CmenuName.parName">{{ CmenuName.parName }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="curpath">{{ CmenuName.name }}</el-breadcrumb-item> -->
      <el-breadcrumb-item v-for="item in levelList" v-bind:key="item.title"  @click.native="breadcrumbClick(item)" >{{item.title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <h1 class="l-head"><span >当前位置:</span><span >{{CmenuName.parName}} > </span><span>{{CmenuName.name}}</span></h1> -->
  </div>
</template>
<script>
import api from "~/config/http";
import {getStorage} from '~/utils/storage';
import mixin from "~/mixin/mixin";
export default {
  inject: ['reload'],
  mixins: [mixin],
  data() {
    return {
      CmenuName: api.getGlobalVal("CmenuName"),
      levelList: [],
      lightMenuArr: api.getGlobalVal("CmenuName") && api.getGlobalVal("CmenuName").lightMenu.split('-'),
      storageMenulist: [],
      curMenulist: [],
      level: 0,
      backCount: 0,
      whiteList: [
        'RoutineMaintenancePlanningControl-ProprietorPlanList'
      ],
      rootnodeName: '',
      levelDetail: null,
      curpath: this.$route.path
    };
  },
  props: {
    isLevelDetail: {
      type: Boolean,
      default: false
    }
  },
  watch: {
      $route() {
        
        //this.browserBackEvent();
        //this.getBreadcrumb();
      }
  },
  created(){
      //
  },
  destroyed(){
    window.removeEventListener('popstate', this.goHome, false);
  },
  methods:{
      goHome(){
        this.$router.replace({path: '/'});
        //replace替换原路由，作用是避免回退死循环
      },
      updateTitle() {
        //debugger
        let pageParams= api.getGlobalVal("pageParams");
        let paramCrumb = {
          name: "例行维保计划制定列表",//title name
              parName: "例行维保计划制定",//父级title name
              lightMenu:  "4-1-0",
              linkname: "MaintenanceManagement-RoutineMaintenancePlanningControl-ProprietorPlanList",
              path: "MaintenanceManagement-RoutineMaintenancePlanningControl-ProprietorPlanList"
        };
        this.setDetailBreadcrumb(paramCrumb,true);
        /*this.$router.replace({
          name:
            "MaintenanceManagement-RoutineMaintenancePlanningControl-ProprietorPlanList",
          params: pageParams
        });*/
      },
      browserBackEvent() {
        //浏览器的回退事件，联动导航菜单和面包屑；
        //debugger
        //console.log('browserBackEvent-----:');
        let _key,
          _index,
          listAll,
          that = this;
        if (window.history) {
          //debugger
          $(".el-submenu .el-submenu__title").css("background", "transparent");
          window.addEventListener("popstate", function(e) {
            if(that.backCount!==0)return;
            let pathname = window.location.pathname;
            let pathnameArr = pathname.split("/").slice(-2);
            let _pathname = pathnameArr[0] + "-" + pathnameArr[1]; //.replace("/","-")
            listAll = that.storageMenulist;
            //debugger
              //console.log(_pathname)
            //if(that.whiteList.includes(_pathname)){
            if(that.whiteList.includes('RoutineMaintenancePlanningControl-ProprietorPlanList')){
              //window.removeEventListener('popstate', that.childGoBack, false);
              that.updateTitle();
              that.reload();
              //return;
            }
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
                      //debugger

                      that.levelList = [];//先清空
                      that.CmenuName = api.getGlobalVal("CmenuName");
                      that.lightMenuArr = that.CmenuName ?  that.CmenuName.lightMenu.split('-') : [];

                      that.curMenulist = that.storageMenulist ? that.storageMenulist : [];
                      //console.log('getBreadcrumb-----that.curMenulist:'+JSON.stringify(that.curMenulist));
                      that.levelFilter(that.curMenulist,that.level);
                      
                        //console.log('browserBackEvent-----that.levelList:'+JSON.stringify(that.levelList));
                        ++that.backCount;
                        that.reload();


                    }
                  });
                }
              });
            }
            /*setTimeout(function() {
              $(".is-opened .el-submenu__title").css("background", "#313a50");
            }, 300);*/
          });
        }
        //console.log('befor end --browserBackEvent-----that.levelList:'+JSON.stringify(that.levelList));
      },
      addLevelDetail(len){
        let _this = this;
        //console.log('addLevelDetail----curLightMenuLen:'+len);
        _this.levelDetail = api.getGlobalVal("LevelDetail");

        if(len >2 && _this.levelDetail){//len >2 表示是详情页级别页面
          //_this.levelList.push(_this.levelDetail);
          _this.addLevelArr(_this.levelList,_this.levelDetail);
        }
      },
      breadcrumbClick (item){
        let _this = this;
        //debugger
        _this.curMenulist = _this.storageMenulist ? _this.storageMenulist : [];
        _this.levelList = [];//先清空
        _this.levelFilter(_this.curMenulist,_this.level);

        let curLightMenuLen = item.lightMenu.split('-').length;
        _this.addLevelDetail(curLightMenuLen);

        api.setGlobalVal(
          "CmenuName",
          JSON.stringify({
            name: item.title,
            parName: item.rootTitleName,
            lightMenu: item.lightMenu
          })
        );

        _this.$router.push({
            name: item.name ? item.name  : "Building"
        });

      },
      levelFilter (item,level){
        let _this = this;
        //debugger;

          let len = _this.lightMenuArr && _this.lightMenuArr.length;
          let parent = _this.curMenulist[_this.lightMenuArr[0]];
          let rootnodeRoute = "";
          let firstchildRoute = "";
          if(level>=len)return;

          parent = item[_this.lightMenuArr[level]]//level是下标
          //parent = item[ele];//ele是菜单列表的下标
          if(level==0){
             if (parent.children.length == 0) return;
             rootnodeRoute = '/'+parent.children[0].resAlias.replace('-','/');//第一个子节点作为根节点的route
             let title = parent.resName;
             _this.rootnodeName = parent.resName;

             let curName = parent.children[0].resAlias;
             let curlightMenu = _this.lightMenuArr[0]+"-0";
             let curLevelItem = {
                name: curName,
                lightMenu:curlightMenu,
                path:rootnodeRoute,
                rootTitleName:_this.rootnodeName,
                title:title
              };

             //_this.levelList.push(curLevelItem);
             _this.addLevelArr(_this.levelList,curLevelItem);

             _this.curMenulist = parent.children;
             _this.levelFilter(parent.children,++level);
          }
          else {//level下标为>0，level值等于0时（level值是菜单列表的下标）
                //debugger;
                firstchildRoute = '/'+item[_this.lightMenuArr[level]].resAlias.replace('-','/');
                let title = item[_this.lightMenuArr[level]].resName;

                let curName = item[_this.lightMenuArr[level]].resAlias;
                let curlightMenu = _this.lightMenuArr[0]+"-"+_this.lightMenuArr[level];
                //console.log('--levelFilter--curlightMenu:',curlightMenu);
                let curLevelItem = {
                    name: curName,
                    lightMenu:curlightMenu,
                    path:firstchildRoute,
                    rootTitleName:_this.rootnodeName ? _this.rootnodeName : '',
                    title:title
                };
                //_this.levelList.push(curLevelItem);
                _this.addLevelArr(_this.levelList,curLevelItem);


              if( parent.children.length != 0){
                _this.curMenulist = parent.children;
                _this.levelFilter(parent.children,++level);
              }

          }//level下标为>0

      },
      addLevelArr(ObjArr,ObjItem){//不重复添加对象
          let _this = this;
          //debugger;
          let isInCurArr = ObjArr.findIndex(p => {
            return p.title == ObjItem.title;
          })

          if(isInCurArr == -1 ){//-1对象表示不在数组中
            ObjArr.push(ObjItem);
          }

      },
      getStorageMenulist(){
        let _this = this;
        let params = {
              name: 'menulist',
              debug: false
            };
        _this.storageMenulist = getStorage(params);
      },
      getBreadcrumb() {
        //debugger
        let _this = this;

        //this.browserBackEvent();
        //debugger;
        _this.levelList = [];//先清空
        _this.CmenuName = api.getGlobalVal("CmenuName");
        _this.lightMenuArr = _this.CmenuName ?  _this.CmenuName.lightMenu.split('-') : [];

        _this.curMenulist = _this.storageMenulist ? _this.storageMenulist : [];
        //console.log('getBreadcrumb-----_this.curMenulist:'+JSON.stringify(_this.curMenulist));
        _this.levelFilter(_this.curMenulist,_this.level);
        let curLightMenuLen = _this.lightMenuArr.length;
        _this.addLevelDetail(curLightMenuLen);

        //console.log('-----------getBreadcrumb-----that.levelList:'+JSON.stringify(_this.levelList));

      }
  },
  mounted() {
    this.CmenuName = api.getGlobalVal("CmenuName");
    this.getStorageMenulist();
    this.browserBackEvent();
    this.getBreadcrumb();

  }
};
</script>
<style lang="scss" scoped>

.title-main {
  font-size:.18rem;
  font-family:'MicrosoftYaHei';
  font-weight:400;
  color:#1E2330;
  // background-color: #eff3f6;
  height: .7rem;
  padding-left: 20px;
  display: flex;
  align-items: center;
}
.l-head {
  span {
    font-size: .18rem;
    line-height: .39rem;
  }
}
/deep/.el-breadcrumb__item {
    float: none;
}
/deep/.el-breadcrumb__item:first-child {
  .maintenance-location {
    color: #5F687F;
    margin-right: 0.1rem;
  }
  .el-breadcrumb__inner,
  .el-breadcrumb__inner:hover {
    color: #5F687F;
    cursor: text;
  }
  .el-breadcrumb__separator {
    color: #5F687F;
  }
  i {
    display: none;
  }
}
/deep/.el-breadcrumb__item{
  .el-breadcrumb__inner:hover {
      color: #ff6822;
      cursor: pointer;
  }
}

/deep/.el-breadcrumb__item:last-child {
  .el-breadcrumb__inner,
  .el-breadcrumb__inner:hover {
    color: #1E2330;
    cursor: text;
  }
}
/deep/.el-breadcrumb__item {
  .el-breadcrumb__inner {
    color: #5F687F;
  }
  i {
    color: #5F687F;
  }
}
@media screen and (max-width: 1440px) {
  .l-head {
    span {
    }
  }
}
</style>
