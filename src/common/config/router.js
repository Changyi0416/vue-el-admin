/**
 * 规则：
 * 一、例如：index/index，shop/index以index结尾的，path和name默认去除index
 * 二、例如：shop/list，默认生成name为shop_list（如果结尾为index，例如shop/index则是shop）
 * 三、填写后不会自动生成
 * **/

let routes = [
  {
    path: '/',
    name: 'layout',
    component: 'layout',
    redirect: { name: 'index' },
    children: [
      {
        // path: '/main',
        // name: 'main',
        meta: { title: '后台首页' },
        component: 'index/index'
      },
      {
        meta: { title: '相册管理' },
        component: 'image/index'
      },
      {

        // path: '/shop/goods/list',
        // name: 'shop_goods_list',
        meta: { title: '商品列表' },
        component: 'shop/goods/list'
      },
      {
        meta: { title: '创建商品' },
        component: 'shop/goods/create'
      },
      {
        meta: { title: '分类管理' },
        component: 'shop/category/list'
      },
      {
        meta: { title: '商品规格管理' },
        component: 'shop/sku/list'
      },
			{
        meta: { title: '商品类型管理' },
        component: 'shop/type/list'
      },
			{
        meta: { title: '商品评价管理' },
        component: 'shop/comment/list'
      },
			{
        meta: { title: '订单管理' },
        component: 'order/order/list'
      },
			{
        meta: { title: '发票管理' },
        component: 'order/invoice/list'
      },
			{
        meta: { title: '售后服务' },
        component: 'order/after-sale/list'
      },
			{
        meta: { title: '会员列表' },
        component: 'user/list'
      },
			{
        meta: { title: '会员等级' },
        component: 'user/level'
      }
    ]
  },
  {
    // path: '/login',
    // name: 'login',
    meta: { title: '登录页' },
    component: 'login/index'
  },
  {
    path: '*',
    redirect: { name: 'index' }
  }
];

//定义路由信息方法
let getRoutes = function () {
  createRoute(routes);
  return routes
}

//自动生成路由
function createRoute(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].component) return
    //去除尾部/index
    let val = getVal(arr[i].component);
    //生成path
    arr[i].path = arr[i].path || `/${val}`
    //生成name
    arr[i].name = arr[i].name || val.replace(/\//g, '_')
    //生成component
    let componentFun = import(`../../views/${arr[i].component}.vue`)
    arr[i].component = () => componentFun
    if (arr[i].children && arr[i].children.length > 0) {
      createRoute(arr[i].children)
    }
  }
}

//去除尾部/index
function getVal(str) {
  //获取最后一个/的索引
  let lastIndex = str.lastIndexOf('/')
  //获取最后一个/后面的值
  let lastStr = str.substring(lastIndex + 1, str.length)
  //去除尾部/index
  if (lastStr === 'index') return str = str.substring(lastIndex, -1);
  return str
}
export default getRoutes()