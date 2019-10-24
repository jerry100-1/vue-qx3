import { Request } from '../../common/request.js'

// 获取运势报告列表
const fetchFortuneOrderList = obj => Request('Fortune/User/fetchFortuneOrderList', 'GET', obj)

// 删除运势报告
const deleteFortuneOrder = obj => Request('Fortune/User/deleteFortuneOrder', 'POST', obj)

export default {
  fetchFortuneOrderList,
  deleteFortuneOrder
}
