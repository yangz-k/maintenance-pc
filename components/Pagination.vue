
<template>
  <div>
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="widgetInfo.pageNo"
       :page-size="widgetInfo.pageSize" layout="total, prev, pager, next, jumper"
      :total="widgetInfo.total">
    </el-pagination>
  </div>
</template>

<script>
  import api from '~/config/http';

  export default {
    props: {
      widgetInfo: Object
    },
    data() {
      return {
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val;
        this.$emit("sonHandleCurrentChange", {
          pageSize: this.pageSize
        });
      },
      handleCurrentChange(val) {
        this.$emit('sonHandleCurrentChange', {
          pageNo: val
        });
      }
    },
    mounted() {
      let that = this;
      that.$emit("sonHandleCurrentChange", {
        pageSize: 6 ,
        pageNo : 1
      });
    }
  }

</script>


<style lang="scss" scoped>
  // @import "~/assets/css/table.scss";
</style>

