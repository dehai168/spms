import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/print/list`,query),data),
    add: (data = {}) => request.post('/police/print/add',data),
    update: (data = {}) => request.post('/police/print/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/print/delete',query)),
}