import { Request } from '../../common/request.js'

// 大师入驻
const saveGreatMaster = obj => Request('Fortune/User/saveGreatMaster', 'POST', obj)

export default {
  saveGreatMaster
}
