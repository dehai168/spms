import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.post(toQueryString(`/police/employee/abroad/list`,query),data),
    add: (data = {}) => request.post('/police/employee/abroad/add',data),
    update: (data = {}) => request.post('/police/employee/abroad/update',data),
    delete: (query = {}) => request.get(toQueryString('/police/employee/abroad/delete',query)),
}