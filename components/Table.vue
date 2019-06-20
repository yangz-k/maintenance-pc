<!--region 封装的分页 table-->
<template>
  <div class="table">
    <el-table
      :id="tableId"
      v-loading="options.loading"
      :data="tableListNew"
      :stripe="options.stripe"
      ref="mutipleTable"
      :header-cell-style="tableHeaderColor"
      :rowStyle="rowStyle"
      :cellStyle="cellStyle"
      @row-click="rowClick"
      cell-class-name = "white-space"
      @cell-mouse-leave="mouseLeave"
      @cell-mouse-enter="mouseEnter"
      :show-header="showHeader"
    >
      <el-table-column v-if="options.mutiSelect" type="selection" width="55">
      </el-table-column>
      <el-table-column
        v-if="options.isShowSerialNumber"
        type="index"
        width="100"
        align="center"
        label="序号"
      >
      </el-table-column>
      <!--region 数据列-->
      <!--
          v-if="!column.isShowTipicon"
          class="table-head"
          :prop="column.prop"
          :key="index"
          :label="column.label"
          :align="column.align"
          :min-width="column.minWidth"
          show-overflow-tooltip
          :render-header="renderHeader"
        >
        </el-table-column>
        <el-table-column
          v-for="(column, index) in columns"
          v-if="column.isShowTipicon"
          -->
      <template>
        <el-table-column
          v-for="(column, index) in columns"
          class="table-head"
          :prop="column.prop"
          :key="index"
          :label="column.label"
          :align="column.align"
          :min-width="column.minWidth"
          :show-overflow-tooltip="false"
          :render-header="renderHeader"
        >
          <template slot-scope="scope">
            <el-popover
              v-if="column.label == '是否规范'"
              placement="bottom-end"
              width="400"
              trigger="manual"
              :ref="'popover-' + scope.row.id"
            >
              <div v-html="content"></div>
              <!-- 数据渲染 -->
              <template v-if="!column.render">
                <template v-if="column.formatter">
                  <div
                    slot="reference"
                    class="ovfl"
                    v-html="column.formatter(scope.row, column)"
                  ></div>
                </template>
                <template v-else>
                  <div class="ovfl" slot="reference">
                    {{ scope.row[column.prop] }}
                  </div>
                </template>
              </template>
              <template v-else>
                <expand-dom
                  :column="column"
                  :row="scope.row"
                  :render="column.render"
                  :index="index"
                ></expand-dom>
              </template>
            </el-popover>
            <template v-else>
              <template v-if="!column.render">
                <template v-if="column.formatter">
                  <div
                    v-html="column.formatter(scope.row, column)"
                  ></div>
                </template>
                <template v-else>
                  <div :title="scope.row[column.prop]">
                    {{ scope.row[column.prop] }}
                  </div>
                </template>
              </template>
              <template v-else>
                <expand-dom
                  :column="column"
                  :row="scope.row"
                  :render="column.render"
                  :index="index"
                ></expand-dom>
              </template>
            </template>
          </template>
        </el-table-column>
      </template>
      <!--endregion-->
      <!--region 按钮操作组-->
      <el-table-column
        v-if="Object.keys(operates).length > 0"
        ref="fixedColumn"
        :label="operates.columnName ? operates.columnName : '操作'"
        align="center"
        :min-width="operates.widthMin"
        :width="operates.width"
        :fixed="operates.fixed"
      >
        <template slot-scope="scope">
          <div class="operate-group">
            <template v-for="(btn, key) in operates.list">
              <div
                class="item"
                :class="btn.class"
                v-if="btn.show(key, scope.row)"
                :key="btn.id"
              >
                <el-button
                  :type="btn.type"
                  size="mini"
                  :icon="btn.icon"
                  :plain="btn.plain"
                  :title="btn.title"
                  @click.native.prevent="btn.method(key, scope.row)"
                >
                  <i v-if="btn.label">{{ btn.label }}</i>
                </el-button>
              </div>
            </template>
          </div>
        </template>
      </el-table-column>
      <!--endregion-->
    </el-table>
    <div class="pagination-div">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--endregion-->
<script>
import api from "~/config/http";
export default {
  // 数据
  data() {
    return {
      total: 0,
      currentPage: 1, //初始页
      pagesize: 12,
      multipleSelection: [], // 多行选中
      parentPageParams: {}, //父组件传过来的过滤参数,
      tableListNew: this.tableList,
      content: "",
      tableId: "" //生成唯一id
    };
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: ""
    },
    tableList: {
      type: Array,
      default: []
    }, // 数据列表
    columns: {
      type: Array,
      default: []
    }, // 需要展示的列 === prop：列数据对应的属性，label：列名，align：对齐方式，width：列宽
    operates: {
      type: Object,
      default: {}
    }, // 操作按钮组 === label: 文本，type :类型（primary / success / warning / danger / info / text），show：是否显示，icon：按钮图标，plain：是否朴素按钮，disabled：是否禁用，method：回调方法
    options: {
      type: Object,
      default: {
        stripe: true, // 是否为斑马纹 table
        loading: true, // 是否添加表格loading加载动画
        highlightCurrentRow: true, // 是否支持当前行高亮显示
        isShowSerialNumber: true, //是否展示序号
        mutiSelect: false // 是否支持列表项选中功能
      }
    } // table 表格的控制参数
  },
  //组件
  components: {
    expandDom: {
      functional: true,
      props: {
        row: Object,
        render: Function,
        index: Number,
        column: {
          type: Object,
          default: null
        }
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        };
        if (ctx.props.column) params.column = ctx.props.column;
        return ctx.props.render(h, params);
      }
    }
  },
  mounted() {
    let _this = this;
    this.tableId = this.guid();
    this.$nextTick(function() {
      //获取列表的高展示多少数据
      _this.getTableListHeight();
      window.onresize = () => {
        //当窗口发生改变时触发
        _this.getTableListHeight();
      };
    });
  },
  computed: {},
  methods: {
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    guid() {
      return (
        "table-" +
        this.S4() +
        "-" +
        this.S4() +
        "-" +
        this.S4() +
        "-" +
        this.S4() +
        this.S4() +
        this.S4()
      );
    },
    //页面修改
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.parentPageParams.pageNo = currentPage;
      this.queryTableList();
    },
    //外部调用方法 重置pageNo 过滤数据
    queryTableListByParams(params) {
      this.parentPageParams = params;
      this.currentPage = 1;
      this.parentPageParams.pageNo = 1;
      this.queryTableList();
    },
    //外部调用方法 不重置pageNo
    queryTableList() {
      let _this = this;
      this.$nextTick(function() {
        _this.getTableListHeight();
        _this.parentPageParams.pageSize = _this.pagesize;
        if (_this.url) {
          _this.options.loading = true;
          api.post(_this.url, _this.parentPageParams).then(res => {
            setTimeout(function() {
              _this.options.loading = false;
            });
            if (res && res["code"] == "success") {
              _this.total = res.data.total;
              _this.tableListNew = res.data.rows;
              _this.$emit("tableInitializationComplete", res.data);
            } else {
              return callback(new Error("查询列表失败！"));
            }
          });
        }
      });
    },
    //获取列表的高展示多少数据
    getTableListHeight() {
      let trHeigh = 53;
      //如果当前页是维保人员信息页的话，让行高为84
      //如果不是，行高为53
      if (
        this.$router.currentRoute.fullPath ==
        "/MaintenanceUnitInformation/MaintenancePersonnelInformation"
      ) {
        if (document.body.clientWidth > 1366) {
          trHeigh = 101;
        } else {
          trHeigh = 84;
        }
      }
      let tableH = parseInt(($("#" + this.tableId).height() - 53) / trHeigh);
      if (tableH) {
        this.pagesize = tableH;
      } else {
        this.pagesize = 5;
      }
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color:rgba(228,228,228,.7);color: #5F687F;font-size:.18rem;font-weight:500;border-right: 1px solid #fff;";
      }
    },
    rowStyle() {
      let trHeigh = 53;
      if (
        this.$router.currentRoute.fullPath ==
        "/MaintenanceUnitInformation/MaintenancePersonnelInformation"
      ) {
        if (document.body.clientWidth > 1366) {
          trHeigh = 101;
        } else {
          trHeigh = 84;
        }
      }
      return "height:" + trHeigh + "px;";
    },
    cellStyle() {
      return "padding:0";
    },
    rowClick(row, column, event) {
      let obj = {
        row: row,
        column: column,
        event: event
      };
      this.$emit("rowClick", obj);
    },
    //鼠标移入事件
    mouseEnter(row, column, cell, event) {
      let obj = {
        row: row,
        column: column,
        cell: cell
      };
      this.$emit("mouseEnter", obj);
    },
    //鼠标移出事件
    mouseLeave(row, column, cell, event) {
      let obj = {
        row: row,
        column: column,
        cell: cell
      };
      this.$emit("mouseLeave", obj);
    },
    //是否展示Popover
    showPopover(bool, obj, content) {
      if (bool) {
        this.content = content;
        this.$refs[`popover-` + obj.row.id][
          this.$refs[`popover-` + obj.row.id].length - 1
        ].doShow();
      } else {
        this.content = "";
        this.$refs[`popover-` + obj.row.id][
          this.$refs[`popover-` + obj.row.id].length - 1
        ].doClose();
      }
    },
    //表头渲染
    renderHeader(h, { column, $index }) {
      if (column.label === "是否规范") {
        return h("span", [
          column.label,
          h(
            "el-popover",
            {
              attrs: {
                trigger: "click",
                width: "650",
                placement: "bottom-end"
              }
            },
            [
              this.operation(h),
              h("i", {
                slot: "reference",
                attrs: {
                  class: "maintenance-aroundNotice",
                  style:
                    "color: #ffb156;width: .2rem;height: .2rem;display: inline-block;line-height: 15px;margin-left: .05rem;cursor: pointer;"
                }
              })
            ]
          )
        ]);
      } else {
        return h("span", [column.label]);
      }
    },
    operation(h) {
      return h(
        "pre",
        {
          attrs: {
            style: "font-family: Microsoft YaHei;"
          }
        },
        [
          <div scoped-slot="content">
            <h3 style="font-size:.14rem;font-weight: 800;color:#000;margin-top:.1rem;">
              例行维保是否规范规则说明：
            </h3>
            <p style="color:#000;font-size:.12rem;margin-top:.1rem;">
              1.本版本的例行维保暂时支持
              <span style="color: #ff9e2f;">
                【火灾自动报警系统】中的火灾探测器、手动报警按钮
              </span>
              2种设备类型的维保测试过程管控。
            </p>
            <p style="color:#000;font-size:.12rem;margin-top:.1rem;">
              2.例行维保过程中进行系统测试时，以监测中心接收到报警、启动、反馈等信号作为过程管控。
            </p>
            <h3 style="margin-top: 10px;color: #ff9e2f;font-size:.14rem;">
              以下过程全部满足视为维保过程规范：
            </h3>
            <p style="color: #ff9e2f;font-size:.12rem;margin-top:.1rem;">
              1.在业主单位规定范围内维保。
            </p>
            <p style="color: #ff9e2f;font-size:.12rem;margin-top:.1rem;">
              2.反馈信号的测试设备类型的数量超过例行维保计划测试数量的80%。
            </p>
          </div>
        ]
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.table {
  height: calc(100% - 0.6rem);
  width: 100%;
  .el-table::before {
    height: 0;
  }
  /deep/ .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0 !important;
  }
  .el-table {
    height: 100%;
    .el-table__body-wrapper {
      height: 100%;
    }
    /deep/ .is-scrolling-none {
      height: 100%;
    }
    .table-head {
      background-color: #5f687f;
    }
    .cell {
      .ovfl {
        padding: 5px 0;
        // display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        font-style: normal;
      }
      span {
        // display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
/*.operate-group {
  display: flex;
  justify-content: center;
  .item {
    margin-left: 0.1rem;
    .el-button{
      padding: .05rem .03rem;
      width:20px;
      height:24px;
    }
  }
}*/
.pagination-div {
  text-align: right;
  padding-right: 0.4rem;
  margin-top: 0.1rem;
}
/deep/.el-pagination .el-pager li:not(.disabled).active {
  // background-color: #f4f4f5;
  background: rgba(255, 156, 80, 0.1);
  color: #ffb156;
  border: 0.01rem solid #ffb156;
}
/deep/.el-pagination .el-pager li {
  background-color: #f4f4f5;
  margin-left: 0.05rem;
}
/deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fbfbfb;
}
/deep/.el-table {
  font-size: 0.16rem;
}
/deep/.el-pagination .el-pager li:hover {
  color: #ff9c50 !important;
}
</style>
