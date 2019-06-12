import Vuex from 'vuex'
import vuexModules from './modules'

//i18n
import Locale from '~/locales'
var cookieparser = process.server ? require('cookieparser') : undefined
const createStore = () => {
  return new Vuex.Store({
    state: {
      auth: null,
      userObj: null,
      count: 0,
      //i18n
      locales: Locale(),
      locale: Locale()[0],
      pageWidB:false,
      floorDetail:0,
      floorDetailObj:'',
      linyiFloor:'',
      GroupFlag:false
    },
    mutations: {
      update(state, data) {
        state.auth = data
      },
      updateUserObj(state, data) {
        state.userObj = data
      },
      updateZSBuildData(state, data) {
        state.ZS.MONITOR.buildData = data
      },
      updateZSCurrentBuild(state, data){
        state.ZS.MONITOR.currentBuild = data
      },
      updateZSCurrentBuildname(state, data){
        state.ZS.MONITOR.currentBuildname = data
      },
      updateZSCurrentFloor(state, data){
        state.ZS.MONITOR.currentFloor = data
      },
      updateZSPicUrl(state, data){
        state.ZS.MONITOR.picUrl = data
      },
      updateZSdeviceTypeId(state, data){
        state.ZS.MONITOR.deviceQueryType = data
      },
      updateZSdeviceStatus(state, data){
        state.ZS.MONITOR.deviceStatus = data
      },
      updateZSDlclick(state, data){
        state.ZS.MONITOR.dlClick = data
      },
      updateZSDevice(state, data){
        state.ZS.MONITOR.currentDevice = data
      },
      updateFloor_g2map(state, data){
        state.ZS.MONITOR.floor_g2map = data
      },
      updateFloorDetail(state, data){
        state.floorDetail = data;
      },
      updateZSCurrentFloorObj(state, data){
        state.floorDetailObj = data;
      },
      updateLinyiFloor(state, data){
        state.linyiFloor = data;
      },
      pageW(state, data){
        state.pageWidB = data;
      },
      redius(state) {
        state.count--;
      },
      updateFrom(state, data){
          state.updateFromStr = data;
      },
      //i18n
      SET_LANG(state, locale) {
        if (state.locales.indexOf(locale) !== -1) {
          //console.log(locale)
          state.locale = locale
        }
      },
    //  操作集团首页状态
      changeGroupFlag(state,flag){
        state.GroupFlag = flag;
      }
    },
    actions: {
      nuxtServerInit({
        commit
      }, {
        req
      }) {

        let accessToken = null;
        if (req && req.headers && req.headers.cookie) {
          var parsed = cookieparser.parse(req.headers.cookie);
          accessToken = parsed.userToken ? parsed.userToken : null;
        }
        commit('update', accessToken)
      },
      addCount(context) { //体现异步
        context.commit("add", 10)
        setTimeout(function () {
          context.commit("add", 1)
        }, 5000);
        console.log("我比上面先执行")
      },
      rediusCount({
        commit
      }) {
        commit("redius")
      }
    },
    modules: vuexModules,
    getters: { //过滤器
      count: (state => {
        return state.count += 0;
      })

    }
  })
}

export default createStore
