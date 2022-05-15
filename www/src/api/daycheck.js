import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function items(data) {
  return request({
    url: '/police/enterprise/dailycheck/list?index=' + data.pageindex + '&size=' + data.pagesize + '&token=' + getToken(),
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/police/enterprise/dailycheck/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/enterprise/dailycheck/update?token=' + getToken(),
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/enterprise/dailycheck/delete?checkid=' + params.daily_check_id + '&token=' + getToken(),
    method: 'get',
    params
  })
}
export function searchlist(params) {
  return request({
    url: '/police/enterprise/search/list?token=' + getToken(),
    method: 'get',
    params
  })
}

export function checkItems(data) {
  return request({
    url: '/police/enterprise/checklist/list?index=' + data.pageindex + '&size=' + data.pagesize + '&token=' + getToken(),
    method: 'post',
    data
  })
}
