import request from '@/utils/request'



export function items(params) {
  return request({
    url: '/overseas',
    method: 'get',
    params
  })
}

export function item(params) {
  return request({
    url: '/overseas/id/' + params.keyid,
    method: 'get',
    params
  })
}
