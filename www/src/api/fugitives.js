import request from '@/utils/request'
import { getToken } from '@/utils/auth'


export function items(data) {
  return request({
    url: '/police/escapee/list?index=' + data.pageindex + '&size=' + data.pagesize + '&token=' + getToken(),
    method: 'post',
    data
  })
}
