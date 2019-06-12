<template>
  <el-row style="height: 100%;width: 100%;" id="proprietorInformationAdd">
    <el-row class=" h100 ">
      <!-- 面包屑 -->
      <el-row class="l-head" type="flex" justify="space-between" align="middle">
        <!-- 面包屑 -->
        <Title />
        <el-button
          class="goBack"
          type="text"
          icon="maintenance-back1"
          @click="back()"
          >返回</el-button
        >
      </el-row>
      <el-row class="bg-white m_b15rem padb_h">
        <el-row style="height: 100%;">
          <el-row class="div-flex flex-end right_caozuo pdb0">
            <!-- <el-button size="medium" type="warning" class="gg-btn fs14px" @click="save_form()">保存</el-button> -->
            <el-button
              class="wb-edit fs18px"
              @click="save_form()"
              type="text"
              icon="maintenance-save"
              >&nbsp;保存</el-button
            >
          </el-row>
          <el-row class="form_table m_t10rem" v-loading="loading2">
            <!-- start -->
            <div class="border_m">
              <div class="bg_gray pd5_20rem flex1 color_mo fs20px">
                基本信息
              </div>
              <!-- 基本信息 -->
              <div class="pdb0 fs16px">
                <el-form :model="form_obj" :rules="rules" ref="form_obj">
                  <div class="form_li div-flex">
                    <div class="flex1 div-flex m_r20rem">
                      <div class="form_title fs16px">
                        <span class="red">*</span>
                        单&nbsp;&nbsp;&nbsp;&nbsp;位&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;称：
                      </div>
                      <div class="form_input_div">
                        <el-form-item prop="unitName">
                          <el-input
                            placeholder="请输入"
                            maxlength="40"
                            v-model="form_obj.unitName"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="flex2 div-flex fs16px">
                      <div class="form_title">
                        <span class="red">*</span>
                        单&nbsp;&nbsp;位&nbsp;&nbsp;简&nbsp;&nbsp;称：
                      </div>
                      <div class="form_input_div">
                        <el-form-item prop="unitShortName">
                          <el-input
                            placeholder="请输入"
                            v-model="form_obj.unitShortName"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="form_li div-flex">
                    <div class="flex1 div-flex m_r15rem">
                      <div class="form_title fs16px">
                        <span class="red">*</span>
                        单&nbsp;&nbsp;&nbsp;&nbsp;位&nbsp;&nbsp;&nbsp;地&nbsp;&nbsp;&nbsp;址：
                      </div>
                      <div class="form_input_div">
                        <div class="selected_select">
                          <el-form-item prop="province">
                            <el-select
                              v-model="form_obj.province"
                              filterable
                              class="m_r10rem"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in provinceArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>

                          <el-form-item prop="city">
                            <el-select
                              v-model="form_obj.city"
                              filterable
                              class="m_r10rem"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in cityArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                          <el-form-item prop="county">
                            <el-select
                              v-model="form_obj.county"
                              filterable
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="item in countyArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="flex2 div-flex fs16px">
                      <div class="form_input_div">
                        <el-form-item prop="unitAddress">
                          <el-input
                            placeholder="请输入详细位置信息并选择经纬度"
                            v-model="form_obj.unitAddress"
                            :title="form_obj.unitAddress"
                            class="form_input form_input_lat"
                          ></el-input>
                          <img
                            :src="imgUrlObj.adress_pro"
                            @click="addLet()"
                            id="add_lat"
                            class="adress_pres"
                          />
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="form_li div-flex">
                    <div class="flex1 div-flex m_r20rem">
                      <div class="form_title fs16px">
                        <span class="red">*</span>
                        消防安全管理人：
                      </div>
                      <div class="form_input_div">
                        <el-form-item prop="contacts">
                          <el-input
                            placeholder="请输入"
                            v-model="form_obj.contacts"
                            class="form_input"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="flex2 div-flex fs16px">
                      <div class="form_title">
                        <span class="red">*</span>
                        管理&nbsp;人&nbsp;电&nbsp;话：
                      </div>
                      <div class="form_input_div">
                        <el-form-item prop="contactsTel">
                          <el-input
                            placeholder="请输入"
                            v-model="form_obj.contactsTel"
                            class="form_input"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="form_li div-flex">
                    <div class="flex1 div-flex m_r20rem">
                      <div class="form_title fs16px">
                        <span class="red">*</span>
                        消防安全责任人：
                      </div>
                      <div class="form_input_div">
                        <el-form-item prop="personliable">
                          <el-input
                            placeholder="请输入"
                            v-model="form_obj.personliable"
                            class="form_input"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="flex2 div-flex fs16px">
                      <div class="form_title">
                        <span class="red">*</span>
                        责任&nbsp;人&nbsp;电&nbsp;话：
                      </div>
                      <div class="form_input_div">
                        <el-form-item prop="personliableTel">
                          <el-input
                            placeholder="请输入"
                            v-model="form_obj.personliableTel"
                            class="form_input"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="form_li div-flex">
                    <div class="flex1 div-flex m_r20rem">
                      <div class="form_title fs16px">
                        <span class="red">*</span>
                        单&nbsp;&nbsp;&nbsp;&nbsp;位&nbsp;&nbsp;&nbsp;类&nbsp;&nbsp;&nbsp;别：
                      </div>
                      <div class="form_input_div">
                        <el-form-item prop="unitClass">
                          <el-select
                            class="wb100"
                            v-model="form_obj.unitClass"
                            filterable
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in unitClassArr"
                              :key="item.value"
                              :label="item.label"
                              :title="item.label"
                              :value="item"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="flex2 div-flex fs16px">
                      <div class="form_title">
                        <span class="red"></span>
                        所&nbsp;&nbsp;属&nbsp;&nbsp;行&nbsp;&nbsp;业：
                      </div>
                      <div class="form_input_div">
                        <el-form-item>
                          <el-select
                            class="wb100"
                            v-model="form_obj.unitIndustry"
                            filterable
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="item in unitIndustryArr"
                              :key="item.value"
                              :label="item.label"
                              :value="item"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </el-form>
              </div>
              <div class="bg_gray color_mo fs20px pd5_20rem">
                建筑信息
              </div>
              <!-- 建筑信息 -->
              <div class="pdb0">
                <el-row
                  class="from_div_one dleft m_r15rem m_b15rem form_demo fs16px"
                  v-if="buildArr.length < 1"
                >
                  <span class="left_jiao" :style="bg_pic">示例</span>
                  <div class="div-flex color_9999 m_b15rem">
                    <div class="flex1 div-flex m_r20rem ">
                      <span class="red">*</span>
                      建筑面积：<span class="color_4545">2000平方米</span>
                    </div>
                    <div class="div-flex">
                      <span class="red"></span>
                      建筑高度：<span class="color_4545">54米</span>
                    </div>
                  </div>
                  <div class=" div-flex  color_9999 m_b15rem">
                    <div class="flex1 div-flex m_r20rem">
                      <span class="red">*</span>
                      地上层数：<span class="color_4545">5层</span>
                    </div>
                    <div class="div-flex">
                      <span class="red">*</span>
                      地下层数：<span class="color_4545">5层</span>
                    </div>
                  </div>
                  <div class="div-flex  color_9999 ">
                    <div class="div-flex">
                      消防验收时间：<span class="color_4545">2019-01-01</span>
                    </div>
                  </div>
                </el-row>
                <!-- 循环添加建筑信息 start -->
                <el-row
                  class="from_div_one dleft m_r15rem m_b15rem form_demo fs16px"
                  v-for="(item, index) in buildArr"
                  :key="index"
                >
                  <span
                    class="left_jiao architecture_buildName"
                    :style="bg_pic"
                    :title="item.buildName"
                    >{{ item.buildName }}</span
                  >
                  <span
                    class="right_jiao"
                    @click="removeBuildLine(index, item)"
                  >
                    <img title="删除" :src="imgUrlObj.del_form_pro" />
                  </span>
                  <el-row class="color_9999 m_b15rem">
                    <el-col :span="13" class="ALine">
                      <span class="red">*</span>
                      建筑面积：<span
                        class="color_4545"
                        :title="item.buildArea + '平方米'"
                        >{{ item.buildArea }}平方米</span
                      >
                    </el-col>
                    <el-col :span="11" class="ALine">
                      <span style="visibility: hidden;" class="red">*</span>
                      建筑高度：<span
                        class="color_4545"
                        :title="item.buildHight + '米'"
                        >{{ item.buildHight }}米</span
                      >
                    </el-col>
                  </el-row>
                  <el-row class="color_9999 m_b15rem">
                    <el-col :span="13" class="ALine">
                      <span class="red">*</span>
                      地上层数：<span
                        class="color_4545"
                        :title="item.upFloor + '层'"
                        >{{ item.upFloor }}层</span
                      >
                    </el-col>
                    <el-col :span="11" class="ALine">
                      <span class="red">*</span>
                      地下层数：<span
                        class="color_4545"
                        :title="item.downFloor + '层'"
                        >{{ item.downFloor }}层</span
                      >
                    </el-col>
                  </el-row>
                  <el-row class="color_9999">
                    <el-col class="ALine">
                      <span style="visibility: hidden;" class="red">*</span>
                      消防验收时间：<span
                        class="color_4545"
                        :title="item.fireAcceptanceTime"
                        >{{ item.fireAcceptanceTime }}</span
                      >
                    </el-col>
                  </el-row>
                </el-row>
                <!-- 循环添加建筑信息 end -->

                <div class="build_one dleft cursor">
                  <img
                    id="addBuilder"
                    @click="addBuild()"
                    title="添加建筑"
                    :src="imgUrlObj.addPropri"
                  />
                </div>
                <div class="clearfix"></div>
              </div>
              <div class="bg_gray color_mo fs20px pd5_20rem">
                主机信息
              </div>
              <!-- 主机信息 -->
              <div class="pdb0 fs16px">
                <div
                  class="from_div_two m_r15rem dleft form_demo_zhuji"
                  v-if="hostArr.length < 1"
                >
                  <span class="left_jiao" :style="bg_pic">示例</span>
                  <div class="div-flex color_9999 m_b15rem">
                    <div class="flex1 div-flex m_r15rem ">
                      <span class="red">*</span>
                      消控室名称：<span class="color_4545">3号楼消控室</span>
                    </div>
                    <div class="div-flex">
                      <span class="red"></span>
                      具体位置：<span class="color_4545">2/3号楼之间</span>
                    </div>
                  </div>
                  <div class="div-flex color_9999 m_b15rem">
                    <div class="flex1 div-flex m_r15rem ">
                      <span class="red">*</span>
                      消控室电话：<span class="color_4545">010-6543213</span>
                    </div>
                  </div>
                  <div class=" div-flex  color_9999 ">
                    <div class="flex1 div-flex m_r15rem">
                      &nbsp;主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：
                      <div class="color_4545 m_r15rem">
                        <div class="one_item">
                          <div class="gray_block"></div>
                          <p>海湾湾G220</p>
                        </div>
                      </div>
                      <div class="color_4545">
                        <div class="one_item">
                          <div class="gray_block"></div>
                          <p>海湾湾G220</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 循环添加主机信息start -->
                <el-row
                  class="from_div_two m_r15rem m_b15rem dleft form_demo_zhuji"
                  v-for="(item, index) in hostArr"
                  :key="index"
                >
                  <span
                    class="left_jiao host_fireRoom"
                    :style="bg_pic"
                    :title="item.firecontrolroomName"
                    id="fireRoomTitle"
                    >{{ item.firecontrolroomName }}</span
                  >
                  <span class="right_jiao" @click="removeHostLine(index, item)">
                    <img title="删除" :src="imgUrlObj.del_form_pro" />
                  </span>
                  <el-row class="color_9999 m_b15rem">
                    <el-col :span="13" class="ALine">
                      <span class="red">*</span>
                      消控室名称：<span
                        class="color_4545"
                        :title="item.firecontrolroomName"
                        id="fireRoom"
                        >{{ item.firecontrolroomName }}</span
                      >
                    </el-col>
                    <el-col :span="11" class="ALine">
                      <span style="visibility: hidden;" class="red">*</span>
                      具体位置：<span
                        class="color_4545"
                        :title="item.firecontrolroomAddress"
                        >{{ item.firecontrolroomAddress }}</span
                      >
                    </el-col>
                  </el-row>
                  <el-row class="color_9999 m_b15rem">
                    <el-col class="ALine">
                      <span class="red">*</span>
                      消控室电话：<span
                        class="color_4545"
                        :title="item.firecontrolroomTel"
                        >{{ item.firecontrolroomTel }}</span
                      >
                    </el-col>
                  </el-row>
                  <el-row class="color_9999 ">
                    <el-col class="ALine" style="vertical-align: text-top;">
                      <div style="display: flex;">
                        <span style="visibility: hidden;" class="red">*</span>
                        <div>
                          &nbsp;主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;机：
                        </div>
                        <div
                          class="color_4545 m_r15rem"
                          v-for="(item_type, index) in setArr(item)"
                          :key="index"
                          style="display: inline-block;"
                        >
                          <div class="one_item">
                            <div class="gray_block"></div>
                            <p class="slpit" :title="item_type">
                              {{ item_type }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-row>
                <!-- 循环添加主机信息end -->
                <el-row @click="addHost()" style="flex-wrap:wrap">
                  <div class="build_one cursor" id="insertBefore_zhuji">
                    <img
                      id="addBuilder_zhuji"
                      @click="addHost()"
                      title="添加建筑"
                      :src="imgUrlObj.addPropri_1"
                    />
                  </div>
                </el-row>
                <div class="clearfix"></div>
              </div>
            </div>
            <!-- end -->
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    <!-- 弹出地图start -->
    <div v-if="dialogVisible">
      <el-dialog
        title="提示"
        class="map_body"
        :visible.sync="dialogVisible"
        width="50%"
        top="'0'"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="dialogClose()"
      >
        <div class="lat_div">
          <div id="allMap"></div>
          <div class="input_search">
            <div class="div-flex">
              <input
                type="text"
                name="key_word"
                autocomplete="on"
                placeholder="关键字"
                id="key_word"
                value=""
              />
              <div class="set_div" id="r-result"></div>
              <el-button
                size="medium"
                type="warning"
                class="gg-btn fs14px btn_back"
                @click="save_lat()"
                id="save_lat"
                >确定</el-button
              >
              <!-- <a class="gs-el-button gs-el-button--primary m_l10px cursor" @click="save_lat()" id="save_lat">确定</a> -->
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出地图end -->

    <!-- 弹出新建建筑start -->
    <BuildInfo
      ref="buildFromName"
      class="map_body"
      @saveFormBuild="eventBuildInfo"
    ></BuildInfo>
    <!-- 弹出新建建筑end -->

    <!-- 弹出新建主机start -->
    <HostInfo
      ref="hostFromName"
      class="map_body"
      @saveFormHost="eventHostInfo"
    ></HostInfo>
    <!-- 弹出新建主机end -->
  </el-row>
</template>
<script>
import Title from "~/components/Title";
import BuildInfo from "~/components/BuildInfo"; //建筑信息
import HostInfo from "~/components/HostInfo"; //主机信息
import validate from "~/plugins/validate";
import api from "~/config/http";
import { Message, MessageBox } from "element-ui";
import { MP } from "~/plugins/map";
export default {
  components: {
    Title,
    BuildInfo,
    HostInfo
  },
  data() {
    return {
      loading2: false,
      myValue: "",
      map: {},
      autocomplete: null, //
      form_obj: {
        unitName: "", //单位名称
        unitShortName: "", //单位简称
        unitAddress: "", //经纬度地址
        contacts: "", //消防安全管理人
        contactsTel: "", //管理人电话
        personliable: "", //消防安全责任人
        personliableTel: "", //责任人电话
        unitIndustry: "", //所属行业
        unitClass: "", //单位类别
        province: "", //省
        city: "", //市
        county: "", //县
        unitPointX: "",
        unitPointY: ""
      },
      unitIndustryArr: [],
      unitClassArr: [],
      provinceArr: [],
      provinceArrs: [],
      cityArr: [],
      cityArrs: [],
      countyArr: [],
      countyArrs: [],
      imgUrlObj: {
        adress_pro: require("@/assets/img/ProjectInformation/adress_pro.png"),
        addPropri: require("@/assets/img/ProjectInformation/addPropri.png"),
        addPropri_1: require("@/assets/img/ProjectInformation/addPropri_1.png"),
        del_form_pro: require("@/assets/img/ProjectInformation/del_form_pro.png"),
        red_point: require("@/assets/img/ProjectInformation/red_point.png")
      },
      bg_pic: {
        backgroundImage:
          "url(" +
          require("@/assets/img/ProjectInformation/shili_demo1.png") +
          ")"
      },
      dialogVisible: false, //显示地图弹窗
      dialog_build: false, //显示建筑弹窗
      buildArr: [], //建筑信息数组
      dialog_host: false, //显示主机弹窗
      hostArr: [],
      rules: {
        unitName: [
          { required: true, message: "请输入单位名称", trigger: ["blur"] }
        ],
        unitShortName: [
          { required: true, message: "请输入单位简称", trigger: ["blur"] }
        ],
        unitAddress: [
          { required: true, message: "请输入单位地址", trigger: ["blur"] }
        ],
        contacts: [
          { required: true, message: "请输入消控安全管理人", trigger: ["blur"] }
        ],
        contactsTel: [
          { required: true, message: "请输入管理人电话", trigger: ["blur"] },
          { validator: validate.validatePhoneTwo, trigger: ["blur", "change"] }
        ],
        personliable: [
          { required: true, message: "请输入消控安全责任人", trigger: ["blur"] }
        ],
        personliableTel: [
          { required: true, message: "请输入责任人电话", trigger: ["blur"] },
          { validator: validate.validatePhoneTwo, trigger: ["blur", "change"] }
        ],
        unitClass: [
          { required: true, message: "请输入单位类别", trigger: ["change"] }
        ],
        province: [
          { required: true, message: "请输入省份", trigger: ["change"] }
        ],
        city: [{ required: true, message: "请输入市", trigger: ["change"] }],
        county: [{ required: true, message: "请输入县", trigger: ["change"] }]
      }
    };
  },
  watch: {
    "form_obj.province": "changeProvinces", //监听省份
    "form_obj.city": "changeCitys" //监听市
  },
  methods: {
    dialogClose() {
      this.autocomplete.dispose();
      this.dialogVisible = false;
    },
    getUnitIndustry() {
      // 获取所属行业 , 所属类别的数据
      let _this = this;
      api
        .post(
          api.forent_url.maintenance_service_url + "/serverUnit/getUnitIndustry"
        )
        .then(function(data) {
          let code = data["code"];
          let datas = data["data"];
          if (code == "success") {
            for (let i = 0; i < datas.length; i++) {
              _this.unitIndustryArr.push({
                id: datas[i].id,
                value: datas[i].industry,
                label: datas[i].industry
              });
            }
          } else {
            _this.$message({ message: data["message"], type: "warning" });
          }
        });
      api
        .post(
          api.forent_url.maintenance_service_url + "/serverUnit/getUnitClass"
        )
        .then(function(data) {
          let code = data["code"];
          let datas = data["data"];
          if (code == "success") {
            for (let i = 0; i < datas.length; i++) {
              _this.unitClassArr.push({
                id: datas[i].id,
                value: datas[i].className,
                label: datas[i].className
              });
            }
          } else {
            _this.$message({ message: data["message"], type: "warning" });
          }
        });
    },
    getAddress() {
      //获取地址数据
      let _this = this;
      api
        .get(api.forent_url.maintenance_service_url + "/serverUnit/getDistCode")
        .then(function(data) {
          let code = data["code"];
          let datas = data["data"];
          if (code == "success") {
            _this.initSeletList(datas);
          } else {
            _this.$message({ message: data["message"], type: "warning" });
          }
        });
    },
    place(value) {
      //根据编码返回省市县
      let ac = parseInt(value);
      if (ac % 100 != 0) {
        return "d";
      } else if (ac % 10000 != 0) {
        return "c";
      } else {
        return "p";
      }
    },
    initSeletList(placesMap) {
      //根据地区类型分类
      for (let k = 0; k < placesMap.length; k++) {
        let ty = this.place(placesMap[k].distCode);
        if (ty == "p") {
          this.provinceArr.push({
            value: placesMap[k].distCode,
            label: placesMap[k].distName
          });
        }
        if (ty == "c") {
          this.cityArrs.push({
            value: placesMap[k].distCode,
            label: placesMap[k].distName
          });
        }
        if (ty == "d") {
          this.countyArrs.push({
            value: placesMap[k].distCode,
            label: placesMap[k].distName
          });
        }
      }
    },
    changeProvinces() {
      //change省份
      let _this = this;
      let pCode = _this.form_obj.province.value; //获取省下拉列表被选取项的省编码
      /*根据省编码更新市下拉列表*/
      let cityArrs = JSON.parse(JSON.stringify(_this.cityArrs));
      if (pCode != 0) {
        _this.form_obj.city = "";
        _this.cityArr = [];
        _this.form_obj.county = "";
        _this.countyArr = [];
        for (let i = 0; i < cityArrs.length; i++) {
          if (
            Math.floor(cityArrs[i].value / 10000) == Math.floor(pCode / 10000)
          ) {
            _this.cityArr.push({
              value: cityArrs[i].value,
              label: cityArrs[i].label
            });
          }
        }
      }
    },
    changeCitys() {
      //change市
      let _this = this;
      let cCode = _this.form_obj.city.value; //获取市下拉列表被选取项的编码
      /*根据市编码更新县下拉列表*/
      let countyArrs = JSON.parse(JSON.stringify(_this.countyArrs));
      if (cCode != 0) {
        _this.form_obj.county = "";
        _this.countyArr = [];
        for (let i = 0; i < countyArrs.length; i++) {
          if (
            Math.floor(countyArrs[i].value / 100) == Math.floor(cCode / 100)
          ) {
            _this.countyArr.push({
              value: countyArrs[i].value,
              label: countyArrs[i].label
            });
          }
        }
      }
    },
    save_lat() {
      let _this = this;
      if ($("#key_word").val() == "") {
        _this.$message({ message: "请输入关键字/地址", type: "warning" });
        return;
      } else {
        $("#key_word").val($("#key_word")[0].value);
        _this.form_obj.unitAddress = $("#key_word")[0].value;
        _this.myValue = _this.form_obj.unitAddress;
        _this.setPlace();
      }
    },
    addLet() {
      this.dialogVisible = true;
      // 百度地图API功能
      let _this = this;
      _this.$nextTick(() => {
        _this.map = new BMap.Map("allMap");
        _this.map.centerAndZoom("北京", 16);
        _this.autocomplete = new BMap.Autocomplete({
          //建立一个自动完成的对象
          input: "key_word",
          location: _this.map
        });
        _this.map.enableScrollWheelZoom(true);
        //进来看是否有经纬度，或者地址
        setTimeout(function() {
          $("#key_word").val(_this.form_obj.unitAddress);
          _this.myValue = _this.form_obj.unitAddress;
          if (_this.form_obj.unitPointY) {
            let poi = {
              x: _this.form_obj.unitPointX,
              y: _this.form_obj.unitPointY
            };
            _this.setPionts(
              _this._getLngLat(poi).lng,
              _this._getLngLat(poi).lat,
              _this.form_obj.unitAddress
            );
          } else {
            if (_this.form_obj.unitAddress) {
              _this.myValue = _this.form_obj.unitAddress;
              _this.setPlace();
            }
          }
          if ($("#key_word").val() != "") {
            _this.save_lat();
          }
        });
        //鼠标点击下拉列表后的事件
        _this.autocomplete.addEventListener("onconfirm", function(e) {
          let _value = e.item.value;
          _this.myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
          _this.setPlace();
        });
        //单击获取点击的经纬度
        _this.map.addEventListener("click", function(e) {
          let content = _this.myValue;
          let geoc = new BMap.Geocoder();
          let pt = e.point;
          geoc.getLocation(pt, function(rs) {
            _this.setPionts(e.point.lng, e.point.lat, content);
          });
        });
      });
    },
    //经纬度转墨卡托
    getMercator(poi) {
      //[114.32894, 30.585748]
      let mercator = {};
      let earthRad = 6378137.0;
      mercator.x = ((poi.lng * Math.PI) / 180) * earthRad;
      let a = (poi.lat * Math.PI) / 180;
      mercator.y =
        (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
      return mercator; //[12727039.383734727, 3579066.6894065146]
    },
    /**
     * 墨卡托转经纬度
     */
    _getLngLat(poi) {
      let lnglat = {};
      lnglat.lng = (poi.x / 20037508.34) * 180;
      let mmy = (poi.y / 20037508.34) * 180;
      lnglat.lat =
        (180 / Math.PI) *
        (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2);
      return lnglat;
    },
    //添加标注
    setPionts(lng, lat, myValue) {
      let _this = this;
      _this.map.clearOverlays();
      let points = new BMap.Point(lng, lat);
      let poi = { lng: lng, lat: lat };
      let infoWindow = new BMap.InfoWindow(
        myValue +
          "</br>" +
          _this.getMercator(poi).x +
          "," +
          _this.getMercator(poi).y +
          '</br></br><span id="out_lat" >导出经纬度</span>'
      ); // 创建信息窗口对象
      _this.map.openInfoWindow(infoWindow, points);
      let myIcon = new BMap.Icon(
        _this.imgUrlObj.red_point,
        new BMap.Size(10, 10)
      );
      let markers = new BMap.Marker(points, { icon: myIcon }); // 创建标注
      _this.map.addOverlay(markers);
      _this.form_obj.unitPointX = _this.getMercator(poi).x;
      _this.form_obj.unitPointY = _this.getMercator(poi).y;
      setTimeout(function() {
        document
          .getElementById("out_lat")
          .addEventListener("click", function(e) {
            if ($("#key_word").val() == "") {
              _this.$message({ message: "请输入关键字/地址", type: "warning" });
              return;
            } else {
              $("#key_word").val($("#key_word")[0].value);
              _this.form_obj.unitAddress = $("#key_word")[0].value;
              _this.autocomplete.dispose();
              _this.dialogVisible = false;
            }
          });
      }, 1000);
    },
    setPlace() {
      let _this = this;
      let local = new BMap.LocalSearch(_this.map, {
        //智能搜索
        onSearchComplete: myFun
      });
      function myFun() {
        if (!local.getResults() || !local.getResults().getPoi(0)) {
          return false;
        }
        let pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
        _this.map.centerAndZoom(pp, 18);
        let content = _this.myValue;
        _this.setPionts(pp.lng, pp.lat, content);
      }
      local.search(_this.myValue);
    },
    addBuild() {
      //打开添加建筑信息弹窗
      this.$refs.buildFromName.openBuild(true);
    },
    eventBuildInfo(datas) {
      //建筑信息 子组件主机信息返回得数据
      this.buildArr.push({
        buildArea: datas.buildArea,
        buildHight: datas.buildHight,
        buildName: datas.buildName,
        downFloor: datas.downFloor,
        fireAcceptanceTime: datas.fireAcceptanceTime,
        upFloor: datas.upFloor
      });
    },
    removeBuildLine(index) {
      //根据索引删除当前建筑信息
      this.buildArr.splice(index, 1);
    },
    addHost() {
      //打开添加主机信息弹窗
      this.$refs.hostFromName.openHost(true);
    },
    eventHostInfo(datas) {
      //主机信息 子组件主机信息返回得数据
      let host_type_arr = [];
      let host_type_val; //字符串格式
      if (datas.host_type_val) {
        for (let item in datas.host_type_val) {
          host_type_arr.push(datas.host_type_val[item].value);
        }
      }
      host_type_val = host_type_arr.join(",");
      this.hostArr.push({
        firecontrolroomName: datas.host_name,
        firecontrolroomAddress: datas.host_address,
        firecontrolroomTel: datas.host_phone,
        hostModel_val: host_type_arr,
        hostModel: host_type_val
      });
    },
    removeHostLine(index) {
      //根据索引删除当前建筑信息
      this.hostArr.splice(index, 1);
    },
    back() {
      //返回
      this.$router.back(-1);
    },
    save_form() {
      //保存
      let _this = this;
      _this.$refs["form_obj"].validate(valid => {
        if (valid) {
          if (_this.buildArr.length < 1) {
            _this.$message({
              message: "至少添加一个建筑信息",
              type: "warning"
            });
            return;
          }
          let datas = {
            unitName: _this.form_obj.unitName,
            unitShortName: _this.form_obj.unitShortName,
            province: _this.form_obj.province.label,
            city: _this.form_obj.city.label,
            county: _this.form_obj.county.label,
            distCode: _this.form_obj.county.value,
            provinceCode: _this.form_obj.province.value,
            cityCode: _this.form_obj.city.value,
            countyCode: _this.form_obj.county.value,
            unitAddress: _this.form_obj.unitAddress,
            unitPointX: _this.form_obj.unitPointX,
            unitPointY: _this.form_obj.unitPointY,
            contacts: _this.form_obj.contacts,
            contactsTel: _this.form_obj.contactsTel,
            personliable: _this.form_obj.personliable,
            personliableTel: _this.form_obj.personliableTel,
            maintenanceId: api.getGlobalVal("maintenance_userObj").orgCode,
            maintenanceUnit: api.getGlobalVal("maintenance_userObj").orgName,
            unitClass: _this.form_obj.unitClass.label,
            unitClassId: _this.form_obj.unitClass.id,
            unitIndustry: _this.form_obj.unitIndustry.label,
            unitIndustryId: _this.form_obj.unitIndustry.id,
            buildList: _this.buildArr,
            fireRoomList: _this.hostArr
          };
          let datas_this = { jsonUnitInfo: JSON.stringify(datas) };
          _this.loading2 = true;
          api
            .post(
              api.forent_url.maintenance_service_url +
                "/serverUnit/addServiceUnitInfos",
              datas_this
            )
            .then(function(data) {
              _this.loading2 = false;
              let code = data["code"];
              let datas = data["data"];
              if (code == "success") {
                _this.$message({ message: "保存成功", type: "success" });
                _this.$router.back(-1);
                // _this.$refs['host_obj'].resetFields();
              } else {
                _this.$message({ message: data["message"], type: "warning" });
              }
            });
        } else {
          _this.loading2 = false;
          return false;
        }
      });
    }
  },
  mounted() {
    //所属行业serverUnit/getUnitIndustry
    this.getUnitIndustry();
    //获取地址数据
    this.getAddress();
    let _this = this;
    //实例化地图
    _this.$nextTick(function() {
      MP("IfsTmEuhfEIUbXctBEtFRi7jfqfmirMO").then(BMap => {});
    });
  }
};
</script>
<style lang="scss">
.tangram-suggestion-main {
  z-index: 99999 !important;
}
#proprietorInformationAdd {
  .padb_h {
    height: calc(100% - 0.7rem);
    padding-bottom: 0.2rem;
  }
  .pdb0 {
    padding: 0.15rem 0.2rem;
  }
  .border_m {
    margin: 0 0.2rem;
    border: 1px #f7f7f7 solid;
  }
  .bg-white {
    height: calc(100% - 0.7rem);
  }
  #allMap {
    height: 100%;
  }
  i {
    font-style: normal;
  }
  .overflow_auto {
    overflow: auto;
  }
  .m-r3px {
    margin-right: 3px;
  }

  .right_caozuo button {
    height: 0.3rem;
    width: 0.8rem;
  }
  .form_li .el-form-item {
    margin-bottom: 0;
  }
  .form_table {
    height: calc(100% - 0.6rem);
    overflow: auto;
  }
  .form_table .form_line {
    width: 100%;
  }
  .form_title {
    width: 1.6rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #9a9a9a;
  }
  .flex2 {
    flex: 2;
  }
  .red {
    color: red;
    margin-right: 2px;
  }
  .form_input_div {
    width: 3.8rem;
    position: relative;
  }
  .form_input_lat {
    .el-input__inner {
      padding-right: 0.5rem;
    }
  }
  .form_table .form_span {
    margin-right: 0.2rem;
  }
  .form_table .form_input {
    flex: 1;
  }
  .form_table .el-input__inner {
    height: 0.4rem;
  }
  .form_li {
    margin-bottom: 0.2rem;
  }
  .selected_select {
    display: flex;
  }

  .adress_pres {
    position: absolute;
    right: 0.15rem;
    top: 10px;
    width: 0.25rem;
    background-color: #fff;
    cursor: pointer;
  }
  .from_div_one {
    padding: 30px 20px 15px 20px;
    border: #ddd solid 1px;
    position: relative;
    width: 407px;
    min-height: 144px;
  }
  .from_div_two {
    padding: 30px 20px 15px 20px;
    border: #ddd solid 1px;
    position: relative;
    width: 500px;
    min-height: 204px;
    margin-bottom: 15px;
  }
  .left_jiao {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    background-position: 100%;
    background-repeat: no-repeat;
    background-color: #ff6822;
    padding: 2px 12px 2px 5px;
    color: #fff;
    font-size: 14px;
    line-height: 1.5;
  }
  .architecture_buildName {
    max-width: 203px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .host_fireRoom {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .dleft {
    float: left;
  }
  .color_9999 {
    color: #999;
  }
  .color_4545 {
    color: #454545;
  }
  .ALine {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 弹出地图样式
  .map_body /deep/ .el-dialog__body {
    padding: 0px;
  }
  .input_search {
    position: absolute;
    top: 10px;
    left: 10px;
    box-shadow: 0 0 10px 0px #999;
    border-radius: 5px;
    background-color: #fff;
    padding: 10px;
  }
  .input_search input {
    padding: 5px 10px;
    width: 300px;
    border: #ddd solid 1px;
    border-radius: 3px;
    margin-right: 5px;
  }
  .set_div p {
    padding: 10px;
    width: 100%;
    border-bottom: #efefef solid 1px;
    background-color: #fff;
  }
  .BMap_bubble_content {
    margin-top: 10px;
  }
  #g2map {
    width: 100%;
    height: 100%;
    background-color: #9a9a9a;
  }
  #out_lat {
    color: #ffb156;
    cursor: pointer;
    display: inline-block;
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
  .BMap_cpyCtrl,
  .anchorBL {
    display: none !important;
  }
  .lat_div {
    height: 6rem;
    position: relative;
  }
  .right_jiao {
    display: inline-block;
    position: absolute;
    right: -5px;
    top: -0.12rem;
    cursor: pointer;
  }
  .right_jiao img {
    max-width: 100%;
  }
  .one_item p {
    font-size: 12px;
    text-align: center;
    color: #5f687f;
    margin-top: 4px;
  }
  .slpit {
    width: 75px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .one_item .gray_block {
    width: 78px;
    height: 58px;
    background-color: #e0e0e0;
  }
  .wb-edit {
    color: #5f687f;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
