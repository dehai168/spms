import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function items(data) {
  return request({
    url: '/police/knowledge/list?index=' + data.pageindex + '&size=' + data.pagesize + '&token=' + getToken(),
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/police/knowledge/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/knowledge/update?token=' + getToken(),
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/knowledge/delete?knowledgeid=' + params.knowledgeid + '&token=' + getToken(),
    method: 'get',
    params
  })
}

export function uploadUrl() {
  return '/police/upload/file?token=' + getToken()
}
export function download(filename) {
  window.open('/' + filename)
}
