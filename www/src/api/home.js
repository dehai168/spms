import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function userinfo(params) {
  return request({
    url: '/police/login/user?token=' + getToken(),
    method: 'get',
    params
  })
}
