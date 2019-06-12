<template>
      <iframe frameborder="0" style="padding-top:10px; width:100%;height:98%" :src="previewSrc"></iframe>
</template>
<script>
export default {
  data(){
    return {
      previewSrc:""
    }
  },
  mounted(){
    this.previewSrc='http://112.27.198.15:9832/image/help.pdf';
  }
}
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
}
</style>