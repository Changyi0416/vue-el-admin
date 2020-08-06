//配置文件
export default {
  logo: 'YQ-ADMIN',
  navBar: {
    activeIndex: "0",
    list: [
      {
        name: "首页",
        asideActiveIndex: "0",
        asideList: [
          {
            icon: "el-icon-s-home",
            name: "首页",
            pathname: 'index'
          },
          {
            icon: "el-icon-picture",
            name: "相册管理",
            pathname: 'image'
          },
          {
            icon: "el-icon-s-shop",
            name: "商品列表",
            pathname: 'shop_goods_list'
          },
          /* {
            icon: "el-icon-s-grid",
            name: "商品规格"
          } */
        ]
      },
      {
        name: "商品",
        asideActiveIndex: "0",
        asideList: [
          /* {
            icon: "el-icon-s-home",
            name: "首页",
            pathname: 'index'
          }, */
          {
            icon: "el-icon-ice-cream-square",
            name: "商品列表",
            pathname: 'shop_goods_list'
          },
          {
            icon: "el-icon-ice-cream-round",
            name: "分类列表",
            pathname: 'shop_category_list'
          },
					{
            icon: "el-icon-ice-drink",
            name: "商品规格",
            pathname: 'shop_sku_list'
          },
					{
            icon: "el-icon-milk-tea",
            name: "商品类型",
            pathname: 'shop_type_list'
          },
					{
            icon: "el-icon-coffee",
            name: "商品评论",
            pathname: 'shop_comment_list'
          },
        ]
      },
      {
        name: "订单",
        asideActiveIndex: "0",
        asideList: [
          {
            icon: "el-icon-s-order",
            name: "订单管理",
            pathname: 'order_order_list'
          },
          {
            icon: "el-icon-s-check",
            name: "发票管理",
            pathname: 'order_invoice_list'
          },
          {
            icon: "el-icon-s-opportunity",
            name: "售后服务",
            pathname: 'order_after-sale_list'
          }
        ]
      },
      { name: "会员" },
      { name: "设置" }
    ]
  }
}