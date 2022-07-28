import request from '@/utils/request'

export function exist(params) {
  return request({
    url: '/police/important/fence/exist',
    method: 'get',
    params
  })
}
export function items(data) {
  return request({
    url: '/police/important/fence/list?index=' + data.index + '&size=' + data.size,
    method: 'post',
    data
  })
}
export function item(params) {
  return request({
    url: '/police/important/fence/id/' + params.keyid,
    method: 'get',
    params
  })
}
export function create(data) {
  return request({
    url: '/police/important/fence/add',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/important/fence/update',
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/important/fence/delete',
    method: 'get',
    params
  })
}
export function batchremove(data) {
  return request({
    url: '/police/important/fence/batchremove',
    method: 'delete',
    data
  })
}
export function changestatus(params) {
  return request({
    url: '/police/important/fence/changestatus',
    method: 'get',
    params
  })
}
export function exportexcel(params) {
  return request({
    url: '/police/important/fence/exportexcel',
    method: 'get',
    params
  })
}
export function importexcel(params) {
  return request({
    url: '/police/important/fence/importexcel',
    method: 'get',
    params
  })
}
export function templeteUrl() {
  return process.env.VUE_APP_BASE_API + '/file/download?type=template&name=vehicle.xlsx&token='
}
export function uploadUrl() {
  return process.env.VUE_APP_BASE_API + '/file/upload?type=temp'
}
export function download(filename) {
  window.open(process.env.VUE_APP_BASE_API + '/file/download?type=temp&name=' + filename)
}