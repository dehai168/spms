import request from '@/utils/request'

export function exist(params) {
  return request({
    url: '/table/exist',
    method: 'get',
    params
  })
}
export function items(params) {
  return request({
    url: '/table',
    method: 'get',
    params
  })
}
export function list(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
export function item(params) {
  return request({
    url: '/table/id/' + params.keyid,
    method: 'get',
    params
  })
}
export function create(data) {
  return request({
    url: '/table',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/table/' + data.keyid,
    method: 'put',
    data
  })
}
export function remove(data) {
  return request({
    url: '/table/' + data.keyid,
    method: 'delete',
    data
  })
}
export function batchremove(data) {
  return request({
    url: '/table/batchremove',
    method: 'delete',
    data
  })
}
export function changestatus(params) {
  return request({
    url: '/table/changestatus',
    method: 'get',
    params
  })
}
export function exportexcel(params) {
  return request({
    url: '/table/exportexcel',
    method: 'get',
    params
  })
}
export function importexcel(params) {
  return request({
    url: '/table/importexcel',
    method: 'get',
    params
  })
}
export function templeteUrl() {
  return process.env.VUE_APP_BASE_API + '/file/download?type=template&name=vehicle.xlsx'
}
export function uploadUrl() {
  return process.env.VUE_APP_BASE_API + '/file/upload?type=temp'
}
export function download(filename) {
  window.open(process.env.VUE_APP_BASE_API + '/file/download?type=temp&name=' + filename + '')
}