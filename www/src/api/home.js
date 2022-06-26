import request from '@/utils/request'
import { getToken } from '@/utils/auth'

export function position(params) {
    return request({
        url: '/police/enterprise/position?token=' + getToken(),
        method: 'post',
        params
    })
}
export function detail(params) {
    return request({
        url: '/police/enterprise/detail?token=' + getToken(),
        method: 'get',
        params
    })
}
export function list(params) {
    return request({
        url: '/police/enterprise/list?token=' + getToken(),
        method: 'get',
        params
    })
}
export function devicelist(params) {
    return request({
        url: '/police/device/list?token=' + getToken(),
        method: 'get',
        params
    })
}
export function devicelist_yt(params) {
    return request({
        url: '/police/yt/device/list?token=' + getToken(),
        method: 'get',
        params
    })
}
export function imagelist_yt(params) {
    return request({
        url: '/police/yt/images/list?token=' + getToken(),
        method: 'get',
        params
    })
}