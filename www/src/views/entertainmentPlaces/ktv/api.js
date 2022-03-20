import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/ktv/list`,query),data),
    add: (data = {}) => request.post('/police/ktv/add',data),
    update: (data = {}) => request.post('/police/ktv/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/ktv/delete',query)),
}