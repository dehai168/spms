import request from '@/utils/request'

export function items(params) {
  const { pagesize: size, pageindex: index, ...data } = params;
  return request({
    url: '/police/scrapmetal/list',
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
    url: '/police/scrapmetal/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/scrapmetal/update',
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/scrapmetal/delete',
    method: 'get',
    params
  })
}
