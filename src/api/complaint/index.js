import { Request } from '../../common/request.js'

// 获取投诉list
const getComplaintList  = obj => Request('Common/Common/getDicInfoByKey', 'GET', obj)
// 投诉
const complaint  = obj => Request('Fortune/Complaints/save', 'POST', obj)

export default {
  getComplaintList,
  complaint
}
