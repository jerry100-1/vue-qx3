import { Request } from '../../common/request.js'

// 获取塔罗牌报告列表
const fetchTaluopaiOrderList = obj => Request('Fortune/User/fetchTaluopaiOrderList', 'GET', obj)

// 删除塔罗牌报告
const deleteTaluopaiOrder = obj => Request('Fortune/User/deleteTaluopaiOrder', 'POST', obj)

export default {
  fetchTaluopaiOrderList,
  deleteTaluopaiOrder
}
