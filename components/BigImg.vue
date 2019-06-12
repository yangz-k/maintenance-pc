<template>
  <!-- 过渡动画 -->
  <transition name="fade">
    <div class="img-view" @click="bigImg" title="再次点击关闭">
      <!-- 遮罩层 -->
      <div class="img-layer"></div>
      <div class="img">
        <img :src="imgSrc">
      </div>
    </div>
  </transition>
</template>
<script scoped>
export default {
  props: ["imgSrc"], //接受图片地址
  methods: {
    bigImg() {
      // 发送事件
      this.$emit("clickit");
    }
  }
};
</script>
<style >
.img-view{
  height: 100%;
  width: 100%;
  position:fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}
.img-view .img-layer {
  cursor: pointer;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: #000;
  opacity: 0.5;
}
.img-view /deep/ ::-webkit-scrollbar { width: 0px; height: 1px; }
.img-view .img {
  width: 90%;
  height: 95%;
  position: absolute;
  z-index: 99999;
  top: 50%;
  left:50%;
  transform: translate(-50%,-50%);
  text-align: center;
  border-radius: 5px;
}
.img-view .img img{
  box-shadow: 0 0px 45px 0px #555;
  border-radius: 5px;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border: #fff solid 2px;
  border-radius: 5px;
}
</style>