import request from '@/utils/request'

export function items(data) {
  return request({
    url: '/police/enterprise/checklist/list?index=' + data.pageindex + '&size=' + data.pagesize,
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/police/enterprise/checklist/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/enterprise/checklist/update',
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/enterprise/checklist/delete?checkid=' + params.checkid,
    method: 'get',
    params
  })
}