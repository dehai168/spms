import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/bar/list`,query),data),
    add: (data = {}) => request.post('/police/bar/add',data),
    update: (data = {}) => request.post('/police/bar/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/bar/delete',query)),
}