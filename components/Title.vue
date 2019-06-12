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
  mixins: [mixin],
  data() {
    return {
      CmenuName: api.getGlobalVal("CmenuName"),
      levelList: [],
      lightMenuArr: api.getGlobalVal("CmenuName") && api.getGlobalVal("CmenuName").lightMenu.split('-'),
      storageMenulist: [],
      curMenulist: [],
      level: 0,
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
          this.getBreadcrumb()
      }
  },
  created(){
      //
  },
  methods:{
      addLevelDetail(len){
        let _this = this; 
        //console.log('addLevelDetail----curLightMenuLen:'+len);
        _this.levelDetail = api.getGlobalVal("LevelDetail");

        //console.log('_this.levelDetail----_this.levelDetail:'+JSON.stringify(_this.levelDetail));
        //console.log('push前----__this.levelList:'+JSON.stringify(_this.levelList));

        if(len >2 && _this.levelDetail){//len >2 表示是详情页级别页面
          //_this.levelList.push(_this.levelDetail);
          _this.addLevelArr(_this.levelList,_this.levelDetail);
        }

        //console.log('push后--addLevelDetail----levelList:'+JSON.stringify(_this.levelList)); 

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
        
        //console.log('_-------api.getGlobalVal("CmenuName"):'+JSON.stringify(api.getGlobalVal("CmenuName")));

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
        let _this = this;
        //debugger
        //console.log('_this.lightMenuArr-----:'+JSON.stringify(_this.lightMenuArr));
        //console.log('this.CmenuName-----:'+JSON.stringify(this.CmenuName));
        _this.curMenulist = _this.storageMenulist ? _this.storageMenulist : [];
        //console.log('getBreadcrumb-----_this.curMenulist:'+JSON.stringify(_this.curMenulist));
        _this.levelFilter(_this.curMenulist,_this.level);

        let curLightMenuLen = _this.lightMenuArr.length;
        
        //console.log('getBreadcrumb-----_api.getGlobalVal("CmenuName").lightMenu:',api.getGlobalVal("CmenuName").lightMenu);
        //console.log('getBreadcrumb-----_this.lightMenuArr,_this.lightMenuArr.length:'+JSON.stringify(_this.lightMenuArr),_this.lightMenuArr.length);
        _this.addLevelDetail(curLightMenuLen);
        
      }
  },
  mounted() {
    //debugger;
    this.CmenuName = api.getGlobalVal("CmenuName");
    this.getStorageMenulist();
    this.getBreadcrumb();

  }
};
</script>
<style lang="scss" scoped>

.title-main {
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
