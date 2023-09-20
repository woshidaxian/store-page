<template>
  <div class="contain">
    <div class="top-bar">
      <span>根路径：</span>
      <span
        v-for="(item, index) in url"
        :key="index"
        class="url-item"
        @click="changeUrl(index)"
      >{{ item }}</span>
    </div>
    <div class="main-box">
      <div
        v-for="(item, index) in list" 
        :key="index"
        class="file-item"
        @dblclick="toFold(item)"
      >
        <img :src="getFileIcon(item)" class="file-icon" alt="">
        <div class="file-name" :title="item.name">{{ item.name }}</div>
        <div class="file-size" :style="item.size?'':'cursor: pointer;'">{{ item.size?changeSizeUnit(item.size):'计算大小' }}</div>
      </div>
    </div>

    <el-dialog :visible.sync="showOverview" :name="activeName">
      <overviewBar />
    </el-dialog>
  </div>
</template>

<script>
import * as getData from './../api/server'
import { file } from './../config/file'
import overviewBar from './../components/overview.vue'
export default {
  name: '',
  components: { overviewBar },
  data () {
    return {
      host: 'http://192.168.5.99:9889',
      url: ['/'],
      activeUrl: '/',
      list: [],
      showOverview: false,
      activeName: '',
    }
  },

  mounted() {
    if(this.$route.query.host){
      this.host = this.route.query.host
      this.getList()
    }else if(this.host){
      this.getList()
    }else{
      this.$message.warning('未指定主机')
    }
  },

  methods: {
    changeUrl(i){
      if(i == this.url.length-1) return
      let j = 0
      this.activeUrl = ''
      while (i>=j) {
        this.activeUrl += `/${this.url[j++]}`
      }
      this.url = this.url.splice(0, i+1)
      this.getList()
    },
    toFold(row){
      if(!row.isFold) {
        // 预览
      }else{
        this.url.push(row.name)
        this.activeUrl = this.activeUrl + `${row.name}/`
        this.getList()
      }
    },
    getList(){
      getData.list(this.host, {url: this.activeUrl}).then(res=>{
        if(res.data.code == 1){
          this.list = res.data.data
        }
      })
    },
    getFoldSize(){

    },
    changeSizeUnit(size){
      if(size < 1024){
        return (size).toFixed(2)+ ' B'
      }else if(size > 1024 && size < 1024*1024 ){
        return (size/1024).toFixed(2) + ' KB'
      }else if(size > 1024*1024 && size < 1024*1024*1024){
        return (size/(1024*1024)).toFixed(2) + ' MB'
      }else{
        return (size/1024/1024/1024).toFixed(2) + ' GB'
      }
    },
    getFileIcon(row){
      if(row.isFold){
        return require('./../assets/images/icon_file/a-filefolder_yellow.png');
      }
      const fileNameArr = row.name.split('.')
      if(fileNameArr.length == 0){
        return require('./../assets/images/icon_file/weizhi.png')
      }else{
        if(file[(fileNameArr[fileNameArr.length - 1])]){
          if(file[(fileNameArr[fileNameArr.length - 1])].icon){
            return file[(fileNameArr[fileNameArr.length - 1])].icon
          }else{
            return this.host+this.activeUrl+row.name
          }
        }else{
          return require('./../assets/images/icon_file/weizhi.png')
        }
      }
    }
  }
}

</script>
<style lang='scss' scoped>
.contain{
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  .top-bar{
    padding: 0px 10px;
    background: rgb(240, 240, 240);
    height: 34px;
    display: flex;
    align-items: center;
    .url-item{
      padding: 2px 10px;
      position: relative;
      font-weight: bold;
      cursor: pointer;
      transition: all .2s;
      margin-right: 14px;
      display: inline-block;
      &::after{
        content: '/';
        position: absolute;
        right: -10px;
        color: rgb(172, 172, 172);
      }
      &:nth-child(2)::after{
        display: none;
      }
      &:nth-child(2){
        margin-right: 0;
        padding: 2px 6px;
      }
      &:hover{
        background: rgb(0, 0, 0);
        border-radius: 5px;
        color: #fff;
      }
    }
  }
  .main-box{
    flex: 1;
    padding: 1vw 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .file-item{
      width: 80px;
      height: 100px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0px 10px;
      margin-bottom: 10px;
    }
    .file-name{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      margin-bottom: 4px;
    }
    .file-icon{
      width: 70%;
      height: 70%;
      object-fit: contain;
    }
    .file-size{
      color: grey;
    }
  }
}
</style>
