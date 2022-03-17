import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/domesticemployee/list`,query),data),
    add: (data = {}) => request.post('/police/domesticemployee/add',data),
    update: (data = {}) => request.post('/police/domesticemployee/update',data),
    delete: (data = {}) => request.post('/police/domesticemployee/delete',data),
}