import request from '@/utils/request'

export function items(params) {
  const { pagesize: size, pageindex: index, ...data } = params;
  return request({
    url: '/police/enterprise/black/list',
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
    url: '/police/enterprise/black/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/enterprise/black/update',
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/enterprise/black/delete',
    method: 'get',
    params
  })
}
