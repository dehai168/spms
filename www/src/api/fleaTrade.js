import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function exist(params) {
  return request({
    url: '/fleatrade/exist',
    method: 'get',
    params
  })
}
export function items(params) {
  return request({
    url: '/fleatrade',
    method: 'get',
    params
  })
}
export function list(params) {
  return request({
    url: '/fleatrade/list',
    method: 'get',
    params
  })
}
export function item(params) {
  return request({
    url: '/fleatrade/id/' + params.keyid,
    method: 'get',
    params
  })
}
export function create(data) {
  return request({
    url: '/fleatrade',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/fleatrade/' + data.keyid,
    method: 'put',
    data
  })
}
export function remove(data) {
  return request({
    url: '/fleatrade/' + data.keyid,
    method: 'delete',
    data
  })
}
export function batchremove(data) {
  return request({
    url: '/fleatrade/batchremove',
    method: 'delete',
    data
  })
}
export function changestatus(params) {
  return request({
    url: '/fleatrade/changestatus',
    method: 'get',
    params
  })
}
export function exportexcel(params) {
  return request({
    url: '/fleatrade/exportexcel',
    method: 'get',
    params
  })
}
export function importexcel(params) {
  return request({
    url: '/fleatrade/importexcel',
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
