import { Request } from '../../common/request.js'

// 新增用户档案
const addRecord = obj => Request('Fortune/User/addRecord', 'POST', obj)

// 更新用户档案
const updateRecord = obj => Request('Fortune/User/updateRecord', 'POST', obj)

// 删除用户档案
const delRecord = obj => Request('Fortune/User/delRecord', 'POST', obj)

// 获取用户档案
const getUserRecord = obj => Request('Fortune/User/getUserRecord', 'GET', obj)

export default {
  addRecord,
  updateRecord,
  delRecord,
  getUserRecord
}
