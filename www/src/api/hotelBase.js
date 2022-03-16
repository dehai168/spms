import request from '@/utils/request'

export function items(params) {
  const { pagesize: size, pageindex: index, ...data } = params;
  return request({
    url: '/police/hotel/list',
    method: 'post',
    params: {
      size,
      index
    },
    data
  })
}
export function create(data) {
  return request({
    url: '/police/hotel/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/hotel/update',
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/hotel/delete',
    method: 'get',
    params
  })
}
