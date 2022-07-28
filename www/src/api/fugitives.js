import request from '@/utils/request'


export function items(data) {
  return request({
    url: '/police/escapee/list?index=' + data.pageindex + '&size=' + data.pagesize,
    method: 'post',
    data
  })
}
