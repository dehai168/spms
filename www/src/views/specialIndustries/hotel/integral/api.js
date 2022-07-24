import request from '@/utils/request'
import toQueryString from '@/utils/toQueryString'

export default {
    list: (query = {},data = {}) => request.get(toQueryString(`/police/enterprise/integral/list`,query)),
}