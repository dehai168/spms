import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function exist(params) {
  return request({
    url: '/vehiclerepair/exist',
    method: 'get',
    params
  })
}
export function items(params) {
  return request({
    url: '/vehiclerepair',
    method: 'get',
    params
  })
}
export function list(params) {
  return request({
    url: '/vehiclerepair/list',
    method: 'get',
    params
  })
}
export function item(params) {
  return request({
    url: '/vehiclerepair/id/' + params.keyid,
    method: 'get',
    params
  })
}
export function create(data) {
  return request({
    url: '/vehiclerepair',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/vehiclerepair/' + data.keyid,
    method: 'put',
    data
  })
}
export function remove(data) {
  return request({
    url: '/vehiclerepair/' + data.keyid,
    method: 'delete',
    data
  })
}
export function batchremove(data) {
  return request({
    url: '/vehiclerepair/batchremove',
    method: 'delete',
    data
  })
}
export function changestatus(params) {
  return request({
    url: '/vehiclerepair/changestatus',
    method: 'get',
    params
  })
}
export function exportexcel(params) {
  return request({
    url: '/vehiclerepair/exportexcel',
    method: 'get',
    params
  })
}
export function importexcel(params) {
  return request({
    url: '/vehiclerepair/importexcel',
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
