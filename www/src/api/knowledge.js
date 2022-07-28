import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'
export function items(data) {
  return request({
    url: '/police/knowledge/list?index=' + data.pageindex + '&size=' + data.pagesize,
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/police/knowledge/add?',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/police/knowledge/update?',
    method: 'post',
    data
  })
}
export function remove(params) {
  return request({
    url: '/police/knowledge/delete?knowledgeid=' + params.knowledgeid,
    method: 'get',
    params
  })
}
export function publish(query) {
  return request({
    url: toQueryString(`/police/knowledge/public`, {
      ...query,
    }),
    method: 'get',
  })
}


export function uploadUrl() {
  return '/police/upload/file?'
}
export function download(filename) {
  //window.open(window.origin + filename)
  //window.location.href = window.origin + filename
  fetch(window.origin + filename).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '' // 下载文件的名字
    document.body.appendChild(a)
    a.click()
  })
}