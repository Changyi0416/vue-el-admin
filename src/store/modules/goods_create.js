import $Util from '@/common/util.js';
export default {
	namespaced: true,
  state: {
		//form表单数据
		title: "商品名称", //商品名称
		category: '', //商品分类
		desc: '', //描述
		unit: '', //单位
		stock: 0, //总库存
		min_stock: 0, // 库存预警
		display_stock: 0, //库存显示 0隐藏 1显示
		status: 1, //是否上架 0仓库 1上架
		express: '', //运费模板
		
		skus_type: 0, //0单一规格  1多规格
		// 单一规格
		oprice: 0, //市场价格
		pprice: 0, //销售价格
		cprice: 0, //成本价格
		weight: 0, //重量
		volume: 0, //体积
		//多规格↓
		sku_card: [{
			name: '色调',
			type: 2, //规格类型 0无 1颜色 2图片
			list: [
				{
					name: '蓝色',
					color: '',
					image: ''
				},
				{
					name: '黄色',
					color: '',
					image: ''
				}
			]
		},
		{
			name: '类型',
			type: 0, //规格类型 0无 1颜色 2图片
			list: [
				{
					name: '手持',
					color: '',
					image: ''
				},
				{
					name: '脚踏',
					color: '',
					image: ''
				},
				{
					name: '电动',
					color: '',
					image: ''
				}
			]
		}],
		ths: [
			{name: '商品规格', rowspan: 1, colspan: 1, width: ''},
			{name: 'sku图片', rowspan: 2, width: '60'},
			{name: '销售价', rowspan: 2, width: '100'},
			{name: '市场价', rowspan: 2, width: '100'},
			{name: '成本价', rowspan: 2, width: '100'},
			{name: '库存', rowspan: 2, width: '100'},
			{name: '体积', rowspan: 2, width: '100'},
			{name: '重量', rowspan: 2, width: '100'},
			{name: '编码', rowspan: 2, width: '100'},
		]
  },
  getters: {
		//【商品规格】占位几列
		skuLables(state){
			return state.sku_card.filter(v => {
				return v.list.length > 0;
			})
		},
		//获取表格表头
		tableThs(state, getters){
			let len = getters.skuLables.length;
			state.ths[0].colspan = len;
			state.ths[0].rowspan = len > 0 ? 1 : 2;
			return state.ths;
		},
		//获取表格规格数据
		tableData(state){
			if(state.sku_card.length === 0) return [];
			let arr = [];
			state.sku_card.forEach((item, i) => {
				if(item.list.length > 0) {
					arr.push(item.list);
				}
			})
			arr = arr.length === 0 ? [] : $Util.cartesianProductOf(...arr);
			return arr.map(v => {
				let obj = {
					skus: [],
					image: '', //sku图片
					pprice: 0, //销售价
					oprice: 0, //市场价
					cprice: 0, //成本价
					stock: 0, //库存
					volume: 0, //体积
					weight: 0, //重量
					code: '' //编码
				}
				obj.skus = v;
				return obj;
			})
		}
  },
  mutations: {
		//修改state
		vModelState(state, {key, val}){
			state[key] = val;
			console.log(key, val);
		},
		//添加规格
		addSkuCard(state, obj){
			state.sku_card.push({
					name: '规格名称',
					type: 0, 
					list: []
				});
		},
		//删除规格
		deleSkuCard(state, i){
			state.sku_card.splice(i, 1);
		},
		//修改规格项名称&类型
		vModelSkuCard(state, {i, key, val}){
			state.sku_card[i][key] = val;
		},
		//商品规格上移下移
		moveSkuCard(state, {sign, i}){
			$Util[sign](state.sku_card, i);
		},
		//添加规格值
		addSkuVal(state, i){
			state.sku_card[i].list.push({
				name: '规格名称',
				color: '',
				image: ''
			})
		},
		//修改规格值
		vModelSkuVal(state, {i, j, key, val}){
			state.sku_card[i].list[j][key] = val;
		},
		//删除规格值
		deleSkuVal(state, {i, j}){
			state.sku_card[i].list.splice(j, 1);
		},
		//拖拽排序规格值
		sortSkuVal(state, {i, list}){
			store.sku_card[i].list = list;
		}
  },
  actions: {

  }
}