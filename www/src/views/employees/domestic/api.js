import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/employee/domestic/list`,query),data),
    add: (data = {}) => request.post('/police/employee/domestic/add',data),
    update: (data = {}) => request.post('/police/employee/domestic/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/employee/domestic/delete',query)),
}