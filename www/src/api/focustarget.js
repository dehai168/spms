import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function exist(params) {
  return request({
    url: '/police/important/interest/exist',
    method: 'get',
    params
  })
}
export function items(data) {
  return request({
    url: '/police/important/interest/list?index=' + data.pageindex + '&size=' + data.pagesize + '&token=' + getToken(),
    method: 'post',
    data
  })
}
export function list(params) {
  return request({
    url: '/police/important/interest/list',
    method: 'get',
    params
  })
}
export function item(params) {
  return request({
    url: '/police/important/interest/id/' + params.keyid,
    method: 'get',
    params
  })
}
export function create(data) {
  return request({
    url: '/police/important/interest/add?token=' + getToken(),
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/important/interest/update?token=' + getToken(),
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/important/interest/delete?token=' + getToken(),
    method: 'get',
    params
  })
}
export function batchremove(data) {
  return request({
    url: '/police/important/interest/batchremove',
    method: 'delete',
    data
  })
}
export function changestatus(params) {
  return request({
    url: '/police/important/interest/changestatus',
    method: 'get',
    params
  })
}
export function exportexcel(params) {
  return request({
    url: '/police/important/interest/exportexcel',
    method: 'get',
    params
  })
}
export function importexcel(params) {
  return request({
    url: '/police/important/interest/importexcel',
    method: 'get',
    params
  })
}
export function templeteUrl() {
  return process.env.VUE_APP_BASE_API + '/file/download?type=template&name=vehicle.xlsx&token=' + getToken()
}
export function uploadUrl() {
  return process.env.VUE_APP_BASE_API + '/file/upload?type=temp'
}
export function download(filename) {
  window.open(process.env.VUE_APP_BASE_API + '/file/download?type=temp&name=' + filename + '&token=' + getToken())
}
