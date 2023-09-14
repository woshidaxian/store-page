module.exports = {
  assetsDir: 'static',
  productionSourceMap: false, // 去除.map文件，加速生产环境
  devServer: {
    proxy: 'http://localhost:8888'
  }
}