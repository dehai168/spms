import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function systemlist(params) {
  return request({
    url: '/police/outline/system/list?token=' + getToken(),
    method: 'get',
    params
  })
}

export function enterpriselist(params) {
  return request({
    url: '/police/outline/enterprise/list?token=' + getToken(),
    method: 'get',
    params
  })
}

export function travellerlist(params) {
  return request({
    url: '/police/outline/traveller/list?token=' + getToken(),
    method: 'get',
    params
  })
}

export function travellerdomesticregion(params) {
  return request({
    url: '/police/outline/traveller/domestic/region?token=' + getToken(),
    method: 'get',
    params
  })
}

export function travellerabroadnationality(params) {
  return request({
    url: '/police/outline/traveller/abroad/nationality?token=' + getToken(),
    method: 'get',
    params
  })
}

export function alarmlist(params) {
  return request({
    url: '/police/outline/alarm/list?token=' + getToken(),
    method: 'get',
    params
  })
}

export function importantlist(params) {
  return request({
    url: '/police/outline/important/list?token=' + getToken(),
    method: 'get',
    params
  })
}

export function systemlog(data) {
  return request({
    url: '/police/systemlog/list?token='+getToken(),
    method: 'post',
    data
  })
}

export function userlog(data) {
  return request({
    url: '/police/log/list?token='+getToken(),
    method: 'post',
    data
  })
}

export function downloadUserLog(params) {
  return request({
    url: '/police/log/download?token='+getToken(),
    method: 'get',
    params
  })
}

export function downloadSystemLog(params) {
  return request({
    url: '/police/systemlog/download?token='+getToken(),
    method: 'get',
    params
  })
}