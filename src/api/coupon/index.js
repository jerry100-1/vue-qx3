import { Request } from '../../common/request.js'

// 获取用户优惠券列表
const getCoupon = obj => Request('Fortune/User/getCoupon', 'GET', obj)

export default {
  getCoupon
}
