import request from '@/utils/request'
import { getToken } from '@/utils/auth'


export function items(params) {
  return request({
    url: '/domestic',
    method: 'get',
    params
  })
}

export function item(params) {
  return request({
    url: '/domestic/id/' + params.keyid,
    method: 'get',
    params
  })
}
