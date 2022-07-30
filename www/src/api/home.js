import request from '@/utils/request'

export function position(params) {
    return request({
        url: '/police/enterprise/position',
        method: 'post',
        params
    })
}
export function detail(params) {
    return request({
        url: '/police/enterprise/detail',
        method: 'get',
        params
    })
}
export function list(params) {
    return request({
        url: '/police/enterprise/list',
        method: 'get',
        params
    })
}
export function devicelist(params) {
    return request({
        url: '/police/device/list',
        method: 'get',
        params
    })
}
export function devicelist_yt(params) {
    return request({
        url: '/police/yt/device/list',
        method: 'get',
        params
    })
}
export function imagelist_yt(params) {
    return request({
        url: '/police/yt/images/list',
        method: 'get',
        params
    })
}
export function userinfo(params) {
    return request({
        url: '/police/login/user',
        method: 'get',
        params
    })
}
export function userlogout(params) {
    return request({
        url: '/police/logout/user',
        method: 'get',
        params
    })
}