const Mock = require('mockjs')

module.exports = [{
    url: '/auth/authcode',
    type: 'get',
    response: config => {
        return {
            code: 20000,
            data: "i am authcode image"
        }
    }
},
{
    url: '/auth/login',
    type: 'post',
    response: config => {
        return {
            code: 20000,
            data: {
                result: 'abc123',
                error: 0
            }
        }
    }
},
{
    url: '/auth/logout',
    type: 'get',
    response: config => {
        return {
            code: 20000,
            data: true
        }
    }
},
]