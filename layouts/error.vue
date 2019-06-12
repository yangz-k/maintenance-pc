<template>
  <div>
    <div class="box" v-if="error.statusCode == 404">
      <div class="content">
        <img :src="img404">
        <span>您访问的页面暂时没有找到～～</span>
      </div>
    </div>
    <div class="box" v-if="error.statusCode == 500">
      <div class="content">
        <img :src="img500">
        <span>抱歉，服务器出现错误～～</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['error'],
  data(){
    return {
      img404:require('@/assets/img/Overalllayout/404.png'),
      img500:require('@/assets/img/Overalllayout/500.png')
    }
  }
}
</script>
<style lang="scss" scoped>
.box{
  height:100%;
  width:100%;
  .content {
    margin: 1.8rem auto; 
    width: 521px; 
    text-align: center;
    img{
      height: 100%;
      width: 100%;
    }
    span {
      font-size: 25px;
      color: #75726F;
    }
  }
}
</style>
