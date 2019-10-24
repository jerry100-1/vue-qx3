import { Request } from '../../common/request.js'

// 运势首页
const getFortuneIndexData = obj => Request('Fortune/Index/index', 'GET', obj)
// 测算产品列表
const fetchProductList = obj => Request('Fortune/Index/fetchProductList', 'GET', obj)
// 订单弹窗消息列表
const fetchDialogOrder = obj => Request('Fortune/Index/fetchDialogOrder', 'GET', obj)

export default {
  getFortuneIndexData,
  fetchProductList,
  fetchDialogOrder
}
