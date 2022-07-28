import request from '@/utils/request'

export function systemlist(params) {
  return request({
    url: '/police/outline/system/list',
    method: 'get',
    params
  })
}

export function enterpriselist(params) {
  return request({
    url: '/police/outline/enterprise/list',
    method: 'get',
    params
  })
}

export function travellerlist(params) {
  return request({
    url: '/police/outline/traveller/list',
    method: 'get',
    params
  })
}

export function travellerdomesticregion(params) {
  return request({
    url: '/police/outline/traveller/domestic/region',
    params
  })
}

export function travellerabroadnationality(params) {
  return request({
    url: '/police/outline/traveller/abroad/nationality',
    method: 'get',
    params
  })
}

export function alarmlist(params) {
  return request({
    url: '/police/outline/alarm/list',
    method: 'get',
    params
  })
}

export function importantlist(params) {
  return request({
    url: '/police/outline/important/list',
    method: 'get',
    params
  })
}

export function systemlog(data) {
  return request({
    url: '/police/systemlog/list',
    method: 'post',
    data
  })
}

export function userlog(data) {
  return request({
    url: '/police/log/list',
    method: 'post',
    data
  })
}

export function downloadUserLog(params) {
  return request({
    url: '/police/log/download',
    method: 'get',
    params
  })
}

export function downloadSystemLog(params) {
  return request({
    url: '/police/systemlog/download',
    method: 'get',
    params
  })
}