import request from '@/utils/request'

export function items(data) {
  return request({
    url: '/police/enterprise/dailycheck/list?index=' + data.pageindex + '&size=' + data.pagesize,
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/police/enterprise/dailycheck/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/enterprise/dailycheck/update',
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/enterprise/dailycheck/delete?checkid=' + params.daily_check_id,
    method: 'get',
    params
  })
}
export function searchlist(params) {
  return request({
    url: '/police/enterprise/search/list',
    method: 'get',
    params
  })
}

export function checkItems(data) {
  return request({
    url: '/police/enterprise/checklist/list?index=' + data.pageindex + '&size=' + data.pagesize,
    method: 'post',
    data
  })
}