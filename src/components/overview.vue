<template>
  <div class="overview-box">
    <video v-if="tag == 'video'" controls :src="filePath" preload="metadata"></video>
  </div>
</template>

<script>

import { file } from './../config/file'
export default {
  name: '',
  components: {},
  props: ['name', 'path', 'host'],
  data () {
    return {
      tag: null,
      filePath: null,
    }
  },

  mounted() {
    console.log(this.name, this.path, this.host)
    if(!this.name) return
    const fileNameArr = this.name.split('.')
    if (fileNameArr.length == 0) {
      this.tag = null
    } else {
      if(file[(fileNameArr[fileNameArr.length - 1])].tag){
        this.tag = file[(fileNameArr[fileNameArr.length - 1])].tag
      }else{
        this.tag = null
      }
    }
    if(this.path&&this.host) {
      this.filePath = this.host+this.path+this.name
      console.log(this.filePath)
    }
  },

  methods: {}
}

</script>
<style lang='scss' scoped>
.overview-box{
  width: 100%;
  height: 100%;
  video{
    width: 100%;
    height: 100%;
  }
}
</style>
