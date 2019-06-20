  import api from "~/config/http";

  export default {
    methods: {
        //添加详情页面包屑导航
        setDetailBreadcrumb(paramCrumb,isLevelDetail){
          //console.log('_-------paramCrumb:'+JSON.stringify(paramCrumb));
          //debugger;
          if(isLevelDetail){
            api.setGlobalVal(
                  "CmenuName",
                  JSON.stringify({
                    name: paramCrumb.name,//title name
                    parName: paramCrumb.parName,//父级title name
                    lightMenu: paramCrumb.lightMenu
                  })
                );
                //console.log('_api.getGlobalVal("CmenuName"):'+JSON.stringify(api.getGlobalVal("CmenuName")));
            //debugger
            api.setGlobalVal(
                  "LevelDetail",
                  JSON.stringify({
                    name: paramCrumb.linkname,
                    lightMenu: paramCrumb.lightMenu,
                    path: paramCrumb.path,
                    rootTitleName: paramCrumb.parName,
                    title: paramCrumb.name
                  })
                );
            //console.log('_api.getGlobalVal("LevelDetail"):'+JSON.stringify(api.getGlobalVal("LevelDetail")));
                //debugger;
            if(paramCrumb.pageParams){
              api.setGlobalVal(
                  "pageParams",
                  JSON.stringify({
                    pageParams: paramCrumb.pageParams
                  })
                );
            }
            //console.log('_api.getGlobalVal("pageParams"):'+JSON.stringify(api.getGlobalVal("pageParams")));
            //
          }

        },
        delKeepAlive(){
          if (this.$vnode && this.$vnode.data.keepAlive)
          {
              if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache)
              {
                  if (this.$vnode.componentOptions)
                  {
                      var key = this.$vnode.key == null
                                  ? this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
                                  : this.$vnode.key;
                      var cache = this.$vnode.parent.componentInstance.cache;
                      var keys  = this.$vnode.parent.componentInstance.keys;
                      //debugger;
                      if (cache[key])
                      {
                          if (keys.length) {
                              var index = keys.indexOf(key);
                              if (index > -1) {
                                  keys.splice(index, 1);
                              }
                          }
                          delete cache[key];
                      }
                  }
              }
          }
          this.$destroy();
        },
        handleClose(){
            
        }
    }
  };