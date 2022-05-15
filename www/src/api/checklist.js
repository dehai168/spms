import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function items(data) {
  return request({
    url: '/police/enterprise/checklist/list?index=' + data.pageindex + '&size=' + data.pagesize + '&token=' + getToken(),
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/police/enterprise/checklist/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/enterprise/checklist/update?token=' + getToken(),
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/enterprise/checklist/delete?checkid=' + params.checkid + '&token=' + getToken(),
    method: 'get',
    params
  })
}