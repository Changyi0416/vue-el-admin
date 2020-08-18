module.exports = {
  lintOnSave: false,
	devServer: {
		host: 'localhost',
		port: 8080, //端口号
		https: false, 
		open: true, //配置自动启动浏览器
		proxy: {
			'/admin': { //代理api
				target: 'http://ceshi5.dishait.cn/admin',
				ws: true, //proxy websockets
				changeOrigin: true, //是够跨域
				pathRewrite: {//重写路径
					'^/admin': ''
				}
			}
		}
	}
}